package gov.nist.hit.hl7.igamt.ig.controller.wrappers;

import gov.nist.hit.hl7.igamt.ig.domain.ExternalValueSetExportMode;

import java.util.Map;

public class XmlExportRequest {
	private ReqId selected;
	private Map<String, ExternalValueSetExportMode> externalValueSetsExportMode;
	private boolean rememberExternalValueSetExportMode;
	private String exportType;

	public Map<String, ExternalValueSetExportMode> getExternalValueSetsExportMode() {
		return externalValueSetsExportMode;
	}

	public void setExternalValueSetsExportMode(Map<String, ExternalValueSetExportMode> externalValueSetsExportMode) {
		this.externalValueSetsExportMode = externalValueSetsExportMode;
	}

	public ReqId getSelected() {
		return selected;
	}

	public void setSelected(ReqId selected) {
		this.selected = selected;
	}

	public boolean isRememberExternalValueSetExportMode() {
		return rememberExternalValueSetExportMode;
	}

	public void setRememberExternalValueSetExportMode(boolean rememberExternalValueSetExportMode) {
		this.rememberExternalValueSetExportMode = rememberExternalValueSetExportMode;
	}

	public String getExportType() {
		return exportType;
	}

	public void setExportType(String exportType) {
		this.exportType = exportType;
	}
}
