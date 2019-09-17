/**
 * 
 * This software was developed at the National Institute of Standards and Technology by employees of
 * the Federal Government in the course of their official duties. Pursuant to title 17 Section 105
 * of the United States Code this software is not subject to copyright protection and is in the
 * public domain. This is an experimental system. NIST assumes no responsibility whatsoever for its
 * use by other parties, and makes no guarantees, expressed or implied, about its quality,
 * reliability, or any other characteristic. We would appreciate acknowledgement if the software is
 * used. This software can be redistributed and/or modified freely provided that any derivative
 * works bear some notice that they are derived from it, and any modified versions bear some notice
 * that they have been modified.
 * 
 */
package gov.nist.hit.hl7.igamt.segment.service.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.apache.commons.lang3.StringUtils;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import gov.nist.hit.hl7.igamt.coconstraints.domain.CoConstraintTable;
import gov.nist.hit.hl7.igamt.common.base.domain.Comment;
import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.Ref;
import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.Usage;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
import gov.nist.hit.hl7.igamt.common.base.domain.display.ViewScope;
import gov.nist.hit.hl7.igamt.common.base.exception.ValidationException;
import gov.nist.hit.hl7.igamt.common.base.model.SectionType;
import gov.nist.hit.hl7.igamt.common.base.service.InMemoryDomainExtentionService;
import gov.nist.hit.hl7.igamt.common.base.util.ReferenceIndentifier;
import gov.nist.hit.hl7.igamt.common.base.util.ReferenceLocation;
import gov.nist.hit.hl7.igamt.common.base.util.RelationShip;
import gov.nist.hit.hl7.igamt.common.base.util.ValidationUtil;
import gov.nist.hit.hl7.igamt.common.binding.domain.ExternalSingleCode;
import gov.nist.hit.hl7.igamt.common.binding.domain.LocationInfo;
import gov.nist.hit.hl7.igamt.common.binding.domain.LocationType;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;
import gov.nist.hit.hl7.igamt.common.binding.service.BindingService;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.ChangeItemDomain;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.ChangeType;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatement;
import gov.nist.hit.hl7.igamt.constraints.domain.DisplayPredicate;
import gov.nist.hit.hl7.igamt.constraints.domain.Level;
import gov.nist.hit.hl7.igamt.constraints.domain.Predicate;
import gov.nist.hit.hl7.igamt.constraints.domain.display.ConformanceStatementsContainer;
import gov.nist.hit.hl7.igamt.constraints.repository.ConformanceStatementRepository;
import gov.nist.hit.hl7.igamt.constraints.repository.PredicateRepository;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Component;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.display.BindingDisplay;
import gov.nist.hit.hl7.igamt.datatype.domain.display.ComponentDisplayDataModel;
import gov.nist.hit.hl7.igamt.datatype.domain.display.ComponentStructureTreeModel;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DatatypeLabel;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DisplayValuesetBinding;
import gov.nist.hit.hl7.igamt.datatype.domain.display.PostDef;
import gov.nist.hit.hl7.igamt.datatype.domain.display.PreDef;
import gov.nist.hit.hl7.igamt.datatype.domain.display.SubComponentDisplayDataModel;
import gov.nist.hit.hl7.igamt.datatype.domain.display.SubComponentStructureTreeModel;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.segment.domain.DynamicMappingInfo;
import gov.nist.hit.hl7.igamt.segment.domain.DynamicMappingItem;
import gov.nist.hit.hl7.igamt.segment.domain.Field;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.domain.display.CodeInfo;
import gov.nist.hit.hl7.igamt.segment.domain.display.FieldDisplayDataModel;
import gov.nist.hit.hl7.igamt.segment.domain.display.FieldStructureTreeModel;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentDynamicMapping;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentLabel;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentSelectItem;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentSelectItemGroup;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentStructureDisplay;
import gov.nist.hit.hl7.igamt.segment.exception.SegmentNotFoundException;
import gov.nist.hit.hl7.igamt.segment.exception.SegmentValidationException;
import gov.nist.hit.hl7.igamt.segment.repository.SegmentRepository;
import gov.nist.hit.hl7.igamt.segment.service.CoConstraintService;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.valueset.domain.Code;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;

/**
 *
 * @author Jungyub Woo on Mar 15, 2018.
 */

@Service("segmentService")
public class SegmentServiceImpl implements SegmentService {

	@Autowired
	private SegmentRepository segmentRepository;

	@Autowired
	private InMemoryDomainExtentionService domainExtention;

	//	@Autowired
	//	private CoConstraintService coConstraintService;

	@Autowired
	private MongoTemplate mongoTemplate;

	@Autowired
	DatatypeService datatypeService;

	@Autowired
	BindingService bindingService;

	@Autowired
	ValuesetService valueSetService;

	@Autowired
	private ConformanceStatementRepository conformanceStatementRepository;

	@Autowired
	private PredicateRepository predicateRepository;

	@Override
	public Segment findById(String key) {
		Segment segment = this.domainExtention.findById(key, Segment.class);
		return segment == null ? segmentRepository.findById(key).orElse(null) : segment;
	}

	@Override
	public Segment create(Segment segment) {
		segment.setId(null);
		segment = segmentRepository.save(segment);
		return segment;
	}

	@Override
	public Segment save(Segment segment) {
		segment.setUpdateDate(new Date());
		segment = segmentRepository.save(segment);
		return segment;
	}

	@Override
	public List<Segment> findAll() {
		return Stream.concat(this.domainExtention.getAll(Segment.class).stream(), segmentRepository.findAll().stream())
				.collect(Collectors.toList());
	}

	@Override
	public void delete(Segment segment) {
		segmentRepository.delete(segment);
	}

	@Override
	public void delete(String key) {
		segmentRepository.deleteById(key);
	}

	@Override
	public void removeCollection() {
		segmentRepository.deleteAll();
	}

	@Override
	public List<Segment> findByDomainInfoVersion(String version) {
		return segmentRepository.findByDomainInfoVersion(version);
	}

	@Override
	public List<Segment> findByDomainInfoScope(String scope) {
		return segmentRepository.findByDomainInfoScope(scope);
	}

	@Override
	public List<Segment> findByDomainInfoScopeAndDomainInfoVersion(String scope, String version) {
		return segmentRepository.findByDomainInfoScopeAndDomainInfoVersion(scope, version);
	}

	@Override
	public List<Segment> findByName(String name) {
		return segmentRepository.findByName(name);
	}

	@Override
	public List<Segment> findByDomainInfoScopeAndDomainInfoVersionAndName(String scope, String version, String name) {
		return segmentRepository.findByDomainInfoScopeAndDomainInfoVersionAndName(scope, version, name);
	}

	@Override
	public List<Segment> findByDomainInfoVersionAndName(String version, String name) {
		return segmentRepository.findByDomainInfoVersionAndName(version, name);
	}

	@Override
	public List<Segment> findByDomainInfoScopeAndName(String scope, String name) {
		return segmentRepository.findByDomainInfoScopeAndName(scope, name);
	}

