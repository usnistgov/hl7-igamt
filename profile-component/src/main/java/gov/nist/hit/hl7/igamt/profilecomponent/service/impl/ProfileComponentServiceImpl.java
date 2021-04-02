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

import java.sql.Types;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponentBinding;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponent;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponentContext;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponentItem;
import gov.nist.hit.hl7.igamt.profilecomponent.exception.ProfileComponentContextNotFoundException;
import gov.nist.hit.hl7.igamt.profilecomponent.exception.ProfileComponentNotFoundException;
import gov.nist.hit.hl7.igamt.profilecomponent.repository.ProfileComponentRepository;
import gov.nist.hit.hl7.igamt.profilecomponent.service.ProfileComponentService;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;


/**
 * 
 * Created by Maxence Lefort on Feb 20, 2018.
 */
@Service("profileComponentService")
public class ProfileComponentServiceImpl implements ProfileComponentService {

  @Autowired
  private ProfileComponentRepository profileComponentRepository;

  @Autowired
  private ConformanceProfileService conformanceProfileService;

  @Autowired
  private SegmentService segmentService;
  @Autowired
  private DatatypeService datatypeService;
  @Autowired
  private ValuesetService valuesetService;



  @Override
  public ProfileComponent findById(String id) {
    return profileComponentRepository.findById(id).orElse(null);
  }

  @Override
  public ProfileComponent create(ProfileComponent profileComponent) {
    profileComponent.setId(new String());
    profileComponent = profileComponentRepository.save(profileComponent);
    return profileComponent;
  }

  @Override
  public List<ProfileComponent> findAll() {
    return profileComponentRepository.findAll();
  }

  @Override
  public ProfileComponent save(ProfileComponent profileComponent) {
    // profileComponent.setId(StringUtil.updateVersion(profileComponent.getId()));
    profileComponent = profileComponentRepository.save(profileComponent);
    return profileComponent;
  }

  @Override
  public List<ProfileComponent> saveAll(List<ProfileComponent> profileComponents) {
    ArrayList<ProfileComponent> savedProfileComponents = new ArrayList<>();
    for (ProfileComponent profileComponent : profileComponents) {
      savedProfileComponents.add(this.save(profileComponent));
    }
    return savedProfileComponents;
  }

  @Override
  public void delete(String id) {
    profileComponentRepository.deleteById(id);
  }

  @Override
  public void removeCollection() {
    profileComponentRepository.deleteAll();
  }

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.profilecomponent.service.ProfileComponentService#findByIdIn(java.util.Set)
   */
  @Override
  public List<ProfileComponent> findByIdIn(Set<String> ids) {
    // TODO Auto-generated method stub
    return profileComponentRepository.findByIdIn(ids);
  }

  @Override 
  public ProfileComponent addChildrenFromDisplayElement(String id, List<DisplayElement> children) {

    ProfileComponent pc = this.findById(id);
    if(pc.getChildren() == null) {
      pc.setChildren(new HashSet<ProfileComponentContext>());
    }

    for(int i=0; i < children.size(); i++) {
      DisplayElement elm = children.get(i);
      // TODO set struct ID 
      ProfileComponentContext ctx = new ProfileComponentContext(elm.getId(), elm.getType(), elm.getId(), elm.getFixedName(), i+ pc.getChildren().size()+1, new HashSet<ProfileComponentItem>(), new ProfileComponentBinding());
      pc.getChildren().add(ctx);
    }
    this.save(pc);
    return pc;
  }

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.profilecomponent.service.ProfileComponentService#findContextById(java.lang.String, java.lang.String)
   */
  @Override
  public ProfileComponentContext findContextById(String pcId, String contextId) throws ProfileComponentNotFoundException, ProfileComponentContextNotFoundException {
    ProfileComponent pc = this.findById(pcId);
    if(pc  == null ) {
      throw new ProfileComponentNotFoundException(pcId);
    }
    return pc.getChildren().stream().filter(customer -> contextId.equals(customer.getId())).findAny().orElseThrow( () -> new ProfileComponentContextNotFoundException(contextId));


  }

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.profilecomponent.service.ProfileComponentService#getDependencies(java.lang.String, java.lang.String)
   */
  @Override
  public Set<Resource> getDependencies(String pcId, String contextId) throws ProfileComponentNotFoundException, ProfileComponentContextNotFoundException {
    // TODO Auto-generated method stub
    Set<Resource> ret = new HashSet<Resource>();
    ProfileComponentContext profileComponentContext = this.findContextById(pcId, contextId);
    if(profileComponentContext != null) {
      if(profileComponentContext.getLevel().equals(Type.CONFORMANCEPROFILE)) {
        ConformanceProfile cp = this.conformanceProfileService.findById(profileComponentContext.getSourceId());
        ret.addAll(this.conformanceProfileService.getDependencies(cp));
      }else if(profileComponentContext.getLevel().equals(Type.SEGMENT)) {
        Segment s = this.segmentService.findById(profileComponentContext.getSourceId());
        if(s != null) {
          ret.addAll(this.segmentService.getDependencies(s));
        }
      }
      for(ProfileComponentItem item: profileComponentContext.getProfileComponentItems()) {
        for(ItemProperty prop : item.getItemProperties()) {
          if(prop instanceof PropertyDatatype) {
            PropertyDatatype dt = (PropertyDatatype)prop;
            Datatype d = this.datatypeService.findById(dt.getDatatypeId());
            if(d != null) {
              ret.addAll(this.datatypeService.getDependencies(d));
            }
          }
          if(prop instanceof PropertyRef) {
            PropertyRef ref = (PropertyRef)prop;
            Segment segment = this.segmentService.findById(ref.getRef());
            if(segment != null) {
              ret.addAll(this.segmentService.getDependencies(segment));
            }
          } 
        }
      }
    }
    
    return ret;
  }

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.profilecomponent.service.ProfileComponentService#updateContext(java.lang.String, java.lang.String, gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponentContext)
   */
  @Override
  public ProfileComponentContext updateContext(String pcId, String contextId, ProfileComponentContext updated) throws ProfileComponentNotFoundException, ProfileComponentContextNotFoundException {
    // TODO Auto-generated method stub
    boolean found = false;
    ProfileComponent pc = this.findById(pcId);
    for(ProfileComponentContext ctx:  pc.getChildren()) {
      if(ctx.getId().equals(contextId)) {
        ctx.setProfileComponentItems(updated.getProfileComponentItems());
        ctx.setProfileComponentBindings(updated.getProfileComponentBindings());
        break;
      }
    }
    this.save(pc);
    
    return findContextById(pcId, contextId);
    
  }


}
