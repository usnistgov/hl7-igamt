package gov.nist.hit.hl7.igamt.common.base.wrappers;

import java.util.List;
import java.util.Map;

import gov.nist.hit.hl7.igamt.common.base.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;

public class ResourcePicker {

	private String id; 
	private String fixedName;
	private String variableName;
	private String description; 
	private DomainInfo domainInfo;
	private Type type;
	private Map<VariableKey, List<String>> complements;	

	public String getFixedName() {
		return fixedName;
	}
	public void setFixedName(String fixedName) {
		this.fixedName = fixedName;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public DomainInfo getDomainInfo() {
		return domainInfo;
	}
	public void setDomainInfo(DomainInfo domainInfo) {
		this.domainInfo = domainInfo;
	}
	public Type getType() {
		return type;
	}
	public void setType(Type type) {
		this.type = type;
	}
	public Map<VariableKey, List<String>> getComplements() {
		return complements;
	}
	public void setComplements(Map<VariableKey, List<String>> complements) {
		this.complements = complements;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getVariableName() {
		return variableName;
	}
	public void setVariableName(String variableName) {
		this.variableName = variableName;
	}
}
