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
package gov.nist.hit.hl7.igamt.xreference.util;

import java.util.ArrayList;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.query.Criteria;

import com.mongodb.BasicDBObject;

/**
 * @author Harold Affo
 *
 */
public class XReferenceUtil {

  /**
   * TODO: Do this from mongo query ?? Remove non matching element and set absolute path for
   * matching element
   * 
   * @param results
   * @return
   */
  public static List<BasicDBObject> filterChildrenBySegmentId(
      List<BasicDBObject> conformanceProfiles, String segmentId) {
    for (BasicDBObject conformanceProfile : conformanceProfiles) {
      List<BasicDBObject> where = filterChildrenBySegmentId(conformanceProfile, segmentId);
      conformanceProfile.remove("children");
      conformanceProfile.remove("_class");
      conformanceProfile.remove("postDef");
      conformanceProfile.remove("preDef");
      conformanceProfile.remove("comment");
      conformanceProfile.append("children", where);
    }
    return conformanceProfiles;
  }

  /**
   * 
   * @param object
   * @return
   */
  private static String getName(BasicDBObject object) {
    String ext = object.getString("ext") != null && !object.getString("ext").equals("")
        ? object.getString("ext") : null;
    return ext != null ? object.getString("name") + "_" + ext : object.getString("name");
  }

  /**
   * 
   * @param segment
   * @return
   */
  public static BasicDBObject filterSegment(BasicDBObject segment) {
    List<BasicDBObject> children = (List<BasicDBObject>) segment.get("children");
    for (BasicDBObject child : children) {
      child.append("path", getName(segment) + "." + child.get("position"));
      child.remove("_class");
      child.remove("text");
      child.remove("comment");
      child.remove("ref");
    }
    segment.remove("_class");
    return segment;
  }


  public static List<BasicDBObject> filterReferencesByValueSetId(List<BasicDBObject> references,
      String valueSetId) {
    for (BasicDBObject reference : references) {
      filterReferencesByValueSetId(reference, valueSetId);
    }
    return references;
  }


  public static BasicDBObject filterReferencesByValueSetId(BasicDBObject referenceObject,
      String valueSetId) {
    List<BasicDBObject> children =
        (List<BasicDBObject>) ((BasicDBObject) referenceObject.get("binding")).get("children");
    List<BasicDBObject> tmp = new ArrayList<BasicDBObject>();
    for (BasicDBObject child : children) {
      List<BasicDBObject> valuesetBindings = (List<BasicDBObject>) child.get("valuesetBindings");
      List<BasicDBObject> tmpValuesetBinding = new ArrayList<BasicDBObject>();
      for (BasicDBObject valuesetBinding : valuesetBindings) {
        if (valuesetBinding.get("valuesetId").equals(valueSetId)) {
          valuesetBinding.remove("valuesetId"); // no need of extra information
          tmpValuesetBinding.add(valuesetBinding);
        }
      }
      if (!tmpValuesetBinding.isEmpty()) {
        child.remove("valuesetBindings");
        child.append("valuesetBindings", tmpValuesetBinding);
        tmp.add(child);
      }
    }
    referenceObject.remove("_class");
    referenceObject.remove("children");
    referenceObject.remove("preDef");
    referenceObject.remove("postDef");
    referenceObject.remove("description");
    referenceObject.remove("comment");
    referenceObject.remove("binding");
    referenceObject.append("children", tmp);
    return referenceObject;
  }



  /**
   * 
   * @param datatype
   * @return
   */
  public static BasicDBObject filterDatatype(BasicDBObject datatype) {
    List<BasicDBObject> children = (List<BasicDBObject>) datatype.get("children");
    for (BasicDBObject child : children) {
      child.append("path", getName(datatype) + "." + child.get("position"));
      child.remove("_class");
      child.remove("text");
      child.remove("comment");
      child.remove("ref");
    }
    datatype.remove("_class");
    return datatype;
  }


