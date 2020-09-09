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

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.collections4.map.HashedMap;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.repository.ConformanceProfileRepository;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatement;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.repository.DatatypeRepository;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.repository.SegmentRepository;


/**
 * @author Abdelghani El Ouakili
 *
 */
@Service()
public class ConformanceStatementFixer {

  @Autowired
  DatatypeRepository datatypeRepo;
  @Autowired
  ConformanceProfileRepository conformanceProfileRepo;
  @Autowired
  SegmentRepository segmentRepo;
  @Autowired
  IgService igService;
  
  public void fixConformanceStatmentsId(){
    
    List<Datatype> datatypes = datatypeRepo.findByDomainInfoScope(Scope.USER.toString());
    
    List<Segment> segments = segmentRepo.findByDomainInfoScope(Scope.USER.toString());
    List<ConformanceProfile> conformanceProfiles = conformanceProfileRepo.findByDomainInfoScope(Scope.USER.toString());

    for(ConformanceProfile elm : conformanceProfiles) {
      if(elm.getBinding() !=null) {
        if(fixCfIds(elm.getBinding())) {
          conformanceProfileRepo.save(elm);
        }
      }
    }

    for(Segment elm : segments) {
      if(elm.getBinding() !=null) {
        if(fixCfIds(elm.getBinding())) {
          segmentRepo.save(elm);
        }
      }
    }
    for(Datatype d : datatypes) {
      if(d instanceof ComplexDatatype) {
        ComplexDatatype dt= (ComplexDatatype)d;
        if(dt.getBinding() !=null) {
          if(fixCfIds(dt.getBinding())) {
            datatypeRepo.save(dt);
          }
        }
      }
    }
    
  }

  /**
   * @param binding
   */
  private boolean fixCfIds(ResourceBinding binding) {
    boolean changed = false;
    // TODO Auto-generated method stub
    if(binding.getConformanceStatements() != null) {
      for(ConformanceStatement cs: binding.getConformanceStatements()) {
        if(cs.getId() == null) {
          cs.setId(new ObjectId().toString());
          changed = true;
          
        }
      }
    }
    return changed;
  }
  
  
  
  void lock(Set<ConformanceStatement> parentCs, Set<ConformanceStatement> childCs) {
    Map<String, String> reserved = parentCs.stream().collect(
        Collectors.toMap(ConformanceStatement::getIdentifier ,ConformanceStatement::getId, (x, y) -> {return x;}));
    for(ConformanceStatement cs: childCs) {
      if(cs.getIdentifier() != null && reserved.containsKey(cs.getIdentifier()) ) {
        cs.setLocked(true);
      }
    }
    
  }
  

  public void lockCfsForDerived() {
    List<ConformanceProfile> cps = conformanceProfileRepo.findByDerived(true); 
    for(ConformanceProfile cp : cps) {
      if(cp.getBinding() !=null && cp.getBinding().getConformanceStatements() !=null && !cp.getBinding().getConformanceStatements().isEmpty()) {
        if(cp.getOrigin() !=null) {
          ConformanceProfile origin= conformanceProfileRepo.findOneById(cp.getOrigin());
          if(origin.getBinding() !=null && cp.getBinding().getConformanceStatements() !=null ) {
            this.lock(origin.getBinding().getConformanceStatements(), cp.getBinding().getConformanceStatements());
            conformanceProfileRepo.save(cp);
          }
        }
      }
    }
    
    List<Segment> segments = segmentRepo.findByDerived(true);
    for(Segment elm : segments) {
      if(elm.getBinding() !=null && elm.getBinding().getConformanceStatements() !=null && !elm.getBinding().getConformanceStatements().isEmpty()) {
        if(elm.getOrigin() !=null) {
          Segment origin= segmentRepo.findOneById(elm.getOrigin());
          if(origin.getBinding() !=null && elm.getBinding().getConformanceStatements() !=null ) {
            this.lock(origin.getBinding().getConformanceStatements(), elm.getBinding().getConformanceStatements());
            segmentRepo.save(elm);
          }
        }
      }
    }
    
    List<Datatype> datatypes = datatypeRepo.findByDerived(true);
    for(Datatype elm : datatypes) {
      if(elm.getBinding() !=null && elm.getBinding().getConformanceStatements() !=null && !elm.getBinding().getConformanceStatements().isEmpty()) {
        if(elm.getOrigin() !=null) {
          Datatype origin= datatypeRepo.findOneById(elm.getOrigin());
          if(origin.getBinding() !=null && elm.getBinding().getConformanceStatements() !=null ) {
            this.lock(origin.getBinding().getConformanceStatements(), elm.getBinding().getConformanceStatements());
            datatypeRepo.save(elm);
          }
        }
      }
    }
  }
  


}
