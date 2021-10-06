package gov.nist.hit.hl7.igamt.ig.model;

import com.google.common.base.Strings;
import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;
import gov.nist.hit.hl7.igamt.common.base.exception.ResourceNotFoundException;
import gov.nist.hit.hl7.igamt.constraints.domain.assertion.InstancePath;
import gov.nist.hit.hl7.igamt.service.impl.ResourceSkeletonService;
import java.util.List;

public class ResourceSkeleton {
    protected final ResourceRef resourceRef;
    protected DisplayElement resource;
    protected final ResourceSkeletonService resourceSkeletonService;
    protected List<ResourceSkeletonBone> children;

    public ResourceSkeleton(ResourceRef resourceRef, ResourceSkeletonService resourceSkeletonService) {
        this.resourceRef = resourceRef;
        this.resourceSkeletonService = resourceSkeletonService;
    }

    protected ResourceSkeleton(List<ResourceSkeletonBone> children, ResourceSkeletonService resourceSkeletonService) {
        this.resourceRef = null;
        this.resourceSkeletonService = resourceSkeletonService;
        this.children = children;
    }

    protected ResourceSkeletonInfo lazyLoad() throws ResourceNotFoundException {
        if(children == null && resourceRef != null) {
            ResourceSkeletonInfo resourceSkeletonInfo = this.resourceSkeletonService.loadSkeleton(resourceRef, this);
            this.setChildren(resourceSkeletonInfo.getChildren());
            this.setResource(resourceSkeletonInfo.getResource());
            return resourceSkeletonInfo;
        }
        return null;
    }

    public ResourceRef getResourceRef() {
        return resourceRef;
    }

    public DisplayElement getResource() {
        return resource;
    }

    public void setResource(DisplayElement resource) {
        this.resource = resource;
    }

    protected void setChildren(List<ResourceSkeletonBone> children) {
        this.children = children;
    }

    public ResourceSkeletonBone get(InstancePath path) throws ResourceNotFoundException {
        this.lazyLoad();
        if(path == null) {
            return null;
        }

        ResourceSkeletonBone resourceSkeletonBone = this.children.stream().filter((child) -> child.getElementId().equals(path.getElementId())).findAny().orElse(null);
        if(resourceSkeletonBone != null) {
            if(path.getChild() != null) {
                return resourceSkeletonBone.get(path.getChild());
            } else {
                return resourceSkeletonBone.get();
            }
        }
        return null;
    }

    public ResourceSkeletonBone get(String pathId) throws ResourceNotFoundException {
        this.lazyLoad();
        if(pathId == null) {
            return null;
        }

        PathId pathIdObj = new PathId(pathId);

        ResourceSkeletonBone resourceSkeletonBone = this.children.stream().filter((child) -> child.getElementId().equals(pathIdObj.getHead())).findAny().orElse(null);
        if(resourceSkeletonBone != null) {
            if(!Strings.isNullOrEmpty(pathIdObj.getTail())) {
                return resourceSkeletonBone.get(pathIdObj.getTail());
            } else {
                return resourceSkeletonBone.get();
            }
        }
        return null;
    }

    public ResourceSkeletonBone get(int position) throws ResourceNotFoundException {
        this.lazyLoad();
        ResourceSkeletonBone resourceSkeletonBone = this.children.stream().filter((child) -> child.getPosition() == position).findAny().orElse(null);
        if(resourceSkeletonBone != null) {
            return resourceSkeletonBone.get();
        }
        return null;
    }

    public ResourceSkeleton get() throws ResourceNotFoundException {
        this.lazyLoad();
        return this;
    }

}
