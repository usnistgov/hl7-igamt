package gov.nist.hit.hl7.igamt.valueset.domain;

public class InternalCode extends Code {
  private CodeUsage usage;

  public InternalCode() {
    super();
  }

  public InternalCode(String id, String value, String description, String codeSystemId, CodeUsage usage, String comments) {
    super(id, value, description, codeSystemId, comments);
    this.usage = usage;
  }

  public CodeUsage getUsage() {
    return usage;
  }

  public void setUsage(CodeUsage usage) {
    this.usage = usage;
  }

}
