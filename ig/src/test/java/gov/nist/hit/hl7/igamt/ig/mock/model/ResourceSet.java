package gov.nist.hit.hl7.igamt.ig.mock.model;

import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGroup;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGroupRegistry;
import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.registry.ConformanceProfileRegistry;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.registry.DatatypeRegistry;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.domain.registry.ValueSetRegistry;
import gov.nist.hit.hl7.igamt.segment.domain.registry.SegmentRegistry;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class ResourceSet {
	private final Map<String, Datatype> datatypes = new HashMap<>();
	private final Map<String, Segment> segments = new HashMap<>();
	private final Map<String, ConformanceProfile> conformanceProfiles = new HashMap<>();
	private final Map<String, Valueset> valueSets = new HashMap<>();
	private final Map<String, CoConstraintGroup> coConstraintGroups = new HashMap<>();

	public ResourceSet() {
	}

	public ResourceSet(Set<Datatype> datatypes, Set<Segment> segments, Set<ConformanceProfile> conformanceProfiles, Set<Valueset> valueSets, Set<CoConstraintGroup> coConstraintGroups) {
		datatypes.forEach(dt -> this.datatypes.put(dt.getId(), dt));
		segments.forEach(s -> this.segments.put(s.getId(), s));
		conformanceProfiles.forEach(cp -> this.conformanceProfiles.put(cp.getId(), cp));
		valueSets.forEach(vs -> this.valueSets.put(vs.getId(), vs));
		coConstraintGroups.forEach(ccg -> this.coConstraintGroups.put(ccg.getId(), ccg));
	}

	public Set<Datatype> getDatatypes() {
		return new HashSet<>(datatypes.values());
	}

	public Set<Segment> getSegments() {
		return new HashSet<>(segments.values());
	}

	public Set<ConformanceProfile> getConformanceProfiles() {
		return new HashSet<>(conformanceProfiles.values());
	}

	public Set<Valueset> getValueSets() {
		return new HashSet<>(valueSets.values());
	}

	public Set<CoConstraintGroup> getCoConstraintGroups() {
		return new HashSet<>(coConstraintGroups.values());
	}

	public DatatypeRegistry getDatatypeRegistry() {
		DatatypeRegistry registry = new DatatypeRegistry();
		Set<Link> links = new HashSet<>();
		this.getDatatypes().forEach((r) -> links.add(new Link(r)));
		registry.setChildren(links);
		return registry;
	}
	public SegmentRegistry getSegmentRegistry() {
		SegmentRegistry registry = new SegmentRegistry();
		Set<Link> links = new HashSet<>();
		this.getSegments().forEach((r) -> links.add(new Link(r)));
		registry.setChildren(links);
		return registry;
	}
	public ConformanceProfileRegistry getConformanceProfileRegistry() {
		ConformanceProfileRegistry registry = new ConformanceProfileRegistry();
		Set<Link> links = new HashSet<>();
		this.getConformanceProfiles().forEach((r) -> links.add(new Link(r)));
		registry.setChildren(links);
		return registry;
	}
	public ValueSetRegistry getValuesetRegistry() {
		ValueSetRegistry registry = new ValueSetRegistry();
		Set<Link> links = new HashSet<>();
		this.getValueSets().forEach((r) -> links.add(new Link(r)));
		registry.setChildren(links);
		return registry;
	}
	public CoConstraintGroupRegistry getCoConstraintGroupRegistry() {
		CoConstraintGroupRegistry registry = new CoConstraintGroupRegistry();
		Set<Link> links = new HashSet<>();
		this.getCoConstraintGroups().forEach((r) -> links.add(new Link(r)));
		registry.setChildren(links);
		return registry;
	}

	public void add(ResourceSet resourceSet) {
		resourceSet.getDatatypes().forEach((r) -> datatypes.putIfAbsent(r.getId(), r));
		resourceSet.getSegments().forEach((r) -> segments.putIfAbsent(r.getId(), r));
		resourceSet.getConformanceProfiles().forEach((r) -> conformanceProfiles.putIfAbsent(r.getId(), r));
		resourceSet.getValueSets().forEach((r) -> valueSets.putIfAbsent(r.getId(), r));
		resourceSet.getCoConstraintGroups().forEach((r) -> coConstraintGroups.putIfAbsent(r.getId(), r));
	}

	public ResourceSet withDatatypes(Datatype... datatypeList) {
		Arrays.asList(datatypeList).forEach((r) -> datatypes.putIfAbsent(r.getId(), r));
		return this;
	}

	public ResourceSet withSegments(Segment... segmentList) {
		Arrays.asList(segmentList).forEach((r) -> segments.putIfAbsent(r.getId(), r));
		return this;
	}

	public ResourceSet withConformanceProfile(ConformanceProfile... conformanceProfile) {
		Arrays.asList(conformanceProfile).forEach((r) -> conformanceProfiles.putIfAbsent(r.getId(), r));
		return this;
	}

	public Set<Resource> getResources() {
		return Stream.concat(
				this.getDatatypes().stream(),
				Stream.concat(
						this.getSegments().stream(),
						Stream.concat(
								this.getConformanceProfiles().stream(),
								Stream.concat(
										this.getValueSets().stream(),
										this.getCoConstraintGroups().stream()
								)
						)
				)
		).collect(Collectors.toSet());
	}
}
