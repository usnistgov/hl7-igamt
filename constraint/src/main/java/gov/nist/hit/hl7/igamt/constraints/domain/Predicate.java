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
package gov.nist.hit.hl7.igamt.constraints.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

import gov.nist.hit.hl7.igamt.common.base.domain.Usage;

/**
 * @author jungyubw
 *
 */

@Document
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "type")
@JsonSubTypes({@JsonSubTypes.Type(value = FreeTextPredicate.class, name = "FREE"),
    @JsonSubTypes.Type(value = AssertionPredicate.class, name = "ASSERTION")})
public abstract class Predicate {
  @Id
  private String id;
  protected ConstraintType type;
  protected Usage trueUsage;
  protected Usage falseUsage;

  public Predicate() {
    super();
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

  public ConstraintType getType() {
    return type;
  }

  public void setType(ConstraintType type) {
    this.type = type;
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }
  
  public String generateDescription() {
    if(this instanceof  FreeTextPredicate){
      FreeTextPredicate cp = (FreeTextPredicate)this;
      return cp.getFreeText();
    }else if(this instanceof  AssertionPredicate){
      AssertionPredicate cp = (AssertionPredicate)this;
      if(cp.getAssertion() != null) return cp.getAssertion().getDescription();
    }
    return null;
  }


}
