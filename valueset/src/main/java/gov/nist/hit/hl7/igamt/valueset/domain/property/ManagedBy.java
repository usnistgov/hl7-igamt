package gov.nist.hit.hl7.igamt.valueset.domain.property;


public enum ManagedBy {
  
  Internal("Internal-Internally Managed"), External("External-Exteranlly Managed");
	public final String value;
    ManagedBy(String v){
	  value = v;
    }

  public static ManagedBy fromValue(String v) {
    return !"".equals(v) && v != null ? valueOf(v) : ManagedBy.Internal;
  }
}
