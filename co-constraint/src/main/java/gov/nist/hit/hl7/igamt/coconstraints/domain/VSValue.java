package gov.nist.hit.hl7.igamt.coconstraints.domain;

import java.util.ArrayList;
import java.util.List;

public class VSValue {
	
	private String bindingIdentifier;
	private String bindingStrength;
	private List<String> bindingLocation;
	private String hl7Version;
	private String name;
	private String scope;
	
	public String getBindingIdentifier() {
		return bindingIdentifier;
	}
	public void setBindingIdentifier(String bindingIdentifier) {
		this.bindingIdentifier = bindingIdentifier;
	}
	public String getBindingStrength() {
		return bindingStrength;
	}
	public void setBindingStrength(String bindingStrength) {
		this.bindingStrength = bindingStrength;
	}
	public List<String> getBindingLocation() {
		return bindingLocation;
	}
	public void setBindingLocation(List<String> bindingLocation) {
		this.bindingLocation = bindingLocation;
	}
	public String getHl7Version() {
		return hl7Version;
	}
	public void setHl7Version(String hl7Version) {
		this.hl7Version = hl7Version;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getScope() {
		return scope;
	}
	public void setScope(String scope) {
		this.scope = scope;
	}
	
	public VSValue clone(){
		VSValue tmp = new VSValue();
		tmp.bindingIdentifier = this.bindingIdentifier;
		tmp.bindingStrength = this.bindingStrength;
		tmp.hl7Version = this.hl7Version;
		tmp.name = this.name;
		tmp.scope = this.scope;
		tmp.bindingLocation = new ArrayList<>(this.bindingLocation);
		return tmp;
	}
	
}
