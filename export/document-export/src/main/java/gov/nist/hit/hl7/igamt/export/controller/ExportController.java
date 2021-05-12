package gov.nist.hit.hl7.igamt.export.controller;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import gov.nist.hit.hl7.igamt.coconstraints.exception.CoConstraintGroupNotFoundException;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintTable;
import gov.nist.hit.hl7.igamt.common.base.domain.DocumentStructure;
import gov.nist.hit.hl7.igamt.common.base.service.DocumentStructureService;
import gov.nist.hit.hl7.igamt.common.exception.IGNotFoundException;
import gov.nist.hit.hl7.igamt.datatypeLibrary.domain.DatatypeLibrary;
import gov.nist.hit.hl7.igamt.datatypeLibrary.service.DatatypeLibraryService;
import gov.nist.hit.hl7.igamt.delta.exception.IGDeltaException;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfigurationGlobal;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportType;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.DocumentExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.ExportFilterDecision;
import gov.nist.hit.hl7.igamt.export.configuration.service.ExportConfigurationService;
import gov.nist.hit.hl7.igamt.export.domain.ExportedFile;
import gov.nist.hit.hl7.igamt.export.exception.ExportException;
import gov.nist.hit.hl7.igamt.export.service.DlNewExportService;
import gov.nist.hit.hl7.igamt.export.service.IgNewExportService;
import gov.nist.hit.hl7.igamt.ig.controller.FormData;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.domain.verification.IgamtObjectError;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.serialization.newImplementation.service.ExcelImportService;
import gov.nist.hit.hl7.igamt.serialization.newImplementation.service.SerializeCoconstraintTableToExcel;
import gov.nist.hit.hl7.igamt.serialization.newImplementation.service.parser.ParserResults;

@RestController
public class ExportController {
	
	@Autowired
	ExcelImportService excelImportService;

	@Autowired
	DlNewExportService dlNewExportService;

	@Autowired
	IgNewExportService igExportService;

	@Autowired
	IgService igService;

	@Autowired
	DocumentStructureService documentStructureService;

	@Autowired
	ExportConfigurationService exportConfigurationService;

	@Autowired
	SerializeCoconstraintTableToExcel serializeCoconstraintTableToExcel;

	@Autowired
	DatatypeLibraryService datatypeLibraryService;

	List<String> files = new ArrayList<String>();
	Path source = Paths.get(this.getClass().getResource("/").getPath());
	private final Path rootLocation = Paths.get(source.toAbsolutePath() + "/newFolder/");
//	   private final Path rootLocation = Paths.get("_Path_To_Save_The_File");

