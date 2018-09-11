package gov.nist.hit.hl7.igamt.web.export.service.impl;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Component;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.DateTimeComponentDefinition;
import gov.nist.hit.hl7.igamt.datatype.domain.DateTimeDatatype;
import gov.nist.hit.hl7.igamt.datatype.exception.DatatypeNotFoundException;
import gov.nist.hit.hl7.igamt.serialization.domain.SerializableResource;
import gov.nist.hit.hl7.igamt.serialization.exception.ResourceSerializationException;
import gov.nist.hit.hl7.igamt.serialization.exception.SubStructElementSerializationException;
import gov.nist.hit.hl7.igamt.serialization.util.FroalaSerializationUtil;
import nu.xom.Attribute;
import nu.xom.Element;

public class SerializableDatatypeForWeb extends SerializableResource {

  private Map<String, String> datatypeNamesMap = null;
  private Map<String, String> valuesetNamesMap = null;
  private Map<String, String> valuesetLabelMap;
  private int level;
  private Map<String, String> componentValuesetMap = new HashMap<>();
//  private Set<String> bindedComponents;

  /**
   * @param abstractDomain
   * @param position
   */
  public SerializableDatatypeForWeb(Datatype datatype, String position, int level,
      Map<String, String> datatypeNamesMap, Map<String, String> valuesetNamesMap, Map<String, String> valuesetLabelMap) {
    super(datatype, position);
    this.datatypeNamesMap = datatypeNamesMap;
    this.valuesetNamesMap = valuesetNamesMap;
    this.valuesetLabelMap = valuesetLabelMap;
//    this.bindedComponents = bindedComponents;
    this.level = level;
  }

  public SerializableDatatypeForWeb(Datatype datatype, String position) {
    super(datatype, position);
  }
  
  @Override
  public String formatStringData(String str) {
	  return str;
  }

  @Override
  public Element serialize() throws ResourceSerializationException {
    try {
      Element datatypeElement = super.getElement(Type.DATATYPE);
      Datatype datatype = (Datatype) this.getAbstractDomain();
      datatypeElement
          .addAttribute(new Attribute("ext", datatype.getExt() != null ? datatype.getExt() : ""));
      datatypeElement.addAttribute(new Attribute("purposeAndUse",
          datatype.getPurposeAndUse() != null ? datatype.getPurposeAndUse() : ""));
      if (datatype.getBinding() != null) {
        Element bindingElement =
            super.serializeResourceBinding(datatype.getBinding(), valuesetNamesMap);
        if (bindingElement != null) {
          datatypeElement.appendChild(bindingElement);
        }
        for (int i = 0; i < bindingElement.getChildElements().size(); i++) {
          Element structureElementBindings = bindingElement.getChildElements().get(i);
          for (int j = 0; j < structureElementBindings.getChildElements().size(); j++) {
            Element structureElementBinding = structureElementBindings.getChildElements().get(j);
            if (structureElementBinding.getLocalName().equals("StructureElementBinding")) {
              for (int k = 0; k < structureElementBinding.getChildElements().size(); k++) {
                Element valuesetBinding = structureElementBinding.getChildElements().get(k);
                if (valuesetBinding.getLocalName().equals("ValuesetBinding")) {
                  this.componentValuesetMap.put(
                      structureElementBinding.getAttributeValue("elementId"),
                      valuesetBinding.getAttributeValue("name"));
                }
              }
            }
          }
        }
      }
      if (datatype instanceof ComplexDatatype) {
        datatypeElement = serializeComplexDatatype(datatypeElement);
      } else if (datatype instanceof DateTimeDatatype) {
        datatypeElement = serializeDateTimeDatatype(datatypeElement);
      }
      return super.getSectionElement(datatypeElement, this.level);
    } catch (Exception exception) {
    	exception.printStackTrace();
      throw new ResourceSerializationException(exception, Type.DATATYPE,
          (Datatype) this.getAbstractDomain());
    }
  }

  private Element serializeComplexDatatype(Element datatypeElement)
      throws SubStructElementSerializationException {
    ComplexDatatype complexDatatype = (ComplexDatatype) super.getAbstractDomain();
    for (Component component : complexDatatype.getComponents()) {
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
          if (componentValuesetMap.containsKey(component.getId())) {
            componentElement
                .addAttribute(new Attribute("valueset", componentValuesetMap.get(component.getId())));
          }
          if (component.getRef() != null) {
            if (datatypeNamesMap != null
                && datatypeNamesMap.containsKey(component.getRef().getId())) {
              componentElement.addAttribute(
                  new Attribute("datatype", datatypeNamesMap.get(component.getRef().getId())));
            } else {
              //throw new DatatypeNotFoundException(component.getRef().getId());
            }
          }
          componentElement.addAttribute(new Attribute("usage",
              component.getUsage() != null ? component.getUsage().toString() : ""));
          datatypeElement.appendChild(componentElement);
        } catch (Exception exception) {
          throw new SubStructElementSerializationException(exception, component);
        }
      
    }
    return datatypeElement;
  }

  private Element serializeDateTimeDatatype(Element datatypeElement) {
    DateTimeDatatype dateTimeDatatype = (DateTimeDatatype) super.getAbstractDomain();
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
  
  @Override
  public Map<String, String> getIdPathMap() {
    Map<String, String> idPathMap = new HashMap<String, String>();
    if(this.getAbstractDomain() instanceof ComplexDatatype) {
      ComplexDatatype datatype = (ComplexDatatype) this.getAbstractDomain();
      for(Component component : datatype.getComponents()) {
        if(!idPathMap.containsKey(component.getId())) {
          String path = datatype.getLabel()+COMPONENT_PATH_SEPARATOR+component.getPosition();
          idPathMap.put(component.getId(), path);
        }
      }
    }
    return idPathMap;
  }

}
