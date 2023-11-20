package gov.nist.hit.hl7.igamt.service.verification.impl;

import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGroup;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.CompositeProfileStructure;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.domain.verification.CompositeProfileVerificationResult;
import gov.nist.hit.hl7.igamt.ig.domain.verification.IgVerificationIssuesList;
import gov.nist.hit.hl7.igamt.ig.domain.verification.IgamtObjectError;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DefaultVerificationService implements gov.nist.hit.hl7.igamt.service.verification.VerificationService {

	@Autowired
	ConformanceProfileVerificationService conformanceProfileVerificationService;
	@Autowired
	DatatypeVerificationService datatypeVerificationService;
	@Autowired
	SegmentVerificationService segmentVerificationService;
	@Autowired
	ValueSetVerificationService valueSetVerificationService;
	@Autowired
	CoConstraintVerificationService coConstraintVerificationService;
	@Autowired
	CompositeProfileVerificationService compositeProfileVerificationService;
	@Autowired
	IgVerificationService igVerificationService;

	@Override
	public List<IgamtObjectError> verifySegment(Segment segment) {
		return this.segmentVerificationService.verifySegment(segment);
	}

	@Override
	public List<IgamtObjectError> verifyDatatype(Datatype datatype) {
		return this.datatypeVerificationService.verifyDatatype(datatype);
	}

	@Override
	public List<IgamtObjectError> verifyValueSet(Valueset valueSet) {
		return this.valueSetVerificationService.verifyValueSet(valueSet);
	}

	@Override
	public List<IgamtObjectError> verifyConformanceProfile(ConformanceProfile conformanceProfile) {
		return this.conformanceProfileVerificationService.verifyConformanceProfile(conformanceProfile);
	}

	@Override
	public CompositeProfileVerificationResult verifyCompositeProfile(CompositeProfileStructure compositeProfileStructure) {
		return this.compositeProfileVerificationService.verifyCompositeProfile(compositeProfileStructure);
	}

	@Override
	public IgVerificationIssuesList verifyIg(Ig ig) {
		return this.igVerificationService.verifyIg(ig);
	}

	@Override
	public List<IgamtObjectError> verifyCoConstraintGroup(CoConstraintGroup coConstraintGroup) {
		return this.coConstraintVerificationService.verifyCoConstraintGroup(coConstraintGroup);
	}

	@Override
	public IgVerificationIssuesList verify(
			List<CompositeProfileStructure> compositeProfiles,
			List<ConformanceProfile> conformanceProfiles,
			List<Segment> segments,
			List<Datatype> datatypes,
			List<Valueset> valueSets,
			List<CoConstraintGroup> coConstraintGroups
	) {
		IgVerificationIssuesList issuesList = new IgVerificationIssuesList();
		if(conformanceProfiles != null) {
			issuesList.setConformanceProfiles(
					conformanceProfiles.stream().flatMap((cp) -> verifyConformanceProfile(cp).stream()).collect(Collectors.toList())
			);
		}
		if(segments != null) {
			issuesList.setSegments(
					segments.stream().flatMap((s) -> verifySegment(s).stream()).collect(Collectors.toList())
			);
		}
		if(datatypes != null) {
			issuesList.setDatatypes(
					datatypes.stream().flatMap((d) -> verifyDatatype(d).stream()).collect(Collectors.toList())
			);
		}
		if(valueSets != null) {
			issuesList.setValueSets(
					valueSets.stream().flatMap((v) -> verifyValueSet(v).stream()).collect(Collectors.toList())
			);
		}
		if(coConstraintGroups != null) {
			issuesList.setCoConstraintGroups(
					coConstraintGroups.stream().flatMap((ccg) -> verifyCoConstraintGroup(ccg).stream()).collect(Collectors.toList())
			);
		}
		if(compositeProfiles != null) {
			issuesList.setCompositeProfiles(new ArrayList<>());
			issuesList.setGenerated(new ArrayList<>());
			compositeProfiles.forEach((cp) -> {
				CompositeProfileVerificationResult result = verifyCompositeProfile(cp);
				issuesList.getCompositeProfiles().addAll(result.getIssues());
				issuesList.getGenerated().addAll(result.getGenerated());
			});
		}
		return issuesList;
	}
}
