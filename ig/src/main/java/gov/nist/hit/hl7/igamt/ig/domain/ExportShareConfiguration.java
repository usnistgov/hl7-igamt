package gov.nist.hit.hl7.igamt.ig.domain;

import gov.nist.hit.hl7.igamt.export.configuration.newModel.ExportFilterDecision;

public class ExportShareConfiguration {
	private String name;
	private String configurationId;
	private ExportFilterDecision exportDecision;

	public String getConfigurationId() {
		return configurationId;
	}

	public void setConfigurationId(String configurationId) {
		this.configurationId = configurationId;
	}

	public ExportFilterDecision getExportDecision() {
		return exportDecision;
	}

	public void setExportDecision(ExportFilterDecision exportDecision) {
		this.exportDecision = exportDecision;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
}
