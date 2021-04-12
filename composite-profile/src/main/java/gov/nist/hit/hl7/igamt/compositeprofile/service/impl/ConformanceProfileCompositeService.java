package gov.nist.hit.hl7.igamt.compositeprofile.service.impl;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.binding.service.BindingService;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.Ref;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.service.impl.DataFragment;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.CompositeProfileStructure;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.OrderedProfileComponentLink;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.Group;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRef;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRefOrGroup;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Component;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ElementChangeDirective;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.FlavorCreationDirective;
import gov.nist.hit.hl7.igamt.profilecomponent.service.ProfileComponentService;
import gov.nist.hit.hl7.igamt.segment.domain.Field;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;

@Service
public class ConformanceProfileCompositeService implements ConformanceProfileCreationService {
	
	@Autowired
	ConformanceProfileService confProfileService;
	@Autowired
	ProfileComponentService profileComponentService;
	@Autowired
	DatatypeService datatypeService;
	@Autowired
	SegmentService segmentService;
	@Autowired
	BindingService bindingService;
	
	// Create a PermutationMap from List of profile components
	List<FlavorCreationDirective> profileComponentLinksToPermutationMap(Set<OrderedProfileComponentLink> structure) {
		ArrayList<OrderedProfileComponentLink> links = new ArrayList<>(structure);
		Collections.sort(links);
		
		return links
				.stream()
				.map(l -> this.profileComponentService.findById(l.getProfileComponentId()))
				.flatMap(x ->
						x.getChildren()
						.stream()
						.sorted((o1, o2) -> {
							if(o1.getLevel().equals(o2.getLevel())) return 0;
							if(o1.getLevel().equals(Type.SEGMENT)) return -1;
							return 1;
						})
						.map((ctx) -> new FlavorCreationDirective(x, ctx))
				)
				.collect(Collectors.toList());
	}

	// Create a ConformanceProfile from Composite
	@Override
	public DataFragment<ConformanceProfile> create(CompositeProfileStructure structure) {
		ConformanceProfile target = this.confProfileService.findById(structure.getConformanceProfileId());
		if(target != null) {
			CompositeProfileDataExtension extension = new CompositeProfileDataExtension();
			List<FlavorCreationDirective> flavorCreationDirectives = this.profileComponentLinksToPermutationMap(structure.getOrderedProfileComponents());
			flavorCreationDirectives.forEach((fcd) -> {
				this.browse(target, fcd, extension);
			});
			String ext = "DMO";
			extension.prune(ext);
			target.setId(structure.getId() + '_' + ext);
			target.setName(structure.getName());
			return new DataFragment<>(target, extension);
		}
		return null;
	}

	// Create a Segment from ProfileComponents
	@Override
	public DataFragment<Segment> create(Segment target, Set<OrderedProfileComponentLink> structure) {
		if(target != null) {
			CompositeProfileDataExtension extension = new CompositeProfileDataExtension();
			List<FlavorCreationDirective> flavorCreationDirectives = this.profileComponentLinksToPermutationMap(structure);
			flavorCreationDirectives.forEach((fcd) -> {
				this.browse(target, fcd, extension);
			});
			return new DataFragment<>(target, extension);
		}
		return null;
	}
	
	// Fast forward in (Message Structure) until candidate for permutation found
	ConformanceProfile browse(ConformanceProfile target, FlavorCreationDirective fcd, CompositeProfileDataExtension repo) {
		if(fcd.getType().equals(Type.CONFORMANCEPROFILE) && fcd.getTargetId().equals(target.getId())) {
			this.evaluate(target, fcd, repo);
		}
		this.browse(target.getChildren(), fcd, repo);
		return target;
	}
	
	// Fast forward in (Group Structure) until candidate for permutation found
	void browse(Set<SegmentRefOrGroup> segmentRefOrGroups, FlavorCreationDirective fcd, CompositeProfileDataExtension repo) {
		for(SegmentRefOrGroup srg: segmentRefOrGroups) {
			if(srg instanceof SegmentRef) {
				Segment segment = this.findSegmentById(((SegmentRef) srg).getRef().getId(), repo);
				if(segment != null) {
					Segment browsed = this.browse(segment, fcd, repo);
					// Update Segment Ref
					((SegmentRef) srg).setRef(new Ref(browsed.getId()));
				}
			} else if(srg instanceof Group) {
				this.browse(((Group) srg).getChildren(), fcd, repo);
			}
		}
	}

