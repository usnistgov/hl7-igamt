package gov.nist.hit.hl7.igamt.ig.binding;

import java.util.HashSet;
import java.util.Set;

public class FlatResourceBindingDisplay {
    private Set<DisplayBindingContainer<ValueSetBindingContainer>> valueSetBindingContainers = new HashSet<>();
    private Set<DisplayBindingContainer<SingleCodeBindingContainer>> singleCodeBindingContainers = new HashSet<>();
    private Set<DisplayBindingContainer<ConformanceStatementBindingContainer>> conformanceStatementBindingContainers = new HashSet<>();
    private Set<DisplayBindingContainer<PredicateBindingContainer>> predicateBindingContainers = new HashSet<>();

    public Set<DisplayBindingContainer<ValueSetBindingContainer>> getValueSetBindingContainers() {
        return valueSetBindingContainers;
    }

    public void setValueSetBindingContainers(Set<DisplayBindingContainer<ValueSetBindingContainer>> valueSetBindingContainers) {
        this.valueSetBindingContainers = valueSetBindingContainers;
    }

    public Set<DisplayBindingContainer<SingleCodeBindingContainer>> getSingleCodeBindingContainers() {
        return singleCodeBindingContainers;
    }

    public void setSingleCodeBindingContainers(Set<DisplayBindingContainer<SingleCodeBindingContainer>> singleCodeBindingContainers) {
        this.singleCodeBindingContainers = singleCodeBindingContainers;
    }

    public Set<DisplayBindingContainer<ConformanceStatementBindingContainer>> getConformanceStatementBindingContainers() {
        return conformanceStatementBindingContainers;
    }

    public void setConformanceStatementBindingContainers(Set<DisplayBindingContainer<ConformanceStatementBindingContainer>> conformanceStatementBindingContainers) {
        this.conformanceStatementBindingContainers = conformanceStatementBindingContainers;
    }

    public Set<DisplayBindingContainer<PredicateBindingContainer>> getPredicateBindingContainers() {
        return predicateBindingContainers;
    }

    public void setPredicateBindingContainers(Set<DisplayBindingContainer<PredicateBindingContainer>> predicateBindingContainers) {
        this.predicateBindingContainers = predicateBindingContainers;
    }
}
