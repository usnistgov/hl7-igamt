package gov.nist.hit.hl7.igamt.export.configuration.newModel;

public class ExportConfigurationForFrontEnd {
	
	private String id;
	private String configName;
	private boolean defaultConfig;
	
	public boolean isDefaultConfig() {
		return defaultConfig;
	}
	public void setDefaultConfig(boolean defaultConfig) {
		this.defaultConfig = defaultConfig;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getConfigName() {
		return configName;
	}
	public void setConfigName(String configName) {
		this.configName = configName;
	}

	
	
}
