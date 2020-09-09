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

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mongodb.client.result.UpdateResult;

import gov.nist.hit.hl7.igamt.coconstraints.exception.CoConstraintGroupNotFoundException;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGroup;
import gov.nist.hit.hl7.igamt.coconstraints.service.CoConstraintService;
import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.Status;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.exceptions.IGUpdateException;
import gov.nist.hit.hl7.igamt.ig.repository.IgRepository;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;

/**
 * @author Abdelghani El Ouakili
 *
 */

@Service
public class IgFixer {

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
  IgRepository igRepo;

  @Autowired
  private CoConstraintService coConstraintService;

  public void deleteArived() {

  }


  public void fixIgComponents() throws CoConstraintGroupNotFoundException {
    List<Ig> igs=  igService.findAll();
    for(Ig ig: igs) {
      if(ig.getDomainInfo().getScope() != Scope.ARCHIVED) {
        if(ig.getStatus()!=null && ig.getStatus().equals(Status.PUBLISHED)) {
          ig.setUsername(null);
        }
        for(Link l: ig.getConformanceProfileRegistry().getChildren()) {
          if(l.isUser()) {
            l.setUsername(ig.getUsername());
            this.fixConformanceProfile(l.getId(), ig.getUsername());
          }
        } 
        for(Link l: ig.getSegmentRegistry().getChildren()) {
          if(l.isUser()) {
            l.setUsername(ig.getUsername());
            this.fixSegment(l.getId(), ig.getUsername());
          }
        } 
        for(Link l: ig.getDatatypeRegistry().getChildren()) {
          if(l.isUser()) {
            l.setUsername(ig.getUsername());
            this.fixDatatype(l.getId(), ig.getUsername());
          }
        } 
        for(Link l: ig.getValueSetRegistry().getChildren()) {
          if(l.isUser()) {
            l.setUsername(ig.getUsername());
            this.fixValueset(l.getId(), ig.getUsername());
          }
        } 
        for(Link l: ig.getCoConstraintGroupRegistry().getChildren()) {
          l.setUsername(ig.getUsername());
          if(l.getId() ==null) {
            System.out.println(l);
          }
          this.fixCoConstraintGroup(l.getId(), ig.getUsername());
        }

        igService.save(ig);
      }
    }      
  }

  /**
   * @param id
   * @param username
   * @throws CoConstraintGroupNotFoundException 
   */
  private void fixCoConstraintGroup(String id, String username) throws CoConstraintGroupNotFoundException {
    // TODO Auto-generated method stub
    CoConstraintGroup c= coConstraintService.findById(id);
    if(c != null) {
      c.setUsername(username);
      this.coConstraintService.saveCoConstraintGroup(c);
    }
  }


  /**
   * @param id
   * @param username
   */
  private void fixValueset(String id, String username) {
    // TODO Auto-generated method stub
    Valueset vs = this.valuesetService.findById(id);
    if(vs !=null) {
      vs.setUsername(username);
      this.valuesetService.save(vs);
    }

  }


  /**
   * @param id
   * @param username
   */
  private void fixDatatype(String id, String username) {
    // TODO Auto-generated method stub
    Datatype dt = this.datatypeService.findById(id);
    if(dt !=null) {
      dt.setUsername(username);
      this.datatypeService.save(dt);
    }

  }


  /**
   * @param id
   * @param username
   */
  private void fixSegment(String id, String username) {
    // TODO Auto-generated method stub
    Segment segment = this.segmentService.findById(id);
    if(segment !=null) {
      segment.setUsername(username);
      this.segmentService.save(segment);
    }

  }

  /**
   * @param id
   * @param username
   */
  private void fixConformanceProfile(String id, String username) {
    // TODO Auto-generated method stub
    ConformanceProfile conformanceProfile = this.conformanceProfileService.findById(id);
    if(conformanceProfile !=null) {
      conformanceProfile.setUsername(username);
      this.conformanceProfileService.save(conformanceProfile);
    }
  }

  public void deriveChildren() throws IGUpdateException{
    List<Ig> igs = igRepo.findByDerived(true);
    for(Ig ig : igs) {
      for ( Link l: ig.getConformanceProfileRegistry().getChildren()) {
        if(l.getDomainInfo() !=null && l.getDomainInfo().getScope() !=null && l.getDomainInfo().getScope().equals(Scope.USER)) {
          UpdateResult updateResult = this.igService.updateAttribute(l.getId(), "derived", true, ConformanceProfile.class);
          if(! updateResult.wasAcknowledged()) {
            throw new IGUpdateException("Could not publish Conformance profile:" +l.getId());
          }
        }
      }
      for ( Link l: ig.getSegmentRegistry().getChildren()) {
        if(l.getDomainInfo() !=null && l.getDomainInfo().getScope() !=null && l.getDomainInfo().getScope().equals(Scope.USER)) {
          UpdateResult updateResult = this.igService.updateAttribute(l.getId(), "derived", true, Segment.class);
          if(! updateResult.wasAcknowledged()) {
            throw new IGUpdateException("Could not publish segment:" +l.getId());
          }
        }
      }

      for ( Link l: ig.getDatatypeRegistry().getChildren()) {
        if(l.getDomainInfo() !=null && l.getDomainInfo().getScope() !=null && l.getDomainInfo().getScope().equals(Scope.USER)) {
          UpdateResult updateResult = this.igService.updateAttribute(l.getId(), "derived", true, Datatype.class);
          if(! updateResult.wasAcknowledged()) {
            throw new IGUpdateException("Could not publish Datatype:" +l.getId());
          }
        }
      }
      for ( Link l: ig.getValueSetRegistry().getChildren()) {
        if(l.getDomainInfo() !=null && l.getDomainInfo().getScope() !=null && l.getDomainInfo().getScope().equals(Scope.USER)) {
          UpdateResult updateResult = this.igService.updateAttribute(l.getId(), "derived", true, Valueset.class);
          if(! updateResult.wasAcknowledged()) {
            throw new IGUpdateException("Could not publish Value set:" +l.getId());
          }
        }
      }

      for ( Link l: ig.getCoConstraintGroupRegistry().getChildren()) {
        if(l.getDomainInfo() !=null && l.getDomainInfo().getScope() !=null && l.getDomainInfo().getScope().equals(Scope.USER)) {
          UpdateResult updateResult = this.igService.updateAttribute(l.getId(), "derived", true, Valueset.class);
          if(! updateResult.wasAcknowledged()) {
            throw new IGUpdateException("Could not publish Value set:" +l.getId());
          }
        }
      }
    }
  }
}
