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
import java.io.InputStream;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.SerializationUtils;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatement;
import gov.nist.hit.hl7.igamt.constraints.domain.Predicate;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.ComponentDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.ConformanceProfileDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.DatatypeBindingDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.DatatypeDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.FieldDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.IgDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.SegmentBindingDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.SegmentDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.SegmentRefOrGroupDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.ValuesetBindingDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.ValuesetDataModel;
import gov.nist.hit.hl7.igamt.ig.service.XMLSerializeService;
import gov.nist.hit.hl7.igamt.service.impl.exception.DatatypeComponentSerializationException;
import gov.nist.hit.hl7.igamt.service.impl.exception.DatatypeSerializationException;
import gov.nist.hit.hl7.igamt.service.impl.exception.FieldSerializationException;
import gov.nist.hit.hl7.igamt.service.impl.exception.GroupSerializationException;
import gov.nist.hit.hl7.igamt.service.impl.exception.MessageSerializationException;
import gov.nist.hit.hl7.igamt.service.impl.exception.ProfileSerializationException;
import gov.nist.hit.hl7.igamt.service.impl.exception.SegmentSerializationException;
import gov.nist.hit.hl7.igamt.service.impl.exception.TableSerializationException;
import gov.nist.hit.hl7.igamt.valueset.domain.Code;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.domain.property.ContentDefinition;
import gov.nist.hit.hl7.igamt.valueset.domain.property.Extensibility;
import gov.nist.hit.hl7.igamt.valueset.domain.property.Stability;
import nu.xom.Attribute;
import nu.xom.Builder;
import nu.xom.Document;
import nu.xom.Element;
import nu.xom.Node;
import nu.xom.NodeFactory;
import nu.xom.ParsingException;
import nu.xom.ValidityException;

/**
 * @author jungyubw
 *
 */
@Service("xMLSerializeService")
public class XMLSerializeServiceImpl implements XMLSerializeService {

  /*
   * (non-Javadoc)
   * 
   * @see
   * gov.nist.hit.hl7.igamt.ig.service.XMLSerializeService#serializeProfileToDoc(gov.nist.hit.hl7.
   * igamt.ig.domain.datamodel.IgDataModel)
   */
  @Override
  public Document serializeProfileToDoc(IgDataModel igModel) throws ProfileSerializationException {
    try {
      Element e = new Element("ConformanceProfile");
      this.serializeProfileMetaData(e, igModel, "Validation");

      Element ms = new Element("Messages");
      for (ConformanceProfileDataModel cpModel : igModel.getConformanceProfiles()) {
        ms.appendChild(this.serializeConformanceProfile(cpModel, igModel));
      }
      e.appendChild(ms);


      Element ss = new Element("Segments");
      for (SegmentDataModel sModel : igModel.getSegments()) {
        ss.appendChild(this.serializeSegment(sModel, igModel));
      }
      e.appendChild(ss);

      Element ds = new Element("Datatypes");
      for (DatatypeDataModel dModel : igModel.getDatatypes()) {
        ds.appendChild(this.serializeDatatype(dModel, igModel));
      }
      e.appendChild(ds);

      Document doc = new Document(e);

      return doc;
    } catch (Exception e) {
      throw new ProfileSerializationException(e, igModel != null ? igModel.getModel().getId() : "");
    }
  }