	@RequestMapping(value = "/api/export/{document}/{igId}/configuration/{configId}/{format}", method = RequestMethod.POST, produces = { "application/json" }, consumes = "application/x-www-form-urlencoded; charset=UTF-8")
	public @ResponseBody void exportIgDocument(@PathVariable("igId") String igId,
			@PathVariable("configId") String configId,
			@PathVariable("format") String format,
			@PathVariable("document") String document,
		    @RequestParam(required = false) String deltamode,
			HttpServletResponse response, FormData formData) throws ExportException {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication != null) {
			try {
				ExportFilterDecision decision = null;
				DocumentStructure ds = new DocumentStructure();			
				if(document.toLowerCase().equals("ig")) {
					ds = igService.findById(igId);
				} else if(document.toLowerCase().equals("library")) {
					ds = datatypeLibraryService.findById(igId);
				}
				if(formData.getJson() != null) {
					ObjectMapper mapper = new ObjectMapper();
					mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
					decision = mapper.readValue(formData.getJson(), ExportFilterDecision.class);
					System.out.println("sdsdsdsd : "+decision.getOveriddedSegmentMap().toString() );
				} else {
					System.out.println("form data was null");

					ExportConfiguration exportConfiguration = exportConfigurationService.getExportConfiguration(configId);
					decision = igExportService.getExportFilterDecision(ds, exportConfiguration);
				}

				//Save lastUserConfiguration For quickHtmlExport
				DocumentExportConfiguration lastUserConfiguration = new DocumentExportConfiguration();
				lastUserConfiguration.setConfigId(configId);
				lastUserConfiguration.setDecision(decision);
				if(document.toLowerCase().equals("ig")) {
					((Ig) ds).setLastUserConfiguration(lastUserConfiguration);
					igService.save(((Ig) ds));					
				} else if(document.toLowerCase().equals("library")) {
					((DatatypeLibrary) ds).setLastUserConfiguration(lastUserConfiguration);
					datatypeLibraryService.save((DatatypeLibrary) ds);
				}

				String username = authentication.getPrincipal().toString();				
				if(format.toLowerCase().equals("html")) {
					ExportedFile exportedFile = null;
					if(ds instanceof Ig) {
						exportedFile = igExportService.exportIgDocumentToHtml(username, igId, decision, configId);
					} else if(ds instanceof DatatypeLibrary) {
						exportedFile = dlNewExportService.exportDlDocumentToHtml(username, igId, decision, configId);
					}
					response.setContentType("text/html");
					response.setHeader("Content-disposition",
							"attachment;filename=" + exportedFile.getFileName());
					FileCopyUtils.copy(exportedFile.getContent(), response.getOutputStream());
				}			
				if(format.toLowerCase().equals("word")) {	
					ExportedFile exportedFile = null;
					if(ds instanceof Ig) {
						exportedFile = igExportService.exportIgDocumentToWord(username, igId, decision, configId);
					} else if(ds instanceof DatatypeLibrary) {
						exportedFile = dlNewExportService.exportDlDocumentToWord(username, igId, decision, configId);
					}

					response.setContentType("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
					response.setHeader("Content-disposition",
							"attachment;filename=" + exportedFile.getFileName());
					FileCopyUtils.copy(exportedFile.getContent(), response.getOutputStream());
				}



			} catch (Exception e) {
				e.printStackTrace();
				throw new ExportException(e, "Error while sending back exported IG Document with id " + igId);
			}
		} else {
			throw new AuthenticationCredentialsNotFoundException("No Authentication");
		}
	}
	
