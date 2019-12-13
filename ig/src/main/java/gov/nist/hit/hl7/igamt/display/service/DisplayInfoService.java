package gov.nist.hit.hl7.igamt.display.service;

import java.util.Set;

import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGroup;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGroupRegistry;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.registry.ConformanceProfileRegistry;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.registry.DatatypeRegistry;
import gov.nist.hit.hl7.igamt.display.model.DisplayElement;
import gov.nist.hit.hl7.igamt.display.model.IGDisplayInfo;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.domain.registry.SegmentRegistry;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.domain.registry.ValueSetRegistry;

public interface DisplayInfoService {

	public IGDisplayInfo covertIgToDisplay(Ig ig);
	public Set<DisplayElement> convertDatatypeRegistry(DatatypeRegistry registry);
	public Set<DisplayElement> convertConformanceProfileRegistry(ConformanceProfileRegistry registry);
	public Set<DisplayElement> convertSegmentRegistry(SegmentRegistry registry);
	public Set<DisplayElement> convertValueSetRegistry(ValueSetRegistry registry);
	public Set<DisplayElement> convertCoConstraintGroupRegistry(CoConstraintGroupRegistry registry);
	public DisplayElement convertDatatype(Datatype datatype);
	public DisplayElement convertCoConstraintGroup(CoConstraintGroup group);
	public DisplayElement convertConformanceProfile(ConformanceProfile conformanceProfile);
	public DisplayElement convertSegment(Segment segment);
	public DisplayElement convertValueSet(Valueset valueset);
	public Set<DisplayElement> convertValueSets(Set<Valueset> valueSets);
	public Set<DisplayElement> convertConformanceProfiles(Set<ConformanceProfile> conformanceProfiles);
	public Set<DisplayElement> convertDatatypes(Set<Datatype> datatypes);
	public Set<DisplayElement> convertSegments(Set<Segment> segments);

	
}