  /**
   * 
   * @param segments
   * @return
   */
  public static List<BasicDBObject> filterSegments(List<BasicDBObject> segments) {
    for (BasicDBObject segment : segments) {
      filterSegment(segment);
    }
    return segments;
  }


  /**
   * 
   * @param datatypes
   * @return
   */
  public static List<BasicDBObject> filterDatatypes(List<BasicDBObject> datatypes) {
    for (BasicDBObject segment : datatypes) {
      filterDatatype(segment);
    }
    return datatypes;
  }

  /**
   * 
   * @param conformanceProfile
   * @param segmentId
   * @return
   */
  public static List<BasicDBObject> filterChildrenBySegmentId(BasicDBObject conformanceProfile,
      String segmentId) {
    List<BasicDBObject> tmp = new ArrayList<BasicDBObject>();
    List<BasicDBObject> children = (List<BasicDBObject>) conformanceProfile.get("children");

    if (children != null) {
      for (BasicDBObject child : children) {
        child.append("path", child.get("position") + "");
        if (child.get("type").equals("SEGMENTREF")) {
          BasicDBObject res = filterSegmentRefBySegmentId(child, segmentId);
          if (res != null) {
            tmp.add(res);
          }
        } else {
          List<BasicDBObject> groupResults = filterGroupBySegmentId(child, segmentId);
          if (groupResults != null && !groupResults.isEmpty()) {
            tmp.addAll(groupResults);
          }
        }
      }
    }
    return tmp;
  }

  /**
   * 
   * @param segmentRef
   * @param segmentId
   * @return
   */
  public static BasicDBObject filterSegmentRefBySegmentId(BasicDBObject segmentRef,
      String segmentId) {
    BasicDBObject result = matchSegment(segmentRef, segmentId) ? segmentRef : null;
    if (result != null) {
      result.remove("_class");
      result.remove("text");
      result.remove("custom");
      result.remove("ref");
    }
    return result;
  }

  /**
   * 
   * @param group
   * @param segmentId
   * @return
   */
  public static List<BasicDBObject> filterGroupBySegmentId(BasicDBObject group, String segmentId) {
    List<BasicDBObject> tmp = new ArrayList<BasicDBObject>();
    List<BasicDBObject> children = (List<BasicDBObject>) group.get("children");
    if (children != null) {
      for (BasicDBObject child : children) {
        child.append("path", group.get("path") + "." + child.getInt("position"));
        if (child.get("type").equals("SEGMENTREF")) {
          BasicDBObject res = filterSegmentRefBySegmentId(child, segmentId);
          if (res != null) {
            tmp.add(res);
          }
        } else {
          List<BasicDBObject> groupResults = filterGroupBySegmentId(child, segmentId);
          if (groupResults != null && !groupResults.isEmpty()) {
            tmp.addAll(groupResults);
          }
        }
      }
    }
    return tmp;
  }


  /**
   * 
   * @param object
   * @param id
   * @return
   */
  public static boolean matchSegment(BasicDBObject object, String id) {
    return ((BasicDBObject) object.get("ref")).get("_id").toString().equals(id);
  }

  /**
   * 
   * @param level
   * @param objId
   * @return
   */
  public static Criteria getConformanceProfileMultiLevelCriteria(int level, ObjectId objId) {
    List<Criteria> tmp = new ArrayList<Criteria>();
    if (level > 1) {
      for (int i = 1; i <= level; i++) {
        String query = "children";
        for (int j = 1; j <= i; j++) {
          query = query + ".children";
        }
        query = query + ".ref._id";
        tmp.add(Criteria.where(query).is(objId));
      }
    } else {
      String query = "children.ref._id";
      tmp.add(Criteria.where(query).is(objId));
    }
    Criteria criteria = new Criteria().orOperator(tmp.toArray(new Criteria[] {}));
    return criteria;
  }
}
