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

import gov.nist.hit.hl7.igamt.coconstraints.domain.CoConstraintTable;
import gov.nist.hit.hl7.igamt.common.base.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
import gov.nist.hit.hl7.igamt.common.base.domain.display.ViewScope;
import gov.nist.hit.hl7.igamt.common.base.exception.ValidationException;
import gov.nist.hit.hl7.igamt.common.base.util.ValidationUtil;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.display.BindingDisplay;
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
import gov.nist.hit.hl7.igamt.segment.domain.display.ChangedSegment;
import gov.nist.hit.hl7.igamt.segment.domain.display.CodeInfo;
import gov.nist.hit.hl7.igamt.segment.domain.display.FieldDisplay;
import gov.nist.hit.hl7.igamt.segment.domain.display.FieldDisplayDataModel;
import gov.nist.hit.hl7.igamt.segment.domain.display.FieldStructureTreeModel;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentConformanceStatement;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentDynamicMapping;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentStructure;
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
  public Segment findByKey(CompositeKey key) {
    return segmentRepository.findById(key).get();
  }

  @Override
  public Segment create(Segment segment) {
    segment.setId(new CompositeKey());
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
  public void delete(CompositeKey key) {
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

  @Override
  public Segment getLatestById(String id) {
    Query query = new Query();
    query.addCriteria(Criteria.where("_id._id").is(new ObjectId(id)));
    query.with(new Sort(Sort.Direction.DESC, "_id.version"));
    query.limit(1);
    Segment segment = mongoTemplate.findOne(query, Segment.class);
    return segment;

  }

  /**
   * @deprecated. Use segment.toStructure()
   */
  @Override
  public SegmentStructure convertDomainToStructure(Segment segment) {
    return segment.toStructure();
  }
  
  /**
   * @deprecated. Use segment.toStructure()
   */
  @Override
  public SegmentStructureDisplay convertDomainToDisplayStructure(Segment segment) {
    System.out.println("START!");
    SegmentStructureDisplay result = new SegmentStructureDisplay();
    result.setId(segment.getId());
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
        Datatype childDt = this.datatypeService.findLatestById(f.getRef().getId());
        if(childDt != null){
          FieldStructureTreeModel fieldStructureTreeModel = new FieldStructureTreeModel();
          FieldDisplayDataModel fModel = new FieldDisplayDataModel(f);
          fModel.setViewScope(ViewScope.SEGMENT);
          fModel.setIdPath(f.getId());
          fModel.setPath(f.getPosition() + "");
          DatatypeLabel fieldDatatypeLabel = new DatatypeLabel();
          fieldDatatypeLabel.setDomainInfo(childDt.getDomainInfo());
          fieldDatatypeLabel.setExt(childDt.getExt());
          fieldDatatypeLabel.setId(childDt.getId().getId());
          fieldDatatypeLabel.setLabel(childDt.getLabel());
          if(childDt instanceof ComplexDatatype) fieldDatatypeLabel.setLeaf(false);    
          else fieldDatatypeLabel.setLeaf(true);      
          fieldDatatypeLabel.setName(childDt.getName());
          fModel.setDatatypeLabel(fieldDatatypeLabel);   
          StructureElementBinding fSeb = this.findStructureElementBindingByFieldIdForSegment(segment, f.getId());
          if(fSeb != null){
            BindingDisplay bindingDisplay = new BindingDisplay();
            bindingDisplay.setSourceId(segment.getId().getId());
            bindingDisplay.setSourceType(ViewScope.SEGMENT);
            bindingDisplay.setPriority(1);
            bindingDisplay.setComments(fSeb.getComments());
            bindingDisplay.setConstantValue(fSeb.getConstantValue());
            bindingDisplay.setExternalSingleCode(fSeb.getExternalSingleCode());
            bindingDisplay.setInternalSingleCode(fSeb.getInternalSingleCode());
            bindingDisplay.setPredicate(fSeb.getPredicate());
            bindingDisplay.setValuesetBindings(fSeb.getValuesetBindings());
            fModel.addBinding(bindingDisplay);
          }
          fieldStructureTreeModel.setData(fModel);

          if(childDt instanceof ComplexDatatype) {
            ComplexDatatype fieldDatatype = (ComplexDatatype)childDt;
            if(fieldDatatype.getComponents() != null && fieldDatatype.getComponents().size() > 0){
              for(Component c : fieldDatatype.getComponents()){
                Datatype childChildDt = this.datatypeService.findLatestById(c.getRef().getId());
                if(childChildDt != null){
                  ComponentStructureTreeModel componentStructureTreeModel = new ComponentStructureTreeModel();
                  ComponentDisplayDataModel cModel = new ComponentDisplayDataModel(c);
                  cModel.setViewScope(ViewScope.SEGMENT);
                  cModel.setIdPath(f.getId() + "-" + c.getId());
                  cModel.setPath(f.getPosition() + "-" + c.getPosition());
                  DatatypeLabel componentDatatypeLabel = new DatatypeLabel();
                  componentDatatypeLabel.setDomainInfo(childChildDt.getDomainInfo());
                  componentDatatypeLabel.setExt(childChildDt.getExt());
                  componentDatatypeLabel.setId(childChildDt.getId().getId());
                  componentDatatypeLabel.setLabel(childChildDt.getLabel());
                  if(childChildDt instanceof ComplexDatatype) componentDatatypeLabel.setLeaf(false);    
                  else componentDatatypeLabel.setLeaf(true);      
                  componentDatatypeLabel.setName(childChildDt.getName());
                  cModel.setDatatypeLabel(componentDatatypeLabel);   
                  
                  StructureElementBinding childSeb = this.findStructureElementBindingByComponentIdFromStructureElementBinding(fSeb, c.getId());
                  if(childSeb != null){
                    BindingDisplay bindingDisplay = new BindingDisplay();
                    bindingDisplay.setSourceId(segment.getId().getId());
                    bindingDisplay.setSourceType(ViewScope.SEGMENT);
                    bindingDisplay.setPriority(1);
                    bindingDisplay.setComments(childSeb.getComments());
                    bindingDisplay.setConstantValue(childSeb.getConstantValue());
                    bindingDisplay.setExternalSingleCode(childSeb.getExternalSingleCode());
                    bindingDisplay.setInternalSingleCode(childSeb.getInternalSingleCode());
                    bindingDisplay.setPredicate(childSeb.getPredicate());
                    bindingDisplay.setValuesetBindings(childSeb.getValuesetBindings());
                    cModel.addBinding(bindingDisplay);
                  } 
                  
                  StructureElementBinding cSeb = this.findStructureElementBindingByComponentIdForDatatype(childDt, c.getId());
                  if(cSeb != null){
                    BindingDisplay bindingDisplay = new BindingDisplay();
                    bindingDisplay.setSourceId(childDt.getId().getId());
                    bindingDisplay.setSourceType(ViewScope.DATATYPE);
                    bindingDisplay.setPriority(2);
                    bindingDisplay.setComments(cSeb.getComments());
                    bindingDisplay.setConstantValue(cSeb.getConstantValue());
                    bindingDisplay.setExternalSingleCode(cSeb.getExternalSingleCode());
                    bindingDisplay.setInternalSingleCode(cSeb.getInternalSingleCode());
                    bindingDisplay.setPredicate(cSeb.getPredicate());
                    bindingDisplay.setValuesetBindings(cSeb.getValuesetBindings());
                    cModel.addBinding(bindingDisplay);
                  }
                  componentStructureTreeModel.setData(cModel);
                  if(childChildDt instanceof ComplexDatatype) {
                    ComplexDatatype componentDatatype = (ComplexDatatype)childChildDt;
                    if(componentDatatype.getComponents() != null && componentDatatype.getComponents().size() > 0){
                      for(Component sc : componentDatatype.getComponents()){
                        Datatype childChildChildDt = this.datatypeService.findLatestById(sc.getRef().getId());
                        if(childChildChildDt != null){
                          SubComponentStructureTreeModel subComponentStructureTreeModel = new SubComponentStructureTreeModel();
                          SubComponentDisplayDataModel scModel = new SubComponentDisplayDataModel(sc);
                          scModel.setViewScope(ViewScope.SEGMENT);
                          scModel.setIdPath(f.getId() + "-" + c.getId() + "-" + sc.getId());
                          scModel.setPath(f.getPosition() + "-" + c.getPosition() + "-" + sc.getPosition());
                          DatatypeLabel subComponentDatatypeLabel = new DatatypeLabel();
                          subComponentDatatypeLabel.setDomainInfo(childChildChildDt.getDomainInfo());
                          subComponentDatatypeLabel.setExt(childChildChildDt.getExt());
                          subComponentDatatypeLabel.setId(childChildChildDt.getId().getId());
                          subComponentDatatypeLabel.setLabel(childChildChildDt.getLabel());
                          if(childChildChildDt instanceof ComplexDatatype) subComponentDatatypeLabel.setLeaf(false);    
                          else subComponentDatatypeLabel.setLeaf(true);      
                          subComponentDatatypeLabel.setName(childChildChildDt.getName());
                          scModel.setDatatypeLabel(subComponentDatatypeLabel);   

                          StructureElementBinding childChildSeb = this.findStructureElementBindingByComponentIdFromStructureElementBinding(childSeb, sc.getId());
                          if(childChildSeb != null){
                            BindingDisplay bindingDisplay = new BindingDisplay();
                            bindingDisplay.setSourceId(segment.getId().getId());
                            bindingDisplay.setSourceType(ViewScope.SEGMENT);
                            bindingDisplay.setPriority(1);
                            bindingDisplay.setComments(childChildSeb.getComments());
                            bindingDisplay.setConstantValue(childChildSeb.getConstantValue());
                            bindingDisplay.setExternalSingleCode(childChildSeb.getExternalSingleCode());
                            bindingDisplay.setInternalSingleCode(childChildSeb.getInternalSingleCode());
                            bindingDisplay.setPredicate(childChildSeb.getPredicate());
                            bindingDisplay.setValuesetBindings(childChildSeb.getValuesetBindings());
                            scModel.addBinding(bindingDisplay);
                          }
                          
                          StructureElementBinding childCSeb = this.findStructureElementBindingByComponentIdFromStructureElementBinding(cSeb, sc.getId());
                          if(childCSeb != null){
                            BindingDisplay bindingDisplay = new BindingDisplay();
                            bindingDisplay.setSourceId(childDt.getId().getId());
                            bindingDisplay.setSourceType(ViewScope.DATATYPE);
                            bindingDisplay.setPriority(2);
                            bindingDisplay.setComments(childCSeb.getComments());
                            bindingDisplay.setConstantValue(childCSeb.getConstantValue());
                            bindingDisplay.setExternalSingleCode(childCSeb.getExternalSingleCode());
                            bindingDisplay.setInternalSingleCode(childCSeb.getInternalSingleCode());
                            bindingDisplay.setPredicate(childCSeb.getPredicate());
                            bindingDisplay.setValuesetBindings(childCSeb.getValuesetBindings());
                            scModel.addBinding(bindingDisplay);
                          }
            
                          StructureElementBinding scSeb = this.findStructureElementBindingByComponentIdForDatatype(childChildDt, sc.getId());
                          if(scSeb != null){
                            BindingDisplay bindingDisplay = new BindingDisplay();
                            bindingDisplay.setSourceId(childChildDt.getId().getId());
                            bindingDisplay.setSourceType(ViewScope.DATATYPE);
                            bindingDisplay.setPriority(3);
                            bindingDisplay.setComments(scSeb.getComments());
                            bindingDisplay.setConstantValue(scSeb.getConstantValue());
                            bindingDisplay.setExternalSingleCode(scSeb.getExternalSingleCode());
                            bindingDisplay.setInternalSingleCode(scSeb.getInternalSingleCode());
                            bindingDisplay.setPredicate(scSeb.getPredicate());
                            bindingDisplay.setValuesetBindings(scSeb.getValuesetBindings());
                            scModel.addBinding(bindingDisplay);
                          }
                          subComponentStructureTreeModel.setData(scModel);
                          componentStructureTreeModel.addSubComponent(subComponentStructureTreeModel);
                        }else{
                          //TODO need to handle exception                          
                        }
                      }
                      
                    }
                  }
                  
                  
                  fieldStructureTreeModel.addComponent(componentStructureTreeModel);
                }else{
                  //TODO need to handle exception
                }
              }
            }
            
          }
          result.addField(fieldStructureTreeModel);
        }else {
          //TODO need to handle exception
        }
        
      }
    }
    return result;
  }

  /**
   * @param childDt
   * @param id
   * @return
   */
  private StructureElementBinding findStructureElementBindingByComponentIdForDatatype(Datatype dt, String cid){
    if(dt != null && dt.getBinding() != null && dt.getBinding().getChildren() != null){
      for(StructureElementBinding seb : dt.getBinding().getChildren()){
        if(seb.getElementId().equals(cid)) return seb;
      }
    }
    return null;
  }

  /**
   * @param fSeb
   * @param id
   * @return
   */
  private StructureElementBinding findStructureElementBindingByComponentIdFromStructureElementBinding(StructureElementBinding seb, String cId) {
    if(seb != null && seb.getChildren() != null){
      for(StructureElementBinding child : seb.getChildren()){
        if(child.getElementId().equals(cId)) return seb;
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
    if(segment != null && segment.getBinding() != null && segment.getBinding().getChildren() != null){
      for(StructureElementBinding seb : segment.getBinding().getChildren()){
        if(seb.getElementId().equals(fId)) return seb;
      }
    }
    return null;
  }

  @Override
  public Segment findLatestById(String id) {
    Query query = new Query();
    query.addCriteria(Criteria.where("_id._id").is(new ObjectId(id)));
    query.with(new Sort(Sort.Direction.DESC, "_id.version"));
    query.limit(1);
    Segment segment = mongoTemplate.findOne(query, Segment.class);
    return segment;
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
   * @see gov.nist.hit.hl7.igamt.segment.service.SegmentService#saveMetadata(gov.nist.hit.hl7.igamt.
   * segment.domain.display.SegmentMetadata)
   */
  @Override
  @Deprecated
  public Segment saveSegment(ChangedSegment changedSegment) throws ValidationException {
    if (changedSegment != null && changedSegment.getId() != null) {
      Segment segment = this.findLatestById(changedSegment.getId());

      if (segment != null) {
        if (changedSegment.getMetadata() != null) {
          segment.setDescription(changedSegment.getMetadata().getDescription());
          segment.setExt(changedSegment.getMetadata().getExt());
          segment.setName(changedSegment.getMetadata().getName());
          segment.setComment(changedSegment.getMetadata().getAuthorNote());
          segment.getDomainInfo().setScope(changedSegment.getMetadata().getScope());
          segment.getDomainInfo().setVersion(changedSegment.getMetadata().getVersion());
        }

        if (changedSegment.getPostDef() != null) {
          segment.setPostDef(changedSegment.getPostDef().getPostDef());
        }

        if (changedSegment.getPreDef() != null) {
          segment.setPreDef(changedSegment.getPreDef().getPreDef());
        }

        if (changedSegment.getStructure() != null) {
          segment.setBinding(changedSegment.getStructure().getBinding());
          Set<Field> fields = new HashSet<Field>();
          for (FieldDisplay fd : changedSegment.getStructure().getChildren()) {
            fields.add(fd.getData());
          }
          segment.setChildren(fields);
        }
      }
      return this.save(segment);
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

    Aggregation agg = newAggregation(match(where), group("id.id").max("id.version").as("version"));

    // Convert the aggregation result into a List
    List<CompositeKey> groupResults =
        mongoTemplate.aggregate(agg, Segment.class, CompositeKey.class).getMappedResults();

    Criteria where2 = Criteria.where("id").in(groupResults);
    Query qry = Query.query(where2);
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
                  Valueset vs = valueSetService.findLatestById(valuesetBinding.getValuesetId());
                  if (vs.getCodeRefs() != null) {
                    for (CodeRef codeRef : vs.getCodeRefs()) {
                      CodeSystem codeSystem =
                          codeSystemService.findLatestById(codeRef.getCodeSystemId());
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
    Datatype d = datatypeService.getLatestById(f.getRef().getId());
    if (d == null) {
      throw new SegmentValidationException("Datatype not found");
    }
    ValidationUtil.validateUsage(f.getUsage(), f.getMin());
    ValidationUtil.validateLength(f.getMinLength(), f.getMaxLength());
    ValidationUtil.validateCardinality(f.getMin(), f.getMax(), f.getUsage());
    ValidationUtil.validateConfLength(f.getConfLength());
  }



  /**
   * Validate the structure of the segment
   * 
   * @param structure
   * @throws SegmentValidationException
   */
  @Override
  public void validate(SegmentStructure structure) throws SegmentValidationException {
    if (!structure.getScope().equals(Scope.HL7STANDARD)) {
      if (structure.getChildren() != null) {
        for (FieldDisplay fieldDisplay : structure.getChildren()) {
          Field f = fieldDisplay.getData();
          try {
            validateField(f);
          } catch (ValidationException e) {
            throw new SegmentValidationException(structure.getLabel() + "-" + f.getPosition());
          }
        }
      }
    }
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


  /**
   * TODO
   */
  @Override
  public Segment convertToSegment(SegmentStructure structure) {
    Segment segment = this.findLatestById(structure.getId().getId());
    if (segment != null) {
      segment.setBinding(structure.getBinding());
      if (structure.getChildren() != null) {
        Set<Field> fields = new HashSet<Field>();
        for (FieldDisplay fd : structure.getChildren()) {
          fields.add(fd.getData());
        }
        segment.setChildren(fields);
      }
    }
    return segment;
  }


  @Override
  public Segment savePredef(PreDef predef) throws SegmentNotFoundException {
    Segment segment = findLatestById(predef.getId().getId());
    if (segment == null) {
      throw new SegmentNotFoundException(predef.getId().getId());
    }
    segment.setPreDef(predef.getPreDef());
    return save(segment);
  }

  @Override
  public Segment savePostdef(PostDef postdef) throws SegmentNotFoundException {
    Segment segment = findLatestById(postdef.getId().getId());
    if (segment == null) {
      throw new SegmentNotFoundException(postdef.getId().getId());
    }
    segment.setPostDef(postdef.getPostDef());
    return save(segment);
  }


  @Override
  public Segment saveMetadata(DisplayMetadata metadata)
      throws SegmentNotFoundException, SegmentValidationException {
    validate(metadata);
    Segment segment = findLatestById(metadata.getId().getId());
    if (segment == null) {
      throw new SegmentNotFoundException(metadata.getId().getId());
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
    Segment segment = findLatestById(conformanceStatement.getId().getId());
    if (segment == null) {
      throw new SegmentNotFoundException(conformanceStatement.getId().getId());
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
  public Link cloneSegment(CompositeKey key, HashMap<String, CompositeKey> datatypesMap,
      HashMap<String, CompositeKey> valuesetsMap, Link l, String username)
      throws CoConstraintSaveException {

    Segment obj = this.findByKey(l.getId());
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
  private void updateDependencies(Segment elm, HashMap<String, CompositeKey> datatypesMap,
      HashMap<String, CompositeKey> valuesetsMap, String username)
      throws CoConstraintSaveException {
    // TODO Auto-generated method stub

    for (Field f : elm.getChildren()) {
      if (f.getRef() != null) {
        if (f.getRef().getId() != null) {
          if (datatypesMap.containsKey(f.getRef().getId())) {
            f.getRef().setId(datatypesMap.get(f.getRef().getId()).getId());
          }
        }
      }
    }
    updateBindings(elm.getBinding(), valuesetsMap);
    updateCoConstraint(elm, datatypesMap, valuesetsMap, username);



  }

  private void updateCoConstraint(Segment elm, HashMap<String, CompositeKey> datatypesMap,
      HashMap<String, CompositeKey> valuesetsMap, String username)
      throws CoConstraintSaveException {
    CoConstraintTable cc = coConstraintService.getLatestCoConstraintForSegment(elm.getId().getId());
    if (cc != null) {
      CoConstraintTable cc_ =
          coConstraintService.clone(datatypesMap, valuesetsMap, elm.getId(), cc);
      coConstraintService.saveCoConstraintForSegment(elm.getId().getId(), cc_, username);
    }

  }


  /**
   * @param elm
   * @param valuesetsMap
   */
  private void updateBindings(ResourceBinding binding, HashMap<String, CompositeKey> valuesetsMap) {
    // TODO Auto-generated method stub
    if (binding.getChildren() != null) {
      for (StructureElementBinding child : binding.getChildren()) {
        if (child.getValuesetBindings() != null) {
          for (ValuesetBinding vs : child.getValuesetBindings()) {
            if (vs.getValuesetId() != null) {
              if (valuesetsMap.containsKey(vs.getValuesetId())) {
                vs.setValuesetId(valuesetsMap.get(vs.getValuesetId()).getId());
              }
            }
          }
        }
      }
    }
  }

  private void updateDynamicMapping(Segment elm, HashMap<String, CompositeKey> datatypesMap,
      HashMap<String, CompositeKey> valuesetsMap, String username) {

    DynamicMappingInfo dynmaicMapping = elm.getDynamicMappingInfo();



  }



  @Override
  public Segment saveDynamicMapping(SegmentDynamicMapping dynamicMapping)
      throws SegmentNotFoundException, SegmentValidationException {
    validate(dynamicMapping);
    Segment segment = findLatestById(dynamicMapping.getId().getId());
    if (segment == null) {
      throw new SegmentNotFoundException(dynamicMapping.getId().getId());
    }
    segment.setDynamicMappingInfo(dynamicMapping.getDynamicMappingInfo());
    return save(segment);
  }

}
