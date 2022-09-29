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
package gov.nist.hit.hl7.igamt.service.impl;

import java.util.Set;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGroup;
import gov.nist.hit.hl7.igamt.coconstraints.service.CoConstraintService;
import gov.nist.hit.hl7.igamt.common.base.domain.DocumentInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.exception.ForbiddenOperationException;
import gov.nist.hit.hl7.igamt.common.base.util.RelationShip;
import gov.nist.hit.hl7.igamt.common.exception.EntityNotFound;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.CompositeProfileStructure;
import gov.nist.hit.hl7.igamt.compositeprofile.service.CompositeProfileStructureService;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.ig.service.ResourceHelper;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponent;
import gov.nist.hit.hl7.igamt.profilecomponent.service.ProfileComponentService;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;

/**
 * @author Abdelghani El Ouakili
 *
 */
@Service
public class ResourceHelperImpl implements ResourceHelper {
  
  @Autowired
  ConformanceProfileService conformanceProfileService;
  @Autowired
  ProfileComponentService profileComponentService;
  @Autowired
  CompositeProfileStructureService compositeProfileService;
  @Autowired
  SegmentService segmentService;
  @Autowired
  DatatypeService datatypeService;
  @Autowired
  CoConstraintService coConstraintService;
  @Autowired
  ValuesetService valueSetService;
 
  @SuppressWarnings("unchecked")
  @Override
  public  <T extends Resource>  T getResourceByType( String id, Type type ) throws EntityNotFound {


    switch(type) {
      case CONFORMANCEPROFILE:
        return (T) conformanceProfileService.findById(id);
      case PROFILECOMPONENT:
        return (T) profileComponentService.findById(id);
      case COMPOSITEPROFILE:
        return (T) compositeProfileService.findById(id);
      case SEGMENT:
        return (T) segmentService.findById(id);
      case DATATYPE:
        return (T) datatypeService.findById(id);
      case COCONSTRAINTGROUP:
        return (T) coConstraintService.findById(id);
      case VALUESET:
        return (T) valueSetService.findById(id);
      default:
        break;
    }
    return null;

  }
  
  @SuppressWarnings("unchecked")
  @Override
  public  <T extends Resource>  T saveByType( T resource, Type type ) throws ForbiddenOperationException{

  switch(type) {
      case CONFORMANCEPROFILE:
        return (T)conformanceProfileService.save((ConformanceProfile)(resource));
      case PROFILECOMPONENT:
        return (T) profileComponentService.save((ProfileComponent)resource);
      case COMPOSITEPROFILE:
        return (T) compositeProfileService.save((CompositeProfileStructure)resource);
      case SEGMENT:
        return (T) segmentService.save((Segment)resource);
      case DATATYPE:
        return (T) datatypeService.save((Datatype)resource);
      case COCONSTRAINTGROUP:
        return (T) coConstraintService.saveCoConstraintGroup((CoConstraintGroup) resource);
      case VALUESET:
        return (T) valueSetService.save((Valueset)resource);
      default:
        break;
    }
    return null;
  }
  
  @Override
  public String generateAbstractDomainId() {
    return new ObjectId().toString();
  }

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.ig.service.ResourceHelper#generateLink(gov.nist.hit.hl7.igamt.common.base.domain.Resource, gov.nist.hit.hl7.igamt.common.base.domain.DocumentInfo)
   */
  @Override
  public Link generateLink(Resource resource, DocumentInfo info, int position) {
    return new Link(resource, position);
  }


}
