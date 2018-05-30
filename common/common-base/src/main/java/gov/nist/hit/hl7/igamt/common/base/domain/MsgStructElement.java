package gov.nist.hit.hl7.igamt.common.base.domain;


public abstract class MsgStructElement extends StructureElement {

  private int min;
  private String max;
  public MsgStructElement() {
    
  }

  public MsgStructElement(String id, String name, int position, Usage usage, Type type, String text,
      boolean custom, int min, String max) {
    super(id, name, position, usage, type, text, custom);
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
