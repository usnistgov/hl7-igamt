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
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.opencsv.CSVReader;

import gov.nist.hit.hl7.igamt.common.base.domain.Level;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.Status;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetStrength;
import gov.nist.hit.hl7.igamt.common.base.exception.ValidationException;
import gov.nist.hit.hl7.igamt.common.binding.domain.LocationInfo;
import gov.nist.hit.hl7.igamt.common.binding.domain.LocationType;
import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;
import gov.nist.hit.hl7.igamt.common.config.service.ConfigService;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.MessageStructure;
import gov.nist.hit.hl7.igamt.conformanceprofile.repository.MessageStructureRepository;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatement;
import gov.nist.hit.hl7.igamt.constraints.domain.assertion.InstancePath;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Component;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.segment.domain.Field;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;

/**
 * @author Abdelghani El Ouakili
 *
 */
@Service
public class DataFixer {

  @Autowired
  SegmentService segmentsService;

  @Autowired
  ConformanceProfileService conformanceProfileService;

  @Autowired
  DatatypeService datatypeService;

  @Autowired
  ValuesetService valueSetService;

  @Autowired
  MessageStructureRepository  messageStructureRepository;
  @Autowired
  ConfigService configService;



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

  public void shiftBinding(List<String> versions, String segmentName, String fieldPosition, String newPosition, int defaultLocation) {
    for(String v: versions) {
      List<Segment> segments = this.segmentsService.findByDomainInfoScopeAndDomainInfoVersionAndName(Scope.HL7STANDARD.toString(), v, segmentName);
      if(segments  != null) {
        for(Segment seg: segments) {
          shiftBinding(seg, fieldPosition, newPosition, defaultLocation );
          this.segmentsService.save(seg);
        }
      }
    }
  }

  
  

  /**
   * @param seg
   * @param fieldPosition
   * @param fieldPosition2
   * @param defaultLocation
   */
  private void shiftBinding(Segment seg, String position, String childPosition,
      int defaultLocation) {
    if(seg.getBinding() !=null && !seg.getBinding().getChildren().isEmpty()) {
      for( StructureElementBinding binding: seg.getBinding().getChildren()) {
        if(binding.getElementId().equals(position)) {

          if(binding.getValuesetBindings() !=null ) {
            if(binding.getChildren() == null) {
              binding.setChildren(new HashSet<StructureElementBinding>());
            }
            StructureElementBinding child = new StructureElementBinding();
            child.setElementId(childPosition);
            child.setLocationInfo(new LocationInfo(LocationType.COMPONENT, Integer.valueOf(childPosition),this.getComponentName(seg, position, childPosition)));
            child.setValuesetBindings(cloneValueSetBinding(binding.getValuesetBindings(), defaultLocation)); 
            binding.addChild(child);
            binding.setValuesetBindings(null);
          }
        }
      }
    }

  }


  /**
   * @param seg
   * @param childPosition
   * @return
   */
  private String getComponentName(Segment seg, String position, String childPosition) {
    Optional<Field> f = seg.getChildren().stream().filter(x -> x.getPosition() == Integer.valueOf(position)).findAny();
    if(f.isPresent()) {
      Datatype d = this.datatypeService.findById(f.get().getRef().getId());
      if(d != null && d instanceof ComplexDatatype) {
        ComplexDatatype complex = (ComplexDatatype)d;
        Optional<Component> cp = complex.getComponents().stream().filter(x -> x.getPosition() == Integer.valueOf(childPosition)).findAny();
        if(cp.isPresent()) {
          return cp.get().getName();
        }
      }
    }
    return null;
  }


  /**
   * @param valuesetBindings
   * @param defaultLocation 
   * @return
   */
  private Set<ValuesetBinding> cloneValueSetBinding(Set<ValuesetBinding> valuesetBindings, int location) {
    // TODO Auto-generated method stub
    Set<ValuesetBinding> vsBindings = new  HashSet<ValuesetBinding>();
    for(ValuesetBinding vs: valuesetBindings) {
      ValuesetBinding newVs = new ValuesetBinding();
      newVs.setStrength(vs.getStrength());
      newVs.setValueSets(vs.getValueSets());
      if(location != 0) {
        newVs.addValuesetLocation(location);
      }
      vsBindings.add(newVs);
    }
    return vsBindings;
  }

