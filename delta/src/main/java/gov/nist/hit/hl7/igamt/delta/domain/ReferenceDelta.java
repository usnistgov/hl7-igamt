package gov.nist.hit.hl7.igamt.delta.domain;

import gov.nist.diff.domain.DeltaAction;
import gov.nist.hit.hl7.igamt.common.base.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;

public class ReferenceDelta {

    private DeltaAction action;
    private Type type;
    private DeltaNode<String> id;
    private DeltaNode<DomainInfo> domainInfo;
    private DeltaNode<String> label;

    public ReferenceDelta() {
        this.action = DeltaAction.UNCHANGED;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }

    public DeltaNode<String> getId() {
        return id;
    }

    public void setId(DeltaNode<String> id) {
        this.id = id;
    }

    public DeltaNode<DomainInfo> getDomainInfo() {
        return domainInfo;
    }

    public void setDomainInfo(DeltaNode<DomainInfo> domainInfo) {
        this.crunchAction(domainInfo.getAction());
        this.domainInfo = domainInfo;
    }

    public DeltaNode<String> getLabel() {
        return label;
    }

    public void setLabel(DeltaNode<String> label) {
        this.crunchAction(label.getAction());
        this.label = label;
    }

    public DeltaAction getAction() {
        return action;
    }

    public void crunchAction(DeltaAction a) {
        if(a != DeltaAction.UNCHANGED) {
            this.setAction(DeltaAction.UPDATED);
        }
    }

    public void setAction(DeltaAction action) {
        this.action = action;
    }
}
