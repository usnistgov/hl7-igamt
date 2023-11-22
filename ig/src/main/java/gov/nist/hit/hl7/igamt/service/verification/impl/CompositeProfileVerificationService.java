package gov.nist.hit.hl7.igamt.service.verification.impl;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;
import gov.nist.hit.hl7.igamt.common.base.service.InMemoryDomainExtensionService;
import gov.nist.hit.hl7.igamt.common.base.service.impl.DataFragment;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.CompositeProfileStructure;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.ProfileComponentsEvaluationResult;
import gov.nist.hit.hl7.igamt.compositeprofile.service.impl.ConformanceProfileCompositeService;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.ig.domain.verification.CompositeProfileVerificationResult;
import gov.nist.hit.hl7.igamt.ig.domain.verification.IgamtObjectError;
import gov.nist.hit.hl7.igamt.ig.model.ResourceRef;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

@Service
public class CompositeProfileVerificationService extends VerificationUtils {
	@Autowired
	ConformanceProfileCompositeService composer;
	@Autowired
	ConformanceProfileVerificationService conformanceProfileVerificationService;
	@Autowired
	SegmentVerificationService segmentVerificationService;
	@Autowired
	DatatypeVerificationService datatypeVerificationService;
	@Autowired
	InMemoryDomainExtensionService domainExtensionService;
	@Autowired
	DatatypeService datatypeService;
	@Autowired
	SegmentService segmentService;

	public CompositeProfileVerificationResult verifyCompositeProfile(CompositeProfileStructure compositeProfile) {
		ProfileComponentsEvaluationResult<ConformanceProfile> profileComponentsEvaluationResult = composer.create(compositeProfile);
		DataFragment<ConformanceProfile> generated = profileComponentsEvaluationResult.getResources();
		String domainExtensionToken = this.domainExtensionService.put(generated.getContext(), generated.getPayload());
		try {
			ResourceRef compositeProfileContext = new ResourceRef(compositeProfile.getType(), compositeProfile.getId());
			CompositeProfileVerificationResult result = new CompositeProfileVerificationResult();
			ConformanceProfile generatedConformanceProfile = generated.getPayload();
			List<IgamtObjectError> issues = new ArrayList<>(conformanceProfileVerificationService.verifyConformanceProfile(generatedConformanceProfile));
			issues.forEach((issue) -> {
				// Update conformance profile issues to reflect composite profile type and id to have issues point to the composite profile
				if(generatedConformanceProfile.getId().equals(issue.getTarget()) && Type.CONFORMANCEPROFILE.equals(issue.getTargetType())) {
					issue.setTarget(compositeProfile.getId());
					issue.setTargetType(compositeProfile.getType());
				}
			});
			List<DisplayElement> displayElements = new ArrayList<>();
			getGeneratedDatatypes(generated).forEach((datatype) -> {
				List<IgamtObjectError> datatypeIssues = this.datatypeVerificationService.verifyDatatype(datatype);
				if(datatypeIssues.size() > 0) {
					// set the target of issue to the composite profile and sub-target to the generated flavor
					datatypeIssues.forEach((issue) -> switchIssueTargetWithCompositeProfile(issue, compositeProfileContext));
					DisplayElement displayElement = this.datatypeService.convertDatatype(datatype);
					displayElement.setGenerated(true);
					displayElements.add(displayElement);
					issues.addAll(datatypeIssues);
				}
			});
			getGeneratedSegments(generated).forEach((segment) -> {
				List<IgamtObjectError> segmentIssues = this.segmentVerificationService.verifySegment(segment);
				if(segmentIssues.size() > 0) {
					// set the target of issue to the composite profile and sub-target to the generated flavor
					segmentIssues.forEach((issue) -> switchIssueTargetWithCompositeProfile(issue, compositeProfileContext));
					DisplayElement displayElement = this.segmentService.convertSegment(segment);
					displayElement.setGenerated(true);
					displayElements.add(displayElement);
					issues.addAll(segmentIssues);
				}
			});
			result.setGenerated(displayElements);
			result.setIssues(issues);
			return result;
		} finally {
			domainExtensionService.clear(domainExtensionToken);
		}
	}

	public void switchIssueTargetWithCompositeProfile(IgamtObjectError issue, ResourceRef compositeProfile) {
		String originalTarget = issue.getTarget();
		Type originalTargetType = issue.getTargetType();
		issue.setTargetType(compositeProfile.getType());
		issue.setTarget(compositeProfile.getId());
		issue.setSubTarget(new ResourceRef(
				originalTargetType,
				originalTarget
		));
	}

	public Stream<Datatype> getGeneratedDatatypes(DataFragment<ConformanceProfile> generated) {
		return generated.getContext().getResources().stream().filter((r) -> r instanceof Datatype).map((r) -> (Datatype) r);
	}

	public Stream<Segment> getGeneratedSegments(DataFragment<ConformanceProfile> generated) {
		return generated.getContext().getResources().stream().filter((r) -> r instanceof Segment).map((r) -> (Segment) r);
	}
}
