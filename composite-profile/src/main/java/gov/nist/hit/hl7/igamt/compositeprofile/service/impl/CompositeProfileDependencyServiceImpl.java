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
package gov.nist.hit.hl7.igamt.compositeprofile.service.impl;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.RealKey;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.util.ReferenceIndentifier;
import gov.nist.hit.hl7.igamt.common.base.util.ReferenceLocation;
import gov.nist.hit.hl7.igamt.common.base.util.RelationShip;
import gov.nist.hit.hl7.igamt.common.exception.EntityNotFound;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.CompositeProfileStructure;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.OrderedProfileComponentLink;
import gov.nist.hit.hl7.igamt.compositeprofile.service.CompositeProfileDependencyService;
import gov.nist.hit.hl7.igamt.compositeprofile.wrappers.CompositeProfileStructureDependencies;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileDependencyService;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponent;
import gov.nist.hit.hl7.igamt.profilecomponent.service.ProfileComponentDependencyService;
import gov.nist.hit.hl7.igamt.profilecomponent.service.ProfileComponentService;
import gov.nist.hit.hl7.resource.dependency.DependencyFilter;

/**
 * @author Abdelghani El Ouakili
 *
 */
@Service
public class CompositeProfileDependencyServiceImpl implements CompositeProfileDependencyService {

  @Autowired
  ConformanceProfileDependencyService conformanceProfileDependencyService;
  @Autowired
  ProfileComponentDependencyService profileComponentDependencyService;
  @Autowired
  ConformanceProfileService conformanceProfileService;
  @Autowired
  ProfileComponentService profileComponentService;

  @Override
  public void updateDependencies(CompositeProfileStructure elm,
      HashMap<RealKey, String> newKeys) {
    if(elm.getConformanceProfileId() != null) {
      RealKey key = new RealKey(elm.getConformanceProfileId(), Type.CONFORMANCEPROFILE);
      if(newKeys.containsKey(key)){
        elm.setConformanceProfileId(newKeys.get(key));
      }
    }
    if(elm.getOrderedProfileComponents() != null) {
      for(OrderedProfileComponentLink child: elm.getOrderedProfileComponents()) {
        RealKey key = new RealKey(child.getProfileComponentId(), Type.PROFILECOMPONENT);
        if(newKeys.containsKey(key)) {
          child.setProfileComponentId(newKeys.get(key));
        }
      }
    }
  }

  @Override
  public CompositeProfileStructureDependencies getDependencies(CompositeProfileStructure resource,
      DependencyFilter filter) throws EntityNotFound {

    CompositeProfileStructureDependencies ret= new CompositeProfileStructureDependencies();
    this.process(resource,ret, filter);
    return ret;
  }

  /**
   * @param resource
   * @param compositeProfileStructureDependencies
   * @param filter
   * @throws EntityNotFound 
   */
  @Override
  public void process(CompositeProfileStructure elm,
      CompositeProfileStructureDependencies compositeProfileStructureDependencies,
      DependencyFilter filter) throws EntityNotFound {
    if(elm.getConformanceProfileId() != null) {
      ConformanceProfile message = conformanceProfileService.findById(elm.getConformanceProfileId());
      if(message != null) {
        this.conformanceProfileDependencyService.process(message, compositeProfileStructureDependencies, filter);
      }
    }
    if(elm.getOrderedProfileComponents() != null) {
      for(OrderedProfileComponentLink child: elm.getOrderedProfileComponents()) {
        
        ProfileComponent pc = profileComponentService.findById(child.getProfileComponentId());
        if(pc != null) {
          this.profileComponentDependencyService.process(pc, compositeProfileStructureDependencies, filter);
        } 
      }
    }
  }
  
  @Override
  public Set<RelationShip> collectDependencies(CompositeProfileStructure composite) {
    Set<RelationShip> relations = new HashSet<RelationShip>();
    if(composite.getConformanceProfileId() != null) {
      RelationShip rel = new RelationShip(new ReferenceIndentifier(composite.getConformanceProfileId(), Type.CONFORMANCEPROFILE),
          new ReferenceIndentifier(composite.getId(), Type.COMPOSITEPROFILE),
          new ReferenceLocation(Type.PROFILECOMPONENT,"Core Profile","" ));
      relations.add(rel);
    }
    if(composite.getOrderedProfileComponents() != null) {
      for(OrderedProfileComponentLink pc : composite.getOrderedProfileComponents()) {
        RelationShip rel = new RelationShip(new ReferenceIndentifier(pc.getProfileComponentId(), Type.PROFILECOMPONENT),
            new ReferenceIndentifier(composite.getId(), Type.COMPOSITEPROFILE),
            new ReferenceLocation(Type.PROFILECOMPONENT, "Profile Component #"+ pc.getPosition(),  "" )); 
        relations.add(rel);
      }
    }
    
    return relations;
  }

}
