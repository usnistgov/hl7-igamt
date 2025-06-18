/**
 * 
 * This software was developed at the National Institute of Standards and Technology by employees of
 * the Federal Government in the course of their official duties. Pursuant to title 17 Section 105
 * of the United States Code this software is not subject to copyright protection and is in the
 * public domain. This is an experimental system. NIST assumes no responsibility whatsoever for its
 * use by other parties, and makes no guarantees, expressed or implied, about its quality,
 * reliability, or any other characteristic. We would appreciate acknowledgement if the software is
 * used. This software can be redistributed and/or modified freely provided that any derivative
 * works bear some notice that they are derived from it, and any modified versions bear some notice
 * that they have been modified.
 * 
 */
package gov.nist.hit.hl7.igamt.export.configuration.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage.Status;
import gov.nist.hit.hl7.igamt.export.configuration.display.ExportFontConfigurationDisplay;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportFontConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportType;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.ExportConfigurationForFrontEnd;
import gov.nist.hit.hl7.igamt.export.configuration.repository.ExportConfigurationRepository;
import gov.nist.hit.hl7.igamt.export.configuration.service.ExportConfigurationService;
import gov.nist.hit.hl7.igamt.export.configuration.service.ExportFontConfigurationService;

@RestController
public class ConfigurationController {

  @Autowired
  private ExportConfigurationService exportConfigurationService;
  @Autowired
  private ExportConfigurationRepository exportConfigurationRepository;

  @Autowired
  private ExportFontConfigurationService exportFontConfigurationService;


  @RequestMapping(value = "api/configuration/save", method = RequestMethod.POST,
      consumes = {"application/json"})
  @PreAuthorize("AccessConfiguration(#exportConfiguration.id, WRITE)")
  public ResponseMessage saveExportconfuguration(@RequestBody ExportConfiguration exportConfiguration, Authentication authentication) throws Exception{
    
    if(exportConfiguration.isOriginal()) {
      throw new Exception("The Default Configuration cannot be modified. Please create your own configuration");
    }else {
      exportConfigurationService.save(exportConfiguration, authentication );
      return new ResponseMessage(Status.SUCCESS, "EXPORT_CONFIGURATION_SAVED", exportConfiguration.getId(), null);
    }

  }

  @RequestMapping(value = "api/configuration/saveAsDefault", method = RequestMethod.POST,
      consumes = {"application/json"})
  @PreAuthorize("AccessConfiguration(#exportConfigurationWrapper.id, WRITE)")
  @ResponseBody
  public ResponseMessage saveAsDefaultExportconfuguration(@RequestBody ExportConfigurationForFrontEnd exportConfigurationWrapper, Authentication authentication){
    ExportConfiguration exportConfiguration = exportConfigurationService.getExportConfiguration(exportConfigurationWrapper.getId());
    String username =  authentication.getPrincipal().toString();
    exportConfigurationService.selectDefault(exportConfiguration.getId(), exportConfiguration.getType(), username);
    return new ResponseMessage(Status.SUCCESS, "EXPORT_CONFIGURATION_SAVED", exportConfigurationWrapper.getId(), null);

  }

  @RequestMapping(value = "/api/configuration/{id}", method = RequestMethod.GET, produces = { "application/json" })
  @PreAuthorize("AccessConfiguration(#id, READ)")
  public @ResponseBody ExportConfiguration getExportConfiguration(@PathVariable("id") String id) {
    return exportConfigurationService.getExportConfiguration(id);

  }
  


  @RequestMapping(value = "/api/configuration/generalConfigurations/{type}", method = RequestMethod.GET, produces = { "application/json" })
  public @ResponseBody List<ExportConfigurationForFrontEnd> getAllGeneralConfigurations( Authentication authentication,
			@PathVariable("type") String type) {
    String username =  authentication.getPrincipal().toString();
    ExportType docType = ExportType.fromString(type);
    List<ExportConfiguration> configList = new ArrayList<ExportConfiguration>();
    List<ExportConfiguration> original = exportConfigurationRepository.findByOriginalAndType(true, docType);
    if(original !=null ) {
      configList.addAll(original);
    }   
    List<ExportConfiguration> userConfigs = exportConfigurationService.getAllExportConfigurationWithType(username,docType);
   
    if(userConfigs !=null) {
      configList.addAll(userConfigs);
    }
    List<ExportConfigurationForFrontEnd> configNames = new ArrayList<>();
    
    for(ExportConfiguration ec : configList) {
      ExportConfigurationForFrontEnd exportConfigurationForFrontEnd = new ExportConfigurationForFrontEnd();
      exportConfigurationForFrontEnd.setId(ec.getId());
      exportConfigurationForFrontEnd.setConfigName(ec.getConfigName());
      exportConfigurationForFrontEnd.setDefaultConfig(ec.isDefaultConfig());
      exportConfigurationForFrontEnd.setOriginal(ec.isOriginal());
      exportConfigurationForFrontEnd.setType(type);
      configNames.add(exportConfigurationForFrontEnd);		  
    }
    return configNames;
  }

  @RequestMapping(value = "api/configuration/delete", method = RequestMethod.POST,
      consumes = {"application/json"})
  @PreAuthorize("AccessConfiguration(#exportConfiguration.id, WRITE)")
  public @ResponseBody ResponseMessage deleteExportconfuguration(@RequestBody ExportConfiguration exportConfiguration) throws Exception{
    
    if(exportConfiguration.isOriginal()) {
      throw new Exception("The Default Configuration cannot be modified. Please create you own configuration");
    }
    exportConfigurationService.delete(exportConfiguration);
    return new ResponseMessage<String>(Status.SUCCESS, "EXPORT_CONFIGURATION_DELETED", exportConfiguration.getId(), null);
  }

  @RequestMapping(value = "/api/configuration/create/{type}", method = RequestMethod.GET, produces = { "application/json" })
  public @ResponseBody ExportConfiguration createExportConfiguration(Authentication authentication,
		  @PathVariable("type") String type) {
	    System.out.println("inside create controller ");

    String username =  authentication.getPrincipal().toString();
    return exportConfigurationService.create(username,type);
  }

  @RequestMapping(value = "api/configuration/exportFont", method = RequestMethod.GET,
      produces = {"application/json"})
  public @ResponseBody ExportFontConfigurationDisplay getExportFontConfigurationDisplay(){
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication(); 
    if(authentication != null) {
      String username = authentication.getPrincipal().toString();
      return this.exportFontConfigurationService.getExportFontConfigurationDisplay(username);
    }
    return null;
  }

  @RequestMapping(value = "api/configuration/exportFont/save", method = RequestMethod.POST,
      consumes = {"application/json"})
  public void saveExportFontConfiguration(@RequestBody ExportFontConfigurationDisplay exportFontConfigurationDisplay){
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication(); 
    if(authentication != null) {
      String username = authentication.getPrincipal().toString();
      ExportFontConfiguration exportFontConfiguration = exportFontConfigurationDisplay.getExportFontConfiguration();
      exportFontConfiguration.setUsername(username);
      this.exportFontConfigurationService.save(exportFontConfiguration);
    }
  }

}
