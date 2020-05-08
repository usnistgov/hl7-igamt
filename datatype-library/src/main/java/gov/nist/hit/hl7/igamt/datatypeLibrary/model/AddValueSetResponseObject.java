package gov.nist.hit.hl7.igamt.datatypeLibrary.model;

import java.util.HashSet;
import java.util.Set;

import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;

public class AddValueSetResponseObject {

  Set<Valueset> valueSets = new HashSet<Valueset>();

  public Set<Valueset> getValueSets() {
    return valueSets;
  }

  public void setValueSets(Set<Valueset> valueSets) {
    this.valueSets = valueSets;
  }


}