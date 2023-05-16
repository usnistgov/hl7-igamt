package gov.nist.hit.hl7.igamt.common.base.domain;

public class CustomAttribute {
	
	private String name;
	private String  value;
	private int position;
	
	
	public CustomAttribute() {
		super();
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getValue() {
		return value;
	}
	public void setValue(String value) {
		this.value = value;
	}
	public int getPosition() {
		return position;
	}
	public void setPosition(int position) {
		this.position = position;
	}


}
