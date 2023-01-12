package gov.nist.hit.hl7.igamt.service.impl;

import com.google.common.base.Strings;
import gov.nist.hit.hl7.igamt.common.base.domain.LocationInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;
import gov.nist.hit.hl7.igamt.common.base.exception.ResourceNotFoundException;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.Group;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRef;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRefOrGroup;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.ig.model.*;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ResourceSkeletonService {

    @Autowired
    DatatypeService datatypeService;
    @Autowired
    SegmentService segmentService;
    @Autowired
    ConformanceProfileService conformanceProfileService;


    public ResourceSkeletonInfo loadSkeleton(ResourceRef resourceRef, ResourceSkeleton parent) throws ResourceNotFoundException {
        switch (resourceRef.getType()) {
            case DATATYPE:
                return loadDatatypeSkeleton(resourceRef.getId(), getParentLocationInfo(parent), parent);
            case SEGMENT:
                return loadSegmentSkeleton(resourceRef.getId(), getParentLocationInfo(parent), parent);
            case CONFORMANCEPROFILE:
                return loadConformanceProfileSkeleton(resourceRef.getId(), parent);
            default:
                return null;
        }
    }

    public ResourceSkeletonInfo loadDatatypeSkeleton(String id, LocationInfo parentLocationInfo, ResourceSkeleton parent) throws ResourceNotFoundException {
        Datatype datatype = this.datatypeService.findById(id);
        if(datatype == null) {
            throw new ResourceNotFoundException(id, Type.DATATYPE);
        }

        DisplayElement resource = this.datatypeService.convertDatatype(datatype);

        if(datatype instanceof ComplexDatatype) {
            List<ResourceSkeletonBone> children = ((ComplexDatatype) datatype).getComponents().stream().map(component -> new ResourceSkeletonBone(
                    new ResourceRef(Type.DATATYPE, component.getRef().getId()),
                    component.getId(),
                    component.getPosition(),
                    makeLocationInfo(parentLocationInfo, resource, component.getType(), component.getName(), component.getPosition(), component.getId()),
                    resource,
                    component.getUsage(),
                    null,
                    parent,
                    this
            )).collect(Collectors.toList());
            return new ResourceSkeletonInfo(children, resource);
        } else {
            return new ResourceSkeletonInfo(Collections.emptyList(), resource);
        }
    }
    public ResourceSkeletonInfo loadSegmentSkeleton(String id, LocationInfo parentLocationInfo, ResourceSkeleton parent) throws ResourceNotFoundException {
        Segment segment = this.segmentService.findById(id);
        if(segment == null) {
            throw new ResourceNotFoundException(id, Type.SEGMENT);
        }

        DisplayElement resource = this.segmentService.convertSegment(segment);

        List<ResourceSkeletonBone> children =  segment.getChildren().stream().map(field -> new ResourceSkeletonBone(
                new ResourceRef(Type.DATATYPE, field.getRef().getId()),
                field.getId(),
                field.getPosition(),
                makeLocationInfo(parentLocationInfo, resource, field.getType(), field.getName(), field.getPosition(), field.getId()),
                resource,
                field.getUsage(),
                new ResourceSkeletonBoneCardinality(field.getMin(), field.getMax()),
                parent,
                this
        )).collect(Collectors.toList());
        return new ResourceSkeletonInfo(children, resource);
    }

    public ResourceSkeletonInfo loadConformanceProfileSkeleton(String id, ResourceSkeleton parent) throws ResourceNotFoundException {
        ConformanceProfile conformanceProfile = this.conformanceProfileService.findById(id);
        if(conformanceProfile == null) {
            throw new ResourceNotFoundException(id, Type.CONFORMANCEPROFILE);
        }

        DisplayElement resource = this.conformanceProfileService.convertConformanceProfile(conformanceProfile, 0);
        return new ResourceSkeletonInfo(getGroupChildren(resource, conformanceProfile.getChildren(), null, parent), resource);
    }

    public List<ResourceSkeletonBone> getGroupChildren(DisplayElement parent, Set<SegmentRefOrGroup> segmentRefOrGroups, LocationInfo parentLocationInfo, ResourceSkeleton parentSkeleton) {
        List<ResourceSkeletonBone> children = new ArrayList<>();
        for(SegmentRefOrGroup element: segmentRefOrGroups) {
            if(element instanceof Group) {
                LocationInfo groupLocationInfo = makeLocationInfo(parentLocationInfo, null, element.getType(), element.getName(), element.getPosition(), element.getId());
                List<ResourceSkeletonBone> groupChildren = getGroupChildren(parent, ((Group) element).getChildren(), groupLocationInfo, null);
                ResourceSkeletonBone group = new ResourceSkeletonBone(
                        groupChildren,
                        element.getId(),
                        element.getPosition(),
                        groupLocationInfo,
                        parent,
                        element.getUsage(),
                        new ResourceSkeletonBoneCardinality(element.getMin(), element.getMax()),
                        parentSkeleton,
                        this
                );
                groupChildren.forEach(gc -> gc.setParentSkeleton(group));
                group.setResource(parent);
                children.add(group);
            } else if(element instanceof SegmentRef) {
                children.add(new ResourceSkeletonBone(
                        new ResourceRef(Type.SEGMENT, ((SegmentRef) element).getRef().getId()),
                        element.getId(),
                        element.getPosition(),
                        makeLocationInfo(parentLocationInfo, null, element.getType(), element.getName(), element.getPosition(), element.getId()),
                        parent,
                        element.getUsage(),
                        new ResourceSkeletonBoneCardinality(element.getMin(), element.getMax()),
                        parentSkeleton,
                        this
                ));
            }
        }
        return children;
    }

    public LocationInfo makeLocationInfo(LocationInfo parent, DisplayElement resource, Type location, String name, int position, String elementId) {
        LocationInfo locationInfo = new LocationInfo();
        if(parent == null) {
            locationInfo.setName(name);
            locationInfo.setType(location);
            locationInfo.setPositionalPath(position + "");
            locationInfo.setPathId(elementId);
            if(resource != null) {
                locationInfo.setHl7Path(append(resource.getFixedName(), "-", position + ""));
            } else {
                locationInfo.setHl7Path(name);
            }
            return locationInfo;
        } else {
            locationInfo.setName(name);
            locationInfo.setType(parent.getType().equals(Type.COMPONENT) ? Type.SUBCOMPONENT : location);
            locationInfo.setPositionalPath(append(parent.getPositionalPath(), ".", position + ""));
            if(location.equals(Type.GROUP) || location.equals(Type.SEGMENTREF)) {
                locationInfo.setHl7Path(append(parent.getHl7Path(), ".", name));
            }
            else {
                locationInfo.setHl7Path(append(parent.getHl7Path(), ".", position + ""));
            }
            locationInfo.setPathId(append(parent.getPathId(), "-", elementId));
            return locationInfo;
        }
    }

    public LocationInfo getParentLocationInfo(ResourceSkeleton resourceSkeletonBone) {
        if(resourceSkeletonBone instanceof ResourceSkeletonBone) {
            return ((ResourceSkeletonBone) resourceSkeletonBone).getLocationInfo();
        }
        return null;
    }

    private String append(String source, String sep, String value) {
        if(Strings.isNullOrEmpty(source)) {
            return value;
        } else {
            return source + sep + value;
        }
    }


}
