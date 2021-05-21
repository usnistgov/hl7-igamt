package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

import gov.nist.diff.domain.DeltaAction;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.igamt.delta.domain.ConformanceStatementDelta;
import gov.nist.hit.hl7.igamt.delta.domain.Delta;
import gov.nist.hit.hl7.igamt.delta.domain.ResourceDelta;
import gov.nist.hit.hl7.igamt.delta.domain.StructureDelta;
import gov.nist.hit.hl7.igamt.delta.service.DeltaService;
import gov.nist.hit.hl7.igamt.export.configuration.domain.DeltaConfiguration;
import gov.nist.hit.hl7.igamt.serialization.util.SerializationTools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.ActiveStatus;
import gov.nist.hit.hl7.igamt.common.base.domain.Comment;
import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.binding.domain.Binding;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Component;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.DateTimeComponentDefinition;
import gov.nist.hit.hl7.igamt.datatype.domain.DateTimeDatatype;
import gov.nist.hit.hl7.igamt.datatype.exception.DatatypeNotFoundException;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.DatatypeExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.ExportTools;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.ComponentDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.DatatypeDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.IgDataModel;
import gov.nist.hit.hl7.igamt.serialization.exception.ResourceSerializationException;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import gov.nist.hit.hl7.igamt.serialization.exception.SubStructElementSerializationException;
import gov.nist.hit.hl7.igamt.serialization.util.FroalaSerializationUtil;
import nu.xom.Attribute;
import nu.xom.Element;

@Service
public class DatatypeSerializationServiceImpl implements DatatypeSerializationService {

  @Autowired
  private IgDataModelSerializationService igDataModelSerializationService;

  @Autowired
  private ConstraintSerializationService constraintSerializationService;

  @Autowired 
  BindingSerializationService bindingSerializationService;

  @Autowired
  private DeltaService deltaService;

  @Autowired
  private FroalaSerializationUtil frolaCleaning;

  @Autowired
  private SerializationTools serializationTools;

  @Autowired
  private ReasonForChangeSerializationService reasonForChangeSerializationService;