  /*
   * (non-Javadoc)
   * 
   * @see
   * gov.nist.hit.hl7.igamt.ig.service.XMLSerializeService#serializeValueSetXML(gov.nist.hit.hl7.
   * igamt.ig.domain.datamodel.IgDataModel)
   */
  @Override
  public Element serializeValueSetXML(IgDataModel igModel) throws TableSerializationException {
    Element elmTableLibrary = new Element("ValueSetLibrary");

    Attribute schemaDecl = new Attribute("noNamespaceSchemaLocation",
        "https://raw.githubusercontent.com/Jungyubw/NIST_healthcare_hl7_v2_profile_schema/master/Schema/NIST%20Validation%20Schema/ValueSets.xsd");
    schemaDecl.setNamespace("xsi", "http://www.w3.org/2001/XMLSchema-instance");
    elmTableLibrary.addAttribute(schemaDecl);
    elmTableLibrary
        .addAttribute(new Attribute("ValueSetLibraryIdentifier", igModel.getModel().getId()));

    Element elmMetaData = new Element("MetaData");
    if (igModel.getModel().getMetadata() == null) {
      elmMetaData.addAttribute(new Attribute("Name", "Vocab for " + "Profile"));
      elmMetaData.addAttribute(new Attribute("OrgName", "NIST"));
      elmMetaData.addAttribute(new Attribute("Version", "1.0.0"));
      elmMetaData.addAttribute(new Attribute("Date", ""));
    } else {
      elmMetaData.addAttribute(
          new Attribute("Name", !this.str(igModel.getModel().getMetadata().getTitle()).equals("")
              ? this.str(igModel.getModel().getMetadata().getTitle()) : "No Title Info"));
      elmMetaData.addAttribute(new Attribute("OrgName",
          !this.str(igModel.getModel().getMetadata().getOrgName()).equals("")
              ? this.str(igModel.getModel().getMetadata().getOrgName()) : "No Org Info"));
      elmMetaData.addAttribute(new Attribute("Version",
          !this.str(igModel.getModel().getDomainInfo().getVersion()).equals("")
              ? this.str(igModel.getModel().getDomainInfo().getVersion()) : "No Version Info"));
      elmMetaData.addAttribute(new Attribute("Date", "No Date Info"));

      if (igModel.getModel().getMetadata().getSpecificationName() != null
          && !igModel.getModel().getMetadata().getSpecificationName().equals(""))
        elmMetaData.addAttribute(new Attribute("SpecificationName",
            this.str(igModel.getModel().getMetadata().getSpecificationName())));
      if (igModel.getModel().getMetadata().getTopics() != null
          && !igModel.getModel().getMetadata().getTopics().equals(""))
        elmMetaData.addAttribute(
            new Attribute("Topics", this.str(igModel.getModel().getMetadata().getTopics())));
    }

    Element elmNoValidation = new Element("NoValidation");

    Element elmValueSetDefinitionsHL7Base = new Element("ValueSetDefinitions");
    elmValueSetDefinitionsHL7Base.addAttribute(new Attribute("Group", "HL7_base"));
    elmValueSetDefinitionsHL7Base.addAttribute(new Attribute("Order", "1"));
    Element elmValueSetDefinitionsHL7HL7Profile = new Element("ValueSetDefinitions");
    elmValueSetDefinitionsHL7HL7Profile.addAttribute(new Attribute("Group", "HL7_Profile"));
    elmValueSetDefinitionsHL7HL7Profile.addAttribute(new Attribute("Order", "2"));
    Element elmValueSetDefinitionsHL7External = new Element("ValueSetDefinitions");
    elmValueSetDefinitionsHL7External.addAttribute(new Attribute("Group", "External"));
    elmValueSetDefinitionsHL7External.addAttribute(new Attribute("Order", "3"));
    Element elmValueSetDefinitionsHL7Other = new Element("ValueSetDefinitions");
    elmValueSetDefinitionsHL7Other.addAttribute(new Attribute("Group", "Others"));
    elmValueSetDefinitionsHL7Other.addAttribute(new Attribute("Order", "4"));

    for (ValuesetDataModel vsm : igModel.getValuesets()) {
      try {
        // HashMap<String, Boolean> codePresenceMap = profile.getTableLibrary().getCodePresence();
        Valueset t = vsm.getModel();

        if (t != null) {
          if (t.getCodes() == null || t.getCodes().size() == 0 || t.getCodes().size() > 500
              || (t.getCodes().size() == 1
                  && new ArrayList<Code>(t.getCodes()).get(0).getValue().equals("..."))) {
            // || (codePresenceMap.containsKey(t.getId()) && !(codePresenceMap.get(t.getId())))) {
            Element elmBindingIdentifier = new Element("BindingIdentifier");
            if (igModel.getModel().getDomainInfo() != null
                && igModel.getModel().getDomainInfo().getVersion() != null
                && t.getDomainInfo() != null && t.getDomainInfo().getVersion() != null) {
              if (igModel.getModel().getDomainInfo().getVersion()
                  .equals(t.getDomainInfo().getVersion())) {
                elmBindingIdentifier.appendChild(this.str(t.getBindingIdentifier()));
              } else {
                elmBindingIdentifier.appendChild(this.str(t.getBindingIdentifier() + "_"
                    + t.getDomainInfo().getVersion().replaceAll("\\.", "-")));
              }
            } else {
              elmBindingIdentifier.appendChild(this.str(t.getBindingIdentifier()));
            }
            elmNoValidation.appendChild(elmBindingIdentifier);
          }

          Element elmValueSetDefinition = new Element("ValueSetDefinition");
          
          if (igModel.getModel().getDomainInfo() != null
              && igModel.getModel().getDomainInfo().getVersion() != null
              && t.getDomainInfo() != null && t.getDomainInfo().getVersion() != null) {
            if (igModel.getModel().getDomainInfo().getVersion()
                .equals(t.getDomainInfo().getVersion())) {
              elmValueSetDefinition.addAttribute(new Attribute("BindingIdentifier", this.str(t.getBindingIdentifier())));
            } else {
              elmValueSetDefinition.addAttribute(new Attribute("BindingIdentifier", this.str(t.getBindingIdentifier() + "_" + t.getDomainInfo().getVersion().replaceAll("\\.", "-"))));
            }
          } else {
            elmValueSetDefinition.addAttribute(new Attribute("BindingIdentifier", this.str(t.getBindingIdentifier())));
          }

          elmValueSetDefinition.addAttribute(new Attribute("Name", this.str(t.getName())));
          if (t.getName() != null && !t.getName().equals(""))
            elmValueSetDefinition.addAttribute(new Attribute("Description", this.str(t.getName())));
          if (t.getDomainInfo().getVersion() != null && !t.getDomainInfo().getVersion().equals(""))
            elmValueSetDefinition.addAttribute(new Attribute("Version", this.str(t.getDomainInfo().getVersion())));
          if (t.getOid() != null && !t.getOid().equals(""))
            elmValueSetDefinition.addAttribute(new Attribute("Oid", this.str(t.getOid())));
          if (t.getStability() != null && !t.getStability().equals("")) {
            if (t.getStability().equals(Stability.Undefined)) {
              elmValueSetDefinition
                  .addAttribute(new Attribute("Stability", this.str(Stability.Static.name())));
            } else {
              elmValueSetDefinition
                  .addAttribute(new Attribute("Stability", this.str(t.getStability().name())));
            }
          }
          if (t.getExtensibility() != null && !t.getExtensibility().equals("")) {
            if (t.getExtensibility().equals(Extensibility.Undefined)) {
              elmValueSetDefinition.addAttribute(
                  new Attribute("Extensibility", this.str(Extensibility.Closed.name())));
            } else {
              elmValueSetDefinition.addAttribute(
                  new Attribute("Extensibility", this.str(t.getExtensibility().name())));
            }
          }
          if (t.getContentDefinition() != null && !t.getContentDefinition().equals("")) {
            if (t.getContentDefinition().equals(ContentDefinition.Undefined)) {
              elmValueSetDefinition.addAttribute(new Attribute("ContentDefinition",
                  this.str(ContentDefinition.Extensional.name())));
            } else {
              elmValueSetDefinition.addAttribute(
                  new Attribute("ContentDefinition", this.str(t.getContentDefinition().name())));
            }
          }
          if (t.getDomainInfo().getScope().equals(Scope.HL7STANDARD)) {
            elmValueSetDefinitionsHL7Base.appendChild(elmValueSetDefinition);
          } else if (t.getDomainInfo().getScope().equals(Scope.USER)) {
            elmValueSetDefinitionsHL7HL7Profile.appendChild(elmValueSetDefinition);
          } else if (t.getDomainInfo().getScope().equals(Scope.PHINVADS)) {
            elmValueSetDefinitionsHL7External.appendChild(elmValueSetDefinition);
          } else {
            elmValueSetDefinitionsHL7Other.appendChild(elmValueSetDefinition);
          }

          if (t.getCodes() != null && t.getCodes().size() <= 500) {
            for (Code c : t.getCodes()) {
              Element elmValueElement = new Element("ValueElement");
              elmValueElement.addAttribute(new Attribute("Value", this.str(c.getValue())));
              elmValueElement.addAttribute(new Attribute("DisplayName", this.str(c.getDescription() + "")));
              if (c.getCodeSystem() != null && !c.getCodeSystem().equals(""))
                elmValueElement.addAttribute(new Attribute("CodeSystem", this.str(c.getCodeSystem())));
              if (c.getUsage() != null)
                elmValueElement.addAttribute(new Attribute("Usage", this.str(c.getUsage().toString())));
              if (c.getComments() != null && !c.getComments().equals(""))
                elmValueElement.addAttribute(new Attribute("Comments", this.str(c.getComments())));
              elmValueSetDefinition.appendChild(elmValueElement);
            }
          }
        }
      } catch (Exception e) {
        throw new TableSerializationException(e, vsm.getModel().getId());
      }
    }

    elmTableLibrary.appendChild(elmMetaData);
    elmTableLibrary.appendChild(elmNoValidation);


    if (elmValueSetDefinitionsHL7Base.getChildCount() > 0) {
      elmTableLibrary.appendChild(elmValueSetDefinitionsHL7Base);
    }
    if (elmValueSetDefinitionsHL7HL7Profile.getChildCount() > 0) {
      elmTableLibrary.appendChild(elmValueSetDefinitionsHL7HL7Profile);
    }
    if (elmValueSetDefinitionsHL7External.getChildCount() > 0) {
      elmTableLibrary.appendChild(elmValueSetDefinitionsHL7External);
    }
    if (elmValueSetDefinitionsHL7Other.getChildCount() > 0) {
      elmTableLibrary.appendChild(elmValueSetDefinitionsHL7Other);
    }

    return elmTableLibrary;
  }
  
