package gov.nist.hit.hl7.igamt.ig.binding;

import java.util.HashSet;
import java.util.Set;

public class FlatResourceBinding {
    private Set<ValueSetBindingContainer> valueSetBindingContainers = new HashSet<>();
    private Set<SingleCodeBindingContainer> singleCodeBindingContainers = new HashSet<>();
    private Set<ConformanceStatementBindingContainer> conformanceStatementBindingContainers = new HashSet<>();
    private Set<PredicateBindingContainer> predicateBindingContainers = new HashSet<>();

    public Set<ValueSetBindingContainer> getValueSetBindingContainers() {
        return valueSetBindingContainers;
    }

    public void setValueSetBindingContainers(Set<ValueSetBindingContainer> valueSetBindingContainers) {
        this.valueSetBindingContainers = valueSetBindingContainers;
    }

    public Set<SingleCodeBindingContainer> getSingleCodeBindingContainers() {
        return singleCodeBindingContainers;
    }

    public void setSingleCodeBindingContainers(Set<SingleCodeBindingContainer> singleCodeBindingContainers) {
        this.singleCodeBindingContainers = singleCodeBindingContainers;
    }

    public Set<ConformanceStatementBindingContainer> getConformanceStatementBindingContainers() {
        return conformanceStatementBindingContainers;
    }

    public void setConformanceStatementBindingContainers(Set<ConformanceStatementBindingContainer> conformanceStatementBindingContainers) {
        this.conformanceStatementBindingContainers = conformanceStatementBindingContainers;
    }

    public Set<PredicateBindingContainer> getPredicateBindingContainers() {
        return predicateBindingContainers;
    }

    public void setPredicateBindingContainers(Set<PredicateBindingContainer> predicateBindingContainers) {
        this.predicateBindingContainers = predicateBindingContainers;
    }
}
