package gov.nist.hit.hl7.igamt.delta.domain;

import gov.nist.diff.domain.DeltaAction;
import gov.nist.hit.hl7.igamt.common.base.domain.ConstraintType;
import gov.nist.hit.hl7.igamt.common.base.domain.Level;
import gov.nist.hit.hl7.igamt.common.base.domain.Usage;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.ChangeReason;
import gov.nist.hit.hl7.igamt.constraints.domain.assertion.Path;

public class PredicateDelta {
    private DeltaAction action;
    private DeltaNode<Usage> trueUsage;
    private DeltaNode<Usage> falseUsage;
    private DeltaNode<String> description;
    private ChangeReason changeReason;

    public DeltaAction getAction() {
        return action;
    }

    public void setAction(DeltaAction action) {
        this.action = action;
    }

    public DeltaNode<Usage> getTrueUsage() {
        return trueUsage;
    }

    public void setTrueUsage(DeltaNode<Usage> trueUsage) {
        this.crunchAction(trueUsage.getAction());
        this.trueUsage = trueUsage;
    }

    public DeltaNode<Usage> getFalseUsage() {
        return falseUsage;
    }

    public void setFalseUsage(DeltaNode<Usage> falseUsage) {
        this.crunchAction(falseUsage.getAction());
        this.falseUsage = falseUsage;
    }

    public DeltaNode<String> getDescription() {
        return description;
    }

    public void setDescription(DeltaNode<String> description) {
        this.crunchAction(description.getAction());
        this.description = description;
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
