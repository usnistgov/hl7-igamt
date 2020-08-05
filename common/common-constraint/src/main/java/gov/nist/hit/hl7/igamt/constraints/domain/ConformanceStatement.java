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
import gov.nist.hit.hl7.igamt.constraints.domain.assertion.InstancePath;

/**
 * @author jungyubw
 *
 */
@Document
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "type")
@JsonSubTypes({@JsonSubTypes.Type(value = FreeTextConformanceStatement.class, name = "FREE"),
    @JsonSubTypes.Type(value = AssertionConformanceStatement.class, name = "ASSERTION")})
public class ConformanceStatement implements Serializable{
  /**
   * 
   */
  private static final long serialVersionUID = 5188411006490923627L;
  @Id
  private String id;
  private ConstraintType type;
  protected String identifier;
  private InstancePath context;
  
  private Level level;
  @Deprecated
  private String structureId;
  @Deprecated
  private HashSet<String> sourceIds;
  @Deprecated
  private String igDocumentId;

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

  public InstancePath getContext() {
    return context;
  }

  public void setContext(InstancePath context) {
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
  public String getIgDocumentId() {
    return igDocumentId;
  }

  @Deprecated
  public void setIgDocumentId(String igDocumentId) {
    this.igDocumentId = igDocumentId;
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

@Override
public String toString() {
	return "ConformanceStatement [id=" + id + ", type=" + type + ", identifier=" + identifier + ", context=" + context
			+ ", level=" + level + ", structureId=" + structureId + ", sourceIds=" + sourceIds + ", igDocumentId="
			+ igDocumentId + "]";
}
  
}