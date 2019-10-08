package gov.nist.hit.hl7.igamt.export.configuration.domain;

import gov.nist.hit.hl7.igamt.export.configuration.newModel.ExportFilterDecision;

public class ExportConfigurationGlobal {

	private ExportConfiguration exportConfiguration;
	private ExportFilterDecision exportFilterDecision;
	public ExportConfiguration getExportConfiguration() {
		return exportConfiguration;
	}
	public void setExportConfiguration(ExportConfiguration exportConfiguration) {
		this.exportConfiguration = exportConfiguration;
	}
	public ExportFilterDecision getExportFilterDecision() {
		return exportFilterDecision;
	}
	public void setExportFilterDecision(ExportFilterDecision exportFilterDecision) {
		this.exportFilterDecision = exportFilterDecision;
	}
	
	
}
