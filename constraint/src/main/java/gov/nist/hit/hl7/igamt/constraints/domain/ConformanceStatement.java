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

import gov.nist.hit.hl7.igamt.constraints.domain.AssertionConformanceStatement;
import gov.nist.hit.hl7.igamt.constraints.domain.ConstraintType;
import gov.nist.hit.hl7.igamt.constraints.domain.FreeTextConformanceStatement;
import gov.nist.hit.hl7.igamt.constraints.domain.assertion.Path;

/**
 * @author jungyubw
 *
 */
@Document
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "type")
@JsonSubTypes({@JsonSubTypes.Type(value = FreeTextConformanceStatement.class, name = "FREE"),
    @JsonSubTypes.Type(value = AssertionConformanceStatement.class, name = "ASSERTION")})
public class ConformanceStatement {
  @Id
  private String id;
  private ConstraintType type;
  protected String identifier;
  private Path context;

  public ConformanceStatement() {
    super();
  }

  public String getIdentifier() {
    return identifier;
  }

  public void setIdentifier(String identifier) {
    this.identifier = identifier;
  }

  public ConstraintType getType() {
    return type;
  }

  public void setType(ConstraintType type) {
    this.type = type;
  }

  public Path getContext() {
    return context;
  }

  public void setContext(Path context) {
    this.context = context;
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }
  
  public String generateDescription() {
    if(this instanceof  FreeTextConformanceStatement){
      FreeTextConformanceStatement cs = (FreeTextConformanceStatement)this;
      return cs.getFreeText();
    }else if(this instanceof  AssertionConformanceStatement){
      AssertionConformanceStatement cs = (AssertionConformanceStatement)this;
      if(cs.getAssertion() != null) return cs.getAssertion().getDescription();
    }
    return null;
  }


}