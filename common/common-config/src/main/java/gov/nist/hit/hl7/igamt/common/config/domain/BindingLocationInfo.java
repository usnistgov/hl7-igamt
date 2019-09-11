package gov.nist.hit.hl7.igamt.common.config.domain;

import java.util.List;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;

public class BindingLocationInfo {
	private Type type;
	private String name;
	private int location;
	private List<String> version;
	public BindingLocationInfo(Type type, String name, int location,  List<String> version) {
		super();
		this.type = type;
		this.name = name;
		this.location = location;
		this.version = version;
	}
	public Type getType() {
		return type;
	}
	public void setType(Type type) {
		this.type = type;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public int getLocation() {
		return location;
	}
	public void setLocation(int location) {
		this.location = location;
	}
	public List<String>  getVersion() {
		return version;
	}
	public void setVersion(List<String> version) {
		this.version = version;
	}

}
