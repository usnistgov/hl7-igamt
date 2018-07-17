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
package gov.nist.hit.hl7.igamt.export.configuration.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.export.configuration.display.ExportFontConfigurationDisplay;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportFont;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportFontConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.repository.ExportFontConfigurationRepository;
import gov.nist.hit.hl7.igamt.export.configuration.service.ExportFontConfigurationService;
import gov.nist.hit.hl7.igamt.export.configuration.service.ExportFontService;

/**
 *
 * @author Maxence Lefort on May 8, 2018.
 */
@Service("exportFontConfigurationService")
public class ExportFontConfigurationServiceImpl implements ExportFontConfigurationService {

  @Autowired
  private ExportFontConfigurationRepository exportFontConfigurationRepository;
  
  @Autowired
  private ExportFontService exportFontService;

  @Override
  public ExportFontConfiguration getExportFontConfiguration(String username) {
    ExportFontConfiguration exportFontConfiguration = exportFontConfigurationRepository.findOneByUsername(username);
    if(exportFontConfiguration == null) {
      exportFontConfiguration = ExportFontConfiguration.getDefault();
    }
    return exportFontConfiguration;
  }

  @Override
  public ExportFontConfigurationDisplay getExportFontConfigurationDisplay(String username) {
    List<ExportFont> exportFonts = exportFontService.findAll();
    ExportFontConfiguration exportFontConfiguration = this.getExportFontConfiguration(username);
    return new ExportFontConfigurationDisplay(exportFonts, exportFontConfiguration);
  }

  @Override
  public void save(ExportFontConfiguration exportFontConfiguration) {
    exportFontConfiguration.setDefaultConfig(false);
    this.exportFontConfigurationRepository.save(exportFontConfiguration);
  }
  
  

}
