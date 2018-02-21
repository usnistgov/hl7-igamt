package gov.nist.hit.hl7.igamt.shared.domain.binding;

public enum ValuesetStrength {
  R("Required"), S("Suggested"), U("Unspecified");
  
  public final String value;
  ValuesetStrength(String v){
    value = v;
  }
  
  public static ValuesetStrength fromValue(String v) {

    return !"".equals(v) && v != null ? valueOf(v) : ValuesetStrength.U;
  }

}
