package gov.nist.hit.hl7.igamt.service.verification.impl;

import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGroup;
import gov.nist.hit.hl7.igamt.coconstraints.service.CoConstraintService;
import gov.nist.hit.hl7.igamt.common.base.domain.*;
import gov.nist.hit.hl7.igamt.common.base.service.RequestScopeCache;
import gov.nist.hit.hl7.igamt.common.exception.EntityNotFound;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.CompositeProfileStructure;
import gov.nist.hit.hl7.igamt.compositeprofile.service.CompositeProfileStructureService;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.domain.verification.*;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.service.verification.VerificationEntryService;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.function.Function;

@Service
public class IgVerificationService {
	@Autowired
	ConformanceProfileVerificationService conformanceProfileVerificationService;
	@Autowired
	CompositeProfileVerificationService compositeProfileVerificationService;
	@Autowired
	DatatypeVerificationService datatypeVerificationService;
	@Autowired
	SegmentVerificationService segmentVerificationService;
	@Autowired
	ValueSetVerificationService valueSetVerificationService;
	@Autowired
	CoConstraintVerificationService coConstraintVerificationService;
	@Autowired
	DatatypeService datatypeService;
	@Autowired
	ValuesetService valuesetService;
	@Autowired
	ConformanceProfileService conformanceProfileService;
	@Autowired
	SegmentService segmentService;
	@Autowired
	CoConstraintService coConstraintService;
	@Autowired
	CompositeProfileStructureService compositeProfileStructureService;
	@Autowired
	IgService igService;
	@Autowired
	VerificationEntryService entry;
	@Autowired
	private RequestScopeCache requestScopeCache;

	public IgVerificationIssuesList verifyIg(Ig ig) {
		String defaultHL7Version = igService.findDefaultHL7Version(ig);
		IgVerificationIssuesList igVerificationIssuesList = new IgVerificationIssuesList();
		// Implementation Guide
		igVerificationIssuesList.setIg(verifyIgMetadata(ig));
		// Conformance Profiles Registry
		igVerificationIssuesList.setConformanceProfiles(new ArrayList<>());
		processRegistry(
				ig,
				Type.CONFORMANCEPROFILE,
				ig.getConformanceProfileRegistry(),
				(id) -> this.conformanceProfileService.findById(id),
				(resource) -> this.conformanceProfileVerificationService.verifyConformanceProfile(resource),
				ConformanceProfile::getLabel,
				false,
				igVerificationIssuesList.getConformanceProfiles()
		);
		// Segments Registry
		igVerificationIssuesList.setSegments(new ArrayList<>());
		processRegistry(
				ig,
				Type.SEGMENT,
				ig.getSegmentRegistry(),
				(id) -> requestScopeCache.getCacheResource(id, Segment.class),
				(resource) -> this.segmentVerificationService.verifySegment(resource),
				(segment) -> this.segmentService.getSegmentIdentifier(segment, defaultHL7Version),
				true,
				igVerificationIssuesList.getSegments()
		);
		// Datatype Registry
		igVerificationIssuesList.setDatatypes(new ArrayList<>());
		processRegistry(
				ig,
				Type.DATATYPE,
				ig.getDatatypeRegistry(),
				(id) -> requestScopeCache.getCacheResource(id, Datatype.class),
				(datatype) -> this.datatypeVerificationService.verifyDatatype(datatype),
				(dt) -> datatypeService.getDatatypeIdentifier(dt, defaultHL7Version),
				true,
				igVerificationIssuesList.getDatatypes()
		);
		// ValueSet Registry
		igVerificationIssuesList.setValueSets(new ArrayList<>());
		processRegistry(
				ig,
				Type.VALUESET,
				ig.getValueSetRegistry(),
				(id) -> requestScopeCache.getCacheResource(id, Valueset.class),
				(resource) -> this.valueSetVerificationService.verifyValueSet(resource),
				(vs) -> valuesetService.getBindingIdentifier(vs, defaultHL7Version),
				true,
				igVerificationIssuesList.getValueSets()
		);
		// CoConstraint Groups Registry
		igVerificationIssuesList.setCoConstraintGroups(new ArrayList<>());
		processRegistry(
				ig,
				Type.COCONSTRAINTGROUP,
				ig.getCoConstraintGroupRegistry(),
				(id) -> {
					try {
						return this.coConstraintService.findById(id);
					} catch (EntityNotFound e) {
						return null;
					}
				},
				(resource) -> this.coConstraintVerificationService.verifyCoConstraintGroup(resource),
				CoConstraintGroup::getLabel,
				false,
				igVerificationIssuesList.getCoConstraintGroups()
		);
		// Composite Profile Registry
		igVerificationIssuesList.setCompositeProfiles(new ArrayList<>());
		igVerificationIssuesList.setGenerated(new ArrayList<>());
		for(Link link: ig.getCompositeProfileRegistry().getChildren()) {
			CompositeProfileStructure resource = this.compositeProfileStructureService.findById(link.getId());
			igVerificationIssuesList.getCompositeProfiles().addAll(verifyResource(ig, resource, link.getId(), Type.COMPOSITEPROFILE));
			if(resource != null) {
				CompositeProfileVerificationResult result = this.compositeProfileVerificationService.verifyCompositeProfile(resource);
				igVerificationIssuesList.getCompositeProfiles().addAll(result.getIssues());
				igVerificationIssuesList.getGenerated().addAll(result.getGenerated());
			}
		}
		// TODO Profile Components
		return igVerificationIssuesList;
	}

