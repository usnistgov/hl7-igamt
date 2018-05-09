package gov.nist.hit.hl7.igamt.service.impl;


import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.shared.domain.Component;
import gov.nist.hit.hl7.igamt.shared.domain.Field;
import gov.nist.hit.hl7.igamt.shared.domain.Group;
import gov.nist.hit.hl7.igamt.shared.domain.Link;
import gov.nist.hit.hl7.igamt.shared.domain.MsgStructElement;
import gov.nist.hit.hl7.igamt.shared.domain.SegmentRef;
import gov.nist.hit.hl7.igamt.shared.domain.binding.ResourceBinding;
import gov.nist.hit.hl7.igamt.shared.domain.binding.StructureElementBinding;
import gov.nist.hit.hl7.igamt.shared.domain.binding.ValuesetBinding;
import gov.nist.hit.hl7.igamt.shared.registries.ConformanceProfileRegistry;
import gov.nist.hit.hl7.igamt.shared.registries.DatatypeRegistry;
import gov.nist.hit.hl7.igamt.shared.registries.Registry;
import gov.nist.hit.hl7.igamt.shared.registries.SegmentRegistry;
import gov.nist.hit.hl7.igamt.shared.registries.ValueSetRegistry;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;
@Service
public class CrudServiceImpl implements CrudService {
	
	@Autowired
	ConformanceProfileService conformanceProfileService;
	
	@Autowired
	SegmentService segmentService;
	
	@Autowired
	DatatypeService datatypeService;
	
	@Autowired
	ValuesetService valuesetService;
	

	@Override
	public void addConformanceProfiles(Set<String> ids, Ig ig) {
	  ConformanceProfileRegistry reg= ig.getConformanceProfileRegistry();
		if(reg!=null) {
			if(reg.getChildren()!=null) {
			Set<String> existants= mapLinkToId(reg.getChildren())	;
			ids.removeAll(existants);
			for(String id: ids) {
			ConformanceProfile  cp =	conformanceProfileService.getLatestById(id);
			if(cp !=null) {
			addDependecies(cp,ig);
			Link link= new Link(cp.getId());
			reg.getChildren().add(link);
				}
			}
		 }
		}
	}

	private void addDependecies(ConformanceProfile cp, Ig ig) {
		Set<String> segmentIds= getConformanceProfileResourceDependenciesIds(cp);
		addSegments(segmentIds, ig);	
		if(cp.getBinding() !=null) {
		Set<String> vauleSetBindingIds=processBinding(cp.getBinding());
		addValueSets(vauleSetBindingIds, ig);
		}
	}

	private Set<String>  getConformanceProfileResourceDependenciesIds(ConformanceProfile cp) {
		// TODO Auto-generated method stub
		Set<String> ids= new HashSet<String>();
		for(MsgStructElement segOrgroup: cp.getChildren()) {
			if(segOrgroup instanceof SegmentRef) {
				SegmentRef ref = (SegmentRef)segOrgroup;
				if(ref.getRef() !=null && ref.getRef().getId() !=null)
				ids.add(ref.getRef().getId());
			}else {
				processSegmentorGroup(segOrgroup, ids);
			}
		}
		return ids;
		
	}

	private void processSegmentorGroup(MsgStructElement segOrgroup, Set<String> ids) {
		// TODO Auto-generated method stub
			if(segOrgroup instanceof SegmentRef) {
				SegmentRef ref = (SegmentRef)segOrgroup;
				if(ref.getRef()!=null&& ref.getRef().getId()!=null) {
					ids.add(ref.getRef().getId());

				}
			}else if (segOrgroup  instanceof Group ){
				Group g= (Group )segOrgroup;
				for(MsgStructElement child: g.getChildren()) {
				processSegmentorGroup(child, ids);
			}
		}
		
	}

	@Override
	public void addSegments(Set<String> ids, Ig ig) {
	  SegmentRegistry reg= ig.getSegmentRegistry();
		if(reg!=null) {
			if(reg.getChildren()!=null) {
			Set<String> existants= mapLinkToId(reg.getChildren());
			ids.removeAll(existants);
			for(String id: ids) {
			Segment  segment = segmentService.getLatestById(id);
		if(segment !=null) {
			addDependecies(segment,ig);
			Link link= new Link(segment.getId());
			reg.getChildren().add(link);
			}
		 }
		}
		}
		

	}

