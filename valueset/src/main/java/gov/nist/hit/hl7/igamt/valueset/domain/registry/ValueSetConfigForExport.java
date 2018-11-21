package gov.nist.hit.hl7.igamt.valueset.domain.registry;

import java.util.HashSet;
import java.util.Set;


public class ValueSetConfigForExport {

  public ValueSetConfigForExport() {
    super();
    // TODO Auto-generated constructor stub
  }

  private Set<String> include = new HashSet<String>();

  public Set<String> getInclude() {
    return include;
  }

  public void setInclude(Set<String> include) {
    this.include = include;
  }
}