	@RequestMapping(value = "/api/export/{document}/{documentId}/getLastUserConfiguration", method = RequestMethod.GET, produces = { "application/json" })
	public @ResponseBody ExportConfigurationGlobal getLastUserConfiguration(@PathVariable("documentId") String documentId,
			@PathVariable("document") String document,
			HttpServletResponse response,
			FormData formData) throws ExportException {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication != null) {
			try {
				String username = authentication.getPrincipal().toString();
				DocumentStructure ds = new DocumentStructure();
				ExportConfigurationGlobal exportConfigurationGlobal = new ExportConfigurationGlobal();
				if(document.toLowerCase().equals("ig")) {
					System.out.println("We here in IG");
					ds = igService.findById(documentId);
					ExportConfiguration ec = exportConfigurationService.getExportConfiguration(((Ig) ds).getLastUserConfiguration().getConfigId());
					ExportFilterDecision efc = ((Ig) ds).getLastUserConfiguration().getDecision();
					exportConfigurationGlobal.setExportConfiguration(ec);
					exportConfigurationGlobal.setExportFilterDecision(efc);
				} else if(document.toLowerCase().equals("library")) {
					System.out.println("We here in DTL");

					ds = datatypeLibraryService.findById(documentId);
					ExportConfiguration ec = exportConfigurationService.getExportConfiguration(((DatatypeLibrary) ds).getLastUserConfiguration().getConfigId());
					ExportFilterDecision efc = ((DatatypeLibrary) ds).getLastUserConfiguration().getDecision();
					exportConfigurationGlobal.setExportConfiguration(ec);
					exportConfigurationGlobal.setExportFilterDecision(efc);
				}
				return exportConfigurationGlobal;
			}catch (Exception e) {
				throw new ExportException(e, "Error while sending back last user configuration for Document with id " + documentId);
			}
		} else {
			throw new AuthenticationCredentialsNotFoundException("No Authentication");
		}
	}

				
	@RequestMapping(value = "/api/export/{document}/{documentId}/quickHtml", method = RequestMethod.POST, produces = { "application/json" }, consumes = "application/x-www-form-urlencoded; charset=UTF-8")
	public @ResponseBody void exportIgDocumentHtml(@PathVariable("documentId") String documentId,
			@PathVariable("document") String document,
			HttpServletResponse response,
			FormData formData) throws ExportException {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication != null) {
			try {
				String username = authentication.getPrincipal().toString();
				DocumentStructure ds = new DocumentStructure();			
				if(document.toLowerCase().equals("ig")) {
					ds = igService.findById(documentId);
				} else if(document.toLowerCase().equals("library")) {
					ds = datatypeLibraryService.findById(documentId);
				}
				ExportedFile exportedFile= null;			    
				if(document.toLowerCase().equals("ig")) {
//					if(((Ig) ds).getLastUserConfiguration() != null) {
//						ExportConfiguration ec = exportConfigurationService.getExportConfiguration(((Ig) ds).getLastUserConfiguration().getConfigId());
//						ExportFilterDecision efc = ((Ig) ds).getLastUserConfiguration().getDecision();
//						if(ec != null) {
//						exportedFile = igExportService.exportIgDocumentToHtml(username, documentId, ((Ig) ds).getLastUserConfiguration().getDecision(), ((Ig) ds).getLastUserConfiguration().getConfigId());
//					} else {
//						exportedFile = igExportService.exportIgDocumentToHtml(username, documentId, ((Ig) ds).getLastUserConfiguration().getDecision(), exportConfigurationService.getOriginalConfigWithType(true,Type.IGDOCUMENT).getId());
//					}
//					}
//					else

						if(exportConfigurationService.getDefaultConfig(true, username) != null) {		
						ExportConfiguration exportConfiguration = exportConfigurationService.getDefaultConfig(true, username);
						ExportFilterDecision decision = igExportService.getExportFilterDecision(ds, exportConfiguration);
						exportedFile = igExportService.exportIgDocumentToHtml(username, documentId, decision, exportConfiguration.getId());
					} 
					else {
						ExportConfiguration exportConfiguration = exportConfigurationService.getOriginalConfigWithType(true,ExportType.IGDOCUMENT);
						ExportFilterDecision decision = igExportService.getExportFilterDecision(ds, exportConfiguration);
						exportedFile = igExportService.exportIgDocumentToHtml(username, documentId, decision, exportConfiguration.getId());

					}					
				} else if(document.toLowerCase().equals("library")) {
//					if(((DatatypeLibrary) ds).getLastUserConfiguration() != null) {
//						ExportConfiguration ec = exportConfigurationService.getExportConfiguration(((DatatypeLibrary) ds).getLastUserConfiguration().getConfigId());
//						ExportFilterDecision efc = ((DatatypeLibrary) ds).getLastUserConfiguration().getDecision();
//						if(ec != null) {
//						exportedFile = dlNewExportService.exportDlDocumentToHtml(username, documentId, ((DatatypeLibrary) ds).getLastUserConfiguration().getDecision(), ((DatatypeLibrary) ds).getLastUserConfiguration().getConfigId());
//					} else {
//						exportedFile = dlNewExportService.exportDlDocumentToHtml(username, documentId, ((DatatypeLibrary) ds).getLastUserConfiguration().getDecision(), exportConfigurationService.getOriginalConfigWithType(true,Type.DATATYPELIBRARY).getId());
//					}
//										}
//					else 
						if(exportConfigurationService.getDefaultConfig(true, username) != null) {		
						ExportConfiguration exportConfiguration = exportConfigurationService.getDefaultConfig(true, username);
						ExportFilterDecision exportFilterDecision = igExportService.getExportFilterDecision(ds, exportConfiguration);
						exportedFile = dlNewExportService.exportDlDocumentToHtml(username, documentId, exportFilterDecision, exportConfiguration.getId());
					} 
					else {
						ExportConfiguration exportConfiguration = exportConfigurationService.getOriginalConfigWithType(true,ExportType.DATATYPELIBRARY);
						ExportFilterDecision exportFilterDecision = igExportService.getExportFilterDecision(ds, exportConfiguration);
						exportedFile = dlNewExportService.exportDlDocumentToHtml(username, documentId, exportFilterDecision, exportConfiguration.getId());
					}
				}
				response.setContentType("text/html");
				response.setHeader("Content-disposition",
						"attachment;filename=" + exportedFile.getFileName());
				FileCopyUtils.copy(exportedFile.getContent(), response.getOutputStream());		
			} catch (Exception e) {
				throw new ExportException(e, "Error while sending back exported  Document with id " + documentId);
			}
		} else {
			throw new AuthenticationCredentialsNotFoundException("No Authentication");
		}
	}

	@RequestMapping(value = "/api/export/coconstraintTable", method = RequestMethod.POST, produces = { "application/json" }, consumes = "application/x-www-form-urlencoded; charset=UTF-8")
	public @ResponseBody void exportCoconstraintTable(FormData formData, HttpServletResponse response) throws ExportException, JsonParseException, JsonMappingException, IOException {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if(formData.getJson() != null) {
			ObjectMapper mapper = new ObjectMapper();
			mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
			CoConstraintTable coConstraintTable = mapper.readValue(formData.getJson(), CoConstraintTable.class);
			if (authentication != null) {
				String username = authentication.getPrincipal().toString();
				ByteArrayOutputStream excelFile = serializeCoconstraintTableToExcel.exportToExcel(coConstraintTable);
				response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
				response.setHeader("Content-disposition",
						"attachment;filename=" + "CoConstraintsExcelFile.xlsx");
				try {
					response.getOutputStream().write(excelFile.toByteArray());
				} catch (IOException e) {
					throw new ExportException(e, "Error while sending back excel Document for coconstraintTable with id " + coConstraintTable.getId());
				}
			} else {
				throw new AuthenticationCredentialsNotFoundException("No Authentication ");
			}
		}

	}
	
