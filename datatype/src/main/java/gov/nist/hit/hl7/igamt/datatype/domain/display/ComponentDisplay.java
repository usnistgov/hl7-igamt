package gov.nist.hit.hl7.igamt.datatype.domain.display;

import gov.nist.hit.hl7.igamt.datatype.domain.Component;

public class ComponentDisplay {

  private Component data;
  private boolean readOnly;

  public Component getData() {
    return data;
  }

  public void setData(Component data) {
    this.data = data;
  }

  public boolean isReadOnly() {
    return readOnly;
  }

  public void setReadOnly(boolean readOnly) {
    this.readOnly = readOnly;
  }

}
