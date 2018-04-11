package gov.nist.hit.hl7.igamt.ig.model;


import gov.nist.hit.hl7.igamt.shared.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.shared.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.shared.domain.Type;

public class TreeData {
	
	private String label; 
	private DomainInfo domainInfo;
	private String ext; 
	private String description;
	private Type types; 
	private CompositeKey key;
	
	
	
	public TreeData(String label, DomainInfo domainInfo, String ext, String description, Type types, CompositeKey key) {
		super();
		this.label = label;
		this.domainInfo = domainInfo;
		this.ext = ext;
		this.description = description;
		this.types = types;
		this.key = key;
	}
	public String getLabel() {
		return label;
	}
	public void setLabel(String label) {
		this.label = label;
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
	public Type getTypes() {
		return types;
	}
	public void setTypes(Type types) {
		this.types = types;
	}
	public CompositeKey getKey() {
		return key;
	}
	public void setKey(CompositeKey key) {
		this.key = key;
	}

	

}