  /*
   * (non-Javadoc)
   * 
   * @see
   * gov.nist.hit.hl7.igamt.ig.service.XMLSerializeService#serializeConstraintsXML(gov.nist.hit.hl7.
   * igamt.ig.domain.datamodel.IgDataModel)
   */
  @Override
  public Element serializeConstraintsXML(IgDataModel igModel) {
    Element e = new Element("ConformanceContext");
    Attribute schemaDecl = new Attribute("noNamespaceSchemaLocation", "https://raw.githubusercontent.com/Jungyubw/NIST_healthcare_hl7_v2_profile_schema/master/Schema/NIST%20Validation%20Schema/ConformanceContext.xsd");
    schemaDecl.setNamespace("xsi", "http://www.w3.org/2001/XMLSchema-instance");
    e.addAttribute(schemaDecl);

    e.addAttribute(new Attribute("UUID", igModel.getModel().getId()));

    Element elmMetaData = new Element("MetaData");
    if (igModel.getModel().getMetadata() == null) {
      elmMetaData.addAttribute(new Attribute("Name", "Vocab for " + "Profile"));
      elmMetaData.addAttribute(new Attribute("OrgName", "NIST"));
      elmMetaData.addAttribute(new Attribute("Version", "1.0.0"));
      elmMetaData.addAttribute(new Attribute("Date", ""));
    } else {
      elmMetaData.addAttribute(
          new Attribute("Name", !this.str(igModel.getModel().getMetadata().getTitle()).equals("")
              ? this.str(igModel.getModel().getMetadata().getTitle()) : "No Title Info"));
      elmMetaData.addAttribute(new Attribute("OrgName",
          !this.str(igModel.getModel().getMetadata().getOrgName()).equals("")
              ? this.str(igModel.getModel().getMetadata().getOrgName()) : "No Org Info"));
      elmMetaData.addAttribute(new Attribute("Version",
          !this.str(igModel.getModel().getDomainInfo().getVersion()).equals("")
              ? this.str(igModel.getModel().getDomainInfo().getVersion()) : "No Version Info"));
      elmMetaData.addAttribute(new Attribute("Date", "No Date Info"));

      if (igModel.getModel().getMetadata().getSpecificationName() != null
          && !igModel.getModel().getMetadata().getSpecificationName().equals(""))
        elmMetaData.addAttribute(new Attribute("SpecificationName",
            this.str(igModel.getModel().getMetadata().getSpecificationName())));
      if (igModel.getModel().getMetadata().getTopics() != null
          && !igModel.getModel().getMetadata().getTopics().equals(""))
        elmMetaData.addAttribute(
            new Attribute("Topics", this.str(igModel.getModel().getMetadata().getTopics())));
    }
    e.appendChild(elmMetaData);
    

    this.serializeMain(e, igModel);

    return e;
  }

  /**
   * @param e
   * @param igModel
   */
  private void serializeMain(Element e, IgDataModel igModel) {
    Element predicates_Elm = new Element("Predicates");
    Element predicates_dataType_Elm = new Element("Datatype");
    for (DatatypeDataModel dtModel : igModel.getDatatypes()) {
      
      Element elm_ByID = new Element("ByID");
      if (igModel.getModel().getDomainInfo() != null && igModel.getModel().getDomainInfo().getVersion() != null && dtModel.getModel().getDomainInfo() != null && dtModel.getModel().getDomainInfo().getVersion() != null) {
        if (igModel.getModel().getDomainInfo().getVersion().equals(dtModel.getModel().getDomainInfo().getVersion())) {
          elm_ByID.addAttribute(new Attribute("ID", dtModel.getModel().getLabel()));
        } else {
          elm_ByID.addAttribute(new Attribute("ID", dtModel.getModel().getLabel() + "_" + dtModel.getModel().getDomainInfo().getVersion().replaceAll("\\.", "-")));
        }
      } else {
        elm_ByID.addAttribute(new Attribute("ID", dtModel.getModel().getLabel()));
      }
      
      if(dtModel.getPredicateMap() != null && dtModel.getPredicateMap().size() > 0) {
        for(String key : dtModel.getPredicateMap().keySet()) {
          
          Predicate p = dtModel.getPredicateMap().get(key);
          
          Element elm_Constraint = new Element("Predicate");
          elm_Constraint.addAttribute(new Attribute("Target", this.bindingInstanceNum(key)));
          elm_Constraint.addAttribute(new Attribute("TrueUsage", p.getTrueUsage().toString()));
          elm_Constraint.addAttribute(new Attribute("FalseUsage", p.getFalseUsage().toString()));
          Element elm_Description = new Element("Description");
          elm_Description.appendChild(p.generateDescription());
          elm_Constraint.appendChild(elm_Description);
          elm_Constraint.appendChild(this.innerXMLHandler(p.generateConditionScript()));
          elm_ByID.appendChild(elm_Constraint);
        }
      }
      
      if(elm_ByID.getChildElements() != null && elm_ByID.getChildElements().size() > 0) {
        predicates_dataType_Elm.appendChild(elm_ByID);
      }
    }
    predicates_Elm.appendChild(predicates_dataType_Elm);
    
    Element predicates_segment_Elm = new Element("Segment");
    for (SegmentDataModel segModel : igModel.getSegments()) {
      
      Element elm_ByID = new Element("ByID");
      if (igModel.getModel().getDomainInfo() != null && igModel.getModel().getDomainInfo().getVersion() != null && segModel.getModel().getDomainInfo() != null && segModel.getModel().getDomainInfo().getVersion() != null) {
        if (igModel.getModel().getDomainInfo().getVersion().equals(segModel.getModel().getDomainInfo().getVersion())) {
          elm_ByID.addAttribute(new Attribute("ID", segModel.getModel().getLabel()));
        } else {
          elm_ByID.addAttribute(new Attribute("ID", segModel.getModel().getLabel() + "_" + segModel.getModel().getDomainInfo().getVersion().replaceAll("\\.", "-")));
        }
      } else {
        elm_ByID.addAttribute(new Attribute("ID", segModel.getModel().getLabel()));
      }
      
      if(segModel.getPredicateMap() != null && segModel.getPredicateMap().size() > 0) {
        for(String key : segModel.getPredicateMap().keySet()) {
          
          Predicate p = segModel.getPredicateMap().get(key);
          
          Element elm_Constraint = new Element("Predicate");
          elm_Constraint.addAttribute(new Attribute("Target", this.bindingInstanceNum(key)));
          elm_Constraint.addAttribute(new Attribute("TrueUsage", p.getTrueUsage().toString()));
          elm_Constraint.addAttribute(new Attribute("FalseUsage", p.getFalseUsage().toString()));
          Element elm_Description = new Element("Description");
          elm_Description.appendChild(p.generateDescription());
          elm_Constraint.appendChild(elm_Description);
          elm_Constraint.appendChild(this.innerXMLHandler(p.generateConditionScript()));
          elm_ByID.appendChild(elm_Constraint);
        }
      }
      
      if(elm_ByID.getChildElements() != null && elm_ByID.getChildElements().size() > 0) {
        predicates_segment_Elm.appendChild(elm_ByID);
      }
    }
    predicates_Elm.appendChild(predicates_segment_Elm);
    
    Element constraints_Elm = new Element("Constraints");
    Element constraints_dataType_Elm = new Element("Datatype");
    for (DatatypeDataModel dtModel : igModel.getDatatypes()) {
      
      Element elm_ByID = new Element("ByID");
      if (igModel.getModel().getDomainInfo() != null && igModel.getModel().getDomainInfo().getVersion() != null && dtModel.getModel().getDomainInfo() != null && dtModel.getModel().getDomainInfo().getVersion() != null) {
        if (igModel.getModel().getDomainInfo().getVersion().equals(dtModel.getModel().getDomainInfo().getVersion())) {
          elm_ByID.addAttribute(new Attribute("ID", dtModel.getModel().getLabel()));
        } else {
          elm_ByID.addAttribute(new Attribute("ID", dtModel.getModel().getLabel() + "_" + dtModel.getModel().getDomainInfo().getVersion().replaceAll("\\.", "-")));
        }
      } else {
        elm_ByID.addAttribute(new Attribute("ID", dtModel.getModel().getLabel()));
      }
      
      if(dtModel.getConformanceStatements() != null && dtModel.getConformanceStatements().size() > 0) {
        for(ConformanceStatement cs : dtModel.getConformanceStatements()) {
          Element elm_Constraint = new Element("Constraint");
          elm_Constraint.addAttribute(new Attribute("ID", cs.getIdentifier()));
          Element elm_Description = new Element("Description");
          elm_Description.appendChild(cs.generateDescription());
          elm_Constraint.appendChild(elm_Description);
          elm_Constraint.appendChild(this.innerXMLHandler(cs.generateAssertionScript()));
          elm_ByID.appendChild(elm_Constraint);
        }
      }
      
      if(elm_ByID.getChildElements() != null && elm_ByID.getChildElements().size() > 0) {
        constraints_dataType_Elm.appendChild(elm_ByID);
      }
    }
    constraints_Elm.appendChild(constraints_dataType_Elm);
    
    Element constraints_segment_Elm = new Element("Segment");
    for (SegmentDataModel segModel : igModel.getSegments()) {
      
      Element elm_ByID = new Element("ByID");
      if (igModel.getModel().getDomainInfo() != null && igModel.getModel().getDomainInfo().getVersion() != null && segModel.getModel().getDomainInfo() != null && segModel.getModel().getDomainInfo().getVersion() != null) {
        if (igModel.getModel().getDomainInfo().getVersion().equals(segModel.getModel().getDomainInfo().getVersion())) {
          elm_ByID.addAttribute(new Attribute("ID", segModel.getModel().getLabel()));
        } else {
          elm_ByID.addAttribute(new Attribute("ID", segModel.getModel().getLabel() + "_" + segModel.getModel().getDomainInfo().getVersion().replaceAll("\\.", "-")));
        }
      } else {
        elm_ByID.addAttribute(new Attribute("ID", segModel.getModel().getLabel()));
      }
      
      if(segModel.getConformanceStatements() != null && segModel.getConformanceStatements().size() > 0) {
        for(ConformanceStatement cs : segModel.getConformanceStatements()) {
          Element elm_Constraint = new Element("Constraint");
          elm_Constraint.addAttribute(new Attribute("ID", cs.getIdentifier()));
          Element elm_Description = new Element("Description");
          elm_Description.appendChild(cs.generateDescription());
          elm_Constraint.appendChild(elm_Description);
          elm_Constraint.appendChild(this.innerXMLHandler(cs.generateAssertionScript()));
          elm_ByID.appendChild(elm_Constraint);
        }
      }
      
      if(elm_ByID.getChildElements() != null && elm_ByID.getChildElements().size() > 0) {
        constraints_segment_Elm.appendChild(elm_ByID);
      }
    }
    constraints_Elm.appendChild(constraints_segment_Elm);

//    Element constraints_segment_Elm = new Element("Segment");
//    for (ByNameOrByID byNameOrByIDObj : conformanceStatements.getSegments().getByNameOrByIDs()) {
//      Element segmentConstaint = this.serializeByNameOrByID(byNameOrByIDObj);
//      if (segmentConstaint != null)
//        constraints_segment_Elm.appendChild(segmentConstaint);
//    }
//    constraints_Elm.appendChild(constraints_segment_Elm);
//
//    Element constraints_group_Elm = new Element("Group");
//    for (ByNameOrByID byNameOrByIDObj : conformanceStatements.getGroups().getByNameOrByIDs()) {
//      Element groupConstaint = this.serializeByNameOrByID(byNameOrByIDObj);
//      if (groupConstaint != null)
//        constraints_group_Elm.appendChild(groupConstaint);
//    }
//    constraints_Elm.appendChild(constraints_group_Elm);
//
//    Element constraints_message_Elm = new Element("Message");
//    for (ByNameOrByID byNameOrByIDObj : conformanceStatements.getMessages().getByNameOrByIDs()) {
//      Element messageConstaint = this.serializeByNameOrByID(byNameOrByIDObj);
//      if (messageConstaint != null)
//        constraints_message_Elm.appendChild(messageConstaint);
//    }
//    constraints_Elm.appendChild(constraints_message_Elm);
    e.appendChild(predicates_Elm);
    e.appendChild(constraints_Elm);
    
  }
  
