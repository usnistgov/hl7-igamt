package gov.nist.hit.hl7.igamt.xreference.service.impl;


import static org.springframework.data.mongodb.core.aggregation.Aggregation.fields;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.match;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.newAggregation;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.project;
import static org.springframework.data.mongodb.core.aggregation.ArrayOperators.Filter.filter;
import static org.springframework.data.mongodb.core.aggregation.ComparisonOperators.Eq.valueOf;

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

import gov.nist.hit.hl7.igamt.xreference.service.XReferenceService;


@Service
public class XReferenceServiceImpl implements XReferenceService {


  private static final String DATATYPE = "DATATYPE";
  private static final String SEGMENT = "SEGMENT";
  private static final String PROFILE_COMPONENT = "PROFILE_COMPONENT";


  @Autowired
  private MongoTemplate mongoTemplate;


  /**
   * 
   */
  @Override
  public Map<String, List<BasicDBObject>> getDatatypeReferences(String id, Set<String> datatypeIds,
      Set<String> segmentIds) {
    Map<String, List<BasicDBObject>> results = new HashMap<String, List<BasicDBObject>>();
    List<BasicDBObject> datatypes = getDatatypeRefsByDatatypes(id, datatypeIds);
    if (datatypes != null && !datatypes.isEmpty()) {
      results.put(DATATYPE, datatypes);
    }
    List<BasicDBObject> segments = getDatatypeRefsBySegments(id, segmentIds);
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
  private List<BasicDBObject> getDatatypeRefsByDatatypes(String id, Set<String> datatypeIds) {
    if (datatypeIds != null && !datatypeIds.isEmpty()) {
      // Criteria criteria = null;
      // List<String> list = new ArrayList<String>(datatypeIds);
      // for (int i = 0; i < list.size(); i++) {
      // if (i == 0) {
      // criteria = Criteria.where("_id").is(new ObjectId(list.get(i)));
      // } else {
      // criteria.orOperator(Criteria.where("_id").is(new ObjectId(list.get(i))));
      // }
      // }

      Aggregation aggregation = newAggregation(
          match(Criteria.where("_id").in(toObjectIds(datatypeIds)).and("components.datatype._id")
              .is(new ObjectId(id))),
          project(fields("name", "ext", "hl7Version"))
              .and(filter("components").as("component")
                  .by(valueOf("component.datatype._id").equalToValue(new ObjectId(id))))
              .as("components"));
      System.out.println(aggregation.toString());
      List<BasicDBObject> results =
          mongoTemplate.aggregate(aggregation, "datatype", BasicDBObject.class).getMappedResults();
      System.out.println(results);
      return results;
    }
    return null;
  }


  /**
   * 
   * @param id
   * @return the segments referencing a data type at a field level
   */
  private List<BasicDBObject> getDatatypeRefsBySegments(String id, Set<String> segmentIds) {
    if (segmentIds != null && !segmentIds.isEmpty()) {
      Aggregation aggregation =
          newAggregation(
              match(Criteria.where("fields.datatype._id").is(new ObjectId(id))
                  .andOperator(Criteria.where("_id").in(toObjectIds(segmentIds)))),
              project(fields("name", "ext", "hl7Version", "components"))
                  .and(filter("fields").as("field")
                      .by(valueOf("field.datatype._id").equalToValue(new ObjectId(id))))
                  .as("fields"));
      List<BasicDBObject> results =
          mongoTemplate.aggregate(aggregation, "segment", BasicDBObject.class).getMappedResults();
      return results;
    }
    return null;
  }

  private Set<ObjectId> toObjectIds(Set<String> ids) {
    Set<ObjectId> objIds = new HashSet<ObjectId>();
    for (String id : ids) {
      objIds.add(new ObjectId(id));
    }
    System.out.println(objIds);
    return objIds;
  }



}
