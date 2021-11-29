package gov.nist.hit.hl7.igamt.delta.domain;

import gov.nist.diff.domain.DeltaObject;
import gov.nist.hit.hl7.igamt.common.base.domain.AbstractDomain;
import gov.nist.hit.hl7.igamt.common.base.model.SectionInfo;

public class EntityDelta<T> {

  private AbstractDomain sourceDocument;
  private SectionInfo sourceEntity;
  private SectionInfo targetEntity;
  private DeltaObject<T> delta;

  public EntityDelta(AbstractDomain sourceDocument, SectionInfo sourceEntity,
      SectionInfo targetEntity, DeltaObject<T> delta) {
    super();
    this.sourceDocument = sourceDocument;
    this.sourceEntity = sourceEntity;
    this.targetEntity = targetEntity;
    this.delta = delta;
  }

  public EntityDelta() {
    super();
    // TODO Auto-generated constructor stub
  }

  public AbstractDomain getSourceDocument() {
    return sourceDocument;
  }

  public void setSourceDocument(AbstractDomain sourceDocument) {
    this.sourceDocument = sourceDocument;
  }

  public SectionInfo getSourceEntity() {
    return sourceEntity;
  }

  public void setSourceEntity(SectionInfo sourceEntity) {
    this.sourceEntity = sourceEntity;
  }

  public SectionInfo getTargetEntity() {
    return targetEntity;
  }

  public void setTargetEntity(SectionInfo targetEntity) {
    this.targetEntity = targetEntity;
  }

  public DeltaObject<T> getDelta() {
    return delta;
  }

  public void setDelta(DeltaObject<T> delta) {
    this.delta = delta;
  }

}