//	@RequestMapping(value = "/api/import/coconstraintTable", method = RequestMethod.POST, consumes = "application/x-www-form-urlencoded; charset=UTF-8")
//	public @ResponseBody void importCoconstraintTable(FormData formData, HttpServletResponse response) throws ExportException, JsonParseException, JsonMappingException, IOException {
//		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//		System.out.println("BEfore IF");
//		if(formData.getJson() != null) {
//			System.out.println("formDATA not null");
//			ObjectMapper mapper = new ObjectMapper();
//			mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
//			CoConstraintTable coConstraintTable = mapper.readValue(formData.getJson(), CoConstraintTable.class);
//			if (authentication != null) {
//				String username = authentication.getPrincipal().toString();
//				ByteArrayOutputStream excelFile = serializeCoconstraintTableToExcel.exportToExcel(coConstraintTable);
//				response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
//				response.setHeader("Content-disposition",
//						"attachment;filename=" + "CoConstraintsExcelFile.xlsx");
//				try {
//					response.getOutputStream().write(excelFile.toByteArray());
//				} catch (IOException e) {
//					throw new ExportException(e, "Error while sending back excel Document for coconstraintTable with id " + coConstraintTable.getId());
//				}
//			} else {
//				throw new AuthenticationCredentialsNotFoundException("No Authentication ");
//			}
//		} else {
//			System.out.println("formDATA GRAVE null");
//
//		}
//
//	}

	@RequestMapping(value="/api/import/coconstraintTable", method=RequestMethod.POST, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	@ResponseBody
	   public ParserResults handleFileUpload(@RequestPart("file") MultipartFile file,
			   @RequestParam("segmentID") String segmentID,
			   @RequestParam("conformanceProfileID") String conformanceProfileID,
			   @RequestParam("igID") String igID,
			   @RequestParam("pathID") String pathID) throws IOException{
	      String message;
	      System.out.println("file name : " + 	        	 segmentID);
	      System.out.println("file name : " + 	        	 conformanceProfileID);
	      System.out.println("file name : " + 	        	 igID);
	      
	      InputStream stream = file.getInputStream();
	      try {
	    	  ParserResults parserResults = excelImportService.readFromExcel(stream, segmentID, conformanceProfileID, igID, pathID );
//			return new ResponseMessage(Status.SUCCESS, "Table imported succesfully", conformanceProfileID, parserResults, new Date());
	    	  Optional<IgamtObjectError> match =  parserResults.getVerificationResult().getErrors().stream().filter((error) ->
	    	  { 
	    		  return error.getSeverity().equals("ERROR");
	    	
	    	  }).findFirst();
				if(match.isPresent()) {
					parserResults.setCoConstraintTable(null);
					}
				
				
				

	    	  return parserResults;
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
//			return new ResponseMessage(Status.FAILED, e.getLocalizedMessage(), conformanceProfileID,  new Date());
			return null;
		}
	   }

	@RequestMapping(value = "/api/export/ig/{igId}/quickWord", method = RequestMethod.POST, produces = { "application/json" }, consumes = "application/x-www-form-urlencoded; charset=UTF-8")
	public @ResponseBody void exportIgDocumentWord(@PathVariable("igId") String igId,
			HttpServletResponse response, FormData formData) throws ExportException {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication != null) {
			try {
				String username = authentication.getPrincipal().toString();				
				Ig igDocument = igService.findById(igId);
				ExportedFile exportedFile;
//				if(igDocument.getLastUserConfiguration() != null) {
//					ExportConfiguration ec = exportConfigurationService.getExportConfiguration(igDocument.getLastUserConfiguration().getConfigId());
//					ExportFilterDecision efc = igDocument.getLastUserConfiguration().getDecision();
//					if(ec != null) {
//					exportedFile = igExportService.exportIgDocumentToWord(username, igId, igDocument.getLastUserConfiguration().getDecision(), igDocument.getLastUserConfiguration().getConfigId());
//				} else {
//					exportedFile = igExportService.exportIgDocumentToWord(username, igId, igDocument.getLastUserConfiguration().getDecision(), exportConfigurationService.getOriginalConfigWithType(true,Type.IGDOCUMENT).getId());
//								}
//				}
//				else
					if(exportConfigurationService.getDefaultConfig(true, username) != null) {	
					// erasing after compile ok
					// adding compiled jars for upcoing modification
					ExportConfiguration exportConfiguration = exportConfigurationService.getDefaultConfig(true, username);
					System.out.println("ADFDSFDSF");
					exportedFile = igExportService.exportIgDocumentToWord(username, igId, null, exportConfiguration.getId());
				} 
				else {
//					ExportConfiguration exportConfiguration = ExportConfiguration.getBasicExportConfiguration(false,Type.IGDOCUMENT);
					ExportConfiguration exportConfiguration = exportConfigurationService.getOriginalConfigWithType(true,ExportType.IGDOCUMENT);
					System.out.println("ADFDSFDSF");
					exportedFile = igExportService.exportIgDocumentToWord(username, igId, null, exportConfiguration.getId());

				}
				response.setContentType("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
				response.setHeader("Content-disposition",
						"attachment;filename=" + exportedFile.getFileName());
				FileCopyUtils.copy(exportedFile.getContent(), response.getOutputStream());		
			} catch (Exception e) {
				throw new ExportException(e, "Error while sending back exported IG Document with id " + igId);
			}
		} else {
			throw new AuthenticationCredentialsNotFoundException("No Authentication");
		}
	}
	
	@RequestMapping(value = "/api/export/library/{dlId}/quickWord", method = RequestMethod.POST, produces = { "application/json" }, consumes = "application/x-www-form-urlencoded; charset=UTF-8")
	public @ResponseBody void exportDtlDocumentWord(@PathVariable("dlId") String dlId,
			HttpServletResponse response, FormData formData) throws ExportException {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication != null) {
			try {
				String username = authentication.getPrincipal().toString();				
				DatatypeLibrary dl = datatypeLibraryService.findById(dlId);
				ExportedFile exportedFile;
//				if(dl.getLastUserConfiguration() != null) {
//					exportedFile = dlNewExportService.exportDlDocumentToWord(username, dlId, dl.getLastUserConfiguration().getDecision(), dl.getLastUserConfiguration().getConfigId());
//				}
//				else
					if(exportConfigurationService.getDefaultConfig(true, username) != null) {		
					ExportConfiguration exportConfiguration = exportConfigurationService.getDefaultConfig(true, username);
					ExportFilterDecision exportFilterDecision = igExportService.getExportFilterDecision(dl, exportConfiguration);
					exportedFile = dlNewExportService.exportDlDocumentToWord(username, dlId, exportFilterDecision, exportConfiguration.getId());
				} 
				else {
					ExportConfiguration exportConfiguration = exportConfigurationService.getOriginalConfigWithType(true,ExportType.DATATYPELIBRARY);
					ExportFilterDecision exportFilterDecision = igExportService.getExportFilterDecision(dl, exportConfiguration);
					exportedFile = dlNewExportService.exportDlDocumentToWord(username, dlId, exportFilterDecision, exportConfiguration.getId());
				}
				response.setContentType("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
				response.setHeader("Content-disposition",
						"attachment;filename=" + exportedFile.getFileName());
				FileCopyUtils.copy(exportedFile.getContent(), response.getOutputStream());		
			} catch (Exception e) {
				throw new ExportException(e, "Error while sending back exported Datatype Library Document with id " + dlId);
			}
		} else {
			throw new AuthenticationCredentialsNotFoundException("No Authentication");
		}
	}



	@RequestMapping(value = "/api/export/{document}/{id}/configuration/{configId}/getFilteredDocument", method = RequestMethod.GET)
	public @ResponseBody ExportConfigurationGlobal getFilteredDocument(
			@PathVariable("id") String id,
			@PathVariable("configId") String configId,
			@PathVariable("document") String document,
			HttpServletResponse response) throws ExportException, IGNotFoundException, CoConstraintGroupNotFoundException, IGDeltaException {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication != null) {
			ExportConfiguration config = new ExportConfiguration();
			DocumentStructure ds = new DocumentStructure();			
			if(document.toLowerCase().equals("ig")) {
				ds = igService.findById(id);
				config = exportConfigurationService.getExportConfigurationWithType(configId, ExportType.IGDOCUMENT);
			} else if(document.toLowerCase().equals("library")) {
				ds = datatypeLibraryService.findById(id);
				config = exportConfigurationService.getExportConfigurationWithType(configId, ExportType.DATATYPELIBRARY);
			}
			if (ds == null) {
				throw  new IGNotFoundException(id);
			} else {	
				ExportConfigurationGlobal exportConfigurationGlobal = new ExportConfigurationGlobal();
				ExportFilterDecision exportFilterDecision = igExportService.getExportFilterDecision(ds, config);
				exportConfigurationGlobal.setExportConfiguration(config);
				exportConfigurationGlobal.setExportFilterDecision(exportFilterDecision);
				return exportConfigurationGlobal;
			}
		} else {
			throw new AuthenticationCredentialsNotFoundException("No Authentication ");
		}
	}



}
