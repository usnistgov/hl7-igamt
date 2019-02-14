package gov.nist.hit.hl7.igamt.xreference.model;

import gov.nist.hit.hl7.igamt.common.base.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;

public class ResourceInfo {

  private DomainInfo domainInfo;
  private String label;
  private String username;
  private Type type;
  private String id; 
  
  
  public ResourceInfo() {
    super();
    // TODO Auto-generated constructor stub
  }
  public DomainInfo getDomainInfo() {
    return domainInfo;
  }
  public void setDomainInfo(DomainInfo domainInfo) {
    this.domainInfo = domainInfo;
  }
  public String getLabel() {
    return label;
  }
  public void setLabel(String label) {
    this.label = label;
  }
  public Type getType() {
    return type;
  }
  public void setType(Type type) {
    this.type = type;
  }
  public String getUsername() {
    return username;
  }
  public void setUsername(String username) {
    this.username = username;
  }
  public String getId() {
    return id;
  }
  public void setId(String id) {
    this.id = id;
  }
  
  
}
