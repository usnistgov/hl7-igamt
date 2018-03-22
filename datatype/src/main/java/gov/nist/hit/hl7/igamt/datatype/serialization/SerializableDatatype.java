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

import java.util.HashMap;

import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.DateTimeComponentDefinition;
import gov.nist.hit.hl7.igamt.datatype.domain.DateTimeDatatype;
import gov.nist.hit.hl7.igamt.shared.domain.Component;
import gov.nist.hit.hl7.igamt.shared.domain.Ref;
import gov.nist.hit.hl7.igamt.shared.domain.serialization.SerializableResource;
import nu.xom.Attribute;
import nu.xom.Element;

/**
 *
 * @author Maxence Lefort on Mar 15, 2018.
 */
public class SerializableDatatype extends SerializableResource{

  private HashMap<Ref,String> refDatatypeLabelMap = null;
  
  /**
   * @param abstractDomain
   * @param position
   */
  public SerializableDatatype(Datatype datatype, String position, HashMap<Ref,String> refDatatypeLabelMap) {
    super(datatype, position);
    this.refDatatypeLabelMap = refDatatypeLabelMap;
  }
  
  public SerializableDatatype(Datatype datatype, String position) {
    super(datatype, position);
  }

  @Override
  public Element serialize() {
    Element datatypeElement = super.getElement("Datatype");
    Datatype datatype = (Datatype) this.resource;
    datatypeElement.addAttribute(new Attribute("ext",datatype.getExt()));
    datatypeElement.addAttribute(new Attribute("purposeAndUse",datatype.getPurposeAndUse()));
    datatypeElement.appendChild(super.serializeResourceBinding(datatype.getBinding()));
    if(datatype instanceof ComplexDatatype) {
      datatypeElement = serializeComplexDatatype(datatypeElement);
    } else if (datatype instanceof DateTimeDatatype) {
      datatypeElement = serializeDateTimeDatatype(datatypeElement);
    }
    return datatypeElement;
  }

  private Element serializeComplexDatatype(Element datatypeElement) {
    ComplexDatatype complexDatatype = (ComplexDatatype) super.getResource();
    for(Component component : complexDatatype.getComponents()) {
      Element componentElement = new Element("Component");
      componentElement.addAttribute(new Attribute("confLength",component.getConfLength()));
      componentElement.addAttribute(new Attribute("id",component.getId()));
      componentElement.addAttribute(new Attribute("maxLength",component.getMaxLength()));
      componentElement.addAttribute(new Attribute("minLength",component.getMinLength()));
      componentElement.addAttribute(new Attribute("text",component.getText()));
      componentElement.addAttribute(new Attribute("position",String.valueOf(component.getPosition())));
      if(component.getRef() != null && refDatatypeLabelMap != null && refDatatypeLabelMap.containsKey(component.getRef())){
        componentElement.addAttribute(new Attribute("datatype",refDatatypeLabelMap.get(component.getRef())));
      }
      componentElement.addAttribute(new Attribute("usage",component.getUsage().toString()));
      datatypeElement.appendChild(componentElement);
    }
    return datatypeElement;
  }
  
  private Element serializeDateTimeDatatype(Element datatypeElement) {
    DateTimeDatatype dateTimeDatatype = (DateTimeDatatype) super.getResource();
    for(DateTimeComponentDefinition dateTimeComponentDefinition : dateTimeDatatype.getDateTimeConstraints().getDateTimeComponentDefinitions()) {
      Element dateTimeComponentDefinitionElement = new Element("DateTimeComponentDefinition");
      dateTimeComponentDefinitionElement.addAttribute(new Attribute("description",dateTimeComponentDefinition.getDescription()));
      dateTimeComponentDefinitionElement.addAttribute(new Attribute("name",dateTimeComponentDefinition.getName()));
      dateTimeComponentDefinitionElement.addAttribute(new Attribute("predicate",dateTimeComponentDefinition.getDateTimePredicate().toString()));
      dateTimeComponentDefinitionElement.addAttribute(new Attribute("position",String.valueOf(dateTimeComponentDefinition.getPosition())));
      dateTimeComponentDefinitionElement.addAttribute(new Attribute("usage",dateTimeComponentDefinition.getUsage().name()));
    }
    return datatypeElement;
  }
  
}