  @Override
  public Element serializeDatatype(String igId, DatatypeDataModel datatypeDataModel, int level, int position, DatatypeExportConfiguration datatypeExportConfiguration, Type type, Boolean deltaMode) throws SerializationException {
    //	    try {
    Element datatypeElement = igDataModelSerializationService.serializeResource(datatypeDataModel.getModel(), Type.DATATYPE, position, datatypeExportConfiguration);
    Datatype datatype = datatypeDataModel.getModel();

    if(deltaMode && datatypeExportConfiguration.isReasonForChange()) {
      if(datatype instanceof ComplexDatatype) {
        datatypeElement.appendChild(reasonForChangeSerializationService.serializeReasonForChange(datatype.getLabel(), datatype.getBinding(),  ((ComplexDatatype)datatype).getComponents()));
      }
      if(datatype.isDerived()) {

        ResourceDelta resourceDelta = deltaService.delta(Type.DATATYPE, datatype);
        if(resourceDelta != null) {
          List<StructureDelta> structureDelta = resourceDelta.getStructureDelta();
          List<StructureDelta> structureDeltaChanged = structureDelta.stream().filter(d -> !d.getData().getAction().equals(DeltaAction.UNCHANGED)).collect(Collectors.toList());
          List<ConformanceStatementDelta> confStDeltaChanged = resourceDelta.getConformanceStatementDelta().stream().filter(d -> !d.getAction().equals(DeltaAction.UNCHANGED)).collect(Collectors.toList());

          if(structureDeltaChanged != null && structureDeltaChanged.size()>0) {
            Element deltaElement = this.serializeDelta(datatype.getName(), structureDeltaChanged, confStDeltaChanged, datatypeExportConfiguration.getDeltaConfig());
            if (deltaElement != null) {
              datatypeElement.appendChild(deltaElement);
            }
          } else {
            return  null;
          }
        } else {
          return  null;
        }

      }
    }
    datatypeElement
    .addAttribute(new Attribute("ext", datatype.getExt() != null ? datatype.getExt() : ""));
    datatypeElement
    .addAttribute(new Attribute("label", datatype.getLabel() != null ? datatype.getLabel() : ""));
    if(datatypeExportConfiguration.getPurposeAndUse()) {
      datatypeElement.addAttribute(new Attribute("purposeAndUse",
          datatype.getPurposeAndUse() != null ? datatype.getPurposeAndUse() : ""));
    }
    if(type.equals(Type.DATATYPELIBRARY)) {
      //			datatypeElement
      //			.addAttribute(new Attribute("PurposeUse", datatype.getUsageNotes() != null ? datatype.getUsageNotes(): ""));
      if(datatypeExportConfiguration.getMetadataConfig().isDatatypeFlavor()) {
        datatypeElement
        .addAttribute(new Attribute("datatypeFlavor", datatype.getLabel() != null ? datatype.getLabel(): ""));}
      if(datatypeExportConfiguration.getMetadataConfig().isDatatypeName()) {
        datatypeElement
        .addAttribute(new Attribute("datatypeName", datatype.getDescription() != null ? datatype.getDescription(): ""));}
      if(datatypeExportConfiguration.getMetadataConfig().isShortDescription()) {
        datatypeElement
        .addAttribute(new Attribute("shortDescription", datatype.getShortDescription() != null ? datatype.getShortDescription(): ""));}
      if(datatype.getDomainInfo() != null && datatypeExportConfiguration.getMetadataConfig().isHl7version()) {
        datatypeElement
        .addAttribute(new Attribute("hl7versions", datatype.getDomainInfo().getCompatibilityVersion()!= null ? datatype.getDomainInfo().getCompatibilityVersion().toString(): ""));
      }
      if(datatypeExportConfiguration.getMetadataConfig().isStatus()) {
        datatypeElement
        .addAttribute(new Attribute("status", (datatype.getActiveInfo() != null && datatype.getActiveInfo().getStatus() !=null) ? datatype.getActiveInfo().getStatus().toString(): ""));}
      if(datatype.getPublicationInfo() != null && datatypeExportConfiguration.getMetadataConfig().isPublicationDate()) {
        datatypeElement
        .addAttribute(new Attribute("publicationDate", datatype.getPublicationDateString()));
      }
    }
    if (datatype instanceof ComplexDatatype) {
      datatypeElement = serializeComplexDatatype(datatypeElement,datatypeDataModel,datatypeExportConfiguration, type);

    } else if (datatype instanceof DateTimeDatatype) {
      datatypeElement = serializeDateTimeDatatype(datatypeElement, datatypeDataModel, datatypeExportConfiguration);
    }
    if(!datatypeDataModel.getConformanceStatements().isEmpty()|| !datatypeDataModel.getPredicateMap().isEmpty()) {
      Element constraints = constraintSerializationService.serializeConstraints(datatypeDataModel.getConformanceStatements(), datatypeDataModel.getPredicateMap(), datatypeExportConfiguration.getConstraintExportConfiguration());
      if (constraints != null) {
        datatypeElement.appendChild(constraints);
      }
    }


    return igDataModelSerializationService.getSectionElement(datatypeElement, datatypeDataModel.getModel(), level, datatypeExportConfiguration);

    //	    } catch (Exception exception) {
    //	    	exception.printStackTrace();
    //	      throw new ResourceSerializationException(exception, Type.DATATYPE, datatypeDataModel.getModel());
    //	    }
    //	      
    //	      return igDataModelSerializationService.getSectionElement(datatypeElement, datatypeDataModel.getModel(), level);

  }



