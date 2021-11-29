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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.coconstraints.exception.CoConstraintGroupNotFoundException;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGroup;
import gov.nist.hit.hl7.igamt.coconstraints.service.CoConstraintService;
import gov.nist.hit.hl7.igamt.common.base.domain.AbstractDomain;
import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.exception.ResourceNotFoundException;
import gov.nist.hit.hl7.igamt.common.base.wrappers.SharedUsersInfo;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.ig.service.SharingService;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;

/**
 * @author Abdelghani El Ouakili
 *
 */
@Service
public class SharingServiceImpl implements SharingService {

  @Autowired
  ConformanceProfileService conformanceProfileService;

  @Autowired
  SegmentService segmentService;

  @Autowired
  DatatypeService datatypeService;

  @Autowired
  ValuesetService valuesetService;

  @Autowired
  IgService igService;
  @Autowired
  private CoConstraintService coConstraintService; // review the service exceptions
  



  private void updateSharingInfo(AbstractDomain elm, SharedUsersInfo sharedUsersInfo) {
    elm.setCurrentAuthor(sharedUsersInfo.getCurrentAuthor());
    elm.setSharedUsers(sharedUsersInfo.getSharedUsers());  
  }


  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.ig.service.SharingService#shareIg(java.lang.String, gov.nist.hit.hl7.igamt.common.base.wrappers.SharedUsersInfo)
   */
  @Override
  public void shareIg(String id, SharedUsersInfo sharedUsersInfo) throws ResourceNotFoundException {
    // TODO Auto-generated method stub
    Ig ig= this.igService.findById(id);
    if(ig ==null) {
      throw new ResourceNotFoundException(id, Type.IGDOCUMENT);
    }
    updateSharingInfo(ig, sharedUsersInfo);

    for(Link l: ig.getConformanceProfileRegistry().getChildren()) {
      if(l.isUser()) {
        this.shareConformanceProfile(l.getId(), sharedUsersInfo);
      }
    } 
    for(Link l: ig.getSegmentRegistry().getChildren()) {
      if(l.isUser()) {
        this.shareSegment(l.getId(), sharedUsersInfo);
      }
    } 
    for(Link l: ig.getDatatypeRegistry().getChildren()) {
      if(l.isUser()) {
        this.shareDatatype(l.getId(), sharedUsersInfo);
      }
    } 
    for(Link l: ig.getValueSetRegistry().getChildren()) {
      if(l.isUser()) {
        this.shareValueset(l.getId(), sharedUsersInfo);
      }
    } 
    for(Link l: ig.getCoConstraintGroupRegistry().getChildren()) {
      this.shareCoConstraintGroup(l.getId(), sharedUsersInfo);
    }

    this.igService.save(ig);
  }


  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.ig.service.SharingService#shareDatatype(java.lang.String, gov.nist.hit.hl7.igamt.common.base.wrappers.SharedUsersInfo)
   */
  @Override
  public void shareDatatype(String id, SharedUsersInfo sharedUsersInfo)
      throws ResourceNotFoundException {
    // TODO Auto-generated method stub
    Datatype elm= this.datatypeService.findById(id);
    if(elm !=null) {
      updateSharingInfo(elm, sharedUsersInfo);
      datatypeService.save(elm);
    }else {
      throw new ResourceNotFoundException(id, Type.DATATYPE);
    }
  }


  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.ig.service.SharingService#shareSegment(java.lang.String, gov.nist.hit.hl7.igamt.common.base.wrappers.SharedUsersInfo)
   */
  @Override
  public void shareSegment(String id, SharedUsersInfo sharedUsersInfo)
      throws ResourceNotFoundException {
    Segment elm= this.segmentService.findById(id);
    if(elm !=null) {
      updateSharingInfo(elm, sharedUsersInfo);
      segmentService.save(elm);
    }else {
      throw new ResourceNotFoundException(id, Type.SEGMENT);

    }


  }


  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.ig.service.SharingService#shareValueset(java.lang.String, gov.nist.hit.hl7.igamt.common.base.wrappers.SharedUsersInfo)
   */
  @Override
  public void shareValueset(String id, SharedUsersInfo sharedUsersInfo)
      throws ResourceNotFoundException {
    // TODO Auto-generated method stub
    Valueset elm= this.valuesetService.findById(id);
    if(elm != null) {
      updateSharingInfo(elm, sharedUsersInfo);
      valuesetService.save(elm);
    }else {
      throw new ResourceNotFoundException(id, Type.VALUESET);
    }
  }


  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.ig.service.SharingService#shareConformanceProfile(java.lang.String, gov.nist.hit.hl7.igamt.common.base.wrappers.SharedUsersInfo)
   */
  @Override
  public void shareConformanceProfile(String id, SharedUsersInfo sharedUsersInfo)
      throws ResourceNotFoundException {
    // TODO Auto-generated method stub
    ConformanceProfile elm= this.conformanceProfileService.findById(id);
    if(elm != null) {
      updateSharingInfo(elm, sharedUsersInfo);
      conformanceProfileService.save(elm);
    }else {
      throw new ResourceNotFoundException(id, Type.CONFORMANCEPROFILE);
    }
  }


  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.ig.service.SharingService#shareCoConstraintGroup(java.lang.String, gov.nist.hit.hl7.igamt.common.base.wrappers.SharedUsersInfo)
   */
  @Override
  public void shareCoConstraintGroup(String id, SharedUsersInfo sharedUsersInfo)
      throws ResourceNotFoundException {
    // TODO Auto-generated method stub
    
    CoConstraintGroup elm;
    try {
      elm = this.coConstraintService.findById(id);
      updateSharingInfo(elm, sharedUsersInfo);
      coConstraintService.saveCoConstraintGroup(elm);
    } catch (CoConstraintGroupNotFoundException e) {
      // TODO Auto-generated catch block
      throw new ResourceNotFoundException(id, Type.COCONSTRAINTGROUP);
    }
  }


}
