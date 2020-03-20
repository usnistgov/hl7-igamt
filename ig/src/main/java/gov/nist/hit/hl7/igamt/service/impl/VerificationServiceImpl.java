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
package gov.nist.hit.hl7.igamt.service.impl;

import java.io.IOException;
import java.io.StringReader;
import java.net.URL;
import java.util.HashMap;
import java.util.Set;

import javax.xml.XMLConstants;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.Source;
import javax.xml.transform.stream.StreamSource;
import javax.xml.validation.Schema;
import javax.xml.validation.SchemaFactory;
import javax.xml.validation.Validator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import gov.nist.hit.hl7.igamt.common.base.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.ProfileType;
import gov.nist.hit.hl7.igamt.common.base.domain.Ref;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.Usage;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.ExternalSingleCode;
import gov.nist.hit.hl7.igamt.common.binding.domain.InternalSingleCode;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.Group;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRef;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRefOrGroup;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.registry.ConformanceProfileRegistry;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.constraints.repository.PredicateRepository;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Component;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.DateTimeDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.PrimitiveDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.registry.DatatypeRegistry;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.display.model.CustomProfileError;
import gov.nist.hit.hl7.igamt.display.model.XMLVerificationReport;
import gov.nist.hit.hl7.igamt.display.model.XMLVerificationReport.DocumentTarget;
import gov.nist.hit.hl7.igamt.display.model.XMLVerificationReport.ErrorType;
import gov.nist.hit.hl7.igamt.display.model.XSDVerificationResult;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.domain.verification.CPVerificationResult;
import gov.nist.hit.hl7.igamt.ig.domain.verification.DTSegVerificationResult;
import gov.nist.hit.hl7.igamt.ig.domain.verification.IgVerificationResult;
import gov.nist.hit.hl7.igamt.ig.domain.verification.IgamtObjectError;
import gov.nist.hit.hl7.igamt.ig.domain.verification.VSVerificationResult;
import gov.nist.hit.hl7.igamt.ig.domain.verification.VerificationReport;
import gov.nist.hit.hl7.igamt.ig.domain.verification.VerificationResult;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.ig.service.VerificationService;
import gov.nist.hit.hl7.igamt.segment.domain.DynamicMappingInfo;
import gov.nist.hit.hl7.igamt.segment.domain.DynamicMappingItem;
import gov.nist.hit.hl7.igamt.segment.domain.Field;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.domain.registry.SegmentRegistry;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.valueset.domain.Code;
import gov.nist.hit.hl7.igamt.valueset.domain.CodeUsage;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.domain.property.ContentDefinition;
import gov.nist.hit.hl7.igamt.valueset.domain.property.Extensibility;
import gov.nist.hit.hl7.igamt.valueset.domain.property.Stability;
import gov.nist.hit.hl7.igamt.valueset.domain.registry.ValueSetRegistry;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;

@Service("verificationService")
public class VerificationServiceImpl implements VerificationService {
  @Autowired
  private IgService igService;
  
  @Autowired
  private ConformanceProfileService conformanceProfileService;
  
  @Autowired
  private DatatypeService datatypeService;
  
  @Autowired
  private SegmentService segmentService;
  
  @Autowired
  private ValuesetService valuesetService;
  
  @Autowired
  private PredicateRepository predicateRepository;
  
  private static String profileXSDurl =
      "https://raw.githubusercontent.com/Jungyubw/NIST_healthcare_hl7_v2_profile_schema/master/Schema/NIST%20Validation%20Schema/Profile.xsd";
  private static String valueSetXSDurl =
      "https://raw.githubusercontent.com/Jungyubw/NIST_healthcare_hl7_v2_profile_schema/master/Schema/NIST%20Validation%20Schema/ValueSets.xsd";
  private static String constraintXSDurl =
      "https://raw.githubusercontent.com/Jungyubw/NIST_healthcare_hl7_v2_profile_schema/master/Schema/NIST%20Validation%20Schema/ConformanceContext.xsd";
  
  
  private HashMap<String,ComplianceObject> parentComplianceMap = new HashMap<String,ComplianceObject>();
  private HashMap<String,ComplianceObject> childComplianceMap = new HashMap<String,ComplianceObject>();


  private XSDVerificationResult verifyXMLByXSD(String xsdURL, String profileXMLStr) {
    try {
      URL schemaFile = new URL(xsdURL);
      Source xmlFile = new StreamSource(new StringReader(profileXMLStr));
      SchemaFactory schemaFactory = SchemaFactory.newInstance(XMLConstants.W3C_XML_SCHEMA_NS_URI);
      Schema schema = schemaFactory.newSchema(schemaFile);
      Validator validator = schema.newValidator();
      validator.validate(xmlFile);
      return new XSDVerificationResult(true, null);
    } catch (SAXException e) {
      return new XSDVerificationResult(false, e);
    } catch (IOException e) {
      return new XSDVerificationResult(false, e);
    } catch (Exception e) {
      return new XSDVerificationResult(false, e);
    }
  }

  @Override
  public XMLVerificationReport verifyXMLs(String profileXMLStr, String constraintXMLStr, String valuesetXMLStr) {
    XMLVerificationReport report = new XMLVerificationReport();
    // 1. XML Validation by XSD
    report.setProfileXSDValidationResult(this.verifyXMLByXSD(profileXSDurl, profileXMLStr));
    report.setValueSetXSDValidationResult(this.verifyXMLByXSD(valueSetXSDurl, valuesetXMLStr));
    report
        .setConstraintsXSDValidationResult(this.verifyXMLByXSD(constraintXSDurl, constraintXMLStr));

    try {
      Document profileDoc = XMLManager.stringToDom(profileXMLStr);
      Document constrintsDoc = XMLManager.stringToDom(constraintXMLStr);
      Document valuesetsDoc = XMLManager.stringToDom(valuesetXMLStr);

      Element messagesElm = (Element) profileDoc.getElementsByTagName("Messages").item(0);
      Element segmentsElm = (Element) profileDoc.getElementsByTagName("Segments").item(0);
      Element datatypesElm = (Element) profileDoc.getElementsByTagName("Datatypes").item(0);

      NodeList messages = messagesElm.getElementsByTagName("Message");
      NodeList segments = segmentsElm.getElementsByTagName("Segment");
      NodeList datatypes = datatypesElm.getElementsByTagName("Datatype");

      HashMap<String, Element> messageMap = new HashMap<String, Element>();
      HashMap<String, Element> segmentMap = new HashMap<String, Element>();
      HashMap<String, Element> datatypeMap = new HashMap<String, Element>();

      for (int i = 0; i < messages.getLength(); i++) {
        Element m = (Element) messages.item(i);
        messageMap.put(m.getAttribute("ID"), m);
      }

      for (int i = 0; i < segments.getLength(); i++) {
        Element s = (Element) segments.item(i);
        segmentMap.put(s.getAttribute("ID"), s);
      }

      for (int i = 0; i < datatypes.getLength(); i++) {
        Element d = (Element) datatypes.item(i);
        datatypeMap.put(d.getAttribute("ID"), d);
      }
      // 2. Checking 5 level Violation
      for (String id : datatypeMap.keySet()) {
        Element dtElm = datatypeMap.get(id);
        NodeList components = dtElm.getElementsByTagName("Component");
        for (int i = 0; i < components.getLength(); i++) {
          Element componentElm = (Element) components.item(i);
          String comnponentDTId = componentElm.getAttribute("Datatype");
          Element componentDTElm = (Element) datatypeMap.get(comnponentDTId);
          NodeList subComponents = componentDTElm.getElementsByTagName("Component");
          for (int j = 0; j < subComponents.getLength(); j++) {
            Element subComponentElm = (Element) subComponents.item(j);
            String subComnponentDTId = subComponentElm.getAttribute("Datatype");
            Element subComponentDTElm = (Element) datatypeMap.get(subComnponentDTId);

            if (subComponentDTElm.getElementsByTagName("Component").getLength() > 0) {
              report.addProfileError(new CustomProfileError(
                  ErrorType.FiveLevelComponent, dtElm.getAttribute("Label") + "." + (i + 1) + "." + (j + 1) + " Datatype is "
                      + subComponentDTElm.getAttribute("Label") + ", but it is not primitive.",
                  DocumentTarget.DATATYPE, subComnponentDTId));
            }
          }
        }
      }

      // 3. Checking Dynamic Mapping
      HashMap<String[], Element> dmCaseMap = new HashMap<String[], Element>();
      for (String id : segmentMap.keySet()) {
        Element segElm = segmentMap.get(id);
        NodeList dmCases = segElm.getElementsByTagName("Case");

        if (dmCases.getLength() > 0) {
          for (int i = 0; i < dmCases.getLength(); i++) {
            Element dmCaseElm = (Element) dmCases.item(i);
            String[] key = new String[] {dmCaseElm.getAttribute("Value"), dmCaseElm.getAttribute("SecondValue")};
            if (dmCaseMap.containsKey(key)) {
              report.addProfileError(new CustomProfileError(ErrorType.DuplicatedDynamicMapping,
                  "Segment " + segElm.getAttribute("Label") + " has duplicated Dynamic mapping definition for " + key + ".",
                  DocumentTarget.SEGMENT, id));
            } else {
              dmCaseMap.put(key, dmCaseElm);
            }

          }
        }
      }

      // 4. Checking Missing ValueSet
      HashMap<String, Element> valueSetMap = new HashMap<String, Element>();
      NodeList valueSetDefinitions = valuesetsDoc.getElementsByTagName("ValueSetDefinition");
      for (int i = 0; i < valueSetDefinitions.getLength(); i++) {
        Element v = (Element) valueSetDefinitions.item(i);
        valueSetMap.put(v.getAttribute("BindingIdentifier"), v);
      }

      for (String id : segmentMap.keySet()) {
        Element segElm = segmentMap.get(id);
        NodeList fields = segElm.getElementsByTagName("Field");

        for (int i = 0; i < fields.getLength(); i++) {
          Element feildElm = (Element) fields.item(i);
          String bindingIds = feildElm.getAttribute("Binding");
          if (bindingIds != null && !bindingIds.equals("")) {
            for(String bindingId:bindingIds.split("\\:")) {
              if (bindingId != null && !bindingId.equals("") && !valueSetMap.containsKey(bindingId)) {
                report.addProfileError(new CustomProfileError(ErrorType.MissingValueSet,
                    "ValueSet " + bindingId + " is missing for Segment " + segElm.getAttribute("Label") + "." + (i + 1),
                    DocumentTarget.VALUESET, bindingId));
              }    
            }  
          }
        }
      }

      for (String id : datatypeMap.keySet()) {
        Element dtElm = datatypeMap.get(id);
        NodeList components = dtElm.getElementsByTagName("Component");

        for (int i = 0; i < components.getLength(); i++) {
          Element componentElm = (Element) components.item(i);
          String bindingIds = componentElm.getAttribute("Binding");
          if (bindingIds != null && !bindingIds.equals("")) {
            for(String bindingId:bindingIds.split("\\:")) {
              if (bindingId != null && !bindingId.equals("") && !valueSetMap.containsKey(bindingId)) {
                report.addProfileError(new CustomProfileError(ErrorType.MissingValueSet,
                    "ValueSet " + bindingId + " is missing for Datatype " + dtElm.getAttribute("Label") + "." + (i + 1),
                    DocumentTarget.VALUESET, bindingId));
              }    
            }
          }
        }
      }

      NodeList valueSetAssertions = constrintsDoc.getElementsByTagName("ValueSet");
      for (int i = 0; i < valueSetAssertions.getLength(); i++) {
        Element valueSetAssertionElm = (Element) valueSetAssertions.item(i);
        String bindingId = valueSetAssertionElm.getAttribute("ValueSetID");
        if (bindingId != null && !bindingId.equals("") && !valueSetMap.containsKey(bindingId)) {
          report.addProfileError(new CustomProfileError(ErrorType.MissingValueSet,
              "ValueSet " + bindingId + " is missing for Constraints.", DocumentTarget.VALUESET,
              bindingId));
        }
      }

    } catch (SAXException e) {
      report
          .addProfileError(new CustomProfileError(ErrorType.Unknown, e.getMessage(), null, null));;
    } catch (ParserConfigurationException e) {
      report
          .addProfileError(new CustomProfileError(ErrorType.Unknown, e.getMessage(), null, null));;
    } catch (IOException e) {
      report
          .addProfileError(new CustomProfileError(ErrorType.Unknown, e.getMessage(), null, null));;
    }


    // 5. Pasing by core

//    if (report.isSuccess()) {
//      InputStream profileXMLIO = IOUtils.toInputStream(profileXMLStr, StandardCharsets.UTF_8);
//      try {
//        XMLDeserializer.deserialize(profileXMLIO).get();
//      } catch (NoSuchElementException nsee) {
//        report.addProfileError(new CustomProfileError(ErrorType.CoreParsingError, nsee.getMessage(), null, null));;
//
//      } catch (Exception e) {
//        report.addProfileError(new CustomProfileError(ErrorType.Unknown, e.getMessage(), null, null));;
//      }
//    }


    return report;
  }

