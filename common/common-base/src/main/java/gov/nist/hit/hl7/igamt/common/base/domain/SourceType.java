package gov.nist.hit.hl7.igamt.common.base.domain;

public enum SourceType {
    INTERNAL("Internally managed"), EXTERNAL("Externally managed");
    private final String value;
    
    SourceType(String v){
	  value = v;
    }
    public String getValue() {
      return this.value;
    }
  }