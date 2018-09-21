package gov.nist.hit.hl7.igamt.coconstraints.domain;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonTypeName;

@JsonTypeName("Code")
public class CodeCell extends CoConstraintTableCell {
	
	private String value;
	private List<String> location;

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public List<String> getLocation() {
		return location.stream().map((y) -> {
			return y;
		}).collect(Collectors.toList());
	}
	
	@JsonIgnore
	public List<String> getLocations() {
		return location.stream().map((y) -> {
			return y+"[1]";
		}).collect(Collectors.toList());
	}

	public void setLocation(List<String> location) {
		this.location = location;
	}
	
	public CodeCell clone(){
		CodeCell code = new CodeCell();
		code.value = this.value;
		code.location = new ArrayList<>(this.location);
		code.type = this.type;
		return code;
	}
	
}
