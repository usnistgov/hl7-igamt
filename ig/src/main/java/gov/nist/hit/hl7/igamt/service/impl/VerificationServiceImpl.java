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
import java.util.HashSet;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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
import gov.nist.hit.hl7.igamt.common.base.domain.SubStructElement;
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
import gov.nist.hit.hl7.igamt.ig.domain.verification.CPComplianceResult;
import gov.nist.hit.hl7.igamt.ig.domain.verification.CPMetadata;
import gov.nist.hit.hl7.igamt.ig.domain.verification.CPVerificationResult;
import gov.nist.hit.hl7.igamt.ig.domain.verification.ComplianceReport;
import gov.nist.hit.hl7.igamt.ig.domain.verification.DTSegMetadata;
import gov.nist.hit.hl7.igamt.ig.domain.verification.DTSegVerificationResult;
import gov.nist.hit.hl7.igamt.ig.domain.verification.IgVerificationResult;
import gov.nist.hit.hl7.igamt.ig.domain.verification.IgamtObjectError;
import gov.nist.hit.hl7.igamt.ig.domain.verification.VSMetadata;
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
  
  private void checkingStructureForValueset(Valueset valueset, VSVerificationResult result) {
    if(valueset.getCodes() != null) this.checkingCodes(valueset, valueset.getCodes(), result);
  }

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
  
  private void checkingStructureForConformanceProfile(ConformanceProfile conformanceProfile, CPVerificationResult result) {
    Set<StructureElementBinding> sebs = null;
    if(conformanceProfile.getBinding() != null) sebs = conformanceProfile.getBinding().getChildren();
    this.checkingSegmentRefOrGroups(conformanceProfile, conformanceProfile.getChildren(), result, null, null, sebs);
  }
  
  private void checkingStructureForConformanceProfileForCompliance(ConformanceProfile conformanceProfile, CPComplianceResult result) {
    Set<StructureElementBinding> sebs = null;
    if(conformanceProfile.getBinding() != null) sebs = conformanceProfile.getBinding().getChildren();
    this.checkingSegmentRefOrGroupsForCompliance(conformanceProfile, conformanceProfile.getChildren(), result, null, null, sebs);
  }
  
  private void checkingSegmentRefOrGroupsForCompliance(ConformanceProfile conformanceProfile, Set<SegmentRefOrGroup> segmentRefOrGroups, CPComplianceResult result, String positionPath, String path, Set<StructureElementBinding> sebs) {
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

  private void checkingSegmentRefOrGroupForCompliance(ConformanceProfile conformanceProfile, SegmentRefOrGroup srog, CPComplianceResult result, String positionPath, String path, Set<StructureElementBinding> sebs) {
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

  private void chekcingSegmentRefForCompliance(ConformanceProfile conformanceProfile, SegmentRef sr, CPComplianceResult result, String positionPath, String path, Set<StructureElementBinding> sebs) {
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
        
        this.childComplianceMap.put(positionPath, new ComplianceObject(positionPath, path, usage, min, max, null, null));
        this.checkUsageComplianceError(conformanceProfile, conformanceProfile.getId(), conformanceProfile.getType(), new CPMetadata(conformanceProfile), usage, positionPath, path, result);
        this.checkCardinalityComplianceError(conformanceProfile, conformanceProfile.getId(), conformanceProfile.getType(), new CPMetadata(conformanceProfile), min, max, positionPath, path, result);
        
        if(segment.getChildren() != null) {
          
          for(Field field : segment.getChildren() ){
            this.checkFieldForConformanceProfileForCompliance(conformanceProfile, segment, field, positionPath, path, result); 
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
    if(ref == null || ref.getId() == null) result.getErrors().add(new IgamtObjectError("REF_Missing", conformanceProfile.getId(), conformanceProfile.getType(), new CPMetadata(conformanceProfile), "In " + path + ", Ref value is missing", positionPath + "", "FATAL", "Internal"));
    else {
      segment = this.segmentService.findById(ref.getId());
      // DATA Acessability check
      if(segment == null) result.getErrors().add(new IgamtObjectError("Ref_NotAccessable", conformanceProfile.getId(), conformanceProfile.getType(), new CPMetadata(conformanceProfile), "In " + path + ", Ref object is not accesable", positionPath + "", "FATAL", "Internal"));
      else {
        if (path == null) {
          path = segment.getName();
        } else {
          path = path + "." + segment.getName();
        }

        this.checkUsageVerificationError(conformanceProfile, conformanceProfile.getId(), conformanceProfile.getType(), new CPMetadata(conformanceProfile), usage, positionPath, path, result);
        this.checkCardinalityVerificationError(conformanceProfile.getId(), conformanceProfile.getType(), new CPMetadata(conformanceProfile), usage, min, max, positionPath, path, result);
        
        if(segment.getChildren() != null) {
          
          for(Field field : segment.getChildren() ){
            this.checkFieldForConformanceProfileForVerification(conformanceProfile, segment, field, positionPath, path, result); 
          }
        }
      } 
    }
  }

  private void checkFieldForConformanceProfileForVerification(ConformanceProfile conformanceProfile, Segment segment, Field field, String positionPath, String path, CPVerificationResult result) {
    int position = field.getPosition();
    Usage usage = field.getUsage();
    Ref ref = field.getRef();
    positionPath = positionPath + "." + position;
    path = path + "." + position;
    
    
    this.checkUsageVerificationErrorForCP(conformanceProfile, segment.getId(), segment.getType(), new DTSegMetadata(segment), usage, positionPath, path, result);
    
    if (ref != null && ref.getId() != null) {
      Datatype datatype = this.datatypeService.findById(ref.getId());
      
      if (datatype != null) {
        if(datatype instanceof ComplexDatatype) {
          ComplexDatatype cDT = (ComplexDatatype)datatype;
          if(cDT.getComponents() != null && cDT.getComponents().size() > 0) {
            for(Component component : cDT.getComponents() ){
              this.checkComponentForConformanceProfileForVerification(conformanceProfile, cDT, component, positionPath, path, result); 
            }
          }
        }
      }
    }
  }
  
  private void checkFieldForConformanceProfileForCompliance(ConformanceProfile conformanceProfile, Segment segment, Field field, String positionPath, String path, CPComplianceResult result) {
    int position = field.getPosition();
    Usage usage = field.getUsage();
    int min = field.getMin();
    String max = field.getMax();
    Ref ref = field.getRef();
    
    String minLength = field.getMinLength();
    String maxLength = field.getMaxLength();

    positionPath = positionPath + "." + position;
    path = path + "." + position;
    
    this.childComplianceMap.put(positionPath, new ComplianceObject(positionPath, path, usage, min, max, minLength, maxLength));
    this.checkUsageComplianceError(conformanceProfile, segment.getId(), segment.getType(), new DTSegMetadata(segment), usage, positionPath, path, result);
    this.checkCardinalityComplianceError(conformanceProfile, segment.getId(), segment.getType(), new DTSegMetadata(segment), min, max, positionPath, path, result);
    this.checkLengthComplianceError(conformanceProfile, segment.getId(), segment.getType(), new DTSegMetadata(segment), minLength, maxLength, positionPath, path, result);
    
    if (ref != null && ref.getId() != null) {
      Datatype datatype = this.datatypeService.findById(ref.getId());
      
      if (datatype != null) {
        if(datatype instanceof ComplexDatatype) {
          ComplexDatatype cDT = (ComplexDatatype)datatype;
          if(cDT.getComponents() != null && cDT.getComponents().size() > 0) {
            for(Component component : cDT.getComponents() ){
              this.checkComponentForConformanceProfileForCompliance(conformanceProfile, cDT, component, positionPath, path, result); 
            }
          }
        }
      }
    }
  }
  
  private void checkLengthComplianceError(ConformanceProfile conformanceProfile, String target, Type targetType, Object targetMeta, String minLength, String maxLength, String positionPath, String path, CPComplianceResult result) {
    if(maxLength != null && this.isInt(maxLength)) {    
      ComplianceObject complianceParentObject = this.parentComplianceMap.get(positionPath);
      if(complianceParentObject != null && complianceParentObject.getMaxLength() != null && this.isInt(complianceParentObject.getMaxLength())) {
        String parentMaxLength = complianceParentObject.getMaxLength();
        int childMaxLengthInt = Integer.parseInt(maxLength);
        int parentMaxLengthInt = Integer.parseInt(parentMaxLength);
        if(parentMaxLengthInt < childMaxLengthInt) {
          result.getErrors().add(new IgamtObjectError("MAXLength_Compliance", target, targetType, targetMeta, "In " + conformanceProfile.getLabel() + ", " + path + " assigned MaxLength of " + childMaxLengthInt + " is not compliant with MaxLength of " + parentMaxLengthInt, positionPath + "", "WARNING", "User"));
        }
      }
    }
    
    if(minLength != null && this.isInt(minLength)) {    
      ComplianceObject complianceParentObject = this.parentComplianceMap.get(positionPath);
      if(complianceParentObject != null && complianceParentObject.getMinLength() != null && this.isInt(complianceParentObject.getMinLength())) {
        String parentMinLength = complianceParentObject.getMinLength();
        int childMinLengthInt = Integer.parseInt(maxLength);
        int parentMinLengthInt = Integer.parseInt(parentMinLength);
        if(parentMinLengthInt > childMinLengthInt) {
          result.getErrors().add(new IgamtObjectError("MINLength_Compliance", target, targetType, targetMeta, "In " + conformanceProfile.getLabel() + ", " + path + " assigned MinLength of " + childMinLengthInt + " is not compliant with MinLength of " + parentMinLengthInt, positionPath + "", "WARNING", "User"));
        }
      }
    }
  }
  
  private void checkLengthVerificationErorr(String target, Type targetType, Object targetMeta, SubStructElement element, String minLength, String maxLength, String confLength, String positionPath, String path, VerificationResult result) {
    if(this.isLengthAllowedElement(element)) {
      
      if(!this.isNullOrNA(confLength) && (!this.isNullOrNA(minLength) || !this.isNullOrNA(maxLength))) {
        result.getErrors().add(new IgamtObjectError("Length_Duplicated", target, targetType, targetMeta, "In " + path + ", ConfLength and Length are defined at the same time", positionPath + "", "WARNING", "User"));
      }
      if (this.isNullOrNA(confLength) && (this.isNullOrNA(minLength) || this.isNullOrNA(maxLength))) {
        result.getErrors().add(new IgamtObjectError("Length_Missing", target, targetType, targetMeta, "In " + path + ", Primitive datatype should have one of Length and ConfLength.", positionPath + "", "WARNING", "User"));
      } else {
        if (!this.isNullOrNA(minLength)) {
          if(!this.isInt(minLength)) {
            result.getErrors().add(new IgamtObjectError("MinLength_FORMAT", target, targetType, targetMeta, "In " + path + ", Min Length should be number. The current MinLength is " + minLength,  positionPath, "WARNING", "User"));
          }
        }
        
        if (!this.isNullOrNA(maxLength)) {
          if(!this.isIntOrStar(maxLength)) {
            result.getErrors().add(new IgamtObjectError("MaxLength_FORMAT", target, targetType, targetMeta, "In " + path + ", Max Length should be number or '*'. The current MaxLength is " + maxLength,  positionPath, "WARNING", "User"));
          }
        }
        
        if (!this.isNullOrNA(confLength)) {
          if(!confLength.contains("#") && !confLength.contains("=")) {
            result.getErrors().add(new IgamtObjectError("ConfLength_FORMAT", target, targetType, targetMeta, "In " + path + ", Either # or = can used to define truncation. The current ConfLength is " + confLength,  positionPath, "WARNING", "User"));
          }
        }
        
        if (!this.isNullOrNA(minLength) && !this.isNullOrNA(maxLength)) {
          if(!maxLength.equals("*")) {
            if(this.isInt(minLength) && this.isInt(maxLength)) {
              int minLengthInt = Integer.parseInt(minLength);
              int maxLengthInt = Integer.parseInt(maxLength);
              
              if(minLengthInt > maxLengthInt) {
                result.getErrors().add(new IgamtObjectError("Length_Range", target, targetType, targetMeta, "In " + path + ", MIN Length value is bigger than MAX Length. The current MinLength is " + minLength + " and current MaxLength is " + maxLength,  positionPath, "WARNING", "User"));
              }
            }
          }
        }
      }  
    } else {
      if(!this.isNullOrNA(confLength) || (!this.isNullOrNA(minLength) || !this.isNullOrNA(maxLength))) {
        result.getErrors().add(new IgamtObjectError("Length_NotAllowable", target, targetType, targetMeta, path + " does not allow Length or ConfLength, because the datatype is not primitive.", positionPath + "", "WARNING", "User"));
      }
    }
  }

  private void checkComponentForConformanceProfileForVerification(ConformanceProfile conformanceProfile, Datatype datatype, Component component, String positionPath, String path, CPVerificationResult result) {
    int position = component.getPosition();
    Usage usage = component.getUsage();
    Ref ref = component.getRef();
    
    positionPath = positionPath + "." + position;
    path = path + "." + position;
    
    this.checkUsageVerificationErrorForCP(conformanceProfile, datatype.getId(), datatype.getType(), new DTSegMetadata(datatype), usage, positionPath, path, result);
    
    
    if (ref != null && ref.getId() != null) {
      Datatype childDT = this.datatypeService.findById(ref.getId());
      
      if (childDT != null) {
        if(childDT instanceof ComplexDatatype) {
          ComplexDatatype cDT = (ComplexDatatype)datatype;
          if(cDT.getComponents() != null && cDT.getComponents().size() > 0) {
            for(Component childComponent : cDT.getComponents() ){
              this.checkComponentForConformanceProfileForVerification(conformanceProfile, childDT, childComponent, positionPath, path, result); 
            }
          }
        }
      }
    }
  }
  
  private void checkComponentForConformanceProfileForCompliance(ConformanceProfile conformanceProfile, Datatype dt, Component component, String positionPath, String path, CPComplianceResult result) {
    int position = component.getPosition();
    Usage usage = component.getUsage();
    Ref ref = component.getRef();
    String minLength = component.getMinLength();
    String maxLength = component.getMaxLength();

    positionPath = positionPath + "." + position;
    path = path + "." + position;
    
    this.childComplianceMap.put(positionPath, new ComplianceObject(positionPath, path, usage, null, null, minLength, maxLength));
    this.checkUsageComplianceError(conformanceProfile, dt.getId(), dt.getType(), new DTSegMetadata(dt), usage, positionPath, path, result);
    this.checkLengthComplianceError(conformanceProfile, dt.getId(), dt.getType(), new DTSegMetadata(dt), minLength, maxLength, positionPath, path, result);
    
    
    if (ref != null && ref.getId() != null) {
      Datatype datatype = this.datatypeService.findById(ref.getId());
      
      if (datatype != null) {
        if(datatype instanceof ComplexDatatype) {
          ComplexDatatype cDT = (ComplexDatatype)datatype;
          if(cDT.getComponents() != null && cDT.getComponents().size() > 0) {
            for(Component childComponent : cDT.getComponents() ){
              this.checkComponentForConformanceProfileForCompliance(conformanceProfile, cDT, childComponent, positionPath, path, result); 
            }
          }
        }
      }
    }
  }

  private void checkCardinalityComplianceError(ConformanceProfile conformanceProfile, String target, Type targetType, Object targetMeta, int min, String max, String positionPath, String path, CPComplianceResult result) {
    ComplianceObject complianceParentObject = this.parentComplianceMap.get(positionPath);
    if(max != null) {
      if(this.isInt(max)) {
        if(complianceParentObject != null && complianceParentObject.getMax() != null && this.isInt(complianceParentObject.getMax())) {
          
          int childMaxInt = Integer.parseInt(max);
          int parentMaxInt = Integer.parseInt(complianceParentObject.getMax());
          
          if(parentMaxInt < childMaxInt) {
            result.getErrors().add(new IgamtObjectError("MAX_Cardinality_Compliance", target, targetType, targetMeta, "In " + conformanceProfile.getLabel() + ", " + path + " assigned Max cardinality of " + childMaxInt + " is not compliant with Max cardinality of " + parentMaxInt, positionPath + "", "WARNING", "User"));
          }
        }
      } 
    }
    if(complianceParentObject != null && complianceParentObject.getMin() != null && complianceParentObject.getMin()  > min) {
      result.getErrors().add(new IgamtObjectError("MIN_Cardinality_Compliance", target, targetType, targetMeta, "In " + conformanceProfile.getLabel() + ", " + path + " assigned Min cardinality of " + min + " is not compliant with Min cardinality of " + complianceParentObject.getMin(), positionPath + "", "WARNING", "User"));
    }
  }
  
  private void checkCardinalityVerificationError(String target, Type targetType, Object targetMeta, Usage usage, int min, String max, String positionPath, String path, VerificationResult result) {
    if(max == null) {
      result.getErrors().add(new IgamtObjectError("Cardinality_MISSING", target, targetType, targetMeta, "In " + path + ", Cardinality is missing", positionPath + "", "ERROR", "User"));
    } else {
      
      if(this.isIntOrStar(max)) {
        if(this.isInt(max)) {
          int maxInt = Integer.parseInt(max);
          if (min > maxInt) {
            result.getErrors().add(new IgamtObjectError("Cardinality_Range", target, targetType, targetMeta, "In " + path + ", MIN Cardinality value is bigger than MAX Cardinality. Current MinCardinality is " + min + " and Current MaxCardinality is " + max, positionPath + "", "ERROR", "User"));
          } else {
            if(usage != null && usage.equals(Usage.X) && !max.equals("0")) {
              result.getErrors().add(new IgamtObjectError("MAX_Cardinality_UsageX", target, targetType, targetMeta, "In " + path + ", MAX cardinality value should be 0, if the USAGE is X. Current MaxCardinality is " + max, positionPath + "", "WARNING", "User"));
            }
            
            if(usage != null && usage.equals(Usage.R) && min < 1) {
              result.getErrors().add(new IgamtObjectError("MIN_Cardinality_UsageR", target, targetType, targetMeta, "In " + path + ", MIN cardinality value should be bigger than 0, if the USAGE is R.", positionPath + "", "WARNING", "User"));
            }
            
            if(usage != null && !usage.equals(Usage.R) && min != 0) {
              result.getErrors().add(new IgamtObjectError("MIN_Cardinality_UsageNotR", target, targetType, targetMeta, "In " + path + ", MIN cardinality value should be 0, if the USAGE is not R. Current usage is " + usage + " and current MinCardinality is " + min, positionPath + "", "WARNING", "User"));
            }
          }
        }
      } else {
        result.getErrors().add(new IgamtObjectError("MAX_Cardinality_Format", target, targetType, targetMeta, "In " + path + ", MAX cardinality value should be number or '*'.  Current MaxCardinality is " + max, positionPath + "", "ERROR", "User"));
      }
    }
  }

  private void checkUsageComplianceError(ConformanceProfile conformanceProfile, String target, Type targetType, Object targetMeta, Usage usage, String positionPath, String path, CPComplianceResult result) {
    if (usage != null) {
      if (conformanceProfile != null && conformanceProfile.getProfileType() != null) {
        ComplianceObject complianceParentObject = this.parentComplianceMap.get(positionPath);
        if(complianceParentObject != null && complianceParentObject.getUsage() != null) {
          Usage parentUsage = complianceParentObject.getUsage();
          
          if (parentUsage.equals(Usage.R)) {
            if (!usage.equals(Usage.R)) {
              result.getErrors().add(new IgamtObjectError("Usage_Compliance", target, targetType, targetMeta, "In " + conformanceProfile.getLabel() + ", " + path + " assigned usage of " + usage + " is not compliant with parent usage of " + parentUsage, positionPath + "", "WARNING", "User"));
            }
          } else if (parentUsage.equals(Usage.X)) {
            if (!usage.equals(Usage.X)) {
              result.getErrors().add(new IgamtObjectError("Usage_Compliance", target, targetType, targetMeta, "In " + conformanceProfile.getLabel() + ", " + path + " assigned usage of " + usage + " is not compliant with parent usage of " + parentUsage, positionPath + "", "WARNING", "User"));
            }
          } else if (parentUsage.equals(Usage.RE)) {
            if (!usage.equals(Usage.R) && !usage.equals(Usage.RE)) {
              result.getErrors().add(new IgamtObjectError("Usage_Compliance", target, targetType, targetMeta, "In " + conformanceProfile.getLabel() + ", " + path + " assigned usage of " + usage + " is not compliant with parent usage of " + parentUsage, positionPath + "", "WARNING", "User"));
            }
          } else if (parentUsage.equals(Usage.W)) {
            if (!usage.equals(Usage.W) && !usage.equals(Usage.X)) {
              result.getErrors().add(new IgamtObjectError("Usage_Compliance", target, targetType, targetMeta, "In " + conformanceProfile.getLabel() + ", " + path + " assigned usage of " + usage + " is not compliant with parent usage of " + parentUsage, positionPath + "", "WARNING", "User"));
            }
          } else if (parentUsage.equals(Usage.C)) {
            if (!usage.equals(Usage.R) && !usage.equals(Usage.RE) && !usage.equals(Usage.C) && !usage.equals(Usage.CAB) && !usage.equals(Usage.X)) {
              result.getErrors().add(new IgamtObjectError("Usage_Compliance", target, targetType, targetMeta, "In " + conformanceProfile.getLabel() + ", " + path + " assigned usage of " + usage + " is not compliant with parent usage of " + parentUsage, positionPath + "", "WARNING", "User"));
            }
          } else if (parentUsage.equals(Usage.CAB)) {
            if (!usage.equals(Usage.R) && !usage.equals(Usage.RE) && !usage.equals(Usage.CAB) && !usage.equals(Usage.X)) {
              result.getErrors().add(new IgamtObjectError("Usage_Compliance", target, targetType, targetMeta, "In " + conformanceProfile.getLabel() + ", " + path + " assigned usage of " + usage + " is not compliant with parent usage of " + parentUsage, positionPath + "", "WARNING", "User"));
            }
          } else if (parentUsage.equals(Usage.O)) {
            if (!usage.equals(Usage.R) && !usage.equals(Usage.RE) && !usage.equals(Usage.C) && !usage.equals(Usage.CAB) && !usage.equals(Usage.O) && !usage.equals(Usage.X)) {
              result.getErrors().add(new IgamtObjectError("Usage_Compliance", target, targetType, targetMeta, "In " + conformanceProfile.getLabel() + ", " + path + " assigned usage of " + usage + " is not compliant with parent usage of " + parentUsage, positionPath + "", "WARNING", "User"));
            }
          } else if (parentUsage.equals(Usage.B)) {
            if (!usage.equals(Usage.R) && !usage.equals(Usage.RE) && !usage.equals(Usage.CAB) && !usage.equals(Usage.O) && !usage.equals(Usage.X) && !usage.equals(Usage.B)) {
              result.getErrors().add(new IgamtObjectError("Usage_Compliance", target, targetType, targetMeta, "In " + conformanceProfile.getLabel() + ", " + path + " assigned usage of " + usage + " is not compliant with parent usage of " + parentUsage, positionPath + "", "WARNING", "User"));
            }
          }
        }
      }
    }
  }
  
  private void checkUsageVerificationError(ConformanceProfile conformanceProfile, String target, Type targetType, Object targetMeta, Usage usage, String positionPath, String path, VerificationResult result) {
    //String code, String target, String targetType, String description,String location, String severity
    if (usage == null) {
      result.getErrors().add(new IgamtObjectError("Usage_MISSING", target, targetType, targetMeta, "In " + path + ", Usage is missing", positionPath + "", "FATAL", "User"));
    }
  }
  
  private void checkUsageVerificationErrorForCP(ConformanceProfile conformanceProfile, String target, Type targetType, Object targetMeta, Usage usage, String positionPath, String path, VerificationResult result) {
    if (usage != null && conformanceProfile != null && conformanceProfile.getProfileType() != null) {
      if (conformanceProfile.getProfileType().equals(ProfileType.HL7)) {
        if(!(usage.equals(Usage.R) || usage.equals(Usage.RE) || usage.equals(Usage.C) || usage.equals(Usage.CAB) || usage.equals(Usage.O) || usage.equals(Usage.X) || usage.equals(Usage.B) || usage.equals(Usage.W))) {
          result.getErrors().add(new IgamtObjectError("Usage_Value_Base", target, targetType, targetMeta, "In " + path + ", Usage should be one of R/RE/C/C(a/b)/O/X/B/W, " + "Current Usage is " + usage, positionPath + "", "WARNING", "User"));
        }
      } else if (conformanceProfile.getProfileType().equals(ProfileType.Constrainable)) {
        if(!(usage.equals(Usage.R) || usage.equals(Usage.RE) || usage.equals(Usage.C) || usage.equals(Usage.CAB) || usage.equals(Usage.O) || usage.equals(Usage.X) || usage.equals(Usage.B))) {
          result.getErrors().add(new IgamtObjectError("Usage_Value_Constraintable", target, targetType, targetMeta, "In " + path + ", Usage should be one of R/RE/C/C(a/b)/O/X/B, " + "Current Usage is " + usage, positionPath + "", "WARNING", "User"));
        }
      } else if (conformanceProfile.getProfileType().equals(ProfileType.Implementation)) {
        if(!(usage.equals(Usage.R) || usage.equals(Usage.RE) || usage.equals(Usage.CAB) || usage.equals(Usage.X))) {
          result.getErrors().add(new IgamtObjectError("Usage_Value_Implementable", target, targetType, targetMeta, "In " + path + ", Usage should be one of R/RE/C(a/b)/X, " + "Current Usage is " + usage, positionPath + "", "WARNING", "User"));
        }
      } else {
        if(!(usage.equals(Usage.R) || usage.equals(Usage.RE) || usage.equals(Usage.C) || usage.equals(Usage.CAB) || usage.equals(Usage.O) || usage.equals(Usage.X) || usage.equals(Usage.B) || usage.equals(Usage.W))) {
          result.getErrors().add(new IgamtObjectError("Usage_Value_Any", target, targetType, targetMeta, "In " + path + ", Usage must be one of R/RE/C/C(a/b)/O/X/B/W, " + "Current Usage is " + usage, positionPath + "", "ERROR", "User"));
        }
      }
    }
  }


  private void checkingGroupForCompliance(ConformanceProfile conformanceProfile, Group group, CPComplianceResult result, String positionPath, String path, Set<StructureElementBinding> sebs) {
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
      
      this.childComplianceMap.put(positionPath, new ComplianceObject(positionPath, path, usage, min, max, null, null));
      
      this.checkUsageComplianceError(conformanceProfile, conformanceProfile.getId(), conformanceProfile.getType(), new CPMetadata(conformanceProfile), usage, positionPath, path, result);
      this.checkCardinalityComplianceError(conformanceProfile, conformanceProfile.getId(), conformanceProfile.getType(), new CPMetadata(conformanceProfile), min, max, positionPath, path, result);
      
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
      result.getErrors().add(new IgamtObjectError("Name_Missing", conformanceProfile.getId(), conformanceProfile.getType(), new CPMetadata(conformanceProfile), "name is missing", positionPath + "", "ERROR", "User"));
    } else {
      if (path == null) path = name;
      else path = path + "." + name;
      
      this.childComplianceMap.put(positionPath, new ComplianceObject(positionPath, path, usage, min, max, null, null));
      
      this.checkUsageVerificationError(conformanceProfile, conformanceProfile.getId(), conformanceProfile.getType(), new CPMetadata(conformanceProfile), usage, positionPath, path, result);
      this.checkCardinalityVerificationError(conformanceProfile.getId(), conformanceProfile.getType(), new CPMetadata(conformanceProfile), usage, min, max, positionPath, path, result);
      
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
      result.getErrors().add(new IgamtObjectError("Field_Missing", segment.getId(), segment.getType(), new DTSegMetadata(segment), "Field is missing for Segment.", null, "FATAL", "User"));
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
      result.getErrors().add(new IgamtObjectError("Component_Missing", cDt.getId(), cDt.getType(), new DTSegMetadata(cDt), "Component is missing for Complex Datatype", null, "FATAL", "User"));
    } else {
      components.forEach(c -> this.checkingComponent(cDt, c, result));
    }
  }
  
  private void checkingCode(Valueset valueset, Code c, VSVerificationResult result) {
    String value = c.getValue();
    String description = c.getDescription();
    String codeSystem = c.getCodeSystem();
    CodeUsage usage = c.getUsage();
    
    Extensibility extensibility = valueset.getExtensibility();
    
    if(!this.isNotNullNotEmpty(value)) result.getErrors().add(new IgamtObjectError("Code_Value_Missing", c.getId(), Type.VALUESET, new VSMetadata(valueset), "The value is missing.", null, "ERROR", "User"));
    if(description == null) result.getErrors().add(new IgamtObjectError("Code_Desc_Missing", c.getId(), Type.VALUESET, new VSMetadata(valueset), "In code: " + value + " , the description is missing.", null, "ERROR", "User"));
    if(!this.isNotNullNotEmpty(codeSystem)) result.getErrors().add(new IgamtObjectError("Code_Codesys_Missing", c.getId(), Type.VALUESET, new VSMetadata(valueset), "In code: " + value + ", the codesys is missing.", null, "ERROR", "User"));
    if(usage == null) {
      result.getErrors().add(new IgamtObjectError("Code_Usage_Missing", valueset.getId(), Type.VALUESET, new VSMetadata(valueset), "In code:" + value + ", the USAGE is missing", c.getValue(), "ERROR", "User"));
    } else {
      if(extensibility != null && extensibility.equals(Extensibility.Closed)) {
        if(usage == null || usage.equals(CodeUsage.P)) {
          result.getErrors().add(new IgamtObjectError("Code_Usage_Value_ClosedValueset", valueset.getId(), Type.VALUESET, new VSMetadata(valueset), "In code: " + value + ", the Usage must be one of R/E, but current Usage is " + usage, c.getValue(), "WARNING", "User"));
        }
      }
    }
    
    valueset.getCodes().forEach(otherC -> {
      if(!otherC.getId().equals(c.getId())){
        if ((otherC.getValue() + "-" + otherC.getCodeSystem()).equals(c.getValue() + "-" + c.getCodeSystem())) result.getErrors().add(new IgamtObjectError("Value-Codesys_Duplicated", valueset.getId(), Type.VALUESET, new VSMetadata(valueset), "the combination of value (" + c.getValue() + ") and codesys (" + c.getCodeSystem() + ") are duplicated.", c.getValue(), "ERROR", "User"));
      }
    });
  }

  private void checkingComponent(ComplexDatatype cDt, Component c, DTSegVerificationResult result) {
    String name = c.getName();
    int position = c.getPosition();
    Ref ref = c.getRef();
    Type type = c.getType();
    Usage usage = c.getUsage();
    
    String confLength = c.getConfLength();
    String maxLength = c.getMaxLength();
    String minLength = c.getMinLength();

    if(position == 0) {
      result.getErrors().add(new IgamtObjectError("Position_Missing", cDt.getId(), cDt.getType(), new DTSegMetadata(cDt), "Position is missing", position + "", "FATAL", "Internal"));
    } else {
      String path = cDt.getLabel() + "." + position;
      if(!this.isNotNullNotEmpty(name)) result.getErrors().add(new IgamtObjectError("In " + path + ", Name_Missing", cDt.getId(), cDt.getType(), new DTSegMetadata(cDt), "name is missing", position + "", "FATAL", "User"));
      if(ref == null || ref.getId() == null) result.getErrors().add(new IgamtObjectError("REF_Missing", cDt.getId(), cDt.getType(), new DTSegMetadata(cDt), "In " + path + ", Ref value is missing.", position + "", "FATAL", "User"));
      if(type == null || !type.equals(Type.COMPONENT)) result.getErrors().add(new IgamtObjectError("Type_Missing", cDt.getId(), cDt.getType(), new DTSegMetadata(cDt), "In " + path + ", the Type is missing", position + "", "FATAL", "Internal"));

      this.checkUsageVerificationError(null, cDt.getId(), cDt.getType(), new DTSegMetadata(cDt), usage, position + "", cDt.getLabel() + "." + position, result);
      this.checkLengthVerificationErorr(cDt.getId(), cDt.getType(), new DTSegMetadata(cDt), c, minLength, maxLength, confLength, "", cDt.getLabel() + "." + position, result);
      
      cDt.getComponents().forEach(otherC -> {
        if(!otherC.getId().equals(c.getId())){
          if (otherC.getPosition() == position) result.getErrors().add(new IgamtObjectError("Position_Dupilicated", cDt.getId(), cDt.getType(), new DTSegMetadata(cDt), "The position:" + position + " is duplicated.", position + "", "FATAL", "Internal"));
          if (otherC.getName().equals(c.getName())) result.getErrors().add(new IgamtObjectError("Name_Duplicated", cDt.getId(), cDt.getType(), new DTSegMetadata(cDt), "name is duplicated for " + position + " and " + otherC.getPosition(), position + "", "ERROR", "User"));
        }
      });
      
      if(ref != null && ref.getId() != null) {
        Datatype childDt = this.datatypeService.findById(ref.getId());
        if(childDt == null) result.getErrors().add(new IgamtObjectError("Ref_NotAccessable", cDt.getId(), cDt.getType(), new DTSegMetadata(cDt), "In " + path + " Ref object is not accesable.", position + "", "ERROR", "Internal"));
              
        if(this.isPrimitiveDatatype(childDt)) {
          
        } else {
          if(this.isNotNullNotEmpty(c.getConstantValue())) result.getErrors().add(new IgamtObjectError("Constant_NOTAllowed", cDt.getId(), cDt.getType(), new DTSegMetadata(cDt), "In " + path + " , Constant value is not allowed", position + "", "ERROR", "User"));
        }
        
        if (this.isValueSetOrSingleCodeAllowedComponent(c, childDt)) {
          StructureElementBinding childBinding = this.findBindingById(c.getId(), cDt.getBinding());
          if(childBinding != null){
            Set<ValuesetBinding> valuesetBindings = childBinding.getValuesetBindings();
            ExternalSingleCode externalSingleCode = childBinding.getExternalSingleCode();
            InternalSingleCode internalSingleCode = childBinding.getInternalSingleCode();
            
            if(valuesetBindings != null) this.checkingValueSetBindings(cDt, valuesetBindings, result, position, path);
            if(externalSingleCode != null) this.checkingExternalSingleCode(cDt, externalSingleCode, result, position, path);
            if(internalSingleCode != null) this.checkingInternalSingleCode(cDt, internalSingleCode, result, position, path);
          }
          
        }else {
          
        }
      }
    }
    
  }
  
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
  

    if(position == 0) {
      result.getErrors().add(new IgamtObjectError("Position_Missing", segment.getId(), segment.getType(), new DTSegMetadata(segment), "Position is missing", position + "", "FATAL", "Internal"));
    } else {
      String path = segment.getLabel() + "-" + position;
      if(!this.isNotNullNotEmpty(name)) result.getErrors().add(new IgamtObjectError("In " + path + ", Name_Missing", segment.getId(), segment.getType(), new DTSegMetadata(segment), "name is missing", position + "", "FATAL", "User"));
      if(ref == null || ref.getId() == null) result.getErrors().add(new IgamtObjectError("REF_Missing", segment.getId(), segment.getType(), new DTSegMetadata(segment), "In " + path + ", Ref value is missing.", position + "", "FATAL", "User"));
      if(type == null || !type.equals(Type.FIELD)) result.getErrors().add(new IgamtObjectError("Type_Missing", segment.getId(), segment.getType(), new DTSegMetadata(segment), "In " + path + ", the Type is missing", position + "", "FATAL", "Internal"));
      
      this.checkUsageVerificationError(null, segment.getId(), segment.getType(), new DTSegMetadata(segment), usage, position + "", segment.getLabel() + "-" + position, result);
      this.checkCardinalityVerificationError(segment.getId(), segment.getType(), new DTSegMetadata(segment), usage, min, max, position + "", segment.getLabel() + "-" + position, result);
      this.checkLengthVerificationErorr(segment.getId(), segment.getType(), new DTSegMetadata(segment), f, minLength, maxLength, confLength, position + "", segment.getLabel() + "-" + position, result);
      
      segment.getChildren().forEach(otherF -> {
        if(!otherF.getId().equals(f.getId())){
          if (otherF.getPosition() == position) result.getErrors().add(new IgamtObjectError("Position_Dupilicated", segment.getId(), segment.getType(), new DTSegMetadata(segment), "The position:" + position + " is duplicated.", position + "", "FATAL", "Internal"));
          if (otherF.getName().equals(f.getName())) result.getErrors().add(new IgamtObjectError("Name_Duplicated", segment.getId(), segment.getType(), new DTSegMetadata(segment), "name is duplicated for " + position + " and " + otherF.getPosition(), position + "", "ERROR", "User"));
        }
      });
      
      if(ref != null && ref.getId() != null) {
        Datatype childDt = this.datatypeService.findById(ref.getId());
        if(childDt == null) result.getErrors().add(new IgamtObjectError("Ref_NotAccessable", segment.getId(), segment.getType(), new DTSegMetadata(segment), "In " + path + " Ref object is not accesable.", position + "", "ERROR", "Internal"));

        if(this.isPrimitiveDatatype(childDt)) {
          
        } else {
          if(this.isNotNullNotEmpty(f.getConstantValue())) result.getErrors().add(new IgamtObjectError("Constant_NOTAllowed", segment.getId(), segment.getType(), new DTSegMetadata(segment), "In " + path + " , Constant value is not allowed", position + "", "ERROR", "User"));
        }
        
        if (this.isValueSetOrSingleCodeAllowedField(f, childDt)) {
          StructureElementBinding childBinding = this.findBindingById(f.getId(), segment.getBinding());
          if(childBinding != null){
            Set<ValuesetBinding> valuesetBindings = childBinding.getValuesetBindings();
            ExternalSingleCode externalSingleCode = childBinding.getExternalSingleCode();
            InternalSingleCode internalSingleCode = childBinding.getInternalSingleCode();
            
            if(valuesetBindings != null) this.checkingValueSetBindings(segment, valuesetBindings, result, position, path);
            if(externalSingleCode != null) this.checkingExternalSingleCode(segment, externalSingleCode, result, position, path);
            if(internalSingleCode != null) this.checkingInternalSingleCode(segment, internalSingleCode, result, position, path);
          }
          
        }else {
          
        }
      }
    }
  }

  private void checkingInternalSingleCode(ComplexDatatype cDt, InternalSingleCode internalSingleCode, DTSegVerificationResult result, int position, String path) {
    String code = internalSingleCode.getCode();
    String codeSystem = internalSingleCode.getCodeSystem();
    String valueSetId = internalSingleCode.getValueSetId();
    
    if(!this.isNotNullNotEmpty(code))       result.getErrors().add(new IgamtObjectError("SingleCode_Code_Missing", cDt.getId(), cDt.getType(), new DTSegMetadata(cDt), "In " + path + ", Code is missing for SingleCode.", position + "", "ERROR", "User"));
    if(!this.isNotNullNotEmpty(codeSystem)) result.getErrors().add(new IgamtObjectError("SingleCode_CodeSys_Missing", cDt.getId(), cDt.getType(), new DTSegMetadata(cDt), "In " + path + ", CodeSystem is missing for SingleCode.", position + "", "ERROR", "User"));
    if(!this.isNotNullNotEmpty(valueSetId)) result.getErrors().add(new IgamtObjectError("SingleCode_Valueset_Missing", cDt.getId(), cDt.getType(), new DTSegMetadata(cDt), "In " + path + ", ValueSet is missing for SingleCode.", position + "", "ERROR", "User"));
    
    if (valueSetId != null) {
      if(this.valuesetService.findById(valueSetId) == null) result.getErrors().add(new IgamtObjectError("SingleCode_Valueset_NotAccessable", cDt.getId(), cDt.getType(), new DTSegMetadata(cDt), "In " + path + ", ValueSet is not accessable for SingleCode.", position + "", "ERROR", "Internal"));
    }
  }

  private void checkingInternalSingleCode(Segment segment, InternalSingleCode internalSingleCode, DTSegVerificationResult result, int position, String path) {
    String code = internalSingleCode.getCode();
    String codeSystem = internalSingleCode.getCodeSystem();
    String valueSetId = internalSingleCode.getValueSetId();
    
    if(!this.isNotNullNotEmpty(code))       result.getErrors().add(new IgamtObjectError("SingleCode_Code_Missing", segment.getId(), segment.getType(), new DTSegMetadata(segment), "In " + path + ", Code is missing for SingleCode.", position + "", "ERROR", "User"));
    if(!this.isNotNullNotEmpty(codeSystem)) result.getErrors().add(new IgamtObjectError("SingleCode_CodeSys_Missing", segment.getId(), segment.getType(), new DTSegMetadata(segment), "In " + path + ", CodeSystem is missing for SingleCode.", position + "", "ERROR", "User"));
    if(!this.isNotNullNotEmpty(valueSetId)) result.getErrors().add(new IgamtObjectError("SingleCode_Valueset_Missing", segment.getId(), segment.getType(), new DTSegMetadata(segment), "In " + path + ", ValueSet is missing for SingleCode.", position + "", "ERROR", "User"));
    
    if (valueSetId != null) {
      if(this.valuesetService.findById(valueSetId) == null) result.getErrors().add(new IgamtObjectError("SingleCode_Valueset_NotAccessable", segment.getId(), segment.getType(), new DTSegMetadata(segment), "In " + path + ", ValueSet is not accessable for SingleCode.", position + "", "ERROR", "Internal"));
    }
  }

  private void checkingExternalSingleCode(ComplexDatatype cDt, ExternalSingleCode externalSingleCode, DTSegVerificationResult result, int position, String path) {
    String value = externalSingleCode.getValue();
    String codeSystem = externalSingleCode.getCodeSystem();
    
    if(!this.isNotNullNotEmpty(value))      result.getErrors().add(new IgamtObjectError("SingleCode_Value_Missing", cDt.getId(), cDt.getType(), new DTSegMetadata(cDt), "In " + path + ", Value is missing for SingleCode.", position + "", "ERROR", "User"));
    if(!this.isNotNullNotEmpty(codeSystem)) result.getErrors().add(new IgamtObjectError("SingleCode_CodeSys_Missing", cDt.getId(), cDt.getType(), new DTSegMetadata(cDt), "In " + path + ", CodeSystem is missing for SingleCode.", position + "", "ERROR", "User"));
  }

  private void checkingExternalSingleCode(Segment segment, ExternalSingleCode externalSingleCode, DTSegVerificationResult result, int position, String path) {
    String value = externalSingleCode.getValue();
    String codeSystem = externalSingleCode.getCodeSystem();
    
    if(!this.isNotNullNotEmpty(value))      result.getErrors().add(new IgamtObjectError("SingleCode_Value_Missing", segment.getId(), segment.getType(), new DTSegMetadata(segment), "In " + path + ", Value is missing for SingleCode.", position + "", "ERROR", "User"));
    if(!this.isNotNullNotEmpty(codeSystem)) result.getErrors().add(new IgamtObjectError("SingleCode_CodeSys_Missing", segment.getId(), segment.getType(), new DTSegMetadata(segment), "In " + path + ", CodeSystem is missing for SingleCode.", position + "", "ERROR", "User"));
  }
  
  private void checkingValueSetBindings(ComplexDatatype cDt, Set<ValuesetBinding> valuesetBindings, DTSegVerificationResult result, int position, String path) {
    for (ValuesetBinding vb : valuesetBindings) {
      for(String vsId : vb.getValueSets()){
        if(vsId == null) {
          result.getErrors().add(new IgamtObjectError("ValueSetBinding_VSID_Missing", cDt.getId(), cDt.getType(), new DTSegMetadata(cDt), "In " + path + ", Valueset Id is missing for ValueSet Binding.", position + "", "ERROR", "User"));   
        }else {
          if(this.valuesetService.findById(vsId) == null) result.getErrors().add(new IgamtObjectError("ValueSetBinding_VS_NotAccessable",cDt.getId(), cDt.getType(), new DTSegMetadata(cDt), "In " + path + ", Valueset is not accessable for ValueSet Binding.", position + "", "ERROR", "Internal"));   
        }
      }
    }
  }
  
  private void checkingValueSetBindings(Segment segment, Set<ValuesetBinding> valuesetBindings, DTSegVerificationResult result, int position, String path) {
    for (ValuesetBinding vb : valuesetBindings) {
      for(String vsId : vb.getValueSets()){
        if(vsId == null) {
          result.getErrors().add(new IgamtObjectError("ValueSetBinding_VSID_Missing", segment.getId(), segment.getType(), new DTSegMetadata(segment), "In " + path + ", Valueset Id is missing for ValueSet Binding.", position + "", "ERROR", "User"));   
        }else {
          if(this.valuesetService.findById(vsId) == null) result.getErrors().add(new IgamtObjectError("ValueSetBinding_VS_NotAccessable",segment.getId(), segment.getType(), new DTSegMetadata(segment), "In " + path + ", Valueset is not accessable for ValueSet Binding.", position + "", "ERROR", "Internal"));   
        }
      }
    }
  }

  private StructureElementBinding findBindingById(String id, ResourceBinding binding) {
    if (binding != null && binding.getChildren() != null) {
      for (StructureElementBinding seb : binding.getChildren()) {
        if(seb.getElementId().equals(id)) return seb;
      }
    }
    return null;
  }

  private boolean isValueSetOrSingleCodeAllowedComponent(Component c, Datatype childDt) {
    // TODO Auto-generated method stub
    return true;
  }
  
  private boolean isValueSetOrSingleCodeAllowedField(Field f, Datatype childDt) {
    // TODO Auto-generated method stub
    return true;
  }

  private boolean isNullOrNA(String s) {
    if(s == null) return true;
    if(s.equals("NA")) return true;
    return false;
  }

  private boolean isLengthAllowedElement(SubStructElement e) {
    if (e != null) {
      Ref ref = e.getRef();
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
 
  private void checkingMetadataForValueset(Valueset valueset, VSVerificationResult result) {
    if (valueset == null) {
      
    } else {
      String bId = valueset.getBindingIdentifier();
      String name = valueset.getName();
      String description = valueset.getDescription();
      Extensibility extensibility = valueset.getExtensibility();
      Stability stability = valueset.getStability();
      ContentDefinition contentDefinition = valueset.getContentDefinition();
      DomainInfo domainInfo = valueset.getDomainInfo();
      
      if (!this.isNotNullNotEmptyNotWhiteSpaceOnly(bId)) result.getErrors().add(new IgamtObjectError("BindingId_Missing", valueset.getId(), valueset.getType(), new VSMetadata(valueset), "Valueset binding Identifier is missing", null, "FATAL", "User"));
      if (name == null) result.getErrors().add(new IgamtObjectError("Name_Missing", valueset.getId(), valueset.getType(), new VSMetadata(valueset), "name is missing", null, "FATAL", "User"));
//      if (description == null) result.getErrors().add(new IgamtObjectError("Desc_Missing", null, null, "Description is missing", null, "WARNING"));
      
      if (extensibility == null) result.getErrors().add(new IgamtObjectError("Extensibility_Missing", valueset.getId(), valueset.getType(), new VSMetadata(valueset), "Extensibility is missing", null, "WARNING", "User"));
      if (stability == null) result.getErrors().add(new IgamtObjectError("Stability_Missing", valueset.getId(), valueset.getType(), new VSMetadata(valueset), "Stability is missing", null, "WARNING", "User"));
      if (contentDefinition == null) result.getErrors().add(new IgamtObjectError("ContentDefinition_Missing", valueset.getId(), valueset.getType(), new VSMetadata(valueset), "ContentDefinition is missing", null, "WARNING", "User"));
      
      if(domainInfo == null || domainInfo.getScope() == null) {
        result.getErrors().add(new IgamtObjectError("Scope_Missing", valueset.getId(), valueset.getType(), new VSMetadata(valueset), "Scope is missing", null, "ERROR", "Internal"));
      }
      if(domainInfo == null || domainInfo.getVersion() == null) {
        result.getErrors().add(new IgamtObjectError("Version_Missing", valueset.getId(), valueset.getType(), new VSMetadata(valueset), "Version is missing", null, "WARNING", "Internal"));
      }
      
      if(valueset.getCodes() != null && valueset.getCodes().size() > 500) {
        result.getErrors().add(new IgamtObjectError("CodeSet_Size_Exceeded", valueset.getId(), valueset.getType(), new VSMetadata(valueset), "IGAMT imposed code set limit (500) exceeded.", null, "WARNING", "Internal"));
      }
    }
  }
  
  private void checkingMetadataForDatatype(Datatype datatype, DTSegVerificationResult result) {
    if (datatype == null) {
    } else {
      String name = datatype.getName();
      String ext = datatype.getExt();
      String description = datatype.getDescription();
      DomainInfo domainInfo = datatype.getDomainInfo();
      
      if (!this.isNotNullNotEmptyNotWhiteSpaceOnly(name)) {
        result.getErrors().add(new IgamtObjectError("Name_Missing", datatype.getId(), datatype.getType(), new DTSegMetadata(datatype), "name is missing", null, "FATAL", "User"));
      }
      if (description == null) result.getErrors().add(new IgamtObjectError("Desc_Missing", datatype.getId(), datatype.getType(), new DTSegMetadata(datatype), "Description is missing", null, "WARNING", "User"));
      
      if(domainInfo == null || domainInfo.getScope() == null) {
        result.getErrors().add(new IgamtObjectError("Scope_Missing", datatype.getId(), datatype.getType(), new DTSegMetadata(datatype), "Scope is missing", null, "ERROR", "Internal"));
      }
      if(domainInfo == null || domainInfo.getVersion() == null) {
        result.getErrors().add(new IgamtObjectError("Version_Missing", datatype.getId(), datatype.getType(), new DTSegMetadata(datatype), "Version is missing", null, "WARNING", "Internal"));
      }
      
      if (domainInfo != null && domainInfo.getScope() != null && domainInfo.getScope().equals(Scope.USER) && !this.isNotNullNotEmptyNotWhiteSpaceOnly(ext)) {
        result.getErrors().add(new IgamtObjectError("EXT_Missing", datatype.getId(), datatype.getType(), new DTSegMetadata(datatype), "EXTENSION is missing, but scope is users", null, "FATAL", "User"));
      } 

      if(ext != null) {
        String regex = "^[a-zA-Z0-9]+$";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(ext);       
        
        if(!matcher.matches() || ext.length() > 4) {
          result.getErrors().add(new IgamtObjectError("EXT_Format", datatype.getId(), datatype.getType(), new DTSegMetadata(datatype), "User extension should start with a letter and be within 4 characters long.", null, "WARNING", "User"));
        }
      }
    }
  }
  
  private void checkingMetadataForSegment(Segment segment, DTSegVerificationResult result) {
    if (segment == null) {
      
    } else {
      String name = segment.getName();
      String ext = segment.getExt();
      String description = segment.getDescription();
      DomainInfo domainInfo = segment.getDomainInfo();
      
      if (!this.isNotNullNotEmptyNotWhiteSpaceOnly(name)) {
        result.getErrors().add(new IgamtObjectError("Name_Missing", segment.getId(), segment.getType(), new DTSegMetadata(segment), "name is missing", null, "FATAL", "User"));
      }
      if (description == null) result.getErrors().add(new IgamtObjectError("Desc_Missing", segment.getId(), segment.getType(), new DTSegMetadata(segment), "Description is missing", null, "WARNING", "User"));
      
      if(domainInfo == null || domainInfo.getScope() == null) {
        result.getErrors().add(new IgamtObjectError("Scope_Missing", segment.getId(), segment.getType(), new DTSegMetadata(segment), "Scope is missing", null, "ERROR", "Internal"));
      }
      if(domainInfo == null || domainInfo.getVersion() == null) {
        result.getErrors().add(new IgamtObjectError("Version_Missing", segment.getId(), segment.getType(), new DTSegMetadata(segment), "Version is missing", null, "WARNING", "Internal"));
      }
      
      if (domainInfo != null && domainInfo.getScope() != null && domainInfo.getScope().equals(Scope.USER) && !this.isNotNullNotEmptyNotWhiteSpaceOnly(ext)) {
        result.getErrors().add(new IgamtObjectError("EXT_Missing", segment.getId(), segment.getType(), new DTSegMetadata(segment), "EXTENSION is missing, but scope is users", null, "FATAL", "User"));
      } 

      if(ext != null) {
        String regex = "^[a-zA-Z0-9]+$";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(ext);       
        
        if(!matcher.matches() || ext.length() > 4) {
          result.getErrors().add(new IgamtObjectError("EXT_Format", segment.getId(), segment.getType(), new DTSegMetadata(segment), "User extension should start with a letter and be within 4 characters long.", null, "WARNING", "User"));
        }
      }
    }
  }

  private void checkingMetadataForConformanceProfile(ConformanceProfile conformanceProfile, CPVerificationResult result) {
    if (conformanceProfile == null) {
      
    } else {
      String name = conformanceProfile.getName();
      String description = conformanceProfile.getDescription();
      DomainInfo domainInfo = conformanceProfile.getDomainInfo();
      String structId = conformanceProfile.getStructID();
      String mType = conformanceProfile.getMessageType();
      String event = conformanceProfile.getEvent();
      
      if (!this.isNotNullNotEmptyNotWhiteSpaceOnly(name)) {
        result.getErrors().add(new IgamtObjectError("Name_Missing", conformanceProfile.getId(), conformanceProfile.getType(), new CPMetadata(conformanceProfile), "name is missing", null, "FATAL", "User"));
      }
      
      if (description == null) result.getErrors().add(new IgamtObjectError("Desc_Missing", conformanceProfile.getId(), conformanceProfile.getType(), new CPMetadata(conformanceProfile), "Description is missing", null, "WARNING", "User"));
      
      if (!this.isNotNullNotEmptyNotWhiteSpaceOnly(structId)) {
        result.getErrors().add(new IgamtObjectError("StructId_Missing", conformanceProfile.getId(), conformanceProfile.getType(), new CPMetadata(conformanceProfile), "StructId is missing", null, "FATAL", "Internal"));
      }
      
      if (!this.isNotNullNotEmptyNotWhiteSpaceOnly(mType)) {
        result.getErrors().add(new IgamtObjectError("MessageType_Missing", conformanceProfile.getId(), conformanceProfile.getType(), new CPMetadata(conformanceProfile), "Message Type is missing.", null, "FATAL", "Internal"));
      }
      
      if (!this.isNotNullNotEmptyNotWhiteSpaceOnly(event)) {
        result.getErrors().add(new IgamtObjectError("TriggerEvent_Missing", conformanceProfile.getId(), conformanceProfile.getType(), new CPMetadata(conformanceProfile), "Trigger Event is missing.", null, "FATAL", "Internal"));
      }
      
      if(domainInfo == null || domainInfo.getScope() == null) {
        result.getErrors().add(new IgamtObjectError("Scope_Missing", conformanceProfile.getId(), conformanceProfile.getType(), new CPMetadata(conformanceProfile), "Scope is missing", null, "ERROR", "Internal"));
      }
      if(domainInfo == null || domainInfo.getVersion() == null) {
        result.getErrors().add(new IgamtObjectError("Version_Missing", conformanceProfile.getId(), conformanceProfile.getType(), new CPMetadata(conformanceProfile), "Version is missing", null, "WARNING", "Internal"));
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
          if(this.isNotNullNotEmptyNotWhiteSpaceOnly(item.getValue())) result.getErrors().add(new IgamtObjectError("DM_DTBaseName_Missing", segment.getId(), segment.getType(), new DTSegMetadata(segment), "In " + item.getValue() + ", DTBaseName is missing for segment Dynamic Mapping Item", item.getValue(), "ERROR", "User"));
          String datatypeId = item.getDatatypeId();
          
          if(datatypeId == null) result.getErrors().add(new IgamtObjectError("DM_DT_Missing", segment.getId(), segment.getType(), new DTSegMetadata(segment), "In " + item.getValue() + ", DT is missing for segment Dynamic Mapping Item", item.getValue(), "ERROR", "User"));
          else {
            Datatype dt = this.datatypeService.findById(datatypeId);
            if(dt == null) result.getErrors().add(new IgamtObjectError("DM_DT_NotAccessable", segment.getId(), segment.getType(), new DTSegMetadata(segment), "In " + item.getValue() + ", DT is not accessable for segment Dynamic Mapping Item", item.getValue(), "ERROR", "Internal"));
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

  private CPComplianceResult verifyConformanceProfileForCompliance(ConformanceProfile conformanceProfile) {
    CPComplianceResult result = new CPComplianceResult(conformanceProfile);

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
      
      this.parentComplianceMap.put(positionPath, new ComplianceObject(positionPath, path, usage, min, max, null, null));

      
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
        
        this.parentComplianceMap.put(positionPath, new ComplianceObject(positionPath, path, usage, min, max, null, null));

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
    String minLength = field.getMinLength();
    String maxLength = field.getMaxLength();
    positionPath = positionPath + "." + position;
    path = path + "." + position;
    
    this.parentComplianceMap.put(positionPath, new ComplianceObject(positionPath, path, usage, min, max, minLength,maxLength));
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
    String minLength = component.getMinLength();
    String maxLength = component.getMaxLength();
    positionPath = positionPath + "." + position;
    path = path + "." + position;
    
    this.parentComplianceMap.put(positionPath, new ComplianceObject(positionPath, path, usage, null, null, minLength, maxLength));

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

  @Override
  public VerificationReport verifyIg(String documentId) {
    parentComplianceMap = new HashMap<String,ComplianceObject>();
    childComplianceMap = new HashMap<String,ComplianceObject>();
    VerificationReport report = new VerificationReport();
    Ig ig = this.igService.findById(documentId);
    IgVerificationResult result = new IgVerificationResult(ig);
    
    HashSet<String> bIdSet = new HashSet<String> ();

    ValueSetRegistry valueSetRegistry = ig.getValueSetRegistry();
    
    if(valueSetRegistry.getChildren() != null) {
      for(Link l : valueSetRegistry.getChildren()) {
        DomainInfo domainInfo = l.getDomainInfo();
        String id = l.getId();
        
        Valueset vs = this.valuesetService.findById(id);
        
        if(vs == null) result.getErrors().add(new IgamtObjectError("Link_NotAccessable", id, Type.VALUESET, null, "In valueset Repository, valueset : " + id  + " is not accesable", null, "ERROR", "Internal"));
        else {
          if(!bIdSet.add(vs.getBindingIdentifier())) result.getErrors().add(new IgamtObjectError("BindingId_Duplicated", vs.getId(), Type.VALUESET, new VSMetadata(vs), "Binding Identifier of " + vs.getBindingIdentifier() + " is duplicated in the IG", null, "ERROR", "User"));
          if(vs.getDomainInfo().getScope() == null || !vs.getDomainInfo().getScope().equals(domainInfo.getScope())) result.getErrors().add(new IgamtObjectError("Link_Scope_notMatched", vs.getId(), Type.VALUESET, new VSMetadata(vs), "In valueset Repository, " + vs.getLabel() + "'s scope value of the Link is not matched with actual Valueset's scope.", null, "ERROR", "Internal"));
          if(vs.getDomainInfo().getVersion() == null || !vs.getDomainInfo().getVersion().equals(domainInfo.getVersion())) result.getErrors().add(new IgamtObjectError("Link_Version_notMatched", vs.getId(), Type.VALUESET, new VSMetadata(vs), "In valueset Repository, "+  vs.getLabel() + "'s version value of the Link is not matched with actual Valueset's version.", null, "ERROR", "Internal"));
          report.addValuesetVerificationResult(this.verifyValueset(vs));
        }
        
      } 
    }
    
    DatatypeRegistry datatypeRegistry = ig.getDatatypeRegistry();
    HashSet<String> dtLabelSet = new HashSet<String> ();
    if(datatypeRegistry.getChildren() != null) {
      for(Link l : datatypeRegistry.getChildren()) {
        DomainInfo domainInfo = l.getDomainInfo();
        String id = l.getId();
        
        Datatype dt = this.datatypeService.findById(id);
        if(dt == null) result.getErrors().add(new IgamtObjectError("Link_NotAccessable", id, Type.DATATYPE, null, "In dataytpe Repository, datatype : " + id  + " is not accesable", null, "ERROR", "Internal"));
        else {
          if(!dtLabelSet.add(dt.getLabel())) result.getErrors().add(new IgamtObjectError("Label_Duplicated", dt.getId(), Type.DATATYPE, new DTSegMetadata(dt), "Datatype Label of " + dt.getLabel() + " is duplicated in the IG", null, "ERROR", "User"));
          if(dt.getDomainInfo().getScope() == null || !dt.getDomainInfo().getScope().equals(domainInfo.getScope())) result.getErrors().add(new IgamtObjectError("Link_Scope_notMatched", dt.getId(), Type.DATATYPE, new DTSegMetadata(dt), "In datatype Repository, " + dt.getLabel() + "'s scope value of the Link is not matched with actual datatype's scope.", null, "ERROR", "Internal"));
          if(dt.getDomainInfo().getVersion() == null || !dt.getDomainInfo().getVersion().equals(domainInfo.getVersion())) result.getErrors().add(new IgamtObjectError("Link_Version_notMatched", dt.getId(), Type.DATATYPE, new DTSegMetadata(dt), "In datatype Repository, "+  dt.getLabel() + "'s version value of the Link is not matched with actual datatype's version.", null, "ERROR", "Internal"));
          
          report.addDatatypeVerificationResult(this.verifyDatatype(dt));
        }
      } 
    }
    
    SegmentRegistry segmentRegistry = ig.getSegmentRegistry();
    HashSet<String> segLabelSet = new HashSet<String> ();
    if(segmentRegistry.getChildren() != null) {
      for(Link l : segmentRegistry.getChildren()) {
        DomainInfo domainInfo = l.getDomainInfo();
        String id = l.getId();
        
        Segment s = this.segmentService.findById(id);
        
        if(s == null) result.getErrors().add(new IgamtObjectError("Link_NotAccessable", id, Type.SEGMENT, null, "In segment Repository, segment : " + id  + " is not accesable", null, "ERROR", "Internal"));
        else {
          if(!segLabelSet.add(s.getLabel())) result.getErrors().add(new IgamtObjectError("Label_Duplicated", s.getId(), Type.SEGMENT, new DTSegMetadata(s),"Segment Label of " + s.getLabel() + " is duplicated in the IG", null, "ERROR", "User"));
          if(s.getDomainInfo().getScope() == null || !s.getDomainInfo().getScope().equals(domainInfo.getScope())) result.getErrors().add(new IgamtObjectError("Link_Scope_notMatched", s.getId(), Type.SEGMENT, new DTSegMetadata(s), "In segment Repository, " + s.getLabel() + "'s scope value of the Link is not matched with actual segment scope.", null, "ERROR", "Internal"));
          if(s.getDomainInfo().getVersion() == null || !s.getDomainInfo().getVersion().equals(domainInfo.getVersion())) result.getErrors().add(new IgamtObjectError("Link_Version_notMatched", s.getId(), Type.SEGMENT, new DTSegMetadata(s), "In segment Repository, "+  s.getLabel() + "'s version value of the Link is not matched with actual segment version.", null, "ERROR", "Internal"));
          
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
        
        if(cp == null) result.getErrors().add(new IgamtObjectError("Link_NotAccessable", id, Type.CONFORMANCEPROFILE, null, "In conformance profile Repository, conformance profile : " + id  + " is not accesable", null, "ERROR", "Internal"));
        else {
          if(cp.getDomainInfo().getScope() == null || !cp.getDomainInfo().getScope().equals(domainInfo.getScope())) result.getErrors().add(new IgamtObjectError("Link_Scope_notMatched", cp.getId(), Type.CONFORMANCEPROFILE, new CPMetadata(cp), "In conformance profile Repository, " + cp.getLabel() + "'s scope value of the Link is not matched with actual conformance profile scope.", null, "ERROR", "Internal"));
          if(cp.getDomainInfo().getVersion() == null || !cp.getDomainInfo().getVersion().equals(domainInfo.getVersion())) result.getErrors().add(new IgamtObjectError("Link_Version_notMatched", cp.getId(), Type.CONFORMANCEPROFILE, new CPMetadata(cp), "In conformance profile Repository, "+  cp.getLabel() + "'s version value of the Link is not matched with actual conformance profile version.", null, "ERROR", "Internal"));
          report.addConformanceProfileVerificationResult(this.verifyConformanceProfile(cp));
        }
        
      } 
    }
    
    report.setIgVerificationResult(result);
    return report;
  }
  
  @Override
  public ComplianceReport verifyIgForCompliance(String documentId) {
    parentComplianceMap = new HashMap<String,ComplianceObject>();
    childComplianceMap = new HashMap<String,ComplianceObject>();
    ComplianceReport report = new ComplianceReport();
    Ig ig = this.igService.findById(documentId);
    
    ConformanceProfileRegistry conformanceProfileRegistry = ig.getConformanceProfileRegistry();
    
    if(conformanceProfileRegistry.getChildren() != null) {
      for(Link l : conformanceProfileRegistry.getChildren()) {
        String id = l.getId();
        ConformanceProfile cp = this.conformanceProfileService.findById(id);
        if(cp != null) {
          report.addConformanceProfileComplianceResult(this.verifyConformanceProfileForCompliance(cp));
        }
        
      } 
    }
    return report;
  }

}

