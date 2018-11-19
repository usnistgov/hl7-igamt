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

import static org.springframework.data.mongodb.core.aggregation.Aggregation.group;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.match;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.newAggregation;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import gov.nist.hit.hl7.igamt.coconstraints.domain.CoConstraintTable;
import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.Ref;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.Usage;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
import gov.nist.hit.hl7.igamt.common.base.domain.display.ViewScope;
import gov.nist.hit.hl7.igamt.common.base.exception.ValidationException;
import gov.nist.hit.hl7.igamt.common.base.util.ValidationUtil;
import gov.nist.hit.hl7.igamt.common.binding.domain.Comment;
import gov.nist.hit.hl7.igamt.common.binding.domain.ExternalSingleCode;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.display.BindingDisplay;
import gov.nist.hit.hl7.igamt.common.binding.domain.display.DisplayValuesetBinding;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.ChangeItemDomain;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.igamt.common.constraint.domain.ConformanceStatement;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Component;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.display.ComponentDisplayDataModel;
import gov.nist.hit.hl7.igamt.datatype.domain.display.ComponentStructureTreeModel;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DatatypeLabel;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DisplayMetadata;
import gov.nist.hit.hl7.igamt.datatype.domain.display.PostDef;
import gov.nist.hit.hl7.igamt.datatype.domain.display.PreDef;
import gov.nist.hit.hl7.igamt.datatype.domain.display.SubComponentDisplayDataModel;
import gov.nist.hit.hl7.igamt.datatype.domain.display.SubComponentStructureTreeModel;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.segment.domain.DynamicMappingInfo;
import gov.nist.hit.hl7.igamt.segment.domain.Field;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.domain.display.CodeInfo;
import gov.nist.hit.hl7.igamt.segment.domain.display.FieldDisplayDataModel;
import gov.nist.hit.hl7.igamt.segment.domain.display.FieldStructureTreeModel;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentConformanceStatement;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentDynamicMapping;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentStructureDisplay;
import gov.nist.hit.hl7.igamt.segment.exception.SegmentNotFoundException;
import gov.nist.hit.hl7.igamt.segment.exception.SegmentValidationException;
import gov.nist.hit.hl7.igamt.segment.repository.SegmentRepository;
import gov.nist.hit.hl7.igamt.segment.serialization.exception.CoConstraintSaveException;
import gov.nist.hit.hl7.igamt.segment.service.CoConstraintService;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.valueset.domain.Code;
import gov.nist.hit.hl7.igamt.valueset.domain.CodeRef;
import gov.nist.hit.hl7.igamt.valueset.domain.CodeSystem;
import gov.nist.hit.hl7.igamt.valueset.domain.InternalCode;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.service.CodeSystemService;
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
  private CoConstraintService coConstraintService;

  @Autowired
  private MongoTemplate mongoTemplate;

  @Autowired
  DatatypeService datatypeService;

  @Autowired
  ValuesetService valueSetService;

  @Autowired
  private CodeSystemService codeSystemService;

  @Override
  public Segment findById(String key) {
    return segmentRepository.findById(key).get();
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
    return segmentRepository.findAll();
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
    return findByDomainInfoScope(scope);
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
  public List<Segment> findByDomainInfoScopeAndDomainInfoVersionAndName(String scope,
      String version, String name) {
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
  public SegmentStructureDisplay convertDomainToDisplayStructure(Segment segment) {
    HashMap<String, Valueset> valueSetsMap = new HashMap<String, Valueset>();
    HashMap<String, Datatype> datatypesMap = new HashMap<String, Datatype>();

    SegmentStructureDisplay result = new SegmentStructureDisplay();
    result.setId(null);
    result.setScope(segment.getDomainInfo().getScope());
    result.setVersion(segment.getDomainInfo().getVersion());
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
          StructureElementBinding fSeb = this.findStructureElementBindingByFieldIdForSegment(segment, f.getId());
          if (fSeb != null) fModel.addBinding(this.createBindingDisplay(fSeb, segment.getId(), ViewScope.SEGMENT, 1, valueSetsMap));
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
                  StructureElementBinding childSeb = this.findStructureElementBindingByComponentIdFromStructureElementBinding(fSeb, c.getId());
                  if (childSeb != null) cModel.addBinding(this.createBindingDisplay(childSeb, segment.getId(), ViewScope.SEGMENT, 1, valueSetsMap));
                  StructureElementBinding cSeb = this.findStructureElementBindingByComponentIdForDatatype(childDt, c.getId());
                  if (cSeb != null) cModel.addBinding(this.createBindingDisplay(cSeb, childDt.getId(), ViewScope.DATATYPE, 2, valueSetsMap));
                  componentStructureTreeModel.setData(cModel);
                  if (childChildDt instanceof ComplexDatatype) {
                    ComplexDatatype componentDatatype = (ComplexDatatype) childChildDt;
                    if (componentDatatype.getComponents() != null && componentDatatype.getComponents().size() > 0) {
                      for (Component sc : componentDatatype.getComponents()) {
                        Datatype childChildChildDt =
                            this.findDatatype(sc.getRef().getId(), datatypesMap);
                        if (childChildChildDt != null) {
                          SubComponentStructureTreeModel subComponentStructureTreeModel = new SubComponentStructureTreeModel();
                          SubComponentDisplayDataModel scModel = new SubComponentDisplayDataModel(sc);
                          scModel.setViewScope(ViewScope.SEGMENT);
                          scModel.setIdPath(f.getId() + "-" + c.getId() + "-" + sc.getId());
                          scModel.setPath(f.getPosition() + "-" + c.getPosition() + "-" + sc.getPosition());
                          scModel.setDatatypeLabel(this.createDatatypeLabel(childChildChildDt));
                          StructureElementBinding childChildSeb = this.findStructureElementBindingByComponentIdFromStructureElementBinding(childSeb, sc.getId());
                          if (childChildSeb != null) scModel.addBinding(this.createBindingDisplay(childChildSeb, segment.getId(), ViewScope.SEGMENT, 1, valueSetsMap));
                          StructureElementBinding childCSeb = this.findStructureElementBindingByComponentIdFromStructureElementBinding(cSeb, sc.getId());
                          if (childCSeb != null) scModel.addBinding(this.createBindingDisplay(childCSeb, childDt.getId(), ViewScope.DATATYPE, 2, valueSetsMap));
                          StructureElementBinding scSeb = this.findStructureElementBindingByComponentIdForDatatype(childChildDt, sc.getId());
                          if (scSeb != null) scModel.addBinding(this.createBindingDisplay(scSeb, childChildDt.getId(), ViewScope.DATATYPE, 3, valueSetsMap));
                          subComponentStructureTreeModel.setData(scModel);
                          componentStructureTreeModel.addSubComponent(subComponentStructureTreeModel);
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
  private Set<DisplayValuesetBinding> covertDisplayVSBinding(Set<ValuesetBinding> valuesetBindings,
      HashMap<String, Valueset> valueSetsMap) {
    if (valuesetBindings != null) {
      Set<DisplayValuesetBinding> result = new HashSet<DisplayValuesetBinding>();
      for (ValuesetBinding vb : valuesetBindings) {
        Valueset vs = valueSetsMap.get(vb.getValuesetId());
        if (vs == null) {
          vs = this.valueSetService.findById(vb.getValuesetId());
          valueSetsMap.put(vs.getId(), vs);
        }
        if (vs != null) {
          DisplayValuesetBinding dvb = new DisplayValuesetBinding();
          dvb.setLabel(vs.getBindingIdentifier());
          dvb.setName(vs.getName());
          dvb.setStrength(vb.getStrength());
          dvb.setValuesetId(vb.getValuesetId());
          dvb.setValuesetLocations(vb.getValuesetLocations());
          result.add(dvb);
        }
      }
      return result;
    }
    return null;
  }

  /**
   * @param childDt
   * @param id
   * @return
   */
  private StructureElementBinding findStructureElementBindingByComponentIdForDatatype(Datatype dt,
      String cid) {
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
  private StructureElementBinding findStructureElementBindingByFieldIdForSegment(Segment segment,
      String fId) {
    if (segment != null && segment.getBinding() != null
        && segment.getBinding().getChildren() != null) {
      for (StructureElementBinding seb : segment.getBinding().getChildren()) {
        if (seb.getElementId().equals(fId))
          return seb;
      }
    }
    return null;
  }



  @Override
  public DisplayMetadata convertDomainToMetadata(Segment segment) {
    if (segment != null) {
      DisplayMetadata result = new DisplayMetadata();
      result.setAuthorNote(segment.getComment());
      result.setDescription(segment.getDescription());
      result.setExt(segment.getExt());
      result.setId(segment.getId());
      result.setName(segment.getName());
      result.setScope(segment.getDomainInfo().getScope());
      result.setVersion(segment.getDomainInfo().getVersion());
      return result;
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
   * @see
   * gov.nist.hit.hl7.igamt.segment.service.SegmentService#findDisplayFormatByScopeAndVersion(java.
   * lang.String, java.lang.String)
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

  @Override
  public SegmentConformanceStatement convertDomainToConformanceStatement(Segment segment) {
    if (segment != null) {
      SegmentConformanceStatement result = new SegmentConformanceStatement();
      result.setId(segment.getId());
      result.setScope(segment.getDomainInfo().getScope());
      result.setVersion(segment.getDomainInfo().getVersion());
      if (segment.getExt() != null) {
        result.setLabel(segment.getName() + segment.getExt());
      } else {
        result.setLabel(segment.getName());
      }

      result.setName(segment.getName());
      result.setUpdateDate(segment.getUpdateDate());

      result.setConformanceStatements(segment.getBinding().getConformanceStatements());
      return result;
    }
    return null;
  }

  @Override
  public SegmentDynamicMapping convertDomainToSegmentDynamicMapping(Segment segment) {
    if (segment != null) {
      SegmentDynamicMapping result = new SegmentDynamicMapping();
      result.setId(segment.getId());
      result.setScope(segment.getDomainInfo().getScope());
      result.setVersion(segment.getDomainInfo().getVersion());
      if (segment.getExt() != null) {
        result.setLabel(segment.getName() + segment.getExt());
      } else {
        result.setLabel(segment.getName());
      }
      result.setName(segment.getName());
      result.setUpdateDate(segment.getUpdateDate());
      result.setDynamicMappingInfo(segment.getDynamicMappingInfo());

      if (segment.getName().equals("OBX")) {
        for (Field field : segment.getChildren()) {
          if (field.getPosition() == 2) {
            result.getDynamicMappingInfo().setReferenceFieldId(field.getId());
          } else if (field.getPosition() == 5) {
            result.getDynamicMappingInfo().setVariesFieldId(field.getId());
          }
        }

        if (segment.getBinding() != null && segment.getBinding().getChildren() != null) {
          for (StructureElementBinding structureElementBinding : segment.getBinding()
              .getChildren()) {
            if (structureElementBinding.getElementId()
                .equals(result.getDynamicMappingInfo().getReferenceFieldId())) {
              if (structureElementBinding.getValuesetBindings() != null) {
                for (ValuesetBinding valuesetBinding : structureElementBinding
                    .getValuesetBindings()) {
                  Valueset vs = valueSetService.findById(valuesetBinding.getValuesetId());
                  if (vs.getCodeRefs() != null) {
                    for (CodeRef codeRef : vs.getCodeRefs()) {
                      CodeSystem codeSystem =
                          codeSystemService.findById(codeRef.getCodeSystemId());
                      Code code = codeSystem.findCode(codeRef.getCodeId());
                      CodeInfo codeInfo = new CodeInfo();
                      codeInfo.setCode(code.getValue());
                      codeInfo.setDescription(code.getDescription());
                      result.addReferenceCode(codeInfo);
                    }
                  }

                  if (vs.getCodes() != null) {
                    for (InternalCode iCode : vs.getCodes()) {
                      CodeInfo codeInfo = new CodeInfo();
                      codeInfo.setCode(iCode.getValue());
                      codeInfo.setDescription(iCode.getDescription());
                      result.addReferenceCode(codeInfo);
                    }
                  }
                }
              }
            }
          }
        }
      }

      return result;
    }
    return null;
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


  @Override
  public void validate(DisplayMetadata metadata) throws SegmentValidationException {
    if (!metadata.getScope().equals(Scope.HL7STANDARD)) {
      if (StringUtils.isEmpty(metadata.getName())) {
        throw new SegmentValidationException("Name is missing");
      }
      if (StringUtils.isEmpty(metadata.getExt())) {
        throw new SegmentValidationException("Ext is missing");
      }
    }
  }



  /**
   * TODO: anything more to validate ??
   */
  @Override
  public void validate(SegmentConformanceStatement conformanceStatement)
      throws SegmentValidationException {
    if (conformanceStatement != null) {
      for (ConformanceStatement statement : conformanceStatement.getConformanceStatements()) {
        if (StringUtils.isEmpty(statement.getIdentifier())) {
          throw new SegmentValidationException("conformance statement identifier is missing");
        }
      }
    }
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
  public Segment savePredef(PreDef predef) throws SegmentNotFoundException {
    Segment segment = findById(predef.getId());
    if (segment == null) {
      throw new SegmentNotFoundException(predef.getId());
    }
    segment.setPreDef(predef.getPreDef());
    return save(segment);
  }

  @Override
  public Segment savePostdef(PostDef postdef) throws SegmentNotFoundException {
    Segment segment = findById(postdef.getId());
    if (segment == null) {
      throw new SegmentNotFoundException(postdef.getId());
    }
    segment.setPostDef(postdef.getPostDef());
    return save(segment);
  }


  @Override
  public Segment saveMetadata(DisplayMetadata metadata)
      throws SegmentNotFoundException, SegmentValidationException {
    validate(metadata);
    Segment segment = findById(metadata.getId());
    if (segment == null) {
      throw new SegmentNotFoundException(metadata.getId());
    }
    segment.setExt(metadata.getExt());
    segment.setDescription(metadata.getDescription());
    segment.setComment(metadata.getAuthorNote());
    return save(segment);
  }


  @Override
  public Segment saveConformanceStatement(SegmentConformanceStatement conformanceStatement)
      throws SegmentNotFoundException, SegmentValidationException {
    validate(conformanceStatement);
    Segment segment = findById(conformanceStatement.getId());
    if (segment == null) {
      throw new SegmentNotFoundException(conformanceStatement.getId());
    }
    segment.getBinding().setConformanceStatements(conformanceStatement.getConformanceStatements());
    return save(segment);
  }

  /*
   * (non-Javadoc)
   * 
   * @see gov.nist.hit.hl7.igamt.segment.service.SegmentService#cloneSegment(java.util.HashMap,
   * java.util.HashMap, gov.nist.hit.hl7.igamt.common.base.domain.Link, java.lang.String)
   */
  @Override
  public Link cloneSegment(String key, HashMap<String, String> datatypesMap,
      HashMap<String, String> valuesetsMap, Link l, String username)
      throws CoConstraintSaveException {

    Segment obj = this.findById(l.getId());
    Segment elm = obj.clone();

    Link newLink = new Link();
    newLink.setId(key);
    elm.setFrom(elm.getId());
    elm.setId(newLink.getId());
    updateDependencies(elm, datatypesMap, valuesetsMap, username);

    this.save(elm);
    return newLink;

  }

  /**
   * @param elm
   * @param datatypesMap
   * @param valuesetsMap
   * @throws CoConstraintSaveException
   */
  private void updateDependencies(Segment elm, HashMap<String, String> datatypesMap,
      HashMap<String, String> valuesetsMap, String username)
      throws CoConstraintSaveException {
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
    updateCoConstraint(elm, datatypesMap, valuesetsMap, username);



  }

  private void updateCoConstraint(Segment elm, HashMap<String, String> datatypesMap,
      HashMap<String, String> valuesetsMap, String username)
      throws CoConstraintSaveException {
    CoConstraintTable cc = coConstraintService.getCoConstraintForSegment(elm.getId());
    if (cc != null) {
      CoConstraintTable cc_ =
          coConstraintService.clone(datatypesMap, valuesetsMap, elm.getId(), cc);
      coConstraintService.saveCoConstraintForSegment(elm.getId(), cc_, username);
    }

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
            if (vs.getValuesetId() != null) {
              if (valuesetsMap.containsKey(vs.getValuesetId())) {
                vs.setValuesetId(valuesetsMap.get(vs.getValuesetId()));
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
   * @see
   * gov.nist.hit.hl7.igamt.segment.service.SegmentService#updateSegmentByChangeItems(gov.nist.hit.
   * hl7.igamt.segment.domain.Segment, java.util.List)
   */
  @Override
  public void applyChanges(Segment s, List<ChangeItemDomain> cItems) throws IOException {
    Collections.sort(cItems);
    for (ChangeItemDomain item : cItems) {
      if (item.getPropertyType().equals(PropertyType.USAGE)) {
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
        StructureElementBinding seb =
            this.findAndCreateStructureElementBindingByIdPath(s, item.getLocation());
        item.setOldPropertyValue(seb.getValuesetBindings());
        seb.setValuesetBindings(
            this.convertDisplayValuesetBinding(new HashSet<DisplayValuesetBinding>(
                Arrays.asList(mapper.readValue(jsonInString, DisplayValuesetBinding[].class)))));
      } else if (item.getPropertyType().equals(PropertyType.SINGLECODE)) {
        ObjectMapper mapper = new ObjectMapper();
        String jsonInString = mapper.writeValueAsString(item.getPropertyValue());
        StructureElementBinding seb =
            this.findAndCreateStructureElementBindingByIdPath(s, item.getLocation());
        item.setOldPropertyValue(seb.getExternalSingleCode());
        seb.setExternalSingleCode(mapper.readValue(jsonInString, ExternalSingleCode.class));
      } else if (item.getPropertyType().equals(PropertyType.CONSTANTVALUE)) {
        StructureElementBinding seb =
            this.findAndCreateStructureElementBindingByIdPath(s, item.getLocation());
        item.setOldPropertyValue(seb.getConstantValue());
        if (item.getPropertyValue() == null) {
          seb.setConstantValue(null);
        } else {
          seb.setConstantValue((String) item.getPropertyValue());
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
        StructureElementBinding seb =
            this.findAndCreateStructureElementBindingByIdPath(s, item.getLocation());
        item.setOldPropertyValue(seb.getComments());
        seb.setComments(
            new HashSet<Comment>(Arrays.asList(mapper.readValue(jsonInString, Comment[].class))));
      }
    }
    this.save(s);
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
        vb.setValuesetId(dvb.getValuesetId());
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
  private StructureElementBinding findAndCreateStructureElementBindingByIdPath(Segment s,
      String location) {
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
  private StructureElementBinding findAndCreateStructureElementBindingByIdPath(
      ResourceBinding binding, String location) {
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
  private StructureElementBinding findAndCreateStructureElementBindingByIdPath(
      StructureElementBinding binding, String location) {
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

  private BindingDisplay createBindingDisplay(StructureElementBinding seb, String sourceId,
      ViewScope sourceType, int priority, HashMap<String, Valueset> valueSetsMap) {
    BindingDisplay bindingDisplay = new BindingDisplay();
    bindingDisplay.setSourceId(sourceId);
    bindingDisplay.setSourceType(sourceType);
    bindingDisplay.setPriority(priority);
    bindingDisplay.setComments(seb.getComments());
    bindingDisplay.setConstantValue(seb.getConstantValue());
    bindingDisplay.setExternalSingleCode(seb.getExternalSingleCode());
    bindingDisplay.setInternalSingleCode(seb.getInternalSingleCode());
    bindingDisplay.setPredicate(seb.getPredicate());
    bindingDisplay.setValuesetBindings(this.covertDisplayVSBinding(seb.getValuesetBindings(), valueSetsMap));
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
}
