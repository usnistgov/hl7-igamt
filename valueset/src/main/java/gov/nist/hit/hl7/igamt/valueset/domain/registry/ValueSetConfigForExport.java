package gov.nist.hit.hl7.igamt.valueset.domain.registry;

import java.util.HashSet;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.CompositeKey;

public class ValueSetConfigForExport {

  public ValueSetConfigForExport() {
    super();
    // TODO Auto-generated constructor stub
  }

  private Set<CompositeKey> include = new HashSet<CompositeKey>();

  public Set<CompositeKey> getInclude() {
    return include;
  }

  public void setInclude(Set<CompositeKey> include) {
    this.include = include;
  }
}
