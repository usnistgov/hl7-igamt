package gov.nist.hit.hl7.igamt.delta.domain;

import gov.nist.diff.domain.DeltaAction;


public class ConformanceStatementDelta {
    private DeltaAction action;
    protected DeltaNode<String> identifier;
    private DeltaNode<String> description;


    public DeltaNode<String> getIdentifier() {
        return identifier;
    }

    public void setIdentifier(DeltaNode<String> identifier) {
        this.crunchAction(identifier.getAction());
        this.identifier = identifier;
    }

    public DeltaNode<String> getDescription() {
        return description;
    }

    public void setDescription(DeltaNode<String> description) {
        this.crunchAction(description.getAction());
        this.description = description;
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


}
