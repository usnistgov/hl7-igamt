package gov.nist.hit.hl7.igamt.web.app.utility;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import javax.servlet.http.HttpServletResponse;

import gov.nist.hit.hl7.igamt.common.base.exception.ResourceNotFoundException;
import gov.nist.hit.hl7.igamt.export.domain.CoConstraintExcelExportFormData;
import gov.nist.hit.hl7.igamt.export.domain.ExportFormat;
import gov.nist.hit.hl7.igamt.ig.controller.wrappers.ReqId;
import gov.nist.hit.hl7.igamt.service.impl.exception.PathNotFoundException;
import gov.nist.hit.hl7.igamt.web.app.ig.FormData;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
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

import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintBinding;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintBindingSegment;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintTable;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintTableConditionalBinding;
import gov.nist.hit.hl7.igamt.common.base.domain.DocumentStructure;
import gov.nist.hit.hl7.igamt.common.base.service.DocumentStructureService;
import gov.nist.hit.hl7.igamt.common.exception.EntityNotFound;
import gov.nist.hit.hl7.igamt.common.exception.IGNotFoundException;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.datatypeLibrary.domain.DatatypeLibrary;
import gov.nist.hit.hl7.igamt.datatypeLibrary.service.DatatypeLibraryService;
import gov.nist.hit.hl7.igamt.delta.exception.IGDeltaException;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfigurationGlobal;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportDocType;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportType;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.ConformanceProfileExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.ExportFilterDecision;
import gov.nist.hit.hl7.igamt.export.configuration.previous.ExportDecision;
import gov.nist.hit.hl7.igamt.export.configuration.previous.ExportDecisionRepository;
import gov.nist.hit.hl7.igamt.export.configuration.service.ExportConfigurationService;
import gov.nist.hit.hl7.igamt.export.domain.ExportedFile;
import gov.nist.hit.hl7.igamt.export.exception.ExportException;
import gov.nist.hit.hl7.igamt.export.service.DlNewExportService;
import gov.nist.hit.hl7.igamt.export.service.IgNewExportService;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.IgDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.verification.IgamtObjectError;
import gov.nist.hit.hl7.igamt.ig.model.ResourceSkeleton;
import gov.nist.hit.hl7.igamt.ig.service.CoConstraintSerializationHelper;
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
  
  @Autowired
  ExportDecisionRepository exportDecisionRepository;
  
  @Autowired
  ConformanceProfileService conformanceProfileService;
  
  @Autowired
  CoConstraintSerializationHelper coConstraintSerializationHelper;

