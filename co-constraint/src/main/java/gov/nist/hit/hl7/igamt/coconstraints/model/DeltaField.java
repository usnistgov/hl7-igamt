package gov.nist.hit.hl7.igamt.coconstraints.model;

import gov.nist.diff.domain.DeltaAction;

public class DeltaField<T> extends WithDelta {
    T previous;
    T current;

    public DeltaField() {
    }

    public DeltaField(T previous, T current) {
        this.previous = previous;
        this.current = current;
        if(previous == null && current != null) {
            this.setDelta(DeltaAction.ADDED);
        } else if(previous != null && current == null) {
            this.setDelta(DeltaAction.DELETED);
        } else if(previous != null && current != null && !previous.equals(current)) {
            this.setDelta(DeltaAction.CHANGED);
        } else {
            this.setDelta(DeltaAction.UNCHANGED);
        }
    }

    public T getPrevious() {
        return previous;
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
}
