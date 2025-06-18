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

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import gov.nist.hit.hl7.igamt.common.base.domain.*;
import gov.nist.hit.hl7.igamt.segment.domain.registry.SegmentRegistry;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;
import gov.nist.hit.hl7.igamt.common.base.exception.ForbiddenOperationException;
import gov.nist.hit.hl7.igamt.common.base.model.SectionType;
import gov.nist.hit.hl7.igamt.common.base.service.InMemoryDomainExtensionService;
import gov.nist.hit.hl7.igamt.common.binding.display.DisplayValuesetBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.Binding;
import gov.nist.hit.hl7.igamt.common.binding.domain.LocationInfo;
import gov.nist.hit.hl7.igamt.common.binding.domain.LocationType;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;
import gov.nist.hit.hl7.igamt.common.binding.service.BindingService;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.ChangeItemDomain;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.ChangeType;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.igamt.common.slicing.domain.Slicing;
import gov.nist.hit.hl7.igamt.common.slicing.service.SlicingService;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatementsContainer;
import gov.nist.hit.hl7.igamt.constraints.domain.Predicate;
import gov.nist.hit.hl7.igamt.constraints.domain.ViewScope;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Component;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.display.BindingDisplay;
import gov.nist.hit.hl7.igamt.datatype.domain.display.BindingType;
import gov.nist.hit.hl7.igamt.datatype.domain.display.ComponentDisplayDataModel;
import gov.nist.hit.hl7.igamt.datatype.domain.display.ComponentStructureTreeModel;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DatatypeLabel;
import gov.nist.hit.hl7.igamt.datatype.domain.display.SubComponentDisplayDataModel;
import gov.nist.hit.hl7.igamt.datatype.domain.display.SubComponentStructureTreeModel;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.segment.domain.DynamicMappingItem;
import gov.nist.hit.hl7.igamt.segment.domain.Field;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
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
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.valueset.domain.Code;
import gov.nist.hit.hl7.igamt.valueset.domain.CodeUsage;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;
import gov.nist.hit.hl7.resource.change.exceptions.ApplyChangeException;
import gov.nist.hit.hl7.resource.change.service.ApplyChange;
import nu.xom.Attribute;
import gov.nist.hit.hl7.resource.change.service.OperationService;

/**
 *
 * @author Jungyub Woo on Mar 15, 2018.
 */

@Service("segmentService")
public class SegmentServiceImpl implements SegmentService {

  @Autowired
  private SegmentRepository segmentRepository;

  @Autowired
  private InMemoryDomainExtensionService domainExtention;

  @Autowired
  private MongoTemplate mongoTemplate;

  @Autowired
  DatatypeService datatypeService;

  @Autowired
  BindingService bindingService;

  @Autowired
  ValuesetService valueSetService;
  
  @Autowired
  ApplyChange applyChange;
  
  @Autowired
  SlicingService slicingService;

  @Autowired
  private OperationService operationService;

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
  public Segment save(Segment segment) throws ForbiddenOperationException {
    segment.setUpdateDate(new Date());
	this.operationService.verifySave(segment);
    segment = segmentRepository.save(segment);
    return segment;
  }

  @Override
  public List<Segment> findAll() {
    return Stream.concat(this.domainExtention.getAll(Segment.class).stream(), segmentRepository.findAll().stream())
        .collect(Collectors.toList());
  }

  @Override
  public void delete(Segment segment) throws ForbiddenOperationException {
	this.operationService.verifyDelete(segment);
    segmentRepository.delete(segment);
  }

