package gov.nist.hit.hl7.igamt.shared.domain;

public class Field extends SubStructElement {
  
  private int min; 
  private String max; 
  public Field() {
    // TODO Auto-generated constructor stub
    super();
    this.setType(Type.FIELD);
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
