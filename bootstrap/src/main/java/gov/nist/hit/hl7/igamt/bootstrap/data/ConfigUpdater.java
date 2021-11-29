/**
 * This software was developed at the National Institute of Standards and Technology by employees of
 * the Federal Government in the course of their official duties. Pursuant to title 17 Section 105
 * of the United States Code this software is not subject to copyright protection and is in the
 * public domain. This is an experimental system. NIST assumes no responsibility whatsoever for its
 * use by other parties, and makes no guarantees, expressed or implied, about its quality,
 * reliability, or any other characteristic. We would appreciate acknowledgement if the software is
 * used. This software can be redistributed and/or modified freely provided that any derivative
 * works bear some notice that they are derived from it, and any modified versions bear some notice
 * that they have been modified.
 */
package gov.nist.hit.hl7.igamt.bootstrap.data;

import java.util.HashSet;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.config.domain.BindingInfo;
import gov.nist.hit.hl7.igamt.common.config.domain.BindingLocationInfo;
import gov.nist.hit.hl7.igamt.common.config.domain.Config;
import gov.nist.hit.hl7.igamt.common.config.service.ConfigService;

/**
 * @author Abdelghani El Ouakili
 *
 */
@Service
public class ConfigUpdater {

  @Autowired
  ConfigService sharedConstantService;

  public void updateValueSetLoctaionException(Config config, String datatypeName, String resourceName, Type resourceType, int location, List<String> versions) {
    if(config.getValueSetBindingConfig().containsKey(datatypeName)) {
      BindingInfo bindingInfo = config.getValueSetBindingConfig().get(datatypeName);
      if(bindingInfo.getLocationExceptions() == null) {
        bindingInfo.setLocationExceptions(new HashSet<BindingLocationInfo>());
      }
      bindingInfo.getLocationExceptions().add(new BindingLocationInfo(resourceType, resourceName, location, versions ));
    }
  }
  

}