	/**
	 * @deprecated. Use segment.toStructure()
	 */
	@Override
	public SegmentStructureDisplay convertDomainToDisplayStructure(Segment segment, boolean readOnly) {
		HashMap<String, Valueset> valueSetsMap = new HashMap<String, Valueset>();
		HashMap<String, Datatype> datatypesMap = new HashMap<String, Datatype>();

		SegmentStructureDisplay result = new SegmentStructureDisplay();
		result.complete(result, segment, SectionType.STRUCTURE, readOnly);
		result.setName(segment.getName());
		if (segment.getExt() != null) {
			result.setLabel(segment.getName() + "_" + segment.getExt());
		} else {
			result.setLabel(segment.getName());
		}

		if (segment.getChildren() != null && segment.getChildren().size() > 0) {
			for (Field f : segment.getChildren()) {
				Datatype childDt = this.findDatatype(f.getRef().getId(), datatypesMap);
				if (childDt != null) {
					FieldStructureTreeModel fieldStructureTreeModel = new FieldStructureTreeModel();
					FieldDisplayDataModel fModel = new FieldDisplayDataModel(f);
					fModel.setViewScope(ViewScope.SEGMENT);
					fModel.setIdPath(f.getId());
					fModel.setPath(f.getPosition() + "");
					fModel.setDatatypeLabel(this.createDatatypeLabel(childDt));
					fModel.setConstantValue(f.getConstantValue());
					StructureElementBinding fSeb = this.findStructureElementBindingByFieldIdForSegment(segment,
							f.getId());
					if (fSeb != null) {
						fModel.addBinding(
								this.createBindingDisplay(fSeb, segment.getId(), ViewScope.SEGMENT, 1, valueSetsMap));
						if (fSeb.getPredicateId() != null) {
							Optional<Predicate> op = this.predicateRepository.findById(fSeb.getPredicateId());
							if (op.isPresent() && op.get().getTrueUsage() != null && op.get().getFalseUsage() != null) {
								fModel.setTrueUsage(op.get().getTrueUsage());
								fModel.setFalseUsage(op.get().getFalseUsage());
								fModel.setPredicate(op.get());
								if (op.get().getIdentifier() != null)
									fModel.getPredicate().setIdentifier(fModel.getIdPath());
							}
						}
					}
					fieldStructureTreeModel.setData(fModel);
					if (childDt instanceof ComplexDatatype) {
						ComplexDatatype fieldDatatype = (ComplexDatatype) childDt;
						if (fieldDatatype.getComponents() != null && fieldDatatype.getComponents().size() > 0) {
							for (Component c : fieldDatatype.getComponents()) {
								Datatype childChildDt = this.findDatatype(c.getRef().getId(), datatypesMap);
								if (childChildDt != null) {
									ComponentStructureTreeModel componentStructureTreeModel = new ComponentStructureTreeModel();
									ComponentDisplayDataModel cModel = new ComponentDisplayDataModel(c);
									cModel.setViewScope(ViewScope.SEGMENT);
									cModel.setIdPath(f.getId() + "-" + c.getId());
									cModel.setPath(f.getPosition() + "-" + c.getPosition());
									cModel.setDatatypeLabel(this.createDatatypeLabel(childChildDt));
									cModel.setConstantValue(c.getConstantValue());
									StructureElementBinding childSeb = this
											.findStructureElementBindingByComponentIdFromStructureElementBinding(fSeb,
													c.getId());
									if (childSeb != null) {
										cModel.addBinding(this.createBindingDisplay(childSeb, segment.getId(),
												ViewScope.SEGMENT, 1, valueSetsMap));
										if (childSeb.getPredicateId() != null) {
											Optional<Predicate> op = this.predicateRepository
													.findById(childSeb.getPredicateId());
											if (op.isPresent() && op.get().getTrueUsage() != null
													&& op.get().getFalseUsage() != null) {
												cModel.setTrueUsage(op.get().getTrueUsage());
												cModel.setFalseUsage(op.get().getFalseUsage());
												cModel.setPredicate(op.get());
												if (op.get().getIdentifier() != null)
													cModel.getPredicate().setIdentifier(cModel.getIdPath());
											}
										}
									}
									StructureElementBinding cSeb = this
											.findStructureElementBindingByComponentIdForDatatype(childDt, c.getId());
									if (cSeb != null) {
										cModel.addBinding(this.createBindingDisplay(cSeb, childDt.getId(),
												ViewScope.DATATYPE, 2, valueSetsMap));
										if (cSeb.getPredicateId() != null) {
											Optional<Predicate> op = this.predicateRepository
													.findById(cSeb.getPredicateId());
											if (op.isPresent() && op.get().getTrueUsage() != null
													&& op.get().getFalseUsage() != null) {
												cModel.setTrueUsage(op.get().getTrueUsage());
												cModel.setFalseUsage(op.get().getFalseUsage());
												cModel.setPredicate(op.get());
												if (op.get().getIdentifier() != null)
													cModel.getPredicate().setIdentifier(c.getId());
											}
										}
									}
									componentStructureTreeModel.setData(cModel);
									if (childChildDt instanceof ComplexDatatype) {
										ComplexDatatype componentDatatype = (ComplexDatatype) childChildDt;
										if (componentDatatype.getComponents() != null
												&& componentDatatype.getComponents().size() > 0) {
											for (Component sc : componentDatatype.getComponents()) {
												Datatype childChildChildDt = this.findDatatype(sc.getRef().getId(),
														datatypesMap);
												if (childChildChildDt != null) {
													SubComponentStructureTreeModel subComponentStructureTreeModel = new SubComponentStructureTreeModel();
													SubComponentDisplayDataModel scModel = new SubComponentDisplayDataModel(
															sc);
													scModel.setViewScope(ViewScope.SEGMENT);
													scModel.setIdPath(f.getId() + "-" + c.getId() + "-" + sc.getId());
													scModel.setPath(f.getPosition() + "-" + c.getPosition() + "-"
															+ sc.getPosition());
													scModel.setDatatypeLabel(
															this.createDatatypeLabel(childChildChildDt));
													scModel.setConstantValue(sc.getConstantValue());
													StructureElementBinding childChildSeb = this
															.findStructureElementBindingByComponentIdFromStructureElementBinding(
																	childSeb, sc.getId());
													if (childChildSeb != null) {
														scModel.addBinding(this.createBindingDisplay(childChildSeb,
																segment.getId(), ViewScope.SEGMENT, 1, valueSetsMap));
														if (childChildSeb.getPredicateId() != null) {
															Optional<Predicate> op = this.predicateRepository
																	.findById(childChildSeb.getPredicateId());
															if (op.isPresent() && op.get().getTrueUsage() != null
																	&& op.get().getFalseUsage() != null) {
																scModel.setTrueUsage(op.get().getTrueUsage());
																scModel.setFalseUsage(op.get().getFalseUsage());
																scModel.setPredicate(op.get());
																if (op.get().getIdentifier() != null)
																	scModel.getPredicate()
																	.setIdentifier(scModel.getIdPath());
															}
														}
													}

													StructureElementBinding childCSeb = this
															.findStructureElementBindingByComponentIdFromStructureElementBinding(
																	cSeb, sc.getId());
													if (childCSeb != null) {
														scModel.addBinding(this.createBindingDisplay(childCSeb,
																childDt.getId(), ViewScope.DATATYPE, 2, valueSetsMap));
														if (childCSeb.getPredicateId() != null) {
															Optional<Predicate> op = this.predicateRepository
																	.findById(childCSeb.getPredicateId());
															if (op.isPresent() && op.get().getTrueUsage() != null
																	&& op.get().getFalseUsage() != null) {
																scModel.setTrueUsage(op.get().getTrueUsage());
																scModel.setFalseUsage(op.get().getFalseUsage());
																scModel.setPredicate(op.get());
																if (op.get().getIdentifier() != null)
																	scModel.getPredicate().setIdentifier(
																			c.getId() + "-" + sc.getId());
															}
														}
													}

													StructureElementBinding scSeb = this
															.findStructureElementBindingByComponentIdForDatatype(
																	childChildDt, sc.getId());
													if (scSeb != null) {
														scModel.addBinding(
																this.createBindingDisplay(scSeb, childChildDt.getId(),
																		ViewScope.DATATYPE, 3, valueSetsMap));
														if (scSeb.getPredicateId() != null) {
															Optional<Predicate> op = this.predicateRepository
																	.findById(scSeb.getPredicateId());
															if (op.isPresent() && op.get().getTrueUsage() != null
																	&& op.get().getFalseUsage() != null) {
																scModel.setTrueUsage(op.get().getTrueUsage());
																scModel.setFalseUsage(op.get().getFalseUsage());
																scModel.setPredicate(op.get());
																if (op.get().getIdentifier() != null)
																	scModel.getPredicate().setIdentifier(sc.getId());
															}
														}
													}

													subComponentStructureTreeModel.setData(scModel);
													componentStructureTreeModel
													.addSubComponent(subComponentStructureTreeModel);
												} else {
													// TODO need to handle exception
												}
											}

										}
									}
									fieldStructureTreeModel.addComponent(componentStructureTreeModel);
								} else {
									// TODO need to handle exception
								}
							}
						}
					}
					result.addField(fieldStructureTreeModel);
				} else {
					// TODO need to handle exception
				}

			}
		}
		result.setType(Type.SEGMENT);
		return result;
	}

