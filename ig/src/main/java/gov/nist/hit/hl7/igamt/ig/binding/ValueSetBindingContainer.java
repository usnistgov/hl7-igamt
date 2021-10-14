package gov.nist.hit.hl7.igamt.ig.binding;

import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;

import java.util.Set;

public class ValueSetBindingContainer extends BindingContainer<Set<ValuesetBinding>>{
    public ValueSetBindingContainer(String pathId, Set<ValuesetBinding> binding) {
        super(pathId, binding);
    }
}
