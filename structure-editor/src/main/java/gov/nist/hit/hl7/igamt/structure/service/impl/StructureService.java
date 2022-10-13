package gov.nist.hit.hl7.igamt.structure.service.impl;

import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.MessageStructure;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRefOrGroup;
import gov.nist.hit.hl7.igamt.segment.domain.Field;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.structure.domain.*;

import java.util.List;
import java.util.Set;

public interface StructureService {

    List<MessageStructure> getUserCustomMessageStructure(String user);
    List<Segment> getUserCustomSegment(String user);

    MessageStructure saveMessageStructure(String id, String user, Set<SegmentRefOrGroup> children) throws InvalidStructureException;
    MessageStructure saveMessageMetadata(String id, String user, MessageStructureMetadata metadata);

    Segment saveSegment(String id, String user, Set<Field> children);
    Segment saveSegmentMetadata(String id, String user, SegmentStructureMetadata metadata);

    MessageStructure getMessageStructureForUser(String id, String user);
    Segment getSegmentForUser(String id, String user);

    MessageStructureState getMessageStructureState(MessageStructure structure);
    SegmentStructureState getSegmentStructureState(Segment structure);

    boolean deleteMessageStructure(String id, String user);
    boolean deleteSegmentStructure(String id, String user);
    Set<CustomSegmentCrossRef> getSegmentStructureReferences(String id, String user);


    MessageStructureAndDisplay createMessageStructure(MessageStructureCreateWrapper request, String user);
    SegmentStructureAndDisplay createSegmentStructure(SegmentStructureCreateWrapper request, String user);

    SegmentStructureAndDisplay publishSegment(String id, String user);
    MessageStructureAndDisplay publishMessageStructure(String id, String user);
    SegmentStructureAndDisplay unpublishSegment(String id, String user);
    MessageStructureAndDisplay unpublishMessageStructure(String id, String user);

    CustomStructureRegistry getCustomStructureRegistry(String user);
    List<DisplayElement> getResources(Type type, Scope scope, String version, String user);
    List<DisplayElement> getResourceValueSets(Type type, String id);
	/**
	 * @param structure
	 * @return
	 */
	Set<DisplayElement> getCustomSegments(MessageStructure structure);
	Set<CustomSegmentCrossRef> getLockedSegmentStructure(String id, String user);
}
