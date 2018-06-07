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

import gov.nist.hit.hl7.igamt.export.configuration.display.tableOptions.ConformanceStatementTableOptionsDisplay;
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
  public @ResponseBody ConformanceStatementTableOptionsDisplay getConformanceStatementTableOptions(){
    return new ConformanceStatementTableOptionsDisplay(this.findExportConfigurationServiceByAuthentication());
  }
  
  @RequestMapping(value = "api/configuration/tableOptions/conformanceProfile/save", method = RequestMethod.POST,
      consumes = {"application/json"})
  public void saveConformanceStatementTableOptions(@RequestBody ConformanceStatementTableOptionsDisplay conformanceStatementTableOptionsDisplay){
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication(); 
    if(authentication != null) {
      ExportConfiguration exportConfiguration = conformanceStatementTableOptionsDisplay.populateExportConfiguration(this.findExportConfigurationServiceByAuthentication(authentication));
      exportConfiguration.setUsername(authentication.getPrincipal().toString());
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
