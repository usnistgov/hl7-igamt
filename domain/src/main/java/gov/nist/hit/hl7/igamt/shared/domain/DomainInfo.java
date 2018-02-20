package gov.nist.hit.hl7.igamt.shared.domain;

import java.util.Set;

public class DomainInfo {
  private String version;
  private Set<String> compatibilityVersion;
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
  
  
  
}
