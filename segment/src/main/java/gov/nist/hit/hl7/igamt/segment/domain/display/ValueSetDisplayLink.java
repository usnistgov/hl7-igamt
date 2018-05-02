package gov.nist.hit.hl7.igamt.segment.domain.display;

import gov.nist.hit.hl7.igamt.shared.domain.Scope;

public class ValueSetDisplayLink {
  private String id;
  private String bindingIdentifier;
  private Scope scope;
  private String version;
  private Level level;

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getBindingIdentifier() {
    return bindingIdentifier;
  }

  public void setBindingIdentifier(String bindingIdentifier) {
    this.bindingIdentifier = bindingIdentifier;
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

  public Level getLevel() {
    return level;
  }

  public void setLevel(Level level) {
    this.level = level;
  }



}
