package gov.nist.hit.hl7.igamt.coconstraints.model;

import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;

import java.util.List;
import java.util.stream.Collectors;

public class ValueSetCell extends CoConstraintCell  {
    protected List<ValuesetBinding> bindings;

    public List<ValuesetBinding> getBindings() {
        return bindings;
    }

    public void setBindings(List<ValuesetBinding> bindings) {
        this.bindings = bindings;
    }

    public ValueSetCell clone() {
        ValueSetCell clone = new ValueSetCell();
        clone.setType(type);
        clone.setBindings(bindings.stream().map(b -> b.clone()).collect(Collectors.toList()));
        return clone;
    }
}