  @Override
  public VSVerificationResult verifyValueset(Valueset valueset) {
    VSVerificationResult result = new VSVerificationResult(valueset);
    
    // 1. Metadata checking
    this.checkingMetadataForValueset(valueset, result);
    
    // 2. Structure Checking
    this.checkingStructureForValueset(valueset, result);
    
    return result;
  }

  @Override
  public DTSegVerificationResult verifyDatatype(Datatype datatype) {
    DTSegVerificationResult result = new DTSegVerificationResult(datatype);
    
    // 1. Metadata checking
    this.checkingMetadataForDatatype(datatype, result);
    
    // 2. Structure Checking
    this.checkingStructureForDatatype(datatype, result);
    
    return result;
  }
  
  /**
   * @param valueset
   * @param vr
   */
  private void checkingStructureForValueset(Valueset valueset, VSVerificationResult result) {
    if(valueset.getCodes() != null) this.checkingCodes(valueset, valueset.getCodes(), result);
  }

  /**
   * @param datatype
   * @param vr
   */
  private void checkingStructureForDatatype(Datatype datatype, DTSegVerificationResult result) {
    // Case #1 : Primitive
    if (datatype instanceof PrimitiveDatatype) {
      //NO Checking
    }
    
    if (datatype instanceof ComplexDatatype) {
      ComplexDatatype cDt = (ComplexDatatype)datatype;
      
      this.checkingComponents(cDt, cDt.getComponents(), result);
    }
  }
  
  /**
   * @param conformanceProfile
   * @param vr
   */
  private void checkingStructureForConformanceProfile(ConformanceProfile conformanceProfile, CPVerificationResult result) {
    Set<StructureElementBinding> sebs = null;
    if(conformanceProfile.getBinding() != null) sebs = conformanceProfile.getBinding().getChildren();
    this.checkingSegmentRefOrGroups(conformanceProfile, conformanceProfile.getChildren(), result, null, null, sebs);
  }
  
  private void checkingStructureForConformanceProfileForCompliance(ConformanceProfile conformanceProfile, CPVerificationResult result) {
    Set<StructureElementBinding> sebs = null;
    if(conformanceProfile.getBinding() != null) sebs = conformanceProfile.getBinding().getChildren();
    this.checkingSegmentRefOrGroupsForCompliance(conformanceProfile, conformanceProfile.getChildren(), result, null, null, sebs);
  }
  
  private void checkingSegmentRefOrGroupsForCompliance(ConformanceProfile conformanceProfile, Set<SegmentRefOrGroup> segmentRefOrGroups, CPVerificationResult result, String positionPath, String path, Set<StructureElementBinding> sebs) {
    if (segmentRefOrGroups != null) {
      segmentRefOrGroups.forEach(srog -> this.checkingSegmentRefOrGroupForCompliance(conformanceProfile, srog, result, positionPath, path, this.findSEB(sebs, srog.getId())));
    }
  }
  
  private void checkingSegmentRefOrGroups(ConformanceProfile conformanceProfile, Set<SegmentRefOrGroup> segmentRefOrGroups, CPVerificationResult result, String positionPath, String path, Set<StructureElementBinding> sebs) {
    if (segmentRefOrGroups != null) {
      segmentRefOrGroups.forEach(srog -> this.checkingSegmentRefOrGroup(conformanceProfile, srog, result, positionPath, path, this.findSEB(sebs, srog.getId())));
    }
  }

  /**
   * @param sebs
   * @param id
   * @return
   */
  private Set<StructureElementBinding> findSEB(Set<StructureElementBinding> sebs, String id) {
    if(sebs != null) {
      for(StructureElementBinding seb : sebs) {
        if(seb.getElementId().equals(id)) return seb.getChildren();
      }
    }
    return null;
  }

  private void checkingSegmentRefOrGroupForCompliance(ConformanceProfile conformanceProfile, SegmentRefOrGroup srog, CPVerificationResult result, String positionPath, String path, Set<StructureElementBinding> sebs) {
    if(srog instanceof SegmentRef) {
      this.chekcingSegmentRefForCompliance(conformanceProfile, (SegmentRef)srog, result, positionPath, path, sebs);
    } else if(srog instanceof Group) {
      this.checkingGroupForCompliance(conformanceProfile, (Group)srog, result, positionPath, path, sebs);
    } 
  }
  
  private void checkingSegmentRefOrGroup(ConformanceProfile conformanceProfile, SegmentRefOrGroup srog, CPVerificationResult result, String positionPath, String path, Set<StructureElementBinding> sebs) {
    if(srog instanceof SegmentRef) {
      this.chekcingSegmentRef(conformanceProfile, (SegmentRef)srog, result, positionPath, path, sebs);
    } else if(srog instanceof Group) {
      this.checkingGroup(conformanceProfile, (Group)srog, result, positionPath, path, sebs);
    } 
  }

  private void chekcingSegmentRefForCompliance(ConformanceProfile conformanceProfile, SegmentRef sr, CPVerificationResult result, String positionPath, String path, Set<StructureElementBinding> sebs) {
    int position = sr.getPosition();
    Usage usage = sr.getUsage();
    int min = sr.getMin();
    String max = sr.getMax();
    Ref ref = sr.getRef();
    Segment segment = null;
    
    if (positionPath == null) {
      positionPath = position + "";
    } else {
      positionPath = positionPath + "." + position;
    }
    
    // Ref value Check
    if(ref != null && ref.getId() != null) {
      segment = this.segmentService.findById(ref.getId());
      // DATA Acessability check
      if(segment != null) {
        if (path == null) {
          path = segment.getName();
        } else {
          path = path + "." + segment.getName();
        }
        
        this.childComplianceMap.put(positionPath, new ComplianceObject(positionPath, path, usage, min, max));
        this.checkUsageVerificationErrorForCompliance(conformanceProfile, usage, positionPath, path, result);
        this.checkCardinalityVerificationErrorForCompliance(conformanceProfile, usage, min, max, positionPath, path, result);
        
        if(segment.getChildren() != null) {
          
          for(Field field : segment.getChildren() ){
            this.checkFieldForConformanceProfileForCompliance(conformanceProfile, field, positionPath, path, result); 
          }
        }
      } 
    }
  }
  
  private void chekcingSegmentRef(ConformanceProfile conformanceProfile, SegmentRef sr, CPVerificationResult result, String positionPath, String path, Set<StructureElementBinding> sebs) {
    int position = sr.getPosition();
    Usage usage = sr.getUsage();
    int min = sr.getMin();
    String max = sr.getMax();
    Ref ref = sr.getRef();
    Segment segment = null;
    
    if (positionPath == null) {
      positionPath = position + "";
    } else {
      positionPath = positionPath + "." + position;
    }
    
    
    // Ref value Check
    if(ref == null || ref.getId() == null) result.getErrors().add(new IgamtObjectError("STRUCTURE", "segmentRef.ref", positionPath + " SegmentRef info is mising", positionPath + "", "FATAL"));
    else {
      segment = this.segmentService.findById(ref.getId());
      // DATA Acessability check
      if(segment == null) result.getErrors().add(new IgamtObjectError("STRUCTURE", "segmentRef.ref", "Segment is missing on DB", positionPath + "", "ERROR"));
      else {
        if (path == null) {
          path = segment.getName();
        } else {
          path = path + "." + segment.getName();
        }
        
        this.childComplianceMap.put(positionPath, new ComplianceObject(positionPath, path, usage, min, max));
        this.checkUsageVerificationError(conformanceProfile, usage, positionPath, path, result);
        this.checkCardinalityVerificationError(usage, min, max, positionPath, path, result);
      } 
    }
  }