  /**
   * @param key
   * @return
   */
  private String bindingInstanceNum(String keyStr) {
    String[] keys = keyStr.split("\\.");
    for(int i = 0; i < keys.length; i++){
      keys[i] = keys[i] + "[1]";
    }
    return String.join(".", keys);
  }

  private Node innerXMLHandler(String xml) {
    if (xml != null) {
      Builder builder = new Builder(new NodeFactory());
      try {
        Document doc = builder.build(xml, null);
        return doc.getRootElement().copy();
      } catch (ValidityException e) {
        e.printStackTrace();
      } catch (ParsingException e) {
        e.printStackTrace();
      } catch (IOException e) {
        e.printStackTrace();
      }
    }
    return null;
  }

  private Element serializeDatatype(DatatypeDataModel dModel, IgDataModel igModel)
      throws DatatypeSerializationException {
    try {
      Element elmDatatype = new Element("Datatype");

      if (igModel.getModel().getDomainInfo() != null
          && igModel.getModel().getDomainInfo().getVersion() != null
          && dModel.getModel().getDomainInfo() != null
          && dModel.getModel().getDomainInfo().getVersion() != null) {
        if (igModel.getModel().getDomainInfo().getVersion()
            .equals(dModel.getModel().getDomainInfo().getVersion())) {
          elmDatatype.addAttribute(new Attribute("Label", this.str(dModel.getModel().getLabel())));
          elmDatatype.addAttribute(new Attribute("ID", this.str(dModel.getModel().getLabel())));
        } else {
          elmDatatype.addAttribute(new Attribute("Label", this.str(dModel.getModel().getLabel()
              + "_" + dModel.getModel().getDomainInfo().getVersion().replaceAll("\\.", "-"))));
          elmDatatype.addAttribute(new Attribute("ID", this.str(dModel.getModel().getLabel() + "_"
              + dModel.getModel().getDomainInfo().getVersion().replaceAll("\\.", "-"))));
        }
      } else {
        elmDatatype.addAttribute(new Attribute("Label", this.str(dModel.getModel().getLabel())));
        elmDatatype.addAttribute(new Attribute("ID", this.str(dModel.getModel().getLabel())));
      }

      elmDatatype.addAttribute(new Attribute("Name", this.str(dModel.getModel().getName())));
      elmDatatype.addAttribute(new Attribute("Label", this.str(dModel.getModel().getLabel())));
      elmDatatype.addAttribute(
          new Attribute("Version", this.str(dModel.getModel().getDomainInfo().getVersion())));
      if (dModel.getModel().getDescription() == null
          || dModel.getModel().getDescription().equals("")) {
        elmDatatype.addAttribute(new Attribute("Description", "NoDesc"));
      } else {
        elmDatatype.addAttribute(
            new Attribute("Description", this.str(dModel.getModel().getDescription())));
      }

      if (dModel.getComponentDataModels() != null && dModel.getComponentDataModels().size() > 0) {
        Map<Integer, ComponentDataModel> components = new HashMap<Integer, ComponentDataModel>();
        for (ComponentDataModel cModel : dModel.getComponentDataModels()) {
          components.put(cModel.getModel().getPosition(), cModel);
        }

        for (int i = 1; i < components.size() + 1; i++) {
          try {
            ComponentDataModel c = components.get(i);
            Element elmComponent = new Element("Component");

            elmComponent.addAttribute(new Attribute("Name", this.str(c.getModel().getName())));
            elmComponent
                .addAttribute(new Attribute("Usage", this.str(c.getModel().getUsage().toString())));

            if (igModel.getModel().getDomainInfo() != null
                && igModel.getModel().getDomainInfo().getVersion() != null
                && c.getDatatype().getDomainInfo() != null
                && c.getDatatype().getDomainInfo().getVersion() != null) {
              if (igModel.getModel().getDomainInfo().getVersion()
                  .equals(c.getDatatype().getDomainInfo().getVersion())) {
                elmComponent
                    .addAttribute(new Attribute("Datatype", this.str(c.getDatatype().getLabel())));
              } else {
                elmComponent.addAttribute(
                    new Attribute("Datatype", this.str(c.getDatatype().getLabel() + "_"
                        + c.getDatatype().getDomainInfo().getVersion().replaceAll("\\.", "-"))));
              }
            } else {
              elmComponent
                  .addAttribute(new Attribute("Datatype", this.str(c.getDatatype().getLabel())));
            }

            if (c.getModel().getMinLength() != null && !c.getModel().getMinLength().isEmpty()) {
              elmComponent
                  .addAttribute(new Attribute("MinLength", this.str(c.getModel().getMinLength())));

            } else {
              elmComponent.addAttribute(new Attribute("MinLength", "NA"));
            }

            if (c.getModel().getMaxLength() != null && !c.getModel().getMaxLength().isEmpty()) {
              elmComponent
                  .addAttribute(new Attribute("MaxLength", this.str(c.getModel().getMaxLength())));

            } else {
              elmComponent.addAttribute(new Attribute("MaxLength", "NA"));

            }
            if (c.getModel().getConfLength() != null && !c.getModel().getConfLength().equals("")) {
              elmComponent.addAttribute(
                  new Attribute("ConfLength", this.str(c.getModel().getConfLength())));
            } else {
              elmComponent.addAttribute(new Attribute("ConfLength", "NA"));
            }

            Set<ValuesetBindingDataModel> valueSetBindings = c.getValuesets();
            if (valueSetBindings != null && valueSetBindings.size() > 0) {
              String bindingString = "";
              String bindingStrength = null;
              Set<Integer> bindingLocation = null;

              for (ValuesetBindingDataModel binding : valueSetBindings) {
                try {
                  bindingStrength = binding.getValuesetBinding().getStrength().toString();
                  if (binding.getValuesetBinding().getValuesetLocations() != null
                      && binding.getValuesetBinding().getValuesetLocations().size() > 0)
                    bindingLocation = binding.getValuesetBinding().getValuesetLocations();
                  if (binding != null && binding.getBindingIdentifier() != null
                      && !binding.getBindingIdentifier().equals("")) {
                    if (igModel.getModel().getDomainInfo() != null
                        && igModel.getModel().getDomainInfo().getVersion() != null
                        && binding.getDomainInfo() != null
                        && binding.getDomainInfo().getVersion() != null) {
                      if (igModel.getModel().getDomainInfo().getVersion()
                          .equals(binding.getDomainInfo().getVersion())) {
                        bindingString = bindingString + binding.getBindingIdentifier() + ":";
                      } else {
                        bindingString = bindingString + binding.getBindingIdentifier() + "_"
                            + binding.getDomainInfo().getVersion().replaceAll("\\.", "-") + ":";
                      }
                    } else {
                      bindingString = bindingString + binding.getBindingIdentifier() + ":";
                    }
                  }
                } catch (Exception e) {
                  e.printStackTrace();
                  throw new TableSerializationException(e, "" + c.getModel().getPosition());
                }


              }

              if (!bindingString.equals(""))
                elmComponent.addAttribute(new Attribute("Binding",
                    bindingString.substring(0, bindingString.length() - 1)));
              if (bindingStrength != null)
                elmComponent.addAttribute(new Attribute("BindingStrength", bindingStrength));
              if (bindingLocation != null && bindingLocation.size() > 0) {
                String bindingLocationStr = "";
                for (Integer index : bindingLocation) {
                  bindingLocationStr = bindingLocationStr + index + ":";
                }

                elmComponent.addAttribute(new Attribute("BindingLocation",
                    bindingLocationStr.substring(0, bindingLocationStr.length() - 1)));
              } else {
              }
            }

            elmDatatype.appendChild(elmComponent);
          } catch (Exception e) {
            throw new DatatypeComponentSerializationException(e, i);
          }

        }
      }
      return elmDatatype;
    } catch (Exception e) {
      throw new DatatypeSerializationException(e, dModel.getModel().getLabel());
    }
  }

