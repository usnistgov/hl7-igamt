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
package gov.nist.hit.hl7.igamt.datatype.service.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import gov.nist.hit.hl7.igamt.common.base.domain.*;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.*;
import gov.nist.hit.hl7.igamt.common.change.entity.exception.InvalidChangeTargetLocation;
import org.apache.commons.lang3.StringUtils;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;
import gov.nist.hit.hl7.igamt.common.base.exception.ValidationException;
import gov.nist.hit.hl7.igamt.common.base.model.SectionType;
import gov.nist.hit.hl7.igamt.common.base.service.CommonService;
import gov.nist.hit.hl7.igamt.common.base.service.InMemoryDomainExtentionService;
import gov.nist.hit.hl7.igamt.common.base.util.CloneMode;
import gov.nist.hit.hl7.igamt.common.base.util.ReferenceIndentifier;
import gov.nist.hit.hl7.igamt.common.base.util.ReferenceLocation;
import gov.nist.hit.hl7.igamt.common.base.util.RelationShip;
import gov.nist.hit.hl7.igamt.common.base.util.ValidationUtil;
import gov.nist.hit.hl7.igamt.common.binding.domain.InternalSingleCode;
import gov.nist.hit.hl7.igamt.common.binding.domain.LocationInfo;
import gov.nist.hit.hl7.igamt.common.binding.domain.LocationType;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;
import gov.nist.hit.hl7.igamt.common.binding.service.BindingService;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatement;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatementsContainer;
import gov.nist.hit.hl7.igamt.constraints.domain.DisplayPredicate;
import gov.nist.hit.hl7.igamt.constraints.domain.Predicate;
import gov.nist.hit.hl7.igamt.constraints.domain.ViewScope;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Component;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.DateTimeConstraints;
import gov.nist.hit.hl7.igamt.datatype.domain.DateTimeDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.display.BindingDisplay;
import gov.nist.hit.hl7.igamt.datatype.domain.display.BindingType;
import gov.nist.hit.hl7.igamt.datatype.domain.display.ComponentDisplayDataModel;
import gov.nist.hit.hl7.igamt.datatype.domain.display.ComponentStructureTreeModel;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DatatypeConformanceStatement;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DatatypeLabel;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DatatypeSelectItem;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DatatypeSelectItemGroup;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DatatypeStructureDisplay;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DisplayValuesetBinding;
import gov.nist.hit.hl7.igamt.datatype.domain.display.PostDef;
import gov.nist.hit.hl7.igamt.datatype.domain.display.PreDef;
import gov.nist.hit.hl7.igamt.datatype.domain.display.SubComponentDisplayDataModel;
import gov.nist.hit.hl7.igamt.datatype.domain.display.SubComponentStructureTreeModel;
import gov.nist.hit.hl7.igamt.datatype.exception.DatatypeValidationException;
import gov.nist.hit.hl7.igamt.datatype.repository.DatatypeRepository;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;

/**
 *
 * @author Jungyub Woo on Mar 1, 2018.
 */

@Service("datatypeService")
public class DatatypeServiceImpl implements DatatypeService {

	@Autowired
	private DatatypeRepository datatypeRepository;

	@Autowired
	private InMemoryDomainExtentionService domainExtention;

	@Autowired
	CommonService commonService;
	@Autowired
	private MongoTemplate mongoTemplate;

	@Autowired
	ValuesetService valueSetService;

	@Autowired
	BindingService bindingService;

	@Override
	public Datatype findById(String key) {
		Datatype dt = this.domainExtention.findById(key, Datatype.class);
		return dt == null ? datatypeRepository.findById(key).orElse(null) : dt;
	}

	@Override
	public Datatype create(Datatype datatype) {
		datatype.setId(new String());
		datatype = datatypeRepository.save(datatype);
		return datatype;
	}

	@Override
	public Datatype save(Datatype datatype) {
		// datatype.setId(StringUtil.updateVersion(datatype.getId()));
		datatype = datatypeRepository.save(datatype);
		return datatype;
	}

	@Override
	public List<Datatype> findAll() {
		return Stream.concat(domainExtention.getAll(Datatype.class).stream(), datatypeRepository.findAll().stream())
				.collect(Collectors.toList());
	}

	@Override
	public void delete(Datatype datatype) {
		datatypeRepository.delete(datatype);
	}

	@Override
	public void delete(String key) {
		datatypeRepository.deleteById(key);
	}

	@Override
	public void removeCollection() {
		datatypeRepository.deleteAll();
	}

	@Override
	public List<Datatype> findByDomainInfoVersion(String version) {
		// TODO Auto-generated method stub
		return datatypeRepository.findByDomainInfoVersion(version);
	}

	@Override
	public List<Datatype> findByDomainInfoScope(String scope) {
		// TODO Auto-generated method stub
		return datatypeRepository.findByDomainInfoScope(scope);
	}

	@Override
	public List<Datatype> findByDomainInfoScopeAndDomainInfoVersion(String scope, String verion) {
		// TODO Auto-generated method stub
		return datatypeRepository.findByDomainInfoScopeAndDomainInfoVersion(scope, verion);
	}

	@Override
	public List<Datatype> findByName(String name) {
		// TODO Auto-generated method stub
		return datatypeRepository.findByName(name);
	}

	@Override
	public List<Datatype> findByDomainInfoScopeAndDomainInfoVersionAndName(String scope, String version, String name) {
		// TODO Auto-generated method stub
		return datatypeRepository.findByDomainInfoScopeAndDomainInfoVersionAndName(scope, version, name);
	}

	@Override
	public List<Datatype> findByDomainInfoVersionAndName(String version, String name) {
		// TODO Auto-generated method stub
		return datatypeRepository.findByDomainInfoVersionAndName(version, name);
	}

	@Override
	public List<Datatype> findByDomainInfoScopeAndName(String scope, String name) {
		// TODO Auto-generated method stub
		return datatypeRepository.findByDomainInfoScopeAndName(scope, name);
	}

	@Override
	public List<Datatype> findByScope(Scope scope) {
		return datatypeRepository.findByScope(scope);
	}

	@Override
	public List<Datatype> findByScopeAndVersion(String scope, String hl7Version) {

		Criteria where = Criteria.where("domainInfo.scope").is(scope);
		where.andOperator(Criteria.where("domainInfo.version").is(hl7Version));

		Query qry = Query.query(where);
		List<Datatype> datatypes = mongoTemplate.find(qry, Datatype.class);
		return datatypes;

	}

