package gov.nist.hit.hl7.igamt.common.config.domain;

import java.util.List;

public class ConfigurableItems {
	
	private String id;
	
	private String label;
	
	private String featureName;
	
	private Boolean binary;
	
	List<Object> options;

	public ConfigurableItems(String label, String featureName, Boolean binary) {
		super();
		this.label = label;
		this.featureName = featureName;
		this.binary = binary;
	}

	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	}

	public String getFeatureName() {
		return featureName;
	}

	public void setFeatureName(String featureName) {
		this.featureName = featureName;
	}

	public Boolean getBinary() {
		return binary;
	}

	public void setBinary(Boolean binary) {
		this.binary = binary;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}
	
	
}