  @Override
  public Element serializeComplexDatatype(Element datatypeElement, DatatypeDataModel datatypeDataModel, DatatypeExportConfiguration datatypeExportConfiguration, Type type) throws SubStructElementSerializationException {
    ComplexDatatype complexDatatype = (ComplexDatatype) datatypeDataModel.getModel();
    HashMap<String, Boolean> bindedPaths = new HashMap<String, Boolean>();

    for (Component component : complexDatatype.getComponents()) {
      if (component != null && ExportTools.CheckUsage(datatypeExportConfiguration.getComponentExport(), component.getUsage())) {
        //	      if(this.bindedComponents.contains(component.getId())) {
        try {
          bindedPaths.put(component.getId(), true);
          Element componentElement = new Element("Component");
          componentElement.addAttribute(new Attribute("confLength",
              component.getConfLength() != null ? component.getConfLength() : ""));
          componentElement
          .addAttribute(new Attribute("id", component.getId() != null ? component.getId() : ""));
          componentElement.addAttribute(
              new Attribute("name", component.getName() != null ? component.getName() : ""));
          componentElement.addAttribute(new Attribute("maxLength",
              component.getMaxLength() != null ? component.getMaxLength() : ""));
          componentElement.addAttribute(new Attribute("minLength",
              component.getMinLength() != null ? component.getMinLength() : ""));
          componentElement.addAttribute(
              new Attribute("text", component.getText() != null ? frolaCleaning.cleanFroalaInput(component.getText()) : ""));
          componentElement
          .addAttribute(new Attribute("position", String.valueOf(component.getPosition())));
          componentElement.addAttribute(new Attribute("constantValue",
              component.getConstantValue() != null ? component.getConstantValue() : ""));
          Element comments = new Element("Comments");
          Element definitionTextsElement = new Element("DefinitionTexts");
          datatypeElement.appendChild(definitionTextsElement);
          datatypeElement.appendChild(comments);
          if(component.getComments() != null) {
            for(Comment comment : component.getComments()) {
              Element commentElement = new Element("Comment");
              if(complexDatatype.getExt() != null) {
                commentElement
                .addAttribute(new Attribute("name", complexDatatype.getName()+"_"+complexDatatype.getExt() + "." + component.getPosition()));
              } else {
                commentElement
                .addAttribute(new Attribute("name", complexDatatype.getName() + "." + component.getPosition()));
              } 
              commentElement
              .addAttribute(new Attribute("description", comment.getDescription()));
              commentElement.addAttribute(new Attribute("position", String.valueOf(component.getPosition())));

              comments.appendChild(commentElement);
            }

            if(component.getText() != null) {
              Element definitionText = new Element("DefinitionText");
              definitionText
              .addAttribute(new Attribute("text", component.getText()));
  			  definitionText.addAttribute(new Attribute("position", String.valueOf(component.getPosition())));
              if(complexDatatype.getExt() != null) {
                definitionText
                .addAttribute(new Attribute("name", complexDatatype.getName()+"_"+complexDatatype.getExt() + "." + component.getPosition()));
              } else {
                definitionText
                .addAttribute(new Attribute("name", complexDatatype.getName() + "." + component.getPosition()));
              } 			    			  definitionTextsElement.appendChild(definitionText);
            }
          }
          if(type.equals(Type.IGDOCUMENT)) {
            if (datatypeDataModel != null && datatypeDataModel.getValuesetMap() != null && datatypeDataModel.getValuesetMap().containsKey(component.getPosition() + "")) {
              String vs = datatypeDataModel.getValuesetMap().get(component.getPosition()+"").stream().map((element) -> {
                return element.getBindingIdentifier();
              })
                  .collect(Collectors.joining(", "));
              componentElement
              .addAttribute(new Attribute("valueset", vs));
            }  
          }
          if (component.getRef() != null) {
            //	            if (datatypeNamesMap != null
            //	                && datatypeNamesMap.containsKey(component.getRef().getId())) {
            ComponentDataModel componentDataModel = datatypeDataModel.getComponentDataModels().stream().filter(cp -> component.getRef().getId().equals(cp.getDatatype().getId())).findAny().orElseThrow(() -> new DatatypeNotFoundException(component.getRef().getId()));
            componentElement.addAttribute(
                new Attribute("datatype", componentDataModel.getDatatype().getName()));
            //	            } else {
            //	              //throw new DatatypeNotFoundException(component.getRef().getId());
            //	            }
          }
          componentElement.addAttribute(new Attribute("usage",
              component.getUsage() != null ? component.getUsage().toString() : ""));
          datatypeElement.appendChild(componentElement);
        } catch (Exception exception) {
          throw new SubStructElementSerializationException(exception, component);
        }
        //	      }
      }
    }

    if(type.equals(Type.IGDOCUMENT)) {
      if (complexDatatype.getBinding() != null) {
        Element bindingElement;
        try {
          bindingElement = bindingSerializationService.serializeBinding(complexDatatype.getBinding(), datatypeDataModel.getValuesetMap(), datatypeDataModel.getModel().getName(), bindedPaths);
          if(bindingElement !=null) {
            datatypeElement.appendChild(bindingElement);
          }

        } catch (SerializationException e) {
          // TODO Auto-generated catch block
          e.printStackTrace();
        }

      }
    }
    return datatypeElement;

  }

