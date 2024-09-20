package gov.nist.hit.hl7.igamt.common.base.domain;

public enum SourceType {
    INTERNAL("Internally managed"), EXTERNAL("Externally managed"), INTERNAL_TRACKED("INTERNAL_TRACKED"), EXTERNAL_TRACKED("EXTERNAL_TRACKED"); ;
    private final String value;
    
    SourceType(String v){
	  value = v;
    }
    public String getValue() {
      return this.value;
    }
  }