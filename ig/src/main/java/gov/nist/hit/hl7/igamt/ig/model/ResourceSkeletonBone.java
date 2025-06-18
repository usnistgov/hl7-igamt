package gov.nist.hit.hl7.igamt.ig.model;

import gov.nist.hit.hl7.igamt.common.base.domain.LocationInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.StructureElement;
import gov.nist.hit.hl7.igamt.common.base.domain.Usage;
import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;
import gov.nist.hit.hl7.igamt.common.base.exception.ResourceNotFoundException;
import gov.nist.hit.hl7.igamt.service.impl.ResourceSkeletonService;

import java.util.List;

public class ResourceSkeletonBone extends ResourceSkeleton {
    private LocationInfo locationInfo;
    private Usage usage;
    private ResourceSkeletonBoneCardinality cardinality;
    private DisplayElement parent;
    private String elementId;
    private ResourceSkeleton parentSkeleton;
    private int position;

    public ResourceSkeletonBone(ResourceRef resourceRef, String elementId, int position, LocationInfo locationInfo, DisplayElement parent, Usage usage, ResourceSkeletonBoneCardinality cardinality, ResourceSkeleton parentSkeleton, ResourceSkeletonService resourceSkeletonService) {
        super(resourceRef, resourceSkeletonService);
        this.parent = parent;
        this.locationInfo = locationInfo;
        this.elementId = elementId;
        this.position = position;
        this.usage = usage;
        this.cardinality = cardinality;
        this.parentSkeleton = parentSkeleton;
    }

    public ResourceSkeletonBone(List<ResourceSkeletonBone> children, String elementId, int position, LocationInfo locationInfo, DisplayElement parent, Usage usage, ResourceSkeletonBoneCardinality cardinality, ResourceSkeleton parentSkeleton, ResourceSkeletonService resourceSkeletonService) {
        super(children, resourceSkeletonService);
        this.parent = parent;
        this.locationInfo = locationInfo;
        this.elementId = elementId;
        this.position = position;
        this.usage = usage;
        this.cardinality = cardinality;
        this.parentSkeleton = parentSkeleton;
    }

    public ResourceSkeletonBone get() throws ResourceNotFoundException {
        this.lazyLoad();
        return this;
    }

    public LocationInfo getLocationInfo() {
        return locationInfo;
    }

    public void setLocationInfo(LocationInfo locationInfo) {
        this.locationInfo = locationInfo;
    }

    public DisplayElement getParent() {
        return parent;
    }

    public void setParent(DisplayElement parent) {
        this.parent = parent;
    }

    public String getElementId() {
        return elementId;
    }

    public void setElementId(String elementId) {
        this.elementId = elementId;
    }

    public int getPosition() {
        return position;
    }

    public void setPosition(int position) {
        this.position = position;
    }

    public Usage getUsage() {
        return usage;
    }

    public void setUsage(Usage usage) {
        this.usage = usage;
    }

    public ResourceSkeletonBoneCardinality getCardinality() {
        return cardinality;
    }

    public void setCardinality(ResourceSkeletonBoneCardinality cardinality) {
        this.cardinality = cardinality;
    }

    public ResourceSkeleton getParentSkeleton() {
        return parentSkeleton;
    }

    public void setParentSkeleton(ResourceSkeleton parentSkeleton) {
        this.parentSkeleton = parentSkeleton;
    }
}
