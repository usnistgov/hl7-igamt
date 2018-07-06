/**
 * This software was developed at the National Institute of Standards and Technology by employees of
 * the Federal Government in the course of their official duties. Pursuant to title 17 Section 105
 * of the United States Code this software is not subject to copyright protection and is in the
 * public domain. This is an experimental system. NIST assumes no responsibility whatsoever for its
 * use by other parties, and makes no guarantees, expressed or implied, about its quality,
 * reliability, or any other characteristic. We would appreciate acknowledgement if the software is
 * used. This software can be redistributed and/or modified freely provided that any derivative
 * works bear some notice that they are derived from it, and any modified versions bear some notice
 * that they have been modified.
 */
package gov.nist.hit.hl7.igamt.xreference.service.impl;


import static org.springframework.data.mongodb.core.aggregation.Aggregation.match;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.newAggregation;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import com.mongodb.BasicDBObject;

import gov.nist.hit.hl7.igamt.xreference.service.XRefService;
import gov.nist.hit.hl7.igamt.xreference.util.XReferenceUtil;


@Service
public class XRefServiceImpl extends XRefService {


  @Autowired
  private MongoTemplate mongoTemplate;



  @Override
  public Map<String, List<BasicDBObject>> getDatatypeReferences(String id,
      Set<String> filterDatatypeIds, Set<String> filterSegmentIds) {
    Map<String, List<BasicDBObject>> results = new HashMap<String, List<BasicDBObject>>();
    List<BasicDBObject> datatypes = getDatatypeRefsByDatatypes(id, filterDatatypeIds);
    if (datatypes != null && !datatypes.isEmpty()) {
      results.put(DATATYPE, datatypes);
    }
    List<BasicDBObject> segments = getDatatypeRefsBySegments(id, filterSegmentIds);
    if (segments != null && !segments.isEmpty()) {
      results.put(SEGMENT, segments);
    }
    return results;
  }

  /**
   * 
   * @param id
   * @return the datatypes referencing the data type with id at a component level
   */
  private List<BasicDBObject> getDatatypeRefsByDatatypes(String id, Set<String> filterDatatypeIds) {
    Aggregation aggregation = null;
    // if (filterDatatypeIds != null) {
    // aggregation =
    // newAggregation(match(Criteria.where("_id._id").in(toObjectIds(filterDatatypeIds))),
    // match(Criteria.where("components.ref._id").is(new ObjectId(id))),
    // project(fields("name", "ext", "domainInfo", "position"))
    // .and(filter("components").as("component")
    // .by(valueOf("component.ref._id").equalToValue(new ObjectId(id))))
    // .as("children"));
    // } else {
    // aggregation = newAggregation(match(Criteria.where("components.ref._id").is(new
    // ObjectId(id))),
    // project(fields("name", "ext", "domainInfo", "position")).and(filter("components")
    // .as("component").by(valueOf("component.ref._id").equalToValue(new ObjectId(id))))
    // .as("children"));
    // }

    return XReferenceUtil.filterDatatypes(
        mongoTemplate.aggregate(aggregation, "datatype", BasicDBObject.class).getMappedResults());
  }


  /**
   * 
   * @param id
   * @return the segments referencing a data type at a field level
   */
  private List<BasicDBObject> getDatatypeRefsBySegments(String id, Set<String> filterSegmentIds) {
    Aggregation aggregation = null;
    // if (filterSegmentIds != null) {
    // aggregation =
    // newAggregation(match(Criteria.where("_id._id").in(toObjectIds(filterSegmentIds))),
    // match(Criteria.where("children.ref._id").is(new ObjectId(id))),
    // project(fields("name", "ext", "domainInfo")).and(filter("children").as("field")
    // .by(valueOf("field.ref._id").equalToValue(new ObjectId(id)))).as("children"));
    //
    // } else {
    // aggregation = newAggregation(match(Criteria.where("children.ref._id").is(new ObjectId(id))),
    // project(fields("name", "ext", "domainInfo")).and(filter("children").as("field")
    // .by(valueOf("field.ref._id").equalToValue(new ObjectId(id)))).as("children"));
    // }
    return XReferenceUtil.filterSegments(
        mongoTemplate.aggregate(aggregation, "segment", BasicDBObject.class).getMappedResults());
  }



