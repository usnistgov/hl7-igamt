package gov.nist.hit.hl7.igamt.ig.model;

import gov.nist.hit.hl7.igamt.common.base.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;

public class DefinitionTreeData extends TreeData {



  private CompositeKey referenceId;
  private Type referenceType;


  public DefinitionTreeData() {
    this.setType(Type.DISPLAY);
    // TODO Auto-generated constructor stub
  }

  public CompositeKey getReferenceId() {
    return referenceId;
  }


  public void setReferenceId(CompositeKey referenceId) {
    this.referenceId = referenceId;
  }


  public Type getReferenceType() {
    return referenceType;
  }


  public void setReferenceType(Type referenceType) {
    this.referenceType = referenceType;
  }

}
