package gov.nist.hit.hl7.igamt.common.base.domain;

public enum Type {

  IGDOCUMENT("IGDOCUMENT"), DATATYPEREGISTRY("DATATYPEREGISTRY"),

  DERIVEDDATATYPEREGISTRY("DERIVEDDATATYPEREGISTRY"),

  SEGMENTREGISTRY("SEGMENTREGISTRY"), VALUESETREGISTRY(
      "VALUESETREGISTRY"), PROFILECOMPONENTREGISTRY(
          "PROFILECOMPONENTREGISTRY"), COMPOSITEPROFILEREGISTRY(
              "COMPOSITEPROFILEREGISTRY"), DATATYPE("DATATYPE"), VALUESET(
                  "VALUESET"), CONFORMANCEPROFILE("CONFORMANCEPROFILE"), SEGMENT(
                      "SEGMENT"), PROFILECOMPONENT("PROFILECOMPONENT"), COMPOSITEPROFILE(
                          "COMPOSITEPROFILE"), SEGMENTREF("SEGMENTREF"), GROUP("GROUP"), FIELD(
                              "FIELD"), COMPONENT("COMPONENT"), TEXT("TEXT"), PROFILE(
                                  "PROFILE"), CONFORMANCEPROFILEREGISTRY(
                                      "CONFORMANCEPROFILEREGISTRY"), DISPLAY("DISPLAY"), EVENT(
                                          "EVENT"), EVENTS("EVENTS"), BINDING("BINDING"), SECTION(
                                              "SECTION"), DYNAMICMAPPING(
                                                  "DYNAMICMAPPING"), CONFORMANCESTATEMENT(
                                                      "CONFORMANCESTATEMENT"), PREDICATE(
                                                          "PREDICATE"), DATATYPELIBRARY(
                                                              "DATATYPELIBRARY");

  Type(String value) {
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

  public static Type fromString(String text) {
    for (Type t : Type.values()) {
      if (t.value.equalsIgnoreCase(text)) {
        return t;
      }
    }
    return null;
  }

}
