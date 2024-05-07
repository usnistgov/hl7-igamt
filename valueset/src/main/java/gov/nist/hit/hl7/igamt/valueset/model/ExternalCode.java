package gov.nist.hit.hl7.igamt.valueset.model;

import gov.nist.hit.hl7.igamt.valueset.domain.CodeUsage;

public  class ExternalCode {
	private String value;
	private String codeSystem;
	private String displayText; // description ?
	private boolean isPattern;
	private String regularExpression;
	private CodeUsage usage;

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public String getCodeSystem() {
		return codeSystem;
	}

	public void setCodeSystem(String codeSystem) {
		this.codeSystem = codeSystem;
	}

	public String getDisplayText() {
		return displayText;
	}

	public void setDisplayText(String displayText) {
		this.displayText = displayText;
	}

	public boolean isPattern() {
		return isPattern;
	}

	public void setPattern(boolean pattern) {
		isPattern = pattern;
	}

	public String getRegularExpression() {
		return regularExpression;
	}

	public void setRegularExpression(String regularExpression) {
		this.regularExpression = regularExpression;
	}

	public CodeUsage getUsage() {
		return usage;
	}

	public void setUsage(CodeUsage usage) {
		this.usage = usage;
	}
}
