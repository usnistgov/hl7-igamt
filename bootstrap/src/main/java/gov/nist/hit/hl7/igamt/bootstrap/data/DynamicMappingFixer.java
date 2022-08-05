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

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
import gov.nist.hit.hl7.igamt.common.base.exception.ForbiddenOperationException;
import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.exceptions.AddingException;
import gov.nist.hit.hl7.igamt.ig.service.CrudService;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
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
  
  @Autowired
  IgService igService;
  
  @Autowired
  CrudService crudService;
  
  
  public void processSegments() {
    List<Segment> obxs = segmentsService.findByName("OBX");
    obxs.forEach((x) -> {try {
		processSegment(x);
	} catch (ForbiddenOperationException e) {
		e.printStackTrace();
	}});
  }
  /**
   * @param x
 * @throws ForbiddenOperationException 
   */
  private void processSegment(Segment s) throws ForbiddenOperationException {
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

  
  public void addMissingDatatypesBasedOnDynamicMapping() throws AddingException, ForbiddenOperationException{
    List<Ig> igs =   igService.findAll();
    
    for(Ig ig :igs ) {
      List<Segment> segments = segmentsService.findByIdIn(ig.getSegmentRegistry().getLinksAsIds()).stream().filter(x -> x.getDynamicMappingInfo()!=null && x.getDynamicMappingInfo().getItems() !=null && !x.getDynamicMappingInfo().getItems().isEmpty() ).collect(Collectors.toList());
      Map<String, Link> datatypeMap= ig.getDatatypeRegistry().getLinksAsMap();
      Set<String> ids = new HashSet<String>();
      for(Segment s: segments) {
        System.out.println(s.getName());
        ids.addAll(s.getDynamicMappingInfo().getItems().stream().filter(x -> !datatypeMap.containsKey(x.getDatatypeId())).map(y -> y.getDatatypeId()).collect(Collectors.toSet()));
      }
      if(!ids.isEmpty()) {
        crudService.addDatatypes(ids, ig);
        igService.save(ig);
      }
      
    }
    
  }

  
  
}
