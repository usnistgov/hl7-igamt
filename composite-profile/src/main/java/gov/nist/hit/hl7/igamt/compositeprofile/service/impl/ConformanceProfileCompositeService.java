package gov.nist.hit.hl7.igamt.compositeprofile.service.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

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
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.ApplyDatatype;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.ApplyField;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.ApplyMsgStructElement;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.ApplySegment;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.ApplyStructureElement;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.ApplySubStructElement;
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
	
	// Create a PermutationMap from List of profile components
	List<PermutationMap> profileComponentLinksToPermutationMap(Set<OrderedProfileComponentLink> structure) {
		ArrayList<OrderedProfileComponentLink> links = new ArrayList<>(structure);
		Collections.sort(links);
		
//		List<PermutationMap> pmList = links.stream().map(l -> this.profileComponentService.findById(l.getProfileComponentId()))
//		.map(x ->  x != null ? new PermutationMap(x) : null)
//		.filter(x -> x != null)
//		.collect(Collectors.toList());
		
		return null;
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
			if(pm.type.equals(Level.MESSAGE) && target.getId().equals(pm.targetId)) {
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
			if(pm.type.equals(Level.SEGMENT) && continueOn.getId().equals(pm.targetId)) {
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
    public SegmentRefOrGroup get(Set<SegmentRefOrGroup> structure, int p){
    	return structure.stream().filter(x -> x.getPosition() == p).findFirst().orElse(null);
    }
    public Field get(Segment segment, int p){
    	return  segment.getChildren().stream().filter(x -> x.getPosition() == p).findFirst().orElse(null);
    }
    public Component get(Datatype dt, int p){
    	return  dt instanceof ComplexDatatype ? ((ComplexDatatype) dt).getComponents().stream().filter(x -> x.getPosition() == p)
    			.findFirst().orElse(null) : null;
    }
	
    // Evaluate permutation at ConformanceProfile Level
	ConformanceProfile evaluate(ConformanceProfile target, Permutation permutation, DataExtention repo) {
		ConformanceProfile confProfile = repo.cloneAndAddIfNotPresent(target, ConformanceProfile.class);
		
		for(Permutation p : permutation.getPermutations()) {
			SegmentRefOrGroup refOrGrp = get(confProfile.getChildren(), p.getPosition());
			if(refOrGrp != null) {
				if(refOrGrp instanceof SegmentRef) {
					this.evaluate(((SegmentRef) refOrGrp), p, repo);
				}
				else if(refOrGrp instanceof Group) {
					this.evaluate(((Group) refOrGrp), p, repo);
				}
			}
		}
		
		return confProfile;
	}
	
    // Evaluate permutation at Group Level
	void evaluate(Group target, Permutation permutation, DataExtention repo) {
		for(Permutation p : permutation.getPermutations()) {
			SegmentRefOrGroup refOrGrp = get(target.getChildren(), p.getPosition());
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
		Segment segment = repo.cloneAndAddIfNotPresent(target, Segment.class);
		if(!segment.getId().equals(target.getId())) {
			segment.setExt(permutation.getName());
			segment.getDomainInfo().setScope(Scope.USER);
		}
		
		// Handle Children
		for(Permutation p : permutation.getPermutations()) {
			Field field = get(segment, p.getPosition());
			if(field != null) {
				this.evaluate(field, p, repo);
			}
		}
		
		// Apply
		permutation.getItems().stream().filter(x -> x instanceof ApplySegment)
		.forEach(x -> ((ApplySegment) x).onSegment(segment));
		
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
		Datatype datatype = repo.cloneAndAddIfNotPresent(target, Datatype.class);
		if(!datatype.getId().equals(target.getId())) {
			datatype.setExt(permutation.getName());
			datatype.getDomainInfo().setScope(Scope.USER);
		}
		
		// Handle Children
		for(Permutation p : permutation.getPermutations()) {
			Component component = get(datatype, p.getPosition());
			if(component != null) {
				this.evaluate(component, p, repo);
			}
		}
		
		// Apply
		permutation.getItems().stream().filter(x -> x instanceof ApplyDatatype)
		.forEach(x -> ((ApplyDatatype) x).onDatatype(datatype));
		
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
}
