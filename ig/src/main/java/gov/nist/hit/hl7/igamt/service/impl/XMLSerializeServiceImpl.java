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

import gov.nist.hit.hl7.igamt.service.impl.exception.*;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;

import gov.nist.hit.hl7.igamt.common.base.domain.LengthType;
import gov.nist.hit.hl7.igamt.common.base.domain.Level;
import gov.nist.hit.hl7.igamt.common.base.domain.Link;
// import gov.nist.hit.hl7.igamt.coconstraints.domain.CoConstraintTable;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.Usage;
import gov.nist.hit.hl7.igamt.common.base.service.impl.InMemoryDomainExtensionServiceImpl;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.Group;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRefOrGroup;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.constraints.domain.AssertionConformanceStatement;
import gov.nist.hit.hl7.igamt.constraints.domain.AssertionPredicate;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatement;
import gov.nist.hit.hl7.igamt.constraints.domain.FreeTextConformanceStatement;
import gov.nist.hit.hl7.igamt.constraints.domain.FreeTextPredicate;
import gov.nist.hit.hl7.igamt.constraints.domain.Predicate;
import gov.nist.hit.hl7.igamt.constraints.domain.assertion.InstancePath;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Component;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.DateTimeConstraints;
import gov.nist.hit.hl7.igamt.datatype.domain.DateTimeDatatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
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
import gov.nist.hit.hl7.igamt.segment.domain.DynamicMappingItem;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.valueset.domain.Code;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.domain.property.ContentDefinition;
import gov.nist.hit.hl7.igamt.valueset.domain.property.Extensibility;
import gov.nist.hit.hl7.igamt.valueset.domain.property.Stability;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;
import nu.xom.Attribute;
import nu.xom.Builder;
import nu.xom.Document;
import nu.xom.Element;
import nu.xom.Elements;
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

  @Autowired
  DatatypeService datatypeService;

  @Autowired
  SegmentService segmentService;
  
  @Autowired
  ValuesetService valuesetService;

  @Autowired
  ConformanceProfileService conformanceProfileService;

  @Autowired
  SimpleCoConstraintXMLSerialization simpleCoConstraintXMLSerialization;

  @Autowired
  InMemoryDomainExtensionServiceImpl inMemoryDomainExtensionService;

  @Autowired
  GeneratePathService generatePathService;

  @Autowired
  AssertionXMLSerialization assertionXMLSerialization;
  
  /*
   * (non-Javadoc)
   * 
   * @see gov.nist.hit.hl7.igamt.ig.service.XMLSerializeService#serializeProfileToDoc(
   * gov.nist.hit.hl7. igamt.ig.domain.datamodel.IgDataModel)
   */
  @Override
  public Document serializeProfileToDoc(IgDataModel igModel) throws ProfileSerializationException {
    try {
      String defaultHL7Version = this.findDefaultHL7Version(igModel);
      Set<Datatype> missingDts = new HashSet<Datatype>();

      Element e = new Element("ConformanceProfile");
      this.serializeProfileMetaData(e, igModel, "Validation", defaultHL7Version);

      Element ms = new Element("Messages");
      for (ConformanceProfileDataModel cpModel : igModel.getConformanceProfiles()) {
        ms.appendChild(this.serializeConformanceProfile(cpModel, igModel, defaultHL7Version));
      }
      e.appendChild(ms);

      Element ss = new Element("Segments");
      for (SegmentDataModel sModel : igModel.getSegments()) {
        ss.appendChild(this.serializeSegment(sModel, igModel, missingDts, defaultHL7Version));
      }
      e.appendChild(ss);

      Element ds = new Element("Datatypes");
      for (DatatypeDataModel dModel : igModel.getDatatypes()) {
        ds.appendChild(this.serializeDatatype(dModel, igModel, defaultHL7Version));
      }

      for (Datatype dt : missingDts) {
        ds.appendChild(this.serializeSimpleDatatype(dt, igModel, defaultHL7Version));
      }

      e.appendChild(ds);

      Document doc = new Document(e);

      return doc;
    } catch (Exception e) {
      e.printStackTrace();
      throw new ProfileSerializationException(e, igModel != null ? igModel.getModel().getId() : "");
    }
  }

  @Override
  public Element serializeCoConstraintXML(IgDataModel igModel) throws CoConstraintXMLSerializationException {

      Element ccc = new Element("CoConstraintContext");
      for(ConformanceProfileDataModel cpModel : igModel.getConformanceProfiles()) {
        Element message = this.simpleCoConstraintXMLSerialization.serialize(cpModel.getModel());
        if(message != null) {
          ccc.appendChild(message);
        }
      }
      return ccc;
  }

  private String findDefaultHL7Version(IgDataModel igModel) {
	  if(igModel.getModel().getMetadata() != null &&
  			igModel.getModel().getMetadata().getHl7Versions() != null && 
  			igModel.getModel().getMetadata().getHl7Versions().size() > 0) {
  		return igModel.getModel().getMetadata().getHl7Versions().get(0);
  	}
	  
	  
	  if(igModel.getModel().getConformanceProfileRegistry() != null && 
			  igModel.getModel().getConformanceProfileRegistry().getChildren()	!= null &&
			  igModel.getModel().getConformanceProfileRegistry().getChildren().size() > 0) {
		  for(Link l : igModel.getModel().getConformanceProfileRegistry().getChildren()) {
			  if(l.getDomainInfo() != null && l.getDomainInfo().getVersion() != null)
				  return l.getDomainInfo().getVersion();
		  }
	  }
	return "NOTFOUND";
}

