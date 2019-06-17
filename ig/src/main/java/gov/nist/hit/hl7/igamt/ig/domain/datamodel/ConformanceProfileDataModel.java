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
package gov.nist.hit.hl7.igamt.ig.domain.datamodel;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.Comment;
import gov.nist.hit.hl7.igamt.common.binding.domain.ExternalSingleCode;
import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatement;
import gov.nist.hit.hl7.igamt.constraints.domain.Predicate;
import gov.nist.hit.hl7.igamt.constraints.repository.ConformanceStatementRepository;
import gov.nist.hit.hl7.igamt.constraints.repository.PredicateRepository;

/**
 * @author jungyubw
 *
 */
public class ConformanceProfileDataModel {
  private ConformanceProfile model;

  private Set<ConformanceStatement> conformanceStatementMap = new HashSet<ConformanceStatement>();
  private Map<String, Predicate> predicateMap = new HashMap<String, Predicate>();
  private Map<String, Set<Comment>> commentMap = new HashMap<String, Set<Comment>>();
  private Map<String, String> constantValueMap = new HashMap<String, String>();
  private Map<String, ExternalSingleCode> singleCodeMap = new HashMap<String, ExternalSingleCode>();
  private Map<String, Set<ValuesetBindingDataModel>> valuesetMap = new HashMap<String, Set<ValuesetBindingDataModel>>();

  public ConformanceProfile getModel() {
    return model;
  }

  public void setModel(ConformanceProfile model) {
    this.model = model;
  }

  public Set<ConformanceStatement> getConformanceStatementMap() {
    return conformanceStatementMap;
  }

  public void setConformanceStatementMap(
      Set<ConformanceStatement>conformanceStatementMap) {
    this.conformanceStatementMap = conformanceStatementMap;
  }

  public Map<String, Predicate> getPredicateMap() {
    return predicateMap;
  }

  public void setPredicateMap(Map<String, Predicate> predicateMap) {
    this.predicateMap = predicateMap;
  }

  public Map<String, Set<Comment>> getCommentMap() {
    return commentMap;
  }

  public void setCommentMap(Map<String, Set<Comment>> commentMap) {
    this.commentMap = commentMap;
  }

  public Map<String, String> getConstantValueMap() {
    return constantValueMap;
  }

  public void setConstantValueMap(Map<String, String> constantValueMap) {
    this.constantValueMap = constantValueMap;
  }

  public Map<String, ExternalSingleCode> getSingleCodeMap() {
    return singleCodeMap;
  }

  public void setSingleCodeMap(Map<String, ExternalSingleCode> singleCodeMap) {
    this.singleCodeMap = singleCodeMap;
  }

  public Map<String, Set<ValuesetBindingDataModel>> getValuesetMap() {
    return valuesetMap;
  }

  public void setValuesetMap(Map<String, Set<ValuesetBindingDataModel>> valuesetMap) {
    this.valuesetMap = valuesetMap;
  }

  /**
   * @param cp
   * @param valuesets
   */
  public void putModel(ConformanceProfile cp,
      Map<String, ValuesetBindingDataModel> valuesetBindingDataModelMap,
      ConformanceStatementRepository conformanceStatementRepository,
      PredicateRepository predicateRepository) {
    this.model = cp;
    
    if (cp.getBinding() != null){
      if(cp.getBinding().getConformanceStatementIds() != null){
        for(String csId: cp.getBinding().getConformanceStatementIds()){
          conformanceStatementRepository.findById(csId).ifPresent(cs -> this.conformanceStatementMap.add(cs));
        }
      }
    }
    
    if (cp.getBinding().getChildren() != null) {
     // this.popPathBinding(cp.getBinding().getChildren(), null, predicateRepository, valuesetBindingDataModelMap);
    }
  }

  private void popPathBinding(Set<StructureElementBinding> sebs, String path, PredicateRepository predicateRepository,  Map<String, ValuesetBindingDataModel> valuesetBindingDataModelMap) {
    for (StructureElementBinding seb : sebs) {
      String key;
      if(path == null){
        key = seb.getLocationInfo().getPosition() + "";
      }else {
        key = path + "." + seb.getLocationInfo().getPosition();
      }
      
      if(seb.getComments() != null && seb.getComments().size() > 0){
        this.commentMap.put(key, seb.getComments());
      }
      
      if(seb.getPredicateId() != null){
        predicateRepository.findById(seb.getPredicateId()).ifPresent(cp -> this.predicateMap.put(key, cp));
      }
      
      if(seb.getConstantValue() != null){
        this.constantValueMap.put(key, seb.getConstantValue());
      }
      
      if(seb.getExternalSingleCode() != null){
        this.singleCodeMap.put(key, seb.getExternalSingleCode());
      }
      
      if(seb.getValuesetBindings() != null && seb.getValuesetBindings().size() > 0){
        Set<ValuesetBindingDataModel> vbdm = new HashSet<ValuesetBindingDataModel>();
        for(ValuesetBinding vb : seb.getValuesetBindings()) {
          ValuesetBindingDataModel valuesetBindingDataModel = valuesetBindingDataModelMap.get(vb.getValuesetId());
          if(valuesetBindingDataModel != null) {
            valuesetBindingDataModel.setValuesetBinding(vb);
            vbdm.add(valuesetBindingDataModel);
          }
        }
        
        if(vbdm != null && vbdm.size() > 0) {
          this.valuesetMap.put(key, vbdm);          
        }
      }
      
      if (seb.getChildren() != null) {
       // this.popPathBinding(seb.getChildren(), key, predicateRepository, valuesetBindingDataModelMap);
      }
    }
  }
}
