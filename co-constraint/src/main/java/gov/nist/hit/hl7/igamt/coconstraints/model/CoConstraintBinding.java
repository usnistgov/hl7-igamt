package gov.nist.hit.hl7.igamt.coconstraints.model;

import java.util.List;

public class CoConstraintBinding {
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
}
