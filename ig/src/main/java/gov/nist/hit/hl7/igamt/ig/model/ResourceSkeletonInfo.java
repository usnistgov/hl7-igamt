package gov.nist.hit.hl7.igamt.ig.model;

import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;

import java.util.List;

public class ResourceSkeletonInfo {
    List<ResourceSkeletonBone> children;
    DisplayElement resource;

    public ResourceSkeletonInfo(List<ResourceSkeletonBone> children, DisplayElement resource) {
        this.children = children;
        this.resource = resource;
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
}
