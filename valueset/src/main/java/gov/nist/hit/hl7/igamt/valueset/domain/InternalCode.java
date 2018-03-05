package gov.nist.hit.hl7.igamt.valueset.domain;

public class InternalCode extends Code {
  private CodeUsage usage;

  public InternalCode() {
    super();
  }

  public CodeUsage getUsage() {
    return usage;
  }

  public void setUsage(CodeUsage usage) {
    this.usage = usage;
  }

}
