package gov.nist.hit.hl7.igamt.common.binding.domain;

import java.io.Serializable;

import gov.nist.diff.annotation.DeltaField;

public class InternalSingleCode implements Serializable{

  @DeltaField
  private String codeSystemId;
  @DeltaField
  private String codeId;

  public String getCodeSystemId() {
    return codeSystemId;
  }

  public void setCodeSystemId(String codeSystemId) {
    this.codeSystemId = codeSystemId;
  }

  public String getCodeId() {
    return codeId;
  }

  public void setCodeId(String codeId) {
    this.codeId = codeId;
  }


}