	/**
	 * @param id
	 * @param datatypesMap
	 * @return
	 */
	private Datatype findDatatype(String id, HashMap<String, Datatype> datatypesMap) {
		Datatype dt = datatypesMap.get(id);
		if (dt == null) {
			dt = this.datatypeService.findById(id);
			datatypesMap.put(id, dt);
		}
		return dt;
	}

	/**
	 * @param valuesetBindings
	 * @return
	 */

	/**
	 * @param childDt
	 * @param id
	 * @return
	 */
	private StructureElementBinding findStructureElementBindingByComponentIdForDatatype(Datatype dt, String cid) {
		if (dt != null && dt.getBinding() != null && dt.getBinding().getChildren() != null) {
			for (StructureElementBinding seb : dt.getBinding().getChildren()) {
				if (seb.getElementId().equals(cid))
					return seb;
			}
		}
		return null;
	}

	/**
	 * @param fSeb
	 * @param id
	 * @return
	 */
	private StructureElementBinding findStructureElementBindingByComponentIdFromStructureElementBinding(
			StructureElementBinding seb, String cId) {
		if (seb != null && seb.getChildren() != null) {
			for (StructureElementBinding child : seb.getChildren()) {
				if (child.getElementId().equals(cId))
					return child;
			}
		}
		return null;
	}

	/**
	 * @param segment
	 * @param id
	 * @return
	 */
	private StructureElementBinding findStructureElementBindingByFieldIdForSegment(Segment segment, String fId) {
		if (segment != null && segment.getBinding() != null && segment.getBinding().getChildren() != null) {
			for (StructureElementBinding seb : segment.getBinding().getChildren()) {
				if (seb.getElementId().equals(fId))
					return seb;
			}
		}
		return null;
	}

	@Override
	public PreDef convertDomainToPredef(Segment segment) {
		if (segment != null) {

			PreDef result = new PreDef();
			result.setId(segment.getId());
			result.setScope(segment.getDomainInfo().getScope());
			result.setVersion(segment.getDomainInfo().getVersion());
			if (segment.getExt() != null) {
				result.setLabel(segment.getName() + segment.getExt());
			} else {
				result.setLabel(segment.getName());
			}
			result.setPreDef(segment.getPreDef());
			return result;
		}
		return null;
	}

