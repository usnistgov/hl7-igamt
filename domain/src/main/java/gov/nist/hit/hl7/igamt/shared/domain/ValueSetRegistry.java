package gov.nist.hit.hl7.igamt.shared.domain;

import java.util.HashMap;

public class ValueSetRegistry extends Registry<Link> {
  private ValueSetConfigForExport exportConfig;
  private HashMap<String, Boolean> codesPresence;
  
  public ValueSetRegistry() {
    super();
    this.setType(Type.VALUESET);
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
