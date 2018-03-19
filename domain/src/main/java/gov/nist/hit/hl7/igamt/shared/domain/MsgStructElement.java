package gov.nist.hit.hl7.igamt.shared.domain;


public class MsgStructElement extends StructureElement {

  private int min;
  private String max;
  public MsgStructElement() {
    
  }
  public int getMin() {
    return min;
  }
  public void setMin(int min) {
    this.min = min;
  }
  public String getMax() {
    return max;
  }
  public void setMax(String max) {
    this.max = max;
  }
  
}
