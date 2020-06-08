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
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.ExportFilterDecision;
import gov.nist.hit.hl7.igamt.export.configuration.repository.ExportConfigurationRepository;
import gov.nist.hit.hl7.igamt.export.configuration.service.ExportConfigurationService;


/**
 *
 * @author Maxence Lefort on May 8, 2018.
 */
@Service("exportConfigurationService")
public class ExportConfigurationServiceImpl implements ExportConfigurationService {

  @Autowired
  private ExportConfigurationRepository exportConfigurationRepository;



  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.export.configuration.service.ExportConfigurationService#save(gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration)
   */
  @Override
  public ExportConfiguration save(ExportConfiguration exportConfiguration, Authentication authentication) {
    String username = authentication.getPrincipal().toString();
    if (exportConfiguration.isDefaultConfig()) {
      List<ExportConfiguration> configList = this.getAllExportConfiguration(username);
      for (ExportConfiguration exportconfiguration : configList) {
        exportconfiguration.setDefaultConfig(false);
        exportConfigurationRepository.save(exportconfiguration);
      }
      exportConfiguration.setDefaultConfig(true);
      exportConfiguration.setUsername(username);
      return exportConfigurationRepository.save(exportConfiguration);
    } else {
      exportConfiguration.setUsername(username);
      return exportConfigurationRepository.save(exportConfiguration);
    }
  }


  @Override
  public void selectDefault(String id, Authentication authentication) {
    String username = authentication.getPrincipal().toString();
    List<ExportConfiguration> usersConfig= exportConfigurationRepository.findByUsername(username);

    for (ExportConfiguration exportconfiguration : usersConfig) {
      if(exportconfiguration.getId().equals(id)) {
        exportconfiguration.setDefaultConfig(true);
      }else {
        exportconfiguration.setDefaultConfig(false);
      }
      exportConfigurationRepository.save(exportconfiguration);

    }

  }

  @Override
  public List<ExportConfiguration> getAllExportConfigurationWithType(String username,Type type) {
    return exportConfigurationRepository.findByUsernameAndType(username, type);
  }
  
  @Override
  public List<ExportConfiguration> getAllExportConfiguration(String username) {
    return exportConfigurationRepository.findByUsername(username);
  }

  @Override
  public void delete(ExportConfiguration exportConfiguration) {
    exportConfigurationRepository.delete(exportConfiguration);	
  }

  @Override
  public void deleteById(String id) {
    this.exportConfigurationRepository.deleteById(id);
  }

  @Override
  public ExportConfiguration create(String username, String type) {
    //	ExportConfiguration exportConfiguration = exportConfigurationRepository.findOneById("BasicExportConfiguration");
	  Type docType = Type.IGDOCUMENT;
	    if(type.equals("IGDOCUMENT")) {
	     docType = Type.IGDOCUMENT;
	    } else if(type.equals("DATATYPELIBRARY")) {
	         docType = Type.DATATYPELIBRARY;
	    }
    ExportConfiguration exportConfiguration = ExportConfiguration.getBasicExportConfiguration(false,docType);
    exportConfiguration.setId(null);
    exportConfiguration.setConfigName("New Configuration");
    exportConfiguration.setUsername(username);
    if(type.equals("IGDOCUMENT")){
    exportConfiguration.setType(Type.IGDOCUMENT);
    System.out.println("inside IF IGDOCUMENT ");
  }	else if(type.equals("DATATYPELIBRARY")){
	    exportConfiguration.setType(Type.DATATYPELIBRARY);
  }
    exportConfigurationRepository.save(exportConfiguration);
    return exportConfiguration;
  }

  @Override
  public ExportConfiguration getExportConfiguration(String id) {
    return exportConfigurationRepository.findOneById(id);	
  }

  @Override
  public ExportConfiguration getDefaultConfig(boolean defaultConfig, String username) {
    return exportConfigurationRepository.findOneByDefaultConfigAndUsername(defaultConfig, username);
  }
  
  public ExportConfiguration getOriginalConfig(boolean isOriginal) {
	    return exportConfigurationRepository.findOneByOriginal(isOriginal);
	  }
  
  public ExportConfiguration getOriginalConfigWithType(boolean isOriginal, Type type) {
	    return exportConfigurationRepository.findOneByOriginalAndType(isOriginal, type);
	  }


@Override
public ExportConfiguration getExportConfigurationWithType(String id, Type type) {
    return exportConfigurationRepository.findOneByIdAndType(id,type);

}







}