	// Fast forward in (Segment Structure) until candidate for permutation found
	Segment browse(Segment target, FlavorCreationDirective fcd, CompositeProfileDataExtension repo) {
		if(this.exit(fcd, this::segmentGuard)) {
			return target;
		}

		Segment continueOn = target;

		if(fcd.getType().equals(Type.SEGMENT) && repo.isGeneratedFrom(continueOn, fcd.getTargetId())) {
			Segment pcTargetFlv = repo.getPcRootFlavor(fcd.getProfileComponentSourceId(), fcd.getTargetId(), continueOn);

			if(pcTargetFlv != null) {
				continueOn = pcTargetFlv;
			} else{
				continueOn = this.evaluate(repo.swap(fcd.getProfileComponentSourceId(), fcd.getDirectiveId(), continueOn, true), fcd, false, repo);
			}
		}

		return continueOn;
	}
	
	// Fast forward in (Datatype Structure) until candidate for permutation found
	void browse(Datatype dt, FlavorCreationDirective fcd, CompositeProfileDataExtension repo) {
		if(dt instanceof ComplexDatatype) {
			for(Component field: ((ComplexDatatype) dt).getComponents()) {
				Datatype dtt = this.datatypeService.findById(field.getRef().getId());
				this.browse(dtt, fcd, repo);
			}
		}
	}
	
	// Get Element by ElementId
    public SegmentRefOrGroup get(Set<SegmentRefOrGroup> structure, String id){
    	return structure.stream().filter(x -> x.getId().equals(id)).findFirst().orElse(null);
    }
    public Field get(Segment segment, String id){
    	return  segment.getChildren().stream().filter(x -> x.getId().equals(id)).findFirst().orElse(null);
    }
    public Component get(Datatype dt, String id){
    	return  dt instanceof ComplexDatatype ? ((ComplexDatatype) dt).getComponents().stream().filter(x -> x.getId().equals(id))
    			.findFirst().orElse(null) : null;
    }
	
    // Evaluate permutation at ConformanceProfile Level
	ConformanceProfile evaluate(ConformanceProfile target, ElementChangeDirective permutation, CompositeProfileDataExtension repo) {
		this.evaluate(target.getChildren(), permutation, repo);

		// Apply
		permutation.getItems().stream().filter(x -> x instanceof ApplyConformanceProfile)
				.forEach(x -> ((ApplyConformanceProfile) x).onConformanceProfile(target));
		permutation.getItems().stream().filter(x -> x instanceof ApplyResourceBinding)
				.forEach(x -> ((ApplyResourceBinding) x).onResourceBinding(target.getBinding(), this.bindingService));
		return target;
	}

	// Evaluate permutation at Message or Group Structure
	void evaluate(Set<SegmentRefOrGroup> structure, ElementChangeDirective permutation, CompositeProfileDataExtension repo) {
		for(ElementChangeDirective p : permutation.getChildren()) {
			SegmentRefOrGroup refOrGrp = get(structure, p.getTargetElementId());
			if(refOrGrp != null) {
				if(refOrGrp instanceof SegmentRef) {
					this.evaluate(((SegmentRef) refOrGrp), p, repo);
				}
				else if(refOrGrp instanceof Group) {
					this.evaluate((Group) refOrGrp, p, repo);
				}
			}
		}
	}
	
    // Evaluate permutation at Segment Level
	Segment evaluate(Segment target, ElementChangeDirective permutation, boolean flavor, CompositeProfileDataExtension repo) {
		if(this.exit(permutation, this::segmentGuard)) {
			return target;
		}

		Segment segment = flavor ? repo.swap(permutation.getProfileComponentSourceId(), permutation.getDirectiveId(), target) : target;
		
		// Handle Children
		for(ElementChangeDirective p : permutation.getChildren()) {
			Field field = get(segment, p.getTargetElementId());
			if(field != null) {
				this.evaluate(field, p, repo);
			}
		}
		
		// Apply
		permutation.getItems().stream().filter(x -> x instanceof ApplySegment)
		.forEach(x -> ((ApplySegment) x).onSegment(segment));
		permutation.getItems().stream().filter(x -> x instanceof ApplyResourceBinding)
		.forEach(x -> ((ApplyResourceBinding) x).onResourceBinding(segment.getBinding(), this.bindingService));
		return segment;
	}
	
    // Evaluate permutation at SegmentRef Level
	void evaluate(SegmentRef target, ElementChangeDirective permutation, CompositeProfileDataExtension repo) {
		// Apply
		permutation.getItems().stream().filter(x -> x instanceof ApplyMsgStructElement)
				.forEach(x -> ((ApplyMsgStructElement) x).onMsgStructElement(target));
		permutation.getItems().stream().filter(x -> x instanceof ApplyStructureElement)
				.forEach(x -> ((ApplyStructureElement) x).onStructureElement(target));


		// Evaluate Children
		Segment segment = this.findSegmentById(target.getRef().getId(), repo);
		if(segment != null) {
			Segment evaluated = this.evaluate(segment, permutation, true, repo);
			// Update SegmentRef
			target.setRef(new Ref(evaluated.getId()));
		}
	}

