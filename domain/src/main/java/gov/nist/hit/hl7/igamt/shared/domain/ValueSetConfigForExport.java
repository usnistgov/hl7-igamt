package gov.nist.hit.hl7.igamt.shared.domain;

import java.util.HashMap;
import java.util.Set;

public class ValueSetConfigForExport {

  private Set<String> include;
  HashMap<String, Boolean> codesPresence;
  public Set<String> getInclude() {
    return include;
  }
  public void setInclude(Set<String> include) {
    this.include = include;
  }
}
