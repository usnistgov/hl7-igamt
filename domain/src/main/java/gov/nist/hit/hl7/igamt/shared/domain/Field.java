package gov.nist.hit.hl7.igamt.shared.domain;

public class Field extends SubStructElement {
  
  private int min; 
  private int max; 
  
  public Field() {
    super();
    this.setType(Type.FIELD);
  }

  public Field(String id, String name, int position, Usage usage, String text, boolean custom,
      String maxLength, String minLength, String confLength, Ref ref, int min, int max) {
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
  public int getMax() {
    return max;
  }
  public void setMax(int max) {
    this.max = max;
  }

}
