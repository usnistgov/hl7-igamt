package gov.nist.hit.hl7.igamt.datatypeLibrary.wrappers;

import gov.nist.hit.hl7.igamt.common.base.domain.CompositeKey;

public class CopyWrapper {

  private String libId;
  private CompositeKey id;
  private String ext;
  private String name;



  public CompositeKey getId() {
    return id;
  }

  public void setId(CompositeKey id) {
    this.id = id;
  }

  public String getExt() {
    return ext;
  }

  public void setExt(String ext) {
    this.ext = ext;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getLibId() {
    return libId;
  }

  public void setLibId(String libId) {
    this.libId = libId;
  }


}
