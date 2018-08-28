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
package gov.nist.hit.hl7.igamt.datatype.domain;

import gov.nist.hit.hl7.igamt.common.base.domain.Usage;

/**
 * @author jungyubw
 *
 */
public class DateTimePredicate {
  public enum PredicateType {
    PRESENCE, NOTPRESENCE, EQUAL, NOTEQUAL
  }

  private Usage trueUsage;
  private Usage falseUsage;
  private DateTimeComponentDefinition target;
  private PredicateType predicateType;
  private String value;


  public DateTimePredicate(Usage trueUsage, Usage falseUsage, DateTimeComponentDefinition target,
      PredicateType predicateType, String value) {
    super();
    this.trueUsage = trueUsage;
    this.falseUsage = falseUsage;
    this.target = target;
    this.predicateType = predicateType;
    this.value = value;
  }

  public Usage getTrueUsage() {
    return trueUsage;
  }

  public void setTrueUsage(Usage trueUsage) {
    this.trueUsage = trueUsage;
  }

  public Usage getFalseUsage() {
    return falseUsage;
  }

  public void setFalseUsage(Usage falseUsage) {
    this.falseUsage = falseUsage;
  }

  public DateTimeComponentDefinition getTarget() {
    return target;
  }

  public void setTarget(DateTimeComponentDefinition target) {
    this.target = target;
  }

  public PredicateType getPredicateType() {
    return predicateType;
  }

  public void setPredicateType(PredicateType predicateType) {
    this.predicateType = predicateType;
  }

  public String getValue() {
    return value;
  }

  public void setValue(String value) {
    this.value = value;
  }


}