	public <T extends Resource> void processRegistry(
			DocumentStructure document,
			Type type,
			Registry registry,
			Function<String, T> getter,
			Function<T, List<IgamtObjectError>> verify,
			Function<T, String> getLabel,
			boolean checkDuplicateLabel,
			List<IgamtObjectError> container
	) {
		Set<String> labels = new HashSet<>();
		for(Link link: registry.getChildren()) {
			T resource = getter.apply(link.getId());
			container.addAll(verifyResource(document, resource, link.getId(), type));
			if(resource != null) {
				container.addAll(verify.apply(resource));
				if(checkDuplicateLabel) {
					String label = getLabel.apply(resource);
					if(labels.contains(label.toLowerCase())) {
						container.add(
								this.entry.DuplicateResourceIdentifier(
										resource.getId(),
										resource.getType(),
										label,
										resource.getDomainInfo().getVersion()
								)
						);
					} else {
						labels.add(label.toLowerCase());
					}
				}
			}
		}
	}

	public List<IgamtObjectError> verifyResource(DocumentStructure parent, Resource resource, String id, Type type) {
		List<IgamtObjectError> issues = new ArrayList<>();
		if(resource == null) {
			issues.add(this.entry.LinkedResourceIsNotFound(parent.getId(), id, type));
		} else {
			DocumentInfo documentInfo = resource.getDocumentInfo();
			if(documentInfo == null) {
				if(resource.getDomainInfo().getScope().equals(Scope.USER)) {
					issues.add(this.entry.LinkedResourceDocumentInfoMissing(id, type));
				}
			} else if(!DocumentType.IGDOCUMENT.equals(documentInfo.getType()) || !parent.getId().equals(documentInfo.getDocumentId())) {
				issues.add(this.entry.LinkedResourceDocumentInfoInvalid(id, type));
			}
		}
		return issues;
	}

	public List<IgamtObjectError> verifyIgMetadata(Ig implementationGuide) {
		List<IgamtObjectError> issues = new ArrayList<>();
		if(StringUtils.isBlank(implementationGuide.getMetadata().getTitle())) {
			issues.add(this.entry.IgTitleIsMissing(implementationGuide.getId()));
		}
		return issues;
	}
}