  private Element serializeSegment(SegmentDataModel sModel, IgDataModel igModel)
      throws SegmentSerializationException {
    try {
      // TODO DynamicMapping Need
      Element elmSegment = new Element("Segment");

      if (igModel.getModel().getDomainInfo() != null
          && igModel.getModel().getDomainInfo().getVersion() != null
          && sModel.getModel().getDomainInfo() != null
          && sModel.getModel().getDomainInfo().getVersion() != null) {
        if (igModel.getModel().getDomainInfo().getVersion()
            .equals(sModel.getModel().getDomainInfo().getVersion())) {
          elmSegment.addAttribute(new Attribute("Label", this.str(sModel.getModel().getLabel())));
          elmSegment.addAttribute(new Attribute("ID", this.str(sModel.getModel().getLabel())));
        } else {
          elmSegment.addAttribute(new Attribute("Label", this.str(sModel.getModel().getLabel() + "_"
              + sModel.getModel().getDomainInfo().getVersion().replaceAll("\\.", "-"))));
          elmSegment.addAttribute(new Attribute("ID", this.str(sModel.getModel().getLabel() + "_"
              + sModel.getModel().getDomainInfo().getVersion().replaceAll("\\.", "-"))));
        }
      } else {
        elmSegment.addAttribute(new Attribute("Label", this.str(sModel.getModel().getLabel())));
        elmSegment.addAttribute(new Attribute("ID", this.str(sModel.getModel().getLabel())));
      }

      elmSegment.addAttribute(new Attribute("Name", this.str(sModel.getModel().getName())));
      elmSegment.addAttribute(
          new Attribute("Version", this.str(sModel.getModel().getDomainInfo().getVersion())));
      if (sModel.getModel().getDescription() == null
          || sModel.getModel().getDescription().equals("")) {
        elmSegment.addAttribute(new Attribute("Description", "NoDesc"));
      } else {
        elmSegment.addAttribute(
            new Attribute("Description", this.str(sModel.getModel().getDescription())));
      }

      Map<Integer, FieldDataModel> fields = new HashMap<Integer, FieldDataModel>();

      for (FieldDataModel fModel : sModel.getFieldDataModels()) {
        fields.put(fModel.getModel().getPosition(), fModel);
      }

      for (int i = 1; i < fields.size() + 1; i++) {
        try {
          FieldDataModel f = fields.get(i);

          if (f != null) {
            DatatypeBindingDataModel dBindingModel = f.getDatatype();

            Element elmField = new Element("Field");
            elmField.addAttribute(new Attribute("Name", this.str(f.getModel().getName())));
            elmField
                .addAttribute(new Attribute("Usage", this.str(f.getModel().getUsage().toString())));

            if (igModel.getModel().getDomainInfo() != null
                && igModel.getModel().getDomainInfo().getVersion() != null
                && dBindingModel.getDomainInfo() != null
                && dBindingModel.getDomainInfo().getVersion() != null) {
              if (igModel.getModel().getDomainInfo().getVersion()
                  .equals(dBindingModel.getDomainInfo().getVersion())) {
                elmField
                    .addAttribute(new Attribute("Datatype", this.str(dBindingModel.getLabel())));
              } else {
                elmSegment.addAttribute(new Attribute("Datatype", this.str(dBindingModel.getLabel()
                    + "_" + dBindingModel.getDomainInfo().getVersion().replaceAll("\\.", "-"))));
              }
            } else {
              elmField.addAttribute(new Attribute("Datatype", this.str(dBindingModel.getLabel())));
            }

            if (f.getModel().getMinLength() != null && !f.getModel().getMinLength().isEmpty()) {
              elmField
                  .addAttribute(new Attribute("MinLength", this.str(f.getModel().getMinLength())));

            } else {
              elmField.addAttribute(new Attribute("MinLength", "NA"));
            }

            if (f.getModel().getMaxLength() != null && !f.getModel().getMaxLength().isEmpty()) {
              elmField
                  .addAttribute(new Attribute("MaxLength", this.str(f.getModel().getMaxLength())));

            } else {
              elmField.addAttribute(new Attribute("MaxLength", "NA"));

            }

            if (f.getModel().getConfLength() != null && !f.getModel().getConfLength().equals("")) {
              elmField.addAttribute(
                  new Attribute("ConfLength", this.str(f.getModel().getConfLength())));
            } else {
              elmField.addAttribute(new Attribute("ConfLength", "NA"));
            }

            Set<ValuesetBindingDataModel> valueSetBindings = f.getValuesets();
            if (valueSetBindings != null && valueSetBindings.size() > 0) {
              String bindingString = "";
              String bindingStrength = null;
              Set<Integer> bindingLocation = null;

              for (ValuesetBindingDataModel binding : valueSetBindings) {
                try {
                  bindingStrength = binding.getValuesetBinding().getStrength().toString();
                  if (binding.getValuesetBinding().getValuesetLocations() != null
                      && binding.getValuesetBinding().getValuesetLocations().size() > 0)
                    bindingLocation = binding.getValuesetBinding().getValuesetLocations();
                  if (binding != null && binding.getBindingIdentifier() != null
                      && !binding.getBindingIdentifier().equals("")) {
                    if (igModel.getModel().getDomainInfo() != null
                        && igModel.getModel().getDomainInfo().getVersion() != null
                        && binding.getDomainInfo() != null
                        && binding.getDomainInfo().getVersion() != null) {
                      if (igModel.getModel().getDomainInfo().getVersion()
                          .equals(binding.getDomainInfo().getVersion())) {
                        bindingString = bindingString + binding.getBindingIdentifier() + ":";
                      } else {
                        bindingString = bindingString + binding.getBindingIdentifier() + "_"
                            + binding.getDomainInfo().getVersion().replaceAll("\\.", "-") + ":";
                      }
                    } else {
                      bindingString = bindingString + binding.getBindingIdentifier() + ":";
                    }
                  }
                } catch (Exception e) {
                  e.printStackTrace();
                  throw new TableSerializationException(e, "" + f.getModel().getPosition());
                }


              }

              if (!bindingString.equals(""))
                elmField.addAttribute(new Attribute("Binding",
                    bindingString.substring(0, bindingString.length() - 1)));
              if (bindingStrength != null)
                elmField.addAttribute(new Attribute("BindingStrength", bindingStrength));
              if (bindingLocation != null && bindingLocation.size() > 0) {
                String bindingLocationStr = "";
                for (Integer index : bindingLocation) {
                  bindingLocationStr = bindingLocationStr + index + ":";
                }

                elmField.addAttribute(new Attribute("BindingLocation",
                    bindingLocationStr.substring(0, bindingLocationStr.length() - 1)));
              } else {
              }
            }

            elmField.addAttribute(new Attribute("Min", "" + f.getModel().getMin()));
            elmField.addAttribute(new Attribute("Max", "" + f.getModel().getMax()));
            elmSegment.appendChild(elmField);
          }
        } catch (Exception e) {
          e.printStackTrace();
          throw new FieldSerializationException(e, "Field[" + i + "]");
        }
      }

      return elmSegment;
    } catch (Exception e) {
      e.printStackTrace();
      throw new SegmentSerializationException(e, sModel != null ? sModel.getModel().getId() : "");
    }
  }