  @Override
  public Map<String, List<BasicDBObject>> getSegmentReferences(String id,
      Set<String> filterConformanceProfileIds) {
    Map<String, List<BasicDBObject>> results = new HashMap<String, List<BasicDBObject>>();
    List<BasicDBObject> conformanceProfiles =
        getSegmentReferencesByConformanceProfiles(id, filterConformanceProfileIds);
    if (conformanceProfiles != null && !conformanceProfiles.isEmpty()) {
      results.put(CONFORMANCE_PROFILE, conformanceProfiles);
    }
    return results;
  }



  /**
   * TODO: add version to the matching
   * 
   * @param id
   * @param version
   * @param conformanceProfileIds
   * @return
   */
  public List<BasicDBObject> getSegmentReferencesByConformanceProfiles(String id,
      Set<String> filterConformanceProfileIds) {
    Aggregation aggregation = null;
    ObjectId objId = new ObjectId(id);
    if (filterConformanceProfileIds != null) {
      aggregation = newAggregation(
          match(Criteria.where("_id._id").in(toObjectIds(filterConformanceProfileIds))),
          match(XReferenceUtil.getConformanceProfileMultiLevelCriteria(10, objId)));
    } else {
      aggregation =
          newAggregation(match(XReferenceUtil.getConformanceProfileMultiLevelCriteria(10, objId)));
    }

    return XReferenceUtil.filterChildrenBySegmentId(mongoTemplate
        .aggregate(aggregation, "conformanceProfile", BasicDBObject.class).getMappedResults(), id);
  }



  private Set<ObjectId> toObjectIds(Set<String> ids) {
    Set<ObjectId> objIds = new HashSet<ObjectId>();
    for (String id : ids) {
      objIds.add(new ObjectId(id));
    }
    return objIds;
  }

  /*
   * (non-Javadoc)
   * 
   * @see
   * gov.nist.hit.hl7.igamt.xreference.service.XRefService#getValueSetReferences(java.lang.String,
   * java.util.Set, java.util.Set)
   */
  @Override
  public Map<String, List<BasicDBObject>> getValueSetReferences(String id, Set<String> datatypeIds,
      Set<String> segmentIds) {
    Map<String, List<BasicDBObject>> results = new HashMap<String, List<BasicDBObject>>();
    List<BasicDBObject> datatypes = getValueSetRefsByDatatypes(id, datatypeIds);
    if (datatypes != null && !datatypes.isEmpty()) {
      results.put(DATATYPE, datatypes);
    }
    List<BasicDBObject> segments = getValueSetRefsBySegments(id, segmentIds);
    if (segments != null && !segments.isEmpty()) {
      results.put(SEGMENT, segments);
    }
    System.out.println(segments);

    return results;
  }


  /**
   * 
   * @param id
   * @return the segments referencing a data type at a field level
   */
  private List<BasicDBObject> getValueSetRefsBySegments(String id, Set<String> segmentIds) {
    Aggregation aggregation = null;
    if (segmentIds != null) {

      aggregation = newAggregation(match(Criteria.where("_id._id").in(toObjectIds(segmentIds))),
          match(Criteria.where("binding.children.valuesetBindings.valuesetId").is(id)));

    } else {
      aggregation = newAggregation(
          match(Criteria.where("binding.children.valuesetBindings.valuesetId").is(id)));
    }

    List<BasicDBObject> results = XReferenceUtil.filterReferencesByValueSetId(
        mongoTemplate.aggregate(aggregation, "segment", BasicDBObject.class).getMappedResults(),
        id);

    return results;
  }


  /**
   * 
   * @param id
   * @return the segments referencing a data type at a field level
   */
  private List<BasicDBObject> getValueSetRefsByDatatypes(String id, Set<String> segmentIds) {
    Aggregation aggregation = null;
    if (segmentIds != null) {

      aggregation = newAggregation(match(Criteria.where("_id._id").in(toObjectIds(segmentIds))),
          match(Criteria.where("binding.children.valuesetBindings.valuesetId").is(id)));

    } else {
      aggregation = newAggregation(
          match(Criteria.where("binding.children.valuesetBindings.valuesetId").is(id)));
    }

    List<BasicDBObject> results = XReferenceUtil.filterReferencesByValueSetId(
        mongoTemplate.aggregate(aggregation, "datatype", BasicDBObject.class).getMappedResults(),
        id);

    return results;
  }



}