  @Override
  public Element serializeDateTimeDatatype(Element datatypeElement, DatatypeDataModel datatypeDataModel, DatatypeExportConfiguration datatypeExportConfiguration) {
    DateTimeDatatype dateTimeDatatype =  (DateTimeDatatype) datatypeDataModel.getModel();
    if(dateTimeDatatype.getDateTimeConstraints() !=null) {
      for (DateTimeComponentDefinition dateTimeComponentDefinition : dateTimeDatatype
          .getDateTimeConstraints().getDateTimeComponentDefinitions()) {
        if(dateTimeComponentDefinition != null) {
          Element dateTimeComponentDefinitionElement = new Element("DateTimeComponentDefinition");
          if (dateTimeComponentDefinition != null) {
            dateTimeComponentDefinitionElement.addAttribute(new Attribute("description",
                dateTimeComponentDefinition.getDescription() != null
                ? dateTimeComponentDefinition.getDescription()
                    : ""));
            dateTimeComponentDefinitionElement.addAttribute(new Attribute("format",
                dateTimeComponentDefinition.getFormat() != null
                ? dateTimeComponentDefinition.getFormat()
                    : ""));
            dateTimeComponentDefinitionElement.addAttribute(new Attribute("name",
                dateTimeComponentDefinition.getName() != null ? dateTimeComponentDefinition.getName()
                    : ""));
            dateTimeComponentDefinitionElement.addAttribute(new Attribute("predicate",
                dateTimeComponentDefinition.getDateTimePredicate() != null
                ? dateTimeComponentDefinition.getDateTimePredicate().toString()
                    : ""));
            dateTimeComponentDefinitionElement.addAttribute(
                new Attribute("position", String.valueOf(dateTimeComponentDefinition.getPosition())));
            dateTimeComponentDefinitionElement.addAttribute(new Attribute("usage",
                dateTimeComponentDefinition.getUsage() != null
                ? dateTimeComponentDefinition.getUsage().toString()
                    : ""));
            datatypeElement.appendChild(dateTimeComponentDefinitionElement);
          }
        }
      }
    }
    return datatypeElement;
  }

