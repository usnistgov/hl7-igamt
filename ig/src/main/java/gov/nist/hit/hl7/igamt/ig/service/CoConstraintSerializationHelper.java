package gov.nist.hit.hl7.igamt.ig.service;

import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGrouper;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintTable;
import gov.nist.hit.hl7.igamt.coconstraints.model.DataElementHeader;
import gov.nist.hit.hl7.igamt.coconstraints.model.StructureElementRef;
import gov.nist.hit.hl7.igamt.coconstraints.serialization.SerializableCoConstraintTable;
import gov.nist.hit.hl7.igamt.coconstraints.serialization.SerializableDataElementHeader;
import gov.nist.hit.hl7.igamt.coconstraints.serialization.SerializableGrouper;
import gov.nist.hit.hl7.igamt.common.base.exception.ResourceNotFoundException;
import gov.nist.hit.hl7.igamt.ig.model.ResourceSkeleton;
import gov.nist.hit.hl7.igamt.ig.model.ResourceSkeletonBone;
import gov.nist.hit.hl7.igamt.service.impl.exception.PathNotFoundException;

public interface CoConstraintSerializationHelper {

    ResourceSkeleton getSegmentSkeleton(String segmentId);

    ResourceSkeleton getConformanceProfileSkeleton(String cpId);

    SerializableDataElementHeader getSerializableDataElementHeader(DataElementHeader header, ResourceSkeleton segment) throws ResourceNotFoundException, PathNotFoundException;

    SerializableGrouper getSerializableGrouper(CoConstraintGrouper grouper, ResourceSkeleton segment) throws ResourceNotFoundException, PathNotFoundException;

    ResourceSkeletonBone getStructureElementRef(ResourceSkeleton root, StructureElementRef structureElementRef) throws ResourceNotFoundException, PathNotFoundException;

    ResourceSkeletonBone getSegmentRef(ResourceSkeleton root, StructureElementRef context, StructureElementRef segmentRef) throws ResourceNotFoundException, PathNotFoundException;

    SerializableCoConstraintTable getSerializableCoConstraintTable(CoConstraintTable table, ResourceSkeleton segment) throws ResourceNotFoundException, PathNotFoundException;
}
