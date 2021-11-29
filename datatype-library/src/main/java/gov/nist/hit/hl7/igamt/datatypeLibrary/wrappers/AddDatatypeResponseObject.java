package gov.nist.hit.hl7.igamt.datatypeLibrary.wrappers;

import java.util.HashSet;
import java.util.Set;

import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;

public class AddDatatypeResponseObject {
  Set<Datatype> datatypes = new HashSet<Datatype>();

  Set<Valueset > valueSets = new HashSet<Valueset>();
  public Set<Datatype> getDatatypes() {
    return datatypes;
  }

  public void setDatatypes(Set<Datatype> datatypes) {
    this.datatypes = datatypes;
  }

  public Set<Valueset> getValueSets() {
    return valueSets;
  }

  public void setValueSets(Set<Valueset> valueSets) {
    this.valueSets = valueSets;
  }
}