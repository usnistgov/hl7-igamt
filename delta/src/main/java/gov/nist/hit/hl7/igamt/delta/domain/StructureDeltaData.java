package gov.nist.hit.hl7.igamt.delta.domain;

import gov.nist.diff.domain.DeltaAction;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.Usage;
import gov.nist.hit.hl7.igamt.valueset.domain.CodeUsage;

public class StructureDeltaData {

    private DeltaAction action;
    private Integer position;
    private Type type;
    private DeltaNode<Usage> usage;
    private DeltaNode<CodeUsage> codeUsage;
    private DeltaNode<String> constantValue;
    private DeltaNode<String> minLength;
    private DeltaNode<String> maxLength;
    private DeltaNode<Integer> minCardinality;
    private DeltaNode<String> maxCardinality;
    private DeltaNode<String> confLength;
    private DeltaNode<String> definition;
    private DeltaValuesetBinding valuesetBinding;
    private DeltaInternalSingleCode internalSingleCode;
    private PredicateDelta predicate;
    private ReferenceDelta reference;
    private DeltaNode<String> name;
    private DeltaNode<String> format;


    public DeltaNode<String> getFormat() {
      return format;
    }

    public void setFormat(DeltaNode<String> format) {
      this.crunchAction(format.getAction());
      this.format = format;
    }
    private ConformanceStatementDelta conformanceStatement;

    public StructureDeltaData() {
        this.action = DeltaAction.UNCHANGED;
    }

    public DeltaAction getAction() {
        return action;
    }

    public void setAction(DeltaAction action) {
        this.action = action;
    }

    public Integer getPosition() {
        return position;
    }

    public void setPosition(Integer position) {
        this.position = position;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }

    public DeltaNode<Usage> getUsage() {
        return usage;
    }

    public void setUsage(DeltaNode<Usage> usage) {
        this.crunchAction(usage.getAction());
        this.usage = usage;
    }

    public DeltaNode<CodeUsage> getCodeUsage() {
        return codeUsage;
    }

    public void setCodeUsage(DeltaNode<CodeUsage> codeUsage) {
        this.crunchAction(codeUsage.getAction());
        this.codeUsage = codeUsage;
    }

    public DeltaNode<String> getConstantValue() {
        return constantValue;
    }

    public void setConstantValue(DeltaNode<String> constantValue) {
        this.crunchAction(constantValue.getAction());
        this.constantValue = constantValue;
    }

    public DeltaNode<String> getMinLength() {
        return minLength;
    }

    public void setMinLength(DeltaNode<String> minLength) {
        this.crunchAction(minLength.getAction());
        this.minLength = minLength;
    }

    public DeltaNode<String> getMaxLength() {
        return maxLength;
    }

    public void setMaxLength(DeltaNode<String> maxLength) {
        this.crunchAction(maxLength.getAction());
        this.maxLength = maxLength;
    }

    public DeltaNode<Integer> getMinCardinality() {
        return minCardinality;
    }

    public void setMinCardinality(DeltaNode<Integer> minCardinality) {
        this.crunchAction(minCardinality.getAction());
        this.minCardinality = minCardinality;
    }

    public DeltaNode<String> getMaxCardinality() {
        return maxCardinality;
    }

    public void setMaxCardinality(DeltaNode<String> maxCardinality) {
        this.crunchAction(maxCardinality.getAction());
        this.maxCardinality = maxCardinality;
    }

    public DeltaNode<String> getConfLength() {
        return confLength;
    }

    public void setConfLength(DeltaNode<String> confLength) {
        this.crunchAction(confLength.getAction());
        this.confLength = confLength;
    }

    public DeltaNode<String> getDefinition() {
        return definition;
    }

    public void setDefinition(DeltaNode<String> definition) {
        this.crunchAction(definition.getAction());
        this.definition = definition;
    }

    public ReferenceDelta getReference() {
        return reference;
    }

    public void setReference(ReferenceDelta reference) {
        this.crunchAction(reference.getAction());
        this.reference = reference;
    }

    public DeltaNode<String> getName() {
        return name;
    }

    public DeltaValuesetBinding getValuesetBinding() {
        return valuesetBinding;
    }

    public void setValuesetBinding(DeltaValuesetBinding valuesetBinding) {
        this.crunchAction(valuesetBinding.getAction());
        this.valuesetBinding = valuesetBinding;
    }

    public void setName(DeltaNode<String> name) {
        this.crunchAction(name.getAction());
        this.name = name;
    }

    public DeltaInternalSingleCode getInternalSingleCode() {
        return internalSingleCode;
    }

    public void setInternalSingleCode(DeltaInternalSingleCode internalSingleCode) {
        this.crunchAction(internalSingleCode.getAction());
        this.internalSingleCode = internalSingleCode;
    }

    public PredicateDelta getPredicate() {
        return predicate;
    }

    public void setPredicate(PredicateDelta predicate) {
        this.crunchAction(predicate.getAction());
        this.predicate = predicate;
    }

    public ConformanceStatementDelta getConformanceStatement() {
        return conformanceStatement;
    }

    public void setConformanceStatement(ConformanceStatementDelta conformanceStatement) {
        this.crunchAction(conformanceStatement.getAction());
        this.conformanceStatement = conformanceStatement;
    }

    public void crunchAction(DeltaAction a) {
        if(a != DeltaAction.UNCHANGED) {
            this.setAction(DeltaAction.UPDATED);
        }
    }
}