	private void addDependecies(Segment segment, Ig ig) {
		// TODO Auto-generated method stub
		
		Set<String> datatypeIds= getSegmentResourceDependenciesIds(segment);
		if(segment.getBinding() !=null) {
		Set<String> vauleSetBindingIds=processBinding(segment.getBinding());
		addValueSets(vauleSetBindingIds, ig);	
		}	
		addDatatypes(datatypeIds, ig);		
		
		
	}

	private Set<String> processBinding(ResourceBinding binding) {
		// TODO Auto-generated method stub
		 Set<String> vauleSetIds=new HashSet<String>();
		if(binding.getChildren() !=null){
			for(StructureElementBinding child : binding.getChildren()) {
				if(child.getValuesetBindings() !=null) {
					for(ValuesetBinding vs : child.getValuesetBindings()) {
						if(vs.getValuesetId() !=null) {
							vauleSetIds.add(vs.getValuesetId());
						}
					}
				}
			}
		}
		return vauleSetIds;
	}

	private Set<String> getSegmentResourceDependenciesIds(Segment segment) {
		// TODO Auto-generated method stub
		Set<String> ids= new HashSet<String>();
		if(segment.getChildren() !=null) {
		
		for(Field f : segment.getChildren()) {
			if(f.getRef() !=null&& f.getRef().getId()!=null) {
				ids.add(f.getRef().getId());
			}
		}
		}
		return ids;
	}

	@Override
	public void addDatatypes(Set<String> ids, Ig ig) {
		// TODO Auto-generated method stub
	  DatatypeRegistry reg= ig.getDatatypeRegistry();
		if(reg!=null) {
			if(reg.getChildren()!=null) {
			Set<String> existants= mapLinkToId(reg.getChildren())	;
			ids.removeAll(existants);
			for(String id: ids) {
			Datatype  datatype =	datatypeService.getLatestById(id);
			if(datatype !=null) {
			if(datatype instanceof ComplexDatatype) {
				addDependecies((ComplexDatatype)datatype,ig);
			}
			Link link= new Link(datatype.getId());
			reg.getChildren().add(link);
				}
			}
		}
	}

	}
	private void addDependecies(ComplexDatatype datatype, Ig ig) {
		
		Set<String> datatypeIds= getDatatypeResourceDependenciesIds(datatype);
		addDatatypes(datatypeIds, ig);
		if(datatype.getBinding() !=null) {
			Set<String> vauleSetBindingIds=processBinding(datatype.getBinding());
			addValueSets(vauleSetBindingIds, ig);

		}
	}

	private Set<String> getDatatypeResourceDependenciesIds(ComplexDatatype datatype) {
		// TODO Auto-generated method stub
		Set<String> datatypeIds= new HashSet<String>();
		for(Component c : datatype.getComponents() ) {
			if(c.getRef() !=null ) {
				if (c.getRef().getId() !=null) {
					datatypeIds.add(c.getRef().getId());
				}
			}
		}
		return datatypeIds;
		
	}

	@Override
	public void addValueSets(Set<String> ids, Ig ig) {
		// TODO Auto-generated method stub
	    ValueSetRegistry reg= ig.getValueSetRegistry();
		if(reg!=null) {
			if(reg.getChildren()!=null) {
			Set<String> existants= mapLinkToId(reg.getChildren());
			ids.removeAll(existants);
			for(String id: ids) {
			Valueset valueSet =	valuesetService.getLatestById(id);
			if(valueSet !=null) {
			Link link= new Link(valueSet.getId());
			reg.getChildren().add(link);
				}
			  }
			}
		}
	}
	
	
	private Set<String> mapLinkToId(Set<Link> links){
        Set<String> ids = links.stream().map(x -> x.getId().getId()).collect(Collectors.toSet());
		return ids;
	}
	
	
	

	
	
}
