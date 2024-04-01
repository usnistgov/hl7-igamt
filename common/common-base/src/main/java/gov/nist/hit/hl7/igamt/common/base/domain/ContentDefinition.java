package gov.nist.hit.hl7.igamt.common.base.domain;


public enum ContentDefinition {
  Extensional("Extensional"), Intensional("Intensional"), Undefined("Not defined");
	public final String value;
    ContentDefinition(String v){
	  value = v;
    }

  public static ContentDefinition fromValue(String v) {
    return !"".equals(v) && v != null ? valueOf(v) : ContentDefinition.Intensional;
  }
}
