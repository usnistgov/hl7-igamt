package gov.nist.hit.hl7.igamt.compositeprofile.service.impl;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.binding.service.BindingService;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.MsgStructElement;
import gov.nist.hit.hl7.igamt.common.base.domain.Ref;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.service.impl.InMemoryDomainExtentionServiceImpl.DataExtention;
import gov.nist.hit.hl7.igamt.common.base.service.impl.InMemoryDomainExtentionServiceImpl.DataFragment;
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
import gov.nist.hit.hl7.igamt.profilecomponent.domain.Permutation;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.PermutationMap;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponentContext.Level;
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
	List<PermutationMap> profileComponentLinksToPermutationMap(Set<OrderedProfileComponentLink> structure) {
		ArrayList<OrderedProfileComponentLink> links = new ArrayList<>(structure);
		Collections.sort(links);
		
		List<PermutationMap> pmList = links.stream().map(l -> this.profileComponentService.findById(l.getProfileComponentId()))
		.flatMap(x -> x.getChildren().stream())
		.map(x ->  x != null ? new PermutationMap(x) : null)
		.filter(Objects::nonNull)
		.collect(Collectors.toList());
		
		return pmList;
	}

	// Create a ConformanceProfile from Composite
	@Override
	public DataFragment<ConformanceProfile> create(CompositeProfileStructure structure) {
		ConformanceProfile target = this.confProfileService.findById(structure.getConformanceProfileId());
		if(target != null) {
			DataExtention extention = new DataExtention();
			List<PermutationMap> pmList = this.profileComponentLinksToPermutationMap(structure.getOrderedProfileComponents());
			ConformanceProfile created = this.browse(target, pmList, extention);
			return new DataFragment<ConformanceProfile>(created, extention);
		}
		return null;
	}

	// Create a Segment from ProfileComponents
	@Override
	public DataFragment<Segment> create(Segment target, Set<OrderedProfileComponentLink> structure) {
		if(target != null) {
			DataExtention extention = new DataExtention();
			List<PermutationMap> pmList = this.profileComponentLinksToPermutationMap(structure);
			Segment created = this.browse(target, pmList, extention);
			return new DataFragment<Segment>(created, extention);
		}
		return null;
	}
	
	// Fast forward in (Message Structure) until candidate for permutation found
	ConformanceProfile browse(ConformanceProfile target, List<PermutationMap> pmL, DataExtention repo) {
		ConformanceProfile continueOn = target;
		
		for(PermutationMap pm: pmL) {
			if(pm.type.equals(Type.CONFORMANCEPROFILE) && target.getId().equals(pm.targetId)) {
				continueOn = this.evaluate(continueOn, pm, repo);
			}
		}
		
		for(SegmentRefOrGroup srg: continueOn.getChildren()) {
			if(srg instanceof SegmentRef) {
				Segment segment = this.segmentService.findById(((SegmentRef) srg).getRef().getId());
				if(segment != null) {
					Segment browsed = this.browse(segment, pmL, repo);
					// Update Segment Ref
					((SegmentRef) srg).setRef(new Ref(browsed.getId()));
				}
			} else if(srg instanceof Group) {
				this.browse((Group) srg, pmL, repo);
			}
		}
		
		return continueOn;
	}
	
	// Fast forward in (Group Structure) until candidate for permutation found
	void browse(Group grp, List<PermutationMap> pmL, DataExtention repo) {
		for(SegmentRefOrGroup srg: grp.getChildren()) {
			if(srg instanceof SegmentRef) {
				Segment segment = this.segmentService.findById(((SegmentRef) srg).getRef().getId());
				if(segment != null) {
					Segment browsed = this.browse(segment, pmL, repo);
					// Update Segment Ref
					((SegmentRef) srg).setRef(new Ref(browsed.getId()));
				}
			} else if(srg instanceof Group) {
				this.browse((Group) srg, pmL, repo);
			}
		}
	}
	
	// Fast forward in (Segment Structure) until candidate for permutation found
	Segment browse(Segment target, List<PermutationMap> pmL, DataExtention repo) {
		Segment continueOn = target;
		
		for(PermutationMap pm: pmL) {
			if(pm.type.equals(Type.SEGMENT) && continueOn.getId().equals(pm.targetId)) {
				continueOn = this.evaluate(continueOn, pm, repo);
			}
		}
		
		for(Field field: continueOn.getChildren()) {
			Datatype dt = this.datatypeService.findById(field.getRef().getId());
			this.browse(dt, pmL, repo);
		}
		
		return continueOn;
	}
	
	// Fast forward in (Datatype Structure) until candidate for permutation found
	void browse(Datatype dt, List<PermutationMap> pmL, DataExtention repo) {
		if(dt instanceof ComplexDatatype) {
			for(Component field: ((ComplexDatatype) dt).getComponents()) {
				Datatype dtt = this.datatypeService.findById(field.getRef().getId());
				this.browse(dtt, pmL, repo);
			}
		}
	}
	
	// Get Element at postion P
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
	ConformanceProfile evaluate(ConformanceProfile target, Permutation permutation, DataExtention repo) {
		ConformanceProfile confProfile = repo.cloneAndAddIfNotPresent(target, ConformanceProfile.class);
		
		for(Permutation p : permutation.getPermutations()) {
			SegmentRefOrGroup refOrGrp = get(confProfile.getChildren(), p.getElementId());
			if(refOrGrp != null) {
				if(refOrGrp instanceof SegmentRef) {
					this.evaluate(((SegmentRef) refOrGrp), p, repo);
				}
				else if(refOrGrp instanceof Group) {
					this.evaluate(((Group) refOrGrp), p, repo);
				}
			}
		}
		// Apply
		permutation.getItems().stream().filter(x -> x instanceof ApplyConformanceProfile)
				.forEach(x -> ((ApplyConformanceProfile) x).onConformanceProfile(confProfile));
		permutation.getItems().stream().filter(x -> x instanceof ApplyResourceBinding)
				.forEach(x -> ((ApplyResourceBinding) x).onResourceBinding(confProfile.getBinding(), this.bindingService));
		return confProfile;
	}
	
    // Evaluate permutation at Group Level
	void evaluate(Group target, Permutation permutation, DataExtention repo) {
		for(Permutation p : permutation.getPermutations()) {
			SegmentRefOrGroup refOrGrp = get(target.getChildren(), p.getElementId());
			if(refOrGrp != null) {
				if(refOrGrp instanceof SegmentRef) {
					this.evaluate(((SegmentRef) refOrGrp), p, repo);
				}
				else if(refOrGrp instanceof Group) {
					this.evaluate(((Group) refOrGrp), p, repo);
				}
			}
		}
	}
	
    // Evaluate permutation at Segment Level
	Segment evaluate(Segment target, Permutation permutation, DataExtention repo) {
		if(this.exit(permutation, this::segmentGuard)) {
			return target;
		}

		Segment segment = repo.cloneAndAddIfNotPresent(target, Segment.class);
		if(!segment.getId().equals(target.getId())) {
			segment.setExt(permutation.getName());
			segment.getDomainInfo().setScope(Scope.USER);
		}
		
		// Handle Children
		for(Permutation p : permutation.getPermutations()) {
			Field field = get(segment, p.getElementId());
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
	void evaluate(SegmentRef target, Permutation permutation, DataExtention repo) {
		Segment segment = this.segmentService.findById(target.getRef().getId());
		Segment evaluated = this.evaluate(segment, permutation, repo);
		
		target.setId(evaluated.getId());
		target.setRef(new Ref(evaluated.getId()));
		
		// Apply
		permutation.getItems().stream().filter(x -> x instanceof ApplyMsgStructElement)
		.forEach(x -> ((ApplyMsgStructElement) x).onMsgStructElement(target));
		permutation.getItems().stream().filter(x -> x instanceof ApplyStructureElement)
		.forEach(x -> ((ApplyStructureElement) x).onStructureElement(target));
	}
	
    // Evaluate permutation at Field Level
	void evaluate(Field field, Permutation permutation, DataExtention repo) {
		Datatype datatype = this.datatypeService.findById(field.getRef().getId());
		if(datatype != null) {
			Datatype flavor = this.evaluate(datatype, permutation, repo);
			// Update DatatypeRef
			field.setRef(new Ref(flavor.getId()));
		}

		// Apply
		permutation.getItems().stream().filter(x -> x instanceof ApplyField)
		.forEach(x -> ((ApplyField) x).onField(field));
		permutation.getItems().stream().filter(x -> x instanceof ApplySubStructElement)
		.forEach(x -> ((ApplySubStructElement) x).onSubStructElement(field));
		permutation.getItems().stream().filter(x -> x instanceof ApplyStructureElement)
		.forEach(x -> ((ApplyStructureElement) x).onStructureElement(field));
	}
	
    // Evaluate permutation at Datatype Level
	Datatype evaluate(Datatype target, Permutation permutation, DataExtention repo) {
		if(this.exit(permutation, this::datatypeGuard)) {
			return target;
		}

		Datatype datatype = repo.cloneAndAddIfNotPresent(target, Datatype.class);
		if(!datatype.getId().equals(target.getId())) {
			datatype.setExt(permutation.getName());
			datatype.getDomainInfo().setScope(Scope.USER);
		}
		
		// Handle Children
		for(Permutation p : permutation.getPermutations()) {
			Component component = get(datatype, p.getElementId());
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
	void evaluate(Component field, Permutation permutation, DataExtention repo) {
		Datatype datatype = this.datatypeService.findById(field.getRef().getId());
		if(datatype != null) {
			Datatype flavor = this.evaluate(datatype, permutation, repo);
			// Update DatatypeRef
			field.setRef(new Ref(flavor.getId()));
		}
		
		// Apply
		permutation.getItems().stream().filter(x -> x instanceof ApplySubStructElement)
		.forEach(x -> ((ApplySubStructElement) x).onSubStructElement(field));
		permutation.getItems().stream().filter(x -> x instanceof ApplyStructureElement)
		.forEach(x -> ((ApplyStructureElement) x).onStructureElement(field));
	}

	boolean guard(Permutation permutation) {
		return permutation.getPermutations().size() > 0;
	}

	boolean datatypeGuard(Permutation permutation) {
		return permutation.getItems().stream().anyMatch((i) -> i instanceof ApplyDatatype || i instanceof  ApplyResourceBinding);
	}

	boolean segmentGuard(Permutation permutation) {
		return permutation.getItems().stream().anyMatch((i) -> i instanceof ApplySegment || i instanceof  ApplyResourceBinding);
	}

	boolean exit(Permutation permutation, Function<Permutation, Boolean> guard) {
		return !(this.guard(permutation)) && !guard.apply(permutation);
	}
}
