package gov.nist.hit.hl7.igamt.serialization.predicate;

public class PredicateExportInfo {
	private String location;
	private String description;
	private String trueUsage;
	private String falseUsage;
	
	public String getLocation() {
		return location;
	}
	public void setLocation(String location) {
		this.location = location;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getTrueUsage() {
		return trueUsage;
	}
	public void setTrueUsage(String trueUsage) {
		this.trueUsage = trueUsage;
	}
	public String getFalseUsage() {
		return falseUsage;
	}
	public void setFalseUsage(String falseUsage) {
		this.falseUsage = falseUsage;
	}

}