  public void changeHL7SegmentDatatype(String segmentName, String location, String newDatatype, String version) {

    List<Segment> segments = this.segmentsService.findByDomainInfoScopeAndDomainInfoVersionAndName(Scope.HL7STANDARD.toString(), version, segmentName);
    if(segments != null) {
      for (Segment s: segments) {
        for(Field f: s.getChildren()) {
          if(f.getId().equals(location)) {
            List<Datatype> datatypes = this.datatypeService.findByDomainInfoScopeAndDomainInfoVersionAndName(Scope.HL7STANDARD.toString(), version, newDatatype);
            if(datatypes != null && !datatypes.isEmpty() ) {
              f.getRef().setId(datatypes.get(0).getId());
              this.segmentsService.save(s);
              break;
            }
          }
        }
      }
    }
  }

  public void publishStructure(String id) {
    MessageStructure msg = this.messageStructureRepository.findOneById(id);
    if(msg != null) {
      msg.getDomainInfo().setScope(Scope.HL7STANDARD); 
      msg.setParticipants(null);
      msg.setCustom(false);
      msg.setId(new ObjectId().toString());
      messageStructureRepository.insert(msg);
    }

  }


  /**
   * 
   */
  public void fixDatatypeConstraintsLevel() {
    List<Datatype> dts = this.datatypeService.findByDomainInfoScope(Scope.USER.toString());
    Map<String, Boolean> map = new HashMap<String, Boolean>();
    for(Datatype dt: dts) {
      if(dt.getBinding() !=null ) {
        if(dt.getBinding().getConformanceStatements() != null) {
          for(ConformanceStatement statement: dt.getBinding().getConformanceStatements()) {
            if(statement.getLevel() == null || !statement.getLevel().equals(Level.DATATYPE)) {
              statement.setLevel(Level.DATATYPE);
              map.put(dt.getId(), true);
            }
          }
        }
      }
      if(map.containsKey(dt.getId())) {
        this.datatypeService.save(dt);
      }
    }
  }

  public void fixConformanceProfileConstaintsLevel() {
    List<ConformanceProfile> cps = this.conformanceProfileService.findByDomainInfoScope(Scope.USER.toString());
    Map<String, Boolean> map = new HashMap<String, Boolean>();
    for(ConformanceProfile cp: cps) {
      if(cp.getBinding() !=null ) {
        if(cp.getBinding().getConformanceStatements() != null) {
          for(ConformanceStatement statement: cp.getBinding().getConformanceStatements()) {
            statement.setLevel(this.getAssertionLevel(Level.CONFORMANCEPROFILE, statement.getContext()));
          }
        }
        if(cp.getBinding().getChildren() != null) {
          processAndFixPredicateLevel(Level.CONFORMANCEPROFILE, cp.getBinding().getChildren());
          this.conformanceProfileService.save(cp);
        }
      }
    }
  }

  private Level getAssertionLevel(Level level, InstancePath context) {
    if(level.equals(Level.CONFORMANCEPROFILE)) {
      if(context!= null) {
        return Level.GROUP;
      }
    }
    return level;
  }


  private void processAndFixPredicateLevel(Level resourceLevel,
      Set<StructureElementBinding> children) {
    for(StructureElementBinding child: children ) {
      if(child.getPredicate() != null ) {
        child.getPredicate().setLevel(this.getAssertionLevel(Level.CONFORMANCEPROFILE, child.getPredicate().getContext()));
      }
      if(child.getChildren() != null) {
        processAndFixPredicateLevel(Level.CONFORMANCEPROFILE, child.getChildren());
      }
    }
  }


  /**
   * 
   */
  public void addStructureIds() {
    List<Segment>  segments = this.segmentsService.findAll();
    if(segments != null) {
      for(Segment s: segments) {
        if(s.isCustom()) {
          if( s.getDomainInfo().getScope().equals(Scope.USERCUSTOM)) {
            s.setStructureIdentifier(s.getId());
          } else {
            s.setStructureIdentifier(this.findStructureParent(s));
          }
          this.segmentsService.save(s);
        }
      }
    }
  }


  private String findStructureParent(Segment s) {
    if(s.getFrom() != null) {
      Segment parent =  this.segmentsService.findById(s.getFrom());
      if(parent != null) {
        if(parent.getDomainInfo() !=null && parent.getDomainInfo().getScope().equals(Scope.USERCUSTOM)) {
          return parent.getId();
        }else if(parent.getDomainInfo() !=null && parent.getDomainInfo().getScope().equals(Scope.HL7STANDARD)) {
          return parent.getId();
        }else if(parent.getDomainInfo() !=null && parent.getDomainInfo().getScope().equals(Scope.USER)) {
          return findStructureParent(parent);
        }
      }
    }
    return null;
  }

