package gov.nist.hit.hl7.igamt.service;

import gov.nist.hit.hl7.igamt.coconstraints.model.*;
import gov.nist.hit.hl7.igamt.common.base.exception.ResourceNotFoundException;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.constraints.domain.assertion.Assertion;
import gov.nist.hit.hl7.igamt.ig.model.ResourceSkeleton;
import gov.nist.hit.hl7.igamt.ig.model.ResourceSkeletonBone;
import gov.nist.hit.hl7.igamt.service.impl.exception.CoConstraintXMLSerializationException;
import gov.nist.hit.hl7.igamt.service.impl.exception.PathNotFoundException;
import nu.xom.Element;

import java.util.List;

public interface CoConstraintXMLSerialization {

    Element serialize(ConformanceProfile conformanceProfile, String defaultHL7Version) throws CoConstraintXMLSerializationException;

    Element serializeBinding(ResourceSkeleton conformanceProfile, CoConstraintBinding coConstraintBinding, String cpId, String structId, String defaultHL7Version) throws CoConstraintXMLSerializationException;

    Element serializeGrouper(ResourceSkeleton segment, CoConstraintGrouper ccGrouper) throws CoConstraintXMLSerializationException;

    Element serializeCoConstraintForSegment(ResourceSkeleton context, StructureElementRef contextRef, CoConstraintBindingSegment bindingSegment, String cpId, String defaultHL7Version) throws CoConstraintXMLSerializationException;

    Element serializeConditionalTable(ResourceSkeleton segment, StructureElementRef context, String cpId, CoConstraintTableConditionalBinding table, String defaultHL7Version) throws CoConstraintXMLSerializationException;

    Element serializeCondition(StructureElementRef context, String cpId, Assertion assertion);

    Element serializeSimpleTable(ResourceSkeleton segment, CoConstraintTableConditionalBinding table, String defaultHL7Version) throws CoConstraintXMLSerializationException;

    List<Element> serializeTable(ResourceSkeleton segment, CoConstraintTable table, String defaultHL7Version) throws CoConstraintXMLSerializationException;

    Element serializeCoConstraint(ResourceSkeleton segment, CoConstraintTable table, CoConstraint cc, boolean primary, String defaultHL7Version) throws CoConstraintXMLSerializationException;

    List<Element> serializeHeaders(ResourceSkeleton segment, List<CoConstraintHeader> headers, CoConstraint cc, boolean selector, String defaultHL7Version) throws CoConstraintXMLSerializationException;

    Element serializeCell(ResourceSkeleton segment, ColumnType type, CoConstraintCell cell, DataElementHeader header, String defaultHL7Version) throws CoConstraintXMLSerializationException;

    Element serializeCodeCell(ResourceSkeleton segment, DataElementHeader header, CodeCell cell) throws CoConstraintXMLSerializationException;

    Element serializeValueSetCell(ResourceSkeleton segment, DataElementHeader header, ValueSetCell cell, String defaultHL7Version) throws CoConstraintXMLSerializationException;

    Element serializeDatatypeCell(ResourceSkeleton segment, DataElementHeader header, DatatypeCell cell) throws CoConstraintXMLSerializationException;

    Element serializeValueCell(ResourceSkeleton segment, DataElementHeader header, ValueCell cell) throws CoConstraintXMLSerializationException;

    Element serializeVariesCell(ResourceSkeleton segment, DataElementHeader header, VariesCell cell, String defaultHL7Version) throws CoConstraintXMLSerializationException;

    Element serializeAnyCell(ResourceSkeleton segment, DataElementHeader header, AnyCell cell, String defaultHL7Version) throws CoConstraintXMLSerializationException;

    Element serializeCoConstraintGroup(ResourceSkeleton segment, CoConstraintTable table, CoConstraintGroupBindingContained group, String defaultHL7Version) throws CoConstraintXMLSerializationException;
}
