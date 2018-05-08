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

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.domain.display.FieldDisplay;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentMetadata;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentPostDef;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentPreDef;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentStructure;
import gov.nist.hit.hl7.igamt.segment.repository.SegmentRepository;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.shared.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.shared.domain.Field;
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
    return segmentRepository.findOne(key);
  }

  @Override
  public Segment create(Segment segment) {
    segment.setId(new CompositeKey());
    segment = segmentRepository.save(segment);
    return segment;
  }

  @Override
  public Segment save(Segment segment) {
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
    segmentRepository.delete(key);
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

  @Override
  public SegmentStructure convertDomainToStructure(Segment segment) {
    if (segment != null) {
      SegmentStructure result = new SegmentStructure();
      result.setId(segment.getId());
      result.setScope(segment.getDomainInfo().getScope());
      result.setVersion(segment.getDomainInfo().getVersion());
      if (segment.getExt() != null) {
        result.setLabel(segment.getName() + segment.getExt());
      } else {
        result.setLabel(segment.getName());
      }

      result.setBinding(segment.getBinding());

      if (segment.getChildren() != null && segment.getChildren().size() > 0) {
        for (Field f : segment.getChildren()) {
          FieldDisplay fieldDisplay = new FieldDisplay();
          fieldDisplay.setData(f);
          result.addChild(fieldDisplay);
        }
      }
      return result;
    }
    return null;
  }


  @Override
  public Segment findLatestById(String id) {
    Segment segment = segmentRepository
        .findLatestById(new ObjectId(id), new Sort(Sort.Direction.DESC, "_id.version")).get(0);
    return segment;
  }

  @Override
  public SegmentMetadata convertDomainToMetadata(Segment segment) {
    if (segment != null) {
      SegmentMetadata result = new SegmentMetadata();
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
  public SegmentPreDef convertDomainToPredef(Segment segment) {
    if (segment != null) {
      SegmentPreDef result = new SegmentPreDef();
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
  public SegmentPostDef convertDomainToPostdef(Segment segment) {
    if (segment != null) {
      SegmentPostDef result = new SegmentPostDef();
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

}
