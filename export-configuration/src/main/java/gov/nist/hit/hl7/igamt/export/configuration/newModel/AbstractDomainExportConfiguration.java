package gov.nist.hit.hl7.igamt.export.configuration.newModel;

import java.util.Date;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.annotation.Version;

import gov.nist.hit.hl7.igamt.common.base.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.PublicationInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;

public class AbstractDomainExportConfiguration {

	private Boolean creationDate;
	private Boolean updateDate;
	private Boolean name;
	private Boolean type;
	private Boolean origin;
	private Boolean publicationInfo;
	private Boolean domainInfo;
	private Boolean comment;
	private Boolean description;
	private Boolean createdFrom;
	private Boolean authorNotes;
	private Boolean usageNotes;
	private Boolean from;
	private Boolean version;
	
	public Boolean getCreationDate() {
		return creationDate;
	}
	public void setCreationDate(Boolean creationDate) {
		this.creationDate = creationDate;
	}
	public Boolean getUpdateDate() {
		return updateDate;
	}
	public void setUpdateDate(Boolean updateDate) {
		this.updateDate = updateDate;
	}
	public Boolean getName() {
		return name;
	}
	public void setName(Boolean name) {
		this.name = name;
	}
	public Boolean getType() {
		return type;
	}
	public void setType(Boolean type) {
		this.type = type;
	}
	public Boolean getOrigin() {
		return origin;
	}
	public void setOrigin(Boolean origin) {
		this.origin = origin;
	}
	public Boolean getPublicationInfo() {
		return publicationInfo;
	}
	public void setPublicationInfo(Boolean publicationInfo) {
		this.publicationInfo = publicationInfo;
	}
	public Boolean getDomainInfo() {
		return domainInfo;
	}
	public void setDomainInfo(Boolean domainInfo) {
		this.domainInfo = domainInfo;
	}
	public Boolean getComment() {
		return comment;
	}
	public void setComment(Boolean comment) {
		this.comment = comment;
	}
	public Boolean getDescription() {
		return description;
	}
	public void setDescription(Boolean description) {
		this.description = description;
	}
	public Boolean getCreatedFrom() {
		return createdFrom;
	}
	public void setCreatedFrom(Boolean createdFrom) {
		this.createdFrom = createdFrom;
	}
	public Boolean getAuthorNotes() {
		return authorNotes;
	}
	public void setAuthorNotes(Boolean authorNotes) {
		this.authorNotes = authorNotes;
	}
	public Boolean getUsageNotes() {
		return usageNotes;
	}
	public void setUsageNotes(Boolean usageNotes) {
		this.usageNotes = usageNotes;
	}
	public Boolean getFrom() {
		return from;
	}
	public void setFrom(Boolean from) {
		this.from = from;
	}
	public Boolean getVersion() {
		return version;
	}
	public void setVersion(Boolean version) {
		this.version = version;
	}
	
	
}
