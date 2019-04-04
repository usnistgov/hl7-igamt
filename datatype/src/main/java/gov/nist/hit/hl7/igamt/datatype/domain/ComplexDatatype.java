package gov.nist.hit.hl7.igamt.datatype.domain;

import gov.nist.diff.annotation.DeltaField;

import java.util.HashSet;
import java.util.Set;


/**
 *
 * @author Maxence Lefort on Feb 21, 2018.
 */
public class ComplexDatatype extends Datatype {

  @DeltaField
  private Set<Component> components = new HashSet<Component>();

  public ComplexDatatype() {
    super();
  }

  public Set<Component> getComponents() {
    return components;
  }

  public void setComponents(Set<Component> components) {
    this.components = components;
  }

  @Override
  public Datatype clone() {
    ComplexDatatype clone = new ComplexDatatype();
    complete(clone);
    return clone;
  }

  void complete (ComplexDatatype elm) {
    super.complete(elm);
    elm.components=this.getComponents();
  }

}
