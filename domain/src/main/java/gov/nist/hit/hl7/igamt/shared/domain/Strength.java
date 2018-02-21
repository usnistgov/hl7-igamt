package gov.nist.hit.hl7.igamt.shared.domain;

public enum Strength {
  R("Required"), S("Suggested"), U("Unspecified");
  
  public final String value;
  Strength(String v){
    value = v;
  }
  
  public static Strength fromValue(String v) {

    return !"".equals(v) && v != null ? valueOf(v) : Strength.U;
  }

}
