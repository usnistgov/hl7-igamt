package gov.nist.hit.hl7.igamt.common.binding.domain;

public class ExternalSingleCode {

  private String value;
  private String codeSystem;

  public ExternalSingleCode() {
    super();
  }

  public String getValue() {
    return value;
  }

  public void setValue(String value) {
    this.value = value;
  }

  public String getCodeSystem() {
    return codeSystem;
  }

  public void setCodeSystem(String codeSystem) {
    this.codeSystem = codeSystem;
  }

}
