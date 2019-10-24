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
package gov.nist.hit.hl7.igamt.verification.service.impl;

import java.io.IOException;
import java.io.InputStream;
import java.io.StringReader;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.NoSuchElementException;
import java.util.Set;

import javax.xml.XMLConstants;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.Source;
import javax.xml.transform.stream.StreamSource;
import javax.xml.validation.Schema;
import javax.xml.validation.SchemaFactory;
import javax.xml.validation.Validator;

import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import gov.nist.hit.hl7.igamt.common.base.domain.DomainInfo;
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
import gov.nist.hit.hl7.igamt.constraints.repository.PredicateRepository;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Component;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.DateTimeDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.PrimitiveDatatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.segment.domain.Field;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;
import gov.nist.hit.hl7.igamt.verification.domain.CustomProfileError;
import gov.nist.hit.hl7.igamt.verification.domain.DocumentTarget;
import gov.nist.hit.hl7.igamt.verification.domain.VerificationReport;
import gov.nist.hit.hl7.igamt.verification.domain.VerificationReport.ErrorType;
import gov.nist.hit.hl7.igamt.verification.domain.XSDVerificationResult;
import gov.nist.hit.hl7.igamt.verification.service.VerificationService;
import hl7.v2.profile.XMLDeserializer;

/**
 * @author jungyubw
 *
 */


public class ValidationServiceImpl implements VerificationService {
  @Autowired
  private DatatypeService datatypeService;
  
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
  public VerificationReport verifyXMLs(String profileXMLStr, String constraintXMLStr, String valuesetXMLStr) {
    VerificationReport report = new VerificationReport();
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

    if (report.isSuccess()) {
      InputStream profileXMLIO = IOUtils.toInputStream(profileXMLStr, StandardCharsets.UTF_8);
      try {
        XMLDeserializer.deserialize(profileXMLIO).get();
      } catch (NoSuchElementException nsee) {
        report.addProfileError(new CustomProfileError(ErrorType.CoreParsingError, nsee.getMessage(), null, null));;

      } catch (Exception e) {
        report.addProfileError(new CustomProfileError(ErrorType.Unknown, e.getMessage(), null, null));;
      }
    }


    return report;
  }

  @Override
  public VerificationResult verifyValueset(Valueset valueset, String documentId) {
    // TODO Auto-generated method stub
    return null;
  }

  @Override
  public VerificationResult verifyDatatype(Datatype datatype, String documentId) {
    VerificationResult vr = new VerificationResult();
    
    // 1. Metadata checking
    this.checkingMetadataForDatatype(datatype, vr);
    
    
    // 2. Structure Checking
    this.checkingStructureForDatatype(datatype, vr);
    
    return vr;
  }

  /**
   * @param datatype
   * @param vr
   */
  private void checkingStructureForDatatype(Datatype datatype, VerificationResult vr) {
    // Case #1 : Primitive
    if (datatype instanceof PrimitiveDatatype) {
      //NO Checking
    }
    
    if (datatype instanceof ComplexDatatype) {
      ComplexDatatype cDt = (ComplexDatatype)datatype;
      
      this.checkingComponents(cDt, cDt.getComponents(), vr);
    }
  }
  
  /**
   * @param segment
   * @param vr
   */
  private void checkingStructureForSegment(Segment segment, VerificationResult vr) {      
      this.checkingFields(segment, segment.getChildren(), vr);
  }

  /**
   * @param segment
   * @param children
   * @param vr
   */
  private void checkingFields(Segment segment, Set<Field> fields, VerificationResult vr) {
    if(fields == null || fields.size() == 0) {
      vr.addSegmentError(new SegmentObjectError(segment.getId(), "STRUCTURE", "fields", "Segment should have one or more fields.", null, "HIGH"));
    } else {
      fields.forEach(f -> this.checkingField(segment, f, vr));
    }
  }
  
  /**
   * @param components
   */
  private void checkingComponents(ComplexDatatype cDt, Set<Component> components, VerificationResult vr) {
    if(components == null || components.size() == 0) {
      vr.addDatatypeError(new DatatypeObjectError(cDt.getId(), "STRUCTURE", "components", "Complex Datatype should have one or more components.", null, "HIGH"));
    } else {
      components.forEach(c -> this.checkingComponent(cDt, c, vr));
    }
  }

