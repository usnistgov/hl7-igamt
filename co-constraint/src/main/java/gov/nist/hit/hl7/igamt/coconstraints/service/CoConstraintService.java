package gov.nist.hit.hl7.igamt.coconstraints.service;

import gov.nist.hit.hl7.igamt.coconstraints.exception.CoConstraintGroupNotFoundException;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGroup;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintTable;
import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.segment.exception.SegmentNotFoundException;

import java.util.List;
import java.util.Map;

public interface CoConstraintService {

    public CoConstraintGroup findById(String id) throws CoConstraintGroupNotFoundException;
    List<CoConstraintGroup> findByBaseSegmentAndDocumentIdAndUsername(String baseSegment, String documentId, String username);
    public CoConstraintGroup saveCoConstraintGroup(CoConstraintGroup group);
    public CoConstraintTable resolveRefAndMerge(CoConstraintTable table);
    public CoConstraintGroup clone(String id, Map<String, String> datatypes, Map<String, String> valueSets);
    public CoConstraintGroup createCoConstraintGroupPrototype(String id) throws SegmentNotFoundException;
    public Link createIgLink(CoConstraintGroup group, int position, String username);
}