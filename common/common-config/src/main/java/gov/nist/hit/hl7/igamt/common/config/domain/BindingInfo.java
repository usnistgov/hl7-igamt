package gov.nist.hit.hl7.igamt.common.config.domain;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class BindingInfo {
	private boolean multiple = true;
	private boolean coded = false;
	private boolean allowSingleCode= true; 
	private boolean complex; 
	private boolean locationIndifferent = true;
    private HashMap<String, List<BindingLocationOption>> AllowedBindingLocations = new HashMap<String, List<BindingLocationOption>>();
    private Set<BindingLocationInfo> LocationExceptions= new HashSet<BindingLocationInfo>();
	public boolean isMultiple() {
		return multiple;
	}
	public void setMultiple(boolean multiple) {
		this.multiple = multiple;
	}
	public boolean isCoded() {
		return coded;
	}
	public void setCoded(boolean coded) {
		this.coded = coded;
	}
	public boolean isAllowSingleCode() {
		return allowSingleCode;
	}
	public void setAllowSingleCode(boolean allowSingleCode) {
		this.allowSingleCode = allowSingleCode;
	}
	public boolean isComplex() {
		return complex;
	}
	public void setComplex(boolean complex) {
		this.complex = complex;
	}
	public boolean isLocationIndifferent() {
		return locationIndifferent;
	}
	public void setLocationIndifferent(boolean locationIndeferent) {
		this.locationIndifferent = locationIndeferent;
	}
	public Set<BindingLocationInfo> getLocationExceptions() {
		return LocationExceptions;
	}
	public void setLocationExceptions(Set<BindingLocationInfo> locationExceptions) {
		LocationExceptions = locationExceptions;
	}
    
	public static BindingInfo createCoded() {
		BindingInfo coded = new BindingInfo();
		coded.setCoded(true);
		coded.setComplex(true);
		coded.setAllowSingleCode(true);
		coded.setMultiple(true);
		return coded;
	}
	
	public static BindingInfo createSimple() {
		BindingInfo simple = new BindingInfo();
		simple.setCoded(false);
		simple.setComplex(false);
		simple.setAllowSingleCode(true);
		simple.setMultiple(true);
		return simple;
	}
	public HashMap<String, List<BindingLocationOption>> getAllowedBindingLocations() {
		return AllowedBindingLocations;
	}
	public void setAllowedBindingLocations(HashMap<String, List<BindingLocationOption>> allowedBindingLocations) {
		AllowedBindingLocations = allowedBindingLocations;
	}
	
	
	
}
