package gov.nist.hit.hl7.igamt.delta.domain;

import gov.nist.diff.domain.DeltaAction;
import gov.nist.hit.hl7.igamt.valueset.domain.CodeUsage;

public class CodeDelta {
    private DeltaAction action;
    private DeltaNode<String> value;
    private DeltaNode<String> description;
    private DeltaNode<String> codeSystem;
    private DeltaNode<String> codeSystemOid;
    private DeltaNode<String> comments;
    private DeltaNode<CodeUsage> usage;

    public DeltaAction getAction() {
        return action;
    }

    public void setAction(DeltaAction action) {
        this.action = action;
    }

    public DeltaNode<String> getValue() {
        return value;
    }

    public void setValue(DeltaNode<String> value) {
        this.crunchAction(value.getAction());
        this.value = value;
    }

    public DeltaNode<String> getDescription() {
        return description;
    }

    public void setDescription(DeltaNode<String> description) {
        this.crunchAction(description.getAction());
        this.description = description;
    }

    public DeltaNode<String> getCodeSystem() {
        return codeSystem;
    }

    public void setCodeSystem(DeltaNode<String> codeSystem) {
        this.crunchAction(codeSystem.getAction());
        this.codeSystem = codeSystem;
    }

    public DeltaNode<String> getCodeSystemOid() {
        return codeSystemOid;
    }

    public void setCodeSystemOid(DeltaNode<String> codeSystemOid) {
        this.crunchAction(codeSystemOid.getAction());
        this.codeSystemOid = codeSystemOid;
    }

    public DeltaNode<String> getComments() {
        return comments;
    }

    public void setComments(DeltaNode<String> comments) {
        this.crunchAction(comments.getAction());
        this.comments = comments;
    }

    public DeltaNode<CodeUsage> getUsage() {
        return usage;
    }

    public void setUsage(DeltaNode<CodeUsage> usage) {
        this.crunchAction(usage.getAction());
        this.usage = usage;
    }

    public void crunchAction(DeltaAction a) {
        if(a != DeltaAction.UNCHANGED) {
            this.setAction(DeltaAction.UPDATED);
        }
    }
}
