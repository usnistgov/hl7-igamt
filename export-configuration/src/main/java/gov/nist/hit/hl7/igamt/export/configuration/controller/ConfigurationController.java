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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.naming.OperationNotSupportedException;

import org.springframework.beans.factory.annotation.Autowired;
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
import gov.nist.hit.hl7.igamt.export.configuration.display.tableOptions.CompositeProfileTableOptionsDisplay;
import gov.nist.hit.hl7.igamt.export.configuration.display.tableOptions.ConformanceProfileTableOptionsDisplay;
import gov.nist.hit.hl7.igamt.export.configuration.display.tableOptions.DatatypeTableOptionsDisplay;
import gov.nist.hit.hl7.igamt.export.configuration.display.tableOptions.ProfileComponentTableOptionsDisplay;
import gov.nist.hit.hl7.igamt.export.configuration.display.tableOptions.SegmentTableOptionsDisplay;
import gov.nist.hit.hl7.igamt.export.configuration.display.tableOptions.TableOptionsDisplay;
import gov.nist.hit.hl7.igamt.export.configuration.display.tableOptions.ValuesetTableOptionsDisplay;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportFontConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.ExportConfigurationForFrontEnd;
import gov.nist.hit.hl7.igamt.export.configuration.repository.ExportConfigurationRepository;
import gov.nist.hit.hl7.igamt.export.configuration.service.ExportConfigurationService;
import gov.nist.hit.hl7.igamt.export.configuration.service.ExportFontConfigurationService;



