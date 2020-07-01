package gov.nist.hit.hl7.igamt.export.controller;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Types;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import gov.nist.hit.hl7.igamt.coconstraints.exception.CoConstraintGroupNotFoundException;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintTable;
import gov.nist.hit.hl7.igamt.common.base.domain.DocumentStructure;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.Usage;
import gov.nist.hit.hl7.igamt.common.base.service.DocumentStructureService;
import gov.nist.hit.hl7.igamt.common.base.util.RelationShip;
import gov.nist.hit.hl7.igamt.common.exception.IGNotFoundException;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.datatypeLibrary.domain.DatatypeLibrary;
import gov.nist.hit.hl7.igamt.datatypeLibrary.service.DatatypeLibraryService;
import gov.nist.hit.hl7.igamt.delta.exception.IGDeltaException;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfigurationGlobal;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.DocumentExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.ExportFilterDecision;
import gov.nist.hit.hl7.igamt.export.configuration.service.ExportConfigurationService;
import gov.nist.hit.hl7.igamt.export.domain.ExportedFile;
import gov.nist.hit.hl7.igamt.export.exception.ExportException;
import gov.nist.hit.hl7.igamt.export.service.DlNewExportService;
import gov.nist.hit.hl7.igamt.export.service.IgNewExportService;
import gov.nist.hit.hl7.igamt.export.util.WordUtil;
import gov.nist.hit.hl7.igamt.ig.controller.FormData;
import gov.nist.hit.hl7.igamt.ig.controller.wrappers.ReqId;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.IgDataModel;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.serialization.newImplementation.service.SerializeCoconstraintTableToExcel;

