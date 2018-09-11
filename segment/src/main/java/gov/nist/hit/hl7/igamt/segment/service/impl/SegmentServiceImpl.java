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

import gov.nist.hit.hl7.igamt.common.base.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
import gov.nist.hit.hl7.igamt.common.base.exception.ValidationException;
import gov.nist.hit.hl7.igamt.common.base.util.ValidationUtil;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;
import gov.nist.hit.hl7.igamt.common.constraint.domain.ConformanceStatement;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DisplayMetadata;
import gov.nist.hit.hl7.igamt.datatype.domain.display.PostDef;
import gov.nist.hit.hl7.igamt.datatype.domain.display.PreDef;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.segment.domain.Field;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.domain.display.ChangedSegment;
import gov.nist.hit.hl7.igamt.segment.domain.display.FieldDisplay;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentConformanceStatement;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentStructure;
import gov.nist.hit.hl7.igamt.segment.exception.SegmentNotFoundException;
import gov.nist.hit.hl7.igamt.segment.exception.SegmentValidationException;
import gov.nist.hit.hl7.igamt.segment.repository.SegmentRepository;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
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
  private MongoTemplate mongoTemplate;

  @Autowired
  DatatypeService datatypeService;

  @Autowired
  ValuesetService valueSetService;

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
   * TODO
   */
  /*
   * (non-Javadoc)
   * 
   * @see
   * gov.nist.hit.hl7.igamt.segment.service.SegmentService#convertToSegment(gov.nist.hit.hl7.igamt.
   * segment.domain.display.SegmentStructure)
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
      HashMap<String, CompositeKey> valuesetsMap, Link l, String username) {

    Segment elm = this.findByKey(l.getId());

    Link newLink = new Link();
    newLink.setId(key);
    updateDependencies(elm, datatypesMap, valuesetsMap);
    elm.setFrom(elm.getId());
    elm.setId(newLink.getId());
    this.save(elm);
    return newLink;

  }

  /**
   * @param elm
   * @param datatypesMap
   * @param valuesetsMap
   */
  private void updateDependencies(Segment elm, HashMap<String, CompositeKey> datatypesMap,
      HashMap<String, CompositeKey> valuesetsMap) {
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

}
