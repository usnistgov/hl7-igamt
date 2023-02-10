package gov.nist.hit.hl7.igamt.display.model;

import gov.nist.hit.hl7.igamt.common.base.domain.PublicationInfo;

public class PublishingInfo {
	Boolean draft;
	PublicationInfo info;
	
	
	public PublishingInfo() {
		super();
	}
	public Boolean getDraft() {
		return draft;
	}
	public void setDraft(Boolean draft) {
		this.draft = draft;
	}
	public PublicationInfo getInfo() {
		return info;
	}
	public void setInfo(PublicationInfo info) {
		this.info = info;
	}

}