  /**
   * @param conformanceProfile
   * @param field
   * @param positionPath
   * @param path
   * @param result
   */
  private void checkFieldForConformanceProfileForCompliance(ConformanceProfile conformanceProfile, Field field, String positionPath, String path, CPVerificationResult result) {
    int position = field.getPosition();
    Usage usage = field.getUsage();
    int min = field.getMin();
    String max = field.getMax();
    Ref ref = field.getRef();
    
    String minLength = field.getMinLength();
    String maxLength = field.getMaxLength();
    String confLength = field.getConfLength();
    
    positionPath = positionPath + "." + position;
    path = path + "." + position;
    
    this.childComplianceMap.put(positionPath, new ComplianceObject(positionPath, path, usage, min, max));
    this.checkUsageVerificationErrorForCompliance(conformanceProfile, usage, positionPath, path, result);
    this.checkCardinalityVerificationErrorForCompliance(conformanceProfile, usage, min, max, positionPath, path, result);
    this.checkLengthVerificationErorrForCompliance(conformanceProfile, field, minLength, maxLength, confLength, positionPath, path, result);
    
    if (ref != null && ref.getId() != null) {
      Datatype datatype = this.datatypeService.findById(ref.getId());
      
      if (datatype != null) {
        if(datatype instanceof ComplexDatatype) {
          ComplexDatatype cDT = (ComplexDatatype)datatype;
          if(cDT.getComponents() != null && cDT.getComponents().size() > 0) {
            for(Component component : cDT.getComponents() ){
              this.checkComponentForConformanceProfileForCompliance(conformanceProfile, component, positionPath, path, result); 
            }
          }
        }
      }
    }
  }
  
  private void checkLengthVerificationErorrForCompliance(ConformanceProfile conformanceProfile, Field field, String minLength, String maxLength, String confLength, String positionPath, String path, CPVerificationResult result) {
    //TODO
  }
  
  private void checkLengthVerificationErorr(Field field, String minLength, String maxLength, String confLength, String positionPath, String path, VerificationResult result) {
    if(this.isLengthAllowedComponent(field)) {
      
      if(!this.isNullOrNA(confLength) && (!this.isNullOrNA(minLength) || !this.isNullOrNA(maxLength))) {
        result.getErrors().add(new IgamtObjectError("STRUCTURE", "Length_Duplicated", "Both Length or ConfLength are defiend for " + path + ".", positionPath + "", "Warning"));
      }
      if (this.isNullOrNA(confLength) && (this.isNullOrNA(minLength) || this.isNullOrNA(maxLength))) {
        result.getErrors().add(new IgamtObjectError("STRUCTURE", "Length_Missing", "Length or ConfLength should be defiend for " + path + " that has primitive datatype.", positionPath + "", "Warning"));
      } else {
        if (!this.isNullOrNA(minLength)) {
          if(!this.isInt(minLength)) {
            result.getErrors().add(new IgamtObjectError("STRUCTURE", "MinLength_FORMAT", "Min Length should be number for " + path,  positionPath, "Warning"));
          }
        }
        
        if (!this.isNullOrNA(maxLength)) {
          if(!this.isIntOrStar(maxLength)) {
            result.getErrors().add(new IgamtObjectError("STRUCTURE", "MaxLength_FORMAT", "Max Length should be number or star(*) for " + path,  positionPath, "Warning"));
          }
        }
        
        if (!this.isNullOrNA(confLength)) {
          if(!confLength.contains("#") && !confLength.contains("=")) {
            result.getErrors().add(new IgamtObjectError("STRUCTURE", "ConfLength_FORMAT", "Either # or = should be used for truncation in " + path,  positionPath, "Warning"));
          }
        }
        
        if (!this.isNullOrNA(minLength) && !this.isNullOrNA(maxLength)) {
          if(!maxLength.equals("*")) {
            if(this.isInt(minLength) && this.isInt(maxLength)) {
              int minLengthInt = Integer.parseInt(minLength);
              int maxLengthInt = Integer.parseInt(maxLength);
              
              if(minLengthInt > maxLengthInt) {
                result.getErrors().add(new IgamtObjectError("STRUCTURE", "Length_Range", "In " + path + ", " + " MIN Length value is bigger than MAX Length",  positionPath, "Warning"));
              }
            }
          }
        }
      }  
    } else {
      if(!this.isNullOrNA(confLength) || (!this.isNullOrNA(minLength) || !this.isNullOrNA(maxLength))) {
        result.getErrors().add(new IgamtObjectError("STRUCTURE", "Length_NotAllowable", "Length and ConfLength are not allowable for " + path + ".", positionPath + "", "Warning"));
      }
    }
  }
  
  private void checkLengthVerificationErorrForCompliance(ConformanceProfile conformanceProfile, Component component, String minLength, String maxLength, String confLength, String positionPath, String path, CPVerificationResult result) {
  
  }
  
  private void checkLengthVerificationErorr(Component component, String minLength, String maxLength, String confLength, String positionPath, String path, VerificationResult result) {
    if(this.isLengthAllowedComponent(component)) {
      if(!this.isNullOrNA(confLength) && (!this.isNullOrNA(minLength) || !this.isNullOrNA(maxLength))) {
        result.getErrors().add(new IgamtObjectError("STRUCTURE", "Length_Duplicated", "Both Length or ConfLength are defiend for " + path + ".", positionPath + "", "Warning"));
      }
      if (this.isNullOrNA(confLength) && (this.isNullOrNA(minLength) || this.isNullOrNA(maxLength))) {
        result.getErrors().add(new IgamtObjectError("STRUCTURE", "Length_Missing", "Length or ConfLength should be defiend for " + path + " that has primitive datatype.", positionPath + "", "Warning"));
      } else {
        if (!this.isNullOrNA(minLength)) {
          if(!this.isInt(minLength)) {
            result.getErrors().add(new IgamtObjectError("STRUCTURE", "MinLength_FORMAT", "Min Length should be number for " + path,  positionPath, "Warning"));
          }
        }
        
        if (!this.isNullOrNA(maxLength)) {
          if(!this.isIntOrStar(maxLength)) {
            result.getErrors().add(new IgamtObjectError("STRUCTURE", "MaxLength_FORMAT", "Max Length should be number or star(*) for " + path,  positionPath, "Warning"));
          }
        }
        
        if (!this.isNullOrNA(confLength)) {
          if(!confLength.contains("#") && !confLength.contains("=")) {
            result.getErrors().add(new IgamtObjectError("STRUCTURE", "ConfLength_FORMAT", "Either # or = should be used for truncation in " + path,  positionPath, "Warning"));
          }
        }
        
        if (!this.isNullOrNA(minLength) && !this.isNullOrNA(maxLength)) {
          if(!maxLength.equals("*")) {
            if(this.isInt(minLength) && this.isInt(maxLength)) {
              int minLengthInt = Integer.parseInt(minLength);
              int maxLengthInt = Integer.parseInt(maxLength);
              
              if(minLengthInt > maxLengthInt) {
                result.getErrors().add(new IgamtObjectError("STRUCTURE", "Length_Values", "In " + path + ", " + " MIN Length value is bigger than MAX Length",  positionPath, "Warning"));
              }
            }
          }
        }
      }  
    } else {
      if(!this.isNullOrNA(confLength) || (!this.isNullOrNA(minLength) || !this.isNullOrNA(maxLength))) {
        result.getErrors().add(new IgamtObjectError("STRUCTURE", "Length_NotAllowable", "Length and ConfLength are not allowable for " + path + ".", positionPath + "", "Warning"));
      }
    }
  }

  /**
   * @param conformanceProfile
   * @param component
   * @param positionPath
   * @param path
   * @param result
   */
  private void checkComponentForConformanceProfileForCompliance(ConformanceProfile conformanceProfile, Component component, String positionPath, String path, CPVerificationResult result) {
    int position = component.getPosition();
    Usage usage = component.getUsage();
    Ref ref = component.getRef();
    String minLength = component.getMinLength();
    String maxLength = component.getMaxLength();
    String confLength = component.getConfLength();
    
    positionPath = positionPath + "." + position;
    path = path + "." + position;
    
    this.childComplianceMap.put(positionPath, new ComplianceObject(positionPath, path, usage, null, null));
    this.checkUsageVerificationErrorForCompliance(conformanceProfile, usage, positionPath, path, result);
    this.checkLengthVerificationErorrForCompliance(conformanceProfile, component, minLength, maxLength, confLength, positionPath, path, result);
    
    
    if (ref != null && ref.getId() != null) {
      Datatype datatype = this.datatypeService.findById(ref.getId());
      
      if (datatype != null) {
        if(datatype instanceof ComplexDatatype) {
          ComplexDatatype cDT = (ComplexDatatype)datatype;
          if(cDT.getComponents() != null && cDT.getComponents().size() > 0) {
            for(Component childComponent : cDT.getComponents() ){
              this.checkComponentForConformanceProfileForCompliance(conformanceProfile, childComponent, positionPath, path, result); 
            }
          }
        }
      }
    }
  }

  private void checkCardinalityVerificationErrorForCompliance(ConformanceProfile conformanceProfile, Usage usage, int min, String max, String positionPath, String path, CPVerificationResult result) {
    if(max != null) {
      if(this.isIntOrStar(max)) {
        if(this.isInt(max)) {          
          ComplianceObject complianceParentObject = this.parentComplianceMap.get(positionPath);
          if(complianceParentObject != null && complianceParentObject.getMax() != null && complianceParentObject.getMin() != null) {
            Integer parentMin = complianceParentObject.getMin();
            String parentMax = complianceParentObject.getMax();
            
            if(parentMin != null) {
              if(parentMin > min) {
                result.getErrors().add(new IgamtObjectError("Compliance", "MIN_Cardinality_Compliance", "In " + conformanceProfile.getLabel() + ", " + path + " assigned Min cardinality of " + min + " is not compliant with Min cardinality of " + parentMin, positionPath + "", "Warning"));
              }
            }
            
            if(parentMax != null && max != null && this.isIntOrStar(max) && this.isIntOrStar(parentMax)) {
              if(!max.equals("*")) {
                int childMaxInt = Integer.parseInt(max);
                int parentMaxInt = Integer.parseInt(parentMax);
                
                if(parentMaxInt < childMaxInt) {
                  result.getErrors().add(new IgamtObjectError("Compliance", "MAX_Cardinality_Compliance", "In " + conformanceProfile.getLabel() + ", " + path + " assigned Max cardinality of " + childMaxInt + " is not compliant with Max cardinality of " + parentMaxInt, positionPath + "", "Warning"));
                }
              }
            }
          }
        }
      } 
    }
  }
  
