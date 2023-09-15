package gov.nist.hit.hl7.igamt.common.base.domain;

public enum Scope {
  HL7STANDARD("HL7STANDARD"),
  SDTF("SDTF"),
  USER("USER"),
  PRELOADED("PRELOADED"),
  PHINVADS("PHINVADS"),
  INTERMASTER("INTERMASTER"),
  USERCUSTOM("USERCUSTOM"),
  ARCHIVED("ARCHIVED"),
  USERLIB("USERLIB");
	
  Scope(String value) {
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

  public static Scope fromString(String text) {
    for (Scope t : Scope.values()) {
      if (t.value.equalsIgnoreCase(text)) {
        return t;
      }
    }
    return null;
  }
}