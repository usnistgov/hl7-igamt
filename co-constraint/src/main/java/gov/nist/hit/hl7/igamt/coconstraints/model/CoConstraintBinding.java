package gov.nist.hit.hl7.igamt.coconstraints.model;


import java.util.List;
import java.util.stream.Collectors;

public class CoConstraintBinding extends WithDelta {
    private StructureElementRef context;
    private List<CoConstraintBindingSegment> bindings;

    public StructureElementRef getContext() {
        return context;
    }

    public void setContext(StructureElementRef context) {
        this.context = context;
    }

    public List<CoConstraintBindingSegment> getBindings() {
        return bindings;
    }

    public void setBindings(List<CoConstraintBindingSegment> bindings) {
        this.bindings = bindings;
    }

    public CoConstraintBinding clone() {
        CoConstraintBinding clone = new CoConstraintBinding();
        clone.setContext(context);
        clone.setBindings(bindings.stream().map(CoConstraintBindingSegment::clone).collect(Collectors.toList()));
        return clone;
    }
}
