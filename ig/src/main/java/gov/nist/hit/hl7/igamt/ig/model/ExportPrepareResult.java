package gov.nist.hit.hl7.igamt.ig.model;

import gov.nist.hit.hl7.igamt.ig.domain.ExternalValueSetExportMode;
import gov.nist.hit.hl7.igamt.ig.domain.verification.IgVerificationIssuesList;

import java.util.List;
import java.util.Map;

public class ExportPrepareResult {
	private IgVerificationIssuesList verificationIssues;
	private List<ExternalValueSetReference> externalValueSetReferences;
	private Map<String, ExternalValueSetExportMode> externalValueSetExportModes;

	public ExportPrepareResult(
			List<ExternalValueSetReference> externalValueSetReferences,
			IgVerificationIssuesList verificationIssues,
			Map<String, ExternalValueSetExportMode> externalValueSetExportModes
	) {
		this.externalValueSetReferences = externalValueSetReferences;
		this.verificationIssues = verificationIssues;
		this.externalValueSetExportModes = externalValueSetExportModes;
	}

	public ExportPrepareResult() {
	}

	public List<ExternalValueSetReference> getExternalValueSetReferences() {
		return externalValueSetReferences;
	}

	public void setExternalValueSetReferences(List<ExternalValueSetReference> externalValueSetReferences) {
		this.externalValueSetReferences = externalValueSetReferences;
	}

	public IgVerificationIssuesList getVerificationIssues() {
		return verificationIssues;
	}

	public void setVerificationIssues(IgVerificationIssuesList verificationIssues) {
		this.verificationIssues = verificationIssues;
	}

	public Map<String, ExternalValueSetExportMode> getExternalValueSetExportModes() {
		return externalValueSetExportModes;
	}

	public void setExternalValueSetExportModes(Map<String, ExternalValueSetExportMode> externalValueSetExportModes) {
		this.externalValueSetExportModes = externalValueSetExportModes;
	}
}
