package gov.nist.hit.hl7.igamt.common.binding.domain;

import java.io.Serializable;

import gov.nist.diff.annotation.DeltaField;

public class InternalSingleCode implements Serializable{

  private String valueSetId;
  private String code;
  private String codeSystem;

  public String getValueSetId() {
    return valueSetId;
  }

  public void setValueSetId(String valueSetId) {
    this.valueSetId = valueSetId;
  }

  public String getCode() {
    return code;
  }

  public void setCode(String code) {
    this.code = code;
  }

  public String getCodeSystem() {
    return codeSystem;
  }

  public void setCodeSystem(String codeSystem) {
    this.codeSystem = codeSystem;
  }
}