  private Element serializeConformanceProfile(ConformanceProfileDataModel cpModel,
      IgDataModel igModel) throws MessageSerializationException {
    try {
      Element elmMessage = new Element("Message");
      elmMessage.addAttribute(new Attribute("ID", cpModel.getModel().getId()));
      if (cpModel.getModel().getIdentifier() != null
          && !cpModel.getModel().getIdentifier().equals(""))
        elmMessage.addAttribute(
            new Attribute("Identifier", this.str(cpModel.getModel().getIdentifier())));
      if (cpModel.getModel().getName() != null && !cpModel.getModel().getName().equals(""))
        elmMessage.addAttribute(new Attribute("Name", this.str(cpModel.getModel().getName())));
      elmMessage.addAttribute(new Attribute("Type", this.str(cpModel.getModel().getMessageType())));
      elmMessage.addAttribute(new Attribute("Event", this.str(cpModel.getModel().getEvent())));
      elmMessage
          .addAttribute(new Attribute("StructID", this.str(cpModel.getModel().getStructID())));

      if (cpModel.getModel().getDescription() != null
          && !cpModel.getModel().getDescription().equals(""))
        elmMessage.addAttribute(
            new Attribute("Description", this.str(cpModel.getModel().getDescription())));

      Map<Integer, SegmentRefOrGroupDataModel> segmentRefOrGroupDataModels =
          new HashMap<Integer, SegmentRefOrGroupDataModel>();

      for (SegmentRefOrGroupDataModel segmentRefOrGroupDataModel : cpModel
          .getSegmentRefOrGroupDataModels()) {
        segmentRefOrGroupDataModels.put(segmentRefOrGroupDataModel.getModel().getPosition(),
            segmentRefOrGroupDataModel);
      }

      for (int i = 1; i < segmentRefOrGroupDataModels.size() + 1; i++) {
        SegmentRefOrGroupDataModel segmentRefOrGroupDataModel = segmentRefOrGroupDataModels.get(i);
        if (segmentRefOrGroupDataModel.getType().equals(Type.SEGMENTREF)) {
          elmMessage.appendChild(serializeSegmentRef(segmentRefOrGroupDataModel, igModel));
        } else if (segmentRefOrGroupDataModel.getType().equals(Type.GROUP)) {
          elmMessage.appendChild(serializeGroup(segmentRefOrGroupDataModel, igModel));
        }
      }

      return elmMessage;
    } catch (Exception e) {
      e.printStackTrace();
      throw new MessageSerializationException(e, cpModel != null ? cpModel.getModel().getId() : "");
    }
  }

  private Element serializeGroup(SegmentRefOrGroupDataModel segmentRefOrGroupDataModel,
      IgDataModel igModel) throws GroupSerializationException {
    try {
      Element elmGroup = new Element("Group");
      elmGroup.addAttribute(
          new Attribute("ID", this.str(segmentRefOrGroupDataModel.getModel().getId())));
      elmGroup.addAttribute(
          new Attribute("Name", this.str(segmentRefOrGroupDataModel.getModel().getName())));
      elmGroup.addAttribute(new Attribute("Usage",
          this.str(segmentRefOrGroupDataModel.getModel().getUsage().toString())));
      elmGroup.addAttribute(
          new Attribute("Min", this.str(segmentRefOrGroupDataModel.getModel().getMin() + "")));
      elmGroup.addAttribute(
          new Attribute("Max", this.str(segmentRefOrGroupDataModel.getModel().getMax())));

      Map<Integer, SegmentRefOrGroupDataModel> segmentRefOrGroupDataModels =
          new HashMap<Integer, SegmentRefOrGroupDataModel>();

      for (SegmentRefOrGroupDataModel child : segmentRefOrGroupDataModel.getChildren()) {
        segmentRefOrGroupDataModels.put(child.getModel().getPosition(), child);
      }

      for (int i = 1; i < segmentRefOrGroupDataModels.size() + 1; i++) {
        SegmentRefOrGroupDataModel childModel = segmentRefOrGroupDataModels.get(i);
        if (childModel.getType().equals(Type.SEGMENTREF)) {
          elmGroup.appendChild(serializeSegmentRef(childModel, igModel));
        } else if (childModel.getType().equals(Type.GROUP)) {
          elmGroup.appendChild(serializeGroup(childModel, igModel));
        }
      }

      return elmGroup;
    } catch (Exception e) {
      e.printStackTrace();
      throw new GroupSerializationException(e,
          segmentRefOrGroupDataModel != null ? segmentRefOrGroupDataModel.getModel().getId() : "");
    }
  }

