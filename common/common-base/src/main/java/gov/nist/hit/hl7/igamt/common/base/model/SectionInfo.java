package gov.nist.hit.hl7.igamt.common.base.model;

import java.util.Date;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;

public class SectionInfo {

	protected String label;
	protected SectionType sectionType;
	protected String id;
	protected Date dateUpdated;
	protected DomainInfo domainInfo;
	protected String username;
	protected Type type;
	protected Set<String> participants; 
	protected boolean readOnly;
	
	
	public String getLabel() {
		return label;
	}
	public void setLabel(String label) {
		this.label = label;
	}
	public Date getDateUpdated() {
		return dateUpdated;
	}
	public void setDateUpdated(Date dateUpdated) {
		this.dateUpdated = dateUpdated;
	}
	public DomainInfo getDomainInfo() {
		return domainInfo;
	}
	public void setDomainInfo(DomainInfo domainInfo) {
		this.domainInfo = domainInfo;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public Type getType() {
		return type;
	}
	public void setType(Type type) {
		this.type = type;
	}
	public Set<String> getParticipants() {
		return participants;
	}
	public void setParticipants(Set<String> participants) {
		this.participants = participants;
	}
	public boolean isReadOnly() {
		return readOnly;
	}
	public void setReadOnly(boolean readOnly) {
		this.readOnly = readOnly;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public SectionType getSectionType() {
		return sectionType;
	}
	public void setSectionType(SectionType sectionType) {
		this.sectionType = sectionType;
	}
	
	public void complete( SectionInfo section,Resource elm, SectionType type,boolean readOnly) {
	section.setUsername(elm.getUsername());
	section.setSectionType(type);
	section.setDateUpdated(elm.getUpdateDate());
	section.setLabel(elm.getLabel());
	section.setId(elm.getId());
	section.setReadOnly(readOnly);
	section.setLabel(elm.getLabel());
	section.setDomainInfo(elm.getDomainInfo());
	}

	
	

}
