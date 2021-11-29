package gov.nist.hit.hl7.igamt.datatype.domain.display;

import gov.nist.hit.hl7.igamt.common.base.domain.Scope;

public class PreDef {
  private String id;
  private String label;
  private Scope scope;
  private String version;
  private String preDef;

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getLabel() {
    return label;
  }

  public void setLabel(String label) {
    this.label = label;
  }

  public Scope getScope() {
    return scope;
  }

  public void setScope(Scope scope) {
    this.scope = scope;
  }

  public String getVersion() {
    return version;
  }

  public void setVersion(String version) {
    this.version = version;
  }

  public String getPreDef() {
    return preDef;
  }

  public void setPreDef(String preDef) {
    this.preDef = preDef;
  }


}
