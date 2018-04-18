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
package gov.nist.hit.hl7.igamt.profilecomponent.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponent;
import gov.nist.hit.hl7.igamt.profilecomponent.repository.ProfileComponentRepository;
import gov.nist.hit.hl7.igamt.profilecomponent.service.ProfileComponentService;
import gov.nist.hit.hl7.igamt.shared.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.shared.util.CompositeKeyUtil;

/**
 * 
 * Created by Maxence Lefort on Feb 20, 2018.
 */
@Service("profileComponentService")
public class ProfileComponentServiceImpl implements ProfileComponentService {

  @Autowired
  private ProfileComponentRepository profileComponentRepository;
  
  @Override
  public ProfileComponent findByCompositeKey(CompositeKey compositeKey) {
    return profileComponentRepository.findOne(compositeKey);
  }

  @Override
  public ProfileComponent create(ProfileComponent profileComponent) {
    profileComponent.setId(new CompositeKey());
    profileComponent = profileComponentRepository.save(profileComponent);
    return profileComponent;
  }

  @Override
  public List<ProfileComponent> findAll() {
    return profileComponentRepository.findAll();
  }

  @Override
  public ProfileComponent save(ProfileComponent profileComponent) {
    //profileComponent.setId(CompositeKeyUtil.updateVersion(profileComponent.getId()));
    profileComponent = profileComponentRepository.save(profileComponent);
    return profileComponent;
  }

  @Override
  public List<ProfileComponent> saveAll(List<ProfileComponent> profileComponents) {
    ArrayList<ProfileComponent> savedProfileComponents = new ArrayList<>();
    for(ProfileComponent profileComponent : profileComponents) {
      savedProfileComponents.add(this.save(profileComponent));
    }
    return savedProfileComponents;
  }

  @Override
  public void delete(CompositeKey id) {
    profileComponentRepository.delete(id);
  }

  @Override
  public void removeCollection() {
    profileComponentRepository.deleteAll();
  }

}
