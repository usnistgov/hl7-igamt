package gov.nist.hit.hl7.igamt.common.base.domain;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import gov.nist.diff.annotation.DeltaField;

public class DomainInfo implements Serializable{
  @DeltaField
  private String version;
  @DeltaField
  private List<String> compatibilityVersion = new ArrayList<String>();
  @DeltaField
  private Scope scope;


  public String getVersion() {
    return version;
  }

  public void setVersion(String version) {
    this.version = version;
  }

  public List<String> getCompatibilityVersion() {
    return compatibilityVersion;
  }

  public void setCompatibilityVersion(List<String> compatibilityVersion) {
    this.compatibilityVersion = compatibilityVersion;
  }

  public DomainInfo() {
    super();
    // TODO Auto-generated constructor stub
  }

  public Scope getScope() {
    return scope;
  }

  public void setScope(Scope scope) {
    this.scope = scope;
  }

  public DomainInfo(String version, Scope scope) {
    super();
    this.version = version;
    this.scope = scope;
    this.compatibilityVersion.add(version);
  }



}
