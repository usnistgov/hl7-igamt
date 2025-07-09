package gov.nist.hit.hl7.igamt.service.verification.impl;

import com.google.common.base.Strings;
import gov.nist.hit.hl7.igamt.common.base.domain.DocumentInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.LocationInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.igamt.common.slicing.domain.*;
import gov.nist.hit.hl7.igamt.ig.domain.verification.IgamtObjectError;
import gov.nist.hit.hl7.igamt.ig.domain.verification.Location;
import gov.nist.hit.hl7.igamt.ig.model.ResourceSkeleton;
import gov.nist.hit.hl7.igamt.ig.model.ResourceSkeletonBone;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SlicingVerificationService extends VerificationUtils {

	@Autowired
	private AssertionVerificationService assertionVerificationService;

	private final Set<Type> slicingTargets = new HashSet<>(Arrays.asList(Type.FIELD, Type.SEGMENTREF));

	List<IgamtObjectError> verifySlicing(
			ResourceSkeleton resource,
			Set<Slicing> slicingSet
	) {
		List<IgamtObjectError> errors = new ArrayList<>();
		for(Slicing slicing: slicingSet) {
			errors.addAll(this.process(
					resource,
					PropertyType.SLICING,
					slicing.getPath(),
					(target) -> {
						List<IgamtObjectError> issues = new ArrayList<>();
						if(!slicingTargets.contains(target.getLocationInfo().getType())) {
							issues.add(
								this.entry.InvalidSlicingTargetType(
										target.getLocationInfo(),
										resource.getResource().getId(),
										resource.getResource().getType(),
										target.getLocationInfo().getType()
								)
							);
						} else {
							Type flavorType = target.getLocationInfo().getType().equals(Type.FIELD) ? Type.FIELD : Type.SEGMENTREF;
							if(slicing instanceof OrderedSlicing) {
								issues.addAll(
									this.verifyOrderedSlicing(
										target,
										(OrderedSlicing) slicing,
										flavorType
									)
								);
							} else if(slicing instanceof ConditionalSlicing) {
								issues.addAll(
									this.verifyConditionalSlicing(
										target,
										(ConditionalSlicing) slicing,
										flavorType
									)
								);
							}
						}
						return issues;
					}
			));
		}
		return errors;
	}

	List<IgamtObjectError> verifyOrderedSlicing(ResourceSkeletonBone target, OrderedSlicing orderedSlicing, Type type) {
		List<IgamtObjectError> issues  = new ArrayList<>();
		if(orderedSlicing.getSlices() == null || orderedSlicing.getSlices().isEmpty()) {
			issues.add(
					this.entry.EmptySlicing(
							target.getLocationInfo(),
							target.getParent().getId(),
							target.getParent().getType()
					)
			);
		} else {
			Set<Integer> positions = new HashSet<>();
			for(OrderedSlice slice: orderedSlicing.getSlices()) {
				issues.addAll(
					verifyFlavor(
							slice.getFlavorId(),
							type,
							target.getDocumentInfo(),
							target.getParent().getId(),
							target.getParent().getType(),
							target.getLocationInfo()
					)
				);
				if(slice.getPosition() <= 0) {
					issues.add(
							this.entry.OrderedSlicingInvalidPosition(
									target.getLocationInfo(),
									target.getParent().getId(),
									target.getParent().getType(),
									slice.getPosition()
							)
					);
				} else if(positions.contains(slice.getPosition())) {
					issues.add(
							this.entry.OrderedSlicingWithDuplicatePosition(
									target.getLocationInfo(),
									target.getParent().getId(),
									target.getParent().getType(),
									slice.getPosition()
							)
					);
				}
				positions.add(slice.getPosition());
			}
		}
		return issues;
	}

	List<IgamtObjectError> verifyConditionalSlicing(ResourceSkeletonBone target, ConditionalSlicing conditionalSlicing, Type type) {
		List<IgamtObjectError> issues  = new ArrayList<>();
		if(conditionalSlicing.getSlices() == null || conditionalSlicing.getSlices().isEmpty()) {
			issues.add(
					this.entry.EmptySlicing(
							target.getLocationInfo(),
							target.getParent().getId(),
							target.getParent().getType()
					)
			);
		} else {
			for(ConditionalSlice slice: conditionalSlicing.getSlices()){
				issues.addAll(
						verifyFlavor(
								slice.getFlavorId(),
								type,
								target.getDocumentInfo(),
								target.getParent().getId(),
								target.getParent().getType(),
								target.getLocationInfo()
						)
				);
				if(slice.getAssertion() == null) {
					issues.add(
						this.entry.ConditionalSlicingAssertionMissing(
								target.getLocationInfo(),
								target.getParent().getId(),
								target.getParent().getType()
						)
					);
				} else {
					issues.addAll(
						this.assertionVerificationService.checkAssertion(
							target,
							new Location(
								target.getLocationInfo().getPathId(),
								target.getLocationInfo(),
								PropertyType.CONDITIONAL_SLICE_ASSERTION
							),
							slice.getAssertion()
						).stream().peek((entry) -> {
							entry.setTarget(target.getParent().getId());
							entry.setTargetType(target.getParent().getType());
						}).collect(Collectors.toList())
					);
				}
			}
		}
		return issues;
	}

	List<IgamtObjectError> verifyFlavor(
			String id,
			Type type,
			DocumentInfo parent,
			String parentId,
			Type parentType,
			LocationInfo location
	) {
		List<IgamtObjectError> issues  = new ArrayList<>();
		if(Strings.isNullOrEmpty(id)) {
			issues.add(
					this.entry.SliceMissingFlavor(
						location,
						parentId,
						parentType
					)
			);
		} else {
			issues.addAll(this.checkReference(id, type, parent, parentId, parentType, location));
		}
		return issues;
	}
}
