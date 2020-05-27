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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.RealKey;
import gov.nist.hit.hl7.igamt.common.base.domain.SourceType;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
import gov.nist.hit.hl7.igamt.common.base.exception.ValidationException;
import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;
import gov.nist.hit.hl7.igamt.common.binding.service.BindingService;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.valueset.domain.Code;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.domain.property.Constant.SCOPE;
import gov.nist.hit.hl7.igamt.valueset.repository.ValuesetRepository;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;

/**
 * @author Abdelghani El Ouakili
 *
 */
@Service
public class TablesFixes {

  @Autowired
  ValuesetService valueSetService;
  @Autowired
  ValuesetRepository repo;
  @Autowired
  SegmentService segmentService;
  @Autowired
  DatatypeService datatypeService;
  @Autowired
  BindingService bindingService;

  @Autowired
  IgService igService;
  public static String HL70396Id="HL70396V2-x";

  public Valueset createTable0396() {
    List<Valueset> vslist=  valueSetService.findByDomainInfoScopeAndDomainInfoVersionAndBindingIdentifier(SCOPE.HL7STANDARD.toString(), "2.8.2", "HL70396");
    Valueset vs = vslist.get(0);
    vs.setId(HL70396Id);
    vs.setVersion((long) 0);
    vs.setSourceType(SourceType.EXTERNAL);
    vs.setCodes(new HashSet<Code>());
    vs.getDomainInfo().setVersion("2.x");
    repo.insert(vs);
    return vs;

  }


  public void fix0396() throws ValidationException {
   createTable0396();
   HashMap<String, String>  ids =collectIds();
   replaceAllSegmentbinding(ids);
   replaceAllDataTypebinding(ids);
   replaceInIg(ids);
   
  }

  public void replaceAllSegmentbinding(HashMap<String, String> newKeys) throws ValidationException{
    List<Segment> segments= segmentService.findAll();
    for(Segment s : segments) {
      if(s.getBinding()!=null) {

        if(s.getBinding().getChildren() !=null) {
          for(StructureElementBinding binding: s.getBinding().getChildren()) {
            processAndSubstitute(binding, newKeys);
          }
        }
      }
      segmentService.save(s);
    }
    
  }

  public void replaceAllDataTypebinding(HashMap<String, String> newKeys){
    List<Datatype> datatypes= datatypeService.findAll();
    for(Datatype dt : datatypes) {
      if(dt.getBinding()!=null) {

        if(dt.getBinding().getChildren() !=null) {
          for(StructureElementBinding binding: dt.getBinding().getChildren()) {
            processAndSubstitute(binding, newKeys);
          }
        }
      }
      datatypeService.save(dt);
    }
  }


  public void replaceInIg(HashMap<String, String> newKeys){
    List<Ig> igs = igService.findAll();
    for(Ig ig : igs) {
      for(Link l: ig.getValueSetRegistry().getChildren()) {
        if(newKeys.containsKey(l.getId())) {
          l.setId(newKeys.get(l.getId()));
          l.getDomainInfo().setVersion("2.x");
        }
        igService.save(ig);
      }

    }
  }
  public void replaceAllDataTypeBinding(HashMap<String, String> newKeys){


  }

  public  HashMap<String, String> collectIds() {
    HashMap<String, String> ids= new HashMap<String, String>();

    List<Valueset> dynamicTables= valueSetService.findByDomainInfoScopeAndBindingIdentifier(SCOPE.HL7STANDARD.toString(), "HL70396");
    for(Valueset s: dynamicTables) {
      ids.put(s.getId(), HL70396Id);
    }
    return ids;
  }



  private void processAndSubstitute(StructureElementBinding elm, HashMap<String, String> newKeys) {
    // TODO Auto-generated method stub
    if(elm.getValuesetBindings() !=null) {
      for(ValuesetBinding vs: elm.getValuesetBindings()) {
        if(vs.getValueSets() !=null) {
          List<String> newVs = new ArrayList<String>();
          for (String s : vs.getValueSets()) {
            if(newKeys.containsKey(s)) {
              newVs.add(newKeys.get(s));
            }else {
              newVs.add(s);
            }
          }
          vs.setValueSets(newVs);
        }
      }     
    }
    if(elm.getChildren() !=null) { 
      for (StructureElementBinding child: elm.getChildren()) {
        processAndSubstitute(child, newKeys);
      }
    }
  }




}