  private void checkCardinalityVerificationError(Usage usage, int min, String max, String positionPath, String path, VerificationResult result) {
    if(max == null) {
      result.getErrors().add(new IgamtObjectError("Verification", "Cardinality_NULL", "At " + path + " Usage is missing", positionPath + "", "ERROR"));
    } else {
      
      if(this.isIntOrStar(max)) {
        if(this.isInt(max)) {
          int maxInt = Integer.parseInt(max);
          if (min > maxInt) {
            result.getErrors().add(new IgamtObjectError("Verification", "Cardinality_Range", "At " + path + " MIN Cardinality value is bigger than MAX Cardinality ", positionPath + "", "ERROR"));
          } else {
            if(usage != null && usage.equals(Usage.X) && !max.equals("0")) {
              result.getErrors().add(new IgamtObjectError("Verification", "MAX_Cardinality_UsageX", "At " + path + " MAX cardinality value should be 0, if the USAGE is X.", positionPath + "", "Warning"));
            }
            
            if(usage != null && usage.equals(Usage.R) && min < 1) {
              result.getErrors().add(new IgamtObjectError("Verification", "MIN_Cardinality_UsageR", "At " + path + " MIN cardinality value should be bigger than 0, if the USAGE is R.", positionPath + "", "Warning"));
            }
            
            if(usage != null && usage.equals(Usage.RE) && min != 0) {
              result.getErrors().add(new IgamtObjectError("Verification", "MIN_Cardinality_UsageRE", "At " + path + " MIN cardinality value should be 0, if the USAGE is RE.", positionPath + "", "Warning"));
            }
            
            if(usage != null && usage.equals(Usage.O) && min != 0) {
              result.getErrors().add(new IgamtObjectError("Verification", "MIN_Cardinality_UsageO", "At " + path + " MIN cardinality value should be 0, if the USAGE is O.", positionPath + "", "Warning"));
            }
            
            if(usage != null && usage.equals(Usage.C) && min != 0) {
              result.getErrors().add(new IgamtObjectError("Verification", "MIN_Cardinality_UsageC", "At " + path + " MIN cardinality value should be 0, if the USAGE is C.", positionPath + "", "Warning"));
            }
            
            if(usage != null && usage.equals(Usage.CAB) && min != 0) {
              result.getErrors().add(new IgamtObjectError("Verification", "MIN_Cardinality_UsageCAB", "At " + path + " MIN cardinality value should be 0, if the USAGE is CAB.", positionPath + "", "Warning"));
            }
            
            if(usage != null && usage.equals(Usage.B) && min != 0) {
              result.getErrors().add(new IgamtObjectError("Verification", "MIN_Cardinality_UsageB", "At " + path + " MIN cardinality value should be 0, if the USAGE is B.", positionPath + "", "Warning"));
            }
            
            if(usage != null && usage.equals(Usage.W) && min != 0) {
              result.getErrors().add(new IgamtObjectError("Verification", "MIN_Cardinality_UsageW", "At " + path + " MIN cardinality value should be 0, if the USAGE is W.", positionPath + "", "Warning"));
            }
          }
        }
      } else {
        result.getErrors().add(new IgamtObjectError("Verification", "MAX_Cardinality_Format", "At " + path + " MAX cardinality value should be number or '*'", positionPath + "", "ERROR"));
      }
    }
  }

  private void checkUsageVerificationErrorForCompliance(ConformanceProfile conformanceProfile, Usage usage, String positionPath, String path, CPVerificationResult result) {
    if (usage != null) {
      if (conformanceProfile != null && conformanceProfile.getProfileType() != null) {
        ComplianceObject complianceParentObject = this.parentComplianceMap.get(positionPath);
        if(complianceParentObject != null && complianceParentObject.getUsage() != null) {
          Usage parentUsage = complianceParentObject.getUsage();
          
          if (parentUsage.equals(Usage.R)) {
            if (!usage.equals(Usage.R)) {
              result.getErrors().add(new IgamtObjectError("Compliance", "Usage_Compliance", "In " + conformanceProfile.getLabel() + ", " + path + " assigned usage of " + usage + " is not compliant with parent usage of " + parentUsage, positionPath + "", "Warning"));
            }
          } else if (parentUsage.equals(Usage.X)) {
            if (!usage.equals(Usage.X)) {
              result.getErrors().add(new IgamtObjectError("Compliance", "Usage_Compliance", "In " + conformanceProfile.getLabel() + ", " + path + " assigned usage of " + usage + " is not compliant with parent usage of " + parentUsage, positionPath + "", "Warning"));
            }
          } else if (parentUsage.equals(Usage.RE)) {
            if (!usage.equals(Usage.R) && !usage.equals(Usage.RE)) {
              result.getErrors().add(new IgamtObjectError("Compliance", "Usage_Compliance", "In " + conformanceProfile.getLabel() + ", " + path + " assigned usage of " + usage + " is not compliant with parent usage of " + parentUsage, positionPath + "", "Warning"));
            }
          } else if (parentUsage.equals(Usage.W)) {
            if (!usage.equals(Usage.W) && !usage.equals(Usage.X)) {
              result.getErrors().add(new IgamtObjectError("Compliance", "Usage_Compliance", "In " + conformanceProfile.getLabel() + ", " + path + " assigned usage of " + usage + " is not compliant with parent usage of " + parentUsage, positionPath + "", "Warning"));
            }
          } else if (parentUsage.equals(Usage.C)) {
            if (!usage.equals(Usage.R) && !usage.equals(Usage.RE) && !usage.equals(Usage.C) && !usage.equals(Usage.CAB) && !usage.equals(Usage.X)) {
              result.getErrors().add(new IgamtObjectError("Compliance", "Usage_Compliance", "In " + conformanceProfile.getLabel() + ", " + path + " assigned usage of " + usage + " is not compliant with parent usage of " + parentUsage, positionPath + "", "Warning"));
            }
          } else if (parentUsage.equals(Usage.CAB)) {
            if (!usage.equals(Usage.R) && !usage.equals(Usage.RE) && !usage.equals(Usage.CAB) && !usage.equals(Usage.X)) {
              result.getErrors().add(new IgamtObjectError("Compliance", "Usage_Compliance", "In " + conformanceProfile.getLabel() + ", " + path + " assigned usage of " + usage + " is not compliant with parent usage of " + parentUsage, positionPath + "", "Warning"));
            }
          } else if (parentUsage.equals(Usage.O)) {
            if (!usage.equals(Usage.R) && !usage.equals(Usage.RE) && !usage.equals(Usage.C) && !usage.equals(Usage.CAB) && !usage.equals(Usage.O) && !usage.equals(Usage.X)) {
              result.getErrors().add(new IgamtObjectError("Compliance", "Usage_Compliance", "In " + conformanceProfile.getLabel() + ", " + path + " assigned usage of " + usage + " is not compliant with parent usage of " + parentUsage, positionPath + "", "Warning"));
            }
          } else if (parentUsage.equals(Usage.B)) {
            if (!usage.equals(Usage.R) && !usage.equals(Usage.RE) && !usage.equals(Usage.CAB) && !usage.equals(Usage.O) && !usage.equals(Usage.X) && !usage.equals(Usage.B)) {
              result.getErrors().add(new IgamtObjectError("Compliance", "Usage_Compliance", "In " + conformanceProfile.getLabel() + ", " + path + " assigned usage of " + usage + " is not compliant with parent usage of " + parentUsage, positionPath + "", "Warning"));
            }
          }
        }
      }
    }
  }
  
  private void checkUsageVerificationError(ConformanceProfile conformanceProfile, Usage usage, String positionPath, String path, VerificationResult result) {
    if (usage == null) {
      result.getErrors().add(new IgamtObjectError("Verification", "Usage_MISSING", "At " + path + " Usage is missing", positionPath + "", "ERROR"));
    } else {
      if (conformanceProfile != null && conformanceProfile.getProfileType() != null) {
        if (conformanceProfile.getProfileType().equals(ProfileType.HL7)) {
          if(!(usage.equals(Usage.R) || usage.equals(Usage.RE) || usage.equals(Usage.C) || usage.equals(Usage.CAB) || usage.equals(Usage.O) || usage.equals(Usage.X) || usage.equals(Usage.B) || usage.equals(Usage.W))) {
            result.getErrors().add(new IgamtObjectError("Verification", "Usage_Value_Base", "At " + path + " Usage should be one of R/RE/C/C(a/b)/O/X/B/W, " + "Current Usage is " + usage, positionPath + "", "Warning"));
          }
        } else if (conformanceProfile.getProfileType().equals(ProfileType.Constrainable)) {
          if(!(usage.equals(Usage.R) || usage.equals(Usage.RE) || usage.equals(Usage.C) || usage.equals(Usage.CAB) || usage.equals(Usage.O) || usage.equals(Usage.X) || usage.equals(Usage.B))) {
            result.getErrors().add(new IgamtObjectError("Verification", "Usage_Value_Constraintable", "At " + path + " Usage should be one of R/RE/C/C(a/b)/O/X/B, " + "Current Usage is " + usage, positionPath + "", "Warning"));
          }
        } else if (conformanceProfile.getProfileType().equals(ProfileType.Implementation)) {
          if(!(usage.equals(Usage.R) || usage.equals(Usage.RE) || usage.equals(Usage.CAB) || usage.equals(Usage.X))) {
            result.getErrors().add(new IgamtObjectError("Verification", "Usage_Value_Implementable", "At " + path + " Usage should be one of R/RE/C(a/b)/X, " + "Current Usage is " + usage, positionPath + "", "Warning"));
          }
        } else {
          if(!(usage.equals(Usage.R) || usage.equals(Usage.RE) || usage.equals(Usage.C) || usage.equals(Usage.CAB) || usage.equals(Usage.O) || usage.equals(Usage.X) || usage.equals(Usage.B) || usage.equals(Usage.W))) {
            result.getErrors().add(new IgamtObjectError("Verification", "Usage_Value_Any", "At " + path + " Usage must be one of R/RE/C/C(a/b)/O/X/B/W, " + "Current Usage is " + usage, positionPath + "", "ERROR"));
          }
        }
      }
    }
  }


  private void checkingGroupForCompliance(ConformanceProfile conformanceProfile, Group group, CPVerificationResult result, String positionPath, String path, Set<StructureElementBinding> sebs) {
    String name = group.getName();
    int position = group.getPosition();
    Usage usage = group.getUsage();
    
    int min = group.getMin();
    String max = group.getMax();
    
    
    if (positionPath == null) {
      positionPath = position + "";
    } else {
      positionPath = positionPath + "." + position;
    }    
    
    if (this.isNotNullNotEmpty(name)) {
      if (path == null) path = name;
      else path = path + "." + name;
      
      this.childComplianceMap.put(positionPath, new ComplianceObject(positionPath, path, usage, min, max));
      
      this.checkUsageVerificationErrorForCompliance(conformanceProfile, usage, positionPath, path, result);
      this.checkCardinalityVerificationErrorForCompliance(conformanceProfile, usage, min, max, positionPath, path, result);
      
      if(group.getChildren() != null) {
        for (SegmentRefOrGroup child : group.getChildren()) {
          this.checkingSegmentRefOrGroupForCompliance(conformanceProfile, child, result, positionPath, path, this.findSEB(sebs, child.getId()));
        } 
      } 
    }
  }
  
