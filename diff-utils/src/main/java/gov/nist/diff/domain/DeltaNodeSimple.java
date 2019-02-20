package gov.nist.diff.domain;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import gov.nist.diff.service.JsonSimpleNodeDeltaSerialize;

@JsonSerialize(using = JsonSimpleNodeDeltaSerialize.class)
public class DeltaNodeSimple<T> extends DeltaNode<T> {

  private T old;
  private T _new;

  public DeltaNodeSimple() {}

  public DeltaNodeSimple(T old, T _new) {
    super(action(old, _new));
    this.old = old;
    this._new = _new;
  }

  private static <T> DeltaAction action(T old, T _new) {
    if (old == null) {
      if (_new == null) {
        return DeltaAction.NOT_SET;
      } else {
        return DeltaAction.ADDED;
      }
    } else {
      if (_new == null) {
        return DeltaAction.DELETED;
      } else {
        return old.equals(_new) ? DeltaAction.UNCHANGED : DeltaAction.UPDATED;
      }
    }
  }

  public T getOld() {
    return old;
  }

  public void setOld(T old) {
    this.old = old;
  }

  public T getNew() {
    return _new;
  }

  public void setNew(T _new) {
    this._new = _new;
  }


}
