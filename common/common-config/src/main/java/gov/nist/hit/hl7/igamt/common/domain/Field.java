package gov.nist.hit.hl7.igamt.common.domain;

public class Field extends SubStructElement {
  
  private int min; 
  private String max; 
  
  public Field() {
    super();
    this.setType(Type.FIELD);
  }

  public Field(String id, String name, int position, Usage usage, String text, boolean custom,
      String maxLength, String minLength, String confLength, Ref ref, int min, String max) {
    super(id, name, position, usage, Type.FIELD, text, custom, maxLength, minLength, confLength, ref);
    this.min = min;
    this.max = max;
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
