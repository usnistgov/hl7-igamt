package gov.nist.hit.hl7.igamt.datatypeLibrary.wrappers;

import java.util.HashSet;
import java.util.Set;

import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;

public class AddDatatypeResponseObject {
  Set<Datatype> datatypes = new HashSet<Datatype>();

  public Set<Datatype> getDatatypes() {
    return datatypes;
  }

  public void setDatatypes(Set<Datatype> datatypes) {
    this.datatypes = datatypes;
  }



}
