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
package gov.nist.hit.hl7.igamt.profilecomponent.service;


import java.util.List;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponent;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponentContext;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponentItem;
import gov.nist.hit.hl7.igamt.profilecomponent.exception.ProfileComponentContextNotFoundException;
import gov.nist.hit.hl7.igamt.profilecomponent.exception.ProfileComponentNotFoundException;

/**
 * 
 * Created by Maxence Lefort on Feb 20, 2018.
 */
public interface ProfileComponentService {

  ProfileComponent findById(String id);

  ProfileComponent create(ProfileComponent profileComponent);

  List<ProfileComponent> findAll();

  ProfileComponent save(ProfileComponent profileComponent);

  List<ProfileComponent> saveAll(List<ProfileComponent> profileComponents);

  void delete(String compositeKey);

  public void removeCollection();

  public List<ProfileComponent> findByIdIn(Set<String> ids);

  ProfileComponent addChildrenFromDisplayElement(String id, List<DisplayElement> children);

  ProfileComponentContext findContextById(String pcId, String contextId) throws ProfileComponentNotFoundException, ProfileComponentContextNotFoundException;

  Set<Resource> getDependencies(String pcId, String contextId) throws ProfileComponentNotFoundException, ProfileComponentContextNotFoundException;

  ProfileComponentContext updateContext(String pcId, String contextId,
      Set<ProfileComponentItem> context) throws ProfileComponentNotFoundException, ProfileComponentContextNotFoundException;

}
