/**
 * 
 * This software was developed at the National Institute of Standards and Technology by employees of
 * the Federal Government in the course of their official duties. Pursuant to title 17 Section 105
 * of the United States Code this software is not subject to copyright protection and is in the
 * public domain. This is an experimental system. NIST assumes no responsibility whatsoever for its
 * use by other parties, and makes no guarantees, expressed or implied, about its quality,
 * reliability, or any other characteristic. We would appreciate acknowledgement if the software is
 * used. This software can be redistributed and/or modified freely provided that any derivative
 * works bear some notice that they are derived from it, and any modified versions bear some notice
 * that they have been modified.
 * 
 */
package gov.nist.hit.hl7.igamt.datatype.serialization;

import java.util.Map;

import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.DateTimeComponentDefinition;
import gov.nist.hit.hl7.igamt.datatype.domain.DateTimeDatatype;
import gov.nist.hit.hl7.igamt.serialization.domain.SerializableResource;
import gov.nist.hit.hl7.igamt.serialization.exception.ResourceSerializationException;
import gov.nist.hit.hl7.igamt.serialization.exception.SubStructElementSerializationException;
import gov.nist.hit.hl7.igamt.shared.domain.Component;
import gov.nist.hit.hl7.igamt.shared.domain.Ref;
import gov.nist.hit.hl7.igamt.shared.domain.Type;
import gov.nist.hit.hl7.igamt.shared.domain.exception.DatatypeNotFoundException;
import nu.xom.Attribute;
import nu.xom.Element;

/**
 *
 * @author Maxence Lefort on Mar 15, 2018.
 */
public class SerializableDatatype extends SerializableResource{

  private Map<Ref,String> refDatatypeLabelMap = null;
  
  /**
   * @param abstractDomain
   * @param position
   */
  public SerializableDatatype(Datatype datatype, String position, Map<Ref,String> refDatatypeLabelMap) {
    super(datatype, position);
    this.refDatatypeLabelMap = refDatatypeLabelMap;
  }
  
  public SerializableDatatype(Datatype datatype, String position) {
    super(datatype, position);
  }

  @Override
  public Element serialize() throws ResourceSerializationException {
    try {
      Element datatypeElement = super.getElement("Datatype");
      Datatype datatype = (Datatype) this.getAbstractDomain();
      datatypeElement.addAttribute(new Attribute("ext",datatype.getExt() != null ? datatype.getExt() : ""));
      datatypeElement.addAttribute(new Attribute("purposeAndUse",datatype.getPurposeAndUse() != null ? datatype.getPurposeAndUse() : ""));
      Element bindingElement = super.serializeResourceBinding(datatype.getBinding());
      if(bindingElement != null) {
        datatypeElement.appendChild(bindingElement);
      }
      if(datatype instanceof ComplexDatatype) {
        datatypeElement = serializeComplexDatatype(datatypeElement);
      } else if (datatype instanceof DateTimeDatatype) {
        datatypeElement = serializeDateTimeDatatype(datatypeElement);
      }
      return datatypeElement;
    } catch (Exception exception) {
      throw new ResourceSerializationException(exception, Type.DATATYPE, (Datatype) this.getAbstractDomain());
    }
  }

  private Element serializeComplexDatatype(Element datatypeElement) throws SubStructElementSerializationException {
    ComplexDatatype complexDatatype = (ComplexDatatype) super.getAbstractDomain();
    for(Component component : complexDatatype.getComponents()) {
      try {
        Element componentElement = new Element("Component");
        componentElement.addAttribute(new Attribute("confLength",component.getConfLength() != null ? component.getConfLength() : ""));
        componentElement.addAttribute(new Attribute("id",component.getId() != null ? component.getId() : ""));
        componentElement.addAttribute(new Attribute("name",component.getName() != null ? component.getName() : ""));
        componentElement.addAttribute(new Attribute("maxLength",component.getMaxLength() != null ? component.getMaxLength() : ""));
        componentElement.addAttribute(new Attribute("minLength",component.getMinLength() != null ? component.getMinLength() : ""));
        componentElement.addAttribute(new Attribute("text",component.getText() != null ? component.getText() : ""));
        componentElement.addAttribute(new Attribute("position",String.valueOf(component.getPosition())));
        if(component.getRef() != null){
          if(refDatatypeLabelMap != null && refDatatypeLabelMap.containsKey(component.getRef())) {
            componentElement.addAttribute(new Attribute("datatype",refDatatypeLabelMap.get(component.getRef())));
          } else {
            throw new DatatypeNotFoundException(component.getRef().getId());
          }
        }
        componentElement.addAttribute(new Attribute("usage",component.getUsage() != null ? component.getUsage().toString() : ""));
        datatypeElement.appendChild(componentElement);
      } catch (Exception exception) {
        throw new SubStructElementSerializationException(exception, component);
      }
    }
    return datatypeElement;
  }
  
  private Element serializeDateTimeDatatype(Element datatypeElement) {
    DateTimeDatatype dateTimeDatatype = (DateTimeDatatype) super.getAbstractDomain();
    for(DateTimeComponentDefinition dateTimeComponentDefinition : dateTimeDatatype.getDateTimeConstraints().getDateTimeComponentDefinitions()) {
      Element dateTimeComponentDefinitionElement = new Element("DateTimeComponentDefinition");
      if(dateTimeComponentDefinition != null) {
        dateTimeComponentDefinitionElement.addAttribute(new Attribute("description",dateTimeComponentDefinition.getDescription() != null ? dateTimeComponentDefinition.getDescription() : ""));
        dateTimeComponentDefinitionElement.addAttribute(new Attribute("name",dateTimeComponentDefinition.getName() != null ? dateTimeComponentDefinition.getName() : ""));
        dateTimeComponentDefinitionElement.addAttribute(new Attribute("predicate",dateTimeComponentDefinition.getDateTimePredicate() != null ? dateTimeComponentDefinition.getDateTimePredicate().toString() : ""));
        dateTimeComponentDefinitionElement.addAttribute(new Attribute("position",String.valueOf(dateTimeComponentDefinition.getPosition())));
        dateTimeComponentDefinitionElement.addAttribute(new Attribute("usage",dateTimeComponentDefinition.getUsage() != null ? dateTimeComponentDefinition.getUsage().name() : ""));
        datatypeElement.appendChild(dateTimeComponentDefinitionElement);
      }
    }
    return datatypeElement;
  }
  
}
