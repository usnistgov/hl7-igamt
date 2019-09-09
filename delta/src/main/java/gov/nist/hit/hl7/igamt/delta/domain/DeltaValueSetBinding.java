package gov.nist.hit.hl7.igamt.delta.domain;

import gov.nist.diff.domain.DeltaAction;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DisplayValuesetBinding;

import java.util.Set;

public class DeltaValueSetBinding {

    private Set<DisplayValuesetBinding> unchanged;
    private Set<DisplayValuesetBinding> updated;
    private Set<DisplayValuesetBinding> added;
    private Set<DisplayValuesetBinding> removed;

    public Set<DisplayValuesetBinding> getUnchanged() {
        return unchanged;
    }

    public void setUnchanged(Set<DisplayValuesetBinding> unchanged) {
        this.unchanged = unchanged;
    }

    public Set<DisplayValuesetBinding> getUpdated() {
        return updated;
    }

    public void setUpdated(Set<DisplayValuesetBinding> updated) {
        this.updated = updated;
    }

    public Set<DisplayValuesetBinding> getAdded() {
        return added;
    }

    public void setAdded(Set<DisplayValuesetBinding> added) {
        this.added = added;
    }

    public Set<DisplayValuesetBinding> getRemoved() {
        return removed;
    }

    public void setRemoved(Set<DisplayValuesetBinding> removed) {
        this.removed = removed;
    }
}
