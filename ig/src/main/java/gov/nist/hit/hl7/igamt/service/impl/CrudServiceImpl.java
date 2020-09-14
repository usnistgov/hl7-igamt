package gov.nist.hit.hl7.igamt.service.impl;


import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import gov.nist.hit.hl7.igamt.common.base.domain.AbstractDomain;
import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.MsgStructElement;
import gov.nist.hit.hl7.igamt.common.base.domain.Registry;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.Group;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRef;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.registry.ConformanceProfileRegistry;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Component;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.registry.DatatypeRegistry;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.exceptions.AddingException;
import gov.nist.hit.hl7.igamt.ig.model.AddDatatypeResponseObject;
import gov.nist.hit.hl7.igamt.ig.model.AddMessageResponseObject;
import gov.nist.hit.hl7.igamt.ig.model.AddSegmentResponseObject;
import gov.nist.hit.hl7.igamt.ig.model.AddValueSetResponseObject;
import gov.nist.hit.hl7.igamt.ig.service.CrudService;
import gov.nist.hit.hl7.igamt.segment.domain.Field;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.domain.registry.SegmentRegistry;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.domain.registry.ValueSetRegistry;
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
	public AddMessageResponseObject addConformanceProfiles(Set<String> ids, Ig ig)
			throws AddingException {
		AddMessageResponseObject ret = new AddMessageResponseObject();
		ConformanceProfileRegistry reg = ig.getConformanceProfileRegistry();
		if (reg != null) {
			if (reg.getChildren() != null) {
				Set<String> existants = mapLinkToId(reg.getChildren());
				ids.removeAll(existants);
				for (String id : ids) {
					ConformanceProfile cp = conformanceProfileService.findById(id);
					if (cp != null) {
						ret.getConformanceProfiles().add(cp);
						addDependecies(cp, ig, ret);
						Link link = new Link(cp, cp.getChildren().size() + 1);
						reg.getChildren().add(link);
					} else {
						throw new AddingException("Could not find conformance profile with id " + id);
					}
				}
			}
		}
		return ret;
	}

	private void addDependecies(ConformanceProfile cp, Ig ig, AddMessageResponseObject ret)
			throws AddingException {
		Set<String> segmentIds = getConformanceProfileResourceDependenciesIds(cp);
		AddSegmentResponseObject formSegment = addSegments(segmentIds, ig);
		ret.getSegments().addAll((formSegment.getSegments()));
		ret.getDatatypes().addAll(formSegment.getDatatypes());
		for (Valueset vs : formSegment.getValueSets()) {
			ret.getValueSets().add(vs);

		}
		if (cp.getBinding() != null) {
			Set<String> vauleSetBindingIds = processBinding(cp.getBinding());
			AddValueSetResponseObject valueSetAdded = addValueSets(vauleSetBindingIds, ig);

			for (Valueset vs : valueSetAdded.getValueSets()) {
				if (!ret.getValueSets().contains(vs)) {
					ret.getValueSets().add(vs);
				}
			}
		}
	}

	private Set<String> getConformanceProfileResourceDependenciesIds(ConformanceProfile cp) {
		// TODO Auto-generated method stub
		Set<String> ids = new HashSet<String>();
		for (MsgStructElement segOrgroup : cp.getChildren()) {
			if (segOrgroup instanceof SegmentRef) {
				SegmentRef ref = (SegmentRef) segOrgroup;
				if (ref.getRef() != null && ref.getRef().getId() != null)
					ids.add(ref.getRef().getId());
			} else {
				processSegmentorGroup(segOrgroup, ids);
			}
		}
		return ids;

	}

	private void processSegmentorGroup(MsgStructElement segOrgroup, Set<String> ids) {
		if (segOrgroup instanceof SegmentRef) {
			SegmentRef ref = (SegmentRef) segOrgroup;
			if (ref.getRef() != null && ref.getRef().getId() != null) {
				ids.add(ref.getRef().getId());
			}
		} else if (segOrgroup instanceof Group) {
			Group g = (Group) segOrgroup;
			for (MsgStructElement child : g.getChildren()) {
				processSegmentorGroup(child, ids);
			}
		}
	}

	@Override
	public AddSegmentResponseObject addSegments(Set<String> ids, Ig ig) throws AddingException {
		AddSegmentResponseObject ret = new AddSegmentResponseObject();
		SegmentRegistry reg = ig.getSegmentRegistry();
		if (reg != null) {
			if (reg.getChildren() != null) {
				Set<String> existants = mapLinkToId(reg.getChildren());
				ids.removeAll(existants);
				for (String id : ids) {
					Segment segment = segmentService.findById(id);
					if (segment != null) {
						addDependecies(segment, ig, ret);
						Link link =
								new Link(segment, reg.getChildren().size() + 1);
						ret.getSegments().add(segment);
						reg.getChildren().add(link);
					} else {

						throw new AddingException("Could not find Segment with id" + segment.getId());


					}
				}
			}
		}
		return ret;
	}

	private void addDependecies(Segment segment, Ig ig, AddSegmentResponseObject ret)
			throws AddingException {
		// TODO Auto-generated method stub

		Set<String> datatypeIds = getSegmentResourceDependenciesIds(segment);

		AddDatatypeResponseObject fromDataypes = addDatatypes(datatypeIds, ig);

		for (Datatype d : fromDataypes.getDatatypes()) {
			ret.getDatatypes().add(d);
		}

		for (Valueset vs : fromDataypes.getValueSets()) {
			ret.getValueSets().add(vs);
		}

		if (segment.getBinding() != null) {
			Set<String> vauleSetBindingIds = processBinding(segment.getBinding());

			AddValueSetResponseObject valueSetAdded = addValueSets(vauleSetBindingIds, ig);

			for (Valueset vs : valueSetAdded.getValueSets()) {
				if (!ret.getValueSets().contains(vs)) {
					ret.getValueSets().add(vs);
				}
			}
		}


	}

	private Set<String> processBinding(ResourceBinding binding) {
		// TODO Auto-generated method stub
		Set<String> vauleSetIds = new HashSet<String>();
		if (binding.getChildren() != null) {
			for (StructureElementBinding child : binding.getChildren()) {
				if (child.getValuesetBindings() != null) {
					for (ValuesetBinding vs : child.getValuesetBindings()) {
						if(vs.getValueSets() !=null) {
							for(String s: vs.getValueSets()) {
									vauleSetIds.add(s);
							}
						}
					}
				}
			}
		}
		return vauleSetIds;
	}

	private Set<String> getSegmentResourceDependenciesIds(Segment segment) {
		// TODO Auto-generated method stub
		Set<String> ids = new HashSet<String>();
		if (segment.getChildren() != null) {

			for (Field f : segment.getChildren()) {
				if (f.getRef() != null && f.getRef().getId() != null) {
					ids.add(f.getRef().getId());
				}
			}
		}
		return ids;
	}

	@Override
	public AddDatatypeResponseObject addDatatypes(Set<String> ids, Ig ig) throws AddingException {
		// TODO Auto-generated method stub
		AddDatatypeResponseObject ret = new AddDatatypeResponseObject();
		if (ig.getDatatypeRegistry() != null) {
			if (ig.getDatatypeRegistry().getChildren() != null) {
				Set<String> existants = mapLinkToId(ig.getDatatypeRegistry().getChildren());
				ids.removeAll(existants);
				for (String id : ids) {
					Datatype datatype = datatypeService.findById(id);
					if (datatype != null) {
						if (datatype instanceof ComplexDatatype) {
							ComplexDatatype p = (ComplexDatatype) datatype;
							if (p.getBinding() != null) {
								Set<String> vauleSetBindingIds = processBinding(p.getBinding());
								AddValueSetResponseObject valueSetAdded = addValueSets(vauleSetBindingIds, ig);
								for (Valueset vs : valueSetAdded.getValueSets()) {
									if (!ret.getValueSets().contains(vs)) {
										ret.getValueSets().add(vs);
									}
								}
							}
							Set<String> datatypeIds = getDatatypeResourceDependenciesIds(p);
							addDatatypes(datatypeIds, ig, ret);
						}
						Link link = new Link(datatype,
								ig.getDatatypeRegistry().getChildren().size() + 1);
						ret.getDatatypes().add(datatype);
						ig.getDatatypeRegistry().getChildren().add(link);

					}else {
						throw new AddingException("Could not find Datatype with id : "+id);
					}
				}
			}
		}
		return ret;
	}


	public void addDatatypes(Set<String> ids, Ig ig, AddDatatypeResponseObject ret)
			throws AddingException {
		// TODO Auto-generated method stub
		if (ig.getDatatypeRegistry() != null) {
			if (ig.getDatatypeRegistry().getChildren() != null) {
				Set<String> existants = mapLinkToId(ig.getDatatypeRegistry().getChildren());
				ids.removeAll(existants);
				for (String id : ids) {
					Datatype datatype = datatypeService.findById(id);
					if (datatype != null) {
						if (datatype.getBinding() != null) {
							Set<String> vauleSetBindingIds = processBinding(datatype.getBinding());
							AddValueSetResponseObject valueSetAdded = addValueSets(vauleSetBindingIds, ig);
							for (Valueset vs : valueSetAdded.getValueSets()) {
								if (!ret.getValueSets().contains(vs)) {
									ret.getValueSets().add(vs);
								}
							}
						}
						Link link =
								new Link(datatype, ig.getDatatypeRegistry().getChildren().size() + 1);
						ig.getDatatypeRegistry().getChildren().add(link);
						ret.getDatatypes().add(datatype);
						if (datatype instanceof ComplexDatatype) {
							ComplexDatatype p = (ComplexDatatype) datatype;
							addDatatypes(getDatatypeResourceDependenciesIds(p), ig, ret);
						}
					} else {
						throw new AddingException("Could not find Datata type  with id " + id);
					}
				}
			}
		}
	}


	private Set<String> getDatatypeResourceDependenciesIds(ComplexDatatype datatype) {
		// TODO Auto-generated method stub
		Set<String> datatypeIds = new HashSet<String>();
		for (Component c : datatype.getComponents()) {
			if (c.getRef() != null) {
				if (c.getRef().getId() != null) {
					datatypeIds.add(c.getRef().getId());
				}
			}
		}
		return datatypeIds;

	}

	@Override
	public AddValueSetResponseObject addValueSets(Set<String> ids, Ig ig) throws AddingException {
		// TODO Auto-generated method stub
		ValueSetRegistry reg = ig.getValueSetRegistry();
		AddValueSetResponseObject ret = new AddValueSetResponseObject();
		if (reg != null) {
			if (reg.getChildren() != null) {
				Set<String> existants = mapLinkToId(reg.getChildren());
				ids.removeAll(existants);
				for (String id : ids) {
					Valueset valueSet = valuesetService.findById(id);
					if (valueSet != null) {
						Link link =
								new Link(valueSet, reg.getChildren().size() + 1);
						reg.getChildren().add(link);
						ret.getValueSets().add(valueSet);
					} else {
						throw new AddingException("Could not find Value Set  with id " + id);
					}
				}
			}
		}
		return ret;
	}


	private Set<String> mapLinkToId(Set<Link> links) {
		Set<String> ids = links.stream().map(x -> x.getId()).collect(Collectors.toSet());
		return ids;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * gov.nist.hit.hl7.igamt.ig.service.CrudService#AddConformanceProfilesToEmptyIg(java.util.Set,
	 * gov.nist.hit.hl7.igamt.ig.domain.Ig)
	 */
	@Override
	public String AddConformanceProfilesToEmptyIg(Set<String> ids, Ig ig)
			throws AddingException {
		// TODO Auto-generated method stub
		AddMessageResponseObject ret = this.addConformanceProfiles(ids, ig);


		List<AbstractDomain> ordredSegment = ret.getSegments().stream()
				.sorted((Segment t1, Segment t2) -> t1.getName().compareTo(t2.getName()))
				.collect(Collectors.toList());

		orderRegistry(ig.getSegmentRegistry(), ordredSegment);
		System.out.println(ig.getDatatypeRegistry().getChildren().size());
		List<AbstractDomain> ordredDatatypes = ret.getDatatypes().stream()
				.sorted((Datatype t1, Datatype t2) -> t1.getName().compareTo(t2.getName()))
				.collect(Collectors.toList());
		orderRegistry(ig.getDatatypeRegistry(), ordredDatatypes);

		List<AbstractDomain> orderdValueSet = ret.getValueSets().stream()
				.sorted((Valueset t1, Valueset t2) -> t1.getBindingIdentifier().compareTo(t2.getBindingIdentifier()))
				.collect(Collectors.toList());

		orderRegistry(ig.getValueSetRegistry(), orderdValueSet);
		return ig.getId();
	}

	/**
	 * @param conformanceProfileRegistry
	 * @param ordredMessages
	 */
	private void orderRegistry(Registry registry, List<AbstractDomain> list) {
		// TODO Auto-generated method stub
		HashMap<String, Integer> orderMap = new HashMap<String, Integer>();
		for (int i = 0; i < list.size(); i++) {
			orderMap.put(list.get(i).getId(), i + 1);
		}
		for (Link link : registry.getChildren()) {
			link.setPosition(orderMap.get(link.getId()));
		}
	}



}
