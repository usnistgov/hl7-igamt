package gov.nist.hit.hl7.igamt.service.verification.impl;

import gov.nist.hit.hl7.igamt.common.base.domain.*;
import gov.nist.hit.hl7.igamt.common.base.service.RequestScopeCache;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.Group;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRef;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRefOrGroup;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Component;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.ig.domain.verification.IgamtObjectError;
import gov.nist.hit.hl7.igamt.ig.model.ResourceRef;
import gov.nist.hit.hl7.igamt.ig.model.ResourceSkeleton;
import gov.nist.hit.hl7.igamt.ig.service.ResourceBindingVerificationService;
import gov.nist.hit.hl7.igamt.segment.domain.Field;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.service.impl.DataElementNamingService;
import gov.nist.hit.hl7.igamt.service.impl.ResourceSkeletonService;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ConformanceProfileVerificationService  extends VerificationUtils {
	@Autowired
	private ResourceBindingVerificationService resourceBindingVerificationService;
	@Autowired
	private CommonVerificationService commonVerificationService;
	@Autowired
	private ConformanceProfileService conformanceProfileService;
	@Autowired
	private SlicingVerificationService slicingVerificationService;
	@Autowired
	private RequestScopeCache requestScopeCache;
	@Autowired
	private ResourceSkeletonService  resourceSkeletonService;

	public List<IgamtObjectError> verifyConformanceProfile(ConformanceProfile conformanceProfile) {
		List<IgamtObjectError> issues = new ArrayList<>();
		// Check conformance profile bindings
		issues.addAll(this.resourceBindingVerificationService.verifyConformanceProfileBindings(conformanceProfile));
		// Check conformance profile structure
		issues.addAll(
				checkStructure(
						conformanceProfile.getChildren(),
						conformanceProfile,
						"",
						new DataElementNamingService(
								requestScopeCache,
								conformanceProfileService
						)
				)
		);
		if(conformanceProfile.getSlicings() != null) {
			ResourceSkeleton resource = new ResourceSkeleton(
					new ResourceRef(
							Type.CONFORMANCEPROFILE,
							conformanceProfile.getId()
					),
					resourceSkeletonService
			);
			issues.addAll(
					slicingVerificationService.verifySlicing(
							resource,
							conformanceProfile.getSlicings()
					)
			);
		}
		checkMetadata(conformanceProfile, issues);
		return issues;
	}

	public void checkMetadata(ConformanceProfile conformanceProfile, List<IgamtObjectError> issues) {
		// Remove duplicate ProfileRole missing or invalid
		List<IgamtObjectError> profileRoleIssues = issues.stream()
				.filter((issue) -> issue.getCode().equals("PROFILE_ROLE_MISSING_OR_INVALID_IX"))
				.collect(Collectors.toList());
		if(profileRoleIssues.size() > 1) {
			for(int i = 1; i < profileRoleIssues.size(); i++) {
				issues.remove(profileRoleIssues.get(i));
			}
		} else if(profileRoleIssues.isEmpty()) {
			if(conformanceProfile.getRole() == null || !Arrays.asList(Role.Receiver, Role.Sender, Role.SenderAndReceiver).contains(conformanceProfile.getRole())) {
				issues.add(this.entry.ProfileRoleMissingOrInvalid(conformanceProfile.getId(), Type.CONFORMANCEPROFILE));
			}
		}
	}

	public List<IgamtObjectError> checkStructure(Set<SegmentRefOrGroup> children, ConformanceProfile conformanceProfile, String parent, DataElementNamingService dataElementNamingService) {
		List<IgamtObjectError> issues = new ArrayList<>();
		for(SegmentRefOrGroup segmentRefOrGroup: children) {
			if(segmentRefOrGroup instanceof SegmentRef) {
				issues.addAll(
						checkSegmentRef(
								(SegmentRef) segmentRefOrGroup,
								conformanceProfile,
								parent,
								dataElementNamingService
						)
				);
			} else if(segmentRefOrGroup instanceof Group) {
				issues.addAll(
						checkGroup((Group) segmentRefOrGroup, conformanceProfile, parent, dataElementNamingService)
				);
			}
		}
		return issues;
	}

	public List<IgamtObjectError> checkSegmentRef(SegmentRef segmentRef, ConformanceProfile conformanceProfile, String parent, DataElementNamingService dataElementNamingService) {
		String pathId = getPathId(parent, segmentRef.getId());
		List<IgamtObjectError> issues = new ArrayList<>();
		LocationInfo locationInfo = dataElementNamingService.computeLocationInfo(conformanceProfile, pathId);
		// Check Reference
		issues.addAll(checkReference(
				segmentRef.getRef().getId(),
				Type.SEGMENT,
				conformanceProfile.getDocumentInfo(),
				conformanceProfile.getId(),
				conformanceProfile.getType(),
				locationInfo
		));
		// Check structure element
		issues.addAll(checkMessageStructureElement(segmentRef, conformanceProfile, locationInfo));
		// Check sub structure
		issues.addAll(checkSegmentSubStructure(segmentRef, conformanceProfile, pathId, dataElementNamingService));
		return issues;
	}

	public List<IgamtObjectError> checkGroup(Group group, ConformanceProfile conformanceProfile, String parent, DataElementNamingService dataElementNamingService) {
		String pathId = getPathId(parent, group.getId());
		List<IgamtObjectError> issues = new ArrayList<>();
		LocationInfo locationInfo = dataElementNamingService.computeLocationInfo(conformanceProfile, pathId);
		// Check structure element
		issues.addAll(checkMessageStructureElement(group, conformanceProfile, locationInfo));
		// Check children
		issues.addAll(checkStructure(group.getChildren(), conformanceProfile, pathId, dataElementNamingService));
		return issues;
	}

	public List<IgamtObjectError> checkMessageStructureElement(MsgStructElement element, ConformanceProfile conformanceProfile, LocationInfo locationInfo) {
		List<IgamtObjectError> issues = new ArrayList<>(this.commonVerificationService.checkCardinality(
				locationInfo,
				conformanceProfile.getId(),
				Type.CONFORMANCEPROFILE,
				element.getUsage(),
				element.getMin(),
				element.getMax()
		));
		issues.addAll(checkIXUsage(locationInfo, element.getUsage(), conformanceProfile));
		return issues;
	}

	public List<IgamtObjectError> checkIXUsage(LocationInfo locationInfo, Usage usage, ConformanceProfile conformanceProfile) {
		List<IgamtObjectError> issues = new ArrayList<>();
		if(usage.equals(Usage.IX)) {
			if (conformanceProfile.getRole() != null) {
				if (conformanceProfile.getRole().equals(Role.Sender)) {
					issues.add(
							this.entry.UsageNotAllowedIXUsageSenderProfile(
									locationInfo,
									conformanceProfile.getId(),
									Type.CONFORMANCEPROFILE
							)
					);
				} else if(conformanceProfile.getRole().equals(Role.SenderAndReceiver)) {
					issues.add(
							this.entry.UsageNOTAllowedIXUsageSenderAndReceiverProfile(
									locationInfo,
									conformanceProfile.getId(),
									Type.CONFORMANCEPROFILE
							)
					);
				}
			} else {
				issues.add(
						this.entry.ProfileRoleMissingOrInvalidIX(conformanceProfile.getId(), Type.CONFORMANCEPROFILE)
				);
			}
		}
		return issues;
	}

	public List<IgamtObjectError> checkSegmentSubStructure(SegmentRef segmentRef, ConformanceProfile conformanceProfile, String parent, DataElementNamingService dataElementNamingService) {
		List<IgamtObjectError> issues = new ArrayList<>();
		Segment segment = requestScopeCache.getCacheResource(segmentRef.getRef().getId(), Segment.class);
		for(Field field: segment.getChildren()) {
			String pathId = getPathId(parent, field.getId());
			LocationInfo locationInfo = dataElementNamingService.computeLocationInfo(conformanceProfile, pathId);
			if(field.getUsage().equals(Usage.IX)) {
				issues.addAll(checkIXUsage(locationInfo, field.getUsage(), conformanceProfile));
			}
			issues.addAll(checkReference(
					field.getRef().getId(),
					Type.DATATYPE,
					conformanceProfile.getDocumentInfo(),
					segment.getId(),
					segment.getType(),
					locationInfo
			));
			issues.addAll(checkDatatypeSubStructure(field, conformanceProfile, pathId, dataElementNamingService, 0));
		}
		return issues;
	}

	public List<IgamtObjectError> checkDatatypeSubStructure(SubStructElement element, ConformanceProfile conformanceProfile, String parent, DataElementNamingService dataElementNamingService, int level) {
		List<IgamtObjectError> issues = new ArrayList<>();
		Datatype datatype = requestScopeCache.getCacheResource(element.getRef().getId(), Datatype.class);
		if(datatype instanceof ComplexDatatype) {
			ComplexDatatype complexDatatype = (ComplexDatatype) datatype;
			for(Component component: complexDatatype.getComponents()) {
				String pathId = getPathId(parent, component.getId());
				LocationInfo locationInfo = dataElementNamingService.computeLocationInfo(conformanceProfile, pathId);
				issues.addAll(
						checkReference(
								component.getRef().getId(),
								Type.DATATYPE,
								conformanceProfile.getDocumentInfo(),
								complexDatatype.getId(),
								complexDatatype.getType(),
								locationInfo
						)
				);
				if(component.getUsage().equals(Usage.IX)) {
					issues.addAll(checkIXUsage(locationInfo, component.getUsage(), conformanceProfile));
				}
				if(level == 2) {
					Datatype subComponentDatatype = requestScopeCache.getCacheResource(component.getRef().getId(), Datatype.class);
					if(subComponentDatatype instanceof ComplexDatatype) {
						LocationInfo parentLocationInfo = dataElementNamingService.computeLocationInfo(conformanceProfile, parent);
						issues.add(this.entry.MaxLevelExceeded(parentLocationInfo, conformanceProfile.getId(), conformanceProfile.getType(), subComponentDatatype.getLabel()));
					}
				} else {
					issues.addAll(checkDatatypeSubStructure(component, conformanceProfile, pathId, dataElementNamingService, level + 1));
				}
			}
		}
		return issues;
	}

	public String getPathId(String parent, String child) {
		if(StringUtils.isBlank(parent)) {
			return child;
		} else {
			return parent + "-" + child;
		}
	}

}
