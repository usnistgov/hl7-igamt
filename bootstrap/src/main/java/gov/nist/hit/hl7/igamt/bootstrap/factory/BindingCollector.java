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
package gov.nist.hit.hl7.igamt.bootstrap.factory;

import static org.junit.Assert.assertTrue;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;
import gov.nist.hit.hl7.igamt.common.config.service.ConfigService;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Component;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.segment.domain.Field;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.domain.property.Constant.SCOPE;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;

/**
 * @author Abdelghani El Ouakili
 *
 */
@Service
public class BindingCollector {

  /**
   * 
   */
  @Autowired
  ConfigService config;
  @Autowired
  ValuesetService valueSetService;
  @Autowired
  SegmentService segmentService;
  @Autowired
  DatatypeService datatypeService;
  
  
  
  public void collect() throws FileNotFoundException {
    // TODO Auto-generated constructor stub
    for(String s : config.findOne().getHl7Versions()) {
      List<Valueset> vs= valueSetService.findDisplayFormatByScopeAndVersion(SCOPE.HL7STANDARD.toString(), s);
      Map<String, String> valueSetsNames = vs.stream().collect(
          Collectors.toMap(Valueset::getId, Valueset::getBindingIdentifier));
      List<Datatype> datatypes= datatypeService.findByDomainInfoScopeAndDomainInfoVersion(SCOPE.HL7STANDARD.toString(), s);
      Map<String, String> datatypesNames = datatypes.stream().collect(
          Collectors.toMap(Datatype::getId, Datatype::getName));
      processSegment(s, valueSetsNames, datatypesNames);
     // processDatatypes(s,valueSetsNames, datatypesNames);
    }
  }



  /**
   * @param s
   * @param names
   * @param datatypesNames 
   * @throws FileNotFoundException 
   */
  private void processSegment(String version, Map<String, String> valueSetsNames, Map<String, String> datatypesNames) throws FileNotFoundException {
    // TODO Auto-generated method stub
    List<Segment> segments= this.segmentService.findByDomainInfoScopeAndDomainInfoVersion(SCOPE.HL7STANDARD.toString(), version);
    gerneratefile("segments"+ version, segments, valueSetsNames,datatypesNames );
  }
  
  private void processDatatypes(String version, Map<String, String> valueSetsNames, Map<String, String> datatypesNames) throws FileNotFoundException {
    // TODO Auto-generated method stub
    List<Datatype> datatypes= this.datatypeService.findByDomainInfoScopeAndDomainInfoVersion(SCOPE.HL7STANDARD.toString(), version);
    gerneratefileDatatypesBindings("datatypes"+ version, datatypes, valueSetsNames,datatypesNames );
    
  }



  /**
   * @param string
   * @param datatypes
   * @param valueSetsNames
   * @param datatypesNames
   * @throws FileNotFoundException 
   */
  private void gerneratefileDatatypesBindings(String name, List<Datatype> datatypes,
      Map<String, String> valueSetsNames, Map<String, String> datatypesNames) throws FileNotFoundException {
    // TODO Auto-generated method stub
    
    File csvOutputFile = new File(name+ ".csv");
    
    List<String> dataLines = new ArrayList<String>();
    dataLines.add("Data Type, Location, Referenced Data type, Value Set");
    
    for(Datatype d: datatypes) {
      if(d instanceof ComplexDatatype) {
      dataLines.addAll(processDatatypeBinding((ComplexDatatype)d,valueSetsNames,datatypesNames ));
      }
    }
    
    try (PrintWriter pw = new PrintWriter(csvOutputFile)) {
        dataLines.stream()
          .forEach(pw::println);
    }
    assertTrue(csvOutputFile.exists());
    
  }



  /**
   * @param string
   * @param version
   * @param segments
   * @throws FileNotFoundException 
   */
  private void gerneratefile(String name, List<Segment> segments,   Map<String, String> valueSetsNames, Map<String, String> datatypesNames) throws FileNotFoundException {
    // TODO Auto-generated method stub
    File csvOutputFile = new File(name+".csv");
    List<String> dataLines = new ArrayList<String>();
    dataLines.add("Segments, Location, Referenced Data type, Value Set");

    for(Segment s: segments) {
      dataLines.addAll(processBinding(s,valueSetsNames,datatypesNames ));
    }
    
    try (PrintWriter pw = new PrintWriter(csvOutputFile)) {
        dataLines.stream()
          .forEach(pw::println);
    }
    assertTrue(csvOutputFile.exists());
  }
  
  private List<String> processBinding(Segment s,  Map<String, String> valueSetsNames, Map<String, String> datatypesNames) {
    List<String> lines= new ArrayList<String>();
    HashMap<String, String> usedDtNames= new HashMap<String, String> ();
    for( Field f : s.getChildren()) {
      if(f.getRef() !=null && f.getRef().getId() !=null) {
        usedDtNames.put(f.getId(), datatypesNames.get(f.getRef().getId()));
      }
    }
    if(s.getBinding() !=null && s.getBinding().getChildren() !=null) {
      for(StructureElementBinding binding: s.getBinding().getChildren()) {
        lines.add(constructBindingLine(s.getName(), binding,usedDtNames, valueSetsNames ));
      }
    
    }
    return lines;
    
  }


  private List<String> processDatatypeBinding(ComplexDatatype d,  Map<String, String> valueSetsNames, Map<String, String> datatypesNames) {
    List<String> lines= new ArrayList<String>();
    HashMap<String, String> usedDtNames= new HashMap<String, String> ();
    for( Component c : d.getComponents()) {
      if(c.getRef() !=null && c.getRef().getId() !=null) {
        usedDtNames.put(c.getId(), datatypesNames.get(c.getRef().getId()));
      }
    }
    if(d.getBinding() !=null && d.getBinding().getChildren() !=null) {
      for(StructureElementBinding binding: d.getBinding().getChildren()) {
        lines.add(constructBindingLine(d.getName(), binding,usedDtNames, valueSetsNames ));
      }
    
    }
    return lines;
    
  }

  /**
   * @param binding
   * @param usedDtNames
   * @param valueSetsNames
   * @return
   */
  private String constructBindingLine(String parent, StructureElementBinding binding,
      HashMap<String, String> usedDtNames, Map<String, String> valueSetsNames) {
    // TODO Auto-generated method stub
    String ret = parent + ',' +binding.getLocationInfo().getPosition() + ','+ usedDtNames.get(binding.getElementId());
   
    if(binding.getValuesetBindings() !=null &&  !binding.getValuesetBindings().isEmpty()) {
      for(ValuesetBinding vsb: binding.getValuesetBindings()) {
        if(vsb.getValueSets() !=null ) {
          for (String vsId: vsb.getValueSets() ) {
            ret = ret + ",HL7" + valueSetsNames.get(vsId);
          }
        } 
      }
    }
    return ret;
  }
  

}
