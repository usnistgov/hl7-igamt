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
package gov.nist.hit.hl7.igamt.ig.domain.datamodel;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.Group;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRef;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRefOrGroup;
import gov.nist.hit.hl7.igamt.constraints.domain.Predicate;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;

/**
 * @author jungyubw
 *
 */
public class SegmentRefOrGroupDataModel implements Serializable{
  private SegmentRefOrGroup model;

  private Type type;
  private SegmentBindingDataModel segment;
  private Set<SegmentRefOrGroupDataModel> children;
  private Predicate predicate;


  public SegmentRefOrGroupDataModel() {
    super();
  }

  public SegmentRefOrGroupDataModel(SegmentRefOrGroup sog, String parentKey, Map<String, Predicate> predicateMap, SegmentService segmentService) {
    super();
    this.model = sog;
    String key = null;
    if(parentKey == null) {
      key = "" + sog.getPosition();
    }else {
      key = parentKey + "." + sog.getPosition();
    }

    this.predicate = predicateMap.get(key);

    if (sog instanceof Group) {
      this.type = Type.GROUP;
      Group g = (Group)sog;
      for (SegmentRefOrGroup child : g.getChildren()) {
        this.addChild(new SegmentRefOrGroupDataModel(child, key, predicateMap, segmentService));        
      }
    }else {
      this.type = Type.SEGMENTREF;  
      SegmentRef sr = (SegmentRef)sog;
      Segment s = segmentService.findById(sr.getRef().getId());
      if(s != null) {
        this.segment = new SegmentBindingDataModel(s);
      }
    }
    
  }

  public SegmentRefOrGroup getModel() {
    return model;
  }

  public void setModel(SegmentRefOrGroup model) {
    this.model = model;
  }

  public Type getType() {
    return type;
  }

  public void setType(Type type) {
    this.type = type;
  }

  public SegmentBindingDataModel getSegment() {
    return segment;
  }

  public void setSegment(SegmentBindingDataModel segment) {
    this.segment = segment;
  }

  public Predicate getPredicate() {
    return predicate;
  }

  public void setPredicate(Predicate predicate) {
    this.predicate = predicate;
  }

  public Set<SegmentRefOrGroupDataModel> getChildren() {
    return children;
  }

  public void setChildren(Set<SegmentRefOrGroupDataModel> children) {
    this.children = children;
  }
  
  public void addChild(SegmentRefOrGroupDataModel child) {
    if(this.children == null) this.children = new HashSet<SegmentRefOrGroupDataModel>();
    this.children.add(child);
  }

  /**
   * @param parseInt
   * @return
   */
  public SegmentRefOrGroupDataModel findChildByPosition(int position) {
    for(SegmentRefOrGroupDataModel sgModel : this.children) {
      if (sgModel.getModel().getPosition() == position) return sgModel;
    }
    return null;
  }

}