  private void checkingGroup(ConformanceProfile conformanceProfile, Group group, CPVerificationResult result, String positionPath, String path, Set<StructureElementBinding> sebs) {
    String name = group.getName();
    int position = group.getPosition();
    Usage usage = group.getUsage();
    
    int min = group.getMin();
    String max = group.getMax();
    
    
    if (positionPath == null) {
      positionPath = position + "";
    } else {
      positionPath = positionPath + "." + position;
    }    
    
    if (!this.isNotNullNotEmpty(name)) {
      result.getErrors().add(new IgamtObjectError("STRUCTURE", "group.name", "Name should be required.", positionPath + "", "ERROR"));
    } else {
      if (path == null) path = name;
      else path = path + "." + name;
      
      this.childComplianceMap.put(positionPath, new ComplianceObject(positionPath, path, usage, min, max));
      
      this.checkUsageVerificationError(conformanceProfile, usage, positionPath, path, result);
      this.checkCardinalityVerificationError(usage, min, max, positionPath, path, result);
      
      if(group.getChildren() != null) {
        for (SegmentRefOrGroup child : group.getChildren()) {
          this.checkingSegmentRefOrGroup(conformanceProfile, child, result, positionPath, path, this.findSEB(sebs, child.getId()));
        } 
      } 
    }
  }

  /**
   * @param segment
   * @param vr
   */
  private void checkingStructureForSegment(Segment segment, DTSegVerificationResult result) {      
      this.checkingFields(segment, segment.getChildren(), result);
  }
  
  /**
   * @param segment
   * @param children
   * @param vr
   */
  private void checkingFields(Segment segment, Set<Field> fields, DTSegVerificationResult result) {
    if(fields == null || fields.size() == 0) {
      result.getErrors().add(new IgamtObjectError("STRUCTURE", "fields", "Segment should have one or more fields.", null, "ERROR"));
    } else {
      fields.forEach(f -> this.checkingField(segment, f, result));
    }
  }
  
  /**
   * @param valueset
   * @param codes
   * @param vr
   */
  private void checkingCodes(Valueset valueset, Set<Code> codes, VSVerificationResult result) {
    codes.forEach(c -> this.checkingCode(valueset, c, result));
    
  }
  
  /**
   * @param components
   */
  private void checkingComponents(ComplexDatatype cDt, Set<Component> components, DTSegVerificationResult result) {
    if(components == null || components.size() == 0) {
      result.getErrors().add(new IgamtObjectError("STRUCTURE", "components_missing", "Complex Datatype should have one or more components.", null, "ERROR"));
    } else {
      components.forEach(c -> this.checkingComponent(cDt, c, result));
    }
  }
  
  /**
   * @param valueset
   * @param c
   * @param vr
   * @return
   */
  private void checkingCode(Valueset valueset, Code c, VSVerificationResult result) {
    String value = c.getValue();
    String description = c.getDescription();
    String codeSystem = c.getCodeSystem();
    CodeUsage usage = c.getUsage();
    
    if(!this.isNotNullNotEmpty(value)) result.getErrors().add(new IgamtObjectError("STRUCTURE", "code.value", "value should be required.", c.getValue() + "", "ERROR"));
    if(description == null) result.getErrors().add(new IgamtObjectError("STRUCTURE", "code.description", "Code " + c.getValue() + "'s description is missing.", c.getValue() + "", "ERROR"));
    if(!this.isNotNullNotEmpty(codeSystem)) result.getErrors().add(new IgamtObjectError("STRUCTURE", "code.codeSystem", "codeSystem should be required.", c.getValue() + "", "ERROR"));
    if(usage == null) result.getErrors().add(new IgamtObjectError("STRUCTURE", "code.usage", "usage should be required.", c.getValue() + "", "ERROR"));
    
    valueset.getCodes().forEach(otherC -> {
      if(!otherC.getId().equals(c.getId())){
        if ((otherC.getValue() + "-" + otherC.getCodeSystem()).equals(c.getValue() + "-" + c.getCodeSystem())) result.getErrors().add(new IgamtObjectError("STRUCTURE", "code.value", "The code value and codesys pair is duplicated.", c.getValue() + "", "ERROR"));
      }
    });
  }


  /**
   * @param datatype
   * @param c
   * @param vr
   * @return
   */
  private void checkingComponent(ComplexDatatype cDt, Component c, DTSegVerificationResult result) {
    String name = c.getName();
    int position = c.getPosition();
    Ref ref = c.getRef();
    Type type = c.getType();
    Usage usage = c.getUsage();
    
    String confLength = c.getConfLength();
    String maxLength = c.getMaxLength();
    String minLength = c.getMinLength();

    if(position == 0) result.getErrors().add(new IgamtObjectError("STRUCTURE", "position_missing", "Component position should be greater than 0", position + "", "ERROR"));
    if(!this.isNotNullNotEmpty(name)) result.getErrors().add(new IgamtObjectError("STRUCTURE", "name_missing", "Name should be required.", position + "", "ERROR"));
    if(ref == null || ref.getId() == null) result.getErrors().add(new IgamtObjectError("STRUCTURE", "ref_missing", "Component Ref should be required.", position + "", "ERROR"));
    if(type == null || !type.equals(Type.COMPONENT)) result.getErrors().add(new IgamtObjectError("STRUCTURE", "type_missing", "Component type should be 'COMPONENT'.", position + "", "ERROR"));

    this.checkUsageVerificationError(null, usage, position + "", cDt.getLabel() + "." + position, result);
    this.checkLengthVerificationErorr(c, minLength, maxLength, confLength, "", cDt.getLabel() + "." + position, result);
    
    cDt.getComponents().forEach(otherC -> {
      if(!otherC.getId().equals(c.getId())){
        if (otherC.getPosition() == c.getPosition()) result.getErrors().add(new IgamtObjectError("STRUCTURE", "position_duplicated", "The component position is duplicated.", position + "", "ERROR"));
        if (otherC.getName().equals(c.getName())) result.getErrors().add(new IgamtObjectError("STRUCTURE", "name_missing", "The component name is duplicated.", position + "", "ERROR"));
      }
    });
    
    if(ref != null && ref.getId() != null) {
      Datatype childDt = this.datatypeService.findById(ref.getId());
      if(childDt == null) result.getErrors().add(new IgamtObjectError("STRUCTURE", "ref_missing", "The component child DT is missing.", position + "", "ERROR"));
            
      if(this.isPrimitiveDatatype(childDt)) {
        
      } else {
        if(this.isNotNullNotEmpty(c.getConstantValue())) result.getErrors().add(new IgamtObjectError("STRUCTURE", "constantValue_notAllowed", "This ConstantValue is not allowed for this component.", position + "", "ERROR"));
      }
      
      if (this.isValueSetOrSingleCodeAllowedComponent(c, childDt)) {
        StructureElementBinding childBinding = this.findBindingById(c.getId(), cDt.getBinding());
        if(childBinding != null){
          Set<ValuesetBinding> valuesetBindings = childBinding.getValuesetBindings();
          ExternalSingleCode externalSingleCode = childBinding.getExternalSingleCode();
          InternalSingleCode internalSingleCode = childBinding.getInternalSingleCode();
          
          if(valuesetBindings != null) this.checkingValueSetBindings(cDt, valuesetBindings, result, position);
          if(externalSingleCode != null) this.checkingExternalSingleCode(cDt, externalSingleCode, result, position);
          if(internalSingleCode != null) this.checkingInternalSingleCode(cDt, internalSingleCode, result, position);
        }
        
      }else {
        
      }
    }
  }
  
  /**
   * @param segment
   * @param f
   * @param vr
   * @return
   */
  private void checkingField(Segment segment, Field f, DTSegVerificationResult result) {
    String name = f.getName();
    int position = f.getPosition();
    Ref ref = f.getRef();
    Type type = f.getType();
    Usage usage = f.getUsage();
    
    String confLength = f.getConfLength();
    String maxLength = f.getMaxLength();
    String minLength = f.getMinLength();
    
    int min = f.getMin();
    String max = f.getMax();
  

    if(position == 0) result.getErrors().add(new IgamtObjectError("STRUCTURE", "position", "Field position should be greater than 0", position + "", "ERROR"));
    if(!this.isNotNullNotEmpty(name)) result.getErrors().add(new IgamtObjectError("STRUCTURE", "name_missing", "Name should be required.", position + "", "ERROR"));
    if(ref == null || ref.getId() == null) result.getErrors().add(new IgamtObjectError("STRUCTURE", "ref_missing", "Field Ref should be required.", position + "", "ERROR"));
    if(type == null || !type.equals(Type.FIELD)) result.getErrors().add(new IgamtObjectError("STRUCTURE", "type.missing", "Field type should be 'FIELD'.", position + "", "ERROR"));
    
    this.checkUsageVerificationError(null, usage, position + "", segment.getLabel() + "-" + position, result);
    this.checkCardinalityVerificationError(usage, min, max, position + "", segment.getLabel() + "-" + position, result);
    this.checkLengthVerificationErorr(f, minLength, maxLength, confLength, position + "", segment.getLabel() + "-" + position, result);
    
    segment.getChildren().forEach(otherF -> {
      if(!otherF.getId().equals(f.getId())){
        if (otherF.getPosition() == f.getPosition()) result.getErrors().add(new IgamtObjectError("STRUCTURE", "poisition_duplicated", "The field position is duplicated.", position + "", "ERROR"));
        if (otherF.getName().equals(f.getName())) result.getErrors().add(new IgamtObjectError("STRUCTURE", "name_duplicated", "The field name is duplicated.", position + "", "ERROR"));
      }
    });
    
    if(ref != null && ref.getId() != null) {
      Datatype childDt = this.datatypeService.findById(ref.getId());
      if(childDt == null) result.getErrors().add(new IgamtObjectError("STRUCTURE", "Datatype_missing", "The field DT is missing.", position + "", "ERROR"));
            
      if(this.isPrimitiveDatatype(childDt)) {
        
      } else {
        if(this.isNotNullNotEmpty(f.getConstantValue())) result.getErrors().add(new IgamtObjectError("STRUCTURE", "constantValue_notAllowed", "This ConstantValue is not allowed for this component.", position + "", "ERROR"));
      }
      
      if (this.isValueSetOrSingleCodeAllowedField(f, childDt)) {
        StructureElementBinding childBinding = this.findBindingById(f.getId(), segment.getBinding());
        if(childBinding != null){
          Set<ValuesetBinding> valuesetBindings = childBinding.getValuesetBindings();
          ExternalSingleCode externalSingleCode = childBinding.getExternalSingleCode();
          InternalSingleCode internalSingleCode = childBinding.getInternalSingleCode();
          
          if(valuesetBindings != null) this.checkingValueSetBindings(segment, valuesetBindings, result, position);
          if(externalSingleCode != null) this.checkingExternalSingleCode(segment, externalSingleCode, result, position);
          if(internalSingleCode != null) this.checkingInternalSingleCode(segment, internalSingleCode, result, position);
        }
        
      }else {
        
      }
    }
  }

