package gov.nist.hit.hl7.igamt.common.base.wrappers;

import gov.nist.hit.hl7.igamt.common.base.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.SourceType;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;

public class AddingInfo {
	
	private String originalId;
	private String id;
	private String name;
	private String structId;
	private String description;
	private Type type;
	private DomainInfo domainInfo;
	private String ext;
	private boolean flavor;
	private boolean includeChildren;
	private boolean numberOfChildren;
	private SourceType sourceType;
	private String url;
	private String oid;
	
	public String getOriginalId() {
		return originalId;
	}
	public void setOriginalId(String originalId) {
		this.originalId = originalId;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getStructId() {
		return structId;
	}
	public void setStructId(String structId) {
		this.structId = structId;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public Type getType() {
		return type;
	}
	public void setType(Type type) {
		this.type = type;
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
	public boolean isFlavor() {
		return flavor;
	}
	public void setFlavor(boolean flavor) {
		this.flavor = flavor;
	}
	public boolean isNumberOfChildren() {
		return numberOfChildren;
	}
	public void setNumberOfChildren(boolean numberOfChildren) {
		this.numberOfChildren = numberOfChildren;
	}
	public boolean isIncludeChildren() {
		return includeChildren;
	}
	public void setIncludeChildren(boolean includeChildren) {
		this.includeChildren = includeChildren;
	}
	public SourceType getSourceType() {
		return sourceType;
	}
	public void setSourceType(SourceType sourceType) {
		this.sourceType = sourceType;
	}
	public String getUrl() {
		// TODO Auto-generated method stub
		return this.url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public String getOid() {
		return oid;
	}
	public void setOid(String oid) {
		this.oid = oid;
	} 
	
}