  private Element serializeSegmentRef(SegmentRefOrGroupDataModel segmentRefOrGroupDataModel,
      IgDataModel igModel) throws SegmentSerializationException {
    try {
      SegmentBindingDataModel segModel = segmentRefOrGroupDataModel.getSegment();
      Element elmSegment = new Element("Segment");

      if (igModel.getModel().getDomainInfo() != null
          && igModel.getModel().getDomainInfo().getVersion() != null
          && segModel.getDomainInfo() != null && segModel.getDomainInfo().getVersion() != null) {
        if (igModel.getModel().getDomainInfo().getVersion()
            .equals(segModel.getDomainInfo().getVersion())) {
          elmSegment.addAttribute(new Attribute("Ref", this.str(segModel.getLabel())));
        } else {
          elmSegment.addAttribute(new Attribute("Ref", this.str(segModel.getLabel() + "_"
              + segModel.getDomainInfo().getVersion().replaceAll("\\.", "-"))));
        }
      } else {
        elmSegment.addAttribute(new Attribute("Ref", this.str(segModel.getLabel())));
      }

      elmSegment.addAttribute(new Attribute("Usage",
          this.str(segmentRefOrGroupDataModel.getModel().getUsage().toString())));
      elmSegment.addAttribute(
          new Attribute("Min", this.str(segmentRefOrGroupDataModel.getModel().getMin() + "")));
      elmSegment.addAttribute(
          new Attribute("Max", this.str(segmentRefOrGroupDataModel.getModel().getMax())));
      return elmSegment;
    } catch (Exception e) {
      e.printStackTrace();
      throw new SegmentSerializationException(e,
          segmentRefOrGroupDataModel != null ? segmentRefOrGroupDataModel.getModel().getId() : "");
    }
  }

  private void serializeProfileMetaData(Element e, IgDataModel igModel, String type) {
    if (type.equals("Validation")) {
      Attribute schemaDecl = new Attribute("noNamespaceSchemaLocation",
          "https://raw.githubusercontent.com/Jungyubw/NIST_healthcare_hl7_v2_profile_schema/master/Schema/NIST%20Validation%20Schema/Profile.xsd");
      schemaDecl.setNamespace("xsi", "http://www.w3.org/2001/XMLSchema-instance");
      e.addAttribute(schemaDecl);
    } else if (type.equals("Display")) {
      Attribute schemaDecl = new Attribute("noNamespaceSchemaLocation",
          "https://raw.githubusercontent.com/Jungyubw/NIST_healthcare_hl7_v2_profile_schema/master/Schema/NIST%20Display%20Schema/Profile.xsd");
      schemaDecl.setNamespace("xsi", "http://www.w3.org/2001/XMLSchema-instance");
      e.addAttribute(schemaDecl);
    }

    if (igModel != null && igModel.getModel() != null) {
      e.addAttribute(new Attribute("ID", igModel.getModel().getId()));
      if (igModel.getModel().getDomainInfo() != null
          && igModel.getModel().getDomainInfo().getVersion() != null)
        e.addAttribute(
            new Attribute("HL7Version", this.str(igModel.getModel().getDomainInfo().getVersion())));

      Element elmMetaData = new Element("MetaData");

      if (igModel.getModel().getMetadata() != null) {
        elmMetaData.addAttribute(
            new Attribute("Name", !this.str(igModel.getModel().getMetadata().getTitle()).equals("")
                ? this.str(igModel.getModel().getMetadata().getTitle()) : "No Title Info"));
        elmMetaData.addAttribute(new Attribute("OrgName",
            !this.str(igModel.getModel().getMetadata().getOrgName()).equals("")
                ? this.str(igModel.getModel().getMetadata().getOrgName()) : "No Org Info"));
        elmMetaData.addAttribute(
            new Attribute("Version", !this.str(igModel.getModel().getVersion() + "").equals("")
                ? this.str(igModel.getModel().getVersion() + "") : "No Version Info"));

        if (igModel.getModel().getUpdateDate() != null)
          elmMetaData.addAttribute(new Attribute("Date",
              !this.str(igModel.getModel().getUpdateDate().toString()).equals("")
                  ? this.str(igModel.getModel().getUpdateDate().toString()) : "No Date Info"));
        else
          elmMetaData.addAttribute(new Attribute("Date", "No Date Info"));

        elmMetaData.addAttribute(new Attribute("SpecificationName",
            !this.str(igModel.getModel().getMetadata().getSpecificationName()).equals("")
                ? this.str(igModel.getModel().getMetadata().getSpecificationName())
                : "No Version Info"));
      }
      e.appendChild(elmMetaData);
    }
  }

  private String str(String value) {
    return value != null ? value : "";
  }

  @Override
  public void generateIS(ZipOutputStream out, String xmlStr, String fileName) throws IOException {
    byte[] buf = new byte[1024];
    out.putNextEntry(new ZipEntry(fileName));
    InputStream inValueSet = IOUtils.toInputStream(xmlStr);
    int lenTP;
    while ((lenTP = inValueSet.read(buf)) > 0) {
      out.write(buf, 0, lenTP);
    }
    out.closeEntry();
    inValueSet.close();
  }
  
  @Override
  public void normalizeIgModel(IgDataModel igModel, String[] conformanceProfileIds) throws CloneNotSupportedException, ClassNotFoundException, IOException {
    Map<String, DatatypeDataModel> toBeAddedDTs = new HashMap<String, DatatypeDataModel>();
    Map<String, SegmentDataModel> toBeAddedSegs = new HashMap<String, SegmentDataModel>();

    for (DatatypeDataModel dtModel : igModel.getDatatypes()) {
      for (String key : dtModel.getValuesetMap().keySet()) {
        List<String> pathList = new LinkedList<String>(Arrays.asList(key.split("\\.")));

        if (pathList.size() > 1) {
          ComponentDataModel cModel =
              dtModel.findComponentDataModelByPosition(Integer.parseInt(pathList.remove(0)));

          DatatypeDataModel childDtModel = igModel.findDatatype(cModel.getDatatype().getId());
          if (childDtModel == null)
            childDtModel = toBeAddedDTs.get(cModel.getDatatype().getId());
          DatatypeDataModel copyDtModel =
              (DatatypeDataModel) SerializationUtils.clone(childDtModel);
          int randumNum = new SecureRandom().nextInt(100000);
          copyDtModel.getModel().setId(childDtModel.getModel().getId() + "_A" + randumNum);
          String ext = childDtModel.getModel().getExt();
          if (ext == null)
            ext = "";
          copyDtModel.getModel().setExt(ext + "_A" + randumNum);
          toBeAddedDTs.put(copyDtModel.getModel().getId(), copyDtModel);
          cModel.getDatatype().setId(copyDtModel.getModel().getId());
          cModel.getDatatype().setExt(ext + "_A" + randumNum);
          updateChildDatatype(pathList, copyDtModel, igModel, dtModel.getValuesetMap().get(key),
              toBeAddedDTs);
        }
      }
    }

    for (SegmentDataModel segModel : igModel.getSegments()) {
      for (String key : segModel.getValuesetMap().keySet()) {
        List<String> pathList = new LinkedList<String>(Arrays.asList(key.split("\\.")));

        if (pathList.size() > 1) {
          FieldDataModel fModel =
              segModel.findFieldDataModelByPosition(Integer.parseInt(pathList.remove(0)));

          DatatypeDataModel childDtModel = igModel.findDatatype(fModel.getDatatype().getId());
          if (childDtModel == null)
            childDtModel = toBeAddedDTs.get(fModel.getDatatype().getId());
          DatatypeDataModel copyDtModel =
              (DatatypeDataModel) SerializationUtils.clone(childDtModel);

          int randumNum = new SecureRandom().nextInt(100000);
          copyDtModel.getModel().setId(childDtModel.getModel().getId() + "_A" + randumNum);
          String ext = childDtModel.getModel().getExt();
          if (ext == null)
            ext = "";
          copyDtModel.getModel().setExt(ext + "_A" + randumNum);
          toBeAddedDTs.put(copyDtModel.getModel().getId(), copyDtModel);
          fModel.getDatatype().setId(copyDtModel.getModel().getId());
          fModel.getDatatype().setExt(ext + "_A" + randumNum);

          updateChildDatatype(pathList, copyDtModel, igModel, segModel.getValuesetMap().get(key),
              toBeAddedDTs);
        }
      }
    }

    for (ConformanceProfileDataModel cpModel : igModel.getConformanceProfiles()) {
      for (String key : cpModel.getValuesetMap().keySet()) {
        List<String> pathList = new LinkedList<String>(Arrays.asList(key.split("\\.")));
        SegmentRefOrGroupDataModel childModel =
            cpModel.findChildByPosition(Integer.parseInt(pathList.remove(0)));
        updateGroupOrSegmentRefModel(pathList, childModel, igModel,
            cpModel.getValuesetMap().get(key), toBeAddedDTs, toBeAddedSegs);
      }
    }


    for (String key : toBeAddedDTs.keySet()) {
      igModel.getDatatypes().add(toBeAddedDTs.get(key));
    }

    for (String key : toBeAddedSegs.keySet()) {
      igModel.getSegments().add(toBeAddedSegs.get(key));
    }
  }

