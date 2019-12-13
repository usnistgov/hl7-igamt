package gov.nist.hit.hl7.igamt.display.model;

public class XSDVerificationResult {

  private boolean success;
  private Exception e;

  public XSDVerificationResult(boolean success, Exception e) {
    this.success = success;
    this.e = e;
  }

  public boolean isSuccess() {
    return success;
  }

  public void setSuccess(boolean success) {
    this.success = success;
  }

  public Exception getE() {
    return e;
  }

  public void setE(Exception e) {
    this.e = e;
  }

  @Override
  public String toString() {
    return "XSDVerificationResult [success=" + success + ", e=" + e + "]";
  }
  
  

}
