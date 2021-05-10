package gov.nist.hit.hl7.igamt.delta.domain;


import gov.nist.diff.domain.DeltaAction;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetStrength;
import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.ChangeReason;

import java.util.List;
import java.util.Set;

public class DeltaValuesetBinding {

    private DeltaAction action;
    private DeltaNode<List<DisplayElement>> valueSets;
    private DeltaNode<Set<Integer>> valuesetLocations;
    private DeltaNode<ValuesetStrength> strength;
    private ChangeReason changeReason;

    public DeltaNode<List<DisplayElement>> getValueSets() {
        return valueSets;
    }

    public void setValueSets(DeltaNode<List<DisplayElement>> valueSets) {
        this.crunchAction(valueSets.getAction());
        this.valueSets = valueSets;
    }

    public DeltaNode<Set<Integer>> getValuesetLocations() {
        return valuesetLocations;
    }

    public void setValuesetLocations(DeltaNode<Set<Integer>> valuesetLocations) {
        this.crunchAction(valuesetLocations.getAction());
        this.valuesetLocations = valuesetLocations;
    }

    public DeltaNode<ValuesetStrength> getStrength() {
        return strength;
    }

    public void setStrength(DeltaNode<ValuesetStrength> strength) {
        this.crunchAction(strength.getAction());
        this.strength = strength;
    }

    public DeltaAction getAction() {
        return action;
    }

    public void setAction(DeltaAction action) {
        this.action = action;
    }

    public void crunchAction(DeltaAction a) {
        if(a != DeltaAction.UNCHANGED) {
            this.setAction(DeltaAction.UPDATED);
        }
    }

    public ChangeReason getChangeReason() {
        return changeReason;
    }

    public void setChangeReason(ChangeReason changeReason) {
        this.changeReason = changeReason;
    }
}