/**
   * @param dt
   * @param igModel
   * @return
   * @throws DatatypeSerializationException
   */
  private Element serializeSimpleDatatype(Datatype dt, IgDataModel igModel, String defaultHL7Version)
      throws DatatypeSerializationException {
    try {
      Element elmDatatype = new Element("Datatype");

      if (defaultHL7Version != null && dt.getDomainInfo() != null && dt.getDomainInfo().getVersion() != null) {
        if (defaultHL7Version.equals(dt.getDomainInfo().getVersion())) {
          elmDatatype.addAttribute(new Attribute("Label", this.str(dt.getLabel())));
          elmDatatype.addAttribute(new Attribute("ID", this.str(dt.getLabel())));
        } else {
          elmDatatype.addAttribute(new Attribute("Label", this.str(dt.getLabel() + "_" + dt.getDomainInfo().getVersion().replaceAll("\\.", "-"))));
          elmDatatype.addAttribute(new Attribute("ID", this.str(dt.getLabel() + "_" + dt.getDomainInfo().getVersion().replaceAll("\\.", "-"))));
        }
      } else {
        elmDatatype.addAttribute(new Attribute("Label", this.str(dt.getLabel())));
        elmDatatype.addAttribute(new Attribute("ID", this.str(dt.getLabel())));
      }

      elmDatatype.addAttribute(new Attribute("Name", this.str(dt.getName())));
      elmDatatype.addAttribute(new Attribute("Label", this.str(dt.getLabel())));
      elmDatatype.addAttribute(new Attribute("Version", this.str(dt.getDomainInfo().getVersion())));
      if (dt.getDescription() == null || dt.getDescription().equals("")) {
        elmDatatype.addAttribute(new Attribute("Description", "NoDesc"));
      } else {
        elmDatatype.addAttribute(new Attribute("Description", this.str(dt.getDescription())));
      }

      if (dt instanceof ComplexDatatype) {
        ComplexDatatype complexDatatype = (ComplexDatatype) dt;
        if (complexDatatype.getComponents() != null) {
          Map<Integer, Component> components = new HashMap<Integer, Component>();
          for (Component c : complexDatatype.getComponents()) {
            components.put(c.getPosition(), c);
          }
          for (int i = 1; i < components.size() + 1; i++) {
            try {
              Component c = components.get(i);
              Element elmComponent = new Element("Component");

              elmComponent.addAttribute(new Attribute("Name", this.str(c.getName())));
              elmComponent.addAttribute(new Attribute("Usage", this.str(this.changeCABtoC(c.getUsage()).toString())));

              String childDTId = c.getRef().getId();
              Datatype childDT = this.datatypeService.findById(childDTId);

              if (defaultHL7Version != null && childDT.getDomainInfo() != null && childDT.getDomainInfo().getVersion() != null) {
                if (defaultHL7Version.equals(childDT.getDomainInfo().getVersion())) {
                  elmComponent
                      .addAttribute(new Attribute("Datatype", this.str(childDT.getLabel())));
                } else {
                  elmComponent.addAttribute(new Attribute("Datatype", this.str(childDT.getLabel()
                      + "_" + childDT.getDomainInfo().getVersion().replaceAll("\\.", "-"))));
                }
              } else {
                elmComponent.addAttribute(new Attribute("Datatype", this.str(childDT.getLabel())));
              }
              
              if(c.getLengthType().equals(LengthType.Length)) {
            	  elmComponent.addAttribute(new Attribute("ConfLength", "NA"));
            	  
            	  if (c.getMinLength() != null && !c.getMinLength().isEmpty()) {
                      elmComponent.addAttribute(new Attribute("MinLength", this.str(c.getMinLength())));

                    } else {
                      elmComponent.addAttribute(new Attribute("MinLength", "NA"));
                    }

                    if (c.getMaxLength() != null && !c.getMaxLength().isEmpty()) {
                      elmComponent.addAttribute(new Attribute("MaxLength", this.str(c.getMaxLength())));

                    } else {
                      elmComponent.addAttribute(new Attribute("MaxLength", "NA"));

                    }
            	  
            	  
              } else if(c.getLengthType().equals(LengthType.ConfLength)) {
            	  elmComponent.addAttribute(new Attribute("MinLength", "NA"));
            	  elmComponent.addAttribute(new Attribute("MaxLength", "NA"));
            	  
                    if (c.getConfLength() != null && !c.getConfLength().equals("")) {
                      elmComponent.addAttribute(new Attribute("ConfLength", this.str(c.getConfLength())));
                    } else {
                      elmComponent.addAttribute(new Attribute("ConfLength", "NA"));
                    }
            	  
              } else {
            	  if (c.getMinLength() != null && !c.getMinLength().isEmpty()) {
                      elmComponent.addAttribute(new Attribute("MinLength", this.str(c.getMinLength())));

                    } else {
                      elmComponent.addAttribute(new Attribute("MinLength", "NA"));
                    }

                    if (c.getMaxLength() != null && !c.getMaxLength().isEmpty()) {
                      elmComponent.addAttribute(new Attribute("MaxLength", this.str(c.getMaxLength())));

                    } else {
                      elmComponent.addAttribute(new Attribute("MaxLength", "NA"));

                    }
                    if (c.getConfLength() != null && !c.getConfLength().equals("")) {
                      elmComponent.addAttribute(new Attribute("ConfLength", this.str(c.getConfLength())));
                    } else {
                      elmComponent.addAttribute(new Attribute("ConfLength", "NA"));
                    }	  
              }

              
              elmDatatype.appendChild(elmComponent);
            } catch (Exception e) {
              throw new DatatypeComponentSerializationException(e, i);
            }
          }
        }
      }

      return elmDatatype;
    } catch (Exception e) {
      throw new DatatypeSerializationException(e, dt.getLabel());
    }
  }

  /*
   * (non-Javadoc)
   * 
   * @see gov.nist.hit.hl7.igamt.ig.service.XMLSerializeService#serializeValueSetXML(
   * gov.nist.hit.hl7. igamt.ig.domain.datamodel.IgDataModel)
   */
  @Override
  public Element serializeValueSetXML(IgDataModel igModel) throws TableSerializationException {
    String defaultHL7Version = this.findDefaultHL7Version(igModel);
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
          !this.str(defaultHL7Version).equals("")
              ? this.str(defaultHL7Version) : "No Version Info"));
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
        // HashMap<String, Boolean> codePresenceMap =
        // profile.getTableLibrary().getCodePresence();
        Valueset t = vsm.getModel();

        if (t != null) {
          if (t.getCodes() == null || t.getCodes().size() == 0 || t.getCodes().size() > 500
              || (t.getCodes().size() == 1
                  && new ArrayList<Code>(t.getCodes()).get(0).getValue().equals("..."))) {
            // || (codePresenceMap.containsKey(t.getId()) &&
            // !(codePresenceMap.get(t.getId())))) {
            Element elmBindingIdentifier = new Element("BindingIdentifier");
            if (defaultHL7Version != null && t.getDomainInfo() != null && t.getDomainInfo().getVersion() != null && !t.getBindingIdentifier().equals("HL70396")) {
              if (defaultHL7Version
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

          if (defaultHL7Version != null && t.getDomainInfo() != null && t.getDomainInfo().getVersion() != null && !t.getBindingIdentifier().equals("HL70396")) {
            if (defaultHL7Version.equals(t.getDomainInfo().getVersion())) {
              elmValueSetDefinition.addAttribute(
                  new Attribute("BindingIdentifier", this.str(t.getBindingIdentifier())));
            } else {
              elmValueSetDefinition
                  .addAttribute(new Attribute("BindingIdentifier", this.str(t.getBindingIdentifier()
                      + "_" + t.getDomainInfo().getVersion().replaceAll("\\.", "-"))));
            }
          } else {
            elmValueSetDefinition.addAttribute(
                new Attribute("BindingIdentifier", this.str(t.getBindingIdentifier())));
          }

          elmValueSetDefinition.addAttribute(new Attribute("Name", this.str(t.getName())));
          if (t.getName() != null && !t.getName().equals(""))
            elmValueSetDefinition.addAttribute(new Attribute("Description", this.str(t.getName())));
          if (t.getDomainInfo().getVersion() != null && !t.getDomainInfo().getVersion().equals(""))
            elmValueSetDefinition
                .addAttribute(new Attribute("Version", this.str(t.getDomainInfo().getVersion())));
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
              elmValueElement
                  .addAttribute(new Attribute("DisplayName", this.str(c.getDescription() + "")));
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

  @Override
  public Element serializeConstraintsXML(IgDataModel igModel) {
	String defaultHL7Version = this.findDefaultHL7Version(igModel);
    Element e = new Element("ConformanceContext");
    Attribute schemaDecl = new Attribute("noNamespaceSchemaLocation",
        "https://raw.githubusercontent.com/Jungyubw/NIST_healthcare_hl7_v2_profile_schema/master/Schema/NIST%20Validation%20Schema/ConformanceContext.xsd");
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
          !this.str(defaultHL7Version).equals("")
              ? this.str(defaultHL7Version) : "No Version Info"));
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

    this.serializeMain(e, igModel, defaultHL7Version);

    return e;
  }

  /**
   * @param e
   * @param igModel
   */
  private void serializeMain(Element e, IgDataModel igModel, String defaultHL7Version) {
    Element predicates_Elm = new Element("Predicates");

    Element predicates_dataType_Elm = new Element("Datatype");
    for (DatatypeDataModel dtModel : igModel.getDatatypes()) {

      Element elm_ByID = new Element("ByID");
      if (defaultHL7Version != null
          && dtModel.getModel().getDomainInfo() != null
          && dtModel.getModel().getDomainInfo().getVersion() != null) {
        if (defaultHL7Version
            .equals(dtModel.getModel().getDomainInfo().getVersion())) {
          elm_ByID.addAttribute(new Attribute("ID", dtModel.getModel().getLabel()));
        } else {
          elm_ByID.addAttribute(new Attribute("ID", dtModel.getModel().getLabel() + "_"
              + dtModel.getModel().getDomainInfo().getVersion().replaceAll("\\.", "-")));
        }
      } else {
        elm_ByID.addAttribute(new Attribute("ID", dtModel.getModel().getLabel()));
      }

      if (dtModel.getPredicateMap() != null && dtModel.getPredicateMap().size() > 0) {
        for (String key : dtModel.getPredicateMap().keySet()) {

          Predicate p = dtModel.getPredicateMap().get(key);

          
          String script = this.generateConditionScript(p, dtModel.getModel().getId());
          if(script != null) {
              Element elm_Constraint = new Element("Predicate");          
              elm_Constraint.addAttribute(new Attribute("Target", this.bindingInstanceNum(key)));
              elm_Constraint.addAttribute(new Attribute("TrueUsage", p.getTrueUsage().toString()));
              elm_Constraint.addAttribute(new Attribute("FalseUsage", p.getFalseUsage().toString()));
              Element elm_Description = new Element("Description");
              elm_Description.appendChild(p.generateDescription());
              elm_Constraint.appendChild(elm_Description);
              elm_Constraint.appendChild(this.innerXMLHandler(script));
              elm_ByID.appendChild(elm_Constraint);        	  
          }

        }
      }

      if (elm_ByID.getChildElements() != null && elm_ByID.getChildElements().size() > 0) {
        predicates_dataType_Elm.appendChild(elm_ByID);
      }
    }
    predicates_Elm.appendChild(predicates_dataType_Elm);

    Element predicates_segment_Elm = new Element("Segment");
    for (SegmentDataModel segModel : igModel.getSegments()) {

      Element elm_ByID = new Element("ByID");
      if (defaultHL7Version != null
          && segModel.getModel().getDomainInfo() != null
          && segModel.getModel().getDomainInfo().getVersion() != null) {
        if (defaultHL7Version.equals(segModel.getModel().getDomainInfo().getVersion())) {
          elm_ByID.addAttribute(new Attribute("ID", segModel.getModel().getLabel()));
        } else {
          elm_ByID.addAttribute(new Attribute("ID", segModel.getModel().getLabel() + "_"
              + segModel.getModel().getDomainInfo().getVersion().replaceAll("\\.", "-")));
        }
      } else {
        elm_ByID.addAttribute(new Attribute("ID", segModel.getModel().getLabel()));
      }

      if (segModel.getPredicateMap() != null && segModel.getPredicateMap().size() > 0) {
        for (String key : segModel.getPredicateMap().keySet()) {

          Predicate p = segModel.getPredicateMap().get(key);

          String script = this.generateConditionScript(p, segModel.getModel().getId());
          if(script != null) {
        	  Element elm_Constraint = new Element("Predicate");
              elm_Constraint.addAttribute(new Attribute("Target", this.bindingInstanceNum(key)));
              elm_Constraint.addAttribute(new Attribute("TrueUsage", p.getTrueUsage().toString()));
              elm_Constraint.addAttribute(new Attribute("FalseUsage", p.getFalseUsage().toString()));
              Element elm_Description = new Element("Description");
              elm_Description.appendChild(p.generateDescription());
              elm_Constraint.appendChild(elm_Description);
              elm_Constraint.appendChild(this.innerXMLHandler(script));
              elm_ByID.appendChild(elm_Constraint);	  
          }
        }
      }
      

      if (elm_ByID.getChildElements() != null && elm_ByID.getChildElements().size() > 0) {
        predicates_segment_Elm.appendChild(elm_ByID);
      }
    }
    predicates_Elm.appendChild(predicates_segment_Elm);

    Element predicates_Group_Elm = new Element("Group");
    for (ConformanceProfileDataModel cpModel : igModel.getConformanceProfiles()) {
      if (cpModel.getPredicateMap() != null && cpModel.getPredicateMap().size() > 0) {
        for (String key : cpModel.getPredicateMap().keySet()) {

          Predicate p = cpModel.getPredicateMap().get(key);

          if (p.getContext() != null && p.getContext().getElementId() != null) {

            int count = countContextChild(p.getContext(), 1);
            String groupKey = "";

            for (int i = count; i < key.split("\\.").length; i++) {
              if (count + 1 == key.split("\\.").length)
                groupKey = groupKey + key.split("\\.")[i];
              else
                groupKey = groupKey + key.split("\\.")[i] + ".";
            }
            Element elm_ByID = this.findOrCreatByIDElement(predicates_Group_Elm, p.getContext(), cpModel.getModel());
            p.setLevel(Level.GROUP);
            String script = this.generateConditionScript(p, cpModel.getModel().getId());
            if(script != null) {
                Element elm_Constraint = new Element("Predicate");
                elm_Constraint.addAttribute(new Attribute("Target", this.bindingInstanceNum(groupKey)));
                elm_Constraint.addAttribute(new Attribute("TrueUsage", p.getTrueUsage().toString()));
                elm_Constraint.addAttribute(new Attribute("FalseUsage", p.getFalseUsage().toString()));
                Element elm_Description = new Element("Description");
                elm_Description.appendChild(p.generateDescription());
                elm_Constraint.appendChild(elm_Description);
                elm_Constraint.appendChild(this.innerXMLHandler(script));
                elm_ByID.appendChild(elm_Constraint);            	
            }
            

          }
        }
      }
    }
    predicates_Elm.appendChild(predicates_Group_Elm);

    Element predicates_Message_Elm = new Element("Message");
    for (ConformanceProfileDataModel cpModel : igModel.getConformanceProfiles()) {

      Element elm_ByID = new Element("ByID");
      elm_ByID.addAttribute(new Attribute("ID", cpModel.getModel().getId()));

      if (cpModel.getPredicateMap() != null && cpModel.getPredicateMap().size() > 0) {
        for (String key : cpModel.getPredicateMap().keySet()) {

          Predicate p = cpModel.getPredicateMap().get(key);

      	if (p.getContext() == null || p.getContext().getElementId() == null) {
      		  p.setLevel(Level.CONFORMANCEPROFILE);
        	  String script = this.generateConditionScript(p, cpModel.getModel().getId());
        	  if(script != null) {
                  Element elm_Constraint = new Element("Predicate");
                  elm_Constraint.addAttribute(new Attribute("Target", this.bindingInstanceNum(key)));
                  elm_Constraint.addAttribute(new Attribute("TrueUsage", p.getTrueUsage().toString()));
                  elm_Constraint.addAttribute(new Attribute("FalseUsage", p.getFalseUsage().toString()));
                  Element elm_Description = new Element("Description");
                  elm_Description.appendChild(p.generateDescription());
                  elm_Constraint.appendChild(elm_Description);
                  elm_Constraint.appendChild(this.innerXMLHandler(script));
                  elm_ByID.appendChild(elm_Constraint);        		  
        	  }
          }
        }
      }

      if (elm_ByID.getChildElements() != null && elm_ByID.getChildElements().size() > 0) {
        predicates_Message_Elm.appendChild(elm_ByID);
      }
    }
    predicates_Elm.appendChild(predicates_Message_Elm);

    Element constraints_Elm = new Element("Constraints");
    Element constraints_dataType_Elm = new Element("Datatype");
    for (DatatypeDataModel dtModel : igModel.getDatatypes()) {

      Element elm_ByID = new Element("ByID");
      if (defaultHL7Version != null
          && dtModel.getModel().getDomainInfo() != null
          && dtModel.getModel().getDomainInfo().getVersion() != null) {
        if (defaultHL7Version
            .equals(dtModel.getModel().getDomainInfo().getVersion())) {
          elm_ByID.addAttribute(new Attribute("ID", dtModel.getModel().getLabel()));
        } else {
          elm_ByID.addAttribute(new Attribute("ID", dtModel.getModel().getLabel() + "_"
              + dtModel.getModel().getDomainInfo().getVersion().replaceAll("\\.", "-")));
        }
      } else {
        elm_ByID.addAttribute(new Attribute("ID", dtModel.getModel().getLabel()));
      }

      if (dtModel.getConformanceStatements() != null && dtModel.getConformanceStatements().size() > 0) {
        for (ConformanceStatement cs : dtModel.getConformanceStatements()) {
        	
        	String script = this.generateAssertionScript(cs, dtModel.getModel().getId());
        	
        	if(script != null) {
                Element elm_Constraint = new Element("Constraint");
                elm_Constraint.addAttribute(new Attribute("ID", cs.getIdentifier()));
                Element elm_Description = new Element("Description");
                elm_Description.appendChild(cs.generateDescription());
                elm_Constraint.appendChild(elm_Description);
                elm_Constraint.appendChild(this.innerXMLHandler(script));
                elm_ByID.appendChild(elm_Constraint);        		
        	}
        }
      }

      Datatype dt = dtModel.getModel();

      if (dt.getName().equals("DTM") || dt.getName().equals("TM") || dt.getName().equals("DT")) {
        DateTimeConstraints dateTimeConstraints = null;

        if (dt instanceof DateTimeDatatype) {
          dateTimeConstraints = ((DateTimeDatatype) dt).getDateTimeConstraints();
        }

        if (dateTimeConstraints == null || dateTimeConstraints.getErrorMessage() == null
            || dateTimeConstraints.getErrorMessage().isEmpty()
            || dateTimeConstraints.getRegex() == null || dateTimeConstraints.getRegex().isEmpty()) {
          dateTimeConstraints = new DateTimeConstraints();
          if (dt.getName().equals("DTM")) {
            Element elm_Constraint = new Element("Constraint");
            elm_Constraint.addAttribute(new Attribute("ID", dt.getLabel() + "_DateTimeConstraint"));
            Element elm_Description = new Element("Description");
            elm_Description.appendChild(
                "The value SHALL follow the Date/Time pattern 'YYYY[MM[DD[HH[MM[SS[.S[S[S[S]]]]]]]]][+/-ZZZZ]'.");
            elm_Constraint.appendChild(elm_Description);
            elm_Constraint.appendChild(this.innerXMLHandler("<Assertion><Format Path=\".\" Regex=\""
                + XMLManager.parsingSpecialforXml(
                    "^(\\d{4}|\\d{6}|\\d{8}|\\d{10}|\\d{12}|\\d{14}|\\d{14}\\.\\d|\\d{14}\\.\\d{2}|\\d{14}\\.\\d{3}|\\d{14}\\.\\d{4})([+-]\\d{4})?$")
                + "\"/></Assertion>"));
            elm_ByID.appendChild(elm_Constraint);
          } else if (dt.getName().equals("DT")) {
            Element elm_Constraint = new Element("Constraint");
            elm_Constraint.addAttribute(new Attribute("ID", dt.getLabel() + "_DateTimeConstraint"));
            Element elm_Description = new Element("Description");
            elm_Description
                .appendChild("The value SHALL follow the Date/Time pattern 'YYYY[MM[DD]]'.");
            elm_Constraint.appendChild(elm_Description);
            elm_Constraint.appendChild(this.innerXMLHandler("<Assertion><Format Path=\".\" Regex=\""
                + XMLManager.parsingSpecialforXml("^(\\d{4}|\\d{6}|\\d{8})$")
                + "\"/></Assertion>"));
            elm_ByID.appendChild(elm_Constraint);
          } else if (dt.getName().equals("TM")) {
            Element elm_Constraint = new Element("Constraint");
            elm_Constraint.addAttribute(new Attribute("ID", dt.getLabel() + "_DateTimeConstraint"));
            Element elm_Description = new Element("Description");
            elm_Description.appendChild(
                "The value SHALL follow the Date/Time pattern 'HH[MM[SS[.S[S[S[S]]]]]][+/-ZZZZ]'.");
            elm_Constraint.appendChild(elm_Description);
            elm_Constraint.appendChild(this.innerXMLHandler("<Assertion><Format Path=\".\" Regex=\""
                + XMLManager.parsingSpecialforXml(
                    "^(\\d{2}|\\d{4}|\\d{6}|\\d{6}\\.\\d|\\d{6}\\.\\d{2}|\\d{6}\\.\\d{3}|\\d{6}\\.\\d{4})([+-]\\d{4})?$")
                + "\"/></Assertion>"));
            elm_ByID.appendChild(elm_Constraint);
          }
        } else {
          Element elm_Constraint = new Element("Constraint");
          elm_Constraint.addAttribute(new Attribute("ID", dt.getLabel() + "_DateTimeConstraint"));
          Element elm_Description = new Element("Description");
          elm_Description.appendChild(dateTimeConstraints.getErrorMessage());
          elm_Constraint.appendChild(elm_Description);
          elm_Constraint.appendChild(this.innerXMLHandler("<Assertion><Format Path=\".\" Regex=\""
              + XMLManager.parsingSpecialforXml(dateTimeConstraints.getRegex())
              + "\"/></Assertion>"));
          elm_ByID.appendChild(elm_Constraint);
        }
      }

      if (elm_ByID.getChildElements() != null && elm_ByID.getChildElements().size() > 0) {
        constraints_dataType_Elm.appendChild(elm_ByID);
      }
    }
    constraints_Elm.appendChild(constraints_dataType_Elm);

    Element constraints_segment_Elm = new Element("Segment");
    for (SegmentDataModel segModel : igModel.getSegments()) {

      Element elm_ByID = new Element("ByID");
      if (defaultHL7Version != null
          && segModel.getModel().getDomainInfo() != null
          && segModel.getModel().getDomainInfo().getVersion() != null) {
        if (defaultHL7Version
            .equals(segModel.getModel().getDomainInfo().getVersion())) {
          elm_ByID.addAttribute(new Attribute("ID", segModel.getModel().getLabel()));
        } else {
          elm_ByID.addAttribute(new Attribute("ID", segModel.getModel().getLabel() + "_"
              + segModel.getModel().getDomainInfo().getVersion().replaceAll("\\.", "-")));
        }
      } else {
        elm_ByID.addAttribute(new Attribute("ID", segModel.getModel().getLabel()));
      }

      if (segModel.getConformanceStatements() != null
          && segModel.getConformanceStatements().size() > 0) {
        for (ConformanceStatement cs : segModel.getConformanceStatements()) {
        	
        	String script = this.generateAssertionScript(cs, segModel.getModel().getId());

        	
        	if(script != null) {
            	Node scriptNode = this.innerXMLHandler(script);
            	if(scriptNode != null) {
            		Element elm_Constraint = new Element("Constraint");
                    elm_Constraint.addAttribute(new Attribute("ID", cs.getIdentifier()));
                    Element elm_Description = new Element("Description");
                    elm_Description.appendChild(cs.generateDescription());
                    elm_Constraint.appendChild(elm_Description);
                    elm_Constraint.appendChild(this.innerXMLHandler(script));
                    elm_ByID.appendChild(elm_Constraint);      	
            	}  		
        	}
        }
      }

      if (elm_ByID.getChildElements() != null && elm_ByID.getChildElements().size() > 0) {
        constraints_segment_Elm.appendChild(elm_ByID);
      }
    }
    constraints_Elm.appendChild(constraints_segment_Elm);

    Element constraints_group_Elm = new Element("Group");
    for (ConformanceProfileDataModel cpModel : igModel.getConformanceProfiles()) {

      if (cpModel.getConformanceStatements() != null
          && cpModel.getConformanceStatements().size() > 0) {
        for (ConformanceStatement cs : cpModel.getConformanceStatements()) {
          if (cs.getContext() != null && cs.getContext().getElementId() != null) {
            Element elm_ByID = this.findOrCreatByIDElement(constraints_group_Elm, cs.getContext(), cpModel.getModel());
            cs.setLevel(Level.GROUP);
            String script = this.generateAssertionScript(cs, cpModel.getModel().getId());
            if (script != null) {
            	Element elm_Constraint = new Element("Constraint");
                elm_Constraint.addAttribute(new Attribute("ID", cs.getIdentifier()));
                Element elm_Description = new Element("Description");
                elm_Description.appendChild(cs.generateDescription());
                elm_Constraint.appendChild(elm_Description);
                elm_Constraint.appendChild(this.innerXMLHandler(script));
                elm_ByID.appendChild(elm_Constraint);	
            }
          }
        }
      }
    }
    constraints_Elm.appendChild(constraints_group_Elm);

    Element constraints_message_Elm = new Element("Message");
    for (ConformanceProfileDataModel cpModel : igModel.getConformanceProfiles()) {

      Element elm_ByID = new Element("ByID");
      elm_ByID.addAttribute(new Attribute("ID", cpModel.getModel().getId()));

      if (cpModel.getConformanceStatements() != null
          && cpModel.getConformanceStatements().size() > 0) {
        for (ConformanceStatement cs : cpModel.getConformanceStatements()) {
        	if (cs.getContext() == null || cs.getContext().getElementId() == null) {
        	  cs.setLevel(Level.CONFORMANCEPROFILE);
        	  String script = this.generateAssertionScript(cs, cpModel.getModel().getId());
        	  if(script != null) {
        		  Element elm_Constraint = new Element("Constraint");
                  elm_Constraint.addAttribute(new Attribute("ID", cs.getIdentifier()));
                  Element elm_Description = new Element("Description");
                  elm_Description.appendChild(cs.generateDescription());
                  elm_Constraint.appendChild(elm_Description);
                  elm_Constraint.appendChild(this.innerXMLHandler(script));
                  elm_ByID.appendChild(elm_Constraint);	  
        	  }
            
          }
        }
      }

      if (elm_ByID.getChildElements() != null && elm_ByID.getChildElements().size() > 0) {
        constraints_message_Elm.appendChild(elm_ByID);
      }
    }
    constraints_Elm.appendChild(constraints_message_Elm);

    e.appendChild(predicates_Elm);
    e.appendChild(constraints_Elm);

  }

  /**
   * @param constraints_group_Elm
   * @param context
   * @param conformanceProfile
   * @return
   */
  private Element findOrCreatByIDElement(Element constraints_group_Elm, InstancePath context,
      ConformanceProfile conformanceProfile) {
    Group group = this.findGroupByContext(context, conformanceProfile.getChildren());
    Elements elements = constraints_group_Elm.getChildElements("ByID");
    if (elements != null && elements.size() > 0) {
      for (int i = 0; i < elements.size(); i++) {
        if (elements.get(i).getAttribute("ID").getValue()
            .equals(conformanceProfile.getId() + "-" + group.getId())) {
          return elements.get(i);
        }
      }
    }

    Element elm_ByID = new Element("ByID");
    elm_ByID.addAttribute(new Attribute("ID", conformanceProfile.getId() + "-" + group.getId()));
    constraints_group_Elm.appendChild(elm_ByID);
    return elm_ByID;
  }

  private Group findGroupByContext(InstancePath context, Set<SegmentRefOrGroup> set) {
    for (SegmentRefOrGroup srog : set) {
      if (srog.getId().equals(context.getElementId())) {
        if (context.getChild() == null)
          return (Group) srog;
        else
          return findGroupByContext(context.getChild(), ((Group) srog).getChildren());
      }
    }
    return null;
  }


  private int countContextChild(InstancePath path, int result) {
	    if (path.getChild() == null)
	      return result;
	    else
	      return countContextChild(path.getChild(), result + 1);
	  }


  private String bindingInstanceNum(String keyStr) {
    String[] keys = keyStr.split("\\.");
    for (int i = 0; i < keys.length; i++) {
      keys[i] = keys[i] + "[1]";
    }
    return String.join(".", keys);
  }

  private Node innerXMLHandler(String xml) {
    if (xml != null && !xml.equals("")) {
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

  private Element serializeDatatype(DatatypeDataModel dModel, IgDataModel igModel, String defaultHL7Version)
      throws DatatypeSerializationException {
    try {
      Element elmDatatype = new Element("Datatype");

      if (defaultHL7Version != null
          && dModel.getModel().getDomainInfo() != null
          && dModel.getModel().getDomainInfo().getVersion() != null) {
        if (defaultHL7Version
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
                .addAttribute(new Attribute("Usage", this.str(this.changeCABtoC(c.getModel().getUsage()).toString())));

            if (defaultHL7Version != null
                && c.getDatatype().getDomainInfo() != null
                && c.getDatatype().getDomainInfo().getVersion() != null) {
              if (defaultHL7Version
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
            
            if(c.getModel().getLengthType().equals(LengthType.Length)) {
          	  elmComponent.addAttribute(new Attribute("ConfLength", "NA"));
          	  
          	  if (c.getModel().getMinLength() != null && !c.getModel().getMinLength().isEmpty()) {
                    elmComponent.addAttribute(new Attribute("MinLength", this.str(c.getModel().getMinLength())));

                  } else {
                    elmComponent.addAttribute(new Attribute("MinLength", "NA"));
                  }

                  if (c.getModel().getMaxLength() != null && !c.getModel().getMaxLength().isEmpty()) {
                    elmComponent.addAttribute(new Attribute("MaxLength", this.str(c.getModel().getMaxLength())));

                  } else {
                    elmComponent.addAttribute(new Attribute("MaxLength", "NA"));

                  }
          	  
          	  
            } else if(c.getModel().getLengthType().equals(LengthType.ConfLength)) {
          	  elmComponent.addAttribute(new Attribute("MinLength", "NA"));
          	  elmComponent.addAttribute(new Attribute("MaxLength", "NA"));
          	  
                  if (c.getModel().getConfLength() != null && !c.getModel().getConfLength().equals("")) {
                    elmComponent.addAttribute(new Attribute("ConfLength", this.str(c.getModel().getConfLength())));
                  } else {
                    elmComponent.addAttribute(new Attribute("ConfLength", "NA"));
                  }
          	  
            } else {
          	  if (c.getModel().getMinLength() != null && !c.getModel().getMinLength().isEmpty()) {
                    elmComponent.addAttribute(new Attribute("MinLength", this.str(c.getModel().getMinLength())));

                  } else {
                    elmComponent.addAttribute(new Attribute("MinLength", "NA"));
                  }

                  if (c.getModel().getMaxLength() != null && !c.getModel().getMaxLength().isEmpty()) {
                    elmComponent.addAttribute(new Attribute("MaxLength", this.str(c.getModel().getMaxLength())));

                  } else {
                    elmComponent.addAttribute(new Attribute("MaxLength", "NA"));

                  }
                  if (c.getModel().getConfLength() != null && !c.getModel().getConfLength().equals("")) {
                    elmComponent.addAttribute(new Attribute("ConfLength", this.str(c.getModel().getConfLength())));
                  } else {
                    elmComponent.addAttribute(new Attribute("ConfLength", "NA"));
                  }	  
            }
            
            Set<ValuesetBindingDataModel> valueSetBindings = c.getValuesets();
            if (valueSetBindings != null && valueSetBindings.size() > 0) {
              String bindingString = "";
              String bindingStrength = null;
              Set<Integer> bindingLocation = null;

              
              for (ValuesetBindingDataModel binding : valueSetBindings) {
                try {
                  if (binding.getValuesetBinding().getStrength() != null)
                    bindingStrength = binding.getValuesetBinding().getStrength().toString();
                  if (binding.getValuesetBinding().getValuesetLocations() != null
                      && binding.getValuesetBinding().getValuesetLocations().size() > 0)
                    bindingLocation = binding.getValuesetBinding().getValuesetLocations();
                  if (binding != null && binding.getBindingIdentifier() != null
                      && !binding.getBindingIdentifier().equals("")) {
                    if (defaultHL7Version != null
                        && binding.getDomainInfo() != null
                        && binding.getDomainInfo().getVersion() != null) {
                      if (defaultHL7Version.equals(binding.getDomainInfo().getVersion()) || binding.getBindingIdentifier().equals("HL70396")) {
                        bindingString = bindingString + binding.getBindingIdentifier() + ":";
                      } else {
                        bindingString = bindingString + binding.getBindingIdentifier() + "_" + binding.getDomainInfo().getVersion().replaceAll("\\.", "-") + ":";
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
              if (!this.isPrimitiveDatatype(c.getDatatype().getName()) && bindingLocation != null && bindingLocation.size() > 0) {
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

  private boolean isPrimitiveDatatype(String dtName) {
	  Set<String> primitiveDTs = new HashSet<String>(Arrays.asList(new String[] {"ID","IS","ST","NM"}));
	return primitiveDTs.contains(dtName);
}

private Element serializeSegment(SegmentDataModel sModel, IgDataModel igModel, Set<Datatype> missingDts, String defaultHL7Version) throws SegmentSerializationException {
    try {
      // TODO DynamicMapping Need
      Element elmSegment = new Element("Segment");

      if (defaultHL7Version != null
          && sModel.getModel().getDomainInfo() != null
          && sModel.getModel().getDomainInfo().getVersion() != null) {
        if (defaultHL7Version.equals(sModel.getModel().getDomainInfo().getVersion())) {
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
      elmSegment.addAttribute(new Attribute("Version", this.str(sModel.getModel().getDomainInfo().getVersion())));
      if (sModel.getModel().getDescription() == null || sModel.getModel().getDescription().equals("")) {
        elmSegment.addAttribute(new Attribute("Description", "NoDesc"));
      } else {
        elmSegment.addAttribute(
            new Attribute("Description", this.str(sModel.getModel().getDescription())));
      }

      // DynamicMapping
      if (sModel.getModel().getName().equals("OBX") 
    		  && sModel.getModel().getDynamicMappingInfo() != null 
    		  && sModel.getModel().getDynamicMappingInfo().getItems() != null
    		  && sModel.getModel().getDynamicMappingInfo().getItems().size() > 0) {
        Element elmDynamicMapping = new Element("DynamicMapping");
        Element elmMapping = new Element("Mapping");
        elmMapping.addAttribute(new Attribute("Position", "5"));
        elmMapping.addAttribute(new Attribute("Reference", "2"));
        elmMapping.addAttribute(new Attribute("SecondReference", "3.1"));

        // #1 User's Defined Dynamic Mapping
        if (sModel.getModel().getDynamicMappingInfo() != null
            && sModel.getModel().getDynamicMappingInfo().getItems() != null) {
          for (DynamicMappingItem item : sModel.getModel().getDynamicMappingInfo().getItems()) {
        	  
            Element elmCase = new Element("Case");
            elmCase.addAttribute(new Attribute("Value", item.getValue()));

            DatatypeDataModel itemDTModel = igModel.findDatatype(item.getDatatypeId());
            if (itemDTModel != null) {
              if (defaultHL7Version != null
                  && itemDTModel.getModel().getDomainInfo() != null
                  && itemDTModel.getModel().getDomainInfo().getVersion() != null) {
                if (defaultHL7Version.equals(itemDTModel.getModel().getDomainInfo().getVersion())) {
                  elmCase.addAttribute(new Attribute("Datatype", this.str(itemDTModel.getModel().getLabel())));
                } else {
                  elmCase.addAttribute(new Attribute("Datatype",
                      this.str(itemDTModel.getModel().getLabel() + "_" + itemDTModel.getModel()
                          .getDomainInfo().getVersion().replaceAll("\\.", "-"))));
                }
              } else {
                elmCase.addAttribute(
                    new Attribute("Datatype", this.str(itemDTModel.getModel().getLabel())));
              }
              elmMapping.appendChild(elmCase);
            } else {
              // throw new SegmentSerializationException("Datatype not found");
            }
          }
        }

        // #2 CoConstraint's Defined Dynamic Mapping
        // if (sModel.getCoConstraintTable() != null) {
        // CoConstraintTable coConstraintTable = sModel.getCoConstraintTable();
        // Set<String[]> dynamicMappingItems = coConstraintTable.generateDynamicMappingItems();
        //
        // if (dynamicMappingItems != null) {
        // dynamicMappingItems.forEach(item -> {
        // if (item[0] != null && !item[0].isEmpty() && item[1] != null && !item[1].isEmpty()) {
        // DatatypeDataModel itemDTModel = igModel.findDatatype(item[1]);
        // if (itemDTModel != null) {
        // Element elmCase = new Element("Case");
        // elmCase.addAttribute(new Attribute("Value", itemDTModel.getModel().getName()));
        // elmCase.addAttribute(new Attribute("SecondValue", item[0]));
        // if (
        // && defaultHL7Version != null
        // && itemDTModel.getModel().getDomainInfo() != null
        // && itemDTModel.getModel().getDomainInfo().getVersion() != null) {
        // if (defaultHL7Version
        // .equals(itemDTModel.getModel().getDomainInfo().getVersion())) {
        // elmCase.addAttribute(new Attribute("Datatype",
        // this.str(itemDTModel.getModel().getLabel())));
        // } else {
        // elmCase.addAttribute(new Attribute("Datatype",
        // this.str(itemDTModel.getModel().getLabel() + "_"
        // + itemDTModel.getModel().getDomainInfo().getVersion()
        // .replaceAll("\\.", "-"))));
        // }
        // } else {
        // elmCase.addAttribute(
        // new Attribute("Datatype", this.str(itemDTModel.getModel().getLabel())));
        // }
        //
        // elmMapping.appendChild(elmCase);
        // }
        // }
        // });
        // }
        // }

        // #3 OBX-2 Dynamic Mapping
        
//        String version = null;
//        String refValuesetId = null;
//        ValuesetDataModel vsModel = null;
//        if (sModel.getValuesetMap().get("2") != null) {
//          for (ValuesetBindingDataModel m : sModel.getValuesetMap().get("2")) {
//            // TODO update value set binding export
//
//            if (m.getValuesetBinding() != null && m.getValuesetBinding().getValueSets() != null
//                && m.getValuesetBinding().getValueSets().size() == 1) {
//              refValuesetId = m.getValuesetBinding().getValueSets().get(0);
//            }
//          }
//        }
//        if (refValuesetId != null) {
//          vsModel = igModel.findValueset(refValuesetId);
//        }
//        if (vsModel != null) {
//          version = vsModel.getModel().getDomainInfo().getVersion();
//          if (version != null) {
//            for (Code c : vsModel.getModel().getCodes()) {
//              String value = c.getValue();
//              DatatypeDataModel itemDTModel = igModel.findDatatype(value, version);
//
//              if (itemDTModel != null) {
//                Element elmCase = new Element("Case");
//                elmCase.addAttribute(new Attribute("Value", itemDTModel.getModel().getName()));
//                if (defaultHL7Version != null
//                    && itemDTModel.getModel().getDomainInfo() != null
//                    && itemDTModel.getModel().getDomainInfo().getVersion() != null) {
//                  if (defaultHL7Version.equals(itemDTModel.getModel().getDomainInfo().getVersion())) {
//                    elmCase.addAttribute(new Attribute("Datatype", this.str(itemDTModel.getModel().getLabel())));
//                  } else {
//                    elmCase.addAttribute(new Attribute("Datatype",
//                        this.str(itemDTModel.getModel().getLabel() + "_" + itemDTModel.getModel()
//                            .getDomainInfo().getVersion().replaceAll("\\.", "-"))));
//                  }
//                } else {
//                  elmCase.addAttribute(
//                      new Attribute("Datatype", this.str(itemDTModel.getModel().getLabel())));
//                }
//                elmMapping.appendChild(elmCase);
//              } else {
//                Datatype dt = this.datatypeService.findOneByNameAndVersionAndScope(value, version,
//                    "HL7STANDARD");
//                if (dt != null) {
//                  Element elmCase = new Element("Case");
//                  elmCase.addAttribute(new Attribute("Value", dt.getName()));
//                  if (defaultHL7Version != null && dt.getDomainInfo() != null && dt.getDomainInfo().getVersion() != null) {
//                    if (defaultHL7Version.equals(dt.getDomainInfo().getVersion())) {
//                      elmCase.addAttribute(new Attribute("Datatype", this.str(dt.getLabel())));
//                    } else {
//                      elmCase.addAttribute(new Attribute("Datatype", this.str(dt.getLabel() + "_"
//                          + dt.getDomainInfo().getVersion().replaceAll("\\.", "-"))));
//                    }
//                  } else {
//                    elmCase.addAttribute(new Attribute("Datatype", this.str(dt.getLabel())));
//                  }
//                  elmMapping.appendChild(elmCase);
//
//                  missingDts.add(dt);
//                  if (dt instanceof ComplexDatatype) {
//                    ComplexDatatype complexDatatype = (ComplexDatatype) dt;
//                    if (complexDatatype.getComponents() != null) {
//                      for (Component component : complexDatatype.getComponents()) {
//                        if (igModel.findDatatype(component.getRef().getId()) == null) {
//                          Datatype childDT =
//                              this.datatypeService.findById(component.getRef().getId());
//                          if (childDT != null)
//                            missingDts.add(childDT);
//
//                          if (childDT instanceof ComplexDatatype) {
//                            ComplexDatatype complexChildDatatype = (ComplexDatatype) childDT;
//                            if (complexChildDatatype.getComponents() != null) {
//                              for (Component subComponent : complexChildDatatype.getComponents()) {
//                                if (igModel.findDatatype(subComponent.getRef().getId()) == null) {
//                                  Datatype childchildDT =
//                                      this.datatypeService.findById(subComponent.getRef().getId());
//                                  if (childchildDT != null)
//                                    missingDts.add(childchildDT);
//                                }
//                              }
//                            }
//                          }
//
//                        }
//                      }
//                    }
//
//                  }
//                } else {
//                  System.out.println(value + "-" + version);
//                }
//
//              }
//
//            }
//          }
//        }
        elmDynamicMapping.appendChild(elmMapping);
        elmSegment.appendChild(elmDynamicMapping);
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
                .addAttribute(new Attribute("Usage", this.str(this.changeCABtoC(f.getModel().getUsage()).toString())));

            if (defaultHL7Version != null
                && dBindingModel.getDomainInfo() != null
                && dBindingModel.getDomainInfo().getVersion() != null) {
              if (defaultHL7Version
                  .equals(dBindingModel.getDomainInfo().getVersion())) {
                elmField
                    .addAttribute(new Attribute("Datatype", this.str(dBindingModel.getLabel())));
              } else {
            	  elmField.addAttribute(new Attribute("Datatype", this.str(dBindingModel.getLabel()
                    + "_" + dBindingModel.getDomainInfo().getVersion().replaceAll("\\.", "-"))));
              }
            } else {
              elmField.addAttribute(new Attribute("Datatype", this.str(dBindingModel.getLabel())));
            }
            
            if(f.getModel().getLengthType().equals(LengthType.Length)) {
            	elmField.addAttribute(new Attribute("ConfLength", "NA"));
            	  
            	  if (f.getModel().getMinLength() != null && !f.getModel().getMinLength().isEmpty()) {
            		  elmField.addAttribute(new Attribute("MinLength", this.str(f.getModel().getMinLength())));

                    } else {
                    	elmField.addAttribute(new Attribute("MinLength", "NA"));
                    }

                    if (f.getModel().getMaxLength() != null && !f.getModel().getMaxLength().isEmpty()) {
                    	elmField.addAttribute(new Attribute("MaxLength", this.str(f.getModel().getMaxLength())));

                    } else {
                    	elmField.addAttribute(new Attribute("MaxLength", "NA"));

                    }
            	  
            	  
              } else if(f.getModel().getLengthType().equals(LengthType.ConfLength)) {
            	  elmField.addAttribute(new Attribute("MinLength", "NA"));
            	  elmField.addAttribute(new Attribute("MaxLength", "NA"));
            	  
                    if (f.getModel().getConfLength() != null && !f.getModel().getConfLength().equals("")) {
                    	elmField.addAttribute(new Attribute("ConfLength", this.str(f.getModel().getConfLength())));
                    } else {
                    	elmField.addAttribute(new Attribute("ConfLength", "NA"));
                    }
            	  
              } else {
            	  if (f.getModel().getMinLength() != null && !f.getModel().getMinLength().isEmpty()) {
            		  elmField.addAttribute(new Attribute("MinLength", this.str(f.getModel().getMinLength())));

                    } else {
                    	elmField.addAttribute(new Attribute("MinLength", "NA"));
                    }

                    if (f.getModel().getMaxLength() != null && !f.getModel().getMaxLength().isEmpty()) {
                    	elmField.addAttribute(new Attribute("MaxLength", this.str(f.getModel().getMaxLength())));

                    } else {
                    	elmField.addAttribute(new Attribute("MaxLength", "NA"));

                    }
                    if (f.getModel().getConfLength() != null && !f.getModel().getConfLength().equals("")) {
                    	elmField.addAttribute(new Attribute("ConfLength", this.str(f.getModel().getConfLength())));
                    } else {
                    	elmField.addAttribute(new Attribute("ConfLength", "NA"));
                    }	  
              }
            
            
            
            Set<ValuesetBindingDataModel> valueSetBindings = f.getValuesets();
            if (valueSetBindings != null && valueSetBindings.size() > 0) {
              String bindingString = "";
              String bindingStrength = null;
              Set<Integer> bindingLocation = null;

              for (ValuesetBindingDataModel binding : valueSetBindings) {
                try {
                  if (binding.getValuesetBinding().getStrength() != null)
                    bindingStrength = binding.getValuesetBinding().getStrength().toString();

                  if (binding.getValuesetBinding().getValuesetLocations() != null
                      && binding.getValuesetBinding().getValuesetLocations().size() > 0)
                    bindingLocation = binding.getValuesetBinding().getValuesetLocations();
                  
                  if (binding != null && binding.getBindingIdentifier() != null
                      && !binding.getBindingIdentifier().equals("")) {
                    if (defaultHL7Version != null
                        && binding.getDomainInfo() != null
                        && binding.getDomainInfo().getVersion() != null) {
                      if (defaultHL7Version.equals(binding.getDomainInfo().getVersion()) || binding.getBindingIdentifier().equals("HL70396")) {
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
              if (!this.isPrimitiveDatatype(f.getDatatype().getName()) && bindingLocation != null && bindingLocation.size() > 0) {
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
      IgDataModel igModel, String defaultHL7Version) throws MessageSerializationException {
    try {
      Element elmMessage = new Element("Message");
      elmMessage.addAttribute(new Attribute("ID", cpModel.getModel().getId()));
      if (cpModel.getModel().getDisplayName() != null
          && !cpModel.getModel().getDisplayName().equals(""))
        elmMessage.addAttribute(
            new Attribute("Identifier", this.str(cpModel.getModel().getDisplayName())));
      if (cpModel.getModel().getName() != null && !cpModel.getModel().getName().equals(""))
        elmMessage.addAttribute(new Attribute("Name", this.str(cpModel.getModel().getName())));
      elmMessage.addAttribute(new Attribute("Type", this.str(cpModel.getModel().getMessageType())));
      elmMessage.addAttribute(new Attribute("Event", this.str(cpModel.getModel().getEvent())));
      elmMessage.addAttribute(new Attribute("StructID", this.str(cpModel.getModel().getStructID())));

      if (cpModel.getModel().getDescription() != null && !cpModel.getModel().getDescription().equals(""))
        elmMessage.addAttribute(new Attribute("Description", this.str(cpModel.getModel().getDescription())));

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
          elmMessage.appendChild(serializeSegmentRef(segmentRefOrGroupDataModel, igModel, defaultHL7Version));
        } else if (segmentRefOrGroupDataModel.getType().equals(Type.GROUP)) {
          elmMessage.appendChild(serializeGroup(segmentRefOrGroupDataModel, igModel, defaultHL7Version, cpModel.getModel().getId()));
        }
      }

      return elmMessage;
    } catch (Exception e) {
      e.printStackTrace();
      throw new MessageSerializationException(e, cpModel != null ? cpModel.getModel().getId() : "");
    }
  }

  private Element serializeGroup(SegmentRefOrGroupDataModel segmentRefOrGroupDataModel,
      IgDataModel igModel, String defaultHL7Version, String messageId) throws GroupSerializationException {
    try {
      Element elmGroup = new Element("Group");
      elmGroup.addAttribute(new Attribute("ID", this.str(messageId) + "-"
          + this.str(segmentRefOrGroupDataModel.getModel().getId())));
      elmGroup.addAttribute(
          new Attribute("Name", this.str(segmentRefOrGroupDataModel.getModel().getName())));
      elmGroup.addAttribute(new Attribute("Usage",
          this.str(this.changeCABtoC(segmentRefOrGroupDataModel.getModel().getUsage()).toString())));
      elmGroup.addAttribute(
          new Attribute("Min", this.str(segmentRefOrGroupDataModel.getModel().getMin() + "")));
      elmGroup.addAttribute(
          new Attribute("Max", this.str(segmentRefOrGroupDataModel.getModel().getMax())));

      Map<Integer, SegmentRefOrGroupDataModel> segmentRefOrGroupDataModels =
          new HashMap<Integer, SegmentRefOrGroupDataModel>();

      if(segmentRefOrGroupDataModel.getChildren() != null) {
          for (SegmentRefOrGroupDataModel child : segmentRefOrGroupDataModel.getChildren()) {
              segmentRefOrGroupDataModels.put(child.getModel().getPosition(), child);
            }

            for (int i = 1; i < segmentRefOrGroupDataModels.size() + 1; i++) {
              SegmentRefOrGroupDataModel childModel = segmentRefOrGroupDataModels.get(i);
              if (childModel.getType().equals(Type.SEGMENTREF)) {
                elmGroup.appendChild(serializeSegmentRef(childModel, igModel, defaultHL7Version));
              } else if (childModel.getType().equals(Type.GROUP)) {
                elmGroup.appendChild(serializeGroup(childModel, igModel, defaultHL7Version, messageId));
              }
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
      IgDataModel igModel, String defaultHL7Version) throws SegmentSerializationException {
    try {
      SegmentBindingDataModel segModel = segmentRefOrGroupDataModel.getSegment();
      Element elmSegment = new Element("Segment");

      if (defaultHL7Version != null && segModel.getDomainInfo() != null && segModel.getDomainInfo().getVersion() != null) {
        if (defaultHL7Version.equals(segModel.getDomainInfo().getVersion())) {
          elmSegment.addAttribute(new Attribute("Ref", this.str(segModel.getLabel())));
        } else {
          elmSegment.addAttribute(new Attribute("Ref", this.str(segModel.getLabel() + "_" + segModel.getDomainInfo().getVersion().replaceAll("\\.", "-"))));
        }
      } else {
        elmSegment.addAttribute(new Attribute("Ref", this.str(segModel.getLabel())));
      }

      elmSegment.addAttribute(new Attribute("Usage",
          this.str(this.changeCABtoC(segmentRefOrGroupDataModel.getModel().getUsage()).toString())));
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

  private void serializeProfileMetaData(Element e, IgDataModel igModel, String type, String defaultHL7Version) {
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
      if (defaultHL7Version != null && defaultHL7Version.equals("NOTFOUND"))
        e.addAttribute(new Attribute("HL7Version", this.str(defaultHL7Version)));

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

  private Usage changeCABtoC(Usage value) {
    return Usage.CAB.equals(value) ? Usage.C : value;
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
  public void normalizeIgModel(IgDataModel igModel, String[] conformanceProfileIds)
      throws CloneNotSupportedException, ClassNotFoundException, IOException {
    Map<String, DatatypeDataModel> toBeAddedDTs = new HashMap<String, DatatypeDataModel>();
    Map<String, SegmentDataModel> toBeAddedSegs = new HashMap<String, SegmentDataModel>();

    for (DatatypeDataModel dtModel : igModel.getDatatypes()) {
      for (String key : dtModel.getValuesetMap().keySet()) {
        List<String> pathList = new LinkedList<String>(Arrays.asList(key.split("\\.")));

        if (pathList.size() > 1) {
          ComponentDataModel cModel = dtModel.findComponentDataModelByPosition(Integer.parseInt(pathList.remove(0)));

          DatatypeDataModel childDtModel = igModel.findDatatype(cModel.getDatatype().getId());
          if (childDtModel == null)
            childDtModel = toBeAddedDTs.get(cModel.getDatatype().getId());
          DatatypeDataModel copyDtModel = XMLSerializeServiceImpl.cloneThroughJson(childDtModel);
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
          DatatypeDataModel copyDtModel = XMLSerializeServiceImpl.cloneThroughJson(childDtModel);

          int randumNum = new SecureRandom().nextInt(100000);
          copyDtModel.getModel().setId(childDtModel.getModel().getId() + "_A" + randumNum);
          String ext = childDtModel.getModel().getExt();
          if (ext == null) ext = "";
          copyDtModel.getModel().setExt(ext + "_A" + randumNum);
          toBeAddedDTs.put(copyDtModel.getModel().getId(), copyDtModel);
          fModel.getDatatype().setId(copyDtModel.getModel().getId());
          fModel.getDatatype().setExt(ext + "_A" + randumNum);

          updateChildDatatype(pathList, copyDtModel, igModel, segModel.getValuesetMap().get(key), toBeAddedDTs);
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
      System.out.println(sModel.getModel().getId());

      SegmentDataModel copySModel = XMLSerializeServiceImpl.cloneThroughJson(sModel);
      
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
        DatatypeDataModel copyDtModel = XMLSerializeServiceImpl.cloneThroughJson(childDtModel);

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
  
  @SuppressWarnings("unchecked")
public
  static <T> T cloneThroughJson(T t) {
     Gson gson = new Gson();
     String json = gson.toJson(t);
     return (T) gson.fromJson(json, t.getClass());
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
      DatatypeDataModel copyDtModel = XMLSerializeServiceImpl.cloneThroughJson(childDtModel);

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
      copy.add(XMLSerializeServiceImpl.cloneThroughJson(o));
    }
    return copy;
  }

  public String generateConditionScript(Predicate p, String targetId) {
    if (p instanceof FreeTextPredicate) {
      FreeTextPredicate cp = (FreeTextPredicate) p;
      if(cp.getAssertionScript() !=null) {	  
          return cp.getAssertionScript().replace("\n", "").replace("\r", "");  
      }

    } else if (p instanceof AssertionPredicate) {
      AssertionPredicate cp = (AssertionPredicate) p;
      if (cp.getAssertion() != null)
        return "<Condition>" + this.assertionXMLSerialization
            .generateAssertionScript(cp.getAssertion(), cp.getLevel(), targetId, cp.getContext(), true)
            .replace("\n", "").replace("\r", "") + "</Condition>";
    }
    return null;
  }

  public String generateAssertionScript(ConformanceStatement c, String targetId) {
    if (c instanceof FreeTextConformanceStatement) {
      FreeTextConformanceStatement cs = (FreeTextConformanceStatement) c;
      if(cs.getAssertionScript() !=null) {
          return cs.getAssertionScript().replace("\n", "").replace("\r", "");
      }
    } else if (c instanceof AssertionConformanceStatement) {
      AssertionConformanceStatement cs = (AssertionConformanceStatement) c;
      if (cs.getAssertion() != null) {
    	  String asserionScript = this.assertionXMLSerialization.generateAssertionScript(cs.getAssertion(), cs.getLevel(), targetId, cs.getContext(), false);
    	  if(asserionScript != null) 
    		  return "<Assertion>" + asserionScript.replace("\n", "").replace("\r", "") + "</Assertion>";
      }
    }
    return null;
  }



  

}
