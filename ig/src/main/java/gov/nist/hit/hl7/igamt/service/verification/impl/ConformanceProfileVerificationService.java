package gov.nist.hit.hl7.igamt.service.verification.impl;

import gov.nist.hit.hl7.igamt.common.base.domain.*;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.Group;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRef;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRefOrGroup;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Component;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.ig.domain.verification.IgamtObjectError;
import gov.nist.hit.hl7.igamt.ig.service.ResourceBindingVerificationService;
import gov.nist.hit.hl7.igamt.segment.domain.Field;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.service.impl.DataElementNamingService;
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
	private CommonStructureVerificationService commonStructureVerificationService;
	@Autowired
	private DatatypeService datatypeService;
	@Autowired
	private SegmentService segmentService;
	@Autowired
	private ConformanceProfileService conformanceProfileService;

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
								datatypeService,
								segmentService,
								conformanceProfileService
						)
				)
		);
		checkMetadata(conformanceProfile, issues);
		return issues;
	}

	public List<IgamtObjectError> checkMetadata(ConformanceProfile conformanceProfile, List<IgamtObjectError> issues) {
		// Remove duplicate ProfileRole missing or invalid
		List<IgamtObjectError> profileRoleIssues = issues.stream()
				.filter((issue) -> issue.getCode().equals("ProfileRole_MissingOrInValid"))
				.collect(Collectors.toList());
		if(profileRoleIssues.size() > 1) {
			for(int i = 1; i < profileRoleIssues.size(); i++) {
				issues.remove(profileRoleIssues.get(i));
			}
		} else if(profileRoleIssues.size() == 0) {
			if(conformanceProfile.getRole() == null || !Arrays.asList(Role.Receiver, Role.Sender, Role.SenderAndReceiver).contains(conformanceProfile.getRole())) {
				issues.add(this.entry.Required_ProfileRole_Warning(conformanceProfile.getId(), Type.CONFORMANCEPROFILE));
			}
		}
		return issues;
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
		// Check structure element
		issues.addAll(checkMessageStructureElement(segmentRef, conformanceProfile, pathId, dataElementNamingService));
		// Check sub structure
		issues.addAll(checkSegmentSubStructure(segmentRef, conformanceProfile, pathId, dataElementNamingService));
		return issues;
	}

	public List<IgamtObjectError> checkGroup(Group group, ConformanceProfile conformanceProfile, String parent, DataElementNamingService dataElementNamingService) {
		String pathId = getPathId(parent, group.getId());
		List<IgamtObjectError> issues = new ArrayList<>();
		// Check structure element
		issues.addAll(checkMessageStructureElement(group, conformanceProfile, pathId, dataElementNamingService));
		// Check children
		issues.addAll(checkStructure(group.getChildren(), conformanceProfile, pathId, dataElementNamingService));
		return issues;
	}

	public List<IgamtObjectError> checkMessageStructureElement(MsgStructElement element, ConformanceProfile conformanceProfile, String pathId, DataElementNamingService dataElementNamingService) {
		LocationInfo locationInfo = dataElementNamingService.computeLocationInfo(conformanceProfile, pathId);
		List<IgamtObjectError> issues = new ArrayList<>(this.commonStructureVerificationService.checkCardinality(
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
							this.entry.Usage_NOTAllowed_IXUsage_SenderProfile(
									locationInfo,
									conformanceProfile.getId(),
									Type.CONFORMANCEPROFILE
							)
					);
				} else if(conformanceProfile.getRole().equals(Role.SenderAndReceiver)) {
					issues.add(
							this.entry.Usage_NOTAllowed_IXUsage_SenderAndReceiverProfile(
									locationInfo,
									conformanceProfile.getId(),
									Type.CONFORMANCEPROFILE
							)
					);
				}
			} else {
				issues.add(
						this.entry.Required_ProfileRole_Error(conformanceProfile.getId(), Type.CONFORMANCEPROFILE)
				);
			}
		}
		return issues;
	}

	public List<IgamtObjectError> checkSegmentSubStructure(SegmentRef segmentRef, ConformanceProfile conformanceProfile, String parent, DataElementNamingService dataElementNamingService) {
		List<IgamtObjectError> issues = new ArrayList<>();
		Segment segment = getSegmentById(segmentRef.getRef().getId(), dataElementNamingService);
		for(Field field: segment.getChildren()) {
			String pathId = getPathId(parent, field.getId());
			if(field.getUsage().equals(Usage.IX)) {
				LocationInfo locationInfo = dataElementNamingService.computeLocationInfo(conformanceProfile, pathId);
				issues.addAll(checkIXUsage(locationInfo, field.getUsage(), conformanceProfile));
			}
			issues.addAll(checkDatatypeSubStructure(field, conformanceProfile, pathId, dataElementNamingService, 0));
		}
		return issues;
	}

	public List<IgamtObjectError> checkDatatypeSubStructure(SubStructElement element, ConformanceProfile conformanceProfile, String parent, DataElementNamingService dataElementNamingService, int level) {
		List<IgamtObjectError> issues = new ArrayList<>();
		Datatype datatype = getDatatypeById(element.getRef().getId(), dataElementNamingService);
		if(datatype instanceof ComplexDatatype) {
			ComplexDatatype complexDatatype = (ComplexDatatype) datatype;
			for(Component component: complexDatatype.getComponents()) {
				String pathId = getPathId(parent, component.getId());
				if(component.getUsage().equals(Usage.IX)) {
					LocationInfo locationInfo = dataElementNamingService.computeLocationInfo(conformanceProfile, pathId);
					issues.addAll(checkIXUsage(locationInfo, component.getUsage(), conformanceProfile));
				}
				if(level == 2) {
					Datatype subComponentDatatype = getDatatypeById(component.getRef().getId(), dataElementNamingService);
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

	public Segment getSegmentById(String id, DataElementNamingService namingServiceAsCache) {
		return namingServiceAsCache.getSegmentById(id);
	}

	public Datatype getDatatypeById(String id, DataElementNamingService namingServiceAsCache) {
		return namingServiceAsCache.getDatatypeById(id);
	}

	public String getPathId(String parent, String child) {
		if(StringUtils.isBlank(parent)) {
			return child;
		} else {
			return parent + "-" + child;
		}
	}

}