  /**
   * @param internalSingleCode
   * @param vr
   */
  private void checkingInternalSingleCode(ComplexDatatype cDt, InternalSingleCode internalSingleCode, DTSegVerificationResult result, int position) {
    String code = internalSingleCode.getCode();
    String codeSystem = internalSingleCode.getCodeSystem();
    String valueSetId = internalSingleCode.getValueSetId();
    
    if(!this.isNotNullNotEmpty(code))       result.getErrors().add(new IgamtObjectError("STRUCTURE", "component.internalSingleCode", "The component's internal SingleCode Code is not valid", position + "", "ERROR"));
    if(!this.isNotNullNotEmpty(codeSystem)) result.getErrors().add(new IgamtObjectError("STRUCTURE", "component.internalSingleCode", "The component's internal SingleCode CodeSystem is not valid", position + "", "ERROR"));
    if(!this.isNotNullNotEmpty(valueSetId)) result.getErrors().add(new IgamtObjectError("STRUCTURE", "component.internalSingleCode", "The component's internal SingleCode valueset is missing", position + "", "ERROR"));
    
    if (valueSetId != null) {
      if(this.valuesetService.findById(valueSetId) == null) result.getErrors().add(new IgamtObjectError("STRUCTURE", "component.internalSingleCode", "The component's internal SingleCode valueset is missing", position + "", "ERROR"));
    }
  }
  
  /**
   * @param segment
   * @param internalSingleCode
   * @param vr
   * @param position
   */
  private void checkingInternalSingleCode(Segment segment, InternalSingleCode internalSingleCode, DTSegVerificationResult result, int position) {
    String code = internalSingleCode.getCode();
    String codeSystem = internalSingleCode.getCodeSystem();
    String valueSetId = internalSingleCode.getValueSetId();
    
    if(!this.isNotNullNotEmpty(code))       result.getErrors().add(new IgamtObjectError("STRUCTURE", "field.internalSingleCode", "The field's internal SingleCode Code is not valid", position + "", "ERROR"));
    if(!this.isNotNullNotEmpty(codeSystem)) result.getErrors().add(new IgamtObjectError("STRUCTURE", "field.internalSingleCode", "The field's internal SingleCode CodeSystem is not valid", position + "", "ERROR"));
    if(!this.isNotNullNotEmpty(valueSetId)) result.getErrors().add(new IgamtObjectError("STRUCTURE", "field.internalSingleCode", "The field's internal SingleCode valueset is missing", position + "", "ERROR"));
    
    if (valueSetId != null) {
      if(this.valuesetService.findById(valueSetId) == null) result.getErrors().add(new IgamtObjectError("STRUCTURE", "field.internalSingleCode", "The field's internal SingleCode valueset is missing", position + "", "ERROR"));
    }
  }

  /**
   * @param externalSingleCode
   * @param vr
   */
  private void checkingExternalSingleCode(ComplexDatatype cDt, ExternalSingleCode externalSingleCode, DTSegVerificationResult result, int position) {
    String value = externalSingleCode.getValue();
    String codeSystem = externalSingleCode.getCodeSystem();
    
    if(!this.isNotNullNotEmpty(value))       result.getErrors().add(new IgamtObjectError("STRUCTURE", "component.externalSingleCode", "The component's external SingleCode Code is not valid", position + "", "ERROR"));
    if(!this.isNotNullNotEmpty(codeSystem)) result.getErrors().add(new IgamtObjectError("STRUCTURE", "component.externalSingleCode", "The component's external SingleCode CodeSystem is not valid", position + "", "ERROR"));
  }

  /**
   * @param segment
   * @param externalSingleCode
   * @param vr
   * @param position
   */
  private void checkingExternalSingleCode(Segment segment, ExternalSingleCode externalSingleCode, DTSegVerificationResult result, int position) {
    String value = externalSingleCode.getValue();
    String codeSystem = externalSingleCode.getCodeSystem();
    
    if(!this.isNotNullNotEmpty(value))       result.getErrors().add(new IgamtObjectError("STRUCTURE", "field.externalSingleCode", "The component's external SingleCode Code is not valid", position + "", "ERROR"));
    if(!this.isNotNullNotEmpty(codeSystem)) result.getErrors().add(new IgamtObjectError("STRUCTURE", "field.externalSingleCode", "The component's external SingleCode CodeSystem is not valid", position + "", "ERROR"));
    
  }
  
  /**
   * @param valuesetBindings
   * @param vr
   */
  private void checkingValueSetBindings(ComplexDatatype cDt, Set<ValuesetBinding> valuesetBindings, DTSegVerificationResult result, int position) {
    for (ValuesetBinding vb : valuesetBindings) {
      for(String vsId : vb.getValueSets()){
        if(vsId == null) {
          result.getErrors().add(new IgamtObjectError("STRUCTURE", "component.valuesetBindings", "The component's valueset is null", position + "", "ERROR"));   
        }else {
          if(this.valuesetService.findById(vsId) == null) result.getErrors().add(new IgamtObjectError("STRUCTURE", "component.valuesetBindings", "The component's valueset is missing", position + "", "ERROR"));   
        }
      }
    }
  }
  
  /**
   * @param segment
   * @param valuesetBindings
   * @param vr
   * @param position
   */
  private void checkingValueSetBindings(Segment segment, Set<ValuesetBinding> valuesetBindings, DTSegVerificationResult result, int position) {
    for (ValuesetBinding vb : valuesetBindings) {
      for(String vsId : vb.getValueSets()){
        if(vsId == null) {
          result.getErrors().add(new IgamtObjectError("STRUCTURE", "field.valuesetBindings", "The field's valueset is null", position + "", "ERROR"));   
        }else {
          if(this.valuesetService.findById(vsId) == null) result.getErrors().add(new IgamtObjectError("STRUCTURE", "field.valuesetBindings", "The field's valueset is missing", position + "", "ERROR"));   
        }
      }
    }
  }


  /**
   * @param id
   * @param binding
   * @return
   */
  private StructureElementBinding findBindingById(String id, ResourceBinding binding) {
    if (binding != null && binding.getChildren() != null) {
      for (StructureElementBinding seb : binding.getChildren()) {
        if(seb.getElementId().equals(id)) return seb;
      }
    }
    return null;
  }

  /**
   * @param c
   * @param childDt
   * @return
   */
  private boolean isValueSetOrSingleCodeAllowedComponent(Component c, Datatype childDt) {
    // TODO Auto-generated method stub
    return true;
  }
  
  /**
   * @param c
   * @param childDt
   * @return
   */
  private boolean isValueSetOrSingleCodeAllowedField(Field f, Datatype childDt) {
    // TODO Auto-generated method stub
    return true;
  }

  private boolean isNullOrNA(String s) {
    if(s == null) return true;
    if(s.equals("NA")) return true;
    return false;
  }

  /**
   * @param c
   * @return
   */
  private boolean isLengthAllowedComponent(Component c) {
    if (c != null) {
      Ref ref = c.getRef();
      if(ref.getId() != null){
        Datatype childDt = this.datatypeService.findById(ref.getId());    
        if(childDt != null) return this.isPrimitiveDatatype(childDt);
      }
    }

    return false;
  }
  
  /**
   * @param c
   * @return
   */
  private boolean isLengthAllowedComponent(Field f) {
    if (f != null) {
      Ref ref = f.getRef();
      if(ref.getId() != null){
        Datatype childDt = this.datatypeService.findById(ref.getId());    
        if(childDt != null) return this.isPrimitiveDatatype(childDt);
      }
    }

    return false;
  }
  
  private boolean isPrimitiveDatatype(Datatype dt) {
    if(dt instanceof PrimitiveDatatype) return true;
    if(dt instanceof DateTimeDatatype) return true;
    if(dt instanceof ComplexDatatype) {
      if(((ComplexDatatype)dt).getComponents() == null || ((ComplexDatatype)dt).getComponents().size() == 0) return true;
    }
    return false;
  }

  /**
   * @param cDt
   * @param position
   * @return
   */
  private boolean hasPredicate(ComplexDatatype cDt, String componentId) {
    ResourceBinding binding = cDt.getBinding();
    if(binding == null || binding.getChildren() == null) return false;
    else {
      for (StructureElementBinding child : binding.getChildren()) {
        if(child.getElementId().equals(componentId)) {
          if(child.getPredicateId() != null) {
            if(this.predicateRepository.findById(child.getPredicateId()).isPresent()) return true;
          }
        }
      }
    }
    
    return false;
  }
  
  private boolean hasPredicate(Segment segment, String fieldId) {
    ResourceBinding binding = segment.getBinding();
    if(binding == null || binding.getChildren() == null) return false;
    else {
      for (StructureElementBinding child : binding.getChildren()) {
        if(child.getElementId().equals(fieldId)) {
          if(child.getPredicateId() != null) {
            if(this.predicateRepository.findById(child.getPredicateId()).isPresent()) return true;
          }
        }
      }
    }
    
    return false;
  }
  
  
  /**
   * @param id
   * @param sebs
   * @return
   */
  private boolean hasPredicate(String elementId, Set<StructureElementBinding> sebs) {
    if(sebs != null) {
      for (StructureElementBinding child : sebs) {
        if(child.getElementId().equals(elementId)) {
          if(child.getPredicateId() != null) {
            if(this.predicateRepository.findById(child.getPredicateId()).isPresent()) return true;
          }
        }
      }
    }
    return false;
  }
 
  /**
   * @param valueset
   * @param vr
   */
  private void checkingMetadataForValueset(Valueset valueset, VSVerificationResult result) {
    if (valueset == null) {
      
    } else {
      String bId = valueset.getBindingIdentifier();
      String name = valueset.getName();
      Extensibility extensibility = valueset.getExtensibility();
      Stability stability = valueset.getStability();
      ContentDefinition contentDefinition = valueset.getContentDefinition();
      int numberOfCodes = valueset.getNumberOfCodes(); 
      DomainInfo domainInfo = valueset.getDomainInfo();
      
      if (!this.isNotNullNotEmptyNotWhiteSpaceOnly(bId)) result.getErrors().add(new IgamtObjectError("METADATA", "bindingIdentifier", "bindingIdentifier should be required.", null, "ERROR"));
      if (name == null) result.getErrors().add(new IgamtObjectError("METADATA", "name", "name should be required.", null, "ERROR"));
      if (extensibility == null) result.getErrors().add(new IgamtObjectError("METADATA", "extensibility", "extensibility should be required.", null, "ERROR"));
      if (stability == null) result.getErrors().add(new IgamtObjectError("METADATA", "stability", "stability should be required.", null, "ERROR"));
      if (contentDefinition == null) result.getErrors().add(new IgamtObjectError("METADATA", "contentDefinition", "contentDefinition should be required.", null, "ERROR"));
      
      if(domainInfo == null) {
        result.getErrors().add(new IgamtObjectError("METADATA", "domainInfo", "DomainInfo is missing", null, "ERROR"));
      } else {
        if (domainInfo.getScope() == null) result.getErrors().add(new IgamtObjectError("METADATA", "scope", "Scope is required", null, "ERROR"));
      }
      
      if(valueset.getCodes() == null || valueset.getCodes().size() == 0) {
        if(numberOfCodes != 0) result.getErrors().add(new IgamtObjectError("METADATA", "numberOfCodes", "numberOfCodes is wrong", null, "ERROR"));
      } else {
        if(numberOfCodes != valueset.getCodes().size()) result.getErrors().add(new IgamtObjectError("METADATA", "numberOfCodes", "numberOfCodes is wrong", null, "ERROR"));
      }
      
    }
    
  }
  
