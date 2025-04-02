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
import java.util.stream.Collectors;

import gov.nist.hit.hl7.igamt.common.binding.service.BindingService;
import io.swagger.models.auth.In;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;

import gov.nist.hit.hl7.igamt.common.base.domain.Level;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.StandardKey;
import gov.nist.hit.hl7.igamt.common.base.domain.Status;
import gov.nist.hit.hl7.igamt.common.base.domain.Usage;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetStrength;
import gov.nist.hit.hl7.igamt.common.base.exception.ForbiddenOperationException;
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
import gov.nist.hit.hl7.igamt.datatype.repository.DatatypeRepository;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.segment.domain.Field;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.repository.SegmentRepository;
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

    @Autowired
    SegmentRepository segmentRepo;

    @Autowired
    DatatypeRepository datatypeRepo;
    @Autowired
    ConfigCreator configCreator;

    @Autowired
    BindingService bindingService;

//  public void readCsv() throws ValidationException, ForbiddenOperationException {
//    String csvFile = "/Users/ena3/projects/hl7-igamt/bootstrap/src/main/resources/HL7tables-csv.csv";
//    List<BindingInfo> locationIssues= new ArrayList<BindingInfo>();
//    HashMap<String, Segment> segmentMap= new HashMap<String, Segment>();
//    HashMap<String, String> valueSetIds= new HashMap<String, String>();
//
//    CSVReader reader = null;
//    try {
//      reader = new CSVReader(new FileReader(csvFile));
//      String[] line;
//      while ((line = reader.readNext()) != null) {
//        System.out.println("Country [id= " + line[0] + ", code= " + line[1] + " , name=" + line[2] + "]");
//        if(line[8] !=null && line[8].equals("Frank") && line[9].equals("1")) {
//
//          BindingInfo info = new BindingInfo(line[1], line[2], line[4], line[6], line[7]);
//          fix(info);
//          // locationIssues.add(new BindingInfo(line[1], line[2], line[4], line[6], line[7]));
//        }
//      }
//      System.out.println(locationIssues.size());
//    } catch (IOException e) {
//      e.printStackTrace();
//    }
//  }


    /**
     * @param info
     * @throws ValidationException
     * @throws ForbiddenOperationException
     */
    private void fix(BindingInfo info) throws ValidationException, ForbiddenOperationException {
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
     * @throws ForbiddenOperationException
     */
    private void fixLocation(Segment s, String vs, String position) throws ValidationException, ForbiddenOperationException {
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

    public void shiftBinding(List<String> versions, String segmentName, String fieldPosition, String newPosition, int defaultLocation) throws ForbiddenOperationException {
        for(String v: versions) {
            List<Segment> segments = this.segmentsService.findByDomainInfoScopeAndDomainInfoVersionAndName(Scope.HL7STANDARD.toString(), v, segmentName);
            if(segments  != null) {
                for(Segment seg: segments) {
                    shiftBinding(seg, fieldPosition, newPosition, defaultLocation );
                    this.segmentRepo.save(seg);
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

    private void reverseShiftBinding(Segment seg, String position, String childPosition, int defaultLocation) {
        if (seg.getBinding() != null && !seg.getBinding().getChildren().isEmpty()) {
            for (StructureElementBinding binding : seg.getBinding().getChildren()) {
                if (binding.getElementId().equals(position)) {

                    StructureElementBinding childToRestore = null;
                    for (StructureElementBinding child : binding.getChildren()) {
                        if (child.getElementId().equals(childPosition)) {
                            childToRestore = child;
                            break;
                        }
                    }

                    if (childToRestore != null) {
                        binding.getChildren().remove(childToRestore);

                        if (childToRestore.getValuesetBindings() != null) {
                            binding.setValuesetBindings(cloneValueSetBinding(childToRestore.getValuesetBindings(), defaultLocation));
                        }
                        binding.setLocationInfo(new LocationInfo(LocationType.FIELD, Integer.valueOf(childPosition), this.getFieldName(seg, position)));


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

    private String getComponentDatatypeName(Segment seg, String position) {
        Optional<Field> f = seg.getChildren().stream().filter(x -> x.getPosition() == Integer.valueOf(position)).findAny();
        if(f.isPresent()) {
            Datatype d = this.datatypeService.findById(f.get().getRef().getId());
            return d.getName();
        }
        return null;
    }
    private String getFieldName(Segment seg, String position) {
        Optional<Field> f = seg.getChildren().stream().filter(x -> x.getPosition() == Integer.valueOf(position)).findAny();
        return f.get().getName();

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

    public void changeHL7SegmentDatatype(String segmentName, String location, String newDatatype, String version) throws ForbiddenOperationException {

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
     * @throws ForbiddenOperationException
     *
     */
    public void fixDatatypeConstraintsLevel() throws ForbiddenOperationException {
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
     * @throws ForbiddenOperationException
     *
     */
    public void addStructureIds() throws ForbiddenOperationException {
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

    public void shiftAllBinding() throws ForbiddenOperationException {
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

    /***
     *
     *
     *
     *  @throws ForbiddenOperationException
     *
     *
     *
     ***/
    public void addFixedExt() throws ForbiddenOperationException {
        List<Segment> segments =  this.segmentsService.findByDomainInfoScope("USERCUSTOM");

        for(Segment s: segments) {
            if(s.getStatus() != null &&s.getStatus().equals(Status.PUBLISHED)){
                s.setFixedExtension(s.getExt());
                s.setExt(null);
                this.segmentsService.save(s);
            }
        }
    }



    //@PostConstruct
    public void updateConfIg() {
        System.out.println("UPDATE CONFIG");
        //configCreator.addTXExceptions();
        configCreator.addNMExceptions();
    }
    public void addDefaultLocation() {
        HashMap<String, Datatype> complexDts = new HashMap<String, Datatype>();

        List<Datatype> allDts = this.datatypeService.findByDomainInfoScope(Scope.HL7STANDARD.toString());
        for (Datatype dt: allDts) {
            if(dt instanceof ComplexDatatype) {
                complexDts.put(dt.getId(), dt);
            }
        }

        List<Segment> allSegments = this.segmentsService.findByDomainInfoScope(Scope.HL7STANDARD.toString());
        for( Segment segment: allSegments) {
            HashMap<String, String> fieldDtComplex = new HashMap<String, String>();

            for(Field f: segment.getChildren()) {
                if(complexDts.containsKey(f.getRef().getId())) {
                    fieldDtComplex.put(f.getId(), f.getRef().getId());
                }
            }

            if(segment.getBinding() != null && segment.getBinding().getChildren() != null) {

                for(StructureElementBinding binding:  segment.getBinding().getChildren() ) {
                    if(fieldDtComplex.containsKey(binding.getElementId())){
                        if(binding.getValuesetBindings() != null) {
                            for(ValuesetBinding vsBinding: binding.getValuesetBindings()) {
                                if(vsBinding.getValueSets() != null && !vsBinding.getValueSets().isEmpty()) {
                                    if(vsBinding.getValuesetLocations().isEmpty()) {
                                        System.out.println(segment.getId() + "-" + binding.getElementId() );
                                        vsBinding.getValuesetLocations().add(1);
                                        segmentRepo.save(segment);
                                    }

                                }

                            }
                        }
                    }

                }

            }
        }
    }

    public void updateUsage(Scope scope, String version, String name, String location, Usage oldUsage,  Usage newUsage) {

        List<Segment>  segments = segmentsService.findByDomainInfoScopeAndDomainInfoVersionAndName(scope.toString(), version, name);
        for(Segment segment: segments) {
            System.out.println(segment.getId());
            for(Field f: segment.getChildren()) {
                if(f.getId().equals(location) && f.getUsage().equals(oldUsage)) {
                    f.setUsage(newUsage);
                    f.setOldUsage(newUsage);
                    System.out.println("Found and saved");

                    this.segmentRepo.save(segment);
                }
            }

        }

    }


    public void updateSCVDatatype() {
        // remove binding from SCV.2 to SCV.1

        Datatype dt = this.datatypeService.findById("HL7SCV-V2-4");
        ComplexDatatype scv = (ComplexDatatype) dt;
        StandardKey key= new StandardKey();
        key.setName("HL70294");
        key.setVersion("2.4");

        for( Component c : scv.getComponents()) {
            if(c.getId().equals("2")) {
                if(c.getConceptDomain() != null) {
                    c.setConceptDomain(null);
                    System.out.println("Changed");

                }

            }else if(c.getId().equals("1")) {
                c.setConceptDomain(key);
                System.out.println("Changed");

            }
        }

        for(StructureElementBinding binding: dt.getBinding().getChildren()) {
            if(binding.getElementId().equals("2")) {
                binding.setElementId("1");
                binding.getLocationInfo().setName("parameter class");
                binding.getLocationInfo().setPosition(1);
                System.out.println("Changed");
            }
        }
        this.datatypeRepo.save(scv);
    }



    public void updateRCD() {
        // change RCD-2 of 2.4 from ST to ID
        Datatype dt = this.datatypeService.findById("HL7RCD-V2-4");
        ComplexDatatype rcd = (ComplexDatatype) dt;
        StandardKey key= new StandardKey();
        key.setName("HL70294");
        key.setVersion("2.4");

        for( Component c : rcd.getComponents()) {
            if(c.getId().equals("2")) {
                if(c.getRef().getId().equals("HL7ST-V2-4")) {
                    System.out.println("FOUND");
                    c.getRef().setId("HL7ID-V2-4");
                }

            }
        }

        this.datatypeRepo.save(rcd);
    }

    public void shiftBindingV2_9() throws ForbiddenOperationException {

        this.shiftBinding(new ArrayList<String>(Arrays.asList("2.9")), "CDO", "4", "2", 1);
        this.shiftBinding(new ArrayList<String>(Arrays.asList("2.9")), "PSL", "12", "2", 1);
        this.shiftBinding(new ArrayList<String>(Arrays.asList("2.9")), "ADJ", "6", "2", 1);
        this.shiftBinding(new ArrayList<String>(Arrays.asList("2.9")), "RCP", "2", "2", 1);

    }


    public void removeBindingsV2_9() {

        Segment orc = this.segmentsService.findById("HL7ORC-V2-9");

        orc.getBinding().getChildren().removeIf(sub -> sub.getElementId().equals("17"));
        orc.getBinding().getChildren().removeIf(sub -> sub.getElementId().equals("18"));

        this.segmentRepo.save(orc);


        Segment mfe = this.segmentsService.findById("HL7MFE-V2-9");
        mfe.getBinding().getChildren().removeIf(sub -> sub.getElementId().equals("4"));
        this.segmentRepo.save(mfe);


        Segment mfa = this.segmentsService.findById("HL7MFA-V2-9");
        mfa.getBinding().getChildren().removeIf(sub -> sub.getElementId().equals("5"));
        this.segmentRepo.save(mfa);

        Datatype ppn = this.datatypeService.findById("HL7PPN-V2-9");

        ppn.getBinding().getChildren().removeIf(sub -> sub.getElementId().equals("8"));

        this.datatypeRepo.save(ppn);


    }


    public void setWithdrawnV2_9() {

        Datatype d = this.datatypeService.findById("HL7--V2-8-2");
        Datatype existing = this.datatypeService.findById("HL7--V2-9");
        if(existing instanceof ComplexDatatype) {
            Datatype newWithDrawn = d;
            newWithDrawn.setId(existing.getId());
            newWithDrawn.setDomainInfo(existing.getDomainInfo());

            this.datatypeRepo.deleteById("HL7--V2-9");
            newWithDrawn.setVersion(1L);
            datatypeRepo.insert(newWithDrawn);
        }

    }


    public void findSecondLevelBinding() throws ForbiddenOperationException {
        System.out.println("SegmentID, DATATYPEID,FiledID");
        List<Segment>  segments = segmentsService.findByDomainInfoScope(Scope.HL7STANDARD.toString());
        for (Segment segment : segments) {
            if (segment.getBinding() != null) {
                for (StructureElementBinding binding : segment.getBinding().getChildren()) {
                    if (binding.getChildren() !=null && binding.getChildren().size()>0) {
                        String dtName = this.getComponentDatatypeName(segment, binding.getElementId());
                        HashSet<Integer> firstLocation = new HashSet<Integer>();
                        firstLocation.add(1);
                        if(dtName.equals("XCN")){
                            for (StructureElementBinding child : binding.getChildren()) {
                                if(child.getValuesetBindings() != null ) {
                                    for (ValuesetBinding vb : child.getValuesetBindings()) {
                                            vb.setValuesetLocations(firstLocation);
                                    }
                                    binding.setValuesetBindings(child.getValuesetBindings());
                                }
                                this.applyValueSetBinding(binding, segment, child.getValuesetBindings());
                                binding.getChildren().removeIf(x-> x.getElementId() == child.getElementId());
                                this.segmentRepo.save(segment);
                            }
                        }
                    }
                }
            }
        }
    }

    public void applyValueSetBinding(StructureElementBinding binding, Segment segment, Set<ValuesetBinding> valuesetBindings ){

        String s = this.getComponentDatatypeName(segment,binding.getElementId());
        for (ValuesetBinding vb : valuesetBindings) {
            if(s.equals("XCN")){
                HashSet<Integer> locations=  new HashSet<Integer>();
                locations.add(1);
                vb.setValuesetLocations(locations);
                binding.setValuesetBindings(valuesetBindings);
            }
        }

    }

    public void printBindingLine(Segment segment, StructureElementBinding child, String elementId) {

        String childId = child.getElementId();
        String LocationInfo = child.getLocationInfo().getName();
        Optional<Field> f = segment.getChildren().stream().filter(x -> x.getPosition() == (Integer.valueOf(elementId))).findAny();
        String DTNAME = "";
        if(f.isPresent()) {
            DTNAME =  f.get().getRef().getId();
        }
        System.out.println(segment.getId()+ "," + DTNAME + "," + elementId + ","+ childId );
    }

    public void findWrongLength() {
        System.out.println("Segment,HL7 Version, filed Position, Data Type");
        List<Segment> segments = segmentsService.findByDomainInfoScope(Scope.HL7STANDARD.toString());
        for (Segment s : segments) {
            for (Field f : s.getChildren()) {
                if(f.getMax() != null && !f.getMax().equals("0") && !f.getUsage().equals(Usage.X)){
                    if(f.getMaxLength() != null && f.getMaxLength().equals("0")){
                        System.out.println(s.getName() + "," + s.getDomainInfo().getVersion() + "," + f.getPosition()+"," + f.getRef().getId());
                    }
                }
            }
        }
    }

    public void findWrongLengthDatatype() {
        System.out.println("Datatype, HL7 Version, Component Position, Data Type");
        List<Datatype> datatypes = datatypeService.findByDomainInfoScope(Scope.HL7STANDARD.toString()).stream().filter(x -> x instanceof  ComplexDatatype).collect(Collectors.toList());
        for (Datatype d : datatypes) {
            ComplexDatatype complexDatatype = (ComplexDatatype) d;
            for (Component cp : complexDatatype.getComponents()) {
                if(!cp.getUsage().equals(Usage.X)){
                    if(cp.getMaxLength() != null && cp.getMaxLength().equals("0")){
                        System.out.println(complexDatatype.getName() + "," + complexDatatype.getDomainInfo().getVersion() + "," + cp.getPosition()  +"," + cp.getRef().getId());
                    }
                }
            }
        }
    }
}
