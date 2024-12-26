package gov.nist.hit.hl7.igamt.compositeprofile.service.impl;

import com.google.common.base.Strings;
import gov.nist.hit.hl7.igamt.common.base.domain.*;
import gov.nist.hit.hl7.igamt.common.base.service.InMemoryDomainExtensionService;
import gov.nist.hit.hl7.igamt.common.base.service.impl.DataExtension;
import gov.nist.hit.hl7.igamt.common.base.service.impl.DataFragment;
import gov.nist.hit.hl7.igamt.common.binding.service.BindingService;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.*;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.Group;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRef;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRefOrGroup;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Component;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.*;
import gov.nist.hit.hl7.igamt.segment.domain.Field;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ComposeConformanceProfileService implements ConformanceProfileCreationService {

	@Autowired
	ConformanceProfileService confProfileService;
	@Autowired
	DatatypeService datatypeService;
	@Autowired
	SegmentService segmentService;
	@Autowired
	BindingService bindingService;
	@Autowired
	ChangeDirectiveService changeDirectiveService;
	@Autowired
	InMemoryDomainExtensionService inMemoryDomainExtensionService;

	@Override
	public ProfileComponentsEvaluationResult<ConformanceProfile> create(CompositeProfileStructure structure) throws Exception {
		ConformanceProfile target = this.confProfileService.findById(structure.getConformanceProfileId());
		List<ResourceChangeDirective> resourceChangeDirectives = this.changeDirectiveService.createConformanceProfileChangeDirective(structure, target);
		CompositeProfileDataExtension context = new CompositeProfileDataExtension();
		for(ResourceChangeDirective resourceChangeDirective : resourceChangeDirectives) {
			GenerationDirective reference = new GenerationDirective(
					resourceChangeDirective.getProfileComponentId(),
					resourceChangeDirective.getContextType(),
					resourceChangeDirective.getContextId()
			);
			if(resourceChangeDirective instanceof ConformanceProfileContextChangeDirective) {
				applyConformanceProfileContextChangeDirective(
						(ConformanceProfileContextChangeDirective) resourceChangeDirective,
						target,
						context,
						reference,
						""
				);
			} else if (resourceChangeDirective instanceof SegmentContextChangeDirective) {
				applySegmentContextChangeDirective(
						(SegmentContextChangeDirective) resourceChangeDirective,
						target.getChildren(),
						context,
						reference,
						""
				);
			}
		}
		String ext = structure.getFlavorsExtension();
		context.prune(ext);
		target.setId(structure.getId() + '_' + ext);
		target.setName(structure.getName());
		// The following is necessary for makeLocationInfo to work, long term solution is to get rid of location info in bindings
		String token = inMemoryDomainExtensionService.put(context, target);
		try {
			this.makeLocationInfo(target, context);
		} finally {
			inMemoryDomainExtensionService.clear(token);
		}
		return new ProfileComponentsEvaluationResult<>(new DataFragment<>(target, context), context.generatedResourceMetadataList);
	}

	private void makeLocationInfo(ConformanceProfile target, CompositeProfileDataExtension context) {
		this.confProfileService.makeLocationInfo(target);
		context.generatedResourceMetadataList.forEach((resourceMetadata) -> {
			if(resourceMetadata.getType().equals(Segment.class)) {
				Segment segment = context.get(
						resourceMetadata.getGeneratedResourceId(),
						Segment.class
				);
				this.segmentService.makeLocationInfo(segment);
			} else if(resourceMetadata.getType().equals(ComplexDatatype.class)) {
				ComplexDatatype datatype = context.get(
						resourceMetadata.getGeneratedResourceId(),
						ComplexDatatype.class
				);
				this.datatypeService.makeLocationInfo(datatype);
			} else if(resourceMetadata.getType().equals(Datatype.class)) {
				Datatype datatype = context.get(
						resourceMetadata.getGeneratedResourceId(),
						Datatype.class
				);
				this.datatypeService.makeLocationInfo(datatype);
			}
		});
	}

	private Set<ItemProperty> bindingsToItemProperty(Set<PropertyBinding> bindings) {
		return bindings.stream().map((e) -> (ItemProperty) e).collect(Collectors.toSet());
	}

	public void applyConformanceProfileContextChangeDirective(ConformanceProfileContextChangeDirective directive, ConformanceProfile target, CompositeProfileDataExtension context, GenerationDirective pcReference, String elementPath) throws Exception {
		if(!directive.matches(target)) {
			return;
		}
		applyConformanceProfileChangeDirective(directive, target, context, pcReference, elementPath);
	}

	public void applySegmentContextChangeDirective(SegmentContextChangeDirective directive, Set<SegmentRefOrGroup> children, CompositeProfileDataExtension context, GenerationDirective pcReference, String elementPath) throws Exception {
		for(SegmentRefOrGroup child: children) {
			if(child instanceof SegmentRef) {
				String segmentId = ((SegmentRef) child).getRef().getId();
				boolean segmentRefMatchesContext = segmentContextMatches(segmentId, directive, context);
				if(segmentRefMatchesContext) {
					applySegmentChangeDirective(
							(SegmentRef) child,
							directive.getDirective(),
							context,
							pcReference,
							createPath(elementPath, child.getId())
					);
				}
			} else if(child instanceof Group) {
				applySegmentContextChangeDirective(directive, ((Group) child).getChildren(), context, pcReference, createPath(elementPath, child.getId()));
			}
		}
	}

	public void applyConformanceProfileChangeDirective(ConformanceProfileContextChangeDirective directive, ConformanceProfile target, CompositeProfileDataExtension context, GenerationDirective pcReference, String elementPath) throws Exception {
		if(directive.getBindings() != null && !directive.getBindings().isEmpty()) {
			this.applyConformanceProfile(target, bindingsToItemProperty(directive.getBindings()));
		}
		if(directive.getCoConstraints() != null) {
			directive.getCoConstraints().onConformanceProfile(target);
		}
		if(directive.getChildren() != null && !directive.getChildren().isEmpty()) {
			applySegRefOrGroupChangeDirective(directive.getChildren(), target.getChildren(), context, pcReference, elementPath);
		}
	}

	public String createPath(String parent, String child) {
		if(Strings.isNullOrEmpty(parent)) {
			return child;
		} else {
			return parent + "-" + child;
		}
	}

	public void applySegRefOrGroupChangeDirective(Map<String, SegRefOrGroupChangeDirective> directive, Set<SegmentRefOrGroup> children, CompositeProfileDataExtension context, GenerationDirective pcReference, String elementPath) throws Exception {
		for(SegmentRefOrGroup child: children) {
			if(directive.containsKey(child.getId())) {
				SegRefOrGroupChangeDirective segRefOrGroupChangeDirective = directive.get(child.getId());
				if(child instanceof SegmentRef && segRefOrGroupChangeDirective instanceof SegRefChangeDirective) {
					applySegRefChangeDirective((SegmentRef) child, (SegRefChangeDirective) segRefOrGroupChangeDirective, context, pcReference, createPath(elementPath, child.getId()));
				} else if(child instanceof Group && segRefOrGroupChangeDirective instanceof GroupChangeDirective ) {
					applyGroupChangeDirective((Group) child, (GroupChangeDirective) segRefOrGroupChangeDirective, context, pcReference, createPath(elementPath, child.getId()));
				}
			}
		}
	}

	public void applySegRefChangeDirective(SegmentRef segmentRef, SegRefChangeDirective directive, CompositeProfileDataExtension context, GenerationDirective pcReference, String elementPath) throws Exception {
		if(directive.getItem() != null) {
			applyMsgStructureElement(segmentRef, directive.getItem().getItemProperties());
		}
		if(directive.getSegment() != null) {
			applySegmentChangeDirective(segmentRef, directive.getSegment(), context, pcReference, elementPath);
		}
	}

	public void applySegmentChangeDirective(SegmentRef segmentRef, SegmentChangeDirective directive, CompositeProfileDataExtension context, GenerationDirective pcReference, String elementPath) throws Exception {
		Segment flavor = replaceSegmentRefWithFlavor(segmentRef, context, pcReference, elementPath);
		applySegmentChangeDirective(flavor, directive, context, pcReference, elementPath);
	}

	public void applySegmentChangeDirective(Segment segment, SegmentChangeDirective directive, CompositeProfileDataExtension context, GenerationDirective pcReference, String elementPath) throws Exception {
		if(directive.getBindings() != null && !directive.getBindings().isEmpty()) {
			this.applySegment(segment, bindingsToItemProperty(directive.getBindings()));
		}
		if(directive.getPropertyDynamicMapping() != null) {
			directive.getPropertyDynamicMapping().onSegment(segment);
		}
		if(directive.getFields() != null && !directive.getFields().isEmpty()) {
			for(Field field: segment.getChildren()) {
				if(directive.getFields().containsKey(field.getId())) {
					applyFieldChangeDirective(directive.getFields().get(field.getId()), field, context, pcReference, createPath(elementPath, field.getId()));
				}
			}
		}
	}

	public void applyFieldChangeDirective(DatatypeComponentChangeDirective directive, Field field, CompositeProfileDataExtension context, GenerationDirective pcReference, String elementPath) throws Exception {
		if(directive.getItem() != null) {
			applyField(field, directive.getItem().getItemProperties());
		}
		if(directive.getDatatype() != null) {
			Datatype flavor = replaceDatatypeRefWithFlavor(field, context, pcReference, elementPath);
			applyDatatypeChangeDirective(flavor, directive.getDatatype(), context, pcReference, elementPath);
		}
	}

	public void applyDatatypeChangeDirective(Datatype datatype, DatatypeChangeDirective directive, CompositeProfileDataExtension context, GenerationDirective pcReference, String elementPath) throws Exception {
		if(directive.getBindings() != null && !directive.getBindings().isEmpty()) {
			this.applyDatatype(datatype, bindingsToItemProperty(directive.getBindings()));
		}
		if(directive.getComponents() != null && !directive.getComponents().isEmpty() && datatype instanceof ComplexDatatype) {
			ComplexDatatype complexDatatype = (ComplexDatatype) datatype;
			for(Component component: complexDatatype.getComponents()) {
				if(directive.getComponents().containsKey(component.getId())) {
					applyComponentChangeDirective(directive.getComponents().get(component.getId()), component, context, pcReference, createPath(elementPath, component.getId()));
				}
			}
		}
	}

	public void applyComponentChangeDirective(DatatypeComponentChangeDirective directive, Component component, CompositeProfileDataExtension context, GenerationDirective pcReference, String elementPath) throws Exception {
		if(directive.getItem() != null) {
			applyComponent(component, directive.getItem().getItemProperties());
		}
		if(directive.getDatatype() != null) {
			Datatype flavor = replaceDatatypeRefWithFlavor(component, context, pcReference, elementPath);
			applyDatatypeChangeDirective(flavor, directive.getDatatype(), context, pcReference, elementPath);
		}
	}


	public void applyGroupChangeDirective(Group group, GroupChangeDirective directive, CompositeProfileDataExtension context, GenerationDirective pcReference, String elementPath) throws Exception {
		if(directive.getItem() != null) {
			applyMsgStructureElement(group, directive.getItem().getItemProperties());
		}
		applySegRefOrGroupChangeDirective(directive.getChildren(), group.getChildren(), context, pcReference, elementPath);
	}

	public Segment replaceSegmentRefWithFlavor(SegmentRef ref, CompositeProfileDataExtension context, GenerationDirective pcReference, String elementPath) throws Exception {
		Segment segment = getSegment(ref.getRef().getId(), context);
		if(segment == null) {
			throw new Exception("Segment not found");
		}

		// Create a segment flavor
		Segment flavor = context.createFlavor(segment, pcReference, elementPath);

		// Update the segment reference with the new flavor
		Ref flavorSegmentRef = new Ref();
		flavorSegmentRef.setId(flavor.getId());
		ref.setRef(flavorSegmentRef);
		return flavor;
	}

	public Datatype replaceDatatypeRefWithFlavor(SubStructElement structElement, CompositeProfileDataExtension context, GenerationDirective pcReference, String elementPath) throws Exception {
		Datatype datatype = getDatatype(structElement.getRef().getId(), context);
		if(datatype == null) {
			throw new Exception("Datatype not found");
		}

		// Create a datatype flavor
		Datatype flavor = context.createFlavor(datatype, pcReference, elementPath);

		// Update the datatype reference with the new flavor
		Ref flavorDatatypeRef = new Ref();
		flavorDatatypeRef.setId(flavor.getId());
		structElement.setRef(flavorDatatypeRef);

		return flavor;
	}

	Segment getSegment(String id, CompositeProfileDataExtension context) {
		Segment segment = context.getResource(id, Segment.class);
		if(segment == null) {
			return this.segmentService.findById(id);
		}
		return segment;
	}

	Datatype getDatatype(String id, CompositeProfileDataExtension context) {
		Datatype datatype = context.getResource(id, Datatype.class);
		if(datatype == null) {
			return this.datatypeService.findById(id);
		}
		return datatype;
	}

	<T extends Resource> boolean segmentContextMatches(String sourceId, SegmentContextChangeDirective target, CompositeProfileDataExtension context) {
		GeneratedResourceMetadata generatedResourceMetadata = context.getResourceMetadata(sourceId);
		if(generatedResourceMetadata == null) {
			return target.matches(Type.SEGMENT, sourceId);
		} else {
			return target.matches(Type.SEGMENT, generatedResourceMetadata.getSourceId());
		}
	}

	void applyConformanceProfile(ConformanceProfile conformanceProfile, Set<ItemProperty> props) {
		props.stream()
		     .filter(x -> x instanceof ApplyConformanceProfile)
		     .forEach(x -> ((ApplyConformanceProfile) x).onConformanceProfile(conformanceProfile));
		props.stream()
		     .filter(x -> x instanceof ApplyResourceBinding)
		     .forEach(x -> ((ApplyResourceBinding) x).onResourceBinding(conformanceProfile.getBinding(), this.bindingService));
	}

	void applySegment(Segment segment, Set<ItemProperty> props) {
		props.stream()
		     .filter(x -> x instanceof ApplySegment)
		     .forEach(x -> ((ApplySegment) x).onSegment(segment));
		props.stream()
		     .filter(x -> x instanceof ApplyResourceBinding)
		     .forEach(x -> ((ApplyResourceBinding) x).onResourceBinding(segment.getBinding(), this.bindingService));
	}

	void applyDatatype(Datatype datatype, Set<ItemProperty> props) {
		props.stream()
		     .filter(x -> x instanceof ApplyDatatype)
		     .forEach(x -> ((ApplyDatatype) x).onDatatype(datatype));

		props.stream()
		     .filter(x -> x instanceof ApplyResourceBinding)
		     .forEach(x -> ((ApplyResourceBinding) x).onResourceBinding(datatype.getBinding(), this.bindingService));
	}


	void applyMsgStructureElement(SegmentRefOrGroup ref, Set<ItemProperty> props) {
		props.stream()
		     .filter(x -> x instanceof ApplyMsgStructElement)
		     .forEach(x -> ((ApplyMsgStructElement) x).onMsgStructElement(ref));

		props.stream()
		     .filter(x -> x instanceof ApplyStructureElement)
		     .forEach(x -> ((ApplyStructureElement) x).onStructureElement(ref));

		if(ref instanceof SegmentRef) {
			props.stream()
			     .filter(x -> x instanceof ApplySegmentRef)
			     .forEach(x -> ((ApplySegmentRef) x).onSegmentRef((SegmentRef) ref));
		}
	}

	void applyField(Field field, Set<ItemProperty> props) {
		props.stream()
		     .filter(x -> x instanceof ApplyField)
		     .forEach(x -> ((ApplyField) x).onField(field));
		props.stream()
		     .filter(x -> x instanceof ApplySubStructElement)
		     .forEach(x -> ((ApplySubStructElement) x).onSubStructElement(field));

		props.stream()
		     .filter(x -> x instanceof ApplyStructureElement)
		     .forEach(x -> ((ApplyStructureElement) x).onStructureElement(field));
	}

	void applyComponent(Component component, Set<ItemProperty> props) {
		props.stream()
		     .filter(x -> x instanceof ApplySubStructElement)
		     .forEach(x -> ((ApplySubStructElement) x).onSubStructElement(component));
		props.stream()
		     .filter(x -> x instanceof ApplyStructureElement)
		     .forEach(x -> ((ApplyStructureElement) x).onStructureElement(component));
	}
}
