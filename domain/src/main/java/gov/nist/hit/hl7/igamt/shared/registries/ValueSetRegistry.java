package gov.nist.hit.hl7.igamt.shared.registries;

import java.util.HashMap;

import gov.nist.hit.hl7.igamt.shared.domain.Type;
import gov.nist.hit.hl7.igamt.shared.domain.ValueSetConfigForExport;

public class ValueSetRegistry extends Registry {
  private ValueSetConfigForExport exportConfig;
  private HashMap<String, Boolean> codesPresence;
  
  public ValueSetRegistry() {
    super();
    this.type=Type.VALUESETREGISTRY;
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
