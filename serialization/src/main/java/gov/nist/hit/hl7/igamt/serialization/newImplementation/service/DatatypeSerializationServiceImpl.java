package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Component;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.DateTimeComponentDefinition;
import gov.nist.hit.hl7.igamt.datatype.domain.DateTimeDatatype;
import gov.nist.hit.hl7.igamt.datatype.exception.DatatypeNotFoundException;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.ComponentDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.DatatypeDataModel;
import gov.nist.hit.hl7.igamt.serialization.exception.ResourceSerializationException;
import gov.nist.hit.hl7.igamt.serialization.exception.SubStructElementSerializationException;
import nu.xom.Attribute;
import nu.xom.Element;

@Service
public class DatatypeSerializationServiceImpl implements DatatypeSerializationService {
	
	@Autowired
	private IgDataModelSerializationService igDataModelSerializationService;

	@Override
	public Element serializeDatatype(DatatypeDataModel datatypeDataModel, int level, ExportConfiguration exportConfiguration) throws SubStructElementSerializationException {
//	    try {
	      Element datatypeElement = igDataModelSerializationService.serializeResource(datatypeDataModel.getModel(), Type.DATATYPE, exportConfiguration);
	      Datatype datatype = datatypeDataModel.getModel();
	      datatypeElement
	          .addAttribute(new Attribute("ext", datatype.getExt() != null ? datatype.getExt() : ""));
	      datatypeElement.addAttribute(new Attribute("purposeAndUse",
	          datatype.getPurposeAndUse() != null ? datatype.getPurposeAndUse() : ""));
//	      if (datatype.getBinding() != null) {
//	        Element bindingElement =  
//	            super.serializeResourceBinding(datatype.getBinding(), valuesetNamesMap);
//	        if (bindingElement != null) {
//	          datatypeElement.appendChild(bindingElement);
//	        }
//	        for (int i = 0; i < bindingElement.getChildElements().size(); i++) {
//	          Element structureElementBindings = bindingElement.getChildElements().get(i);
//	          for (int j = 0; j < structureElementBindings.getChildElements().size(); j++) {
//	            Element structureElementBinding = structureElementBindings.getChildElements().get(j);
//	            if (structureElementBinding.getLocalName().equals("StructureElementBinding")) {
//	              for (int k = 0; k < structureElementBinding.getChildElements().size(); k++) {
//	                Element valuesetBinding = structureElementBinding.getChildElements().get(k);
//	                if (valuesetBinding.getLocalName().equals("ValuesetBinding")) {
//	                  this.componentValuesetMap.put(
//	                      structureElementBinding.getAttributeValue("elementId"),
//	                      valuesetBinding.getAttributeValue("name"));
//	                }
//	              }
//	            }
//	          }
//	        }
//	      }
	      if (datatype instanceof ComplexDatatype) {
	        datatypeElement = serializeComplexDatatype(datatypeElement,datatypeDataModel);
	      } else if (datatype instanceof DateTimeDatatype) {
	        datatypeElement = serializeDateTimeDatatype(datatypeElement, datatypeDataModel);
	      }
	      return igDataModelSerializationService.getSectionElement(datatypeElement, datatypeDataModel.getModel(), level);

//	    } catch (Exception exception) {
//	    	exception.printStackTrace();
//	      throw new ResourceSerializationException(exception, Type.DATATYPE, datatypeDataModel.getModel());
//	    }
//	      
//	      return igDataModelSerializationService.getSectionElement(datatypeElement, datatypeDataModel.getModel(), level);

	}



	@Override
	public Element serializeComplexDatatype(Element datatypeElement, DatatypeDataModel datatypeDataModel) throws SubStructElementSerializationException {
	    ComplexDatatype complexDatatype = (ComplexDatatype) datatypeDataModel.getModel();
	    for (Component component : complexDatatype.getComponents()) {
//	      if(this.bindedComponents.contains(component.getId())) {
	        try {
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
	              new Attribute("text", component.getText() != null ? component.getText() : ""));
	          componentElement
	              .addAttribute(new Attribute("position", String.valueOf(component.getPosition())));
	          if (!datatypeDataModel.getValuesetMap().isEmpty() && !datatypeDataModel.getValuesetMap().get(component.getId()).isEmpty()) {
//		          if (!datatypeDataModel.getValuesetMap().isEmpty()) {
		        	  System.out.println("ITS NOT EMPTY");
	            componentElement
	                .addAttribute(new Attribute("valueset", datatypeDataModel.getValuesetMap().get(component.getId()).toString()));
	        	  System.out.println("LOOK HERE : " + datatypeDataModel.getValuesetMap().get(component.getId()).stream().findFirst());
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
	    return datatypeElement;
	  
	}

	@Override
	public Element serializeDateTimeDatatype(Element datatypeElement, DatatypeDataModel datatypeDataModel) {
	    DateTimeDatatype dateTimeDatatype =  (DateTimeDatatype) datatypeDataModel.getModel();
	    for (DateTimeComponentDefinition dateTimeComponentDefinition : dateTimeDatatype
	        .getDateTimeConstraints().getDateTimeComponentDefinitions()) {
	      Element dateTimeComponentDefinitionElement = new Element("DateTimeComponentDefinition");
	      if (dateTimeComponentDefinition != null) {
	        dateTimeComponentDefinitionElement.addAttribute(new Attribute("description",
	            dateTimeComponentDefinition.getDescription() != null
	                ? dateTimeComponentDefinition.getDescription()
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
	                ? dateTimeComponentDefinition.getUsage().name()
	                : ""));
	        datatypeElement.appendChild(dateTimeComponentDefinitionElement);
	      }
	    }
	    return datatypeElement;
	  }

}
