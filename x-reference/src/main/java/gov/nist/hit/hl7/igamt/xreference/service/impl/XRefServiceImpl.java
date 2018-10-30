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

import static org.springframework.data.mongodb.core.aggregation.Aggregation.fields;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.match;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.newAggregation;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.project;
import static org.springframework.data.mongodb.core.aggregation.ArrayOperators.Filter.filter;
import static org.springframework.data.mongodb.core.aggregation.ComparisonOperators.Eq.valueOf;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.xreference.exceptions.XReferenceException;
import gov.nist.hit.hl7.igamt.xreference.model.CrossRef;
import gov.nist.hit.hl7.igamt.xreference.model.CrossRefsLabel;
import gov.nist.hit.hl7.igamt.xreference.model.CrossRefsNode;
import gov.nist.hit.hl7.igamt.xreference.service.XRefService;
import gov.nist.hit.hl7.igamt.xreference.util.XReferenceUtil;


@Service
public class XRefServiceImpl extends XRefService {


  @Autowired
  private MongoTemplate mongoTemplate;



  @Override
  public Map<String, List<CrossRefsNode>> getDatatypeReferences(String id, Set<String> filterDatatypeIds,
      Set<String> filterSegmentIds) {
    Map<String, List<CrossRefsNode>> results = new HashMap<String, List<CrossRefsNode>>();
    List<CrossRefsNode> datatypes = getDatatypeRefsByDatatypes(id, filterDatatypeIds);
    if (datatypes != null && !datatypes.isEmpty()) {
      results.put(DATATYPE, datatypes);
    }
    List<CrossRefsNode> segments = getDatatypeRefsBySegments(id, filterSegmentIds);
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
  private List<CrossRefsNode> getDatatypeRefsByDatatypes(String id, Set<String> filterDatatypeIds) {
    Aggregation aggregation = null;
    if (filterDatatypeIds != null) {
      aggregation =
          newAggregation(match(Criteria.where("_id._id").in(toObjectIds(filterDatatypeIds))),
              match(Criteria.where("components.ref._id").is(new ObjectId(id))));
    } else {
      aggregation = newAggregation(match(Criteria.where("components.ref._id").is(new ObjectId(id))));
    }
    
    	
    List<CompositeKey> cpIds= mongoTemplate.aggregate(aggregation, "datatype", CompositeKey.class).getMappedResults();
    
    Criteria where2 = Criteria.where("id").in(cpIds);
    Query qry = Query.query(where2);
    List<Datatype> datatypes = mongoTemplate.find(qry, Datatype.class);

    return XReferenceUtil.processDatatypes(
    		datatypes, id);
  }


  /**
   * 
   * @param id
   * @return the segments referencing a data type at a field level
   */
  private List<CrossRefsNode> getDatatypeRefsBySegments(String id, Set<String> filterSegmentIds) {
    Aggregation aggregation = null;
    if (filterSegmentIds != null) {
      aggregation =
          newAggregation(match(Criteria.where("_id._id").in(toObjectIds(filterSegmentIds))),
              match(Criteria.where("children.ref._id").is(new ObjectId(id))));
           

    } else {
      aggregation = newAggregation(match(Criteria.where("children.ref._id").is(new ObjectId(id))));
    }
    
    
	
List<CompositeKey> cpIds= mongoTemplate.aggregate(aggregation, "segment", CompositeKey.class).getMappedResults();

Criteria where2 = Criteria.where("id").in(cpIds);
Query qry = Query.query(where2);
List<Segment> segments = mongoTemplate.find(qry, Segment.class);

return XReferenceUtil.processSegments(
		segments, id);

  }



  @Override
  public Map<String, List<CrossRefsNode>> getSegmentReferences(String id,
      Set<String> filterConformanceProfileIds) {
    Map<String, List<CrossRefsNode>> results = new HashMap<String, List<CrossRefsNode>>();
    List<CrossRefsNode> conformanceProfiles =
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
  public List<CrossRefsNode> getSegmentReferencesByConformanceProfiles(String id,
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


    List<CompositeKey> cpIds= mongoTemplate.aggregate(aggregation, "conformanceProfile", CompositeKey.class).getMappedResults();
    
    Criteria where2 = Criteria.where("id").in(cpIds);
    Query qry = Query.query(where2);
    List<ConformanceProfile> conformanceProfiles = mongoTemplate.find(qry, ConformanceProfile.class);
    
    
    return XReferenceUtil.processSegmentRefs(conformanceProfiles, id);
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
  public Map<String, List<CrossRefsNode>> getValueSetReferences(String id, Set<String> datatypeIds,
      Set<String> segmentIds, Set<String> conformanceProfileIds) throws XReferenceException {
    Map<String, List<CrossRefsNode>> results = new HashMap<String, List<CrossRefsNode>>();
    List<CrossRefsNode> datatypes = getValueSetRefsByDatatypes(id, datatypeIds);
    if (datatypes != null && !datatypes.isEmpty()) {
      results.put(DATATYPE, datatypes);
    }
    List<CrossRefsNode> segments = getValueSetRefsBySegments(id, segmentIds);
    if (segments != null && !segments.isEmpty()) {
      results.put(SEGMENT, segments);
    }

    List<CrossRefsNode> conformanceProfiles =
        getValueSetRefsByConformanceProfiles(id, conformanceProfileIds);
    if (conformanceProfiles != null && !conformanceProfiles.isEmpty()) {
      results.put(CONFORMANCE_PROFILE, conformanceProfiles);
    }
    return results;
  }


  /**
   * 
   * @param id
   * @return the segments referencing a data type at a field level
   * @throws XReferenceException
   */
  private List<CrossRefsNode> getValueSetRefsBySegments(String id, Set<String> segmentIds)
      throws XReferenceException {
    Aggregation aggregation = null;
    if (segmentIds != null) {

      aggregation = newAggregation(match(Criteria.where("_id._id").in(toObjectIds(segmentIds))),
          match(Criteria.where("binding.children.valuesetBindings.valuesetId").is(id)));

    } else {
      aggregation = newAggregation(
          match(Criteria.where("binding.children.valuesetBindings.valuesetId").is(id)));
    }

    List<CrossRefsNode> results = processValueSetReferences(
        mongoTemplate.aggregate(aggregation, "segment", Document.class).getMappedResults(), id,
        "segment");

    return results;
  }


  /**
   * 
   * @param id
   * @return the segments referencing a data type at a field level
   * @throws XReferenceException
   */
  private List<CrossRefsNode> getValueSetRefsByConformanceProfiles(String id,
      Set<String> conformanceProfileIds) throws XReferenceException {
    Aggregation aggregation = null;
    if (conformanceProfileIds != null) {

      aggregation =
          newAggregation(match(Criteria.where("_id._id").in(toObjectIds(conformanceProfileIds))),
              match(Criteria.where("binding.children.valuesetBindings.valuesetId").is(id)));

    } else {
      aggregation = newAggregation(
          match(Criteria.where("binding.children.valuesetBindings.valuesetId").is(id)));
    }

    List<CrossRefsNode> results = processValueSetReferences(mongoTemplate
        .aggregate(aggregation, "conformanceProfile", Document.class).getMappedResults(), id,
        "conformanceProfile");

    return results;
  }



  /**
   * 
   * @param id
   * @return the segments referencing a data type at a field level
   * @throws XReferenceException
   */
  private List<CrossRefsNode> getValueSetRefsByDatatypes(String id, Set<String> segmentIds)
      throws XReferenceException {
    Aggregation aggregation = null;
    if (segmentIds != null) {

      aggregation = newAggregation(match(Criteria.where("_id._id").in(toObjectIds(segmentIds))),
          match(Criteria.where("binding.children.valuesetBindings.valuesetId").is(id)));

    } else {
      aggregation = newAggregation(
          match(Criteria.where("binding.children.valuesetBindings.valuesetId").is(id)));
    }

    List<CrossRefsNode> results = processValueSetReferences(
        mongoTemplate.aggregate(aggregation, "datatype", Document.class).getMappedResults(), id,
        "datatype");

    return results;
  }


  /**
   * Create a new structure and remove unnecessary references, add path field
   * 
   * @param referenceObject
   * @param valueSetId
   * @param referenceType
   * @return
   * @throws XReferenceException
   */
  private  CrossRefsNode processValueSetReferences(Document referenceObject, String valueSetId,
      String referenceType) throws XReferenceException {
	  
	  
	  
	  
	  
    List<Document> children =
        (List<Document>) ((Document) referenceObject.get("binding")).get("children");
    
    
    List<Document> tmp = new ArrayList<Document>();
    for (Document child : children) {
      List<Document> valuesetBindings = (List<Document>) child.get("valuesetBindings");
      List<Document> tmpValuesetBinding = new ArrayList<Document>();
      
//      
//      CrossRefsNode node = new CrossRefsNode();
//      CrossRefsLabel label = new CrossRefsLabel();   
//      CrossRef data = new CrossRef();
//      
//      
//      
//      String path =
//          findElementPath(referenceObject, referenceType, child.get("elementId").toString());
//      
//      if (path == null) {
//    	  
//        throw new XReferenceException(child.get("elementId").toString() + " Not found in "
//            + referenceType + " with id= " + referenceObject.getString("_id"));
//      }
//      
//      path = XReferenceUtil.getName(referenceObject) + "." + path;
//      data.setLocation(path);
//      
//      
//      for (Document valuesetBinding : valuesetBindings) {
//        if (valuesetBinding.get("valuesetId").equals(valueSetId)) {
//          valuesetBinding.remove("valuesetId"); // no need of extra information
//          
//          tmpValuesetBinding.add(valuesetBinding);
//        }
//      }
//      if (!tmpValuesetBinding.isEmpty()) {
//        child.remove("valuesetBindings");
//        child.append("valuesetBindings", tmpValuesetBinding);
//        tmp.add(child);
//      }
//    }
    }
    CrossRefsNode node = new CrossRefsNode();
    CrossRefsLabel label = new CrossRefsLabel();   
    CrossRef data = new CrossRef();
    return node;
  }


  private List<Document> getObjectByIdAndVersion(String id, int version, String type) {
    Aggregation aggregation = null;
    aggregation = newAggregation(
        match(Criteria.where("_id._id").is(new ObjectId(id)).and("_id.version").is(version)));
    List<Document> results =
        mongoTemplate.aggregate(aggregation, type, Document.class).getMappedResults();
    return results;
  }



  /**
   * Remove unecessaries fields and create a new structure for easy access
   * 
   * @param references
   * @param valueSetId
   * @param referenceType
   * @return
   * @throws XReferenceException
   */
  public List<CrossRefsNode> processValueSetReferences(List<Document> references, String valueSetId,
      String referenceType) throws XReferenceException {
	  List<CrossRefsNode> ret = new ArrayList<CrossRefsNode>();
	  
    for (Document reference : references) {
      ret.add(processValueSetReferences(reference, valueSetId, referenceType));
    }
    return ret;
  }


  private String getRefId(Document element) {
    String id = ((Document) element.get("ref")).get("_id").toString();
    return id;
  }

  private String getId(Document element) {
    String id = element.getString("_id");
    return id;
  }



  private String findElementPath(Document parent, String parentType, String elementId) {
    int version = parent.getInteger("version");

    if (parentType.equals("segment")) {
      List<Document> children = (List<Document>) parent.get("children");
      for (Document child : children) {
        String childId = getId(child);
        if (childId.equals(elementId)) {
          return child.getInteger("position") + "";
        } else {
          String datatypeId = getRefId(child);
          List<Document> datatypes = getObjectByIdAndVersion(datatypeId, version, "datatype");
          if (datatypes != null && !datatypes.isEmpty()) {
            Document datatype = datatypes.get(0);
            String path = getDatatypeChildPath(datatype, elementId);
            if (path != null) { // 2
              return child.getInteger("position") + "." + path; // MSH.1.2
            }
          }
        }
      }
    } else if (parentType.equals("datatype")) {
      List<Document> children = (List<Document>) parent.get("components");
      if (children != null) {
        for (Document child : children) {
          String childId = getId(child);
          if (childId.equals(elementId)) {
            return child.getInteger("position") + "";
          } else {
            String datatypeId = getRefId(child);
            List<Document> datatypes = getObjectByIdAndVersion(datatypeId, version, "datatype");
            if (datatypes != null && !datatypes.isEmpty()) {
              Document datatype = datatypes.get(0);
              String path = getDatatypeChildPath(datatype, elementId);
              if (path != null) { // 2
                return child.getInteger("position") + "." + path; // MSH.1.2
              }
            }
          }
        }
      }
    } else if (parentType.equals("conformanceProfile")) {
      List<Document> children = (List<Document>) parent.get("children");
      for (Document child : children) {
        String childId = getId(child);
        if (childId.equals(elementId)) {
          return child.getString("position");
        } else {
          if (child.getString("type").equals("SEGMENTREF")) {
            String segmentId = getRefId(child);
            List<Document> segments = getObjectByIdAndVersion(segmentId, version, "segment");
            Document segment = segments.get(0);
            String path = getSegmentChildPath(segment, elementId);
            if (path != null) { // 2
              return child.getInteger("position") + "." + path; // ADMSH.1.2
            }
          } else {
            String path = getGroupChildPath(child, version, elementId);
            if (path != null) {
              return child.getInteger("position") + "." + path;
            }
          }
        }
      }
    } else {
      throw new UnsupportedOperationException(
          "findElementPath for " + parentType + " is not yet supported");
    }
    return null;
  }


  private String getGroupChildPath(Document referenceObject, int conformanceProfileVersion,
      String elementId) {
    List<Document> children = (List<Document>) referenceObject.get("children");
    for (Document child : children) {
      String childId = getId(child);
      if (childId.equals(elementId)) {
        return child.getString("position");
      } else {
        if (child.getString("type").equals("SEGMENTREF")) {
          String segmentId = getRefId(child);
          List<Document> segments =
              getObjectByIdAndVersion(segmentId, conformanceProfileVersion, "segment");
          Document segment = segments.get(0);
          String path = getSegmentChildPath(segment, elementId);
          if (path != null) { // 2
            return child.getInteger("position") + "." + path; // ADMSH.1.2
          }
        } else {
          String path = getGroupChildPath(child, conformanceProfileVersion, elementId);
          if (path != null) {
            return child.getInteger("position") + "." + path;
          }
        }
      }
    }
    return null;
  }


  private String getDatatypeChildPath(Document object, String elementId) {
    List<Document> children = (List<Document>) object.get("components");
    if (children != null) {
      int version = object.getInteger("version");
      for (Document child : children) {
        String childId = getId(child);
        if (childId.equals(elementId)) {
          return child.getString("position");
        } else {
          String compDatatypeId = getRefId(child);
          List<Document> datatypes = getObjectByIdAndVersion(compDatatypeId, version, "datatype");
          Document compDatatype = datatypes.get(0);
          String path = getDatatypeChildPath(compDatatype, elementId);
          if (path != null) {
            return child.getString("position") + "." + path;
          }
        }
      }
    }
    return null;
  }


  private String getSegmentChildPath(Document object, String elementId) {
    List<Document> children = (List<Document>) object.get("children");
    int version = object.getInteger("version");
    for (Document child : children) {
      String childId = getId(child);
      if (childId.equals(elementId)) {
        return child.getString("position");
      } else {
        String compDatatypeId = getRefId(child);
        List<Document> datatypes = getObjectByIdAndVersion(compDatatypeId, version, "datatype");
        Document compDatatype = datatypes.get(0);
        String path = getDatatypeChildPath(compDatatype, elementId);
        if (path != null) {
          return child.getString("position") + "." + path;
        }
      }
    }
    return null;
  }

  /*
   * (non-Javadoc)
   * 
   * @see
   * gov.nist.hit.hl7.igamt.xreference.service.XRefService#getDatatypeReferences(java.lang.String,
   * java.util.Set)
   */
  @Override
  public Map<String, List<CrossRefsNode>> getDatatypeReferences(String datatypeId,
      Set<String> filterDatatypeIds) {
    Map<String, List<CrossRefsNode>> results = new HashMap<String, List<CrossRefsNode>>();
    List<CrossRefsNode> datatypes = getDatatypeRefsByDatatypes(datatypeId, filterDatatypeIds);
    if (datatypes != null && !datatypes.isEmpty()) {
      results.put(DATATYPE, datatypes);
    }
    return results;
  }



}
