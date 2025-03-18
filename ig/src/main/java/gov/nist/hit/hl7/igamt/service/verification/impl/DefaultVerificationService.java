package gov.nist.hit.hl7.igamt.service.verification.impl;

import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGroup;
import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.CompositeProfileStructure;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.domain.verification.CompositeProfileVerificationResult;
import gov.nist.hit.hl7.igamt.ig.domain.verification.IgVerificationIssuesList;
import gov.nist.hit.hl7.igamt.ig.domain.verification.IgamtObjectError;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.service.verification.VerificationEntryService;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.function.Function;
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
	@Autowired
	VerificationEntryService entry;
	@Autowired
	ValuesetService valuesetService;
	@Autowired
	DatatypeService datatypeService;
	@Autowired
	SegmentService segmentService;
	@Autowired
	IgService igService;

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

	public <T extends Resource> List<IgamtObjectError> verifyList(
			List<T> resources,
			Function<T, List<IgamtObjectError>> verify,
			Function<T, String> getLabel,
			boolean checkDuplicateLabel
	) {
		List<IgamtObjectError> issues = new ArrayList<>();
		Set<String> labels = new HashSet<>();
		for(T resource : resources) {
			issues.addAll(verify.apply(resource));
			if(checkDuplicateLabel) {
				String label = getLabel.apply(resource);
				if(labels.contains(label.toLowerCase())) {
					issues.add(this.entry.DuplicateResourceIdentifier(
							resource.getId(),
							resource.getType(),
							label,
							resource.getDomainInfo().getVersion()
					));
				}  else {
					labels.add(label.toLowerCase());
				}
			}
		}
		return issues;
	}

	@Override
	public IgVerificationIssuesList verify(
			Ig ig,
			List<CompositeProfileStructure> compositeProfiles,
			List<ConformanceProfile> conformanceProfiles,
			List<Segment> segments,
			List<Datatype> datatypes,
			List<Valueset> valueSets,
			List<CoConstraintGroup> coConstraintGroups
	) {
		String defaultHL7Version = this.igService.findDefaultHL7Version(ig);
		IgVerificationIssuesList issuesList = new IgVerificationIssuesList();
		if(conformanceProfiles != null) {
			issuesList.setConformanceProfiles(
					verifyList(
							conformanceProfiles,
							this::verifyConformanceProfile,
							ConformanceProfile::getLabel,
							false
					)
			);
		}
		if(segments != null) {
			issuesList.setSegments(
					verifyList(
							segments,
							this::verifySegment,
							(sg) -> segmentService.getSegmentIdentifier(sg, defaultHL7Version),
							true
					)
			);
		}
		if(datatypes != null) {
			issuesList.setDatatypes(
					verifyList(
							datatypes,
							this::verifyDatatype,
							(dt) -> datatypeService.getDatatypeIdentifier(dt, defaultHL7Version),
							true
					)
			);
		}
		if(valueSets != null) {
			issuesList.setValueSets(
					verifyList(
							valueSets,
							this::verifyValueSet,
							(vs) -> valuesetService.getBindingIdentifier(vs, defaultHL7Version),
							true
					)
			);
		}
		if(coConstraintGroups != null) {
			issuesList.setCoConstraintGroups(
					verifyList(
							coConstraintGroups,
							this::verifyCoConstraintGroup,
							CoConstraintGroup::getLabel,
							false
					)
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
