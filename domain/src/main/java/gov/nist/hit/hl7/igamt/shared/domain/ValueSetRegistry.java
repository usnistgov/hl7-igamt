package gov.nist.hit.hl7.igamt.shared.domain;

import java.util.HashMap;

public class ValueSetRegistry extends Registry {
  private ValueSetConfigForExport exportConfig;
  private HashMap<String, Boolean> codesPresence;
  
  public ValueSetRegistry() {
    super();
    this.setType(Type.VALUESET);
  }

  public ValueSetRegistry(String id, String description, Type type, int position, String label) {
	super(id, description, type, position, label);
    this.setType(Type.VALUESET);

	// TODO Auto-generated constructor stub
}

public HashMap<String, Boolean> getCodesPresence() {
    return codesPresence;
  }
  public void setCodesPresence(HashMap<String, Boolean> codesPresence) {
    this.codesPresence = codesPresence;
  }
  public ValueSetConfigForExport getExportConfig() {
    return exportConfig;
  }
  public void setExportConfig(ValueSetConfigForExport exportConfig) {
    this.exportConfig = exportConfig;
  }
}