	@Override
	public PostDef convertDomainToPostdef(Segment segment) {
		if (segment != null) {
			PostDef result = new PostDef();
			result.setId(segment.getId());
			result.setScope(segment.getDomainInfo().getScope());
			result.setVersion(segment.getDomainInfo().getVersion());
			if (segment.getExt() != null) {
				result.setLabel(segment.getName() + segment.getExt());
			} else {
				result.setLabel(segment.getName());
			}
			result.setPostDef(segment.getPreDef());
			return result;
		}
		return null;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see gov.nist.hit.hl7.igamt.segment.service.SegmentService#
	 * findDisplayFormatByScopeAndVersion(java. lang.String, java.lang.String)
	 */
	@Override
	public List<Segment> findDisplayFormatByScopeAndVersion(String scope, String version) {
		// TODO Auto-generated method stub

		Criteria where = Criteria.where("domainInfo.scope").is(scope);
		where.andOperator(Criteria.where("domainInfo.version").is(version));

		Query qry = Query.query(where);
		qry.fields().include("domainInfo");
		qry.fields().include("id");
		qry.fields().include("name");
		qry.fields().include("description");
		List<Segment> segments = mongoTemplate.find(qry, Segment.class);

		return segments;
	}

	private void validateField(Field f) throws ValidationException {
		if (f.getRef() == null || StringUtils.isEmpty(f.getRef().getId())) {
			throw new SegmentValidationException("Datatype not found");
		}
		Datatype d = datatypeService.findById(f.getRef().getId());
		if (d == null) {
			throw new SegmentValidationException("Datatype not found");
		}
		ValidationUtil.validateUsage(f.getUsage(), f.getMin());
		ValidationUtil.validateLength(f.getMinLength(), f.getMaxLength());
		ValidationUtil.validateCardinality(f.getMin(), f.getMax(), f.getUsage());
		ValidationUtil.validateConfLength(f.getConfLength());
	}

	/**
	 * TODO: anything more to validate ??
	 */
	@Override
	public void validate(SegmentDynamicMapping dynamicMapping) throws SegmentValidationException {
		if (dynamicMapping != null) {
		}
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * gov.nist.hit.hl7.igamt.segment.service.SegmentService#cloneSegment(java.util.
	 * HashMap, java.util.HashMap, gov.nist.hit.hl7.igamt.common.base.domain.Link,
	 * java.lang.String)
	 */
	@Override
	public Link cloneSegment(String key, HashMap<String, String> valuesetsMap, HashMap<String, String> datatypesMap,
			Link l, String username, Scope scope) {

		Segment obj = this.findById(l.getId());
		Segment elm = obj.clone();
		elm.getDomainInfo().setScope(scope);
		elm.setOrigin(elm.getFrom());
		Link newLink = l.clone(key);
		elm.setId(newLink.getId());
		newLink.setDomainInfo(elm.getDomainInfo());
		updateDependencies(elm, valuesetsMap, datatypesMap, username);
		this.save(elm);
		//		updateCoConstraint(elm, obj, valuesetsMap, datatypesMap, username);
		return newLink;

	}

	/**
	 * @param elm
	 * @param datatypesMap
	 * @param valuesetsMap
	 * @throws CoConstraintSaveException
	 */
	private void updateDependencies(Segment elm, HashMap<String, String> valuesetsMap,
			HashMap<String, String> datatypesMap, String username) {
		// TODO Auto-generated method stub

		for (Field f : elm.getChildren()) {
			if (f.getRef() != null) {
				if (f.getRef().getId() != null) {
					if (datatypesMap.containsKey(f.getRef().getId())) {
						f.getRef().setId(datatypesMap.get(f.getRef().getId()));
					}
				}
			}
		}
		updateBindings(elm.getBinding(), valuesetsMap);
	}

	private void updateCoConstraint(Segment elm, Segment old, HashMap<String, String> valuesetsMap,
			HashMap<String, String> datatypesMap, String username) {
		//		CoConstraintTable cc = coConstraintService.getCoConstraintForSegment(old.getId());
		//		if (cc != null) {
		//			CoConstraintTable cc_ = coConstraintService.clone(valuesetsMap, datatypesMap, elm.getId(), cc);
		//			coConstraintService.saveCoConstraintForSegment(elm.getId(), cc_, username);
		//		}

	}

	/**
	 * @param elm
	 * @param valuesetsMap
	 */
	private void updateBindings(ResourceBinding binding, HashMap<String, String> valuesetsMap) {
		// TODO Auto-generated method stub
		if (binding.getChildren() != null) {
			for (StructureElementBinding child : binding.getChildren()) {
				if (child.getValuesetBindings() != null) {
					for (ValuesetBinding vs : child.getValuesetBindings()) {
							if (vs.getValueSets() != null) {
								for(String s: vs.getValueSets()) {
									if (valuesetsMap.containsKey(s)) {
										if(!vs.getValueSets().contains(s)) {
											vs.getValueSets().add(valuesetsMap.get(s));
										}
									}
								}
							}
					}
				}
			}
		}
	}

	private void updateDynamicMapping(Segment elm, HashMap<String, String> datatypesMap,
			HashMap<String, String> valuesetsMap, String username) {

		DynamicMappingInfo dynmaicMapping = elm.getDynamicMappingInfo();

	}

	@Override
	public Segment saveDynamicMapping(SegmentDynamicMapping dynamicMapping)
			throws SegmentNotFoundException, SegmentValidationException {
		validate(dynamicMapping);
		Segment segment = findById(dynamicMapping.getId());
		if (segment == null) {
			throw new SegmentNotFoundException(dynamicMapping.getId());
		}
		segment.setDynamicMappingInfo(dynamicMapping.getDynamicMappingInfo());
		return save(segment);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see gov.nist.hit.hl7.igamt.segment.service.SegmentService#
	 * updateSegmentByChangeItems(gov.nist.hit. hl7.igamt.segment.domain.Segment,
	 * java.util.List)
	 */
	@Override
	public void applyChanges(Segment s, List<ChangeItemDomain> cItems, String documentId) throws IOException {
		Collections.sort(cItems);
		for (ChangeItemDomain item : cItems) {
			if (item.getPropertyType().equals(PropertyType.PREDEF)) {
				item.setOldPropertyValue(s.getPreDef());
				s.setPreDef((String) item.getPropertyValue());

			} else if (item.getPropertyType().equals(PropertyType.POSTDEF)) {
				item.setOldPropertyValue(s.getPostDef());
				s.setPostDef((String) item.getPropertyValue());
			} else if (item.getPropertyType().equals(PropertyType.AUTHORNOTES)) {
				item.setOldPropertyValue(s.getAuthorNotes());
				s.setAuthorNotes((String) item.getPropertyValue());
			} else if (item.getPropertyType().equals(PropertyType.USAGENOTES)) {
				item.setOldPropertyValue(s.getUsageNotes());
				s.setUsageNotes((String) item.getPropertyValue());
			} else if (item.getPropertyType().equals(PropertyType.EXT)) {
				item.setOldPropertyValue(s.getExt());
				s.setExt((String) item.getPropertyValue());
			}

			else if (item.getPropertyType().equals(PropertyType.USAGE)) {
				Field f = this.findFieldById(s, item.getLocation());
				if (f != null) {
					item.setOldPropertyValue(f.getUsage());
					f.setUsage(Usage.valueOf((String) item.getPropertyValue()));
				}
			} else if (item.getPropertyType().equals(PropertyType.CARDINALITYMIN)) {
				Field f = this.findFieldById(s, item.getLocation());
				if (f != null) {
					item.setOldPropertyValue(f.getMin());
					if (item.getPropertyValue() == null) {
						f.setMin(0);
					} else {
						f.setMin((Integer) item.getPropertyValue());
					}
				}
			} else if (item.getPropertyType().equals(PropertyType.CARDINALITYMAX)) {
				Field f = this.findFieldById(s, item.getLocation());
				if (f != null) {
					item.setOldPropertyValue(f.getMax());
					if (item.getPropertyValue() == null) {
						f.setMax("NA");
					} else {
						f.setMax((String) item.getPropertyValue());
					}
				}
			} else if (item.getPropertyType().equals(PropertyType.LENGTHMIN)) {
				Field f = this.findFieldById(s, item.getLocation());
				if (f != null) {
					item.setOldPropertyValue(f.getMinLength());
					if (item.getPropertyValue() == null) {
						f.setMinLength("NA");
					} else {
						f.setMinLength((String) item.getPropertyValue());
					}

				}
			} else if (item.getPropertyType().equals(PropertyType.LENGTHMAX)) {
				Field f = this.findFieldById(s, item.getLocation());
				if (f != null) {
					item.setOldPropertyValue(f.getMaxLength());
					if (item.getPropertyValue() == null) {
						f.setMaxLength("NA");
					} else {
						f.setMaxLength((String) item.getPropertyValue());
					}
				}
			} else if (item.getPropertyType().equals(PropertyType.CONFLENGTH)) {
				Field f = this.findFieldById(s, item.getLocation());
				if (f != null) {
					item.setOldPropertyValue(f.getConfLength());
					if (item.getPropertyValue() == null) {
						f.setConfLength("NA");
					} else {
						f.setConfLength((String) item.getPropertyValue());
					}
				}
			} else if (item.getPropertyType().equals(PropertyType.DATATYPE)) {
				Field f = this.findFieldById(s, item.getLocation());
				if (f != null) {
					item.setOldPropertyValue(f.getRef());
					ObjectMapper mapper = new ObjectMapper();
					String jsonInString = mapper.writeValueAsString(item.getPropertyValue());
					f.setRef(mapper.readValue(jsonInString, Ref.class));
				}
			} else if (item.getPropertyType().equals(PropertyType.VALUESET)) {
				ObjectMapper mapper = new ObjectMapper();
				String jsonInString = mapper.writeValueAsString(item.getPropertyValue());
				StructureElementBinding seb = this.findAndCreateStructureElementBindingByIdPath(s, item.getLocation());
				item.setOldPropertyValue(seb.getValuesetBindings());
				seb.setValuesetBindings(this.convertDisplayValuesetBinding(new HashSet<DisplayValuesetBinding>(
						Arrays.asList(mapper.readValue(jsonInString, DisplayValuesetBinding[].class)))));
			} else if (item.getPropertyType().equals(PropertyType.SINGLECODE)) {
				ObjectMapper mapper = new ObjectMapper();
				String jsonInString = mapper.writeValueAsString(item.getPropertyValue());
				StructureElementBinding seb = this.findAndCreateStructureElementBindingByIdPath(s, item.getLocation());
				item.setOldPropertyValue(seb.getExternalSingleCode());
				seb.setExternalSingleCode(mapper.readValue(jsonInString, ExternalSingleCode.class));
			} else if (item.getPropertyType().equals(PropertyType.CONSTANTVALUE)) {
				Field f = this.findFieldById(s, item.getLocation());
				if (f != null) {
					item.setOldPropertyValue(f.getConstantValue());
					if (item.getPropertyValue() == null) {
						f.setConstantValue(null);
					} else {
						f.setConstantValue((String) item.getPropertyValue());
					}
				}
			} else if (item.getPropertyType().equals(PropertyType.DEFINITIONTEXT)) {
				Field f = this.findFieldById(s, item.getLocation());
				if (f != null) {
					item.setOldPropertyValue(f.getText());
					if (item.getPropertyValue() == null) {
						f.setText(null);
					} else {
						f.setText((String) item.getPropertyValue());
					}
				}
			} else if (item.getPropertyType().equals(PropertyType.COMMENT)) {
				ObjectMapper mapper = new ObjectMapper();
				String jsonInString = mapper.writeValueAsString(item.getPropertyValue());
				Field f = this.findFieldById(s, item.getLocation());
				if (f != null) {
					item.setOldPropertyValue(f.getComments());
					f.setComments(new HashSet<Comment>(Arrays.asList(mapper.readValue(jsonInString, Comment[].class))));
				}
			} else if (item.getPropertyType().equals(PropertyType.STATEMENT)) {
				ObjectMapper mapper = new ObjectMapper();
				String jsonInString = mapper.writeValueAsString(item.getPropertyValue());
				if (item.getChangeType().equals(ChangeType.ADD)) {
					ConformanceStatement cs = mapper.readValue(jsonInString, ConformanceStatement.class);
					cs.addSourceId(s.getId());
					cs.setStructureId(s.getName());
					cs.setLevel(Level.SEGMENT);
					cs.setIgDocumentId(documentId);
					cs = this.conformanceStatementRepository.save(cs);
					s.getBinding().addConformanceStatement(cs.getId());
				} else if (item.getChangeType().equals(ChangeType.DELETE)) {
					item.setOldPropertyValue(item.getLocation());
					this.deleteConformanceStatementById(s, item.getLocation());
				} else if (item.getChangeType().equals(ChangeType.UPDATE)) {
					ConformanceStatement cs = mapper.readValue(jsonInString, ConformanceStatement.class);
					if (cs.getId() != null) {
						item.setOldPropertyValue(this.conformanceStatementRepository.findById(cs.getId()));
					}
					cs.addSourceId(s.getId());
					cs.setStructureId(s.getName());
					cs.setLevel(Level.SEGMENT);
					cs.setIgDocumentId(documentId);
					cs = this.conformanceStatementRepository.save(cs);
				}
			} else if (item.getPropertyType().equals(PropertyType.PREDICATE)) {
				ObjectMapper mapper = new ObjectMapper();
				String jsonInString = mapper.writeValueAsString(item.getPropertyValue());
				StructureElementBinding seb = this.findAndCreateStructureElementBindingByIdPath(s, item.getLocation());
				if (item.getChangeType().equals(ChangeType.ADD)) {
					Predicate cp = mapper.readValue(jsonInString, Predicate.class);
					cp.addSourceId(s.getId());
					cp.setStructureId(s.getName());
					cp.setLevel(Level.SEGMENT);
					cp.setIgDocumentId(documentId);
					cp = this.predicateRepository.save(cp);
					seb.setPredicateId(cp.getId());
				} else if (item.getChangeType().equals(ChangeType.DELETE)) {
					item.setOldPropertyValue(item.getLocation());
					if (seb.getPredicateId() != null) {
						Optional<Predicate> op = this.predicateRepository.findById(seb.getPredicateId());
						if (op.isPresent()) {
							Predicate cp = op.get();
							cp.removeSourceId(s.getId());
							this.predicateRepository.save(cp);
						}
						item.setOldPropertyValue(seb.getPredicateId());
						seb.setPredicateId(null);
					}

				} else if (item.getChangeType().equals(ChangeType.UPDATE)) {
					Predicate cp = mapper.readValue(jsonInString, Predicate.class);
					if (cp.getId() != null) {
						item.setOldPropertyValue(this.predicateRepository.findById(cp.getId()));
					}
					cp.addSourceId(s.getId());
					cp.setStructureId(s.getName());
					cp.setLevel(Level.SEGMENT);
					cp.setIgDocumentId(documentId);
					cp = this.predicateRepository.save(cp);
				}
			}
		}
		s.setBinding(this.makeLocationInfo(s));
		this.save(s);
	}

	/**
	 * @param s
	 * @param location
	 * @return
	 */
	private String deleteConformanceStatementById(Segment s, String location) {
		String toBeDeleted = null;
		for (String id : s.getBinding().getConformanceStatementIds()) {
			ConformanceStatement cs = this.conformanceStatementRepository.findById(id).get();
			if (cs.getIdentifier().equals(location)) {
				toBeDeleted = id;
				if (cs.getSourceIds() != null)
					cs.getSourceIds().remove(s.getId());
				this.conformanceStatementRepository.save(cs);
			}
		}

		if (toBeDeleted != null)
			s.getBinding().getConformanceStatementIds().remove(toBeDeleted);
		return toBeDeleted;
	}

	/**
	 * @param hashSet
	 * @return
	 */
	private Set<ValuesetBinding> convertDisplayValuesetBinding(
			HashSet<DisplayValuesetBinding> displayValuesetBindings) {
//		if (displayValuesetBindings != null) {
//			Set<ValuesetBinding> result = new HashSet<ValuesetBinding>();
//			for (DisplayValuesetBinding dvb : displayValuesetBindings) {
//				ValuesetBinding vb = new ValuesetBinding();
//				vb.setStrength(dvb.getStrength());
//				vb.setValuesetId(dvb.getValuesetId());
//				vb.setValuesetLocations(dvb.getValuesetLocations());
//				result.add(vb);
//			}
//			return result;
//		}
		return null;
	}

	/**
	 * @param sebs
	 * @param location
	 * @return
	 */
	private StructureElementBinding findAndCreateStructureElementBindingByIdPath(Segment s, String location) {
		if (s.getBinding() == null) {
			ResourceBinding binding = new ResourceBinding();
			binding.setElementId(s.getId());
			s.setBinding(binding);
		}
		return this.findAndCreateStructureElementBindingByIdPath(s.getBinding(), location);
	}

	/**
	 * @param binding
	 * @param location
	 * @return
	 */
	private StructureElementBinding findAndCreateStructureElementBindingByIdPath(ResourceBinding binding,
			String location) {
		if (binding.getChildren() == null) {
			if (location.contains("-")) {
				StructureElementBinding seb = new StructureElementBinding();
				seb.setElementId(location.split("\\-")[0]);
				binding.addChild(seb);
				return this.findAndCreateStructureElementBindingByIdPath(seb,
						location.replace(location.split("\\-")[0] + "-", ""));
			} else {
				StructureElementBinding seb = new StructureElementBinding();
				seb.setElementId(location);
				binding.addChild(seb);
				return seb;
			}
		} else {
			if (location.contains("-")) {
				for (StructureElementBinding seb : binding.getChildren()) {
					if (seb.getElementId().equals(location.split("\\-")[0]))
						return this.findAndCreateStructureElementBindingByIdPath(seb,
								location.replace(location.split("\\-")[0] + "-", ""));
				}
				StructureElementBinding seb = new StructureElementBinding();
				seb.setElementId(location.split("\\-")[0]);
				binding.addChild(seb);
				return this.findAndCreateStructureElementBindingByIdPath(seb,
						location.replace(location.split("\\-")[0] + "-", ""));
			} else {
				for (StructureElementBinding seb : binding.getChildren()) {
					if (seb.getElementId().equals(location))
						return seb;
				}
				StructureElementBinding seb = new StructureElementBinding();
				seb.setElementId(location);
				binding.addChild(seb);
				return seb;
			}
		}
	}

	/**
	 * @param seb
	 * @param replace
	 * @return
	 */
	private StructureElementBinding findAndCreateStructureElementBindingByIdPath(StructureElementBinding binding,
			String location) {
		if (binding.getChildren() == null) {
			if (location.contains("-")) {
				StructureElementBinding seb = new StructureElementBinding();
				seb.setElementId(location.split("\\-")[0]);
				binding.addChild(seb);
				return this.findAndCreateStructureElementBindingByIdPath(seb,
						location.replace(location.split("\\-")[0] + "-", ""));
			} else {
				StructureElementBinding seb = new StructureElementBinding();
				seb.setElementId(location);
				binding.addChild(seb);
				return seb;
			}
		} else {
			if (location.contains("-")) {
				for (StructureElementBinding seb : binding.getChildren()) {
					if (seb.getElementId().equals(location.split("\\-")[0]))
						return this.findAndCreateStructureElementBindingByIdPath(seb,
								location.replace(location.split("\\-")[0] + "-", ""));
				}
				StructureElementBinding seb = new StructureElementBinding();
				seb.setElementId(location.split("\\-")[0]);
				binding.addChild(seb);
				return this.findAndCreateStructureElementBindingByIdPath(seb,
						location.replace(location.split("\\-")[0] + "-", ""));
			} else {
				for (StructureElementBinding seb : binding.getChildren()) {
					if (seb.getElementId().equals(location))
						return seb;
				}
				StructureElementBinding seb = new StructureElementBinding();
				seb.setElementId(location);
				binding.addChild(seb);
				return seb;
			}
		}
	}

	/**
	 * @param s
	 * @param location
	 * @return
	 */
	private Field findFieldById(Segment s, String location) {
		for (Field f : s.getChildren()) {
			if (f.getId().equals(location))
				return f;
		}
		return null;
	}

	private BindingDisplay createBindingDisplay(StructureElementBinding seb, String sourceId, ViewScope sourceType,
			int priority, HashMap<String, Valueset> valueSetsMap) {
		BindingDisplay bindingDisplay = new BindingDisplay();
		
		return bindingDisplay;
	}

	private DatatypeLabel createDatatypeLabel(Datatype dt) {
		DatatypeLabel label = new DatatypeLabel();
		label.setDomainInfo(dt.getDomainInfo());
		label.setExt(dt.getExt());
		label.setId(dt.getId());
		label.setLabel(dt.getLabel());
		if (dt instanceof ComplexDatatype)
			label.setLeaf(false);
		else
			label.setLeaf(true);
		label.setName(dt.getName());

		return label;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * gov.nist.hit.hl7.igamt.segment.service.SegmentService#convertSegmentStructure
	 * (gov.nist.hit.hl7. igamt.segment.domain.Segment, java.lang.String,
	 * java.lang.String, java.lang.String)
	 */
	@Override
	public Set<?> convertSegmentStructurForMessage(Segment segment, String idPath, String path) {
		HashMap<String, Valueset> valueSetsMap = new HashMap<String, Valueset>();
		HashMap<String, Datatype> datatypesMap = new HashMap<String, Datatype>();

		if (segment.getChildren() != null && segment.getChildren().size() > 0) {
			Set<FieldStructureTreeModel> result = new HashSet<FieldStructureTreeModel>();
			for (Field f : segment.getChildren()) {
				Datatype childDt = this.findDatatype(f.getRef().getId(), datatypesMap);
				if (childDt != null) {
					FieldStructureTreeModel fieldStructureTreeModel = new FieldStructureTreeModel();
					FieldDisplayDataModel fModel = new FieldDisplayDataModel(f);
					fModel.setViewScope(ViewScope.CONFORMANCEPROFILE);
					fModel.setIdPath(idPath + "-" + f.getId());
					fModel.setPath(path + "-" + f.getPosition());
					fModel.setDatatypeLabel(this.createDatatypeLabel(childDt));
					StructureElementBinding fSeb = this.findStructureElementBindingByFieldIdForSegment(segment,
							f.getId());
					if (fSeb != null) {
						fModel.addBinding(
								this.createBindingDisplay(fSeb, segment.getId(), ViewScope.SEGMENT, 2, valueSetsMap));
						if (fSeb.getPredicateId() != null) {
							Optional<Predicate> op = this.predicateRepository.findById(fSeb.getPredicateId());
							if (op.isPresent() && op.get().getTrueUsage() != null && op.get().getFalseUsage() != null) {
								fModel.setTrueUsage(op.get().getTrueUsage());
								fModel.setFalseUsage(op.get().getFalseUsage());
								fModel.setPredicate(op.get());
								if (op.get().getIdentifier() != null)
									fModel.getPredicate().setIdentifier(f.getId());
							}
						}
					}
					fieldStructureTreeModel.setData(fModel);
					if (childDt instanceof ComplexDatatype) {
						ComplexDatatype fieldDatatype = (ComplexDatatype) childDt;
						if (fieldDatatype.getComponents() != null && fieldDatatype.getComponents().size() > 0) {
							for (Component c : fieldDatatype.getComponents()) {
								Datatype childChildDt = this.findDatatype(c.getRef().getId(), datatypesMap);
								if (childChildDt != null) {
									ComponentStructureTreeModel componentStructureTreeModel = new ComponentStructureTreeModel();
									ComponentDisplayDataModel cModel = new ComponentDisplayDataModel(c);
									cModel.setViewScope(ViewScope.CONFORMANCEPROFILE);
									cModel.setIdPath(idPath + "-" + f.getId() + "-" + c.getId());
									cModel.setPath(path + "-" + f.getPosition() + "-" + c.getPosition());
									cModel.setDatatypeLabel(this.createDatatypeLabel(childChildDt));
									StructureElementBinding childSeb = this
											.findStructureElementBindingByComponentIdFromStructureElementBinding(fSeb,
													c.getId());
									if (childSeb != null) {
										cModel.addBinding(this.createBindingDisplay(childSeb, segment.getId(),
												ViewScope.SEGMENT, 2, valueSetsMap));
										if (childSeb.getPredicateId() != null) {
											Optional<Predicate> op = this.predicateRepository
													.findById(childSeb.getPredicateId());
											if (op.isPresent() && op.get().getTrueUsage() != null
													&& op.get().getFalseUsage() != null) {
												cModel.setTrueUsage(op.get().getTrueUsage());
												cModel.setFalseUsage(op.get().getFalseUsage());
												cModel.setPredicate(op.get());
												if (op.get().getIdentifier() != null)
													cModel.getPredicate().setIdentifier(f.getId() + "-" + c.getId());
											}
										}
									}
									StructureElementBinding cSeb = this
											.findStructureElementBindingByComponentIdForDatatype(childDt, c.getId());
									if (cSeb != null) {
										cModel.addBinding(this.createBindingDisplay(cSeb, childDt.getId(),
												ViewScope.DATATYPE, 3, valueSetsMap));
										if (cSeb.getPredicateId() != null) {
											Optional<Predicate> op = this.predicateRepository
													.findById(cSeb.getPredicateId());
											if (op.isPresent() && op.get().getTrueUsage() != null
													&& op.get().getFalseUsage() != null) {
												cModel.setTrueUsage(op.get().getTrueUsage());
												cModel.setFalseUsage(op.get().getFalseUsage());
												cModel.setPredicate(op.get());
												if (op.get().getIdentifier() != null)
													cModel.getPredicate().setIdentifier(c.getId());
											}
										}
									}
									componentStructureTreeModel.setData(cModel);
									if (childChildDt instanceof ComplexDatatype) {
										ComplexDatatype componentDatatype = (ComplexDatatype) childChildDt;
										if (componentDatatype.getComponents() != null
												&& componentDatatype.getComponents().size() > 0) {
											for (Component sc : componentDatatype.getComponents()) {
												Datatype childChildChildDt = this.findDatatype(sc.getRef().getId(),
														datatypesMap);
												if (childChildChildDt != null) {
													SubComponentStructureTreeModel subComponentStructureTreeModel = new SubComponentStructureTreeModel();
													SubComponentDisplayDataModel scModel = new SubComponentDisplayDataModel(
															sc);
													scModel.setViewScope(ViewScope.CONFORMANCEPROFILE);
													scModel.setIdPath(idPath + "-" + f.getId() + "-" + c.getId() + "-"
															+ sc.getId());
													scModel.setPath(path + "-" + f.getPosition() + "-" + c.getPosition()
													+ "-" + sc.getPosition());
													scModel.setDatatypeLabel(
															this.createDatatypeLabel(childChildChildDt));
													StructureElementBinding childChildSeb = this
															.findStructureElementBindingByComponentIdFromStructureElementBinding(
																	childSeb, sc.getId());
													if (childChildSeb != null) {
														scModel.addBinding(this.createBindingDisplay(childChildSeb,
																segment.getId(), ViewScope.SEGMENT, 2, valueSetsMap));
														if (childChildSeb.getPredicateId() != null) {
															Optional<Predicate> op = this.predicateRepository
																	.findById(childChildSeb.getPredicateId());
															if (op.isPresent() && op.get().getTrueUsage() != null
																	&& op.get().getFalseUsage() != null) {
																scModel.setTrueUsage(op.get().getTrueUsage());
																scModel.setFalseUsage(op.get().getFalseUsage());
																scModel.setPredicate(op.get());
																if (op.get().getIdentifier() != null)
																	scModel.getPredicate().setIdentifier(f.getId() + "-"
																			+ c.getId() + "-" + sc.getId());
															}
														}
													}
													StructureElementBinding childCSeb = this
															.findStructureElementBindingByComponentIdFromStructureElementBinding(
																	cSeb, sc.getId());
													if (childCSeb != null) {
														scModel.addBinding(this.createBindingDisplay(childCSeb,
																childDt.getId(), ViewScope.DATATYPE, 3, valueSetsMap));
														if (childCSeb.getPredicateId() != null) {
															Optional<Predicate> op = this.predicateRepository
																	.findById(childCSeb.getPredicateId());
															if (op.isPresent() && op.get().getTrueUsage() != null
																	&& op.get().getFalseUsage() != null) {
																scModel.setTrueUsage(op.get().getTrueUsage());
																scModel.setFalseUsage(op.get().getFalseUsage());
																scModel.setPredicate(op.get());
																if (op.get().getIdentifier() != null)
																	scModel.getPredicate().setIdentifier(
																			c.getId() + "-" + sc.getId());
															}
														}
													}
													StructureElementBinding scSeb = this
															.findStructureElementBindingByComponentIdForDatatype(
																	childChildDt, sc.getId());
													if (scSeb != null) {
														scModel.addBinding(
																this.createBindingDisplay(scSeb, childChildDt.getId(),
																		ViewScope.DATATYPE, 4, valueSetsMap));
														if (scSeb.getPredicateId() != null) {
															Optional<Predicate> op = this.predicateRepository
																	.findById(scSeb.getPredicateId());
															if (op.isPresent() && op.get().getTrueUsage() != null
																	&& op.get().getFalseUsage() != null) {
																scModel.setTrueUsage(op.get().getTrueUsage());
																scModel.setFalseUsage(op.get().getFalseUsage());
																scModel.setPredicate(op.get());
																if (op.get().getIdentifier() != null)
																	scModel.getPredicate().setIdentifier(sc.getId());
															}
														}
													}
													subComponentStructureTreeModel.setData(scModel);
													componentStructureTreeModel
													.addSubComponent(subComponentStructureTreeModel);
												} else {
													// TODO need to handle exception
												}
											}

										}
									}
									fieldStructureTreeModel.addComponent(componentStructureTreeModel);
								} else {
									// TODO need to handle exception
								}
							}
						}
					}
					result.add(fieldStructureTreeModel);
				} else {
					// TODO need to handle exception
				}
			}
			return result;
		} else {
			// TODO need to handle exception
		}
		return null;
	}

	@Override
	public List<SegmentSelectItemGroup> getSegmentFlavorsOptions(Set<String> ids, Segment s, String scope) {
		List<SegmentSelectItemGroup> ret = new ArrayList<SegmentSelectItemGroup>();
		SegmentSelectItemGroup flavros = new SegmentSelectItemGroup();
		flavros.setLabel("Flavors");
		List<Segment> segFlavors = this.findFlavors(ids, s.getId(), s.getName());

		if (segFlavors != null && !segFlavors.isEmpty()) {
			segFlavors.forEach(d -> flavros.getItems().add(createItem(d)));
			ret.add(flavros);
		}
		List<Segment> others = this.findNonFlavor(ids, s.getId(), s.getName());
		if (others != null && !others.isEmpty()) {
			SegmentSelectItemGroup othersgroup = new SegmentSelectItemGroup();
			othersgroup.setLabel("others");
			others.forEach(d -> othersgroup.getItems().add(createItem(d)));
			ret.add(othersgroup);
		}
		return ret;
	}

	private Set<ObjectId> convertIds(Set<String> ids) {
		// TODO Auto-generated method stub
		Set<ObjectId> results = new HashSet<ObjectId>();
		ids.forEach(id -> results.add(new ObjectId(id)));
		return results;
	}

	private SegmentSelectItem createItem(Segment seg) {
		// TODO Auto-generated method stub
		SegmentSelectItem item = new SegmentSelectItem(seg.getLabel(), this.createSegmentLabel(seg));
		return item;

	}

	private SegmentLabel createSegmentLabel(Segment seg) {
		SegmentLabel label = new SegmentLabel();
		label.setDomainInfo(seg.getDomainInfo());
		label.setExt(seg.getExt());
		label.setId(seg.getId());
		label.setLabel(seg.getLabel());
		label.setName(seg.getName());

		return label;
	}

	@Override
	public List<Segment> findFlavors(Set<String> ids, String id, String name) {
		Query qry = new Query();
		qry.addCriteria(Criteria.where("_id").in(convertIds(ids)));
		qry.addCriteria(Criteria.where("name").is(name));

		qry.fields().include("domainInfo");
		qry.fields().include("id");
		qry.fields().include("name");
		qry.fields().include("description");
		qry.fields().include("ext");
		qry.with(new Sort(Sort.Direction.ASC, "ext"));

		List<Segment> segments = mongoTemplate.find(qry, Segment.class);
		return segments;
	}

	@Override
	public List<Segment> findNonFlavor(Set<String> ids, String id, String name) {
		Query qry = new Query();
		qry.addCriteria(Criteria.where("_id").in(convertIds(ids)));
		qry.addCriteria(Criteria.where("name").ne(name));
		qry.with(new Sort(Sort.Direction.ASC, "name"));

		qry.fields().include("domainInfo");
		qry.fields().include("id");
		qry.fields().include("name");
		qry.fields().include("description");
		qry.fields().include("ext");
		qry.fields().include("_class");

		List<Segment> segments = mongoTemplate.find(qry, Segment.class);
		return segments;
	}

	@Override
	public Set<RelationShip> collectDependencies(Segment elm) {

		Set<RelationShip> used = new HashSet<RelationShip>();
		HashMap<String, Usage> usageMap = new HashMap<String, Usage>();

		for (Field f : elm.getChildren()) {
			if (f.getRef() != null && f.getRef().getId() != null) {

				RelationShip rel = new RelationShip(new ReferenceIndentifier(f.getRef().getId(), Type.DATATYPE),
						new ReferenceIndentifier(elm.getId(), Type.SEGMENT),

						new ReferenceLocation(Type.FIELD, f.getPosition() + "", f.getName()));
				rel.setUsage(f.getUsage());
				usageMap.put(f.getId(), f.getUsage());
				used.add(rel);
			}
		}
		if (elm.getDynamicMappingInfo() != null) {
			collectDynamicMappingDependencies(elm.getId(), elm.getDynamicMappingInfo(), used);
		}
		if (elm.getBinding() != null) {
			Set<RelationShip> bindingDependencies = bindingService.collectDependencies(
					new ReferenceIndentifier(elm.getId(), Type.SEGMENT), elm.getBinding(), usageMap);
			used.addAll(bindingDependencies);

		}
		return used;
	}

	private void collectDynamicMappingDependencies(String id, DynamicMappingInfo dynamicMappingInfo,
			Set<RelationShip> used) {
		// TODO Auto-generated method stub
		if (dynamicMappingInfo.getItems() != null) {
			for (DynamicMappingItem item : dynamicMappingInfo.getItems()) {
				if (item.getDatatypeId() != null) {
					RelationShip rel = new RelationShip(new ReferenceIndentifier(item.getDatatypeId(), Type.DATATYPE),
							new ReferenceIndentifier(id, Type.SEGMENT),

							new ReferenceLocation(Type.DYNAMICMAPPING, null , null));
					used.add(rel);
				}
			}
		}
	}

	@Override
	public void collectAssoicatedConformanceStatements(Segment segment,
			HashMap<String, ConformanceStatementsContainer> associatedConformanceStatementMap) {
		if (segment.getDomainInfo().getScope().equals(Scope.USER)) {
			for (Field f : segment.getChildren()) {
				Datatype dt = this.datatypeService.findById(f.getRef().getId());
				if (dt.getDomainInfo().getScope().equals(Scope.USER)) {
					if (dt.getBinding() != null && dt.getBinding().getConformanceStatementIds() != null
							&& dt.getBinding().getConformanceStatementIds().size() > 0) {
						if (!associatedConformanceStatementMap.containsKey(dt.getLabel()))
							associatedConformanceStatementMap.put(dt.getLabel(),
									new ConformanceStatementsContainer(
											this.collectCS(dt.getBinding().getConformanceStatementIds()), Type.DATATYPE,
											dt.getId(), dt.getLabel()));
						this.datatypeService.collectAssoicatedConformanceStatements(dt,
								associatedConformanceStatementMap);
					}
				}
			}
		}
	}

	private Set<ConformanceStatement> collectCS(Set<String> conformanceStatementIds) {
		Set<ConformanceStatement> result = new HashSet<ConformanceStatement>();
		if (conformanceStatementIds != null) {
			for (String id : conformanceStatementIds) {
				Optional<ConformanceStatement> cs = this.conformanceStatementRepository.findById(id);
				if (cs.isPresent())
					result.add(cs.get());
			}
		}

		return result;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * gov.nist.hit.hl7.igamt.segment.service.SegmentService#makeLocationInfo(gov.
	 * nist.hit.hl7.igamt. segment.domain.Segment)
	 */
	@Override
	public ResourceBinding makeLocationInfo(Segment s) {
		if (s.getBinding() != null) {
			for (StructureElementBinding seb : s.getBinding().getChildren()) {
				seb.setLocationInfo(makeLocationInfoForField(s, seb));
			}
			return s.getBinding();
		}
		return null;
	}

	/**
	 * @param s
	 * @param seb
	 * @return
	 */
	@Override
	public LocationInfo makeLocationInfoForField(Segment s, StructureElementBinding seb) {
		if (s != null && s.getChildren() != null) {
			for (Field f : s.getChildren()) {
				if (f.getId().equals(seb.getElementId())) {
					if (seb.getChildren() != null) {
						for (StructureElementBinding childSeb : seb.getChildren()) {
							Datatype childDT = this.datatypeService.findById(f.getRef().getId());
							if (childDT instanceof ComplexDatatype)
								childSeb.setLocationInfo(this.datatypeService
										.makeLocationInfoForComponent((ComplexDatatype) childDT, childSeb));
						}
					}
					return new LocationInfo(LocationType.FIELD, f.getPosition(), f.getName());
				}
			}
		}
		return null;
	}

	@Override
	public List<Segment> findByIdIn(Set<String> ids) {
		// TODO Auto-generated method stub
		return segmentRepository.findByIdIn(ids);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see gov.nist.hit.hl7.igamt.segment.service.SegmentService#
	 * collectAvaliableConformanceStatements(java.lang.String, java.lang.String,
	 * java.lang.String)
	 */
	@Override
	public Set<ConformanceStatement> collectAvaliableConformanceStatements(String documentId, String segmentId,
			String segmentName) {
		Set<ConformanceStatement> found = this.conformanceStatementRepository
				.findByIgDocumentIdAndStructureId(documentId, segmentName);
		Set<ConformanceStatement> result = new HashSet<ConformanceStatement>();
		for (ConformanceStatement cs : found) {
			if (!cs.getSourceIds().contains(segmentId))
				result.add(cs);
		}
		return result;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * gov.nist.hit.hl7.igamt.segment.service.SegmentService#findDisplayPredicates(
	 * java.lang.String, java.lang.String)
	 */
	@Override
	public Set<DisplayPredicate> findDisplayPredicates(String sourceId, String documentId) {
		Set<Predicate> predicates = this.predicateRepository.findByIgDocumentIdAndLevel(documentId, Level.SEGMENT);
		Set<DisplayPredicate> result = new HashSet<DisplayPredicate>();
		if (predicates != null) {
			for (Predicate p : predicates) {
				if (p.getSourceIds() != null && p.getSourceIds().contains(sourceId)) {
					Optional<Segment> o = this.segmentRepository.findById(sourceId);
					if (o.isPresent()) {
						DisplayPredicate dp = new DisplayPredicate();
						dp.setPredicate(p);
						Segment s = o.get();
						if (s.getBinding() != null && s.getBinding().getChildren() != null) {
							this.markLocation(dp, s.getBinding().getChildren(), s.getName(), p.getId());
						}
						result.add(dp);
					}
				}
			}
		}
		return result;
	}

	private void markLocation(DisplayPredicate dp, Set<StructureElementBinding> children, String location, String pid) {
		for (StructureElementBinding seb : children) {
			if (seb.getPredicateId() != null && seb.getPredicateId().equals(pid)) {
				if (seb.getLocationInfo().getType().equals(LocationType.FIELD)) {
					dp.setLocation(location + "-" + seb.getLocationInfo().getPosition() + "("
							+ seb.getLocationInfo().getName() + ")");
				} else {
					dp.setLocation(location + "." + seb.getLocationInfo().getPosition() + "("
							+ seb.getLocationInfo().getName() + ")");
				}

			} else {
				if (seb.getChildren() != null) {
					if (seb.getLocationInfo().getType().equals(LocationType.FIELD)) {
						this.markLocation(dp, seb.getChildren(), location + "-" + seb.getLocationInfo().getPosition(),
								pid);
					} else {
						this.markLocation(dp, seb.getChildren(), location + "." + seb.getLocationInfo().getPosition(),
								pid);
					}
				}
			}
		}
	}

	@Override
	public void collectResources(Segment seg, HashMap<String, Resource> used) {
		// TODO Auto-generated method stub
		Set<String> usedDatatypesIds = this.getSegmentDatatypesDependenciesIds(seg, used);
		List<Datatype> usedDatatypes = this.datatypeService.findByIdIn(usedDatatypesIds);
		for (Datatype d : usedDatatypes) {
			used.put(d.getId(), d);
			this.datatypeService.collectResources(d, used);
		}
	}

	private Set<String> getSegmentDatatypesDependenciesIds(Segment segment, HashMap<String, Resource> used) {
		// TODO Auto-generated method stub
		Set<String> ids = new HashSet<String>();
		if (segment.getChildren() != null) {

			for (Field f : segment.getChildren()) {
				if (f.getRef() != null && f.getRef().getId() != null) {
					if (used == null || !used.containsKey(f.getRef().getId()))
						ids.add(f.getRef().getId());
				}
			}
		}
		return ids;
	}

	@Override
	public Set<Resource> getDependencies(Segment segment) {
		// TODO Auto-generated method stub
		Set<Resource> ret = new HashSet<Resource>();
		ret.add(segment);
		HashMap<String, Resource> usedDatatypes = new HashMap<String, Resource>();
		this.collectResources(segment, usedDatatypes);
		ret.addAll(usedDatatypes.values());
		return ret;
	}

}
