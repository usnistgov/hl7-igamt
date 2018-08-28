package gov.nist.hit.hl7.igamt.common.domain;

import java.util.HashSet;
import java.util.Set;

public class DomainInfo {
  private String version;
  private Set<String> compatibilityVersion=new HashSet<String>();
  private Scope scope;
  public String getVersion() {
    return version;
  }
  public void setVersion(String version) {
    this.version = version;
  }
  public Set<String> getCompatibilityVersion() {
    return compatibilityVersion;
  }
  public void setCompatibilityVersion(Set<String> compatibilityVersion) {
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