	// Evaluate permutation at Group Level
	void evaluate(Group target, ElementChangeDirective permutation, CompositeProfileDataExtension repo) {
		// Apply
		permutation.getItems().stream().filter(x -> x instanceof ApplyMsgStructElement)
				.forEach(x -> ((ApplyMsgStructElement) x).onMsgStructElement(target));
		permutation.getItems().stream().filter(x -> x instanceof ApplyStructureElement)
				.forEach(x -> ((ApplyStructureElement) x).onStructureElement(target));

		// Evaluate Children
		this.evaluate(target.getChildren(), permutation, repo);
	}
	
    // Evaluate permutation at Field Level
	void evaluate(Field field, ElementChangeDirective permutation, CompositeProfileDataExtension repo) {
		// Apply
		permutation.getItems().stream().filter(x -> x instanceof ApplyField)
				.forEach(x -> ((ApplyField) x).onField(field));
		permutation.getItems().stream().filter(x -> x instanceof ApplySubStructElement)
				.forEach(x -> ((ApplySubStructElement) x).onSubStructElement(field));
		permutation.getItems().stream().filter(x -> x instanceof ApplyStructureElement)
				.forEach(x -> ((ApplyStructureElement) x).onStructureElement(field));

		// Evaluate Children
		Datatype datatype = this.findDatatypeById(field.getRef().getId(), repo);
		if(datatype != null) {
			Datatype flavor = this.evaluate(datatype, permutation, repo);
			// Update DatatypeRef
			field.setRef(new Ref(flavor.getId()));
		}
	}
	
    // Evaluate permutation at Datatype Level
	Datatype evaluate(Datatype target, ElementChangeDirective permutation, CompositeProfileDataExtension repo) {
		if(this.exit(permutation, this::datatypeGuard)) {
			return target;
		}

		Datatype datatype = repo.swap(permutation.getProfileComponentSourceId(), permutation.getDirectiveId(), target);
		
		// Handle Children
		for(ElementChangeDirective p : permutation.getChildren()) {
			Component component = get(datatype, p.getTargetElementId());
			if(component != null) {
				this.evaluate(component, p, repo);
			}
		}
		
		// Apply
		permutation.getItems().stream().filter(x -> x instanceof ApplyDatatype)
		.forEach(x -> ((ApplyDatatype) x).onDatatype(datatype));
		permutation.getItems().stream().filter(x -> x instanceof ApplyResourceBinding)
		.forEach(x -> ((ApplyResourceBinding) x).onResourceBinding(datatype.getBinding(), this.bindingService));
		return datatype;
	}
	
    // Evaluate permutation at Component Level
	void evaluate(Component field, ElementChangeDirective permutation, CompositeProfileDataExtension repo) {
		// Apply
		permutation.getItems().stream().filter(x -> x instanceof ApplySubStructElement)
				.forEach(x -> ((ApplySubStructElement) x).onSubStructElement(field));
		permutation.getItems().stream().filter(x -> x instanceof ApplyStructureElement)
				.forEach(x -> ((ApplyStructureElement) x).onStructureElement(field));

		// Evaluate Children
		Datatype datatype = this.findDatatypeById(field.getRef().getId(), repo);
		if(datatype != null) {
			Datatype flavor = this.evaluate(datatype, permutation, repo);
			// Update DatatypeRef
			field.setRef(new Ref(flavor.getId()));
		}
	}

	Datatype findDatatypeById(String id, CompositeProfileDataExtension repo) {
		if(repo.contains(id, Datatype.class)) {
			return repo.get(id, Datatype.class);
		} else {
			return this.datatypeService.findById(id);
		}
	}

	Segment findSegmentById(String id, CompositeProfileDataExtension repo) {
		if(repo.contains(id, Segment.class)) {
			return repo.get(id, Segment.class);
		} else {
			return this.segmentService.findById(id);
		}
	}

	boolean guard(ElementChangeDirective permutation) {
		return permutation.getChildren().size() > 0;
	}
	boolean datatypeGuard(ElementChangeDirective permutation) {
		return permutation.getItems().stream().anyMatch((i) -> i instanceof ApplyDatatype || i instanceof  ApplyResourceBinding);
	}
	boolean segmentGuard(ElementChangeDirective permutation) {
		return permutation.getItems().stream().anyMatch((i) -> i instanceof ApplySegment || i instanceof  ApplyResourceBinding);
	}
	boolean exit(ElementChangeDirective permutation, Function<ElementChangeDirective, Boolean> guard) {
		return !(this.guard(permutation)) && !guard.apply(permutation);
	}
}