  /**
   * @param datatype
   * @param vr
   * Required: Name, Extension, dtDomainInfo, dtDomainInfo.scope
   */
  private void checkingMetadataForDatatype(Datatype datatype, DTSegVerificationResult result) {
    if (datatype == null) {
      
    } else {
      String dtName = datatype.getName();
      String dtExt = datatype.getExt();
      DomainInfo dtDomainInfo = datatype.getDomainInfo();
      
      if (!this.isNotNullNotEmptyNotWhiteSpaceOnly(dtName)) {
        result.getErrors().add(new IgamtObjectError("METADATA", "name", "Name should be required.", null, "ERROR"));
      }
      
      if(dtDomainInfo == null) {
        result.getErrors().add(new IgamtObjectError("METADATA", "domainInfo", "DomainInfo is missing", null, "ERROR"));
      } else {
        if (dtDomainInfo.getScope() == null) result.getErrors().add(new IgamtObjectError("METADATA", "scope", "Scope is required", null, "ERROR"));
        if (!dtDomainInfo.getScope().equals(Scope.HL7STANDARD) && !this.isNotNullNotEmptyNotWhiteSpaceOnly(dtExt)) {
          result.getErrors().add(new IgamtObjectError("METADATA", "ext", "Non-STD datatype should have extension name.", null, "ERROR"));
        }        
      }
    }
  }
  
  /**
   * @param segment
   * @param vr
   */
  private void checkingMetadataForSegment(Segment segment, DTSegVerificationResult result) {
    if (segment == null) {
      
    } else {
      String dtName = segment.getName();
      String dtExt = segment.getExt();
      DomainInfo dtDomainInfo = segment.getDomainInfo();
      
      if (!this.isNotNullNotEmptyNotWhiteSpaceOnly(dtName)) {
        result.getErrors().add(new IgamtObjectError("METADATA", "name", "Name should be required.", null, "ERROR"));
      }
      
      if(dtDomainInfo == null) {
        result.getErrors().add(new IgamtObjectError("METADATA", "domainInfo", "DomainInfo is missing", null, "ERROR"));
      } else {
        if (dtDomainInfo.getScope() == null) result.getErrors().add(new IgamtObjectError("METADATA", "scope", "Scope is required", null, "ERROR"));
        if (!dtDomainInfo.getScope().equals(Scope.HL7STANDARD) && !this.isNotNullNotEmptyNotWhiteSpaceOnly(dtExt)) {
          result.getErrors().add(new IgamtObjectError("METADATA", "ext", "Non-STD datatype should have extension name.", null, "ERROR"));
        }        
      }
    }
  }
  
  /**
   * @param conformanceProfile
   * @param vr
   */
  private void checkingMetadataForConformanceProfile(ConformanceProfile conformanceProfile, CPVerificationResult result) {
    if (conformanceProfile == null) {
      
    } else {
      String cpName = conformanceProfile.getName();
      DomainInfo cpDomainInfo = conformanceProfile.getDomainInfo();
      String structId = conformanceProfile.getStructID();
      String mType = conformanceProfile.getMessageType();
      String event = conformanceProfile.getEvent();
      
      if (!this.isNotNullNotEmptyNotWhiteSpaceOnly(cpName)) {
        result.getErrors().add(new IgamtObjectError("METADATA", "name", "Name should be required.", null, "ERROR"));
      }
      
      if (!this.isNotNullNotEmptyNotWhiteSpaceOnly(structId)) {
        result.getErrors().add(new IgamtObjectError("METADATA", "structId", "structId should be required.", null, "ERROR"));
      }
      
      if (!this.isNotNullNotEmptyNotWhiteSpaceOnly(mType)) {
        result.getErrors().add(new IgamtObjectError("METADATA", "messageType", "messageType should be required.", null, "ERROR"));
      }
      
      if (!this.isNotNullNotEmptyNotWhiteSpaceOnly(event)) {
        result.getErrors().add(new IgamtObjectError("METADATA", "triggerEvent", "triggerEvent should be required.", null, "ERROR"));
      }
      
      if(cpDomainInfo == null) {
        result.getErrors().add(new IgamtObjectError("METADATA", "domainInfo", "DomainInfo is missing", null, "ERROR"));
      } else {
        if (cpDomainInfo.getScope() == null) result.getErrors().add(new IgamtObjectError("METADATA", "scope", "Scope is required", null, "ERROR"));     
      }
    }
  }
  
  private boolean isNotNullNotEmptyNotWhiteSpaceOnly(final String string) {
    return string != null && !string.isEmpty() && !string.trim().isEmpty();
  }
  
  private boolean isNotNullNotEmpty(final String string) {
    return string != null && !string.isEmpty();
  }
  
  private boolean isInt(String s) {
    try
    { Integer.parseInt(s); return true; }

    catch(NumberFormatException er) { 
      return false; 
    }
  }
  
  private boolean isIntOrStar(String s) {
    try
    { Integer.parseInt(s); return true; }

   catch(NumberFormatException er){
     if (s.equals("*")) return true;
     return false; 
     }
  }

  @Override
  public DTSegVerificationResult verifySegment(Segment segment) {
    DTSegVerificationResult result = new DTSegVerificationResult(segment);
    
    // 1. Metadata checking
    this.checkingMetadataForSegment(segment, result);
    
    
    // 2. Structure Checking
    this.checkingStructureForSegment(segment, result);
    
    
    // 3. DynamicMapping Checking
    this.checkingDynamicMapping(segment, result);
    
    return result;
  }

  /**
   * @param segment
   * @param vr
   */
  private void checkingDynamicMapping(Segment segment, DTSegVerificationResult result) {
    if(this.isAvaliableDynamicMappingSegmnet(segment)) {
      DynamicMappingInfo dynamicMappingInfo = segment.getDynamicMappingInfo();
      
      if(dynamicMappingInfo != null && dynamicMappingInfo.getItems() != null) {
        for(DynamicMappingItem item : dynamicMappingInfo.getItems()) {
          if(this.isNotNullNotEmptyNotWhiteSpaceOnly(item.getValue())) result.getErrors().add(new IgamtObjectError("DYNMICMAPPING", "item.value", "The dynamicmpaping value is invalid", item.getValue() + "", "ERROR"));
          String datatypeId = item.getDatatypeId();
          
          if(datatypeId == null) result.getErrors().add(new IgamtObjectError("DYNMICMAPPING", "item.datatypeId", "The dynamicmpaping dt id is null", item.getValue() + "", "ERROR"));
          else {
            Datatype dt = this.datatypeService.findById(datatypeId);
            if(dt == null) result.getErrors().add(new IgamtObjectError("DYNMICMAPPING", "item.datatypeId", "The dynamicmpaping datattype is missing in the DB", item.getValue() + "", "ERROR"));
          }
        }
      }
      
    }
  }

  /**
   * @param segment
   * @return
   */
  private boolean isAvaliableDynamicMappingSegmnet(Segment segment) {
    return segment.getName().equals("OBX");
  }

  private CPVerificationResult verifyConformanceProfileForCompliance(ConformanceProfile conformanceProfile) {
    CPVerificationResult result = new CPVerificationResult(conformanceProfile);

    //0. Create parentMap for Compliance Checking
    if(conformanceProfile.getOrigin() != null) {
      ConformanceProfile parentConformanceProfile = this.conformanceProfileService.findById(conformanceProfile.getOrigin());
      Set<StructureElementBinding> sebs = null;
      if (parentConformanceProfile.getBinding() != null) sebs = parentConformanceProfile.getBinding().getChildren();
      this.travelSegmentRefOrGroups(parentConformanceProfile, parentConformanceProfile.getChildren(), null, null, sebs);
    }
    
    this.checkingStructureForConformanceProfileForCompliance(conformanceProfile, result);
    
    return result;
  }
  
  @Override
  public CPVerificationResult verifyConformanceProfile(ConformanceProfile conformanceProfile) {
    CPVerificationResult result = new CPVerificationResult(conformanceProfile);

    //0. Create parentMap for Compliance Checking
    if(conformanceProfile.getOrigin() != null) {
      ConformanceProfile parentConformanceProfile = this.conformanceProfileService.findById(conformanceProfile.getOrigin());
      Set<StructureElementBinding> sebs = null;
      if (parentConformanceProfile.getBinding() != null) sebs = parentConformanceProfile.getBinding().getChildren();
      this.travelSegmentRefOrGroups(parentConformanceProfile, parentConformanceProfile.getChildren(), null, null, sebs);
    }
    
    //1. Metadata checking
    this.checkingMetadataForConformanceProfile(conformanceProfile, result);
    
    // 2. Structure Checking
    this.checkingStructureForConformanceProfile(conformanceProfile, result);
    
    return result;
  }

  /**
   * @param parentConformanceProfile
   * @param children
   * @param object
   * @param object2
   * @param sebs
   */
  private void travelSegmentRefOrGroups(ConformanceProfile conformanceProfile, Set<SegmentRefOrGroup> segmentRefOrGroups, String positionPath, String path, Set<StructureElementBinding> sebs) {
    if (segmentRefOrGroups != null) {
      segmentRefOrGroups.forEach(srog -> this.travelSegmentRefOrGroup(conformanceProfile, srog, positionPath, path, this.findSEB(sebs, srog.getId())));
    }
  }

  /**
   * @param conformanceProfile
   * @param srog
   * @param positionPath
   * @param path
   * @param findSEB
   * @return
   */
  private void travelSegmentRefOrGroup(ConformanceProfile conformanceProfile, SegmentRefOrGroup srog, String positionPath, String path, Set<StructureElementBinding> sebs) {
    if(srog instanceof SegmentRef) {
      this.travelSegmentRef(conformanceProfile, (SegmentRef)srog, positionPath, path, sebs);
    } else if(srog instanceof Group) {
      this.travelGroup(conformanceProfile, (Group)srog, positionPath, path, sebs);
    } 
  }