/**
 *
 * @author Maxence Lefort on Jun 5, 2018.
 */
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
  public ResponseMessage saveExportconfuguration(@RequestBody ExportConfiguration exportConfiguration, Authentication authentication) throws Exception{
    exportConfigurationService.save(exportConfiguration, authentication );
    
    if(exportConfiguration.isOriginal()) {
      throw new Exception("The Default Configuration cannot be modified. Please create you own configuration");
    }
    return new ResponseMessage(Status.SUCCESS, "EXPORT_CONFIGURATION_SAVED", exportConfiguration.getId(), null);
  }

  @RequestMapping(value = "api/configuration/saveAsDefault", method = RequestMethod.POST,
      consumes = {"application/json"})
  @ResponseBody
  public ResponseMessage saveAsDefaultExportconfuguration(@RequestBody ExportConfigurationForFrontEnd exportConfigurationWrapper, Authentication authentication){
    ExportConfiguration exportConfiguration = exportConfigurationService.getExportConfiguration(exportConfigurationWrapper.getId());
    exportConfigurationService.selectDefault(exportConfigurationWrapper.getId(), authentication);
    return new ResponseMessage(Status.SUCCESS, "EXPORT_CONFIGURATION_SAVED", exportConfiguration.getId(), null);

  }

  @RequestMapping(value = "/api/configuration/{id}", method = RequestMethod.GET, produces = { "application/json" })
  public @ResponseBody ExportConfiguration getExportConfiguration(@PathVariable("id") String id) {
    return exportConfigurationService.getExportConfiguration(id);

  }

  @RequestMapping(value = "/api/configuration/generalConfigurations", method = RequestMethod.GET, produces = { "application/json" })
  public @ResponseBody List<ExportConfigurationForFrontEnd> getAllGeneralConfigurations( Authentication authentication) {
    String username =  authentication.getPrincipal().toString();
    List<ExportConfiguration> configList = new ArrayList<ExportConfiguration>();
    
    List<ExportConfiguration> original = exportConfigurationRepository.findByOriginal(true);
    if(original !=null ) {
      configList.addAll(original);
    }   
    List<ExportConfiguration> userConfigs = exportConfigurationService.getAllExportConfiguration(username);
   
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
      configNames.add(exportConfigurationForFrontEnd);		  
    }
    return configNames;
  }

  @RequestMapping(value = "api/configuration/delete", method = RequestMethod.POST,
      consumes = {"application/json"})
  public @ResponseBody ResponseMessage deleteExportconfuguration(@RequestBody ExportConfiguration exportConfiguration) throws Exception{
    
    if(exportConfiguration.isOriginal()) {
      throw new Exception("The Default Configuration cannot be modified. Please create you own configuration");
    }
    exportConfigurationService.delete(exportConfiguration);
    return new ResponseMessage<String>(Status.SUCCESS, "EXPORT_CONFIGURATION_DELETED", exportConfiguration.getId(), null);
  }

  @RequestMapping(value = "/api/configuration/create", method = RequestMethod.GET, produces = { "application/json" })
  public @ResponseBody ExportConfiguration createExportConfiguration(Authentication authentication ) {
    String username =  authentication.getPrincipal().toString();
    return exportConfigurationService.create(username);
  }





  @RequestMapping(value = "api/configuration/tableOptions/conformanceProfile", method = RequestMethod.GET,
      produces = {"application/json"})
  public @ResponseBody ConformanceProfileTableOptionsDisplay getConformanceProfileTableOptions(){
    return new ConformanceProfileTableOptionsDisplay(this.findExportConfigurationServiceByAuthentication());
  }

  @RequestMapping(value = "api/configuration/tableOptions/conformanceProfile/save", method = RequestMethod.POST,
      consumes = {"application/json"})
  public void saveConformanceProfileTableOptions(@RequestBody ConformanceProfileTableOptionsDisplay conformanceProfileTableOptionsDisplay){
    this.saveTableOptionsDisplay(conformanceProfileTableOptionsDisplay);
  }

  @RequestMapping(value = "api/configuration/tableOptions/segment", method = RequestMethod.GET,
      produces = {"application/json"})
  public @ResponseBody SegmentTableOptionsDisplay getSegmentTableOptions(){
    return new SegmentTableOptionsDisplay(this.findExportConfigurationServiceByAuthentication());
  }

  @RequestMapping(value = "api/configuration/tableOptions/segment/save", method = RequestMethod.POST,
      consumes = {"application/json"})
  public void saveSegmentTableOptions(@RequestBody SegmentTableOptionsDisplay segmentTableOptionsDisplay){
    this.saveTableOptionsDisplay(segmentTableOptionsDisplay);
  }

  @RequestMapping(value = "api/configuration/tableOptions/datatype", method = RequestMethod.GET,
      produces = {"application/json"})
  public @ResponseBody DatatypeTableOptionsDisplay getDatatypeTableOptions(){
    return new DatatypeTableOptionsDisplay(this.findExportConfigurationServiceByAuthentication());
  }

  @RequestMapping(value = "api/configuration/tableOptions/datatype/save", method = RequestMethod.POST,
      consumes = {"application/json"})
  public void saveDatatypeTableOptions(@RequestBody DatatypeTableOptionsDisplay datatypeTableOptionsDisplay){
    this.saveTableOptionsDisplay(datatypeTableOptionsDisplay);
  }

  @RequestMapping(value = "api/configuration/tableOptions/valueset", method = RequestMethod.GET,
      produces = {"application/json"})
  public @ResponseBody ValuesetTableOptionsDisplay getValuesetTableOptions(){
    return new ValuesetTableOptionsDisplay(this.findExportConfigurationServiceByAuthentication());
  }

  @RequestMapping(value = "api/configuration/tableOptions/valueset/save", method = RequestMethod.POST,
      consumes = {"application/json"})
  public void saveValuesetTableOptions(@RequestBody ValuesetTableOptionsDisplay valuesetTableOptionsDisplay){
    this.saveTableOptionsDisplay(valuesetTableOptionsDisplay);
  }

  @RequestMapping(value = "api/configuration/tableOptions/profileComponent", method = RequestMethod.GET,
      produces = {"application/json"})
  public @ResponseBody ProfileComponentTableOptionsDisplay getProfileComponentTableOptions(){
    return new ProfileComponentTableOptionsDisplay(this.findExportConfigurationServiceByAuthentication());
  }

  @RequestMapping(value = "api/configuration/tableOptions/profileComponent/save", method = RequestMethod.POST,
      consumes = {"application/json"})
  public void saveProfileComponentTableOptions(@RequestBody ProfileComponentTableOptionsDisplay profileComponentTableOptionsDisplay){
    this.saveTableOptionsDisplay(profileComponentTableOptionsDisplay);
  }

  @RequestMapping(value = "api/configuration/tableOptions/compositeProfile", method = RequestMethod.GET,
      produces = {"application/json"})
  public @ResponseBody CompositeProfileTableOptionsDisplay getCompositeProfileTableOptions(){
    return new CompositeProfileTableOptionsDisplay(this.findExportConfigurationServiceByAuthentication());
  }

  @RequestMapping(value = "api/configuration/tableOptions/compositeProfile/save", method = RequestMethod.POST,
      consumes = {"application/json"})
  public void saveCompositeProfileTableOptions(@RequestBody CompositeProfileTableOptionsDisplay compositeProfileTableOptionsDisplay){
    this.saveTableOptionsDisplay(compositeProfileTableOptionsDisplay);
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

  private void saveTableOptionsDisplay(TableOptionsDisplay tableOptionsDisplay) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication(); 
    if(authentication != null) {
      ExportConfiguration exportConfiguration = tableOptionsDisplay.populateExportConfiguration(this.findExportConfigurationServiceByAuthentication(authentication));
      exportConfiguration.setUsername(authentication.getPrincipal().toString());
      exportConfiguration.setDefaultType(false);
      //      exportConfigurationService.save(exportConfiguration);
    }
  }

  private ExportConfiguration findExportConfigurationServiceByAuthentication() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null) {
      return this.findExportConfigurationServiceByAuthentication(authentication);
    }
    return ExportConfiguration.getBasicExportConfiguration(false);
  }

  private ExportConfiguration findExportConfigurationServiceByAuthentication(Authentication authentication) {
    String username = authentication.getPrincipal().toString();
    return exportConfigurationService.getExportConfiguration(username);
  }

}
