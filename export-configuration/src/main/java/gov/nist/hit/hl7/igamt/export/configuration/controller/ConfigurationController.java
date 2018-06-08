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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import gov.nist.hit.hl7.igamt.export.configuration.display.tableOptions.CompositeProfileTableOptionsDisplay;
import gov.nist.hit.hl7.igamt.export.configuration.display.tableOptions.ConformanceProfileTableOptionsDisplay;
import gov.nist.hit.hl7.igamt.export.configuration.display.tableOptions.DatatypeTableOptionsDisplay;
import gov.nist.hit.hl7.igamt.export.configuration.display.tableOptions.ProfileComponentTableOptionsDisplay;
import gov.nist.hit.hl7.igamt.export.configuration.display.tableOptions.SegmentTableOptionsDisplay;
import gov.nist.hit.hl7.igamt.export.configuration.display.tableOptions.TableOptionsDisplay;
import gov.nist.hit.hl7.igamt.export.configuration.display.tableOptions.ValuesetTableOptionsDisplay;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.service.ExportConfigurationService;


/**
 *
 * @author Maxence Lefort on Jun 5, 2018.
 */
@RestController
public class ConfigurationController {
  
  @Autowired
  private ExportConfigurationService exportConfigurationService;

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
  
  private void saveTableOptionsDisplay(TableOptionsDisplay tableOptionsDisplay) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication(); 
    if(authentication != null) {
      ExportConfiguration exportConfiguration = tableOptionsDisplay.populateExportConfiguration(this.findExportConfigurationServiceByAuthentication(authentication));
      exportConfiguration.setUsername(authentication.getPrincipal().toString());
      exportConfiguration.setDefaultType(false);
      exportConfigurationService.save(exportConfiguration);
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
