package gov.nist.hit.hl7.igamt.valueset.domain.property;

public enum Stability {
  Static("Static"), Dynamic("Dynamic"), Undefined("Not defined");
	public final String value;
    Stability(String v){
	  value = v;
    }
	

  public static Stability fromValue(String v) {

    return !"".equals(v) && v != null ? valueOf(v) : Stability.Dynamic;
  }
}
