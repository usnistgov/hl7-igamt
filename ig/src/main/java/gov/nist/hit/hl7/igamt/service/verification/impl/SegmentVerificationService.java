package gov.nist.hit.hl7.igamt.service.verification.impl;
import com.google.common.base.Strings;
import gov.nist.hit.hl7.igamt.common.base.domain.LocationInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.service.RequestScopeCache;
import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.igamt.ig.domain.verification.IgamtObjectError;
import gov.nist.hit.hl7.igamt.ig.domain.verification.Location;
import gov.nist.hit.hl7.igamt.ig.model.ResourceRef;
import gov.nist.hit.hl7.igamt.ig.model.ResourceSkeleton;
import gov.nist.hit.hl7.igamt.ig.service.ResourceBindingVerificationService;
import gov.nist.hit.hl7.igamt.segment.domain.DynamicMappingItem;
import gov.nist.hit.hl7.igamt.segment.domain.Field;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.service.impl.ResourceSkeletonService;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class SegmentVerificationService extends VerificationUtils {
	@Autowired
	ResourceBindingVerificationService resourceBindingVerificationService;
	@Autowired
	CommonVerificationService commonVerificationService;
	@Autowired
	ResourceSkeletonService resourceSkeletonService;
	@Autowired
	SlicingVerificationService slicingVerificationService;
	@Autowired
	private RequestScopeCache requestScopeCache;

	List<IgamtObjectError> verifySegment(Segment segment) {
		List<IgamtObjectError> errors = new ArrayList<>();
		LocationInfo contextLocationInfo = new LocationInfo(
				segment.getName(),
                segment.getName(),
                null,
                Type.SEGMENT,
                null
		);
		ResourceRef contextResourceRef = new ResourceRef(Type.SEGMENT, segment.getId());
		errors.addAll(checkDynamicMapping(segment, contextLocationInfo, segment.getBinding().getChildren()));
		errors.addAll(commonVerificationService.checkExtension(segment, segment.getExt()));
		errors.addAll(checkFields(segment.getChildren(), contextLocationInfo, contextResourceRef, segment));
		errors.addAll(resourceBindingVerificationService.verifySegmentBindings(segment));
		if(segment.getSlicings() != null) {
			ResourceSkeleton resource = new ResourceSkeleton(contextResourceRef, resourceSkeletonService);
			errors.addAll(
					slicingVerificationService.verifySlicing(
							resource,
							segment.getSlicings()
					)
			);
		}
		return errors;
	}

	List<IgamtObjectError> checkDynamicMapping(Segment segment, LocationInfo segmentLocationInfo, Set<StructureElementBinding> bindings) {
		List<IgamtObjectError> issues = new ArrayList<>();
		String targetElementId = segment.getDynamicMappingInfo().getReferenceFieldId();
		if(segment.getDynamicMappingInfo() != null && !Strings.isNullOrEmpty(targetElementId) && bindings != null && !bindings.isEmpty()) {
			Field dynamicMappingField = segment
					.getChildren()
					.stream()
					.filter((field) -> targetElementId.equals(field.getId()))
					.findFirst()
					.orElse(null);

			if(dynamicMappingField != null) {
				StructureElementBinding structureElementBinding = bindings
						.stream()
						.filter((children) -> children.getElementId().equals(targetElementId))
						.findFirst()
						.orElse(null);

				if(structureElementBinding != null && structureElementBinding.getValuesetBindings() != null && ! structureElementBinding.getValuesetBindings().isEmpty()) {
					Set<String> vsList = structureElementBinding.getValuesetBindings()
					                                            .stream()
					                                            .flatMap((vs) -> vs.getValueSets() != null ? vs.getValueSets().stream() : new ArrayList<String>().stream())
					                                            .filter(Objects::nonNull)
					                                            .filter((value) -> !Strings.isNullOrEmpty(value))
					                                            .collect(Collectors.toSet());

					Set<String> values = segment.getDynamicMappingInfo()
					                            .getItems()
					                            .stream()
					                            .map(DynamicMappingItem::getValue)
					                            .filter(Objects::nonNull)
					                            .filter((value) -> !Strings.isNullOrEmpty(value))
					                            .collect(Collectors.toSet());

					if(!vsList.isEmpty()) {
						LocationInfo field = getFieldLocationInfo(dynamicMappingField, segmentLocationInfo);
						Set<Valueset> valueSets = vsList.stream()
							.map((vsId) -> requestScopeCache.getCacheResource(vsId, Valueset.class))
							.filter(Objects::nonNull)
							.collect(Collectors.toSet());
						issues.addAll(
								commonVerificationService.checkDynamicMappingInValueSet(
										new Location(
												targetElementId,
												field,
												PropertyType.DYNAMICMAPPING
										),
										segment.getId(),
										segment.getType(),
										valueSets,
										values
								)
						);
						issues.addAll(
								commonVerificationService.checkValueSetValuesInDynamicMapping(
										new Location(
												targetElementId,
												field,
												PropertyType.DYNAMICMAPPING
										),
										segment.getId(),
										segment.getType(),
										valueSets,
										values
								)
						);
					}
				}
			}
		}

		return issues;
	}

	List<IgamtObjectError> checkFields(Set<Field> fields, LocationInfo parentLocationInfo, ResourceRef context, Segment segment) {
		List<IgamtObjectError> issues = new ArrayList<>();
		if (fields != null) {
			for (Field field : fields) {
				issues.addAll(checkField(field, parentLocationInfo, context, segment));
			}
		}
		return issues;
	}

	List<IgamtObjectError> checkField(Field field, LocationInfo parentLocationInfo, ResourceRef context, Segment segment) {
		List<IgamtObjectError> issues = new ArrayList<>();
		LocationInfo locationInfo = getFieldLocationInfo(field, parentLocationInfo);
		// Check Reference
		issues.addAll(this.checkReference(
				field.getRef().getId(),
				Type.DATATYPE,
				segment.getDocumentInfo(),
				segment.getId(),
				segment.getType(),
				locationInfo
		));
		// Check length issues
		issues.addAll(commonVerificationService.checkLength(
				field,
				locationInfo,
				context.getId(),
				context.getType()
		));
		// Check constant issues
		issues.addAll(commonVerificationService.checkConstant(
				field,
				locationInfo,
				context.getId(),
				context.getType(),
				issues.isEmpty()
		));
		// Check cardinality issues
		issues.addAll(commonVerificationService.checkCardinality(
				locationInfo,
				context.getId(),
				context.getType(),
				field.getUsage(),
				field.getMin(),
				field.getMax()
		));
		return issues;
	}

	public LocationInfo getFieldLocationInfo(Field field, LocationInfo parentLocationInfo) {
		String hl7Path = concat(parentLocationInfo.getHl7Path(), String.valueOf(field.getPosition()), "-");
		LocationInfo locationInfo = new LocationInfo();
		locationInfo.setName(field.getName());
		locationInfo.setType(Type.FIELD);
		locationInfo.setPathId(concat(parentLocationInfo.getPathId(), field.getId(), "-"));
		locationInfo.setPositionalPath(concat(parentLocationInfo.getPositionalPath(), String.valueOf(field.getPosition()), "."));
		locationInfo.setHl7Path(hl7Path);
		return locationInfo;
	}

	public String concat(String pre, String post, String separator) {
		if(StringUtils.isBlank(pre)) {
			return post;
		} else {
			return pre + separator + post;
		}
	}
}
