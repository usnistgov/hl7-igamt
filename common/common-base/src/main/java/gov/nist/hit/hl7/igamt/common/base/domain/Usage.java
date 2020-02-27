package gov.nist.hit.hl7.igamt.common.base.domain;

public enum Usage {
R("R"),RE("RE"),X("X"),C("C"),CAB("C(A/B)"),O("O"), B("B"), W("W"), CE("CE");
  
  Usage(String value) {
    this.value = value;
  }

  private final String value;

  public String getValue() {
    return value;
  }

  @Override
  public String toString() {
	  if(this.equals(Usage.CAB)) {
		  return "C(A/B)";
	  } else {
		  return this.name()	;
	  }
  }

  public static Usage fromString(String text) {
    for (Usage t : Usage.values()) {
      if (t.value.equalsIgnoreCase(text)) {
        return t;
      }
    }
    return null;
  }
}
