package gov.nist.hit.hl7.igamt.delta.domain;

import gov.nist.diff.domain.DeltaAction;
import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;

import java.util.List;

public class DeltaInternalSingleCode {

    private DeltaAction action;
    private DeltaNode<DisplayElement> valueSetDisplay;
    private DeltaNode<String> code;
    private DeltaNode<String> codeSystem;

    public DeltaAction getAction() {
        return action;
    }

    public void setAction(DeltaAction action) {
        this.action = action;
    }

    public DeltaNode<DisplayElement> getValueSetDisplay() {
        return valueSetDisplay;
    }

    public void setValueSetDisplay(DeltaNode<DisplayElement> valueSetDisplay) {
        this.crunchAction(valueSetDisplay.getAction());
        this.valueSetDisplay = valueSetDisplay;
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
