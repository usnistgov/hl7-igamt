package gov.nist.hit.hl7.igamt.web.app.service;

import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.exception.ResourceNotFoundException;
import gov.nist.hit.hl7.igamt.common.base.service.impl.DataFragment;
import gov.nist.hit.hl7.igamt.common.base.service.impl.InMemoryDomainExtensionServiceImpl;
import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.igamt.common.slicing.domain.ConditionalSlicing;
import gov.nist.hit.hl7.igamt.common.slicing.domain.OrderedSlicing;
import gov.nist.hit.hl7.igamt.common.slicing.domain.Slicing;
import gov.nist.hit.hl7.igamt.common.slicing.domain.SlicingMethod;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.CompositeProfileState;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.ProfileComponentsEvaluationResult;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.ResourceAndDisplay;
import gov.nist.hit.hl7.igamt.compositeprofile.service.CompositeProfileStructureService;
import gov.nist.hit.hl7.igamt.compositeprofile.service.impl.ConformanceProfileCompositeService;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.Group;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRef;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRefOrGroup;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.registry.ConformanceProfileRegistry;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Component;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.registry.DatatypeRegistry;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.ig.controller.wrappers.ReqId;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.model.CoConstraintMappingLocation;
import gov.nist.hit.hl7.igamt.ig.model.CoConstraintOBX3MappingValue;
import gov.nist.hit.hl7.igamt.ig.service.CoConstraintSerializationHelper;
import gov.nist.hit.hl7.igamt.segment.domain.Field;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.domain.registry.SegmentRegistry;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.service.impl.exception.AmbiguousOBX3MappingException;
import gov.nist.hit.hl7.igamt.service.impl.exception.PathNotFoundException;
import gov.nist.hit.hl7.igamt.valueset.domain.registry.ValueSetRegistry;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;
import gov.nist.hit.hl7.igamt.web.app.model.IgSubSet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class LegacyIgSubSetService {

	@Autowired
	ConformanceProfileCompositeService compose;

	@Autowired
	InMemoryDomainExtensionServiceImpl inMemoryDomainExtensionService;

	@Autowired
	CoConstraintSerializationHelper coConstraintSerializationHelper;

	@Autowired
	ConformanceProfileService conformanceProfileService;

	@Autowired
	DatatypeService datatypeService;

	@Autowired
	SegmentService segmentService;

	@Autowired
	ValuesetService valuesetService;

	@Autowired
	CompositeProfileStructureService compositeProfileService;

	public IgSubSet makeIgSubSet(Ig ig, ReqId reqIds) throws AmbiguousOBX3MappingException, ResourceNotFoundException, PathNotFoundException, IOException {
		IgSubSet igSubSet = new IgSubSet();
		Ig selectedIg = new Ig();
		igSubSet.setSubSet(selectedIg);
		igSubSet.setOriginalIg(ig.getId());
		igSubSet.setProfiles(reqIds);

		selectedIg.setId(ig.getId());
		selectedIg.setDomainInfo(ig.getDomainInfo());
		selectedIg.setMetadata(ig.getMetadata());
		selectedIg.setConformanceProfileRegistry(new ConformanceProfileRegistry());
		selectedIg.setSegmentRegistry(new SegmentRegistry());
		selectedIg.setDatatypeRegistry(new DatatypeRegistry());
		selectedIg.setValueSetRegistry(new ValueSetRegistry());

		for (String id : reqIds.getConformanceProfilesId()) {
			Link l = ig.getConformanceProfileRegistry().getLinkById(id);

			if (l != null) {
				selectedIg.getConformanceProfileRegistry().getChildren().add(l);

				ConformanceProfile cp = this.conformanceProfileService.findById(l.getId());

				this.visitSegmentRefOrGroup(cp.getChildren(), selectedIg, ig);

				// For CoConstraint
				Map<CoConstraintMappingLocation, Set<CoConstraintOBX3MappingValue>> maps = this.coConstraintSerializationHelper.getOBX3ToFlavorMap(cp);
				for (CoConstraintMappingLocation key : maps.keySet()) {
					for (CoConstraintOBX3MappingValue item : maps.get(key)) {
						Link link = ig.getDatatypeRegistry().getLinkById(item.getFlavorId());
						if (link != null) {
							selectedIg.getDatatypeRegistry().getChildren().add(link);
							Datatype dt = this.datatypeService.findById(link.getId());
							if (dt != null && dt instanceof ComplexDatatype) {
								ComplexDatatype cdt = (ComplexDatatype) dt;
								if (cdt.getComponents() != null) {
									this.visitDatatype(cdt.getComponents(), selectedIg, ig);
									if (cdt.getBinding() != null && cdt.getBinding().getChildren() != null)
										this.collectVS(cdt.getBinding().getChildren(), selectedIg, ig);
								}
							}
						}
					}
				}

				// For CP slicing
				if(cp.getSlicings() != null) {
					for(Slicing s : cp.getSlicings()) {
						if (s.getType().equals(SlicingMethod.OCCURRENCE)) {
							OrderedSlicing orderedSlicing = (OrderedSlicing) s;
							if (orderedSlicing.getSlices() != null) {
								orderedSlicing.getSlices().forEach(slice -> {
									Link link = ig.getSegmentRegistry().getLinkById(slice.getFlavorId());
									if (link != null) {
										selectedIg.getSegmentRegistry().getChildren().add(link);
										Segment seg = this.segmentService.findById(link.getId());

										this.visitSegment(seg.getChildren(), selectedIg, ig);
										this.handleSegmentSlicing(seg, selectedIg, ig);
										if(seg.getBinding() != null && seg.getBinding().getChildren() != null) this.collectVS(seg.getBinding().getChildren(), selectedIg, ig);
									}
								});

							}
						}else if(s.getType().equals(SlicingMethod.ASSERTION)) {
							ConditionalSlicing conditionalSlicing = (ConditionalSlicing) s;
							if (conditionalSlicing.getSlices() != null) {
								conditionalSlicing.getSlices().forEach(slice -> {
									Link link = ig.getSegmentRegistry().getLinkById(slice.getFlavorId());
									if (link != null) {
										selectedIg.getSegmentRegistry().getChildren().add(link);
										Segment seg = this.segmentService.findById(link.getId());

										this.visitSegment(seg.getChildren(), selectedIg, ig);
										this.handleSegmentSlicing(seg, selectedIg, ig);
										if(seg.getBinding() != null && seg.getBinding().getChildren() != null) this.collectVS(seg.getBinding().getChildren(), selectedIg, ig);
									}

								});
							}
						}
					}
				}
			}
		}

		for(String id : reqIds.getCompositeProfilesId()) {
			Link l = ig.getCompositeProfileRegistry().getLinkById(id);

			if(l != null) {
				CompositeProfileState cps = this.eval(l.getId());
				this.visitSegmentRefOrGroup(cps.getConformanceProfile().getResource().getChildren(), selectedIg, ig);
				Link newLink = new Link(cps.getConformanceProfile().getResource());
				this.inMemoryDomainExtensionService.put(newLink.getId(), cps.getConformanceProfile().getResource());
				selectedIg.getConformanceProfileRegistry().getChildren().add(newLink);
				igSubSet.getInMemoryDataTokens().add(cps.getToken());
			}
		}

		return igSubSet;
	}

	public CompositeProfileState eval(String id) {
		ProfileComponentsEvaluationResult<ConformanceProfile> profileComponentsEvaluationResult = compose.create(compositeProfileService.findById(id));
		DataFragment<ConformanceProfile> df = profileComponentsEvaluationResult.getResources();
		String token = this.inMemoryDomainExtensionService.put(df.getContext());
		Stream<Datatype> datatypes = df.getContext().getResources().stream().filter((r) -> r instanceof Datatype).map((r) -> (Datatype) r);
		Stream<Segment> segments = df.getContext().getResources().stream().filter((r) -> r instanceof Segment).map((r) -> (Segment) r);
		CompositeProfileState state = new CompositeProfileState();
		state.setConformanceProfile(new ResourceAndDisplay<>(this.conformanceProfileService.convertConformanceProfile(df.getPayload(), 0), df.getPayload()));
		state.setDatatypes(datatypes.map((dt) -> new ResourceAndDisplay<>(this.datatypeService.convertDatatype(dt), dt)).collect(Collectors.toList()));
		state.setSegments(segments.map((sg) -> new ResourceAndDisplay<>(this.segmentService.convertSegment(sg), sg)).collect(Collectors.toList()));
		Map<PropertyType, Set<String>> refChanges = profileComponentsEvaluationResult.getChangedReferences();
		List<Datatype> refDatatype = this.datatypeService.findByIdIn(refChanges.get(PropertyType.DATATYPE));
		List<Segment> refSegment = this.segmentService.findByIdIn(refChanges.get(PropertyType.SEGMENTREF));
		state.setReferences(Stream.concat(refDatatype.stream(), refSegment.stream()).collect(Collectors.toList()));
		state.setToken(token);
		return state;
	}

	private void visitSegmentRefOrGroup(Set<SegmentRefOrGroup> srgs, Ig selectedIg, Ig all) {
		srgs.forEach(srg -> {
			if(srg instanceof Group) {
				Group g = (Group)srg;
				if(g.getChildren() != null) this.visitSegmentRefOrGroup(g.getChildren(), selectedIg, all);
			} else if (srg instanceof SegmentRef) {
				SegmentRef sr = (SegmentRef)srg;

				if(sr != null && sr.getId() != null && sr.getRef() != null && sr.getRef().getId() != null) {
					Link l = all.getSegmentRegistry().getLinkById(sr.getRef().getId());
					if(l == null) {
						Segment s = this.inMemoryDomainExtensionService.findById(sr.getRef().getId(), Segment.class);
						if( s != null) l = new Link(s);
					}
					if(l != null) {
						selectedIg.getSegmentRegistry().getChildren().add(l);
						Segment s = this.segmentService.findById(l.getId());
						if(s == null) s = this.inMemoryDomainExtensionService.findById(l.getId(), Segment.class);
						if (s != null && s.getChildren() != null) {
							this.visitSegment(s.getChildren(), selectedIg, all);
							if(s.getBinding() != null && s.getBinding().getChildren() != null) this.collectVS(s.getBinding().getChildren(), selectedIg, all);
						}
						//For Dynamic Mapping
						if (s != null && s.getDynamicMappingInfo() != null && s.getDynamicMappingInfo().getItems() != null) {
							s.getDynamicMappingInfo().getItems().forEach(item -> {
								Link link = all.getDatatypeRegistry().getLinkById(item.getDatatypeId());
								if(link != null) {
									selectedIg.getDatatypeRegistry().getChildren().add(link);
									Datatype dt = this.datatypeService.findById(link.getId());
									if (dt != null && dt instanceof ComplexDatatype) {
										ComplexDatatype cdt = (ComplexDatatype)dt;
										if(cdt.getComponents() != null) {
											this.visitDatatype(cdt.getComponents(), selectedIg, all);
											if(cdt.getBinding() != null && cdt.getBinding().getChildren() != null) this.collectVS(cdt.getBinding().getChildren(), selectedIg, all);
										}
									}

								}
							});
						}

						this.handleSegmentSlicing(s, selectedIg, all);
					}
				}
			}
		});

	}

	private void handleSegmentSlicing(Segment s, Ig selectedIg,Ig all) {
		// For Segment slicing
		if (s.getSlicings() != null) {
			for (Slicing slicing : s.getSlicings()) {
				if (slicing.getType().equals(SlicingMethod.OCCURRENCE)) {
					OrderedSlicing orderedSlicing = (OrderedSlicing) slicing;
					if (orderedSlicing.getSlices() != null) {
						orderedSlicing.getSlices().forEach(slice -> {
							Link link = all.getDatatypeRegistry().getLinkById(slice.getFlavorId());
							if (link != null) {
								selectedIg.getDatatypeRegistry().getChildren().add(link);
								Datatype dt = this.datatypeService.findById(link.getId());

								if (dt != null && dt instanceof ComplexDatatype) {
									ComplexDatatype cdt = (ComplexDatatype) dt;
									if (cdt.getComponents() != null) {
										this.visitDatatype(cdt.getComponents(), selectedIg, all);
										if (cdt.getBinding() != null
												&& cdt.getBinding().getChildren() != null)
											this.collectVS(cdt.getBinding().getChildren(), selectedIg, all);
									}
								}
							}
						});

					}
				} else if (slicing.getType().equals(SlicingMethod.ASSERTION)) {
					ConditionalSlicing conditionalSlicing = (ConditionalSlicing) slicing;
					if (conditionalSlicing.getSlices() != null) {
						conditionalSlicing.getSlices().forEach(slice -> {
							Link link = all.getDatatypeRegistry().getLinkById(slice.getFlavorId());
							if (link != null) {
								selectedIg.getDatatypeRegistry().getChildren().add(link);
								Datatype dt = this.datatypeService.findById(link.getId());

								if (dt != null && dt instanceof ComplexDatatype) {
									ComplexDatatype cdt = (ComplexDatatype) dt;
									if (cdt.getComponents() != null) {
										this.visitDatatype(cdt.getComponents(), selectedIg, all);
										if (cdt.getBinding() != null
												&& cdt.getBinding().getChildren() != null)
											this.collectVS(cdt.getBinding().getChildren(), selectedIg, all);
									}
								}
							}
						});

					}
				}
			}
		}

	}

	private void collectVS(Set<StructureElementBinding> sebs, Ig selectedIg, Ig all) {
		sebs.forEach(seb -> {
			if(seb.getValuesetBindings() != null) {
				seb.getValuesetBindings().forEach(b -> {
					if(b.getValueSets() != null) {
						b.getValueSets().forEach(id -> {
							Link l = all.getValueSetRegistry().getLinkById(id);
							if(l != null) {
								selectedIg.getValueSetRegistry().getChildren().add(l);
							}
						});
					}
				});
			}
		});

	}

	private void visitSegment(Set<Field> fields, Ig selectedIg, Ig all) {
		fields.forEach(f -> {
			if(f.getRef() != null && f.getRef().getId() != null) {
				Link l = all.getDatatypeRegistry().getLinkById(f.getRef().getId());
				if(l == null) {
					Datatype dt = this.inMemoryDomainExtensionService.findById(f.getRef().getId(), ComplexDatatype.class);
					if(dt != null) l = new Link(dt);
				}
				if(l != null) {
					selectedIg.getDatatypeRegistry().getChildren().add(l);
					Datatype dt = this.datatypeService.findById(l.getId());
					if(dt == null) dt = this.inMemoryDomainExtensionService.findById(l.getId(), ComplexDatatype.class);
					if (dt != null && dt instanceof ComplexDatatype) {
						ComplexDatatype cdt = (ComplexDatatype)dt;
						if(cdt.getComponents() != null) {
							this.visitDatatype(cdt.getComponents(), selectedIg, all);
							if(cdt.getBinding() != null && cdt.getBinding().getChildren() != null) this.collectVS(cdt.getBinding().getChildren(), selectedIg, all);
						}
					}
				}
			}
		});

	}

	private void visitDatatype(Set<Component> components, Ig selectedIg, Ig all) {
		components.forEach(c -> {
			if(c.getRef() != null && c.getRef().getId() != null) {
				Link l = all.getDatatypeRegistry().getLinkById(c.getRef().getId());
				if(l == null) {
					Datatype dt = this.inMemoryDomainExtensionService.findById(c.getRef().getId(), ComplexDatatype.class);
					if(dt != null) l = new Link(dt);
				}
				if(l != null) {
					selectedIg.getDatatypeRegistry().getChildren().add(l);
					Datatype dt = this.datatypeService.findById(l.getId());
					if(dt == null) dt = this.inMemoryDomainExtensionService.findById(l.getId(), ComplexDatatype.class);
					if (dt != null && dt instanceof ComplexDatatype) {
						ComplexDatatype cdt = (ComplexDatatype)dt;
						if(cdt.getComponents() != null) {
							this.visitDatatype(cdt.getComponents(), selectedIg, all);
							if(cdt.getBinding() != null && cdt.getBinding().getChildren() != null) this.collectVS(cdt.getBinding().getChildren(), selectedIg, all);
						}
					}
				}
			}
		});
	}
}
