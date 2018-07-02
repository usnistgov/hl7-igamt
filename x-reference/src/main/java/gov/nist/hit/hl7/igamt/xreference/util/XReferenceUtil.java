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
import java.util.Collections;
import java.util.Comparator;
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
   * remove unecessary fiels, restructure the references
   * 
   * @param results
   * @return
   */
  public static List<BasicDBObject> processSegmentReferences(
      List<BasicDBObject> conformanceProfiles, String segmentId) {
    for (BasicDBObject conformanceProfile : conformanceProfiles) {
      List<BasicDBObject> children = processSegmentReferences(conformanceProfile, segmentId);
      conformanceProfile.remove("children");
      conformanceProfile.remove("_class");
      conformanceProfile.remove("postDef");
      conformanceProfile.remove("preDef");
      conformanceProfile.remove("comment");
      conformanceProfile.append("children", children);
    }
    return conformanceProfiles;
  }



  public static List<BasicDBObject> sortDSCByVersion(List<BasicDBObject> objects) {
    Collections.sort(objects, new Comparator<BasicDBObject>() {
      @Override
      public int compare(BasicDBObject o1, BasicDBObject o2) {
        // TODO Auto-generated method stub
        int v1 = ((BasicDBObject) o1.get("_id")).getInt("version");
        int v2 = ((BasicDBObject) o2.get("_id")).getInt("version");
        return v2 - v1;
      }
    });
    return objects;
  }

  /**
   * 
   * @param object
   * @return
   */
  public static String getName(BasicDBObject object) {
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



  /**
   * 
   * @param datatype
   * @return
   */
  public static BasicDBObject processDatatype(BasicDBObject datatype) {
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
  public static List<BasicDBObject> processSegments(List<BasicDBObject> segments) {
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
  public static List<BasicDBObject> processDatatypes(List<BasicDBObject> datatypes) {
    for (BasicDBObject segment : datatypes) {
      processDatatype(segment);
    }
    return datatypes;
  }

  /**
   * 
   * @param conformanceProfile
   * @param segmentId
   * @return
   */
  public static List<BasicDBObject> processSegmentReferences(BasicDBObject conformanceProfile,
      String segmentId) {
    List<BasicDBObject> tmp = new ArrayList<BasicDBObject>();
    List<BasicDBObject> children = (List<BasicDBObject>) conformanceProfile.get("children");

    if (children != null) {
      for (BasicDBObject child : children) {
        child.append("path", child.get("position") + "");
        if (child.get("type").equals("SEGMENTREF")) {
          BasicDBObject res = processSegmentRef(child, segmentId);
          if (res != null) {
            tmp.add(res);
          }
        } else {
          List<BasicDBObject> groupResults = processGroup(child, segmentId);
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
  public static BasicDBObject processSegmentRef(BasicDBObject segmentRef, String segmentId) {
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
  public static List<BasicDBObject> processGroup(BasicDBObject group, String segmentId) {
    List<BasicDBObject> tmp = new ArrayList<BasicDBObject>();
    List<BasicDBObject> children = (List<BasicDBObject>) group.get("children");
    if (children != null) {
      for (BasicDBObject child : children) {
        child.append("path", group.get("path") + "." + child.getInt("position"));
        if (child.get("type").equals("SEGMENTREF")) {
          BasicDBObject res = processSegmentRef(child, segmentId);
          if (res != null) {
            tmp.add(res);
          }
        } else {
          List<BasicDBObject> groupResults = processGroup(child, segmentId);
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