  /**
   * @param datatype
   * @param c
   * @param vr
   * @return
   */
  private void checkingComponent(ComplexDatatype cDt, Component c, VerificationResult vr) {
    String name = c.getName();
    int position = c.getPosition();
    Ref ref = c.getRef();
    Type type = c.getType();
    Usage usage = c.getUsage();
    
    String confLength = c.getConfLength();
    String maxLength = c.getMaxLength();
    String minLength = c.getMinLength();

    if(position == 0) vr.addDatatypeError(new DatatypeObjectError(cDt.getId(), "STRUCTURE", "component.position", "Component position should be greater than 0", position + "", "HIGH"));
    if(!this.isNotNullNotEmpty(name)) vr.addDatatypeError(new DatatypeObjectError(cDt.getId(), "STRUCTURE", "component.name", "Name should be required.", position + "", "HIGH"));
    if(ref == null || ref.getId() == null) vr.addDatatypeError(new DatatypeObjectError(cDt.getId(), "STRUCTURE", "component.ref", "Component Ref should be required.", position + "", "HIGH"));
    if(type == null || !type.equals(Type.COMPONENT)) vr.addDatatypeError(new DatatypeObjectError(cDt.getId(), "STRUCTURE", "component.type", "Component type should be 'COMPONENT'.", position + "", "HIGH"));
    if(usage == null) vr.addDatatypeError(new DatatypeObjectError(cDt.getId(), "STRUCTURE", "component.usage", "Component usage should be required.", position + "", "HIGH"));
    
    if(this.isLengthAllowedComponent(c)) {
      if(this.isNullOrNA(confLength) && (this.isNullOrNA(minLength) || this.isNullOrNA(maxLength))) vr.addDatatypeError(new DatatypeObjectError(cDt.getId(), "STRUCTURE", "component.length", "Component length should be required.", position + "", "HIGH"));
      if(!this.isNullOrNA(confLength) && (!this.isNullOrNA(minLength) || !this.isNullOrNA(maxLength))) vr.addDatatypeError(new DatatypeObjectError(cDt.getId(), "STRUCTURE", "component.length", "Component length should defined using a single way.", position + "", "HIGH"));
      if(this.isNullOrNA(maxLength)  && !this.isNullOrNA(minLength)) vr.addDatatypeError(new DatatypeObjectError(cDt.getId(), "STRUCTURE", "component.maxLength", "Component maxLength is not defined.", position + "", "HIGH"));
      if(this.isNullOrNA(minLength)  && !this.isNullOrNA(maxLength)) vr.addDatatypeError(new DatatypeObjectError(cDt.getId(), "STRUCTURE", "component.minLength", "Component minLength is not defined.", position + "", "HIGH"));
      if(!this.isNullOrNA(minLength) && !this.isInt(minLength)) vr.addDatatypeError(new DatatypeObjectError(cDt.getId(), "STRUCTURE", "component.minLength", "Component minLength is not integer.", position + "", "HIGH"));
      if(!this.isNullOrNA(maxLength) && !this.isIntOrStar(maxLength)) vr.addDatatypeError(new DatatypeObjectError(cDt.getId(), "STRUCTURE", "component.maxLength", "Component maxLength should be integer or *", position + "", "HIGH"));   
    }
    
    cDt.getComponents().forEach(otherC -> {
      if(!otherC.getId().equals(c.getId())){
        if (otherC.getPosition() == c.getPosition()) vr.addDatatypeError(new DatatypeObjectError(cDt.getId(), "STRUCTURE", "component.position", "The component position is duplicated.", position + "", "HIGH"));
        if (otherC.getName().equals(c.getName())) vr.addDatatypeError(new DatatypeObjectError(cDt.getId(), "STRUCTURE", "component.name", "The component name is duplicated.", position + "", "HIGH"));
      }
    });
    
    if(usage.equals(Usage.CAB) && !this.hasPredicate(cDt, position)) vr.addDatatypeError(new DatatypeObjectError(cDt.getId(), "STRUCTURE", "component.predicate", "Usage is C(A/B), but predicate is missing.", position + "", "HIGH"));
    
    if(ref != null && ref.getId() != null) {
      Datatype childDt = this.datatypeService.findById(ref.getId());
      if(childDt == null) vr.addDatatypeError(new DatatypeObjectError(cDt.getId(), "STRUCTURE", "component.ref", "The component child DT is missing.", position + "", "HIGH"));
            
      if(this.isPrimitiveDatatype(childDt)) {
        
      } else {
        if(this.isNotNullNotEmpty(c.getConstantValue())) vr.addDatatypeError(new DatatypeObjectError(cDt.getId(), "STRUCTURE", "component.constantValue", "This ConstantValue is not allowed for this component.", position + "", "HIGH"));
      }
      
      if (this.isValueSetOrSingleCodeAllowedComponent(c, childDt)) {
        StructureElementBinding childBinding = this.findBindingById(c.getId(), cDt.getBinding());
        if(childBinding != null){
          Set<ValuesetBinding> valuesetBindings = childBinding.getValuesetBindings();
          ExternalSingleCode externalSingleCode = childBinding.getExternalSingleCode();
          InternalSingleCode internalSingleCode = childBinding.getInternalSingleCode();
          
          if(valuesetBindings != null) this.checkingValueSetBindings(cDt, valuesetBindings, vr, position);
          if(externalSingleCode != null) this.checkingExternalSingleCode(cDt, externalSingleCode, vr, position);
          if(internalSingleCode != null) this.checkingInternalSingleCode(cDt, internalSingleCode, vr, position);
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
  private void checkingField(Segment segment, Field f, VerificationResult vr) {
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
  

    if(position == 0) vr.addSegmentError(new SegmentObjectError(segment.getId(), "STRUCTURE", "field.position", "Field position should be greater than 0", position + "", "HIGH"));
    if(!this.isNotNullNotEmpty(name)) vr.addSegmentError(new SegmentObjectError(segment.getId(), "STRUCTURE", "field.name", "Name should be required.", position + "", "HIGH"));
    if(ref == null || ref.getId() == null) vr.addSegmentError(new SegmentObjectError(segment.getId(), "STRUCTURE", "field.ref", "Field Ref should be required.", position + "", "HIGH"));
    if(type == null || !type.equals(Type.FIELD)) vr.addSegmentError(new SegmentObjectError(segment.getId(), "STRUCTURE", "field.type", "Field type should be 'FIELD'.", position + "", "HIGH"));
    if(usage == null) vr.addSegmentError(new SegmentObjectError(segment.getId(), "STRUCTURE", "field.usage", "Field usage should be required.", position + "", "HIGH"));
    
    if(this.isLengthAllowedComponent(f)) {
      if(this.isNullOrNA(confLength) && (this.isNullOrNA(minLength) || this.isNullOrNA(maxLength))) vr.addSegmentError(new SegmentObjectError(segment.getId(), "STRUCTURE", "field.length", "Field length should be required.", position + "", "HIGH"));
      if(!this.isNullOrNA(confLength) && (!this.isNullOrNA(minLength) || !this.isNullOrNA(maxLength))) vr.addSegmentError(new SegmentObjectError(segment.getId(), "STRUCTURE", "field.length", "Field length should defined using a single way.", position + "", "HIGH"));
      if(this.isNullOrNA(maxLength)  && !this.isNullOrNA(minLength)) vr.addSegmentError(new SegmentObjectError(segment.getId(), "STRUCTURE", "field.maxLength", "Field maxLength is not defined.", position + "", "HIGH"));
      if(this.isNullOrNA(minLength)  && !this.isNullOrNA(maxLength)) vr.addSegmentError(new SegmentObjectError(segment.getId(), "STRUCTURE", "field.minLength", "Field minLength is not defined.", position + "", "HIGH"));
      if(!this.isNullOrNA(minLength) && !this.isInt(minLength)) vr.addSegmentError(new SegmentObjectError(segment.getId(), "STRUCTURE", "field.minLength", "Field minLength is not integer.", position + "", "HIGH"));
      if(!this.isNullOrNA(maxLength) && !this.isIntOrStar(maxLength)) vr.addSegmentError(new SegmentObjectError(segment.getId(), "STRUCTURE", "field.maxLength", "Field maxLength should be integer or *", position + "", "HIGH"));   
    }
   
    if(max == null || !this.isIntOrStar(max)) vr.addSegmentError(new SegmentObjectError(segment.getId(), "STRUCTURE", "field.max", "Field max should be integer or *", position + "", "HIGH"));
    if(usage != null) {
      if(usage.equals(Usage.R) && min < 1)  vr.addSegmentError(new SegmentObjectError(segment.getId(), "STRUCTURE", "field.min", "Field min should be greater than 0 if Usage is R", position + "", "HIGH"));
    }
    
    segment.getChildren().forEach(otherF -> {
      if(!otherF.getId().equals(f.getId())){
        if (otherF.getPosition() == f.getPosition()) vr.addSegmentError(new SegmentObjectError(segment.getId(), "STRUCTURE", "field.position", "The field position is duplicated.", position + "", "HIGH"));
        if (otherF.getName().equals(f.getName())) vr.addSegmentError(new SegmentObjectError(segment.getId(), "STRUCTURE", "field.name", "The field name is duplicated.", position + "", "HIGH"));
      }
    });
    
    if(usage.equals(Usage.CAB) && !this.hasPredicate(segment, position)) vr.addSegmentError(new SegmentObjectError(segment.getId(), "STRUCTURE", "field.predicate", "Usage is C(A/B), but predicate is missing.", position + "", "HIGH"));
    
    if(ref != null && ref.getId() != null) {
      Datatype childDt = this.datatypeService.findById(ref.getId());
      if(childDt == null) vr.addSegmentError(new SegmentObjectError(segment.getId(), "STRUCTURE", "component.ref", "The field child DT is missing.", position + "", "HIGH"));
            
      if(this.isPrimitiveDatatype(childDt)) {
        
      } else {
        if(this.isNotNullNotEmpty(f.getConstantValue())) vr.addSegmentError(new SegmentObjectError(segment.getId(), "STRUCTURE", "component.constantValue", "This ConstantValue is not allowed for this component.", position + "", "HIGH"));
      }
      
      if (this.isValueSetOrSingleCodeAllowedField(f, childDt)) {
        StructureElementBinding childBinding = this.findBindingById(f.getId(), segment.getBinding());
        if(childBinding != null){
          Set<ValuesetBinding> valuesetBindings = childBinding.getValuesetBindings();
          ExternalSingleCode externalSingleCode = childBinding.getExternalSingleCode();
          InternalSingleCode internalSingleCode = childBinding.getInternalSingleCode();
          
          if(valuesetBindings != null) this.checkingValueSetBindings(segment, valuesetBindings, vr, position);
          if(externalSingleCode != null) this.checkingExternalSingleCode(segment, externalSingleCode, vr, position);
          if(internalSingleCode != null) this.checkingInternalSingleCode(segment, internalSingleCode, vr, position);
        }
        
      }else {
        
      }
    }
  }

  /**
   * @param internalSingleCode
   * @param vr
   */
  private void checkingInternalSingleCode(ComplexDatatype cDt, InternalSingleCode internalSingleCode, VerificationResult vr, int position) {
    String code = internalSingleCode.getCode();
    String codeSystem = internalSingleCode.getCodeSystem();
    String valueSetId = internalSingleCode.getValueSetId();
    
    if(!this.isNotNullNotEmpty(code))       vr.addDatatypeError(new DatatypeObjectError(cDt.getId(), "STRUCTURE", "component.internalSingleCode", "The component's internal SingleCode Code is not valid", position + "", "HIGH"));
    if(!this.isNotNullNotEmpty(codeSystem)) vr.addDatatypeError(new DatatypeObjectError(cDt.getId(), "STRUCTURE", "component.internalSingleCode", "The component's internal SingleCode CodeSystem is not valid", position + "", "HIGH"));
    if(!this.isNotNullNotEmpty(valueSetId)) vr.addDatatypeError(new DatatypeObjectError(cDt.getId(), "STRUCTURE", "component.internalSingleCode", "The component's internal SingleCode valueset is missing", position + "", "HIGH"));
    
    if (valueSetId != null) {
      if(this.valuesetService.findById(valueSetId) == null) vr.addDatatypeError(new DatatypeObjectError(cDt.getId(), "STRUCTURE", "component.internalSingleCode", "The component's internal SingleCode valueset is missing", position + "", "HIGH"));
    }
  }
  
  /**
   * @param segment
   * @param internalSingleCode
   * @param vr
   * @param position
   */
  private void checkingInternalSingleCode(Segment segment, InternalSingleCode internalSingleCode, VerificationResult vr, int position) {
    String code = internalSingleCode.getCode();
    String codeSystem = internalSingleCode.getCodeSystem();
    String valueSetId = internalSingleCode.getValueSetId();
    
    if(!this.isNotNullNotEmpty(code))       vr.addSegmentError(new SegmentObjectError(segment.getId(), "STRUCTURE", "field.internalSingleCode", "The field's internal SingleCode Code is not valid", position + "", "HIGH"));
    if(!this.isNotNullNotEmpty(codeSystem)) vr.addSegmentError(new SegmentObjectError(segment.getId(), "STRUCTURE", "field.internalSingleCode", "The field's internal SingleCode CodeSystem is not valid", position + "", "HIGH"));
    if(!this.isNotNullNotEmpty(valueSetId)) vr.addSegmentError(new SegmentObjectError(segment.getId(), "STRUCTURE", "field.internalSingleCode", "The field's internal SingleCode valueset is missing", position + "", "HIGH"));
    
    if (valueSetId != null) {
      if(this.valuesetService.findById(valueSetId) == null) vr.addSegmentError(new SegmentObjectError(segment.getId(), "STRUCTURE", "field.internalSingleCode", "The field's internal SingleCode valueset is missing", position + "", "HIGH"));
    }
  }

  /**
   * @param externalSingleCode
   * @param vr
   */
  private void checkingExternalSingleCode(ComplexDatatype cDt, ExternalSingleCode externalSingleCode, VerificationResult vr, int position) {
    String value = externalSingleCode.getValue();
    String codeSystem = externalSingleCode.getCodeSystem();
    
    if(!this.isNotNullNotEmpty(value))       vr.addDatatypeError(new DatatypeObjectError(cDt.getId(), "STRUCTURE", "component.externalSingleCode", "The component's external SingleCode Code is not valid", position + "", "HIGH"));
    if(!this.isNotNullNotEmpty(codeSystem)) vr.addDatatypeError(new DatatypeObjectError(cDt.getId(), "STRUCTURE", "component.externalSingleCode", "The component's external SingleCode CodeSystem is not valid", position + "", "HIGH"));
  }

  /**
   * @param segment
   * @param externalSingleCode
   * @param vr
   * @param position
   */
  private void checkingExternalSingleCode(Segment segment, ExternalSingleCode externalSingleCode, VerificationResult vr, int position) {
    String value = externalSingleCode.getValue();
    String codeSystem = externalSingleCode.getCodeSystem();
    
    if(!this.isNotNullNotEmpty(value))       vr.addSegmentError(new SegmentObjectError(segment.getId(), "STRUCTURE", "field.externalSingleCode", "The component's external SingleCode Code is not valid", position + "", "HIGH"));
    if(!this.isNotNullNotEmpty(codeSystem)) vr.addSegmentError(new SegmentObjectError(segment.getId(), "STRUCTURE", "field.externalSingleCode", "The component's external SingleCode CodeSystem is not valid", position + "", "HIGH"));
    
  }
  
  /**
   * @param valuesetBindings
   * @param vr
   */
  private void checkingValueSetBindings(ComplexDatatype cDt, Set<ValuesetBinding> valuesetBindings, VerificationResult vr, int position) {
    for (ValuesetBinding vb : valuesetBindings) {
      for(String vsId : vb.getValueSets()){
        if(vsId == null) {
          vr.addDatatypeError(new DatatypeObjectError(cDt.getId(), "STRUCTURE", "component.valuesetBindings", "The component's valueset is null", position + "", "HIGH"));   
        }else {
          if(this.valuesetService.findById(vsId) == null) vr.addDatatypeError(new DatatypeObjectError(cDt.getId(), "STRUCTURE", "component.valuesetBindings", "The component's valueset is missing", position + "", "HIGH"));   
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
  private void checkingValueSetBindings(Segment segment, Set<ValuesetBinding> valuesetBindings, VerificationResult vr, int position) {
    for (ValuesetBinding vb : valuesetBindings) {
      for(String vsId : vb.getValueSets()){
        if(vsId == null) {
          vr.addSegmentError(new SegmentObjectError(segment.getId(), "STRUCTURE", "field.valuesetBindings", "The field's valueset is null", position + "", "HIGH"));   
        }else {
          if(this.valuesetService.findById(vsId) == null) vr.addSegmentError(new SegmentObjectError(segment.getId(), "STRUCTURE", "field.valuesetBindings", "The field's valueset is missing", position + "", "HIGH"));   
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
  private boolean hasPredicate(ComplexDatatype cDt, int position) {
    ResourceBinding binding = cDt.getBinding();
    if(binding == null || binding.getChildren() == null) return false;
    else {
      for (StructureElementBinding child : binding.getChildren()) {
        if(child.getElementId().equals(cDt.getId())) {
          if(child.getPredicateId() != null) {
            if(this.predicateRepository.findById(child.getPredicateId()).isPresent()) return true;
          }
        }
      }
    }
    
    return false;
  }
  
  private boolean hasPredicate(Segment segment, int position) {
    ResourceBinding binding = segment.getBinding();
    if(binding == null || binding.getChildren() == null) return false;
    else {
      for (StructureElementBinding child : binding.getChildren()) {
        if(child.getElementId().equals(segment.getId())) {
          if(child.getPredicateId() != null) {
            if(this.predicateRepository.findById(child.getPredicateId()).isPresent()) return true;
          }
        }
      }
    }
    
    return false;
  }

  /**
   * @param datatype
   * @param vr
   * Required: Name, Extension, dtDomainInfo, dtDomainInfo.scope
   */
  private void checkingMetadataForDatatype(Datatype datatype, VerificationResult vr) {
    if (datatype == null) {
      
    } else {
      String dtName = datatype.getName();
      String dtExt = datatype.getExt();
      DomainInfo dtDomainInfo = datatype.getDomainInfo();
      
      if (!this.isNotNullNotEmptyNotWhiteSpaceOnly(dtName)) {
        vr.addDatatypeError(new DatatypeObjectError(datatype.getId(), "METADATA", "name", "Name should be required.", null, "HIGH"));
      }
      
      if(dtDomainInfo == null) {
        vr.addDatatypeError(new DatatypeObjectError(datatype.getId(), "METADATA", "domainInfo", "DomainInfo is missing", null, "HIGH"));
      } else {
        if (dtDomainInfo.getScope() == null) vr.addDatatypeError(new DatatypeObjectError(datatype.getId(), "METADATA", "scope", "Scope is required", null, "HIGH"));
        if (!dtDomainInfo.getScope().equals(Scope.HL7STANDARD) && !this.isNotNullNotEmptyNotWhiteSpaceOnly(dtExt)) {
          vr.addDatatypeError(new DatatypeObjectError(datatype.getId(), "METADATA", "ext", "Non-STD datatype should have extension name.", null, "HIGH"));
        }        
      }
    }
  }
  
  /**
   * @param segment
   * @param vr
   */
  private void checkingMetadataForSegment(Segment segment, VerificationResult vr) {
    if (segment == null) {
      
    } else {
      String dtName = segment.getName();
      String dtExt = segment.getExt();
      DomainInfo dtDomainInfo = segment.getDomainInfo();
      
      if (!this.isNotNullNotEmptyNotWhiteSpaceOnly(dtName)) {
        vr.addSegmentError(new SegmentObjectError(segment.getId(), "METADATA", "name", "Name should be required.", null, "HIGH"));
      }
      
      if(dtDomainInfo == null) {
        vr.addSegmentError(new SegmentObjectError(segment.getId(), "METADATA", "domainInfo", "DomainInfo is missing", null, "HIGH"));
      } else {
        if (dtDomainInfo.getScope() == null) vr.addDatatypeError(new DatatypeObjectError(segment.getId(), "METADATA", "scope", "Scope is required", null, "HIGH"));
        if (!dtDomainInfo.getScope().equals(Scope.HL7STANDARD) && !this.isNotNullNotEmptyNotWhiteSpaceOnly(dtExt)) {
          vr.addSegmentError(new SegmentObjectError(segment.getId(), "METADATA", "ext", "Non-STD datatype should have extension name.", null, "HIGH"));
        }        
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
  public VerificationResult verifySegment(Segment segment, String documentId) {
    VerificationResult vr = new VerificationResult();
    
    // 1. Metadata checking
    this.checkingMetadataForSegment(segment, vr);
    
    
    // 2. Structure Checking
    this.checkingStructureForSegment(segment, vr);
    
    return vr;
  }

  @Override
  public VerificationResult verifyConformanceProfile(ConformanceProfile conformanceProfile,
      String documentId) {
    // TODO Auto-generated method stub
    return null;
  }

}