@RestController
public class ExportController {

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
				} else {
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
					if(((Ig) ds).getLastUserConfiguration() != null) {
						ExportConfiguration ec = exportConfigurationService.getExportConfiguration(((Ig) ds).getLastUserConfiguration().getConfigId());
						ExportFilterDecision efc = ((Ig) ds).getLastUserConfiguration().getDecision();
						if(ec != null) {
						exportedFile = igExportService.exportIgDocumentToHtml(username, documentId, ((Ig) ds).getLastUserConfiguration().getDecision(), ((Ig) ds).getLastUserConfiguration().getConfigId());
					} else {
						exportedFile = igExportService.exportIgDocumentToHtml(username, documentId, ((Ig) ds).getLastUserConfiguration().getDecision(), exportConfigurationService.getOriginalConfigWithType(true,Type.IGDOCUMENT).getId());
					}
					}
					else if(exportConfigurationService.getDefaultConfig(true, username) != null) {		
						ExportConfiguration exportConfiguration = exportConfigurationService.getDefaultConfig(true, username);
						exportedFile = igExportService.exportIgDocumentToHtml(username, documentId, null, exportConfiguration.getId());
					} 
					else {
						ExportConfiguration exportConfiguration = exportConfigurationService.getOriginalConfigWithType(true,Type.IGDOCUMENT);
						exportedFile = igExportService.exportIgDocumentToHtml(username, documentId, null, exportConfiguration.getId());

					}					
				} else if(document.toLowerCase().equals("library")) {
					if(((DatatypeLibrary) ds).getLastUserConfiguration() != null) {
						ExportConfiguration ec = exportConfigurationService.getExportConfiguration(((DatatypeLibrary) ds).getLastUserConfiguration().getConfigId());
						ExportFilterDecision efc = ((DatatypeLibrary) ds).getLastUserConfiguration().getDecision();
						if(ec != null) {
						exportedFile = dlNewExportService.exportDlDocumentToHtml(username, documentId, ((DatatypeLibrary) ds).getLastUserConfiguration().getDecision(), ((DatatypeLibrary) ds).getLastUserConfiguration().getConfigId());
					} else {
						exportedFile = dlNewExportService.exportDlDocumentToHtml(username, documentId, ((DatatypeLibrary) ds).getLastUserConfiguration().getDecision(), exportConfigurationService.getOriginalConfigWithType(true,Type.DATATYPELIBRARY).getId());
					}
										}
					else if(exportConfigurationService.getDefaultConfig(true, username) != null) {		
						ExportConfiguration exportConfiguration = exportConfigurationService.getDefaultConfig(true, username);
						exportedFile = dlNewExportService.exportDlDocumentToHtml(username, documentId, null, exportConfiguration.getId());
					} 
					else {
						ExportConfiguration exportConfiguration = exportConfigurationService.getOriginalConfigWithType(true,Type.DATATYPELIBRARY);
						exportedFile = dlNewExportService.exportDlDocumentToHtml(username, documentId, null, exportConfiguration.getId());
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

	@RequestMapping(value = "/api/export/ig/{igId}/quickWord", method = RequestMethod.POST, produces = { "application/json" }, consumes = "application/x-www-form-urlencoded; charset=UTF-8")
	public @ResponseBody void exportIgDocumentWord(@PathVariable("igId") String igId,
			HttpServletResponse response, FormData formData) throws ExportException {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication != null) {
			try {
				String username = authentication.getPrincipal().toString();				
				Ig igDocument = igService.findById(igId);
				ExportedFile exportedFile;
				if(igDocument.getLastUserConfiguration() != null) {
					ExportConfiguration ec = exportConfigurationService.getExportConfiguration(igDocument.getLastUserConfiguration().getConfigId());
					ExportFilterDecision efc = igDocument.getLastUserConfiguration().getDecision();
					if(ec != null) {
					exportedFile = igExportService.exportIgDocumentToHtml(username, igId, igDocument.getLastUserConfiguration().getDecision(), igDocument.getLastUserConfiguration().getConfigId());
				} else {
					exportedFile = igExportService.exportIgDocumentToHtml(username, igId, igDocument.getLastUserConfiguration().getDecision(), exportConfigurationService.getOriginalConfigWithType(true,Type.IGDOCUMENT).getId());
								}
				}
				else if(exportConfigurationService.getDefaultConfig(true, username) != null) {		
					ExportConfiguration exportConfiguration = exportConfigurationService.getDefaultConfig(true, username);
					exportedFile = igExportService.exportIgDocumentToWord(username, igId, null, exportConfiguration.getId());
				} 
				else {
					ExportConfiguration exportConfiguration = ExportConfiguration.getBasicExportConfiguration(false,Type.IGDOCUMENT);
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
				if(dl.getLastUserConfiguration() != null) {
					exportedFile = dlNewExportService.exportDlDocumentToWord(username, dlId, dl.getLastUserConfiguration().getDecision(), dl.getLastUserConfiguration().getConfigId());
				}
				else if(exportConfigurationService.getDefaultConfig(true, username) != null) {		
					ExportConfiguration exportConfiguration = exportConfigurationService.getDefaultConfig(true, username);
					exportedFile = dlNewExportService.exportDlDocumentToWord(username, dlId, null, exportConfiguration.getId());
				} 
				else {
					ExportConfiguration exportConfiguration = ExportConfiguration.getBasicExportConfiguration(false,Type.DATATYPELIBRARY);
					exportedFile = dlNewExportService.exportDlDocumentToWord(username, dlId, null, exportConfiguration.getId());
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

	//	 @RequestMapping(value = "/api/export/ig/{igId}/quickHtml", method = RequestMethod.POST)
	//	  public @ResponseBody void exportCoConstraintsToExcel(@PathVariable("igId") String id,
	//	  		HttpServletResponse response) throws ExportException {
	//		 System.out.println("We inside EXCEL");
	//	  	Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
	//	  	if (authentication != null) {
	//	  		String username = authentication.getPrincipal().toString();
	//	  		ByteArrayOutputStream excelFile = serializeCoconstraintTableToExcel.exportToExcel(null);
	//	  		response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
	//	  		response.setHeader("Content-disposition",
	//	  				"attachment;filename=" + "CoConstraintsExcelFile.xlsx");
	//	  		try {
	//	  			response.getOutputStream().write(excelFile.toByteArray());
	//	  		} catch (IOException e) {
	//	  			throw new ExportException(e, "Error while sending back excel Document with id " + id);
	//	  		}
	//	  	} else {
	//	  		throw new AuthenticationCredentialsNotFoundException("No Authentication ");
	//	  	}
	//	  }

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
				config = exportConfigurationService.getExportConfigurationWithType(configId, Type.IGDOCUMENT);
			} else if(document.toLowerCase().equals("library")) {
				ds = datatypeLibraryService.findById(id);
				config = exportConfigurationService.getExportConfigurationWithType(configId, Type.DATATYPELIBRARY);
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
