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
import java.util.Map;

import gov.nist.hit.hl7.igamt.common.change.entity.domain.ChangeReason;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
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
	private boolean locked;
	private Level level;
	@Deprecated
	private String structureId;
	@Deprecated
	private HashSet<String> sourceIds;
	@Deprecated
	private String igDocumentId;
	private ConformanceStatementStrength strength;
	
	@Transient
	String resourceId;

	private Map<PropertyType, ChangeReason> changeLog;

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

	public Map<PropertyType, ChangeReason> getChangeLog() {
		return changeLog;
	}

	public void setChangeLog(Map<PropertyType, ChangeReason> changeLog) {
		this.changeLog = changeLog;
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

	public ConformanceStatementStrength getStrength() {
		return strength;
	}

	public void setStrength(ConformanceStatementStrength strength) {
		this.strength = strength;
	}

	@Override
	public String toString() {
		return "ConformanceStatement [id=" + id + ", type=" + type + ", identifier=" + identifier + ", context=" + context
				+ ", level=" + level + ", structureId=" + structureId + ", sourceIds=" + sourceIds + ", igDocumentId="
				+ igDocumentId + "]";
	}

	public boolean isLocked() {
		return locked;
	}

	public void setLocked(boolean locked) {
		this.locked = locked;
	}
	
	public String getResourceId() {
		return resourceId;
	}

	public void setResourceId(String resourceId) {
		this.resourceId = resourceId;
	} 
	
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		return result;
	}


	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		ConformanceStatement other = (ConformanceStatement) obj;
		if (id == null) {
			return false;
		} else if (!id.equals(other.id))
			return false;
		return true;
	}


}