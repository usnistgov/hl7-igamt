package gov.nist.hit.hl7.igamt.service.impl;

import com.google.common.base.Strings;
import gov.nist.hit.hl7.igamt.coconstraints.model.*;
import gov.nist.hit.hl7.igamt.coconstraints.serialization.SerializableCoConstraintTable;
import gov.nist.hit.hl7.igamt.coconstraints.serialization.SerializableDataElementHeader;
import gov.nist.hit.hl7.igamt.coconstraints.serialization.SerializableGrouper;
import gov.nist.hit.hl7.igamt.coconstraints.serialization.SerializableHeaders;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.exception.ResourceNotFoundException;
import gov.nist.hit.hl7.igamt.ig.model.ResourceRef;
import gov.nist.hit.hl7.igamt.ig.model.ResourceSkeleton;
import gov.nist.hit.hl7.igamt.ig.model.ResourceSkeletonBone;
import gov.nist.hit.hl7.igamt.ig.model.ResourceSkeletonBoneCardinality;
import gov.nist.hit.hl7.igamt.ig.service.CoConstraintSerializationHelper;
import gov.nist.hit.hl7.igamt.service.impl.exception.PathNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SimpleCoConstraintSerializationHelper implements CoConstraintSerializationHelper {

    @Autowired
    ResourceSkeletonService resourceSkeletonService;

    @Override
    public ResourceSkeleton getSegmentSkeleton(String segmentId) {
        return new ResourceSkeleton(
                new ResourceRef(Type.SEGMENT, segmentId),
                this.resourceSkeletonService
        );
    }

    @Override
    public ResourceSkeleton getConformanceProfileSkeleton(String cpId) {
        return new ResourceSkeleton(
                new ResourceRef(Type.CONFORMANCEPROFILE, cpId),
                this.resourceSkeletonService
        );
    }

    @Override
    public SerializableDataElementHeader getSerializableDataElementHeader(DataElementHeader header, ResourceSkeleton segment) throws ResourceNotFoundException, PathNotFoundException {
        SerializableDataElementHeader serializableDataElementHeader = new SerializableDataElementHeader();
        serializableDataElementHeader.setKey(header.getKey());
        serializableDataElementHeader.setColumnType(header.getColumnType());
        serializableDataElementHeader.setType(header.getType());

        ResourceSkeletonBone target = segment.get(header.getKey());
        if(target != null) {
            DataElementHeaderInfo info = new DataElementHeaderInfo();
            info.setDatatype(target.getResource().getFixedName());
            info.setVersion(target.getResource().getDomainInfo().getVersion());
            info.setLocation(target.getPosition());
            info.setType(target.getLocationInfo().getType());
            info.setParent(target.getParent().getFixedName());
            info.setCardinality(target.getCardinality() != null ? new CoConstraintCardinality(target.getCardinality().getMin(), target.getCardinality().getMax()) : null);

            serializableDataElementHeader.setElementInfo(info);
            serializableDataElementHeader.setName(target.getLocationInfo().getHl7Path());
            serializableDataElementHeader.setCardinality(hasCardinalityColumn(header, target.getCardinality()));

            return  serializableDataElementHeader;
        } else {
            throw new PathNotFoundException("CoConstraint Header at Path " + header.getKey() + " was not found");
        }
    }

    @Override
    public SerializableGrouper getSerializableGrouper(CoConstraintGrouper grouper, ResourceSkeleton segment) throws ResourceNotFoundException, PathNotFoundException {
        SerializableGrouper serializableGrouper = new SerializableGrouper();
        serializableGrouper.setPathId(grouper.getPathId());

        ResourceSkeletonBone target = segment.get(grouper.getPathId());
        if(target != null) {
            serializableGrouper.setDatatype(target.getResource().getResourceName());
            serializableGrouper.setDescription(target.getLocationInfo().getName());
            serializableGrouper.setName(target.getLocationInfo().getHl7Path());
            serializableGrouper.setType(target.getLocationInfo().getType());
            serializableGrouper.setVersion(target.getResource().getDomainInfo().getVersion());
            return  serializableGrouper;
        } else {
            throw new PathNotFoundException("CoConstraint Grouper at Path " + grouper.getPathId() + " was not found");
        }
    }

    @Override
    public ResourceSkeletonBone getStructureElementRef(ResourceSkeleton root, StructureElementRef structureElementRef) throws ResourceNotFoundException, PathNotFoundException {
        ResourceSkeletonBone target = root.get(structureElementRef.getPathId());
        if(target == null) {
            throw new PathNotFoundException("Structure Reference at Path " + structureElementRef.getPathId() + " was not found");
        } else {
            return target;
        }
    }

    @Override
    public ResourceSkeletonBone getSegmentRef(ResourceSkeleton root, StructureElementRef context, StructureElementRef segmentRef) throws ResourceNotFoundException, PathNotFoundException {
        if(context == null || Strings.isNullOrEmpty(context.getPathId())) {
            return getStructureElementRef(root, segmentRef);
        } else {
            ResourceSkeletonBone contextSkeleton = getStructureElementRef(root, context);
            return getStructureElementRef(contextSkeleton, segmentRef);
        }
    }

    @Override
    public SerializableCoConstraintTable getSerializableCoConstraintTable(CoConstraintTable table, ResourceSkeleton segment) throws ResourceNotFoundException, PathNotFoundException {
        SerializableCoConstraintTable coConstraintTable = new SerializableCoConstraintTable();
        coConstraintTable.setId(table.getId());
        coConstraintTable.setTableType(table.getTableType());
        coConstraintTable.setCoConstraints(table.getCoConstraints());
        coConstraintTable.setDelta(table.getDelta());
        coConstraintTable.setGroups(table.getGroups());
        coConstraintTable.setHeaders(getSerializableHeaders(table.getHeaders(), segment));
        return coConstraintTable;
    }

    public SerializableHeaders getSerializableHeaders(CoConstraintHeaders headers, ResourceSkeleton segment) throws ResourceNotFoundException, PathNotFoundException {
        SerializableHeaders serializableHeaders = new SerializableHeaders();
        serializableHeaders.setNarratives(headers.getNarratives());
        serializableHeaders.setSerializableSelectors(
                getSerializableDataElementHeaders(
                        headers.getSelectors().stream()
                                .map((h) -> (DataElementHeader) h)
                                .collect(Collectors.toList()),
                        segment
                )
        );
        serializableHeaders.setSerializableConstraints(
                getSerializableDataElementHeaders(
                        headers.getConstraints().stream()
                                .map((h) -> (DataElementHeader) h)
                                .collect(Collectors.toList()),
                        segment
                )
        );
        if(headers.getGrouper() != null) {
            serializableHeaders.setGrouper(
                    getSerializableGrouper(headers.getGrouper(), segment)
            );
        }
        return serializableHeaders;
    }

    public List<SerializableDataElementHeader> getSerializableDataElementHeaders(List<DataElementHeader> headers, ResourceSkeleton segment) throws ResourceNotFoundException, PathNotFoundException {
        List<SerializableDataElementHeader> serializableDataElementHeaders = new ArrayList<>();
        for (DataElementHeader header : headers) {
            serializableDataElementHeaders.add(getSerializableDataElementHeader(header, segment));
        }
        return serializableDataElementHeaders;
    }


    boolean hasCardinalityColumn(DataElementHeader header, ResourceSkeletonBoneCardinality cardinality) {
        try {
            boolean cardinalityIsSet = cardinality != null && !Strings.isNullOrEmpty(cardinality.getMax());
            boolean cardMaxIsStar = cardinalityIsSet && cardinality.getMax().equals("*");
            boolean cardIsMoreThanOne = cardinalityIsSet && Integer.parseInt(cardinality.getMax()) > 1;
            return cardMaxIsStar || cardIsMoreThanOne && header.getColumnType().equals(ColumnType.VARIES);
        } catch (Exception e){
            return false;
        }
    }
}
