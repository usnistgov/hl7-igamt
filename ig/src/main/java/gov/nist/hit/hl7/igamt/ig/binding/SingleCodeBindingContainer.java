package gov.nist.hit.hl7.igamt.ig.binding;

import gov.nist.hit.hl7.igamt.common.binding.domain.SingleCodeBinding;

import java.util.List;

public class SingleCodeBindingContainer extends BindingContainer<List<SingleCodeBinding>> {
    public SingleCodeBindingContainer(String pathId, List<SingleCodeBinding> binding) {
        super(pathId, binding);
    }
}
