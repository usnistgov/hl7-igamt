package gov.nist.hit.hl7.igamt.export.configuration.newModel;

public class DocumentExportConfiguration {

	private String configId;
	private ExportFilterDecision decision;
	
	
	public String getConfigId() {
		return configId;
	}
	public void setConfigId(String configId) {
		this.configId = configId;
	}
	public ExportFilterDecision getDecision() {
		return decision;
	}
	public void setDecision(ExportFilterDecision decision) {
		this.decision = decision;
	}
	
	
	
}
