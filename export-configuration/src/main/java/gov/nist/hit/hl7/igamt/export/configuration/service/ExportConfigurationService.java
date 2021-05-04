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
package gov.nist.hit.hl7.igamt.export.configuration.service;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportType;

/**
 *
 * @author Maxence Lefort on May 8, 2018.
 */
@Service("exportConfigurationService")
public interface ExportConfigurationService {

  public ExportConfiguration getExportConfiguration(String id);
  public ExportConfiguration getExportConfigurationWithType(String id, ExportType type);

  public List<ExportConfiguration> getAllExportConfiguration(String username);
//  public List<ExportConfiguration> getAllExportConfigurationWithType(String username, String type);
  public List<ExportConfiguration> getAllExportConfigurationWithType(String username, ExportType type);
  public ExportConfiguration save(ExportConfiguration exportConfiguration, Authentication authentication);
  public void delete(ExportConfiguration exportConfiguration);
  public void deleteById(String id);
  public ExportConfiguration create(String username, String type);
  public ExportConfiguration getDefaultConfig(boolean defaultConfig, String username);
  public ExportConfiguration getOriginalConfig(boolean isOriginal);
  public ExportConfiguration getOriginalConfigWithType(boolean isOriginal,ExportType type);

  
  /**
   * @param id
   * @param authentication
   */
  void selectDefault(String id, Authentication authentication);



}
