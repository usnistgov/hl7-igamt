package gov.nist.hit.hl7.igamt.common.base.domain;

public enum Usage {
R("R"),RE("RE"),X("X"),C("C"),CAB("CAB"),O("O"), B("B"), W("W");
  
  Usage(String value) {
    this.value = value;
  }

  private final String value;

  public String getValue() {
    return value;
  }

  @Override
  public String toString() {
    // TODO Auto-generated method stub
    return this.value;
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
