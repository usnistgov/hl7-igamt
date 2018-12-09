package gov.nist.hit.hl7.igamt.common.base.model;


public enum SectionType {

	  METADATA("Meta-data"), PREDEF("Pre-Definition"),POSTFDEF("Post-Definition"),CROSREFS("Cross-references"),STRUCTURE("Structure"), DYNAMICMAPPING("Dynamic Mapping"), COCONSTRAINTS("Co-Constraints"),
	  CONFORMANCESTATEMENTS("Conformance Statements");
	  private final String value;

	  SectionType(String value) {
	    this.value = value;
	  }


	  public String getValue() {
	    return value;
	  }

	  @Override
	  public String toString() {
	    // TODO Auto-generated method stub
	    return this.value;
	  }

	  public static SectionType fromString(String text) {
	    for (SectionType t : SectionType.values()) {
	      if (t.value.equalsIgnoreCase(text)) {
	        return t;
	      }
	    }
	    return null;
	  }

}
