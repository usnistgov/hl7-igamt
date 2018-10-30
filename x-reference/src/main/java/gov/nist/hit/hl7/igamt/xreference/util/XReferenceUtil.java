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

import static org.hamcrest.CoreMatchers.instanceOf;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Set;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.query.Criteria;

import gov.nist.hit.hl7.igamt.common.base.domain.AbstractDomain;
import gov.nist.hit.hl7.igamt.common.base.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.Group;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRef;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRefOrGroup;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Component;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.segment.domain.Field;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.xreference.model.CrossRef;
import gov.nist.hit.hl7.igamt.xreference.model.CrossRefsLabel;
import gov.nist.hit.hl7.igamt.xreference.model.CrossRefsNode;

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
  public static List<CrossRefsNode> processSegmentRefs(List<ConformanceProfile> conformanceProfiles,
      String segmentId) {
	  List<CrossRefsNode> ret = new ArrayList<CrossRefsNode>();
    for (ConformanceProfile conformanceProfile : conformanceProfiles) {
      List<CrossRefsNode> children = processSegmentReferences(conformanceProfile, segmentId);
      	if(children !=null&& !children.isEmpty()) {
      		CrossRefsNode node = new CrossRefsNode();
      		node.setChildren(ret);
      		CrossRefsLabel label = getLabel(conformanceProfile);
      	    node.setLabel(label);
      	    node.setChildren(children);
          	ret.add(node);

      	}
    }
    return ret;
  }



  public static List<Document> sortDSCByVersion(List<Document> objects) {
    Collections.sort(objects, new Comparator<Document>() {
      @Override
      public int compare(Document o1, Document o2) {
        // TODO Auto-generated method stub
        int v1 = ((Document) o1.get("_id")).getInteger("version");
        int v2 = ((Document) o2.get("_id")).getInteger("version");
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
  public static String getName(Document object) {
    String ext = object.getString("ext") != null && !object.getString("ext").equals("")
        ? object.getString("ext")
        : null;
    return ext != null ? object.getString("name") + "_" + ext : object.getString("name");
  }

  /**
   * 
   * @param segment
   * @return
   */
  public static CrossRefsNode filterSegment(Segment segment, String id) {
		CrossRefsNode ret = new CrossRefsNode ();
	    List<CrossRefsNode> refNodes=new ArrayList<CrossRefsNode>();

	    CrossRefsLabel parent = getLabel(segment);
	    for (Field child : segment.getChildren()) {
	    	
	    	if(child.getRef().getId().equals(id)) {
	    	
	    	
	    	
	    		CrossRef ref = new CrossRef();
	    		CrossRefsNode node = new CrossRefsNode ();
	    		ref.setLocation(child.getPosition()+"");
	    		ref.setLabel(child.getName());
	    		ref.setNamePath(segment.getLabel() + "." + child.getPosition());
	    		ref.setType(Type.FIELD);
	    		ref.setParent(parent);
	    		node.setData(ref);
	    		refNodes.add(node);
	    		}
	    	}
	    	ret.setChildren(refNodes);
	    	ret.setLabel(parent);
	    return ret;
  }



  /**
   * 
   * @param datatype
   * @return
   */
  public static CrossRefsNode processDatatype(Datatype datatype,String id) {
	CrossRefsNode ret = new CrossRefsNode ();
    List<CrossRefsNode> refNodes=new ArrayList<CrossRefsNode>();

    CrossRefsLabel parent = getLabel(datatype);    
    if(datatype instanceof ComplexDatatype) {
    for (Component child :((ComplexDatatype)datatype).getComponents()) {
    	if(child.getRef().getId().equals(id)) {
    		CrossRef ref = new CrossRef();
    		CrossRefsNode node = new CrossRefsNode();
    		ref.setLocation(child.getPosition()+"");
    		ref.setLabel(child.getName());
    		ref.setNamePath(child.getName());
    		ref.setType(Type.COMPONENT);
    		ref.setParent(parent);
    		node.setData(ref);
    		refNodes.add(node);
    		}
    		}
    }
    	ret.setChildren(refNodes);
    	ret.setLabel(parent);
    return ret;
  }


  /**
   * 
   * @param segments
   * @return
   */
  public static List<CrossRefsNode> processSegments(List<Segment> segments , String id) {
	  List<CrossRefsNode> ret = new ArrayList<CrossRefsNode>();

    for (Segment segment : segments) {
    		ret.add(filterSegment(segment, id));
    }
    return ret;
  }


  /**
   * 
   * @param list
   * @return
   */
  public static List<CrossRefsNode> processDatatypes(List<Datatype> list, String id) {
	  List<CrossRefsNode> ret = new ArrayList<CrossRefsNode>();
    for (Datatype dt : list) {
      ret.add(processDatatype( dt, id));
    }
    return ret;
  }

  /**
   * 
   * @param conformanceProfile
   * @param segmentId
   * @return
   */
//  public static List<CrossRefsNode> processSegmentReferences(Document conformanceProfile,
//      String segmentId) {
//    List<CrossRefsNode> tmp = new ArrayList<CrossRefsNode>();
//    List<Document> children = (List<Document>) conformanceProfile.get("children");
//
//    CrossRefsLabel parent =  getLabel(conformanceProfile);
//   
//    if (children != null) {
//      for (Document child : children) {
//
//    	   if (child.get("type").equals("SEGMENTREF")) {
//    	       child.append("path", child.getString("position"));
//    		   CrossRefsNode res = processSegmentRef(child, segmentId);
//          if (res != null) {
//   		   res.getData().setParent(parent);
//   		   tmp.add(res);
//          }
//        } else {        	
//          List<CrossRefsNode> groupResults = processGroup(child, segmentId);
//          if (groupResults != null && !groupResults.isEmpty()) {
//            tmp.addAll(groupResults);
//          }
//        }
//      }
//    }
//    return tmp;
//  }
  
  
  public static List<CrossRefsNode> processSegmentReferences(ConformanceProfile conformanceProfile,
	      String segmentId) {
	    List<CrossRefsNode> tmp = new ArrayList<CrossRefsNode>();
	    Set<SegmentRefOrGroup> children =  conformanceProfile.getChildren();

	    CrossRefsLabel parent =  getLabel(conformanceProfile);
	   
	    if (children != null) {
	      for (SegmentRefOrGroup child : children) {

	    	   if (child instanceof SegmentRef) {
	    		   
	    		   
	    		   SegmentRef segRef=(SegmentRef)child;
	    		   if(segRef.getRef() != null && segRef.getRef().getId().equals(segmentId)) {
	    			   
	    			   CrossRefsNode ref = createSegmentCrossRefNode(segRef, null,"", parent);
	    			   tmp.add(ref);
	    		   }

	        } else if( child instanceof Group) {
	        	
	        	 Group  gr=(Group)child;
	        	 
	        	 
	        	 
	        	    List<CrossRefsNode> groupResults = processGroup(gr, segmentId,"","", parent);
	    	        if (groupResults != null && !groupResults.isEmpty()) {
	    	          tmp.addAll(groupResults);
	    	        		}
	        		}
	      	}
	      }
	    return tmp;
}
  

  
  
  

  private static CrossRefsNode createSegmentCrossRefNode(SegmentRef segRef, String path, String namePath, CrossRefsLabel parent) {
	// TODO Auto-generated method stub
	  CrossRefsNode node = new CrossRefsNode();
	  CrossRefsLabel label = new CrossRefsLabel();
	  label.setType(Type.SEGMENTREF);
	  CrossRef data = new CrossRef();
	  data.setType(Type.SEGMENTREF);
	  data.setNamePath(adjustPath(namePath));
	  if(path!=null) {
	  data.setLocation(adjustPath(path +"."+ segRef.getPosition()));
	  
	  }else {
		  data.setLocation(segRef.getPosition()+"");
  
	  }
	  node.setData(data);
	  node.setLabel(label);
	  
	 
	return node;
}

  private static List<CrossRefsNode> processGroup(Group group,String segmentId, String path, String namePath, CrossRefsLabel parent) {
	// TODO Auto-generated method stub

	  
	  List<CrossRefsNode> tmp = new ArrayList<CrossRefsNode>();
	  	  
	  if (group.getChildren() != null) {
	    for (SegmentRefOrGroup child : group.getChildren()) {

	      if (child instanceof SegmentRef) {
	    	  SegmentRef ref = (SegmentRef)child;
	    	  
	    	  if(ref.getRef().getId().equals(segmentId)) {
	    		  
	    		  tmp.add(createSegmentCrossRefNode( ref, path+"."+group.getPosition(),namePath+"."+group.getName(),  parent));
	    		  
	    	  
	    	  } else if(child instanceof Group ){
	    		  
	    		  Group gr= (Group) child;
	    	  
	        List<CrossRefsNode> groupResults = processGroup(gr, segmentId,path+"."+group.getPosition(), namePath+"."+group.getName(), parent);
	        if (groupResults != null && !groupResults.isEmpty()) {
	          tmp.addAll(groupResults);
	        }
	      }
	    }
	    }
	  }
	  return tmp;
}

  private static String  adjustPath(String path) {
	  if(path.startsWith(".")) {
		  path = path.substring(1);
	  }
	  return path;
	  
  }

private static  CrossRefsLabel getLabel(Document doc) {
	  
	// TODO Auto-generated method stub
	  CrossRefsLabel label = new CrossRefsLabel();
	  DomainInfo info=new DomainInfo();
	  label.setName(doc.getString("name"));
	  Document domainInfo = (Document) doc.get("domainInfo");
	  if(domainInfo !=null) {
		String  scope = domainInfo.getString("scope");
		  if(scope !=null) {
			 Scope sc= Scope.fromString(scope);
			 info.setScope(sc);
		String  version = domainInfo.getString("version");
		if(version !=null)
		info.setVersion(version);
		
		  }
	  }
	  
	  label.setDomainInfo(info);
	  label.setName(getName(doc));
	  return label;
	    
	  
  }
  
  
  private static  CrossRefsLabel getLabel(AbstractDomain doc) {
	  
	// TODO Auto-generated method stub
	  CrossRefsLabel label = new CrossRefsLabel();
	  label.setDomainInfo(doc.getDomainInfo());
	  label.setName(doc.getLabel());
	 
	  return label;
	    
	  
  }



/**
   * 
   * @param segmentRef
   * @param segmentId
   * @return
   */
//  public static CrossRefsNode processSegmentRef(SegmentRef ref, String segmentId) {
//	  if(matchSegment(ref,segmentId)) {
//	  CrossRefsNode ref = new CrossRefsNode();
//	  CrossRef data= new CrossRef();
//	  data.setLocation(doc.getString("path"));
//	  ref.setData(data);
//	  data.setType(Type.SEGMENTREF);
//	  return ref;
//	  }else {
//		  return null;
//		  
//	  }
//	  
//			
//  }

  /**
   * 
   * @param group
   * @param segmentId
   * @return
   */
//  public static List<CrossRefsNode> processGroup(Document group, String segmentId) {
//    List<CrossRefsNode> tmp = new ArrayList<CrossRefsNode>();
//    List<Document> children = (List<Document>) group.get("children");
//    if (children != null) {
//      for (Document child : children) {
//        child.append("path", group.get("path") + "." + child.getInteger("position"));
//        child.append("name", group.get("name")+"."+child.get("name"));
//        if (child.get("type").equals("SEGMENTREF")) {
//        		CrossRefsNode res = processSegmentRef(child, segmentId);
//          if (res != null) {
//            tmp.add(res);
//          }
//        } else {
//          List<CrossRefsNode> groupResults = processGroup(child, segmentId);
//          if (groupResults != null && !groupResults.isEmpty()) {
//            tmp.addAll(groupResults);
//          }
//        }
//      }
//    }
//    return tmp;
//  }


  /**
   * 
   * @param object
   * @param id
   * @return
   */
  public static boolean matchSegment(Document object, String id) {
    return ((Document) object.get("ref")).get("_id").toString().equals(id);
  }

  /**
   * 
   * @param level
   * @param objId
   * @return
   */
  public static Criteria getConformanceProfileMultiLevelCriteria(int level, ObjectId objId) {
    List<Criteria> tmp = new ArrayList<Criteria>();
    String query = "ref._id";
    tmp.add(Criteria.where(query).is(objId));
      for (int i = 1; i <= level; i++) {

        query = "children."+query;
        tmp.add(Criteria.where(query).is(objId));
      }
    Criteria criteria = new Criteria().orOperator(tmp.toArray(new Criteria[] {}));
    return criteria;
  }
  
  
  
}
