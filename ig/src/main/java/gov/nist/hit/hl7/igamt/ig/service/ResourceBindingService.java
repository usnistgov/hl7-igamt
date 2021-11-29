package gov.nist.hit.hl7.igamt.ig.service;

import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
import gov.nist.hit.hl7.igamt.ig.binding.FlatResourceBinding;
import gov.nist.hit.hl7.igamt.ig.binding.FlatResourceBindingDisplay;

public interface ResourceBindingService {
    FlatResourceBinding getFlatResourceBindings(ResourceBinding resourceBinding);
    FlatResourceBindingDisplay getFlatResourceBindingsDisplay(Resource resource, FlatResourceBinding bindings);
}
