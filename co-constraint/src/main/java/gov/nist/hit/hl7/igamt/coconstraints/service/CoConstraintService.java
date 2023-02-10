package gov.nist.hit.hl7.igamt.coconstraints.service;

import java.util.List;
import java.util.Set;

import gov.nist.hit.hl7.igamt.coconstraints.model.*;
import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.exception.EntityNotFound;
import gov.nist.hit.hl7.igamt.segment.exception.SegmentNotFoundException;

public interface CoConstraintService {

    CoConstraintGroup findById(String id) throws EntityNotFound;
    void delete(CoConstraintGroup ccGroup);
    List<CoConstraintGroup> findByBaseSegmentAndDocumentIdAndUsername(String baseSegment, String documentId, String username);
    CoConstraintGroup saveCoConstraintGroup(CoConstraintGroup group);
    CoConstraintTable resolveRefAndMerge(CoConstraintTable table);
    CoConstraintGroup createCoConstraintGroupPrototype(String id) throws SegmentNotFoundException;
    boolean codeCellIsEmpty(CodeCell cell);
    boolean constantCellIsEmpty(ValueCell cell);
    boolean datatypeCellIsEmpty(DatatypeCell cell);
    boolean valueSetCellIsEmpty(ValueSetCell vsCell);
    boolean cellIsEmpty(CoConstraintCell cell);
    boolean variesCellIsEmpty(VariesCell variesCell);
    Link createIgLink(CoConstraintGroup group, int position, String username);
    List<CoConstraintGroup> findByIdIn(Set<String> ids);
    List<CoConstraintGroup>  saveAll(Set<CoConstraintGroup> coConstraintGroups) ;
    void updateCloneTag(CoConstraintTable value, boolean cloned);
}