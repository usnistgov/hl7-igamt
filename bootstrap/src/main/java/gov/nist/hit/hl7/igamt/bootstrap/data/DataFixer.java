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

import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Set;

import org.hibernate.engine.jdbc.spi.TypeSearchability;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.opencsv.CSVReader;

import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetStrength;
import gov.nist.hit.hl7.igamt.common.base.exception.ValidationException;
import gov.nist.hit.hl7.igamt.common.binding.domain.LocationInfo;
import gov.nist.hit.hl7.igamt.common.binding.domain.LocationType;
import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;
import gov.nist.hit.hl7.igamt.segment.domain.Field;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;
import net.bytebuddy.description.type.TypeDescription.Generic.Visitor.TypeErasing;

/**
 * @author Abdelghani El Ouakili
 *
 */
@Service
public class DataFixer {

  @Autowired
  SegmentService segmentsService;

  @Autowired
  ValuesetService valueSetService;
  


  public void readCsv() throws ValidationException {
    String csvFile = "/Users/ena3/projects/hl7-igamt/bootstrap/src/main/resources/HL7tables-csv.csv";
    List<BindingInfo> locationIssues= new ArrayList<BindingInfo>();
    HashMap<String, Segment> segmentMap= new HashMap<String, Segment>();
    HashMap<String, String> valueSetIds= new HashMap<String, String>();

    CSVReader reader = null;
    try {
      reader = new CSVReader(new FileReader(csvFile));
      String[] line;
      while ((line = reader.readNext()) != null) {
        System.out.println("Country [id= " + line[0] + ", code= " + line[1] + " , name=" + line[2] + "]");
        if(line[8] !=null && line[8].equals("Frank") && line[9].equals("1")) {

          BindingInfo info = new BindingInfo(line[1], line[2], line[4], line[6], line[7]);
          fix(info);
          // locationIssues.add(new BindingInfo(line[1], line[2], line[4], line[6], line[7]));
        }
      }
      System.out.println(locationIssues.size());        
    } catch (IOException e) {
      e.printStackTrace();
    }
  }


  /**
   * @param info
   * @throws ValidationException 
   */
  private void fix(BindingInfo info) throws ValidationException {
    // TODO Auto-generated method stub
    List<Segment>  segments= this.segmentsService.findByDomainInfoScopeAndDomainInfoVersionAndName(Scope.HL7STANDARD.toString(), info.version, info.name);
    for(Segment s: segments) {
      fixLocation(s,info.vs, info.position);
    }
  }

  /**
   * @param s
   * @param vs
   * @param position
   * @throws ValidationException 
   */
  private void fixLocation(Segment s, String vs, String position) throws ValidationException {
    // TODO Auto-generated method stub
    String vsID= this.valueSetService.findByDomainInfoScopeAndDomainInfoVersionAndBindingIdentifier(s.getDomainInfo().getScope().toString(), s.getDomainInfo().getVersion(), vs).get(0).getId();

    createBindingStructure(s, vsID, position);
    this.segmentsService.save(s);

  }


  /**
   * @param children
   * @param vs
   * @param position
   */
  private void createBindingStructure(Segment s, String vs, String position) {
    // TODO Auto-generated method stub 
    for(Field f: s.getChildren()) {
      if( f.getPosition() ==Integer.valueOf(position)) {
        StructureElementBinding structure = new StructureElementBinding();
        structure.setElementId(f.getId());
        structure.setLocationInfo(new LocationInfo(LocationType.FIELD, Integer.valueOf(position), f.getName()));
        ValuesetBinding vsBinding= new ValuesetBinding();
        vsBinding.addValuesetLocation(1);
        List<String> valueSets = new ArrayList<String>();
        vsBinding.setStrength(ValuesetStrength.R);
        valueSets.add(vs);
        vsBinding.setValueSets(valueSets);
        structure.addValuesetBinding(vsBinding);
        s.getBinding().addChild(structure);
        break;
      }
    }
  }
  

}
