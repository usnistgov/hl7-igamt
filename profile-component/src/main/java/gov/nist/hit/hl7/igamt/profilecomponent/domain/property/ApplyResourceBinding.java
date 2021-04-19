package gov.nist.hit.hl7.igamt.profilecomponent.domain.property;

import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;
import gov.nist.hit.hl7.igamt.common.binding.service.BindingService;

public interface ApplyResourceBinding {
    default StructureElementBinding getStructureBinding(ResourceBinding resourceBinding, String path, BindingService bindingService) {
        return  bindingService.findAndCreateStructureElementBindingByIdPath(resourceBinding, path);
    }
    void onResourceBinding(ResourceBinding resourceBinding, BindingService bindingService);
}
