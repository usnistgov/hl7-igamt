package gov.nist.hit.hl7.igamt.delta.domain;

import gov.nist.diff.domain.DeltaAction;
import gov.nist.hit.hl7.igamt.common.base.domain.ContentDefinition;
import gov.nist.hit.hl7.igamt.common.base.domain.Extensibility;
import gov.nist.hit.hl7.igamt.common.base.domain.SourceType;
import gov.nist.hit.hl7.igamt.common.base.domain.Stability;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class ValuesetDelta {
    private DeltaAction action;
    private DeltaNode<String> bindingIdentifier;
    private DeltaNode<String> oid;
    private DeltaNode<String> intensionalComment;
    private DeltaNode<String> url;
    private DeltaNode<Stability> stability;
    private DeltaNode<Extensibility> extensibility;
    private DeltaNode<ContentDefinition>  contentDefinition ;
    private DeltaNode<SourceType> sourceType;
    private DeltaNode<Integer>  numberOfCodes;
    private DeltaNode<String>  hl7Type;
    private List<DeltaNode<String>> codeSystems;
    private List<CodeDelta> codes;

    public DeltaAction getAction() {
        return action;
    }

    public void setAction(DeltaAction action) {
        this.action = action;
    }

    public DeltaNode<String> getBindingIdentifier() {
        return bindingIdentifier;
    }

    public void setBindingIdentifier(DeltaNode<String> bindingIdentifier) {
        this.bindingIdentifier = bindingIdentifier;
    }

    public DeltaNode<String> getOid() {
        return oid;
    }

    public void setOid(DeltaNode<String> oid) {
        this.oid = oid;
    }

    public DeltaNode<String> getIntensionalComment() {
        return intensionalComment;
    }

    public void setIntensionalComment(DeltaNode<String> intensionalComment) {
        this.intensionalComment = intensionalComment;
    }

    public DeltaNode<String> getUrl() {
        return url;
    }

    public void setUrl(DeltaNode<String> url) {
        this.url = url;
    }

    public DeltaNode<Stability> getStability() {
        return stability;
    }

    public void setStability(DeltaNode<Stability> stability) {
        this.crunchAction(stability.getAction());
        this.stability = stability;
    }

    public DeltaNode<Extensibility> getExtensibility() {
        return extensibility;
    }

    public void setExtensibility(DeltaNode<Extensibility> extensibility) {
        this.crunchAction(extensibility.getAction());
        this.extensibility = extensibility;
    }

    public DeltaNode<ContentDefinition> getContentDefinition() {
        return contentDefinition;
    }

    public void setContentDefinition(DeltaNode<ContentDefinition> contentDefinition) {
        this.crunchAction(contentDefinition.getAction());
        this.contentDefinition = contentDefinition;
    }

    public DeltaNode<SourceType> getSourceType() {
        return sourceType;
    }

    public void setSourceType(DeltaNode<SourceType> sourceType) {
        this.crunchAction(sourceType.getAction());
        this.sourceType = sourceType;
    }

    public DeltaNode<Integer> getNumberOfCodes() {
        return numberOfCodes;
    }

    public void setNumberOfCodes(DeltaNode<Integer> numberOfCodes) {
        this.numberOfCodes = numberOfCodes;
    }

    public DeltaNode<String> getHl7Type() {
        return hl7Type;
    }

    public void setHl7Type(DeltaNode<String> hl7Type) {
        this.hl7Type = hl7Type;
    }

    public List<CodeDelta> getCodes() {
        return codes;
    }

    public void setCodes(List<CodeDelta> codes) {
        boolean hasChange = codes
                .stream()
                .filter((code) -> !code.getAction().equals(DeltaAction.UNCHANGED))
                .findFirst()
                .isPresent();
        if(hasChange) {
            this.setAction(DeltaAction.UPDATED);
        }
        this.codes = codes;
    }

    public List<DeltaNode<String>> getCodeSystems() {
        return codeSystems;
    }

    public void setCodeSystems(List<DeltaNode<String>> codeSystems) {
        boolean hasChange = codeSystems
                .stream()
                .filter((codeSystem) -> !codeSystem.getAction().equals(DeltaAction.UNCHANGED))
                .findFirst()
                .isPresent();
        if(hasChange) {
            this.setAction(DeltaAction.UPDATED);
        }
        this.codeSystems = codeSystems;
    }

    public void crunchAction(DeltaAction a) {
        if(a != DeltaAction.UNCHANGED) {
            this.setAction(DeltaAction.UPDATED);
        }
    }

}
