package gov.nist.hit.hl7.igamt.export.configuration.newModel;

import java.util.Date;
import java.util.HashMap;

import gov.nist.diff.domain.DeltaAction;
import gov.nist.hit.hl7.igamt.export.configuration.domain.DeltaConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.DeltaExportConfigMode;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.annotation.Version;

import gov.nist.hit.hl7.igamt.common.base.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.PublicationInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;

public class AbstractDomainExportConfiguration {

	private boolean creationDate;
	private boolean updateDate;
	private boolean name;
	private boolean type ;
	private boolean origin ;
	private boolean publicationInfo  ;
	private boolean publicationDate  ;
	private boolean domainInfo;
	private boolean comment;
	private boolean description;
	private boolean createdFrom;
	private boolean authorNotes;
	private boolean usageNotes;
	private boolean from;
	private boolean version;
	private boolean domainCompatibilityVersion;
	private boolean deltaMode;
	private DeltaConfiguration deltaConfig;

	
	
	
	public AbstractDomainExportConfiguration(boolean creationDate, boolean updateDate, boolean name, boolean type,
			boolean origin, boolean publicationInfo, boolean publicationDate, boolean domainInfo, boolean comment,
			boolean description, boolean createdFrom, boolean authorNotes, boolean usageNotes, boolean from,
			boolean version, boolean domainCompatibilityVersion, boolean deltaMode, DeltaConfiguration deltaConfig) {
		super();
		this.creationDate = creationDate;
		this.updateDate = updateDate;
		this.name = name;
		this.type = type;
		this.origin = origin;
		this.publicationInfo = publicationInfo;
		this.publicationDate = publicationDate;
		this.domainInfo = domainInfo;
		this.comment = comment;
		this.description = description;
		this.createdFrom = createdFrom;
		this.authorNotes = authorNotes;
		this.usageNotes = usageNotes;
		this.from = from;
		this.version = version;
		this.domainCompatibilityVersion = domainCompatibilityVersion;
		this.deltaMode = deltaMode;
		this.deltaConfig = deltaConfig;
	}
	public AbstractDomainExportConfiguration() {
		super();
		// TODO Auto-generated constructor stub
	}
	public boolean isCreationDate() {
		return creationDate;
	}
	public void setCreationDate(boolean creationDate) {
		this.creationDate = creationDate;
	}
	public boolean isUpdateDate() {
		return updateDate;
	}
	public void setUpdateDate(boolean updateDate) {
		this.updateDate = updateDate;
	}
	public boolean isName() {
		return name;
	}
	public void setName(boolean name) {
		this.name = name;
	}
	public boolean isType() {
		return type;
	}
	public void setType(boolean type) {
		this.type = type;
	}
	public boolean isOrigin() {
		return origin;
	}
	public void setOrigin(boolean origin) {
		this.origin = origin;
	}
	public boolean isPublicationInfo() {
		return publicationInfo;
	}
	public void setPublicationInfo(boolean publicationInfo) {
		this.publicationInfo = publicationInfo;
	}
	public boolean isPublicationDate() {
		return publicationDate;
	}
	public void setPublicationDate(boolean publicationDate) {
		this.publicationDate = publicationDate;
	}
	public boolean isDomainInfo() {
		return domainInfo;
	}
	public void setDomainInfo(boolean domainInfo) {
		this.domainInfo = domainInfo;
	}
	public boolean isComment() {
		return comment;
	}
	public void setComment(boolean comment) {
		this.comment = comment;
	}
	public boolean isDescription() {
		return description;
	}
	public void setDescription(boolean description) {
		this.description = description;
	}
	public boolean isCreatedFrom() {
		return createdFrom;
	}
	public void setCreatedFrom(boolean createdFrom) {
		this.createdFrom = createdFrom;
	}
	public boolean isAuthorNotes() {
		return authorNotes;
	}
	public void setAuthorNotes(boolean authorNotes) {
		this.authorNotes = authorNotes;
	}
	public boolean isUsageNotes() {
		return usageNotes;
	}
	public void setUsageNotes(boolean usageNotes) {
		this.usageNotes = usageNotes;
	}
	public boolean isFrom() {
		return from;
	}
	public void setFrom(boolean from) {
		this.from = from;
	}
	public boolean isVersion() {
		return version;
	}
	public void setVersion(boolean version) {
		this.version = version;
	}
	public boolean isDomainCompatibilityVersion() {
		return domainCompatibilityVersion;
	}
	public void setDomainCompatibilityVersion(boolean domainCompatibilityVersion) {
		this.domainCompatibilityVersion = domainCompatibilityVersion;
	}
	public void setDeltaMode(boolean deltaMode) {
		this.deltaMode = deltaMode;
	}
	public void setDeltaConfig(DeltaConfiguration deltaConfig) {
		this.deltaConfig = deltaConfig;
	}

	public boolean isDeltaMode() {
		return deltaMode;
	}

	public DeltaConfiguration getDeltaConfig() {
		return deltaConfig;
	}
}
	

