package gov.nist.hit.hl7.igamt.common.base.wrappers;

import java.util.List;

import gov.nist.hit.hl7.igamt.common.base.domain.CodeType;
import gov.nist.hit.hl7.igamt.common.base.domain.ContentDefinition;
import gov.nist.hit.hl7.igamt.common.base.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Extensibility;
import gov.nist.hit.hl7.igamt.common.base.domain.ProfileType;
import gov.nist.hit.hl7.igamt.common.base.domain.Role;
import gov.nist.hit.hl7.igamt.common.base.domain.SourceType;
import gov.nist.hit.hl7.igamt.common.base.domain.Stability;
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
	private List<Substitue> substitutes;
	private String fixedExtension;
	private ProfileType profileType;
	private Role role;
	private Stability stability = Stability.Undefined;
	private Extensibility extensibility = Extensibility.Undefined;
	private ContentDefinition contentDefinition = ContentDefinition.Undefined;
	private CodeType codeType;
	private boolean fromProvider; // do not look in DB
	private boolean trackLatest;
	

	public Role getRole() {
		return role;
	}
	public void setRole(Role role) {
		this.role = role;
	}
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
	public List<Substitue> getSubstitutes() {
		return substitutes;
	}
	public void setSubstitutes(List<Substitue> substitutes) {
		this.substitutes = substitutes;
	}
	public String getFixedExtension() {
		return fixedExtension;
	}
	public void setFixedExtension(String fixedExtension) {
		this.fixedExtension = fixedExtension;
	}
	public ProfileType getProfileType() {
		return profileType;
	}
	public void setProfileType(ProfileType profileType) {
		this.profileType = profileType;
	}
	public CodeType getCodeType() {
		return codeType;
	}
	public void setCodeType(CodeType codeType) {
		this.codeType = codeType;
	}
	public ContentDefinition getContentDefinition() {
		return contentDefinition;
	}
	public void setContentDefinition(ContentDefinition contentDefinition) {
		this.contentDefinition = contentDefinition;
	}
	public Extensibility getExtensibility() {
		return extensibility;
	}
	public void setExtensibility(Extensibility extensibility) {
		this.extensibility = extensibility;
	}
	public Stability getStability() {
		return stability;
	}
	public void setStability(Stability stability) {
		this.stability = stability;
	}
	public boolean isFromProvider() {
		return fromProvider;
	}
	public void setFromProvider(boolean fromProvider) {
		this.fromProvider = fromProvider;
	}
	public boolean isTrackLatest() {
		return trackLatest;
	}
	public void setTrackLatest(boolean trackLatest) {
		this.trackLatest = trackLatest;
	}
	
}
