package gov.nist.hit.hl7.igamt.shared.domain;


public class MsgStructElement extends StructureElement {

  private int min;
  private int max;
  public MsgStructElement() {
    
  }
  public int getMin() {
    return min;
  }
  public void setMin(int min) {
    this.min = min;
  }
  public int getMax() {
    return max;
  }
  public void setMax(int max) {
    this.max = max;
  }
  
}
