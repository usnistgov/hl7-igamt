package gov.nist.hit.hl7.igamt.ig.model;

import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;

import java.util.List;

public class ResourceSkeletonInfo {
    List<ResourceSkeletonBone> children;
    DisplayElement resource;
    ResourceBinding binding;

    public ResourceSkeletonInfo(List<ResourceSkeletonBone> children, DisplayElement resource, ResourceBinding binding) {
        this.children = children;
        this.resource = resource;
        this.binding = binding;
    }


    public DisplayElement getResource() {
        return resource;
    }

    public void setResource(DisplayElement resource) {
        this.resource = resource;
    }

    public List<ResourceSkeletonBone> getChildren() {
        return children;
    }

    public void setChildren(List<ResourceSkeletonBone> children) {
        this.children = children;
    }

    public ResourceBinding getBinding() {
        return binding;
    }

    public void setBinding(ResourceBinding binding) {
        this.binding = binding;
    }
}
