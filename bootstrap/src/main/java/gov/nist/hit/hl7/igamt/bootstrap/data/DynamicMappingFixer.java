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
package gov.nist.hit.hl7.igamt.bootstrap.data;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.segment.domain.DynamicMappingInfo;
import gov.nist.hit.hl7.igamt.segment.domain.DynamicMappingItem;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.valueset.domain.Code;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;

/**
 * @author Abdelghani El Ouakili
 *
 */
@Service
public class DynamicMappingFixer {

  @Autowired
  SegmentService segmentsService;

  @Autowired
  ValuesetService valueSetService;
  
  @Autowired
  DatatypeService datatypeService;
  
  
  public void processSegments() {
    List<Segment> obxs = segmentsService.findByName("OBX");
    obxs.forEach((x) -> {processSegment(x);});
  }


  /**
   * @param x
   */
  private void processSegment(Segment s) {
    // TODO Auto-generated method stub
    s.setDynamicMappingInfo(new DynamicMappingInfo("2", "5", null));
    String vsId =  findObx2VsId(s);
  
    if(vsId != null) {
      Valueset vs = valueSetService.findById(vsId);
      for(Code c : vs.getCodes()) {
        if(c.getValue() !=null) {
         Datatype d = datatypeService.findOneByNameAndVersionAndScope(c.getValue(),s.getDomainInfo().getVersion(), Scope.HL7STANDARD.toString());
         if(d != null) {
           s.getDynamicMappingInfo().addItem(new DynamicMappingItem(d.getId(), c.getValue()));
         }
        }
      }
    }
    segmentsService.save(s);  
  }


  /**
   * @param s
   * @return
   */
  private String findObx2VsId(Segment s) {
    // TODO Auto-generated method stub
    if(s.getBinding() != null && s.getBinding().getChildren() != null) {
     for(StructureElementBinding child : s.getBinding().getChildren()) {
       if(child.getLocationInfo() != null && child.getLocationInfo().getPosition() ==2) {
         if(child.getValuesetBindings() != null) {
           Optional<ValuesetBinding> vs = child.getValuesetBindings().stream().findAny();
           if(vs.isPresent() && vs.get().getValueSets() !=null && !vs.get().getValueSets().isEmpty()) {
            return vs.get().getValueSets().get(0);
           }
     
         }
       }
     }
    }
    
    return null;
  }
  
  
}