	@Override
	public List<Datatype> findByNameAndVersionAndScope(String name, String version, String scope) {
		Criteria where = Criteria.where("name").is(name).andOperator(Criteria.where("domainInfo.version").is(version)
				.andOperator(Criteria.where("domainInfo.scope").is(scope)));
		Query query = Query.query(where);

		List<Datatype> datatypes = mongoTemplate.find(query, Datatype.class);
		return datatypes;
	}

	@Override
	public Datatype findOneByNameAndVersionAndScope(String name, String version, String scope) {
		Criteria where = Criteria.where("name").is(name).andOperator(Criteria.where("domainInfo.version").is(version)
				.andOperator(Criteria.where("domainInfo.scope").is(scope)));
		Query query = Query.query(where);
		Datatype datatypes = mongoTemplate.findOne(query, Datatype.class);
		return datatypes;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see gov.nist.hit.hl7.igamt.datatype.service.DatatypeService#
	 * convertDomainToMetadata(gov.nist.hit. hl7.igamt.datatype.domain.Datatype)
	 */

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * gov.nist.hit.hl7.igamt.datatype.service.DatatypeService#convertDomainToPredef
	 * (gov.nist.hit.hl7. igamt.datatype.domain.Datatype)
	 */
	@Override
	public PreDef convertDomainToPredef(Datatype datatype) {
		if (datatype != null) {
			PreDef result = new PreDef();
			result.setId(datatype.getId());
			result.setScope(datatype.getDomainInfo().getScope());
			result.setVersion(datatype.getDomainInfo().getVersion());
			if (datatype.getExt() != null) {
				result.setLabel(datatype.getName() + "_" + datatype.getExt());
			} else {
				result.setLabel(datatype.getName());
			}
			result.setPreDef(datatype.getPreDef());
			return result;
		}
		return null;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see gov.nist.hit.hl7.igamt.datatype.service.DatatypeService#
	 * convertDomainToPostdef(gov.nist.hit.hl7 .igamt.datatype.domain.Datatype)
	 */
	@Override
	public PostDef convertDomainToPostdef(Datatype datatype) {
		if (datatype != null) {
			PostDef result = new PostDef();
			result.setId(datatype.getId());
			result.setScope(datatype.getDomainInfo().getScope());
			result.setVersion(datatype.getDomainInfo().getVersion());
			if (datatype.getExt() != null) {
				result.setLabel(datatype.getName() + "_" + datatype.getExt());
			} else {
				result.setLabel(datatype.getName());
			}
			result.setPostDef(datatype.getPostDef());
			return result;
		}
		return null;
	}

	@Override
	public List<Datatype> findDisplayFormatByScopeAndVersion(String scope, String version) {
		// TODO Auto-generated method stub
		Criteria where = Criteria.where("domainInfo.scope").is(scope)
				.andOperator(Criteria.where("domainInfo.version").is(version));
		Query qry = Query.query(where);
		qry.fields().include("domainInfo");
		qry.fields().include("id");
		qry.fields().include("name");
		qry.fields().include("description");
		List<Datatype> Datatypes = mongoTemplate.find(qry, Datatype.class);
		return Datatypes;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see gov.nist.hit.hl7.igamt.datatype.service.DatatypeService#
	 * convertDomainToConformanceStatement(gov
	 * .nist.hit.hl7.igamt.datatype.domain.Datatype)
	 */
	@Override
	public DatatypeConformanceStatement convertDomainToConformanceStatement(Datatype datatype) {
		if (datatype != null) {
			DatatypeConformanceStatement result = new DatatypeConformanceStatement();
			result.setId(datatype.getId());
			result.setScope(datatype.getDomainInfo().getScope());
			result.setVersion(datatype.getDomainInfo().getVersion());
			if (datatype.getExt() != null) {
				result.setLabel(datatype.getName() + datatype.getExt());
			} else {
				result.setLabel(datatype.getName());
			}
			result.setName(datatype.getName());
			if (datatype.getBinding() != null)
				result.setConformanceStatements(datatype.getBinding().getConformanceStatements());
			return result;
		}
		return null;
	}

	private void validateComponent(Component f) throws ValidationException {
		if (f.getRef() == null || StringUtils.isEmpty(f.getRef().getId())) {
			throw new DatatypeValidationException("Datatype is missing");
		}
		Datatype d = findById(f.getRef().getId());
		if (d == null) {
			throw new DatatypeValidationException("Datatype is missing");
		}
		ValidationUtil.validateUsage(f.getUsage(), 2);
		ValidationUtil.validateLength(f.getMinLength(), f.getMaxLength());
		ValidationUtil.validateConfLength(f.getConfLength());
	}

	@Override
	public Link cloneDatatype( String newId, HashMap<RealKey, String> newKey, Link l,
			String username, Scope scope, CloneMode cloneMode) {
		// TODO Auto-generated method stub

		Datatype old = this.findById(l.getId());
		Datatype elm = old.clone();
	    elm.setId(newId);
		elm.getDomainInfo().setScope(scope);
		elm.setUsername(username);
	    elm.setOrigin(l.getId());
	    elm.setDerived(cloneMode.equals(CloneMode.DERIVE));
		Link newLink = new Link(elm);
		updateDependencies(elm, newKey, cloneMode);
		this.save(elm);
		return newLink;

	}

	private void updateDependencies(Datatype elm, HashMap<RealKey, String> newKeys, CloneMode cloneMode) {
		// TODO Auto-generated method stub

		if (elm instanceof ComplexDatatype) {
			for (Component c : ((ComplexDatatype) elm).getComponents()) {
				if (c.getRef() != null) {
					if (c.getRef().getId() != null) {
					  RealKey key = new RealKey(c.getRef().getId(), Type.DATATYPE);
						if (newKeys.containsKey(key)) {
							c.getRef().setId(newKeys.get(key));
						}
					}
				}
			}
		}
		if (elm.getBinding() != null) {
			this.bindingService.substitute(elm.getBinding(), newKeys);
			 if(cloneMode.equals(CloneMode.DERIVE)) {
		          this.bindingService.lockConformanceStatements(elm.getBinding());
		        }
		}
	}
	@Override
	public Set<?> convertComponentStructure(Datatype datatype, String idPath, String path, String viewScope) {
		HashMap<String, Valueset> valueSetsMap = new HashMap<String, Valueset>();
		HashMap<String, Datatype> datatypesMap = new HashMap<String, Datatype>();

		if (viewScope.equals(ViewScope.SEGMENT.toString())) {
			if (datatype instanceof ComplexDatatype) {
				ComplexDatatype childDatatype = (ComplexDatatype) datatype;
				if (childDatatype.getComponents() != null && childDatatype.getComponents().size() > 0) {
					Set<ComponentStructureTreeModel> result = new HashSet<ComponentStructureTreeModel>();

					for (Component c : childDatatype.getComponents()) {
						Datatype childChildDt = this.findDatatype(c.getRef().getId(), datatypesMap);
						if (childChildDt != null) {
							ComponentStructureTreeModel componentStructureTreeModel = new ComponentStructureTreeModel();
							ComponentDisplayDataModel cModel = new ComponentDisplayDataModel(c);
							cModel.setViewScope(ViewScope.SEGMENT);
							cModel.setIdPath(idPath + "-" + c.getId());
							cModel.setPath(path + "-" + c.getPosition());
							cModel.setDatatypeLabel(this.createDatatypeLabel(childChildDt));
							StructureElementBinding cSeb = this
									.findStructureElementBindingByComponentIdForDatatype(datatype, c.getId());
							if (cSeb != null) {
								cModel.setBinding(this.createBindingDisplay(cSeb, datatype.getId(), ViewScope.DATATYPE,
										2, valueSetsMap, null));
								if (cSeb.getPredicate() != null) {
									Predicate p = cSeb.getPredicate();
									if (p.getTrueUsage() != null && p.getFalseUsage() != null) {
										cModel.setTrueUsage(p.getTrueUsage());
										cModel.setFalseUsage(p.getFalseUsage());
										cModel.setPredicate(p);
										if (p.getIdentifier() != null)
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
											SubComponentDisplayDataModel scModel = new SubComponentDisplayDataModel(sc);
											scModel.setViewScope(ViewScope.SEGMENT);
											scModel.setIdPath(idPath + "-" + c.getId() + "-" + sc.getId());
											scModel.setPath(path + "-" + c.getPosition() + "-" + sc.getPosition());
											scModel.setDatatypeLabel(this.createDatatypeLabel(childChildChildDt));
											
											BindingDisplay bindingDisplayForSubComponent = null;
											
											StructureElementBinding childCSeb = this
													.findStructureElementBindingByComponentIdFromStructureElementBinding(
															cSeb, sc.getId());
											if (childCSeb != null) {
												bindingDisplayForSubComponent = this.createBindingDisplay(childCSeb,
														datatype.getId(), ViewScope.DATATYPE, 2, valueSetsMap, bindingDisplayForSubComponent);
											}
											StructureElementBinding scSeb = this
													.findStructureElementBindingByComponentIdForDatatype(childChildDt,
															sc.getId());
											if (scSeb != null) {
												bindingDisplayForSubComponent = this.createBindingDisplay(scSeb,
														childChildDt.getId(), ViewScope.DATATYPE, 3, valueSetsMap, bindingDisplayForSubComponent);
											}
											
											
											if (bindingDisplayForSubComponent != null && bindingDisplayForSubComponent.getPredicate() != null) {
												Predicate p = bindingDisplayForSubComponent.getPredicate();
												if (p.getTrueUsage() != null && p.getFalseUsage() != null) {
													scModel.setTrueUsage(p.getTrueUsage());
													scModel.setFalseUsage(p.getFalseUsage());
													scModel.setPredicate(p);
													if (p.getIdentifier() != null)
														scModel.getPredicate().setIdentifier(sc.getId());
												}
											}
											scModel.setBinding(bindingDisplayForSubComponent);
											
											subComponentStructureTreeModel.setData(scModel);
											componentStructureTreeModel.addSubComponent(subComponentStructureTreeModel);
										} else {
											// TODO need to handle exception
										}
									}
								}
							}
							result.add(componentStructureTreeModel);
						} else {
							// TODO need to handle exception
						}
					}
					return result;
				}
			}
		} else if (viewScope.equals(ViewScope.DATATYPE.toString())) {
			if (datatype instanceof ComplexDatatype) {
				ComplexDatatype componentDatatype = (ComplexDatatype) datatype;
				if (componentDatatype.getComponents() != null && componentDatatype.getComponents().size() > 0) {
					Set<SubComponentStructureTreeModel> result = new HashSet<SubComponentStructureTreeModel>();
					for (Component sc : componentDatatype.getComponents()) {
						Datatype childChildChildDt = this.findDatatype(sc.getRef().getId(), datatypesMap);
						if (childChildChildDt != null) {
							SubComponentStructureTreeModel subComponentStructureTreeModel = new SubComponentStructureTreeModel();
							SubComponentDisplayDataModel scModel = new SubComponentDisplayDataModel(sc);
							scModel.setViewScope(ViewScope.DATATYPE);
							scModel.setIdPath(idPath + "-" + sc.getId());
							scModel.setPath(path + "-" + sc.getPosition());
							scModel.setDatatypeLabel(this.createDatatypeLabel(childChildChildDt));
							StructureElementBinding scSeb = this
									.findStructureElementBindingByComponentIdForDatatype(datatype, sc.getId());
							if (scSeb != null) {
								scModel.setBinding(this.createBindingDisplay(scSeb, datatype.getId(),
										ViewScope.DATATYPE, 2, valueSetsMap, null));
								if (scSeb.getPredicate() != null) {
									Predicate p = scSeb.getPredicate();
									if (p.getTrueUsage() != null && p.getFalseUsage() != null) {
										scModel.setTrueUsage(p.getTrueUsage());
										scModel.setFalseUsage(p.getFalseUsage());
										scModel.setPredicate(p);
										if (p.getIdentifier() != null)
											scModel.getPredicate().setIdentifier(sc.getId());
									}
								}
							}
							subComponentStructureTreeModel.setData(scModel);
							result.add(subComponentStructureTreeModel);
						} else {
							// TODO need to handle exception
						}
					}
					return result;
				}
			}
		}
		return null;
	}

	@Override
	public DatatypeStructureDisplay convertDomainToStructureDisplay(Datatype datatype, boolean readOnly) {
		HashMap<String, Valueset> valueSetsMap = new HashMap<String, Valueset>();
		HashMap<String, Datatype> datatypesMap = new HashMap<String, Datatype>();

		DatatypeStructureDisplay result = new DatatypeStructureDisplay();

		result.complete(result, datatype, SectionType.STRUCTURE, readOnly);
		if (datatype.getExt() != null) {
			result.setLabel(datatype.getName() + "_" + datatype.getExt());
		} else {
			result.setLabel(datatype.getName());
		}
		result.setName(datatype.getName());
		if(datatype.getBinding() !=null) {
	        result.setConformanceStatements( datatype.getBinding().getConformanceStatements());
		}

		if (datatype instanceof ComplexDatatype) {
			ComplexDatatype dt = (ComplexDatatype) datatype;

			if (dt.getComponents() != null && dt.getComponents().size() > 0) {
				for (Component c : dt.getComponents()) {
					Datatype childDt = this.findDatatype(c.getRef().getId(), datatypesMap);
					if (childDt != null) {
						ComponentStructureTreeModel componentStructureTreeModel = new ComponentStructureTreeModel();
						ComponentDisplayDataModel cModel = new ComponentDisplayDataModel(c);
						cModel.setViewScope(ViewScope.DATATYPE);
						cModel.setIdPath(c.getId());
						cModel.setPath(c.getPosition() + "");
						cModel.setDatatypeLabel(this.createDatatypeLabel(childDt));
						cModel.setConstantValue(c.getConstantValue());
						cModel.setText(c.getText());
						StructureElementBinding cSeb = this
								.findStructureElementBindingByComponentIdForDatatype(datatype, c.getId());
						if (cSeb != null) {
							cModel.setBinding(this.createBindingDisplay(cSeb, datatype.getId(), ViewScope.DATATYPE, 1,
									valueSetsMap, null));
							if (cSeb.getPredicate() != null) {
								Predicate p = cSeb.getPredicate();
								if (p.getTrueUsage() != null && p.getFalseUsage() != null) {
									cModel.setTrueUsage(p.getTrueUsage());
									cModel.setFalseUsage(p.getFalseUsage());
									cModel.setPredicate(p);
									if (p.getIdentifier() != null)
										cModel.getPredicate().setIdentifier(cModel.getIdPath());
								}
							}
						}
						componentStructureTreeModel.setData(cModel);

						if (childDt instanceof ComplexDatatype) {
							ComplexDatatype childDatatype = (ComplexDatatype) childDt;
							if (childDatatype.getComponents() != null && childDatatype.getComponents().size() > 0) {
								for (Component sc : childDatatype.getComponents()) {
									Datatype childChildDt = this.findDatatype(sc.getRef().getId(), datatypesMap);
									if (childChildDt != null) {
										SubComponentStructureTreeModel subComponentStructureTreeModel = new SubComponentStructureTreeModel();
										SubComponentDisplayDataModel scModel = new SubComponentDisplayDataModel(sc);
										scModel.setViewScope(ViewScope.DATATYPE);
										scModel.setIdPath(c.getId() + "-" + sc.getId());
										scModel.setPath(c.getPosition() + "-" + sc.getPosition());
										scModel.setDatatypeLabel(this.createDatatypeLabel(childChildDt));

										BindingDisplay bindingDisplayForSubComponent = null;
										
										StructureElementBinding childCSeb = this
												.findStructureElementBindingByComponentIdFromStructureElementBinding(
														cSeb, sc.getId());
										if (childCSeb != null) {
											bindingDisplayForSubComponent = this.createBindingDisplay(childCSeb,
													datatype.getId(), ViewScope.DATATYPE, 2, valueSetsMap, bindingDisplayForSubComponent);
										}
										StructureElementBinding scSeb = this
												.findStructureElementBindingByComponentIdForDatatype(childChildDt,
														sc.getId());
										if (scSeb != null) {
											bindingDisplayForSubComponent = this.createBindingDisplay(scSeb,
													childChildDt.getId(), ViewScope.DATATYPE, 3, valueSetsMap, bindingDisplayForSubComponent);
										}
										
										
										if (bindingDisplayForSubComponent != null && bindingDisplayForSubComponent.getPredicate() != null) {
											Predicate p = bindingDisplayForSubComponent.getPredicate();
											if (p.getTrueUsage() != null && p.getFalseUsage() != null) {
												scModel.setTrueUsage(p.getTrueUsage());
												scModel.setFalseUsage(p.getFalseUsage());
												scModel.setPredicate(p);
												if (p.getIdentifier() != null)
													scModel.getPredicate().setIdentifier(sc.getId());
											}
										}
										scModel.setBinding(bindingDisplayForSubComponent);
										
										subComponentStructureTreeModel.setData(scModel);
										
										componentStructureTreeModel.addSubComponent(subComponentStructureTreeModel);
									} else {
										// TODO need to handle exception
									}
								}
							}
						}
						result.addComponent(componentStructureTreeModel);
					} else {
						// TODO need to handle exception
					}
				}
			}
		}
		result.setType(Type.DATATYPE);
		return result;
	}

	private BindingDisplay createBindingDisplay(StructureElementBinding seb, String sourceId, ViewScope sourceType,
			int priority, HashMap<String, Valueset> valueSetsMap, BindingDisplay existingBindingDisplay) {
		BindingDisplay bindingDisplay = existingBindingDisplay;
		if (bindingDisplay == null)
			bindingDisplay = new BindingDisplay();

		if (seb.getPredicate() != null) {
			if (existingBindingDisplay == null || (existingBindingDisplay.getPredicatePriority() != null
					&& existingBindingDisplay.getPredicatePriority() > priority)) {
				bindingDisplay.setPredicate(seb.getPredicate());
				bindingDisplay.setPredicatePriority(priority);
				bindingDisplay.setPredicateSourceId(sourceId);
				bindingDisplay.setPredicateSourceType(sourceType);
			}

		}

		if (existingBindingDisplay == null || (existingBindingDisplay.getValuesetBindingsPriority() != null
				&& existingBindingDisplay.getValuesetBindingsPriority() > priority)) {
			bindingDisplay.setBindingType(BindingType.NA);
			if (seb.getInternalSingleCode() != null && seb.getInternalSingleCode().getValueSetId() != null
					&& seb.getInternalSingleCode().getCode() != null) {
				bindingDisplay.setInternalSingleCode(seb.getInternalSingleCode());
				bindingDisplay.setValuesetBindingsPriority(priority);
				bindingDisplay.setValuesetBindingsSourceId(sourceId);
				bindingDisplay.setValuesetBindingsSourceType(sourceType);
				bindingDisplay.setBindingType(BindingType.SC);
			} else {
				Set<DisplayValuesetBinding> displayValuesetBindings = this
						.covertDisplayVSBinding(seb.getValuesetBindings(), valueSetsMap);
				if (displayValuesetBindings != null) {
					bindingDisplay
							.setValuesetBindings(this.covertDisplayVSBinding(seb.getValuesetBindings(), valueSetsMap));
					bindingDisplay.setValuesetBindingsPriority(priority);
					bindingDisplay.setValuesetBindingsSourceId(sourceId);
					bindingDisplay.setValuesetBindingsSourceType(sourceType);
					bindingDisplay.setBindingType(BindingType.VS);
				}
			}
		}

		return bindingDisplay;
	}

	private Datatype findDatatype(String id, HashMap<String, Datatype> datatypesMap) {
		Datatype dt = datatypesMap.get(id);
		if (dt == null) {
			dt = this.findById(id);
			datatypesMap.put(id, dt);
		}
		return dt;
	}

	private Set<DisplayValuesetBinding> covertDisplayVSBinding(Set<ValuesetBinding> valuesetBindings,
			HashMap<String, Valueset> valueSetsMap) {
		if (valuesetBindings != null) {
			Set<DisplayValuesetBinding> result = new HashSet<DisplayValuesetBinding>();
			for (ValuesetBinding vb : valuesetBindings) {

				DisplayValuesetBinding dvb = new DisplayValuesetBinding();
		         List<DisplayElement> vsDisplay = vb.getValueSets().stream().map(id -> {
		             Valueset vs = this.valueSetService.findById(id);
		             if(vs !=null) {
		               DisplayElement obj = new DisplayElement();
	                     obj.setVariableName(vs.getBindingIdentifier());
	                     obj.setDomainInfo(vs.getDomainInfo());
	                     return obj;
		             }else {
		               return null;
		             }
                }).collect(Collectors.toList());
                dvb.setValueSetsDisplay(vsDisplay);
				dvb.setStrength(vb.getStrength());
				dvb.setValueSets(vb.getValueSets());
				dvb.setValuesetLocations(vb.getValuesetLocations());
				result.add(dvb);

			}
			return result;
		}
		return null;
	}

	private StructureElementBinding findStructureElementBindingByComponentIdForDatatype(Datatype dt, String cid) {
		if (dt != null && dt.getBinding() != null && dt.getBinding().getChildren() != null) {
			for (StructureElementBinding seb : dt.getBinding().getChildren()) {
				if (seb.getElementId().equals(cid))
					return seb;
			}
		}
		return null;
	}

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

	@Override
	public List<DatatypeSelectItemGroup> getDatatypeFlavorsOptions(Set<String> ids, Datatype dt, String scope) {
		boolean isComplex = dt instanceof ComplexDatatype;

		List<DatatypeSelectItemGroup> ret = new ArrayList<DatatypeSelectItemGroup>();
		DatatypeSelectItemGroup flavros = new DatatypeSelectItemGroup();
		flavros.setLabel("Flavors");
		List<Datatype> dtFlavors = this.findFlavors(ids, dt.getId(), dt.getName());

		if (dtFlavors != null && !dtFlavors.isEmpty()) {
			dtFlavors.forEach(d -> flavros.getItems().add(createItem(d)));
			ret.add(flavros);
		}
		List<Datatype> others = this.findNonFlavor(ids, dt.getId(), dt.getName());
		if (others != null && !others.isEmpty()) {
			others = others.stream().filter(d -> applyRule(d, isComplex, scope)).collect(Collectors.toList());
		}
		if (!others.isEmpty()) {
			DatatypeSelectItemGroup othersgroup = new DatatypeSelectItemGroup();
			othersgroup.setLabel("others");
			others.forEach(d -> othersgroup.getItems().add(createItem(d)));
			ret.add(othersgroup);
		}
		return ret;
	}

	private boolean applyRule(Datatype d, boolean isComplex, String scope) {
		boolean secondComplex = d instanceof ComplexDatatype;
		// TODO Auto-generated method stub
		boolean ret = false;
		if (scope.equals(ViewScope.DATATYPE.toString())) {
			ret = !isComplex && !secondComplex;

		} else {

			if (isComplex) {
				ret = secondComplex == isComplex;
			} else {
				ret = true;
			}
		}
		return ret;
	}

	private DatatypeSelectItem createItem(Datatype dt) {
		// TODO Auto-generated method stub
		DatatypeSelectItem item = new DatatypeSelectItem(dt.getLabel(), this.createDatatypeLabel(dt));
		return item;

	}

	@Override
	public List<Datatype> findDisplayFormatByIds(Set<String> ids) {
		Query qry = new Query();
		qry.addCriteria(Criteria.where("_id").in(convertIds(ids)));
		qry.fields().include("domainInfo");
		qry.fields().include("id");
		qry.fields().include("name");
		qry.fields().include("description");
		qry.fields().include("ext");
		List<Datatype> datatypes = mongoTemplate.find(qry, Datatype.class);
		return datatypes;
	}

	private Set<ObjectId> convertIds(Set<String> ids) {
		// TODO Auto-generated method stub
		Set<ObjectId> results = new HashSet<ObjectId>();
		ids.forEach(id -> results.add(new ObjectId(id)));
		return results;
	}

	@Override
	public List<Datatype> findFlavors(Set<String> ids, String id, String name) {
		Query qry = new Query();
		qry.addCriteria(Criteria.where("_id").in(convertIds(ids)));
		qry.addCriteria(Criteria.where("name").is(name));

		qry.fields().include("domainInfo");
		qry.fields().include("id");
		qry.fields().include("_class");
		qry.fields().include("name");
		qry.fields().include("description");
		qry.fields().include("ext");
		qry.with(new Sort(Sort.Direction.ASC, "ext"));

		List<Datatype> datatypes = mongoTemplate.find(qry, Datatype.class);
		return datatypes;
	}

	@Override
	public List<Datatype> findNonFlavor(Set<String> ids, String id, String name) {
		Query qry = new Query();
		qry.addCriteria(Criteria.where("_id").in(convertIds(ids)));
		qry.addCriteria(Criteria.where("name").ne(name));
		qry.with(new Sort(Sort.Direction.ASC, "name"));

		//
		qry.fields().include("domainInfo");
		qry.fields().include("id");
		qry.fields().include("name");
		qry.fields().include("description");
		qry.fields().include("ext");
		qry.fields().include("_class");

		List<Datatype> datatypes = mongoTemplate.find(qry, Datatype.class);
		return datatypes;
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

	public void logChangeStructureElement(StructureElement structureElement, PropertyType propertyType, ChangeReason changeReason) {
		if(structureElement.getChangeLog() == null) {
			structureElement.setChangeLog(new HashMap<>());
		}

		if(changeReason != null) {
			structureElement.getChangeLog().put(propertyType, changeReason);
		} else {
			structureElement.getChangeLog().remove(propertyType);
		}
	}

	public void logChangeBinding(StructureElementBinding binding, PropertyType propertyType, ChangeReason changeReason) {
		if(binding.getChangeLog() == null) {
			binding.setChangeLog(new HashMap<>());
		}

		if(changeReason != null) {
			binding.getChangeLog().put(propertyType, changeReason);
		} else {
			binding.getChangeLog().remove(propertyType);
		}
	}

	public void logReasonForChange(Datatype s, ChangeItemDomain item) throws IOException, InvalidChangeTargetLocation {
		ObjectMapper mapper = new ObjectMapper();
		ChangeReasonTarget target = new ChangeReasonTarget(item.getLocation());
		String jsonInString = mapper.writeValueAsString(item.getPropertyValue());
		ChangeReason changeReason = mapper.readValue(jsonInString, ChangeReason.class);
		switch (target.getProperty()) {
			case USAGE:
			case NAME:
			case CARDINALITYMAX:
			case CARDINALITYMIN:
			case LENGTHMAX:
			case LENGTHMIN:
			case CONFLENGTH:
			case DATATYPE:
			case LENGTHTYPE:
			case CONSTANTVALUE:
				Component cmp = this.findComponentById(s, target.getPath());
				if(cmp != null) {
					this.logChangeStructureElement(cmp, target.getProperty(), changeReason);
				}
				break;
			case VALUESET:
			case SINGLECODE:
			case PREDICATE:
				StructureElementBinding seb = this.findAndCreateStructureElementBindingByIdPath(s, target.getPath());
				this.logChangeBinding(seb, target.getProperty(), changeReason);
				break;
		}
	}

	@Override
	public void applyChanges(Datatype d, List<ChangeItemDomain> cItems, String documentId)
			throws JsonProcessingException, IOException, InvalidChangeTargetLocation {
		Collections.sort(cItems);
		for (ChangeItemDomain item : cItems) {
		    if (item.getPropertyType().equals(PropertyType.DTMSTRUC)) {
		      DateTimeDatatype dtd;
		      if(d instanceof DateTimeDatatype){
		        dtd = (DateTimeDatatype)d;
		      }else {
		        dtd = new DateTimeDatatype();
		        dtd.setAuthorNotes(d.getAuthorNotes());
		        dtd.setAuthors(d.getAuthors());
		        dtd.setBinding(d.getBinding());
		        dtd.setComment(d.getComment());
		        dtd.setCreatedFrom(d.getComment());
		        dtd.setCreationDate(d.getCreationDate());
		        dtd.setDerived(d.isDerived());
		        dtd.setDescription(d.getDescription());
		        dtd.setDomainInfo(d.getDomainInfo());
		        dtd.setExt(d.getExt());
		        dtd.setFrom(d.getFrom());
		        dtd.setId(d.getId());
		        dtd.setName(d.getName());
		        dtd.setOrganization(d.getOrganization());
		        dtd.setOrigin(d.getOrigin());
		        dtd.setPostDef(d.getPostDef());
		        dtd.setPreDef(d.getPreDef());
		        dtd.setPublicationInfo(d.getPublicationInfo());
		        dtd.setPurposeAndUse(d.getPurposeAndUse());
		        dtd.setStatus(d.getStatus());
		        dtd.setType(d.getType());
		        dtd.setUpdateDate(d.getUpdateDate());
		        dtd.setUsageNotes(d.getUsageNotes());
		        dtd.setUsername(d.getUsername());
		        dtd.setVersion(d.getVersion());
		        
		        d = (Datatype)dtd;
		      }
		      
		      item.setOldPropertyValue(dtd.getDateTimeConstraints());
              ObjectMapper mapper = new ObjectMapper();
              String jsonInString = mapper.writeValueAsString(item.getPropertyValue());
              mapper.readValue(jsonInString, DateTimeConstraints.class);
		      dtd.setDateTimeConstraints(mapper.readValue(jsonInString, DateTimeConstraints.class));
		    }  else if (item.getPropertyType().equals(PropertyType.PREDEF)) {
				item.setOldPropertyValue(d.getPreDef());
				d.setPreDef((String) item.getPropertyValue());

			} else if (item.getPropertyType().equals(PropertyType.POSTDEF)) {
				item.setOldPropertyValue(d.getPostDef());
				d.setPostDef((String) item.getPropertyValue());
			} else if (item.getPropertyType().equals(PropertyType.AUTHORNOTES)) {
				item.setOldPropertyValue(d.getAuthorNotes());
				d.setAuthorNotes((String) item.getPropertyValue());

			} else if (item.getPropertyType().equals(PropertyType.USAGENOTES)) {
				item.setOldPropertyValue(d.getUsageNotes());
				d.setUsageNotes((String) item.getPropertyValue());
			}
			 else if (item.getPropertyType().equals(PropertyType.SHORTDESCRIPTION)) {
               item.setOldPropertyValue(d.getShortDescription());
               d.setShortDescription((String) item.getPropertyValue());
           } else if (item.getPropertyType().equals(PropertyType.EXT)) {
				item.setOldPropertyValue(d.getExt());
				d.setExt((String) item.getPropertyValue());
			} else if (item.getPropertyType().equals(PropertyType.USAGE)) {
				Component c = this.findComponentById(d, item.getLocation());
				if (c != null) {
					item.setOldPropertyValue(c.getUsage());
					c.setUsage(Usage.valueOf((String) item.getPropertyValue()));
				}
			} else if (item.getPropertyType().equals(PropertyType.LENGTHMIN)) {
				Component c = this.findComponentById(d, item.getLocation());
				if (c != null) {
					item.setOldPropertyValue(c.getMinLength());
					if (item.getPropertyValue() == null) {
						c.setMinLength("NA");
					} else {
						c.setMinLength((String) item.getPropertyValue());
					}
				}
			} else if (item.getPropertyType().equals(PropertyType.LENGTHMAX)) {
				Component c = this.findComponentById(d, item.getLocation());
				if (c != null) {
					item.setOldPropertyValue(c.getMaxLength());
					if (item.getPropertyValue() == null) {
						c.setMaxLength("NA");
					} else {
						c.setMaxLength((String) item.getPropertyValue());
					}
				}
			} else if (item.getPropertyType().equals(PropertyType.CONFLENGTH)) {
				Component c = this.findComponentById(d, item.getLocation());
				if (c != null) {
					item.setOldPropertyValue(c.getConfLength());
					if (item.getPropertyValue() == null) {
						c.setConfLength("NA");
					} else {
						c.setConfLength((String) item.getPropertyValue());
					}
				}
			} else if (item.getPropertyType().equals(PropertyType.LENGTHTYPE)) {
				Component c = this.findComponentById(d, item.getLocation());
				if (c != null) {
					item.setOldPropertyValue(c.getLengthType());
					if (item.getPropertyValue() == null) {
						c.setLengthType(LengthType.UNSET);
					} else {
						c.setLengthType(LengthType.valueOf((String) item.getPropertyValue()));
					}
				}
			}
		    else if (item.getPropertyType().equals(PropertyType.DATATYPE)) {
				Component c = this.findComponentById(d, item.getLocation());
				if (c != null) {
					item.setOldPropertyValue(c.getRef());
					ObjectMapper mapper = new ObjectMapper();
					String jsonInString = mapper.writeValueAsString(item.getPropertyValue());
					c.setRef(mapper.readValue(jsonInString, Ref.class));
				}
			} else if (item.getPropertyType().equals(PropertyType.VALUESET)) {
				ObjectMapper mapper = new ObjectMapper();
				String jsonInString = mapper.writeValueAsString(item.getPropertyValue());
				StructureElementBinding seb = this.findAndCreateStructureElementBindingByIdPath(d, item.getLocation());
				item.setOldPropertyValue(seb.getValuesetBindings());
				seb.setValuesetBindings(this.convertDisplayValuesetBinding(new HashSet<DisplayValuesetBinding>(
						Arrays.asList(mapper.readValue(jsonInString, DisplayValuesetBinding[].class)))));
			} else if (item.getPropertyType().equals(PropertyType.SINGLECODE)) {
				ObjectMapper mapper = new ObjectMapper();
				String jsonInString = mapper.writeValueAsString(item.getPropertyValue());
				StructureElementBinding seb = this.findAndCreateStructureElementBindingByIdPath(d, item.getLocation());
				item.setOldPropertyValue(seb.getInternalSingleCode());
				seb.setInternalSingleCode(mapper.readValue(jsonInString, InternalSingleCode.class));
			} else if (item.getPropertyType().equals(PropertyType.CONSTANTVALUE)) {
				Component c = this.findComponentById(d, item.getLocation());
				if (c != null) {
					item.setOldPropertyValue(c.getConstantValue());
					if (item.getPropertyValue() == null) {
						c.setConstantValue(null);
					} else {
						c.setConstantValue((String) item.getPropertyValue());
					}
				}
			} else if (item.getPropertyType().equals(PropertyType.DEFINITIONTEXT)) {
				Component f = this.findComponentById(d, item.getLocation());
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
				Component c = this.findComponentById(d, item.getLocation());
				if (c != null) {
					item.setOldPropertyValue(c.getComments());
					c.setComments(new HashSet<Comment>(Arrays.asList(mapper.readValue(jsonInString, Comment[].class))));
				}
			} else if (item.getPropertyType().equals(PropertyType.STATEMENT)) {
				ObjectMapper mapper = new ObjectMapper();
				String jsonInString = mapper.writeValueAsString(item.getPropertyValue());
				if (item.getChangeType().equals(ChangeType.ADD)) {
					ConformanceStatement cs = mapper.readValue(jsonInString, ConformanceStatement.class);
					cs.setId(new ObjectId().toString());
					cs.addSourceId(d.getId());
					cs.setStructureId(d.getName());
					cs.setLevel(Level.DATATYPE);
					cs.setIgDocumentId(documentId);
					d.getBinding().addConformanceStatement(cs);
				} else if (item.getChangeType().equals(ChangeType.DELETE)) {
					item.setOldPropertyValue(item.getLocation());
					this.deleteConformanceStatementById(d, item.getLocation());
				} else if (item.getChangeType().equals(ChangeType.UPDATE)) {
					ConformanceStatement cs = mapper.readValue(jsonInString, ConformanceStatement.class);
					if(!cs.isLocked()) {
					if (cs.getIdentifier() != null) {
						this.deleteConformanceStatementById(d, cs.getId());
					}
					cs.addSourceId(d.getId());
					cs.setStructureId(d.getName());
					cs.setLevel(Level.DATATYPE);
					cs.setIgDocumentId(documentId);
					d.getBinding().addConformanceStatement(cs);
					}
				}
			} else if (item.getPropertyType().equals(PropertyType.PREDICATE)) {
				ObjectMapper mapper = new ObjectMapper();
				String jsonInString = mapper.writeValueAsString(item.getPropertyValue());
				StructureElementBinding seb = this.findAndCreateStructureElementBindingByIdPath(d, item.getLocation());
				if (item.getChangeType().equals(ChangeType.ADD)) {
					Predicate cp = mapper.readValue(jsonInString, Predicate.class);
					cp.addSourceId(d.getId());
					cp.setStructureId(d.getName());
					cp.setLevel(Level.DATATYPE);
					cp.setIgDocumentId(documentId);
					seb.setPredicate(cp);
				} else if (item.getChangeType().equals(ChangeType.DELETE)) {
					item.setOldPropertyValue(item.getLocation());
					if (seb.getPredicate() != null) {
						item.setOldPropertyValue(seb.getPredicate());
						seb.setPredicate(null);
					}
				} else if (item.getChangeType().equals(ChangeType.UPDATE)) {
					Predicate cp = mapper.readValue(jsonInString, Predicate.class);
					item.setOldPropertyValue(seb.getPredicate());
					cp.addSourceId(d.getId());
					cp.setStructureId(d.getName());
					cp.setLevel(Level.DATATYPE);
					cp.setIgDocumentId(documentId);
					seb.setPredicate(cp);
				}
			} else if (item.getPropertyType().equals(PropertyType.CHANGEREASON)) {
				this.logReasonForChange(d, item);
			}
		}
		d.setBinding(this.makeLocationInfo(d));
		this.save(d);
	}

	private void deleteConformanceStatementById(Datatype d, String location) {
		ConformanceStatement toBeDeleted = null;
		for (ConformanceStatement cs : d.getBinding().getConformanceStatements()) {
			if (cs.getId().equals(location))
				toBeDeleted = cs;
		}

		if (toBeDeleted != null)
			d.getBinding().getConformanceStatements().remove(toBeDeleted);
	}

	/**
	 * @param hashSet
	 * @return
	 */
	private Set<ValuesetBinding> convertDisplayValuesetBinding(
			HashSet<DisplayValuesetBinding> displayValuesetBindings) {
		if (displayValuesetBindings != null) {
			Set<ValuesetBinding> result = new HashSet<ValuesetBinding>();
			for (DisplayValuesetBinding dvb : displayValuesetBindings) {
				ValuesetBinding vb = new ValuesetBinding();
				vb.setStrength(dvb.getStrength());
				vb.setValueSets(dvb.getValueSets());
				vb.setValuesetLocations(dvb.getValuesetLocations());
				result.add(vb);
			}
			return result;
		}
		return null;
	}

	/**
	 * @param sebs
	 * @param location
	 * @return
	 */
	private StructureElementBinding findAndCreateStructureElementBindingByIdPath(Datatype s, String location) {
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
	private Component findComponentById(Datatype d, String location) {
		if (d instanceof ComplexDatatype) {
			for (Component c : ((ComplexDatatype) d).getComponents()) {
				if (c.getId().equals(location))
					return c;
			}
		}

		return null;
	}

	@Override
	public Set<RelationShip> collectDependencies(Datatype elm) {

		Set<RelationShip> used = new HashSet<RelationShip>();
		HashMap<String, Usage> usageMap = new HashMap<String, Usage>();

		if (elm instanceof ComplexDatatype) {
			ComplexDatatype complex = (ComplexDatatype) elm;
			for (Component c : complex.getComponents()) {
				if (c.getRef() != null && c.getRef().getId() != null) {
					RelationShip rel = new RelationShip(new ReferenceIndentifier(c.getRef().getId(), Type.DATATYPE),
							new ReferenceIndentifier(elm.getId(), Type.DATATYPE),
							new ReferenceLocation(Type.COMPONENT, c.getPosition()+ "" , c.getName())
							);
					rel.setUsage(c.getUsage());
					usageMap.put(elm.getId()+"-"+c.getId(), c.getUsage());
					used.add(rel);
				}
			}

		}
		if (elm.getBinding() != null) {
			Set<RelationShip> bindingDependencies = bindingService
					.collectDependencies(new ReferenceIndentifier(elm.getId(), Type.DATATYPE), elm.getBinding(),usageMap);
			used.addAll(bindingDependencies);
		}
		return used;
	}

	@Override
	public void collectAssoicatedConformanceStatements(Datatype datatype,
			HashMap<String, ConformanceStatementsContainer> associatedConformanceStatementMap) {
		if (datatype.getDomainInfo().getScope().equals(Scope.USER)) {
			if (datatype instanceof ComplexDatatype) {
				ComplexDatatype cDT = (ComplexDatatype) datatype;
				for (Component c : cDT.getComponents()) {
					Datatype dt = this.findById(c.getRef().getId());
					if (dt != null) {
						if (dt.getDomainInfo().getScope().equals(Scope.USER)) {
							if (dt.getBinding() != null && dt.getBinding().getConformanceStatements() != null
									&& dt.getBinding().getConformanceStatements().size() > 0) {
								if (!associatedConformanceStatementMap.containsKey(dt.getLabel()))
									associatedConformanceStatementMap.put(dt.getLabel(),
											new ConformanceStatementsContainer(dt.getBinding().getConformanceStatements(),
													Type.DATATYPE, dt.getId(), dt.getLabel()));
								this.collectAssoicatedConformanceStatements(dt, associatedConformanceStatementMap);
							}
						}
					}

				}
			}
		}
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * gov.nist.hit.hl7.igamt.datatype.service.DatatypeService#makeLocationInfo(gov.
	 * nist.hit.hl7.igamt .datatype.domain.Datatype)
	 */
	@Override
	public ResourceBinding makeLocationInfo(Datatype dt) {
		if (dt instanceof ComplexDatatype && dt.getBinding() != null) {
			for (StructureElementBinding seb : dt.getBinding().getChildren()) {
				seb.setLocationInfo(makeLocationInfoForComponent((ComplexDatatype) dt, seb));
			}
			return dt.getBinding();
		}
		return null;
	}

	/**
	 * @param dt
	 * @param seb
	 * @return
	 */
	@Override
	public LocationInfo makeLocationInfoForComponent(ComplexDatatype dt, StructureElementBinding seb) {
		if (dt != null && dt.getComponents() != null) {
			for (Component c : dt.getComponents()) {
				if (c.getId().equals(seb.getElementId())) {
					if (seb.getChildren() != null) {
						for (StructureElementBinding childSeb : seb.getChildren()) {
							Datatype childDT = this.findById(c.getRef().getId());
							if (childDT instanceof ComplexDatatype)
								childSeb.setLocationInfo(
										makeLocationInfoForSubComponent((ComplexDatatype) childDT, childSeb));
						}
					}

					return new LocationInfo(LocationType.COMPONENT, c.getPosition(), c.getName());
				}
			}
		}
		return null;
	}

	/**
	 * @param childDT
	 * @param childSeb
	 * @return
	 */
	private LocationInfo makeLocationInfoForSubComponent(ComplexDatatype dt, StructureElementBinding seb) {
		if (dt != null && dt.getComponents() != null) {
			for (Component c : dt.getComponents()) {
				if (c.getId().equals(seb.getElementId())) {
					return new LocationInfo(LocationType.SUBCOMPONENT, c.getPosition(), c.getName());
				}
			}
		}
		return null;
	}

	@Override
	public List<Datatype> findByIdIn(Set<String> linksAsIds) {
		// TODO Auto-generated method stub
		return datatypeRepository.findByIdIn(linksAsIds);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see gov.nist.hit.hl7.igamt.datatype.service.DatatypeService#
	 * collectAvaliableConformanceStatements( java.lang.String, java.lang.String,
	 * java.lang.String)
	 */
	@Override
	public Set<ConformanceStatement> collectAvaliableConformanceStatements(String documentId, String datatypeId,
			String datatypeName) {
//		Set<ConformanceStatement> found = this.conformanceStatementRepository
//				.findByIgDocumentIdAndStructureId(documentId, datatypeName);
//		Set<ConformanceStatement> result = new HashSet<ConformanceStatement>();
//		for (ConformanceStatement cs : found) {
//			if (!cs.getSourceIds().contains(datatypeId))
//				result.add(cs);
//		}
		return null;
	}


	@Override
	public void collectResources(Datatype datatype, HashMap<String, Resource> used) {
		if (datatype instanceof ComplexDatatype) {
			Set<String> usedIds = this.getDatatypeResourceDependenciesIds((ComplexDatatype) datatype, used);
			if (usedIds != null && !usedIds.isEmpty()) {
				List<Datatype> usedDataypes = this.findByIdIn(usedIds);
				for(Datatype dt : usedDataypes) {
					used.put(dt.getId(), dt);
					collectResources(dt,used);
				}
			}
		}
	}

	private Set<String> getDatatypeResourceDependenciesIds(ComplexDatatype datatype, HashMap<String, Resource> used) {
		// TODO Auto-generated method stub
		Set<String> datatypeIds = new HashSet<String>();
		for (Component c : datatype.getComponents()) {
			if (c.getRef() != null) {
				if (c.getRef().getId() != null) {
					if (used == null || !used.containsKey(c.getRef().getId()))
						datatypeIds.add(c.getRef().getId());
				}
			}
		}
		return datatypeIds;
	}

	@Override
	public Set<Resource> getDependencies(Datatype datatype) {
		Set<Resource> ret= new HashSet<Resource>();
		ret.add(datatype);
		HashMap<String, Resource> usedDatatypes = new HashMap<String, Resource>();
		this.collectResources(datatype, usedDatatypes);
		ret.addAll(usedDatatypes.values());
		return ret;
	}

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.datatype.service.DatatypeService#findByParentId()
   */
  @Override
  public List<Datatype> findByParentId(String id) {
    // TODO Auto-generated method stub
    return datatypeRepository.findByParentId(id);
    
  }
}
