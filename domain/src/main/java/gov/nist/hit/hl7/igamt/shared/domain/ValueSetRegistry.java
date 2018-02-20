package gov.nist.hit.hl7.igamt.shared.domain;

import java.util.HashMap;

public class ValueSetRegistry extends Resgistry {

  private ValueSetConfigForExport exportConfig;
  HashMap<String, Boolean> codesPresence;
  public HashMap<String, Boolean> getCodesPresence() {
    return codesPresence;
  }
  public void setCodesPresence(HashMap<String, Boolean> codesPresence) {
    this.codesPresence = codesPresence;
  }
}
