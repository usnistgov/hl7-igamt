package gov.nist.hit.hl7.igamt.datatypeLibrary.model;

import gov.nist.hit.hl7.igamt.common.base.domain.DomainInfo;

public class ElementTreeData extends TreeData {


  private DomainInfo domainInfo;
  private String ext;
  private String description;
  public boolean lazyLoading = true;


  public ElementTreeData() {
    super();
    // TODO Auto-generated constructor stub
  }

  public DomainInfo getDomainInfo() {
    return domainInfo;
  }

  public void setDomainInfo(DomainInfo domainInfo) {
    this.domainInfo = domainInfo;
  }

  public String getExt() {
    return ext;
  }

  public void setExt(String ext) {
    this.ext = ext;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }



}
