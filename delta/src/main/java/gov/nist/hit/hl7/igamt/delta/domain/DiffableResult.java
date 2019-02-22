package gov.nist.hit.hl7.igamt.delta.domain;

import gov.nist.hit.hl7.igamt.common.base.domain.AbstractDomain;

public class DiffableResult {

  private boolean diffable;
  private AbstractDomain source;

  public DiffableResult(boolean diffable, AbstractDomain source) {
    super();
    this.diffable = diffable;
    this.source = source;
  }

  public DiffableResult() {
    super();
  }

  public boolean isDiffable() {
    return diffable;
  }

  public void setDiffable(boolean diffable) {
    this.diffable = diffable;
  }

  public AbstractDomain getSource() {
    return source;
  }

  public void setSource(AbstractDomain source) {
    this.source = source;
  }
}
