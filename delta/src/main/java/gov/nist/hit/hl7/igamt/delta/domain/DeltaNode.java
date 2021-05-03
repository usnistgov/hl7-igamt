package gov.nist.hit.hl7.igamt.delta.domain;

import gov.nist.diff.domain.DeltaAction;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.ChangeReason;

public class DeltaNode<T> {
    /**
   * 
   */
  public DeltaNode() {
    super();
    // TODO Auto-generated constructor stub
  }

    private T previous;
    private T current;
    private DeltaAction action;
    private ChangeReason changeReason;

    public T getPrevious() {
        return previous;
    }

    /**
     * @param previous
     * @param current
     * @param action
     */
    public DeltaNode(T previous, T current, DeltaAction action) {
      super();
      this.previous = previous;
      this.current = current;
      this.action = action;
    }

    public void setPrevious(T previous) {
        this.previous = previous;
    }

    public T getCurrent() {
        return current;
    }

    public void setCurrent(T current) {
        this.current = current;
    }

    public DeltaAction getAction() {
        return action;
    }

    public void setAction(DeltaAction action) {
        this.action = action;
    }

    public ChangeReason getChangeReason() {
        return changeReason;
    }

    public void setChangeReason(ChangeReason changeReason) {
        this.changeReason = changeReason;
    }
}
