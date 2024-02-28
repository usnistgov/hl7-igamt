package gov.nist.hit.hl7.igamt.ig.model;

import com.google.common.base.Strings;
import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;
import gov.nist.hit.hl7.igamt.common.base.exception.ResourceNotFoundException;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
import gov.nist.hit.hl7.igamt.constraints.domain.assertion.InstancePath;
import gov.nist.hit.hl7.igamt.service.impl.ResourceSkeletonService;

import java.util.Arrays;
import java.util.List;

public class ResourceSkeleton {
    protected final ResourceRef resourceRef;
    protected DisplayElement resource;
	protected ResourceBinding resourceBindings;
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
			this.setResourceBindings(resourceSkeletonInfo.getBinding());
            return resourceSkeletonInfo;
        }
        return null;
    }

    public ResourceRef getResourceRef() {
        return resourceRef;
    }

    public DisplayElement getResource() {
        try {
            this.lazyLoad();
            return resource;
        } catch (Exception e) {
            return resource;
        }
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
    
    public ResourceSkeletonBone getByPositionPath(String positionalPath) throws ResourceNotFoundException {
    	try {
        	String[] positions = positionalPath.split("\\.");
        	if(positions.length > 0) {
        		String top = positions[0];
        		String[] others = Arrays.copyOfRange(positions, 1, positions.length);
            	ResourceSkeletonBone current = this.get(Integer.parseInt(top));
            	for(String position: others) {
            		if(current != null) {
                		current = current.get(Integer.parseInt(position));
            		}
            		else {
            			return null;
            		}
            	}
            	return current;
        	} else {
        		return null;
        	}
    	} catch(Exception e) {
    		return null;
    	}
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

	public ResourceBinding getResourceBindings() throws ResourceNotFoundException {
		this.lazyLoad();
		return resourceBindings;
	}

	protected void setResourceBindings(ResourceBinding resourceBindings) {
		this.resourceBindings = resourceBindings;
	}
}
