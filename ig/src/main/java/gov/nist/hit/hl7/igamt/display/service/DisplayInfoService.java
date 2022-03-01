package gov.nist.hit.hl7.igamt.display.service;

import java.util.Set;

import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGroup;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGroupRegistry;
import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.CompositeProfileStructure;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.registry.CompositeProfileRegistry;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.registry.ConformanceProfileRegistry;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.registry.DatatypeRegistry;
import gov.nist.hit.hl7.igamt.display.model.IGDisplayInfo;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.model.AddMessageResponseObject;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponent;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.domain.registry.SegmentRegistry;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.domain.registry.ValueSetRegistry;

public interface DisplayInfoService {

	IGDisplayInfo covertIgToDisplay(Ig ig);
	Set<DisplayElement> convertDatatypeRegistry(DatatypeRegistry registry);
	Set<DisplayElement> convertConformanceProfileRegistry(ConformanceProfileRegistry registry);
	Set<DisplayElement> convertSegmentRegistry(SegmentRegistry registry);
	Set<DisplayElement> convertValueSetRegistry(ValueSetRegistry registry);
	Set<DisplayElement> convertCoConstraintGroupRegistry(CoConstraintGroupRegistry registry);
	Set<DisplayElement> convertCompositeProfileRegistry(CompositeProfileRegistry registry);
	DisplayElement convertDatatype(Datatype datatype);
	DisplayElement convertCoConstraintGroup(CoConstraintGroup group);
	DisplayElement convertConformanceProfile(ConformanceProfile conformanceProfile, int position);
	DisplayElement convertSegment(Segment segment);
	DisplayElement convertValueSet(Valueset valueset);
	Set<DisplayElement> convertValueSets(Set<Valueset> valueSets);
	Set<DisplayElement> convertDatatypes(Set<Datatype> datatypes);
	Set<DisplayElement> convertSegments(Set<Segment> segments);
	Set<DisplayElement> convertConformanceProfiles(Set<ConformanceProfile> conformanceProfiles, ConformanceProfileRegistry conformanceProfileRegistry);
	DisplayElement convertCompositeProfile(CompositeProfileStructure compositeProfile,  int integer);
	DisplayElement convertProfileComponent(ProfileComponent pc, int integer);
  /**
   * @param ig
   * @param objects
   * @return
   */
  IGDisplayInfo createReturn(Ig ig, AddMessageResponseObject objects);

}
