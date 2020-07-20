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

import java.io.Serializable;
import java.util.HashSet;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

import gov.nist.hit.hl7.igamt.common.base.domain.ConstraintType;
import gov.nist.hit.hl7.igamt.common.base.domain.Level;
import gov.nist.hit.hl7.igamt.common.base.domain.Usage;
import gov.nist.hit.hl7.igamt.constraints.domain.assertion.Path;

/**
 * @author jungyubw
 *
 */

@Document
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "type")
@JsonSubTypes({@JsonSubTypes.Type(value = FreeTextPredicate.class, name = "FREE"),
    @JsonSubTypes.Type(value = AssertionPredicate.class, name = "ASSERTION")})
public class Predicate implements Serializable{

  private static final long serialVersionUID = 160188380051171488L;
  
  @Id
  private String id;
  private String identifier;
  protected ConstraintType type;
  protected Usage trueUsage;
  protected Usage falseUsage;
  private Path context;
  private Level level;
  
  @Deprecated
  private String structureId;
  @Deprecated
  private HashSet<String> sourceIds;
  @Deprecated
  private String igDocumentId;
  @Deprecated
  private String location;

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
  
  public Path getContext() {
	return context;
  }

  public void setContext(Path context) {
    this.context = context;
  }

  public String getIdentifier() {
    return identifier;
  }

  public void setIdentifier(String identifier) {
    this.identifier = identifier;
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

  public Level getLevel() {
    return level;
  }
  
  public void setLevel(Level level) {
    this.level = level;
  }

  @Deprecated
  public String getStructureId() {
    return structureId;
  }

  @Deprecated
  public void setStructureId(String structureId) {
    this.structureId = structureId;
  }
  
  @Deprecated
  public HashSet<String> getSourceIds() {
    return sourceIds;
  }

  @Deprecated
  public void setSourceIds(HashSet<String> sourceIds) {
    this.sourceIds = sourceIds;
  }

  @Deprecated
  public String getIgDocumentId() {
    return igDocumentId;
  }

  @Deprecated
  public void setIgDocumentId(String igDocumentId) {
    this.igDocumentId = igDocumentId;
  }

  @Deprecated
  public void addSourceId(String sourceId) {
    if(this.sourceIds == null) this.sourceIds = new HashSet<String>();
    this.sourceIds.add(sourceId);
  }

  @Deprecated
  public void removeSourceId(String sourceId) {
    if(this.sourceIds != null) {
      this.sourceIds.remove(sourceId);
    }
  }

  @Deprecated
  public String getLocation() {
    return location;
  }

  @Deprecated
  public void setLocation(String location) {
    this.location = location;
  }
}
