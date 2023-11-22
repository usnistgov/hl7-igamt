package gov.nist.hit.hl7.igamt.ig.domain.verification;

import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;

import java.util.List;

public class CompositeProfileVerificationResult {
	List<DisplayElement> generated;
	List<IgamtObjectError> issues;

	public List<DisplayElement> getGenerated() {
		return generated;
	}

	public void setGenerated(List<DisplayElement> generated) {
		this.generated = generated;
	}

	public List<IgamtObjectError> getIssues() {
		return issues;
	}

	public void setIssues(List<IgamtObjectError> issues) {
		this.issues = issues;
	}
}