//  List<String> files = new ArrayList<String>();
//  Path source = Paths.get(this.getClass().getResource("/").getPath());
  
  Path source = new File(getClass()
		  .getResource("/")
		  .getFile()).toPath();

  @RequestMapping(value = "/api/export/ig/{igId}/{format}", method = RequestMethod.POST, produces = { "application/json" }, consumes = "application/x-www-form-urlencoded; charset=UTF-8")
  @PreAuthorize("AccessResource('IGDOCUMENT', #igId, READ)")
  public @ResponseBody void exportIgDocument(@PathVariable("igId") String igId,
      @PathVariable("format") String format,
      @RequestParam(required = false) String deltamode,
      HttpServletResponse response, FormData formData) throws ExportException {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String username = authentication.getPrincipal().toString(); 
    System.out.println("IN controller");
    ExportedFile exportedFile = null;
    try {
      ExportFilterDecision decision = null;
      ExportConfiguration config = null;
      Ig ig = igService.findById(igId);		
      IgDataModel igDataModel = igService.generateDataModel(ig);
//      ig = igDataModel.getModel();
      ExportType type = ExportType.fromString(formData.getDocumentType());
      if(type == null) {
        throw new ExportException("Unspecified Export Type");
      }
      if(formData.getConfig() != null && !formData.getConfig().isEmpty()) {
        config = exportConfigurationService.getExportConfiguration(formData.getConfig());
      } else {
        config = exportConfigurationService.getConfigurationToApply(type, username);
      } 
      if(formData.getJson() != null) {
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        decision = mapper.readValue(formData.getJson(), ExportFilterDecision.class);
        ExportDecision oldDecsision = exportDecisionRepository.findByUsernameAndTypeAndDocumentAndConfig(username, type, ig.getId(), config.getId());
        if(oldDecsision != null) {
          oldDecsision.setDecision(decision);
          exportDecisionRepository.save(oldDecsision);
        }else {
          ExportDecision newDecsion = new ExportDecision(type, ig.getId(), config.getId(), username, decision);
          exportDecisionRepository.insert(newDecsion);
        }
      } else {
        if(config != null) {
        decision = igExportService.getExportFilterDecision(ig, config);
        } else {
          throw new ExportException("Missing Configuration");
        }
      }
      if(format.equalsIgnoreCase(ExportDocType.HTML.toString())) {
        exportedFile = igExportService.exportIgDocumentToHtml(username, igDataModel, decision, config.getId());
        response.setContentType("text/html");
        response.setHeader("Content-disposition",
            "attachment;filename=" + exportedFile.getFileName());
        FileCopyUtils.copy(exportedFile.getContent(), response.getOutputStream());

      }			
      if(format.equalsIgnoreCase(ExportDocType.WORD.toString())) {
        exportedFile = igExportService.exportIgDocumentToWord(username, igDataModel, decision, config.getId());
        List<ByteArrayOutputStream> excelFiles = this.generateExcelFilesForWord(igDataModel,decision,config.getId());
        if(excelFiles.isEmpty()) {
        	response.setContentType("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
            response.setHeader("Content-disposition",
                "attachment;filename=" + exportedFile.getFileName());
            FileCopyUtils.copy(exportedFile.getContent(), response.getOutputStream());

        } else {
        	// Convert ByteArrayOutputStream to imputstreams
      	  List<InputStream> inputExcelFiles= new ArrayList<InputStream>();
      	  for( ByteArrayOutputStream file : excelFiles) {
      				InputStream excelInputStream = new ByteArrayInputStream(file.toByteArray());
      				inputExcelFiles.add(excelInputStream);
      	  }

        	// Zip the files
      	ByteArrayOutputStream baos = createZip(exportedFile.getContent(), inputExcelFiles);
      	InputStream zippedFiles = new ByteArrayInputStream(baos.toByteArray());
      	
        	// Set response
      	response.setContentType("application/zip");   	
      	response.setHeader("Content-disposition", "attachment;filename=exportedWord.zip");
//        response.setHeader("Content-disposition",
//            "attachment;filename=" + exportedFile.getFileName());
        FileCopyUtils.copy(zippedFiles, response.getOutputStream());
        }
        
      }
      FileCopyUtils.copy(exportedFile.getContent(), response.getOutputStream());

    } catch (Exception e) {
      e.printStackTrace();
      throw new ExportException(e, "Error while sending back exported IG Document with id " + igId);
    }
  }

  private List<ByteArrayOutputStream> generateExcelFilesForWord(IgDataModel igDataModel, ExportFilterDecision decision, String configId) throws ResourceNotFoundException, PathNotFoundException {
	  List<ByteArrayOutputStream> excelFiles= new ArrayList<ByteArrayOutputStream>(); 
	  for(String id: decision.getConformanceProfileFilterMap().keySet()) {
		  ConformanceProfile conformanceProfile = conformanceProfileService.findById(id);
	        ResourceSkeleton conformanceProfileSkeleton = this.coConstraintSerializationHelper.getConformanceProfileSkeleton(conformanceProfile.getId());
		  ConformanceProfileExportConfiguration conformanceProfileExportConfiguration = new ConformanceProfileExportConfiguration();
    	  String coConstraintContextId = "";
		  if(decision.getOveriddedConformanceProfileMap().containsKey(id)) {
			  conformanceProfileExportConfiguration = decision.getOveriddedConformanceProfileMap().get(id);
		  } else {
				ExportConfiguration exportConfiguration = exportConfigurationService.getExportConfiguration(configId);
			  conformanceProfileExportConfiguration = exportConfiguration.getConformamceProfileExportConfiguration();
		  }
	      if (conformanceProfile.getCoConstraintsBindings() != null) {
	          for (CoConstraintBinding coConstraintBinding : conformanceProfile.getCoConstraintsBindings()) {
	              if (coConstraintBinding != null) {
	            	  String coConstraintContext = "";
//                      if(coConstraintBinding.getContext() == null || Strings.isNullOrEmpty(coConstraintBinding.getContext().getPathId())) {
//                          coConstraintContext = conformanceProfileSkeleton.get().getResource().getVariableName();
//                      } else {
//                          ResourceSkeletonBone context = this.coConstraintSerializationHelper.getStructureElementRef(conformanceProfileSkeleton, coConstraintBinding.getContext());
//                          coConstraintContext = context.getLocationInfo().getHl7Path();
//                          coConstraintContextId = context.getElementId();
//                      }    
                      }
                  if (coConstraintBinding.getBindings() != null) {
                      for (CoConstraintBindingSegment coConstraintBindingSegment : coConstraintBinding.getBindings()) {
                          if (coConstraintBindingSegment != null) {
//                              ResourceSkeletonBone segmentRef = this.coConstraintSerializationHelper.getSegmentRef(conformanceProfileSkeleton, coConstraintBinding.getContext(), coConstraintBindingSegment.getSegment());
                              for (CoConstraintTableConditionalBinding coConstraintTableConditionalBinding : coConstraintBindingSegment.getTables()) {
                            	  ByteArrayOutputStream excelFile = serializeCoconstraintTableToExcel.exportToExcel(
                                          id,
                                          coConstraintBinding.getContext().getPathId(),
                                          coConstraintBindingSegment.getSegment().getPathId(),
                                          coConstraintTableConditionalBinding.getValue()
                                  );
                            	  excelFiles.add(excelFile);
                          }

	          }

	      }

	  }
	      }
	  }
	  
  }
	  return excelFiles;
  }

  

  @RequestMapping(value = "/api/export/library/{igId}/configuration/{configId}/{format}", method = RequestMethod.POST, produces = { "application/json" }, consumes = "application/x-www-form-urlencoded; charset=UTF-8")
  public @ResponseBody void exportLibrary(@PathVariable("igId") String igId,
      @PathVariable("configId") String configId,
      @PathVariable("format") String format,
      @RequestParam(required = false) String deltamode,
      HttpServletResponse response, FormData formData) throws ExportException {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String username = authentication.getPrincipal().toString();   
    ExportedFile exportedFile = null;
    try {
      ExportFilterDecision decision = null;
      DatatypeLibrary lib = datatypeLibraryService.findById(igId);      

      if(formData.getJson() != null) {
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        decision = mapper.readValue(formData.getJson(), ExportFilterDecision.class);
      } else {
        ExportConfiguration exportConfiguration = exportConfigurationService.getExportConfiguration(configId);
        decision = igExportService.getExportFilterDecision(lib, exportConfiguration); // Move to different service since it applies to DTLIB and IG
      }
      if(format.equalsIgnoreCase(ExportDocType.HTML.toString())) {
        exportedFile = dlNewExportService.exportDlDocumentToHtml(username, igId, decision, configId);
        response.setContentType("text/html");
        response.setHeader("Content-disposition",
            "attachment;filename=" + exportedFile.getFileName());
      }           
      if(format.equalsIgnoreCase(ExportDocType.WORD.toString())) {   
        exportedFile = dlNewExportService.exportDlDocumentToWord(username, igId, decision, configId);
        response.setContentType("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        response.setHeader("Content-disposition",
            "attachment;filename=" + exportedFile.getFileName());
      }
      FileCopyUtils.copy(exportedFile.getContent(), response.getOutputStream());
    } catch (Exception e) {
      e.printStackTrace();
      throw new ExportException(e, "Error while sending back exported IG Document with id " + igId);
    }

  }

  @RequestMapping(value = "/api/export/ig/{documentId}/quickHtml", method = RequestMethod.POST, produces = { "application/json" }, consumes = "application/x-www-form-urlencoded; charset=UTF-8")
  @PreAuthorize("AccessResource('IGDOCUMENT', #documentId, READ)")
  public @ResponseBody void exportIgDocumentHtml(@PathVariable("documentId") String documentId,
      @PathVariable("type") ExportType type,
      HttpServletResponse response,
      FormData formData) throws ExportException {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null) {
      try {
    	  Ig ig = igService.findById(documentId);		
          IgDataModel igDataModel = igService.generateDataModel(ig);
          ig = igDataModel.getModel();
        String username = authentication.getPrincipal().toString();
        ExportedFile exportedFile= null;     
        ExportConfiguration exportConfiguration = exportConfigurationService.getConfigurationToApply(type, username);
        if(type.equals(ExportType.IGDOCUMENT ) || type.equals(ExportType.DIFFERENTIAL)) {
          ExportFilterDecision decision = igExportService.getExportFilterDecision(ig, exportConfiguration);
          exportedFile = igExportService.exportIgDocumentToHtml(username, igDataModel, decision, exportConfiguration.getId());
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
  @PreAuthorize("AccessResource('CONFORMANCEPROFILE', #formData.conformanceProfileId, READ)")
  public @ResponseBody void exportCoconstraintTable(CoConstraintExcelExportFormData formData, HttpServletResponse response) throws ExportException, JsonParseException, JsonMappingException, IOException, ResourceNotFoundException, PathNotFoundException {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if(formData.getJson() != null) {
      ObjectMapper mapper = new ObjectMapper();
      mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
      CoConstraintTable coConstraintTable = mapper.readValue(formData.getJson(), CoConstraintTable.class);
      if (authentication != null) {
        String username = authentication.getPrincipal().toString();
        ByteArrayOutputStream excelFile = serializeCoconstraintTableToExcel.exportToExcel(
                formData.getConformanceProfileId(),
                formData.getContextId(),
                formData.getSegmentRef(),
                coConstraintTable
        );
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


  @RequestMapping(value="/api/import/coconstraintTable", method=RequestMethod.POST, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  @PreAuthorize("AccessResource('CONFORMANCEPROFILE', #conformanceProfileID, WRITE)")
  @ResponseBody
  public ParserResults handleFileUpload(@RequestPart("file") MultipartFile file,
      @RequestParam("segmentRef") String segmentRef,
      @RequestParam("conformanceProfileID") String conformanceProfileID,
      @RequestParam("igID") String igID,
      @RequestParam("contextId") String contextId) throws IOException{
    String message;
    System.out.println("SegmentRef : " + 	        	 segmentRef);
    System.out.println("conformanceProfileID : " + 	        	 conformanceProfileID);
    System.out.println("contextId : " + 	        	 contextId);
    System.out.println("igId : " + 	        	 igID);

    InputStream stream = file.getInputStream();
    try {
      ParserResults parserResults = excelImportService.readFromExcel(stream, igID, conformanceProfileID, contextId, segmentRef);
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
      e.printStackTrace();
      return null;
    }
  }

  @RequestMapping(value = "/api/export/library/{dlId}/quickWord", method = RequestMethod.POST, produces = { "application/json" }, consumes = "application/x-www-form-urlencoded; charset=UTF-8")
  // TODO Library
  public @ResponseBody void exportDtlDocumentWord(@PathVariable("dlId") String dlId,
      HttpServletResponse response, FormData formData) throws ExportException {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null) {
      try {
        String username = authentication.getPrincipal().toString();				
        DatatypeLibrary dl = datatypeLibraryService.findById(dlId);
        ExportedFile exportedFile;
        ExportConfiguration exportConfiguration = exportConfigurationService.getConfigurationToApply(ExportType.DATATYPELIBRARY, username);
        ExportFilterDecision exportFilterDecision = igExportService.getExportFilterDecision(dl, exportConfiguration);
        exportedFile = dlNewExportService.exportDlDocumentToWord(username, dlId, exportFilterDecision, exportConfiguration.getId());
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
  @PreAuthorize("AccessResource(#document.equals('ig') ? 'IGDOCUMENT' : 'DATATYPELIBRARY', #id, READ)")
  public @ResponseBody ExportConfigurationGlobal getFilteredDocument(
      @PathVariable("id") String id,
      @PathVariable("configId") String configId,
      @PathVariable("document") String document,
      HttpServletResponse response) throws ExportException, IGNotFoundException, EntityNotFound, IGDeltaException {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null) {
      ExportConfiguration config =  exportConfigurationService.getExportConfiguration(configId);
      
      DocumentStructure ds = new DocumentStructure();	
      if(document.toLowerCase().equals("ig")) {
        ds = igService.findById(id);
      } else if(document.toLowerCase().equals("library")) {
        ds = datatypeLibraryService.findById(id);
      }
      if (ds == null) {
        throw  new IGNotFoundException(id);
      } else {	
        ExportConfigurationGlobal exportConfigurationGlobal = new ExportConfigurationGlobal();
        ExportFilterDecision exportFilterDecision = igExportService.getExportFilterDecision(ds, config);
        ExportDecision oldDecsision = this.exportDecisionRepository.findByUsernameAndTypeAndDocumentAndConfig(authentication.getPrincipal().toString(), config.getType(), id, config.getId());
        if(oldDecsision != null) {
          exportConfigurationGlobal.setPrevious(oldDecsision.getFilterdDecision());
        }
        
        exportConfigurationGlobal.setExportConfiguration(config);
        exportConfigurationGlobal.setExportFilterDecision(exportFilterDecision);
        return exportConfigurationGlobal;
      }
    } else {
      throw new AuthenticationCredentialsNotFoundException("No Authentication ");
    }
  }

	@RequestMapping(value = "/api/export/ig/{id}/xml/diff", method = RequestMethod.POST, produces = { "application/json" }, consumes = "application/x-www-form-urlencoded; charset=UTF-8")
    @PreAuthorize("AccessResource('IGDOCUMENT', #id, READ)")
    public void exportXML(@PathVariable("id") String id, HttpServletResponse response) throws Exception {

		Ig ig = igService.findById(id);
		if (ig != null)  {
			String xmlContent = igExportService.exportIgDocumentToDiffXml(id);
			InputStream xmlStream = new ByteArrayInputStream(xmlContent.getBytes());

			ExportedFile exportedFile = new ExportedFile(xmlStream, ig.getMetadata().getTitle(), id,
					ExportFormat.XML);

			response.setContentType("text/xml");
			response.setHeader("Content-disposition",
					"attachment;filename=" + ig.getMetadata().getTitle()+ ".xml");
			FileCopyUtils.copy(exportedFile.getContent(), response.getOutputStream());
		}
	}
	@RequestMapping(value = "/api/export/ig/{id}/{profileId}/xml/diff", method = RequestMethod.POST, consumes = "application/x-www-form-urlencoded; charset=UTF-8")
    @PreAuthorize("AccessResource('IGDOCUMENT', #id, READ)")
    public void exportXML(@PathVariable("id") String id, @PathVariable("profileId") String profileId,  HttpServletResponse response) throws Exception {
		String[] profiles = {profileId};
		ReqId reqIds = new ReqId();
		reqIds.setConformanceProfilesId(profiles);

		Ig ig = igService.findById(id);

		if (ig != null)  {
			Ig selectedIg = this.igService.makeSelectedIg(ig, reqIds);
			selectedIg.setContent(ig.getContent());
			String xmlContent = igExportService.exportIgDocumentToDiffXml(selectedIg);
			System.out.println(xmlContent);
			InputStream xmlStream = new ByteArrayInputStream(xmlContent.getBytes());
			response.setContentType("text/xml");
			response.setHeader("Content-disposition",
					"attachment;filename=" + "pact-profile.xml");
			
			FileCopyUtils.copy(xmlStream, response.getOutputStream());
		}
	}
	
	// Helper functions for zipping
	

	public ByteArrayOutputStream createZip(InputStream word, List<InputStream> excelFiles) throws IOException {
	    ByteArrayOutputStream baos = new ByteArrayOutputStream();
	    ZipOutputStream zipOut = new ZipOutputStream(baos);
	    addFileToZip("WORD_EXPORT.docx", word, zipOut);
	    int i = 1;
	    for(InputStream excelFile : excelFiles ) {
	    addFileToZip("EXCEL_FILE " + i +".xlsx", excelFile, zipOut);
	    i++;
	    }
	    zipOut.close();
	    return baos;
	}


	public void addFileToZip(String filename, InputStream in, ZipOutputStream zipOut) throws IOException {
	    ZipEntry entry = new ZipEntry(filename);
	    zipOut.putNextEntry(entry);
	    byte[] bytes = new byte[1024];
	    int length;
	    while((length = in.read(bytes)) >= 0) {
	        zipOut.write(bytes, 0, length);
	    }
	}

}
