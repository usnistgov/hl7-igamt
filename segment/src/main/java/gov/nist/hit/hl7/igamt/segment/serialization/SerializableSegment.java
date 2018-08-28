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
package gov.nist.hit.hl7.igamt.segment.serialization;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.datatype.exception.DatatypeNotFoundException;
import gov.nist.hit.hl7.igamt.segment.domain.DynamicMappingInfo;
import gov.nist.hit.hl7.igamt.segment.domain.DynamicMappingItem;
import gov.nist.hit.hl7.igamt.segment.domain.Field;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.serialization.exception.DynamicMappingSerializationException;
import gov.nist.hit.hl7.igamt.serialization.domain.SerializableResource;
import gov.nist.hit.hl7.igamt.serialization.exception.ResourceSerializationException;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import gov.nist.hit.hl7.igamt.serialization.exception.SubStructElementSerializationException;
import nu.xom.Attribute;
import nu.xom.Element;

/**
 *
 * @author Maxence Lefort on Mar 27, 2018.
 */
public class SerializableSegment extends SerializableResource {

  private Map<String, String> datatypesMap;
  private Map<String, String> valuesetNamesMap;
  private Map<String, String> valuesetLabelMap;
  private int level;
  private Set<String> bindedFields;

  /**
   * @param segment
   * @param position
   */
  public SerializableSegment(Segment segment, String position, int level,
      Map<String, String> datatypesMap, Map<String, String> valuesetNamesMap, Map<String, String> valuesetLabelMap,Set<String> bindedFields) {
    super(segment, position);
    this.datatypesMap = datatypesMap;
    this.valuesetNamesMap = valuesetNamesMap;
    this.valuesetLabelMap = valuesetLabelMap;
    this.level = level;
    this.bindedFields = bindedFields;
  }

  @Override
  public Element serialize() throws ResourceSerializationException {
    Element segmentElement = super.getElement(Type.SEGMENT);
    Segment segment = (Segment) this.getAbstractDomain();
    try {
      segmentElement
          .addAttribute(new Attribute("ext", segment.getExt() != null ? segment.getExt() : ""));
      if (segment.getDynamicMappingInfo() != null) {
        try {
          Element dynamicMappingElement =
              this.serializeDynamicMapping(segment.getDynamicMappingInfo());
          if (dynamicMappingElement != null) {
            segmentElement.appendChild(dynamicMappingElement);
          }
        } catch (DatatypeNotFoundException exception) {
          throw new DynamicMappingSerializationException(exception,
              segment.getDynamicMappingInfo());
        }
      }
      if (segment.getBinding() != null) {
        Element bindingElement =
            super.serializeResourceBinding(segment.getBinding(), this.valuesetNamesMap, this.valuesetLabelMap);
        if (bindingElement != null) {
          segmentElement.appendChild(bindingElement);
        }
      }
      if (segment.getChildren() != null) {
        Element fieldsElement = this.serializeFields(segment.getChildren());
        if (fieldsElement != null) {
          segmentElement.appendChild(fieldsElement);
        }
      }
      return super.getSectionElement(segmentElement, level);
    } catch (SerializationException exception) {
      throw new ResourceSerializationException(exception, Type.SEGMENT, segment);
    }
  }

  private Element serializeFields(Set<Field> fields) throws SubStructElementSerializationException {
    if (fields.size() > 0) {
      Element fieldsElement = new Element("Fields");
      for (Field field : fields) {
        if(this.bindedFields.contains(field.getId())) {
          try {
            if (field != null) {
              Element fieldElement = new Element("Field");
              fieldElement.addAttribute(new Attribute("confLength",
                  field.getConfLength() != null ? field.getConfLength() : ""));
              fieldElement.addAttribute(
                  new Attribute("name", field.getName() != null ? field.getName() : ""));
              fieldElement
                  .addAttribute(new Attribute("id", field.getId() != null ? field.getId() : ""));
              fieldElement.addAttribute(new Attribute("maxLength",
                  field.getMaxLength() != null ? field.getMaxLength() : ""));
              fieldElement.addAttribute(new Attribute("minLength",
                  field.getMinLength() != null ? field.getMinLength() : ""));
              fieldElement.addAttribute(
                  new Attribute("text", field.getText() != null ? field.getText() : ""));
              fieldElement.addAttribute(new Attribute("custom", String.valueOf(field.isCustom())));
              fieldElement.addAttribute(new Attribute("max", String.valueOf(field.getMax())));
              fieldElement.addAttribute(new Attribute("min", String.valueOf(field.getMin())));
              fieldElement
                  .addAttribute(new Attribute("position", String.valueOf(field.getPosition())));
              if (field.getRef() != null && field.getRef().getId() != null) {
                if (this.datatypesMap.containsKey(field.getRef().getId())) {
                  fieldElement.addAttribute(
                      new Attribute("datatype", this.datatypesMap.get(field.getRef().getId())));
                } else {
                  throw new DatatypeNotFoundException(field.getRef().getId());
                }
              }
              fieldElement.addAttribute(
                  new Attribute("usage", field.getUsage() != null ? field.getUsage().name() : ""));
              fieldsElement.appendChild(fieldElement);
            }
          } catch (DatatypeNotFoundException exception) {
            throw new SubStructElementSerializationException(exception, field);
          }
        }
      }
      return fieldsElement;
    }
    return null;
  }

  private Element serializeDynamicMapping(DynamicMappingInfo dynamicMappingInfo)
      throws DatatypeNotFoundException {
    if(dynamicMappingInfo != null && dynamicMappingInfo.getItems() != null) {
      Element dynamicMappingElement = new Element("DynamicMapping");
      dynamicMappingElement.addAttribute(new Attribute("referencePath",
          dynamicMappingInfo.getReferencePath() != null ? dynamicMappingInfo.getReferencePath()
              : ""));
      dynamicMappingElement.addAttribute(new Attribute("variesDatatypePath",
          dynamicMappingInfo.getVariesDatatypePath() != null
              ? dynamicMappingInfo.getVariesDatatypePath()
              : ""));
      for (DynamicMappingItem dynamicMappingItem : dynamicMappingInfo.getItems()) {
        if (dynamicMappingItem != null) {
          Element dynamicMappingItemElement = new Element("DynamicMappingItem");
          if (dynamicMappingItem.getDatatypeId() != null) {
            if (this.datatypesMap.containsKey(dynamicMappingItem.getDatatypeId())) {
              dynamicMappingItemElement.addAttribute(new Attribute("datatype",
                  this.datatypesMap.get((dynamicMappingItem.getDatatypeId()))));
            } else {
              throw new DatatypeNotFoundException(dynamicMappingItem.getDatatypeId());
            }
          }
          dynamicMappingItemElement.addAttribute(new Attribute("value",
              dynamicMappingItem.getValue() != null ? dynamicMappingItem.getValue() : ""));
          dynamicMappingElement.appendChild(dynamicMappingItemElement);
        }
      }
      return dynamicMappingElement;
    }
    return null;
  }

  @Override
  public Map<String, String> getIdPathMap() {
    Map<String, String> idPathMap = new HashMap<String, String>();
    Segment segment = (Segment) this.getAbstractDomain();
    for(Field field : segment.getChildren()) {
      if(!idPathMap.containsKey(field.getId())) {
        String path = segment.getLabel()+FIELD_PATH_SEPARATOR+field.getPosition();
        idPathMap.put(field.getId(), path);
      }
    }
    return idPathMap;
  }
}