  private void updateGroupOrSegmentRefModel(List<String> pathList,
      SegmentRefOrGroupDataModel sgModel, IgDataModel igModel,
      Set<ValuesetBindingDataModel> valuesetBindingDataModels,
      Map<String, DatatypeDataModel> toBeAddedDTs, Map<String, SegmentDataModel> toBeAddedSegs)
      throws ClassNotFoundException, IOException {
    if (sgModel.getType().equals(Type.GROUP)) {
      SegmentRefOrGroupDataModel childModel =
          sgModel.findChildByPosition(Integer.parseInt(pathList.remove(0)));
      updateGroupOrSegmentRefModel(pathList, childModel, igModel, valuesetBindingDataModels,
          toBeAddedDTs, toBeAddedSegs);
    } else {
      SegmentDataModel sModel = igModel.findSegment(sgModel.getSegment().getId());
      if (sModel == null)
        sModel = toBeAddedSegs.get(sgModel.getSegment().getId());
      SegmentDataModel copySModel = (SegmentDataModel) SerializationUtils.clone(sModel);
      int randumNum = new SecureRandom().nextInt(100000);
      copySModel.getModel().setId(sModel.getModel().getId() + "_A" + randumNum);
      String ext = sModel.getModel().getExt();
      if (ext == null)
        ext = "";
      copySModel.getModel().setExt(ext + "_A" + randumNum);

      if (pathList.size() == 1) {
        if (valuesetBindingDataModels != null && valuesetBindingDataModels.size() > 0) {
          valuesetBindingDataModels = this.makeCopySet(valuesetBindingDataModels);
          copySModel.getValuesetMap().put(pathList.get(0), valuesetBindingDataModels);
          FieldDataModel fModel =
              copySModel.findFieldDataModelByPosition(Integer.parseInt(pathList.get(0)));
          fModel.setValuesets(valuesetBindingDataModels);
        }
      } else if (pathList.size() > 1) {
        FieldDataModel fModel =
            copySModel.findFieldDataModelByPosition(Integer.parseInt(pathList.remove(0)));

        DatatypeDataModel childDtModel = igModel.findDatatype(fModel.getDatatype().getId());
        if (childDtModel == null)
          childDtModel = toBeAddedDTs.get(fModel.getDatatype().getId());
        DatatypeDataModel copyDtModel = (DatatypeDataModel) SerializationUtils.clone(childDtModel);

        int randumNum2 = new SecureRandom().nextInt(100000);
        copyDtModel.getModel().setId(childDtModel.getModel().getId() + "_A" + randumNum2);
        String ext2 = childDtModel.getModel().getExt();
        if (ext2 == null)
          ext2 = "";
        copyDtModel.getModel().setExt(ext2 + "_A" + randumNum2);
        toBeAddedDTs.put(copyDtModel.getModel().getId(), copyDtModel);
        fModel.getDatatype().setId(copyDtModel.getModel().getId());
        fModel.getDatatype().setExt(ext2 + "_A" + randumNum2);

        this.updateChildDatatype(pathList, copyDtModel, igModel, valuesetBindingDataModels,
            toBeAddedDTs);
      }
      sgModel.getSegment().setId(copySModel.getModel().getId());
      sgModel.getSegment().setExt(ext + "_A" + randumNum);
      toBeAddedSegs.put(copySModel.getModel().getId(), copySModel);
    }

  }

  private void updateChildDatatype(List<String> pathList, DatatypeDataModel dtModel,
      IgDataModel igModel, Set<ValuesetBindingDataModel> valuesetBindingDataModels,
      Map<String, DatatypeDataModel> toBeAddedDTs) throws ClassNotFoundException, IOException {
    if (pathList.size() == 1) {
      if (valuesetBindingDataModels != null && valuesetBindingDataModels.size() > 0) {
        valuesetBindingDataModels = this.makeCopySet(valuesetBindingDataModels);
        dtModel.getValuesetMap().put(pathList.get(0), valuesetBindingDataModels);
        ComponentDataModel cModel =
            dtModel.findComponentDataModelByPosition(Integer.parseInt(pathList.get(0)));
        cModel.setValuesets(valuesetBindingDataModels);
      }

    } else if (pathList.size() > 1) {
      ComponentDataModel cModel =
          dtModel.findComponentDataModelByPosition(Integer.parseInt(pathList.remove(0)));

      DatatypeDataModel childDtModel = igModel.findDatatype(cModel.getDatatype().getId());
      if (childDtModel == null)
        childDtModel = toBeAddedDTs.get(cModel.getDatatype().getId());
      DatatypeDataModel copyDtModel = (DatatypeDataModel) SerializationUtils.clone(childDtModel);

      int randumNum = new SecureRandom().nextInt(100000);
      copyDtModel.getModel().setId(childDtModel.getModel().getId() + "_A" + randumNum);
      String ext = childDtModel.getModel().getExt();
      if (ext == null)
        ext = "";
      copyDtModel.getModel().setExt(ext + "_A" + randumNum);
      toBeAddedDTs.put(copyDtModel.getModel().getId(), copyDtModel);
      cModel.getDatatype().setId(copyDtModel.getModel().getId());

      this.updateChildDatatype(pathList, copyDtModel, igModel, valuesetBindingDataModels,
          toBeAddedDTs);
    }

  }

  private Set<ValuesetBindingDataModel> makeCopySet(
      Set<ValuesetBindingDataModel> valuesetBindingDataModels)
      throws IOException, ClassNotFoundException {
    Set<ValuesetBindingDataModel> copy = new HashSet<ValuesetBindingDataModel>();
    for (ValuesetBindingDataModel o : valuesetBindingDataModels) {
      copy.add((ValuesetBindingDataModel) SerializationUtils.clone(o));
    }
    return copy;
  }


}