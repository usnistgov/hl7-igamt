package gov.nist.hit.hl7.igamt.valueset.model;

import gov.nist.hit.hl7.igamt.valueset.domain.CodeUsage;

public class CodeDelta {

	private DeltaChange change;
	private PropertyDelta<String> value;
	private PropertyDelta<String> description;
	private PropertyDelta<String> codeSystem;
	private PropertyDelta<String> comments;
	private PropertyDelta<CodeUsage> usage;
	private PropertyDelta<Boolean> hasPattern;
	private PropertyDelta<String> pattern;

	public PropertyDelta<String> getCodeSystem() {
		return codeSystem;
	}

	public void setCodeSystem(PropertyDelta<String> codeSystem) {
		this.codeSystem = codeSystem;
	}

	public PropertyDelta<String> getComments() {
		return comments;
	}

	public void setComments(PropertyDelta<String> comments) {
		this.comments = comments;
	}

	public PropertyDelta<String> getDescription() {
		return description;
	}

	public void setDescription(PropertyDelta<String> description) {
		this.description = description;
	}

	public PropertyDelta<Boolean> getHasPattern() {
		return hasPattern;
	}

	public void setHasPattern(PropertyDelta<Boolean> hasPattern) {
		this.hasPattern = hasPattern;
	}

	public PropertyDelta<String> getPattern() {
		return pattern;
	}

	public void setPattern(PropertyDelta<String> pattern) {
		this.pattern = pattern;
	}

	public PropertyDelta<CodeUsage> getUsage() {
		return usage;
	}

	public void setUsage(PropertyDelta<CodeUsage> usage) {
		this.usage = usage;
	}

	public PropertyDelta<String> getValue() {
		return value;
	}

	public void setValue(PropertyDelta<String> value) {
		this.value = value;
	}

	public DeltaChange getChange() {
		return change;
	}

	public void setChange(DeltaChange change) {
		this.change = change;
	}
}
