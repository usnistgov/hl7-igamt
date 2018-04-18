package gov.nist.hit.hl7.igamt.ig.model;

import gov.nist.hit.hl7.igamt.shared.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.shared.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.shared.domain.Type;

public class ElementTreeData  extends TreeData{
	

	private CompositeKey key;
	private DomainInfo domainInfo;
	private String ext; 
	private String description;
	
	public ElementTreeData() {
		super();
		// TODO Auto-generated constructor stub
	}
	public DomainInfo getDomainInfo() {
		return domainInfo;
	}
	public void setDomainInfo(DomainInfo domainInfo) {
		this.domainInfo = domainInfo;
	}
	public String getExt() {
		return ext;
	}
	public void setExt(String ext) {
		this.ext = ext;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}

	public CompositeKey getKey() {
		return key;
	}
	public void setKey(CompositeKey key) {
		this.key = key;
	}

}