  @Override
  public void delete(String key) {
    segmentRepository.deleteById(key);
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

    result.setConformanceStatements(segment.getBinding().getConformanceStatements());

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
            fModel.setBinding(this.createBindingDisplay(fSeb, segment.getId(), ViewScope.SEGMENT, 1,
                valueSetsMap, null));
            if (fSeb.getPredicate() != null) {
              Predicate p = fSeb.getPredicate();
              if (p.getTrueUsage() != null && p.getFalseUsage() != null) {
                fModel.setTrueUsage(p.getTrueUsage());
                fModel.setFalseUsage(p.getFalseUsage());
                fModel.setPredicate(p);
                if (p.getIdentifier() != null)
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

                  BindingDisplay bindingDisplayForComponent = null;

                  StructureElementBinding childSeb = this
                      .findStructureElementBindingByComponentIdFromStructureElementBinding(fSeb,
                          c.getId());
                  if (childSeb != null) {
                    bindingDisplayForComponent = this.createBindingDisplay(childSeb,
                        segment.getId(), ViewScope.SEGMENT, 1, valueSetsMap,
                        bindingDisplayForComponent);
                  }
                  StructureElementBinding cSeb = this
                      .findStructureElementBindingByComponentIdForDatatype(childDt, c.getId());
                  if (cSeb != null) {
                    bindingDisplayForComponent = this.createBindingDisplay(cSeb, childDt.getId(),
                        ViewScope.DATATYPE, 2, valueSetsMap, bindingDisplayForComponent);
                  }

                  if (bindingDisplayForComponent != null
                      && bindingDisplayForComponent.getPredicate() != null) {
                    Predicate p = bindingDisplayForComponent.getPredicate();
                    if (p.getTrueUsage() != null && p.getFalseUsage() != null) {
                      cModel.setTrueUsage(p.getTrueUsage());
                      cModel.setFalseUsage(p.getFalseUsage());
                      cModel.setPredicate(p);
                      if (p.getIdentifier() != null)
                        cModel.getPredicate().setIdentifier(c.getId());
                    }
                  }
                  cModel.setBinding(bindingDisplayForComponent);

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

                          BindingDisplay bindingDisplayForSubComponent = null;

                          StructureElementBinding childChildSeb = this
                              .findStructureElementBindingByComponentIdFromStructureElementBinding(
                                  childSeb, sc.getId());
                          if (childChildSeb != null) {
                            bindingDisplayForSubComponent = this.createBindingDisplay(
                                childChildSeb, segment.getId(), ViewScope.SEGMENT, 1,
                                valueSetsMap, bindingDisplayForSubComponent);
                          }

                          StructureElementBinding childCSeb = this
                              .findStructureElementBindingByComponentIdFromStructureElementBinding(
                                  cSeb, sc.getId());
                          if (childCSeb != null) {
                            bindingDisplayForSubComponent = this.createBindingDisplay(
                                childCSeb, childDt.getId(), ViewScope.DATATYPE, 2,
                                valueSetsMap, bindingDisplayForSubComponent);
                          }

                          StructureElementBinding scSeb = this
                              .findStructureElementBindingByComponentIdForDatatype(
                                  childChildDt, sc.getId());
                          if (scSeb != null) {
                            bindingDisplayForSubComponent = this.createBindingDisplay(scSeb,
                                childChildDt.getId(), ViewScope.DATATYPE, 3,
                                valueSetsMap, bindingDisplayForSubComponent);
                          }

                          if (bindingDisplayForSubComponent != null
                              && bindingDisplayForSubComponent.getPredicate() != null) {
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

  /*
   * (non-Javadoc)
   * 
   * @see gov.nist.hit.hl7.igamt.segment.service.SegmentService#
   * findDisplayFormatByScopeAndVersion(java. lang.String, java.lang.String)
   */
  @Override
  public List<Segment> findDisplayFormatByScopeAndVersion(Scope scope, String version, String username) {
    Criteria criteria = new Criteria();
    criteria.and("domainInfo.scope").is(scope);
    criteria.and("domainInfo.version").is(version);

    if(!scope.equals(Scope.HL7STANDARD)) {
      criteria.and("username").in(username);
    }

    if(scope.equals(Scope.USERCUSTOM)) {
      criteria.and("status").is(Status.PUBLISHED);
    }

    Query qry = Query.query(criteria);
    qry.fields().include("domainInfo");
    qry.fields().include("id");
    qry.fields().include("name");
    qry.fields().include("ext");
    qry.fields().include("description");
    qry.fields().include("fixedExtension");
    qry.fields().include("structureIdentifier");


    return mongoTemplate.find(qry, Segment.class);
  }
  /**
   * TODO: anything more to validate ??
   */
  @Override
  public void validate(SegmentDynamicMapping dynamicMapping) throws SegmentValidationException {
    if (dynamicMapping != null) {
    }
  }


  @Override
  public List<Valueset> getDependentValueSets(Set<Segment> resources) {
    Set<String> valueSetIds = resources.stream()
        .map(Segment::getBinding)
        .filter(Objects::nonNull)
        .flatMap(resourceBinding -> bindingService.processBinding(resourceBinding).stream())
        .collect(Collectors.toSet());
    return valueSetService.findByIdIn(valueSetIds);
  }

  @Override
  public Segment saveDynamicMapping(SegmentDynamicMapping dynamicMapping)
      throws SegmentNotFoundException, SegmentValidationException, ForbiddenOperationException {
    validate(dynamicMapping);
    Segment segment = findById(dynamicMapping.getId());
    if (segment == null) {
      throw new SegmentNotFoundException(dynamicMapping.getId());
    }
    segment.setDynamicMappingInfo(dynamicMapping.getDynamicMappingInfo());
    return save(segment);
  }


  void removeElementBindings(String location, Binding binding) {
    StructureElementBinding found = this.findStructureElementBindingByIdFromBinding(binding, location);
    if (found != null) {
      binding.getChildren().remove(found);
    }
  }

  private StructureElementBinding findStructureElementBindingByIdFromBinding(Binding binding, String id) {
    if (binding != null && binding.getChildren() != null) {
      for (StructureElementBinding child : binding.getChildren()) {
        if (child.getElementId().equals(id))
          return child;
      }
    }
    return null;
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
      if (seb.getSingleCodeBindings() != null && !seb.getSingleCodeBindings().isEmpty()) {
        bindingDisplay.setSingleCodeBindings(seb.getSingleCodeBindings());
      } else {
        Set<DisplayValuesetBinding> displayValuesetBindings = this.covertDisplayVSBinding(seb.getValuesetBindings(), valueSetsMap);
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

    bindingDisplay.setChangeLog(seb.getChangeLog());
    return bindingDisplay;
  }

  private Set<DisplayValuesetBinding> covertDisplayVSBinding(Set<ValuesetBinding> valuesetBindings,
      HashMap<String, Valueset> valueSetsMap) {
    if (valuesetBindings != null) {
      Set<DisplayValuesetBinding> result = new HashSet<DisplayValuesetBinding>();
      for (ValuesetBinding vb : valuesetBindings) {

        DisplayValuesetBinding dvb = new DisplayValuesetBinding();

        List<DisplayElement> vsDisplay = vb.getValueSets().stream().map(id -> {
          Valueset vs = this.valueSetService.findById(id);
          if (vs != null) {
            DisplayElement obj = new DisplayElement();
            obj.setVariableName(vs.getBindingIdentifier());
            obj.setDomainInfo(vs.getDomainInfo());
            return obj;
          } else {
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
            fModel.setBinding(this.createBindingDisplay(fSeb, segment.getId(), ViewScope.SEGMENT, 2,
                valueSetsMap, null));
            if (fSeb.getPredicate() != null) {
              Predicate p = fSeb.getPredicate();
              if (p.getTrueUsage() != null && p.getFalseUsage() != null) {
                fModel.setTrueUsage(p.getTrueUsage());
                fModel.setFalseUsage(p.getFalseUsage());
                fModel.setPredicate(p);
                if (p.getIdentifier() != null)
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

                  BindingDisplay bindingDisplayForComponent = null;

                  StructureElementBinding childSeb = this
                      .findStructureElementBindingByComponentIdFromStructureElementBinding(fSeb,
                          c.getId());
                  if (childSeb != null) {
                    bindingDisplayForComponent = this.createBindingDisplay(childSeb,
                        segment.getId(), ViewScope.SEGMENT, 1, valueSetsMap,
                        bindingDisplayForComponent);
                  }
                  StructureElementBinding cSeb = this
                      .findStructureElementBindingByComponentIdForDatatype(childDt, c.getId());
                  if (cSeb != null) {
                    bindingDisplayForComponent = this.createBindingDisplay(cSeb, childDt.getId(),
                        ViewScope.DATATYPE, 2, valueSetsMap, bindingDisplayForComponent);
                  }

                  if (bindingDisplayForComponent != null
                      && bindingDisplayForComponent.getPredicate() != null) {
                    Predicate p = bindingDisplayForComponent.getPredicate();
                    if (p.getTrueUsage() != null && p.getFalseUsage() != null) {
                      cModel.setTrueUsage(p.getTrueUsage());
                      cModel.setFalseUsage(p.getFalseUsage());
                      cModel.setPredicate(p);
                      if (p.getIdentifier() != null)
                        cModel.getPredicate().setIdentifier(c.getId());
                    }
                  }
                  cModel.setBinding(bindingDisplayForComponent);
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

                          BindingDisplay bindingDisplayForSubComponent = null;

                          StructureElementBinding childChildSeb = this
                              .findStructureElementBindingByComponentIdFromStructureElementBinding(
                                  childSeb, sc.getId());
                          if (childChildSeb != null) {
                            bindingDisplayForSubComponent = this.createBindingDisplay(
                                childChildSeb, segment.getId(), ViewScope.SEGMENT, 1,
                                valueSetsMap, bindingDisplayForSubComponent);
                          }

                          StructureElementBinding childCSeb = this
                              .findStructureElementBindingByComponentIdFromStructureElementBinding(
                                  cSeb, sc.getId());
                          if (childCSeb != null) {
                            bindingDisplayForSubComponent = this.createBindingDisplay(
                                childCSeb, childDt.getId(), ViewScope.DATATYPE, 2,
                                valueSetsMap, bindingDisplayForSubComponent);
                          }

                          StructureElementBinding scSeb = this
                              .findStructureElementBindingByComponentIdForDatatype(
                                  childChildDt, sc.getId());
                          if (scSeb != null) {
                            bindingDisplayForSubComponent = this.createBindingDisplay(scSeb,
                                childChildDt.getId(), ViewScope.DATATYPE, 3,
                                valueSetsMap, bindingDisplayForSubComponent);
                          }

                          if (bindingDisplayForSubComponent != null
                              && bindingDisplayForSubComponent.getPredicate() != null) {
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
  public void collectAssoicatedConformanceStatements(Segment segment,
      HashMap<String, ConformanceStatementsContainer> associatedConformanceStatementMap) {
    if (segment.getDomainInfo().getScope().equals(Scope.USER)) {
      for (Field f : segment.getChildren()) {
        Datatype dt = this.datatypeService.findById(f.getRef().getId());
        if (dt.getDomainInfo().getScope().equals(Scope.USER)) {
          if (dt.getBinding() != null && dt.getBinding().getConformanceStatements() != null
              && dt.getBinding().getConformanceStatements().size() > 0) {
            if (!associatedConformanceStatementMap.containsKey(dt.getLabel()))
              associatedConformanceStatementMap.put(dt.getLabel(),
                  new ConformanceStatementsContainer(dt.getBinding().getConformanceStatements(),
                      Type.DATATYPE, dt.getId(), dt.getLabel()));
            this.datatypeService.collectAssoicatedConformanceStatements(dt,
                associatedConformanceStatementMap);
          }
        }
      }
    }
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
    return segmentRepository.findByIdIn(ids);
  }

  @Override
  public void collectResources(Segment seg, HashMap<String, Resource> used) {
    Set<String> usedDatatypesIds = this.getSegmentDatatypesDependenciesIds(seg, used);
    List<Datatype> usedDatatypes = this.datatypeService.findByIdIn(usedDatatypesIds);
    for (Datatype d : usedDatatypes) {
      used.put(d.getId(), d);
      this.datatypeService.collectResources(d, used);
    }
  }

  private Set<String> getSegmentDatatypesDependenciesIds(Segment segment, HashMap<String, Resource> used) {
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

  /*
   * (non-Javadoc)
   * 
   * @see gov.nist.hit.hl7.igamt.segment.service.SegmentService#
   * updateSegmentByChangeItems(gov.nist.hit. hl7.igamt.segment.domain.Segment,
   * java.util.List)
   */

  @Override
  public void applyChanges(Segment s, List<ChangeItemDomain> cItems)  throws ApplyChangeException, ForbiddenOperationException {
    //Resource part
    Map<PropertyType,ChangeItemDomain> singlePropertyMap = applyChange.convertToSingleChangeMap(cItems);
    applyChange.applyResourceChanges(s, singlePropertyMap);

    if (singlePropertyMap.containsKey(PropertyType.EXT)) {
      s.setExt((String) singlePropertyMap.get(PropertyType.EXT).getPropertyValue());
    }

    Map<PropertyType, List<ChangeItemDomain>> map = applyChange.convertToMultiplePropertyChangeMap(cItems);
    this.applyChildrenChange(map, s.getChildren());

    applyChange.applyBindingChanges(map, s.getBinding(), Level.SEGMENT);
    if(map.containsKey(PropertyType.SLICING)) {
    if(s.getSlicings() == null) {
      s.setSlicings(new HashSet<Slicing>());
    }
    applyChange.applySlicingChanges(map, s.getSlicings(), Type.SEGMENT);
    }
    if(s.getName().equals("OBX")) {
      this.applyDynamicMappingChanges(map, s);
    }
    s.setBinding(this.makeLocationInfo(s));
    this.save(s);
  }

  /**
   * @param map
   * @param children
   * @param documentId
   * @throws ApplyChangeException 
   */
  private void applyChildrenChange(Map<PropertyType, List<ChangeItemDomain>> map,
      Set<Field> children) throws ApplyChangeException {

    applyChange.applySubstructureElementChanges(map, children, applyChange::findStructElementById);

    if (map.containsKey(PropertyType.CARDINALITYMIN)) {
      applyChange.applyAll(map.get(PropertyType.CARDINALITYMIN), children, this::applyCardMin, applyChange::findStructElementById);
    }

    if (map.containsKey(PropertyType.CARDINALITYMAX)) {
      applyChange.applyAll(map.get(PropertyType.CARDINALITYMAX), children, this::applyCardMax, applyChange::findStructElementById);
    } 
  }

  public void applyCardMin( ChangeItemDomain change, Field f) {
    change.setOldPropertyValue(f.getMin());
    if (change.getPropertyValue() == null) {
      f.setMin(0);
    } else {
      f.setMin((Integer) change.getPropertyValue());
    }
  }

  public void applyCardMax( ChangeItemDomain change, Field f) {
    change.setOldPropertyValue(f.getMax());
    if (change.getPropertyValue() == null) {
      f.setMax("NA");
    } else {
      f.setMax((String) change.getPropertyValue());
    }
  }

  /**
   * @param map
   * @param s
   * @param documentId
   */
  private void applyDynamicMappingChanges(Map<PropertyType, List<ChangeItemDomain>> map, Segment s) {
    if(map.containsKey(PropertyType.DYNAMICMAPPINGITEM)) {
      for(ChangeItemDomain item: map.get(PropertyType.DYNAMICMAPPINGITEM)) {
        String value = (String)item.getPropertyValue();
        String location = (String)item.getLocation();
        if(s.getDynamicMappingInfo().getItems() ==null) {
          s.getDynamicMappingInfo().setItems(new HashSet<DynamicMappingItem>());
        }
        if(item.getChangeType().equals(ChangeType.DELETE)) {
          s.getDynamicMappingInfo().getItems().removeIf((x) ->  x.getValue().equals((location)));
        }
        else if(item.getChangeType().equals(ChangeType.ADD)) {

          s.getDynamicMappingInfo().getItems().removeIf((x) ->  x.getValue().equals((location)));
          s.getDynamicMappingInfo().getItems().add(new DynamicMappingItem(value,location ));
        }else if(item.getChangeType().equals(ChangeType.UPDATE)) {
          s.getDynamicMappingInfo().getItems().removeIf((x) ->  x.getValue().equals((location)));
          s.getDynamicMappingInfo().getItems().add(new DynamicMappingItem(value,location ));
        } 
      }
    }
    if(map.containsKey(PropertyType.VALUESET)) {
      if( map.get(PropertyType.VALUESET).stream().anyMatch(x -> "2".equals(x.getLocation()))){
        this.restoreDefaultDynamicMapping(s);
      }
    }

  }

  public void applyStructure(Segment segment, List<ChangeItemDomain> cItems)
      throws Exception {
    ObjectMapper mapper = new ObjectMapper();
    mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    Map<ChangeType, List<ChangeItemDomain>> structureChangeItems = cItems
        .stream()
        .filter(c -> c.getPropertyType().equals(PropertyType.FIELD))
        .collect(Collectors.groupingBy(ChangeItemDomain::getChangeType));

    // REMOVE FROM STRUCTURE
    if(structureChangeItems.containsKey(ChangeType.DELETE)) {
      for(ChangeItemDomain structDelete: structureChangeItems.get(ChangeType.DELETE)) {
        // Make sure position does exist
        Optional<Field> element = segment.getChildren().stream().filter(elm -> elm.getPosition() == structDelete.getPosition()).findFirst();
        if(element.isPresent()) {

          // Remove Bindings
          this.removeElementBindings(element.get().getId(), segment.getBinding());
          segment.getChildren().remove(element.get());
        } else {
          throw new Exception("At path " + structDelete.getLocation() + " cannot remove field to position " + structDelete.getPosition() + " (Does not Exists)");
        }
      }
    }


    // ADD TO STRUCTURE
    if(structureChangeItems.containsKey(ChangeType.ADD)) {
      for(ChangeItemDomain structAdd: structureChangeItems.get(ChangeType.ADD)) {
        // Make sure position does not exist
        if(segment.getChildren().stream().noneMatch(elm -> elm.getPosition() == structAdd.getPosition())) {
          String jsonInString = mapper.writeValueAsString(structAdd.getPropertyValue());
          Field field = mapper.readValue(jsonInString, Field.class);
          field.setCustom(true);

          // Can only add at the end
          if((segment.getChildren().size() + 1) == field.getPosition()) {
            segment.getChildren().add(field);
          } else {
            throw new Exception("At path " + structAdd.getLocation() + " cannot add field to position " + structAdd.getPosition() + " (Not End Of Segment)");
          }
        } else {
          throw new Exception("At path " + structAdd.getLocation() + " cannot add field to position " + structAdd.getPosition() + " (Already Exists)");
        }
      }
    }
  }

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.segment.service.SegmentService#restoreDefaultDynamicMapping(gov.nist.hit.hl7.igamt.segment.domain.Segment)
   */
  @Override
  public void restoreDefaultDynamicMapping(Segment segment) {
    Valueset source = null; 
    String valueSetId = findObx2VsId(segment);
    if (valueSetId !=null) {
      source = valueSetService.findById(valueSetId);
    }
    segment.getDynamicMappingInfo().setItems(new HashSet<DynamicMappingItem>());
    if(source !=null) {
      for(Code c : source.getCodes()) {
        if(c.getValue() !=null && c.getUsage() != CodeUsage.E) {
          Datatype d = datatypeService.findOneByNameAndVersionAndScope(c.getValue(),segment.getDomainInfo().getVersion(), Scope.HL7STANDARD.toString());
          if(d != null) {
            segment.getDynamicMappingInfo().addItem(new DynamicMappingItem(d.getId(), c.getValue()));
          }
        }
      }
    }
  }

  @Override
  public Set<DisplayElement> convertSegments(Set<Segment> segments) {
    Set<DisplayElement> ret = new HashSet<DisplayElement>();
    for(Segment seg : segments ) {
      ret.add(this.convertSegment(seg));
    }
    return ret;
  }

  @Override
  public DisplayElement convertSegment(Segment segment) {
    DisplayElement displayElement= new DisplayElement();
    displayElement.setId(segment.getId());
    displayElement.setDomainInfo(segment.getDomainInfo());
    displayElement.setDescription(segment.getDescription());
    displayElement.setResourceName(segment.getName());
    displayElement.setFixedName(segment.getName());
    displayElement.setVariableName(segment.getExt());
    if(segment.getFixedExtension() !=null && !segment.getFixedExtension().isEmpty()) {
        displayElement.setFixedName(segment.getName() + "#"+ segment.getFixedExtension());
    }
    displayElement.setStructureIdentifier(segment.getStructureIdentifier());
    displayElement.setFlavorExt(segment.getFixedExtension());
    displayElement.setDifferantial(segment.isDerived());
    displayElement.setLeaf(false);
    displayElement.setType(Type.SEGMENT);
    displayElement.setOrigin(segment.getOrigin());
    displayElement.setParentId(segment.getParentId());
    displayElement.setParentType(segment.getParentType());
    displayElement.setStatus(segment.getStatus());
    displayElement.setDerived(segment.isDerived());
    return displayElement;
  }

  @Override
  public Set<DisplayElement> convertSegmentRegistry(SegmentRegistry registry) {
    Set<String> ids= registry.getChildren().stream().map(Link::getId).collect(Collectors.toSet());
    List<Segment> segments = this.findByIdIn(ids);
    Set<DisplayElement> ret = new HashSet<DisplayElement>();
    for(Segment seg : segments) {
      ret.add(convertSegment(seg));
    }
    return ret;
  }

  @Override
  public String findObx2VsId(Segment s) {
    // TODO Auto-generated method stub
    if(s.getBinding() != null && s.getBinding().getChildren() != null) {
      for(StructureElementBinding child : s.getBinding().getChildren()) {
        if(child.getLocationInfo() != null && child.getLocationInfo().getPosition() ==2) {
          if(child.getValuesetBindings() != null) {
            Optional<ValuesetBinding> vs = child.getValuesetBindings().stream().findAny();
            if(vs.isPresent() && vs.get().getValueSets() !=null && !vs.get().getValueSets().isEmpty()) {
              return vs.get().getValueSets().get(0);
            }
          }
        }
      }
    }
    return null;
  }
  

	private String str(String value) {
		return value != null ? value : "";
	}

  public String getSegmentIdentifier(Segment resource, String defaultHL7Version) {
    String identifier = str(resource.getLabel());
    String resourceVersion = resource.getDomainInfo().getVersion();
    boolean defaultVersionIsSet = defaultHL7Version != null && !defaultHL7Version.isEmpty();
    boolean versionIsSet = resourceVersion != null && !resourceVersion.isEmpty();
    boolean isDefaultHL7Version = defaultVersionIsSet && versionIsSet && defaultHL7Version.equals(resourceVersion);
    if(versionIsSet && !isDefaultHL7Version) {
      identifier = identifier + "_" + resourceVersion.replaceAll("\\.", "-");
    }
    return identifier;
  }

  public String findXMLRefIdById(Segment segment, String defaultHL7Version) {
    return getSegmentIdentifier(segment, defaultHL7Version);
  }

  @Override
  public List<Segment> saveAll(Set<Segment> segments) throws ForbiddenOperationException {
  	this.operationService.verifySave(segments);
    return this.segmentRepository.saveAll(segments);
  }


}
