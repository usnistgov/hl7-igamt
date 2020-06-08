package gov.nist.hit.hl7.igamt.delta.domain;

import gov.nist.diff.domain.DeltaAction;

import java.util.List;

public class DeltaInternalSingleCode {

    private DeltaAction action;
    private DeltaNode<String> valueSetId;
    private DeltaNode<String> code;
    private DeltaNode<String> codeSystem;

    public DeltaAction getAction() {
        return action;
    }

    public void setAction(DeltaAction action) {
        this.action = action;
    }

    public DeltaNode<String> getValueSetId() {
        return valueSetId;
    }

    public void setValueSetId(DeltaNode<String> valueSetId) {
        this.crunchAction(valueSetId.getAction());
        this.valueSetId = valueSetId;
    }

    public DeltaNode<String> getCode() {
        return code;
    }

    public void setCode(DeltaNode<String> code) {
        this.crunchAction(code.getAction());
        this.code = code;
    }

    public DeltaNode<String> getCodeSystem() {
        return codeSystem;
    }

    public void setCodeSystem(DeltaNode<String> codeSystem) {
        this.crunchAction(codeSystem.getAction());
        this.codeSystem = codeSystem;
    }

    public void crunchAction(DeltaAction a) {
        if(a != DeltaAction.UNCHANGED) {
            this.setAction(DeltaAction.UPDATED);
        }
    }
}
