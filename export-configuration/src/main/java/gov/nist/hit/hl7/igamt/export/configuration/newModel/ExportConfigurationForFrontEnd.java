package gov.nist.hit.hl7.igamt.export.configuration.newModel;

public class ExportConfigurationForFrontEnd {
	
	private String id;
	private String configName;
	private boolean defaultConfig;
    private boolean original;
    private String type;  
	
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
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
  public boolean isOriginal() {
    return original;
  }
  public void setOriginal(boolean original) {
    this.original = original;
  }

	
	
}