  /**
   * @param conformanceProfile
   * @param srog
   * @param positionPath
   * @param path
   * @param sebs
   */
  private void travelGroup(ConformanceProfile conformanceProfile, Group group, String positionPath, String path, Set<StructureElementBinding> sebs) {
    String name = group.getName();
    int position = group.getPosition();
    Usage usage = group.getUsage();
    
    int min = group.getMin();
    String max = group.getMax();
    
    
    if (positionPath == null) {
      positionPath = position + "";
    } else {
      positionPath = positionPath + "." + position;
    }    
    
    if (!this.isNotNullNotEmpty(name)) {
    } else {
      if (path == null) path = name;
      else path = path + "." + name;
      
      this.parentComplianceMap.put(positionPath, new ComplianceObject(positionPath, path, usage, min, max));

      
      if(group.getChildren() != null) {
        for (SegmentRefOrGroup child : group.getChildren()) {
          this.travelSegmentRefOrGroup(conformanceProfile, child, positionPath, path, this.findSEB(sebs, child.getId()));
        } 
      } 
    }
  }

  /**
   * @param conformanceProfile
   * @param srog
   * @param positionPath
   * @param path
   * @param sebs
   */
  private void travelSegmentRef(ConformanceProfile conformanceProfile, SegmentRef sr, String positionPath, String path, Set<StructureElementBinding> sebs) {
    int position = sr.getPosition();
    Usage usage = sr.getUsage();
    int min = sr.getMin();
    String max = sr.getMax();
    Ref ref = sr.getRef();
    Segment segment = null;
    
    if (positionPath == null) {
      positionPath = position + "";
    } else {
      positionPath = positionPath + "." + position;
    }
    
    
    // Ref value Check
    if(ref == null || ref.getId() == null) {
      
    }else {
      segment = this.segmentService.findById(ref.getId());
      // DATA Acessability check
      if(segment == null) {
        
      } else {
        if (path == null) {
          path = segment.getName();
        } else {
          path = path + "." + segment.getName();
        }
        
        this.parentComplianceMap.put(positionPath, new ComplianceObject(positionPath, path, usage, min, max));

        if(segment.getChildren() != null) {          
          for(Field field : segment.getChildren() ){
            this.travelFieldForConformanceProfile(conformanceProfile, field, positionPath, path); 
          }
        }
      } 
    }
    
  }

  /**
   * @param conformanceProfile
   * @param field
   * @param positionPath
   * @param path
   */
  private void travelFieldForConformanceProfile(ConformanceProfile conformanceProfile, Field field, String positionPath, String path) {
    int position = field.getPosition();
    Usage usage = field.getUsage();
    int min = field.getMin();
    String max = field.getMax();
    Ref ref = field.getRef();
    positionPath = positionPath + "." + position;
    path = path + "." + position;
    
    this.parentComplianceMap.put(positionPath, new ComplianceObject(positionPath, path, usage, min, max));
    if (ref != null && ref.getId() != null) {
      Datatype datatype = this.datatypeService.findById(ref.getId());
      
      if (datatype != null) {
        if(datatype instanceof ComplexDatatype) {
          ComplexDatatype cDT = (ComplexDatatype)datatype;
          if(cDT.getComponents() != null && cDT.getComponents().size() > 0) {
            for(Component component : cDT.getComponents() ){
              this.travelComponentForConformanceProfile(conformanceProfile, component, positionPath, path); 
            }
          }
        }
      }
    }
    
  }

  /**
   * @param conformanceProfile
   * @param component
   * @param positionPath
   * @param path
   */
  private void travelComponentForConformanceProfile(ConformanceProfile conformanceProfile, Component component, String positionPath, String path) {
    int position = component.getPosition();
    Usage usage = component.getUsage();
    Ref ref = component.getRef();
    positionPath = positionPath + "." + position;
    path = path + "." + position;
    
    this.parentComplianceMap.put(positionPath, new ComplianceObject(positionPath, path, usage, null, null));

    if (ref != null && ref.getId() != null) {
      Datatype datatype = this.datatypeService.findById(ref.getId());
      
      if (datatype != null) {
        if(datatype instanceof ComplexDatatype) {
          ComplexDatatype cDT = (ComplexDatatype)datatype;
          if(cDT.getComponents() != null && cDT.getComponents().size() > 0) {
            for(Component childComponent : cDT.getComponents() ){
              this.travelComponentForConformanceProfile(conformanceProfile, childComponent, positionPath, path); 
            }
          }
        }
      }
    }
    
  }

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.verification.service.VerificationService#verifyIg(java.lang.String)
   */
  @Override
  public VerificationReport verifyIg(String documentId) {
    parentComplianceMap = new HashMap<String,ComplianceObject>();
    childComplianceMap = new HashMap<String,ComplianceObject>();
    VerificationReport report = new VerificationReport();
    Ig ig = this.igService.findById(documentId);
    IgVerificationResult result = new IgVerificationResult(ig);
    

    ValueSetRegistry valueSetRegistry = ig.getValueSetRegistry();
    
    if(valueSetRegistry.getChildren() != null) {
      for(Link l : valueSetRegistry.getChildren()) {
        DomainInfo domainInfo = l.getDomainInfo();
        String id = l.getId();
        
        Valueset vs = this.valuesetService.findById(id);
        if(vs == null) result.getErrors().add(new IgamtObjectError("VALUESETREPOSITORY", "link.id", "The valueset is missing in the DB.", id + "", "ERROR"));
        else {
          if(vs.getDomainInfo().getScope() == null || !vs.getDomainInfo().getScope().equals(domainInfo.getScope())) result.getErrors().add(new IgamtObjectError("VALUESETREPOSITORY", "link.scope", "The valueset scope info is wrong", id + "", "ERROR"));
          if(vs.getDomainInfo().getVersion() == null || !vs.getDomainInfo().getVersion().equals(domainInfo.getVersion())) result.getErrors().add(new IgamtObjectError("VALUESETREPOSITORY", "link.version", "The valueset version info is wrong", id + "", "ERROR"));
        
          report.addValuesetVerificationResult(this.verifyValueset(vs));
        }
        
      } 
    }
    
    DatatypeRegistry datatypeRegistry = ig.getDatatypeRegistry();
    
    if(datatypeRegistry.getChildren() != null) {
      for(Link l : datatypeRegistry.getChildren()) {
        DomainInfo domainInfo = l.getDomainInfo();
        String id = l.getId();
        
        Datatype dt = this.datatypeService.findById(id);
        
        if(dt == null) result.getErrors().add(new IgamtObjectError("DATATYPEREPOSITORY", "link.id", "The datatype is missing in the DB.", id + "", "ERROR"));
        else {
          if(dt.getDomainInfo().getScope() == null || !dt.getDomainInfo().getScope().equals(domainInfo.getScope())) result.getErrors().add(new IgamtObjectError("DATATYPEREPOSITORY", "link.scope", "The datatype scope info is wrong", id + "", "ERROR"));
          if(dt.getDomainInfo().getVersion() == null || !dt.getDomainInfo().getVersion().equals(domainInfo.getVersion())) result.getErrors().add(new IgamtObjectError("DATATYPEREPOSITORY", "link.version", "The datatype version info is wrong", id + "", "ERROR"));
        
          report.addDatatypeVerificationResult(this.verifyDatatype(dt));
        }
      } 
    }
    
    SegmentRegistry segmentRegistry = ig.getSegmentRegistry();
  
    if(segmentRegistry.getChildren() != null) {
      for(Link l : segmentRegistry.getChildren()) {
        DomainInfo domainInfo = l.getDomainInfo();
        String id = l.getId();
        
        Segment s = this.segmentService.findById(id);
        
        if(s == null) result.getErrors().add(new IgamtObjectError("SEGMENTREPOSITORY", "link.id", "The segment is missing in the DB.", id + "", "ERROR"));
        else {
          if(s.getDomainInfo().getScope() == null || !s.getDomainInfo().getScope().equals(domainInfo.getScope())) result.getErrors().add(new IgamtObjectError("SEGMENTREPOSITORY", "link.scope", "The segment scope info is wrong", id + "", "ERROR"));
          if(s.getDomainInfo().getVersion() == null || !s.getDomainInfo().getVersion().equals(domainInfo.getVersion())) result.getErrors().add(new IgamtObjectError("SEGMENTREPOSITORY", "link.version", "The segment version info is wrong", id + "", "ERROR"));
        
          report.addSegmentVerificationResult(this.verifySegment(s));
        }
        
      } 
    }

    
    ConformanceProfileRegistry conformanceProfileRegistry = ig.getConformanceProfileRegistry();
    if(conformanceProfileRegistry.getChildren() != null) {
      for(Link l : conformanceProfileRegistry.getChildren()) {
        DomainInfo domainInfo = l.getDomainInfo();
        String id = l.getId();
        
        ConformanceProfile cp = this.conformanceProfileService.findById(id);
        
        if(cp == null) result.getErrors().add(new IgamtObjectError("CONFORMANCEPROFILEREPOSITORY", "link.id", "The conformanceprofile is missing in the DB.", id + "", "ERROR"));
        else {
          if(cp.getDomainInfo().getScope() == null || !cp.getDomainInfo().getScope().equals(domainInfo.getScope())) result.getErrors().add(new IgamtObjectError("CONFORMANCEPROFILEREPOSITORY", "link.scope", "The conformanceprofile scope info is wrong", id + "", "ERROR"));
          if(cp.getDomainInfo().getVersion() == null || !cp.getDomainInfo().getVersion().equals(domainInfo.getVersion())) result.getErrors().add(new IgamtObjectError("CONFORMANCEPROFILEREPOSITORY", "link.version", "The conformanceprofile version info is wrong", id + "", "ERROR"));
        
          report.addConformanceProfileVerificationResult(this.verifyConformanceProfile(cp));
        }
        
      } 
    }
    
    report.setIgVerificationResult(result);
    return report;
  }

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.ig.service.VerificationService#verifyIgForCompliance(java.lang.String)
   */
  @Override
  public VerificationReport verifyIgForCompliance(String documentId) {
    parentComplianceMap = new HashMap<String,ComplianceObject>();
    childComplianceMap = new HashMap<String,ComplianceObject>();
    VerificationReport report = new VerificationReport();
    Ig ig = this.igService.findById(documentId);
    IgVerificationResult result = new IgVerificationResult(ig);
    
    ConformanceProfileRegistry conformanceProfileRegistry = ig.getConformanceProfileRegistry();
    
    if(conformanceProfileRegistry.getChildren() != null) {
      for(Link l : conformanceProfileRegistry.getChildren()) {
        String id = l.getId();
        ConformanceProfile cp = this.conformanceProfileService.findById(id);
        if(cp != null) {
          report.addConformanceProfileVerificationResult(this.verifyConformanceProfileForCompliance(cp));
        }
        
      } 
    }
    
    report.setIgVerificationResult(result);
    return report;
  }

}

