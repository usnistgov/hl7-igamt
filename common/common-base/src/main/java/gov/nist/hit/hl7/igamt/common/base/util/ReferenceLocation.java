package gov.nist.hit.hl7.igamt.common.base.util;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;

public class ReferenceLocation {

	private Type type; 
	private String path; 
	private String label;
	
	public ReferenceLocation(Type type, String path, String label) {
		super();
		this.type = type;
		this.path = path;
		this.label = label;
	}
	public ReferenceLocation() {
		// TODO Auto-generated constructor stub
	}
	public Type getType() {
		return type;
	}
	public void setType(Type type) {
		this.type = type;
	}
	public String getPath() {
		return path;
	}
	public void setPath(String path) {
		this.path = path;
	}
	public String getLabel() {
		return label;
	}
	public void setLabel(String label) {
		this.label = label;
	}	
}