  public void shiftAllBinding() {
    this.shiftBinding(new ArrayList<String>(Arrays.asList("2.6",  "2.7",  "2.7.1", "2.8",  "2.8.1",  "2.8.2")), "ADJ", "6", "2", 1);
    this.shiftBinding(new ArrayList<String>(Arrays.asList("2.8",  "2.8.1",  "2.8.2")), "CDO", "4", "2", 1);
    this.shiftBinding(new ArrayList<String>(Arrays.asList("2.6",  "2.7",  "2.7.1", "2.8",  "2.8.1",  "2.8.2")), "PSL", "12", "2", 1);
    this.shiftBinding(new ArrayList<String>(Arrays.asList("2.3.1", "2.4", "2.5", "2.5.1", "2.6")), "QRD", "7", "2", 1);
    this.shiftBinding(new ArrayList<String>(Arrays.asList("2.4", "2.5", "2.5.1", "2.6",  "2.7",  "2.7.1", "2.8",  "2.8.1",  "2.8.2")), "RCP", "2", "2", 1);    
    this.shiftBinding(new ArrayList<String>(Arrays.asList("2.4", "2.5", "2.5.1", "2.6",  "2.7",  "2.7.1", "2.8",  "2.8.1",  "2.8.2")), "ABS", "1", "1", 0);
    this.shiftBinding(new ArrayList<String>(Arrays.asList("2.3.1", "2.4", "2.5", "2.5.1", "2.6",  "2.7",  "2.7.1", "2.8",  "2.8.1",  "2.8.2")), "EVN", "5", "1", 0);
    this.shiftBinding(new ArrayList<String>(Arrays.asList("2.3.1", "2.4", "2.5", "2.5.1", "2.6",  "2.7",  "2.7.1", "2.8",  "2.8.1",  "2.8.2")), "FT1", "20", "1", 0);
    this.shiftBinding(new ArrayList<String>(Arrays.asList("2.3.1", "2.4","2.5", "2.5.1", "2.6",  "2.7",  "2.7.1", "2.8",  "2.8.1",  "2.8.2")), "IN3", "14", "1", 0);
    this.shiftBinding(new ArrayList<String>(Arrays.asList("2.3.1", "2.4","2.5", "2.5.1", "2.6",  "2.7",  "2.7.1", "2.8",  "2.8.1",  "2.8.2")), "IN3", "25", "1", 0);
    this.shiftBinding(new ArrayList<String>(Arrays.asList( "2.3.1", "2.4", "2.5", "2.5.1")), "PR1", "8", "1", 0);
    this.shiftBinding(new ArrayList<String>(Arrays.asList( "2.3.1", "2.4", "2.5", "2.5.1")), "PR1", "11", "1", 0);
    this.shiftBinding(new ArrayList<String>(Arrays.asList( "2.3.1", "2.4", "2.5", "2.5.1")), "PR1", "12", "1", 0);
    this.shiftBinding(new ArrayList<String>(Arrays.asList("2.3.1","2.4", "2.5", "2.5.1", "2.6",  "2.7",  "2.7.1", "2.8",  "2.8.1",  "2.8.2")), "PV1", "7", "1", 0);
    this.shiftBinding(new ArrayList<String>(Arrays.asList("2.3.1","2.4", "2.5", "2.5.1", "2.6",  "2.7",  "2.7.1", "2.8",  "2.8.1",  "2.8.2")), "PV1", "8", "1", 0);
    this.shiftBinding(new ArrayList<String>(Arrays.asList("2.3.1","2.4", "2.5", "2.5.1", "2.6")), "PV1", "9", "1", 0);
    this.shiftBinding(new ArrayList<String>(Arrays.asList("2.3.1","2.4", "2.5", "2.5.1", "2.6",  "2.7",  "2.7.1", "2.8",  "2.8.1",  "2.8.2")), "PV1", "17", "1", 0);
    this.shiftBinding(new ArrayList<String>(Arrays.asList("2.3.1","2.4", "2.5", "2.5.1", "2.6")), "PV1", "52", "1", 0);
    this.shiftBinding(new ArrayList<String>(Arrays.asList("2.6",  "2.7",  "2.7.1", "2.8",  "2.8.1",  "2.8.2")), "SDC", "34", "1", 0);
  }


  /**
   * 
   */
  public void addFixedExt() {
    List<Segment> segments =  this.segmentsService.findByDomainInfoScope("USERCUSTOM");
    
    for(Segment s: segments) {
      if(s.getStatus() != null &&s.getStatus().equals(Status.PUBLISHED)){
        s.setFixedExtension(s.getExt());
        s.setExt(null);
        this.segmentsService.save(s);
      }
    }
  }

}
