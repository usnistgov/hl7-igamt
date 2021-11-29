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
package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;

import java.util.Map.Entry;
import java.util.Set;

import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.MsgStructElement;
import gov.nist.hit.hl7.igamt.common.base.domain.StructureElement;
import gov.nist.hit.hl7.igamt.common.base.domain.SubStructElement;
import gov.nist.hit.hl7.igamt.common.binding.domain.Binding;
import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.ChangeReason;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.Group;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRef;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRefOrGroup;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import nu.xom.Attribute;
import nu.xom.Element;

/**
 * @author Abdelghani El Ouakili
 *
 */
@Service
public class ReasonForChangeSerializationServiceImpl implements ReasonForChangeSerializationService {




  private Element createReasonElement(String location , PropertyType p, ChangeReason r) {
    Element reason =  new Element("Reason");

    reason.addAttribute(new Attribute("Property",
        p.toString() != null ? p.toString() : ""));

    reason.addAttribute(new Attribute("Text",
        r.getReason() != null ? r.getReason() : ""));

    reason.addAttribute(new Attribute("Location",
        location != null ? location : ""));

    reason.addAttribute(new Attribute("Date",
        r.getDate().toString() != null ? r.getDate().toString() : ""));

    return reason;

  }

  @Override
  public <T extends StructureElement> Element serializeReasonForChange(String label, Binding binding,
      Set<T> children) throws SerializationException {
    Element reasons =  new Element("Reasons");
    for (T child : children) {

      if( child instanceof SubStructElement) {
        if(child.getChangeLog() != null) {
          child.getChangeLog().forEach( (p, r) -> reasons.appendChild(this.createReasonElement(label + "." + child.getPosition() , p, r)));
        }
      } else if ( child instanceof SegmentRefOrGroup) {
        this.appendSegmentOrGroup(reasons, label, (SegmentRefOrGroup)child);
      }
    }

    if(binding != null && binding.getChildren() != null ) {
      for( StructureElementBinding struct: binding.getChildren()) {
        this.appendBinding(reasons, label, struct);

      }

    }
    return reasons;    
  }


  public  void appendSegmentOrGroup( Element reasons , String label,
      SegmentRefOrGroup child) throws SerializationException {

    if(child.getChangeLog() != null) {
      child.getChangeLog().forEach( (p, r) -> reasons.appendChild(this.createReasonElement(label + "." + ((SegmentRef)child).getPosition() , p, r)));
    }
    if(child instanceof Group) {
      Group grp = (Group)child;
      if(grp.getChildren() != null) {
        for (SegmentRefOrGroup subChild: grp.getChildren()) {
          this.appendSegmentOrGroup(reasons, label + "." + grp.getPosition(), subChild);
        }
      }
    }

  }


  public  void appendBinding( Element reasons , String label,
      StructureElementBinding child) throws SerializationException {
    if(child.getChangeLog() != null) {
      if(child.getLocationInfo() != null) {
        child.getChangeLog().forEach( (p, r) -> reasons.appendChild(this.createReasonElement(label + "." + child.getLocationInfo().getPosition()  , p, r)));
      }
      if(child.getChildren() != null) {
        for (StructureElementBinding subChild: child.getChildren()) {

          if(child.getLocationInfo() != null) {
            this.appendBinding(reasons, label + "." + child.getLocationInfo().getPosition(), subChild);
          }
        }
      }
    }
  }

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.serialization.newImplementation.service.ReasonForChangeSerializationService#serializeValueSetReasons(java.lang.String, gov.nist.hit.hl7.igamt.valueset.domain.Valueset)
   */
  @Override
  public Element serializeValueSetReasons(Valueset vs)
      throws SerializationException {
    
    Element reasons =  new Element("Reasons");

        if(vs.getChangeLogs() != null) {
          for(ChangeReason reason : vs.getChangeLogs()) {
            Element child =  new Element("Reason");



            child.addAttribute(new Attribute("Text",
                reason.getReason() != null ? reason.getReason() : ""));
            child.addAttribute(new Attribute("Date",
                reason.getDate().toString() != null ? reason.getDate().toString() : ""));
            reasons.appendChild(child);
          }
        }
        
    return reasons;    
  

}
}