  private Element serializeDelta(String datatypeName, List<StructureDelta> structureDeltaList, List<ConformanceStatementDelta> confStDeltaChanged, DeltaConfiguration deltaConfiguration){
    if (structureDeltaList.size() > 0  || confStDeltaChanged.size() > 0) {
      Element changesElement = new Element("Changes");
      changesElement.addAttribute(new Attribute("mode", deltaConfiguration.getMode().name()));

      //		      if(deltaConfiguration.getMode().equals(DeltaExportConfigMode.HIGHLIGHT)) {
      changesElement.addAttribute(new Attribute("updatedColor", deltaConfiguration.getColors().get(DeltaAction.UPDATED)));
      changesElement.addAttribute(new Attribute("addedColor", deltaConfiguration.getColors().get(DeltaAction.ADDED)));
      changesElement.addAttribute(new Attribute("deletedColor", deltaConfiguration.getColors().get(DeltaAction.DELETED)));

      //		      }
      for (StructureDelta structureDelta : structureDeltaList) {
        this.setChangedElements(datatypeName, changesElement, structureDelta);
      }
      for (ConformanceStatementDelta conformanceStatementDelta : confStDeltaChanged) {
        this.setChangedConfStatements(changesElement, conformanceStatementDelta);
      }
      return changesElement;
    }
    return null;
  }
  private void setChangedConfStatements(Element element, ConformanceStatementDelta conformanceStatementDelta) {
    if(conformanceStatementDelta != null) {
      if(conformanceStatementDelta.getAction().equals(DeltaAction.DELETED) || conformanceStatementDelta.getAction().equals(DeltaAction.ADDED)) {
        Element addedDesc = new Element("Change");
        addedDesc.addAttribute(new Attribute("type", Type.CONFORMANCESTATEMENT.getValue()));
        addedDesc.addAttribute(new Attribute("identifier", conformanceStatementDelta.getIdentifier().getCurrent()));
        addedDesc.addAttribute(new Attribute("action", conformanceStatementDelta.getAction().name()));
        addedDesc.addAttribute(new Attribute("property", PropertyType.DESCRIPTION.name()));
        element.appendChild(addedDesc);

        Element addedId = new Element("Change");
        addedId.addAttribute(new Attribute("type", Type.CONFORMANCESTATEMENT.getValue()));
        addedId.addAttribute(new Attribute("identifier", conformanceStatementDelta.getIdentifier().getCurrent()));
        addedId.addAttribute(new Attribute("action", conformanceStatementDelta.getAction().name()));
        addedId.addAttribute(new Attribute("property", PropertyType.IDENTIFIER.name()));
        element.appendChild(addedId);
      } else {
        if(conformanceStatementDelta.getDescription() != null && !conformanceStatementDelta.getDescription().getAction().equals(DeltaAction.UNCHANGED)) {
          Element changedElement = new Element("Change");
          changedElement.addAttribute(new Attribute("type", Type.CONFORMANCESTATEMENT.getValue()));
          changedElement.addAttribute(new Attribute("identifier", conformanceStatementDelta.getIdentifier().getCurrent()));
          changedElement.addAttribute(new Attribute("action", conformanceStatementDelta.getAction().name()));
          changedElement.addAttribute(new Attribute("property", PropertyType.DESCRIPTION.name()));
          changedElement.addAttribute(new Attribute("oldValue", conformanceStatementDelta.getDescription().getPrevious()));
          element.appendChild(changedElement);
        }
      }
    }
  }
  private void setChangedElements(String datatypeName, Element element, StructureDelta structureDelta) {
    if (structureDelta != null) {
      if (!structureDelta.getAction().equals(DeltaAction.UNCHANGED)) {
        //Usage
        if (structureDelta.getUsage() != null && !structureDelta.getUsage().getAction().equals(DeltaAction.UNCHANGED)) {
          Element changedElement = new Element("Change");
          changedElement.addAttribute(new Attribute("type", structureDelta.getType().getValue()));
          changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
          changedElement.addAttribute(new Attribute("action", structureDelta.getUsage().getAction().name()));
          changedElement.addAttribute(new Attribute("property", PropertyType.USAGE.name()));
          if (structureDelta.getUsage().getPrevious() != null) {
            changedElement.addAttribute(new Attribute("oldValue", structureDelta.getUsage().getPrevious().name()));
          }
          element.appendChild(changedElement);
        }
        // Cte value
        if (structureDelta.getConstantValue() != null && !structureDelta.getConstantValue().getAction().equals(DeltaAction.UNCHANGED)) {
          Element changedElement = new Element("Change");
          changedElement.addAttribute(new Attribute("type", structureDelta.getType().getValue()));
          changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
          changedElement.addAttribute(new Attribute("action", structureDelta.getConstantValue().getAction().name()));
          changedElement.addAttribute(new Attribute("property", PropertyType.CONSTANTVALUE.name()));
          if (structureDelta.getConstantValue().getPrevious() != null) {
            changedElement.addAttribute(new Attribute("oldValue", structureDelta.getConstantValue().getPrevious()));
          }
          element.appendChild(changedElement);
        }

        // Min Length
        if (structureDelta.getMinLength() != null && !structureDelta.getMinLength().getAction().equals(DeltaAction.UNCHANGED)) {
          Element changedElement = new Element("Change");
          changedElement.addAttribute(new Attribute("type", structureDelta.getType().getValue()));
          changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
          changedElement.addAttribute(new Attribute("action", structureDelta.getMinLength().getAction().name()));
          changedElement.addAttribute(new Attribute("property", PropertyType.LENGTHMIN.name()));
          if (structureDelta.getMinLength().getPrevious() != null) {
            changedElement.addAttribute(new Attribute("oldValue", structureDelta.getMinLength().getPrevious()));
          }
          element.appendChild(changedElement);
        }

        //Max Length
        if (structureDelta.getMaxLength() != null && !structureDelta.getMaxLength().getAction().equals(DeltaAction.UNCHANGED)) {
          Element changedElement = new Element("Change");
          changedElement.addAttribute(new Attribute("type", structureDelta.getType().getValue()));
          changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
          changedElement.addAttribute(new Attribute("action", structureDelta.getMaxLength().getAction().name()));
          changedElement.addAttribute(new Attribute("property", PropertyType.LENGTHMAX.name()));
          if (structureDelta.getMaxLength().getPrevious() != null) {
            changedElement.addAttribute(new Attribute("oldValue", structureDelta.getMaxLength().getPrevious()));
          }
          element.appendChild(changedElement);
        }

        // Conf Length
        if (structureDelta.getConfLength() != null && !structureDelta.getConfLength().getAction().equals(DeltaAction.UNCHANGED)) {
          Element changedElement = new Element("Change");
          changedElement.addAttribute(new Attribute("type", structureDelta.getType().getValue()));
          changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
          changedElement.addAttribute(new Attribute("action", structureDelta.getConfLength().getAction().name()));
          changedElement.addAttribute(new Attribute("property", PropertyType.CONFLENGTH.name()));
          if (structureDelta.getConfLength().getPrevious() != null) {
            changedElement.addAttribute(new Attribute("oldValue", structureDelta.getConfLength().getPrevious()));
          }
          element.appendChild(changedElement);
        }

        //Ref
        if (structureDelta.getReference() != null && !structureDelta.getReference().getAction().equals(DeltaAction.UNCHANGED)) {
          Element changedElement = new Element("Change");
          changedElement.addAttribute(new Attribute("type", structureDelta.getType().getValue()));
          changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
          changedElement.addAttribute(new Attribute("action", structureDelta.getReference().getAction().name()));
          changedElement.addAttribute(new Attribute("property", PropertyType.DATATYPE.name()));
          if (structureDelta.getReference().getLabel() != null && structureDelta.getReference().getLabel().getPrevious() != null) {
            changedElement.addAttribute(new Attribute("oldValue", structureDelta.getReference().getLabel().getPrevious()));
          }

          element.appendChild(changedElement);
        }

        //Predicates
        if (structureDelta.getPredicate() != null && !structureDelta.getPredicate().getAction().equals(DeltaAction.UNCHANGED)) {
          if (structureDelta.getPredicate().getAction().equals(DeltaAction.DELETED)) {
            Element changedElement = new Element("Change");
            changedElement.addAttribute(new Attribute("type", Type.PREDICATE.getValue()));
            changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
            changedElement.addAttribute(new Attribute("action", structureDelta.getPredicate().getAction().name()));
            changedElement.addAttribute(new Attribute("property", Type.PREDICATE.getValue()));
            element.appendChild(changedElement);

            Element changedLoc = new Element("Change");
            changedLoc.addAttribute(new Attribute("type", Type.PREDICATE.getValue()));
            changedLoc.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
            changedLoc.addAttribute(new Attribute("action", structureDelta.getPredicate().getAction().name()));
            changedLoc.addAttribute(new Attribute("property", "location"));
            changedLoc.addAttribute(new Attribute("oldValue", datatypeName + "-" + structureDelta.getPosition().toString()));

            element.appendChild(changedLoc);
          }
          if (structureDelta.getPredicate().getFalseUsage() != null && !structureDelta.getPredicate().getFalseUsage().getAction().equals(DeltaAction.UNCHANGED)) {
            Element changedElement = new Element("Change");
            changedElement.addAttribute(new Attribute("type", Type.PREDICATE.getValue()));
            changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
            changedElement.addAttribute(new Attribute("action", structureDelta.getPredicate().getFalseUsage().getAction().name()));
            changedElement.addAttribute(new Attribute("property", PropertyType.FALSEUSAGE.name()));
            if (structureDelta.getPredicate().getFalseUsage().getPrevious() != null) {
              changedElement.addAttribute(new Attribute("oldValue", structureDelta.getPredicate().getFalseUsage().getPrevious().name()));
            }
            element.appendChild(changedElement);
          }

          if (structureDelta.getPredicate().getTrueUsage() != null && !structureDelta.getPredicate().getTrueUsage().getAction().equals(DeltaAction.UNCHANGED)) {
            Element changedElement = new Element("Change");
            changedElement.addAttribute(new Attribute("type", Type.PREDICATE.getValue()));
            changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
            changedElement.addAttribute(new Attribute("action", structureDelta.getPredicate().getTrueUsage().getAction().name()));
            changedElement.addAttribute(new Attribute("property", PropertyType.TRUEUSAGE.name()));
            if (structureDelta.getPredicate().getTrueUsage().getPrevious() != null) {
              changedElement.addAttribute(new Attribute("oldValue", structureDelta.getPredicate().getTrueUsage().getPrevious().name()));
            }
            element.appendChild(changedElement);
          }

          if (structureDelta.getPredicate().getDescription() != null && !structureDelta.getPredicate().getDescription().getAction().equals(DeltaAction.UNCHANGED)) {
            Element changedElement = new Element("Change");
            changedElement.addAttribute(new Attribute("type", Type.PREDICATE.getValue()));
            changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
            changedElement.addAttribute(new Attribute("action", structureDelta.getPredicate().getDescription().getAction().name()));
            changedElement.addAttribute(new Attribute("property", PropertyType.DESCRIPTION.name()));
            if (structureDelta.getPredicate().getDescription().getPrevious() != null) {
              changedElement.addAttribute(new Attribute("oldValue", structureDelta.getPredicate().getDescription().getPrevious()));
            }
            element.appendChild(changedElement);
          }

        }

        // Valueset bindings
        if (structureDelta.getValueSetBinding() != null && !structureDelta.getValueSetBinding().getAction().equals(DeltaAction.UNCHANGED)) {
          if (structureDelta.getValueSetBinding().getAction().equals(DeltaAction.DELETED)) {
            Element addedBinding = new Element("Change");
            addedBinding.addAttribute(new Attribute("type", "ValuesetBinding"));
            addedBinding.addAttribute(new Attribute("elementId", structureDelta.getPosition().toString()));
            addedBinding.addAttribute(new Attribute("action", structureDelta.getValueSetBinding().getAction().name()));
            addedBinding.addAttribute(new Attribute("property", "VALUESETBINDING"));
            element.appendChild(addedBinding);

            Element addedPos2 = new Element("Change");
            addedPos2.addAttribute(new Attribute("type", "ValuesetBinding"));
            addedPos2.addAttribute(new Attribute("elementId", structureDelta.getPosition().toString()));
            addedPos2.addAttribute(new Attribute("action", structureDelta.getValueSetBinding().getAction().name()));
            addedPos2.addAttribute(new Attribute("property", "Position2"));
            addedPos2.addAttribute(new Attribute("oldValue", datatypeName + "." + structureDelta.getPosition().toString()));
            element.appendChild(addedPos2);
          }
          //VS bindings
          if (structureDelta.getValueSetBinding().getValueSets() != null && !structureDelta.getValueSetBinding().getValueSets().getAction().equals(DeltaAction.UNCHANGED)) {
            Element changedElement = new Element("Change");
            changedElement.addAttribute(new Attribute("type", structureDelta.getType().getValue()));
            changedElement.addAttribute(new Attribute("position", structureDelta.getPosition().toString()));
            changedElement.addAttribute(new Attribute("action", structureDelta.getValueSetBinding().getValueSets().getAction().name()));
            changedElement.addAttribute(new Attribute("property", PropertyType.VALUESET.name()));
            if (structureDelta.getValueSetBinding().getValueSets().getPrevious() != null) {
              changedElement.addAttribute(new Attribute("oldValue", serializationTools.extractVs(structureDelta.getValueSetBinding().getValueSets().getPrevious())));
            }
            element.appendChild(changedElement);

            Element changedElementV = new Element("Change");
            changedElementV.addAttribute(new Attribute("type", "ValuesetBinding"));
            changedElementV.addAttribute(new Attribute("elementId", structureDelta.getPosition().toString()));
            changedElementV.addAttribute(new Attribute("action", structureDelta.getValueSetBinding().getValueSets().getAction().name()));
            changedElementV.addAttribute(new Attribute("property", "name"));
            if (structureDelta.getValueSetBinding().getValueSets().getPrevious() != null) {
              changedElementV.addAttribute(new Attribute("oldValue", serializationTools.extractVs(structureDelta.getValueSetBinding().getValueSets().getPrevious())));
            }
            element.appendChild(changedElementV);
          }

          //Strength
          if (structureDelta.getValueSetBinding().getStrength() != null && !structureDelta.getValueSetBinding().getStrength().getAction().equals(DeltaAction.UNCHANGED)) {
            Element addedS = new Element("Change");
            addedS.addAttribute(new Attribute("type", "ValuesetBinding"));
            addedS.addAttribute(new Attribute("elementId", structureDelta.getPosition().toString()));
            addedS.addAttribute(new Attribute("action", structureDelta.getValueSetBinding().getStrength().getAction().name()));
            addedS.addAttribute(new Attribute("property", "strength"));
            if (structureDelta.getValueSetBinding().getStrength().getPrevious() != null) {
              addedS.addAttribute(new Attribute("oldValue", structureDelta.getValueSetBinding().getStrength().getPrevious().value));
            }
            element.appendChild(addedS);
          }

          // Locations
          if (structureDelta.getValueSetBinding().getValuesetLocations() != null && !structureDelta.getValueSetBinding().getValuesetLocations().getAction().equals(DeltaAction.UNCHANGED)) {
            Element addedS = new Element("Change");
            addedS.addAttribute(new Attribute("type", "ValuesetBinding"));
            addedS.addAttribute(new Attribute("elementId", structureDelta.getPosition().toString()));
            addedS.addAttribute(new Attribute("action", structureDelta.getValueSetBinding().getValuesetLocations().getAction().name()));
            addedS.addAttribute(new Attribute("property", "locations"));
            if (structureDelta.getValueSetBinding().getValuesetLocations().getPrevious() != null) {
              addedS.addAttribute(new Attribute("oldValue", serializationTools.extractLocations(structureDelta.getValueSetBinding().getValuesetLocations().getPrevious())));

            }
            element.appendChild(addedS);
          }


        }

        //Internal codes
        if (structureDelta.getInternalSingleCode() != null && !structureDelta.getInternalSingleCode().getAction().equals(DeltaAction.UNCHANGED)) {

          //Code
          if (structureDelta.getInternalSingleCode().getCode() != null && !structureDelta.getInternalSingleCode().getCode().getAction().equals(DeltaAction.UNCHANGED)) {
            Element changedElementS = new Element("Change");
            changedElementS.addAttribute(new Attribute("type", "InternalSingleCode"));
            changedElementS.addAttribute(new Attribute("elementId", structureDelta.getPosition().toString()));
            changedElementS.addAttribute(new Attribute("action", structureDelta.getInternalSingleCode().getCode().getAction().name()));
            changedElementS.addAttribute(new Attribute("property", "internalSingleCodeId"));
            if (structureDelta.getInternalSingleCode().getCode().getPrevious() != null) {
              changedElementS.addAttribute(new Attribute("oldValue", structureDelta.getInternalSingleCode().getCode().getPrevious()));
            }
            element.appendChild(changedElementS);
          }

          //Code System
          if (structureDelta.getInternalSingleCode().getCodeSystem() != null && !structureDelta.getInternalSingleCode().getCodeSystem().getAction().equals(DeltaAction.UNCHANGED)) {
            Element changedElementS = new Element("Change");
            changedElementS.addAttribute(new Attribute("type", "InternalSingleCode"));
            changedElementS.addAttribute(new Attribute("elementId", structureDelta.getPosition().toString()));
            changedElementS.addAttribute(new Attribute("action", structureDelta.getInternalSingleCode().getCodeSystem().getAction().name()));
            changedElementS.addAttribute(new Attribute("property", "internalSingleCodeSystem"));
            if (structureDelta.getInternalSingleCode().getCodeSystem().getPrevious() != null) {
              changedElementS.addAttribute(new Attribute("oldValue", structureDelta.getInternalSingleCode().getCodeSystem().getPrevious()));
            }
            element.appendChild(changedElementS);
          }
        }
      }

    }
  }


}
