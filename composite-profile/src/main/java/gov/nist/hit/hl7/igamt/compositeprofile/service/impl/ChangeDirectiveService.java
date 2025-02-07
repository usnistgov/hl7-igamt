package gov.nist.hit.hl7.igamt.compositeprofile.service.impl;

import gov.nist.hit.hl7.igamt.common.base.domain.SubStructElement;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.*;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.Group;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRef;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRefOrGroup;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Component;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.*;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyBinding;
import gov.nist.hit.hl7.igamt.profilecomponent.service.ProfileComponentService;
import gov.nist.hit.hl7.igamt.segment.domain.Field;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ChangeDirectiveService {

	@Autowired
	ProfileComponentService profileComponentService;
	@Autowired
	DatatypeService datatypeService;
	@Autowired
	SegmentService segmentService;

	public List<ResourceChangeDirective> createConformanceProfileChangeDirective(CompositeProfileStructure compositeProfileStructure, ConformanceProfile target) throws Exception {
		List<ResourceChangeDirective> changeDirectives = new ArrayList<>();
		if(compositeProfileStructure == null) {
			throw new Exception("Composite profile structure not found");
		}
		if(target == null) {
			throw new Exception("Conformance profile not found");
		}

		ArrayList<OrderedProfileComponentLink> links = new ArrayList<>(compositeProfileStructure.getOrderedProfileComponents());
		Collections.sort(links);

		for(OrderedProfileComponentLink profileComponentLink: links) {
			ProfileComponent profileComponent = this.profileComponentService.findById(profileComponentLink.getProfileComponentId());
			if(profileComponent == null) {
				throw new Exception("Profile component not found");
			}
			List<ProfileComponentContext> contexts = profileComponent.getChildren().stream().sorted((o1, o2) -> {
				if(o1.getLevel().equals(o2.getLevel())) {
					return 0;
				}
				if(o1.getLevel().equals(Type.SEGMENT)) {
					return - 1;
				}
				return 1;
			}).collect(Collectors.toList());
			for(ProfileComponentContext context: contexts) {
				if(context.getLevel().equals(Type.CONFORMANCEPROFILE) && context.getId().equals(target.getId())) {
					changeDirectives.add(
							createConformanceProfileChangeDirective(
									target,
									context,
									profileComponent.getId()
							)
					);
				} else if(context.getLevel().equals(Type.SEGMENT)) {
					changeDirectives.add(
							createSegmentChangeDirective(
									context,
									profileComponent.getId()
							)
					);
				}
			}
		}
		return changeDirectives;
	}

	public ConformanceProfileContextChangeDirective createConformanceProfileChangeDirective(ConformanceProfile conformanceProfile, ProfileComponentContext conformanceProfileContext, String profileComponentId) {
		ConformanceProfileContextChangeDirective conformanceProfileChangeDirective = new ConformanceProfileContextChangeDirective(new DirectiveContextMatchTarget(conformanceProfileContext.getId(), Type.CONFORMANCEPROFILE), profileComponentId);
		// Bindings
		final Set<PropertyBinding> contextBindings = conformanceProfileContext.getProfileComponentBindings().getContextBindings();
		final Set<ProfileComponentItemBinding> itemBindings = conformanceProfileContext.getProfileComponentBindings().getItemBindings();
		if(contextBindings != null && !contextBindings.isEmpty()) {
			conformanceProfileChangeDirective.setBindings(contextBindings);
		}
		if(itemBindings != null && !itemBindings.isEmpty()) {
			for(ProfileComponentItemBinding itemBinding: itemBindings) {
				if(itemBinding.getBindings() != null && !itemBinding.getBindings().isEmpty()) {
					compute(conformanceProfile, this.pathToStack(itemBinding.getPath()), conformanceProfileChangeDirective, transform(itemBinding), true);
				}
			}
		}
		// Co-Constraints
		if(conformanceProfileContext.getProfileComponentCoConstraints() != null) {
			conformanceProfileChangeDirective.setCoConstraints(conformanceProfileContext.getProfileComponentCoConstraints());
		}
		// Children
		for(ProfileComponentItem item: conformanceProfileContext.getProfileComponentItems()) {
			if(item.getItemProperties() != null && !item.getItemProperties().isEmpty()) {
				compute(conformanceProfile, this.pathToStack(item.getPath()), conformanceProfileChangeDirective, item, false);
			}
		}
		return conformanceProfileChangeDirective;
	}

	public SegmentContextChangeDirective createSegmentChangeDirective(ProfileComponentContext segmentContext, String profileComponentId) {
		SegmentContextChangeDirective segmentContextChangeDirective = new SegmentContextChangeDirective(new DirectiveContextMatchTarget(segmentContext.getId(), Type.SEGMENT), profileComponentId);
		SegmentChangeDirective segmentChangeDirective = new SegmentChangeDirective();
		segmentContextChangeDirective.setDirective(segmentChangeDirective);
		Segment segment = getSegment(segmentContext.getId());

		// Bindings
		final Set<PropertyBinding> contextBindings = segmentContext.getProfileComponentBindings().getContextBindings();
		final Set<ProfileComponentItemBinding> itemBindings = segmentContext.getProfileComponentBindings().getItemBindings();
		if(contextBindings != null && !contextBindings.isEmpty()) {
			segmentChangeDirective.setBindings(contextBindings);
		}
		if(itemBindings != null && !itemBindings.isEmpty()) {
			for(ProfileComponentItemBinding itemBinding: itemBindings) {
				compute(segment, this.pathToStack(itemBinding.getPath()), segmentChangeDirective, transform(itemBinding), true);
			}
		}
		// Dynamic Mapping
		if(segmentContext.getProfileComponentDynamicMapping() != null) {
			segmentChangeDirective.setPropertyDynamicMapping(segmentContext.getProfileComponentDynamicMapping());
		}
		// Children
		for(ProfileComponentItem item: segmentContext.getProfileComponentItems()) {
			compute(segment, this.pathToStack(item.getPath()), segmentChangeDirective, item, false);
		}

		return segmentContextChangeDirective;
	}

	private void compute(Segment segment, Stack<String> path, SegmentChangeDirective directive, ProfileComponentItem item, boolean binding) {
		if(!path.isEmpty()) {
			String elementId = path.pop();
			Field element = findField(segment.getChildren(), elementId);
			if(element != null) {
				DatatypeComponentChangeDirective datatypeComponentChangeDirective = directive.getFields().computeIfAbsent(elementId, (k) -> new DatatypeComponentChangeDirective());
				compute(element, path, datatypeComponentChangeDirective, item, binding);
			}
		}
	}


	private void compute(ConformanceProfile target, Stack<String> path, ConformanceProfileContextChangeDirective directive, ProfileComponentItem item, boolean binding) {
		if(!path.isEmpty()) {
			compute(
					target.getChildren(),
					path,
					directive.getChildren(),
					item,
					binding
			);
		}
	}

	private void compute(Set<SegmentRefOrGroup> target, Stack<String> path, Map<String, SegRefOrGroupChangeDirective> children , ProfileComponentItem item, boolean binding) {
		String elementId = path.pop();
		SegmentRefOrGroup element = findSegRefOrGroup(target, elementId);
		if(element != null) {
			if(element instanceof SegmentRef) {
				SegRefChangeDirective segRefChangeDirective = (SegRefChangeDirective) children.computeIfAbsent(elementId, (k) -> new SegRefChangeDirective());
				compute((SegmentRef) element, path, segRefChangeDirective, item, binding);
			} else if(element instanceof Group) {
				GroupChangeDirective groupChangeDirective = (GroupChangeDirective) children.computeIfAbsent(elementId, (k) -> new GroupChangeDirective());
				compute((Group) element, path, groupChangeDirective, item, binding);
			}
		}
	}

	private void compute(Group group, Stack<String> path, GroupChangeDirective directive, ProfileComponentItem item, boolean binding) {
		if(path.isEmpty()) {
			if(!binding) {
				directive.setItem(item);
			}
		} else {
			compute(
					group.getChildren(),
					path,
					directive.getChildren(),
					item,
					binding
			);
		}
	}


	private void compute(SegmentRef segmentRef, Stack<String> path, SegRefChangeDirective directive, ProfileComponentItem item, boolean binding) {
		if(path.isEmpty()) {
			if(!binding) {
				directive.setItem(item);
			} else {
				if(directive.getSegment() == null) {
					directive.setSegment(new SegmentChangeDirective());
				}
				directive.getSegment().setBindings(item.getItemProperties().stream().map((p) -> (PropertyBinding) p).collect(Collectors.toSet()));
			}
		} else {
			Segment segment = getSegment(segmentRef.getRef().getId());
			String elementId = path.pop();
			Field element = findField(segment.getChildren(), elementId);
			if(element != null) {
				if(directive.getSegment() == null) {
					directive.setSegment(new SegmentChangeDirective());
				}
				DatatypeComponentChangeDirective datatypeComponentChangeDirective = directive.getSegment().getFields().computeIfAbsent(elementId, (k) -> new DatatypeComponentChangeDirective());
				compute(element, path, datatypeComponentChangeDirective, item, binding);
			}
		}
	}

	private void compute(SubStructElement component, Stack<String> path, DatatypeComponentChangeDirective directive, ProfileComponentItem item, boolean binding) {
		if(path.isEmpty()) {
			if(!binding) {
				directive.setItem(item);
			} else {
				if(directive.getDatatype() == null) {
					directive.setDatatype(new DatatypeChangeDirective());
				}
				directive.getDatatype().setBindings(item.getItemProperties().stream().map((p) -> (PropertyBinding) p).collect(Collectors.toSet()));
			}
		} else {
			Datatype datatype = getDatatype(component.getRef().getId());
			String elementId = path.pop();
			if(datatype instanceof ComplexDatatype) {
				Component element = findComponent(
						((ComplexDatatype) datatype).getComponents(),
						elementId
				);
				if(element != null) {
					if(directive.getDatatype() == null) {
						directive.setDatatype(new DatatypeChangeDirective());
					}
					DatatypeComponentChangeDirective datatypeComponentChangeDirective = directive.getDatatype().getComponents().computeIfAbsent(elementId, (k) -> new DatatypeComponentChangeDirective());
					compute(element, path, datatypeComponentChangeDirective, item, binding);
				}
			}
		}
	}

	private Component findComponent(Set<Component> children, String elementId) {
		return children.stream().filter((child) -> child.getId().equals(elementId)).findFirst().orElse(null);
	}

	private Field findField(Set<Field> children, String elementId) {
		return children.stream().filter((child) -> child.getId().equals(elementId)).findFirst().orElse(null);
	}

	private SegmentRefOrGroup findSegRefOrGroup(Set<SegmentRefOrGroup> children, String elementId) {
		return children.stream().filter((child) -> child.getId().equals(elementId)).findFirst().orElse(null);
	}

	private Segment getSegment(String id) {
		return segmentService.findById(id);
	}

	private Datatype getDatatype(String id) {
		return datatypeService.findById(id);
	}

	private ProfileComponentItem transform(ProfileComponentItemBinding binding) {
		return new ProfileComponentItem(binding.getPath(), new HashSet<>(binding.getBindings()));
	}

	private Stack<String> pathToStack(String value) {
		String[] nodes = value.split("-");
		Stack<String> stack = new Stack<>();
		for(int i = nodes.length - 1; i >= 0; i--) {
			stack.push(nodes[i]);
		}
		return stack;
	}
}
