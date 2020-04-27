package gov.nist.hit.hl7.igamt.coconstraints.service;

import gov.nist.hit.hl7.igamt.coconstraints.exception.CoConstraintGroupNotFoundException;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintBinding;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGroup;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintTable;
import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.RealKey;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.util.ReferenceIndentifier;
import gov.nist.hit.hl7.igamt.common.base.util.RelationShip;
import gov.nist.hit.hl7.igamt.segment.exception.SegmentNotFoundException;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

public interface CoConstraintService {

    public CoConstraintGroup findById(String id) throws CoConstraintGroupNotFoundException;
    List<CoConstraintGroup> findByBaseSegmentAndDocumentIdAndUsername(String baseSegment, String documentId, String username);
    public CoConstraintGroup saveCoConstraintGroup(CoConstraintGroup group);
    public CoConstraintTable resolveRefAndMerge(CoConstraintTable table);
    public CoConstraintGroup clone(String id, Map<String, String> datatypes, Map<String, String> valueSets);
    public CoConstraintGroup createCoConstraintGroupPrototype(String id) throws SegmentNotFoundException;
    public Link createIgLink(CoConstraintGroup group, int position, String username);
    public Set<RelationShip> collectDependencies(ReferenceIndentifier referenceIndentifier,
        List<CoConstraintBinding> coConstraintsBindings);
    public List<CoConstraintGroup> findByIdIn(Set<String> ids);
    public Collection<? extends RelationShip> collectDependencies(CoConstraintGroup ccGroup) ;
    public Link clone(String string, HashMap<RealKey, String> newKeys, Link l, String username,
        Scope user, String documentTarget);
    void updateDependencies(CoConstraintGroup elm, HashMap<RealKey, String> newKeys,
        String username);
    void updateDepenedencies(CoConstraintTable value, HashMap<RealKey, String> newKeys);

}