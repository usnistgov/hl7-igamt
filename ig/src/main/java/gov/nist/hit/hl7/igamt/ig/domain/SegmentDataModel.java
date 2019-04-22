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
package gov.nist.hit.hl7.igamt.ig.domain;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import gov.nist.hit.hl7.igamt.coconstraints.domain.CoConstraintTable;
import gov.nist.hit.hl7.igamt.common.binding.domain.Comment;
import gov.nist.hit.hl7.igamt.common.binding.domain.ExternalSingleCode;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatement;
import gov.nist.hit.hl7.igamt.constraints.domain.Predicate;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;

/**
 * @author jungyubw
 *
 */
public class SegmentDataModel {
  private Segment model;

  private Map<String, ConformanceStatement> conformanceStatementMap = new HashMap<String, ConformanceStatement>();
  private Map<String, Predicate> predicateMap = new HashMap<String, Predicate>();
  private Map<String, Comment> commentMap = new HashMap<String, Comment>();
  private Map<String, String> constantValueMap = new HashMap<String, String>();
  private Map<String, ExternalSingleCode> singleCodeMap = new HashMap<String, ExternalSingleCode>();
  private Map<String, Set<ValuesetBindingDataModel>> valuesetMap = new HashMap<String, Set<ValuesetBindingDataModel>>();
  private CoConstraintTable coConstraintTable = new CoConstraintTable();

  public Segment getModel() {
    return model;
  }

  public void setModel(Segment model) {
    this.model = model;
  }

  public Map<String, ConformanceStatement> getConformanceStatementMap() {
    return conformanceStatementMap;
  }

  public void setConformanceStatementMap(
      Map<String, ConformanceStatement> conformanceStatementMap) {
    this.conformanceStatementMap = conformanceStatementMap;
  }

  public Map<String, Predicate> getPredicateMap() {
    return predicateMap;
  }

  public void setPredicateMap(Map<String, Predicate> predicateMap) {
    this.predicateMap = predicateMap;
  }

  public Map<String, Comment> getCommentMap() {
    return commentMap;
  }

  public void setCommentMap(Map<String, Comment> commentMap) {
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

  public CoConstraintTable getCoConstraintTable() {
    return coConstraintTable;
  }

  public void setCoConstraintTable(CoConstraintTable coConstraintTable) {
    this.coConstraintTable = coConstraintTable;
  }

  /**
   * @param s
   * @param valuesets
   */
  public void putModel(Segment s, Set<ValuesetDataModel> valuesets) {
    // TODO Auto-generated method stub
    
  }


}
