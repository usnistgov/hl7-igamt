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
package gov.nist.hit.hl7.igamt.conformanceprofile.serialization;

import java.util.Map;

import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.serialization.domain.SerializableResource;
import gov.nist.hit.hl7.igamt.serialization.exception.MsgStructElementSerializationException;
import gov.nist.hit.hl7.igamt.serialization.exception.ResourceSerializationException;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import gov.nist.hit.hl7.igamt.shared.domain.Group;
import gov.nist.hit.hl7.igamt.shared.domain.MsgStructElement;
import gov.nist.hit.hl7.igamt.shared.domain.Resource;
import gov.nist.hit.hl7.igamt.shared.domain.SegmentRef;
import gov.nist.hit.hl7.igamt.shared.domain.Type;
import gov.nist.hit.hl7.igamt.shared.domain.exception.DatatypeNotFoundException;
import nu.xom.Attribute;
import nu.xom.Element;

/**
 *
 * @author Maxence Lefort on Mar 28, 2018.
 */
public class SerializableConformanceProfile extends SerializableResource {

  private Map<String,String> datatypeMap;
  private Map<String,String> valuesetMap;
  
  /**
   * @param resource
   * @param position
   */
  public SerializableConformanceProfile(ConformanceProfile conformanceProfile, String position, Map<String,String> datatypeMap, Map<String,String> valuesetMap) {
    super(conformanceProfile, position);
    this.datatypeMap = datatypeMap;
    this.valuesetMap = valuesetMap;
  }

  @Override
  public Element serialize() throws ResourceSerializationException {
    ConformanceProfile conformanceProfile = (ConformanceProfile) this.getAbstractDomain();
    if (conformanceProfile != null) {
      try {
        Element element = super.getElement("ConformanceProfile");
        element.addAttribute(new Attribute("identifier",
            conformanceProfile.getIdentifier() != null ? conformanceProfile.getIdentifier() : ""));
        element.addAttribute(new Attribute("messageType",
            conformanceProfile.getMessageType() != null ? conformanceProfile.getMessageType()
                : ""));
        element.addAttribute(new Attribute("event",
            conformanceProfile.getEvent() != null ? conformanceProfile.getEvent() : ""));
        element.addAttribute(new Attribute("structID",
            conformanceProfile.getStructID() != null ? conformanceProfile.getStructID() : ""));
        if (conformanceProfile.getChildren() != null
            && conformanceProfile.getChildren().size() > 0) {
          Element segmentsElement = new Element("MsgStructElements");
          for (MsgStructElement msgStructElm : conformanceProfile.getChildren()) {
            if (msgStructElm != null) {
              Element msgStructElement = this.serializeMsgStructElement(msgStructElm);
              if (msgStructElement != null) {
                segmentsElement.appendChild(msgStructElement);
              }
            }
          }
          element.appendChild(segmentsElement);
        }
        return element;
      } catch (Exception exception) {
        throw new ResourceSerializationException(exception, Type.CONFORMANCEPROFILE, (Resource) this.getAbstractDomain());
      }
    }
    return null;
  }

  /**
   * @param msgStructElm
   * @return
   * @throws SerializationException 
   * @throws Exception
   */
  private Element serializeMsgStructElement(MsgStructElement msgStructElm)
      throws SerializationException {
    Element msgStructElement;
    if (msgStructElm instanceof Group) {
      msgStructElement = serializeGroup((Group) msgStructElm);
    } else if (msgStructElm instanceof SegmentRef) {
      msgStructElement = serializeSegmentRef((SegmentRef) msgStructElm);
    } else {
      throw new MsgStructElementSerializationException(new Exception(
          "Unable to serialize conformance profile element: element isn't a Group or SegmentRef instance ("
              + msgStructElm.getClass().getName() + ")"),
          msgStructElm);
    }
    if (msgStructElement != null) {
      msgStructElement.addAttribute(new Attribute("min", String.valueOf(msgStructElm.getMin())));
      msgStructElement.addAttribute(new Attribute("max", msgStructElm.getMax()));
    }
    return msgStructElement;
  }

  /**
   * @param msgStructElm
   * @return
   * @throws  
   */
  private Element serializeSegmentRef(SegmentRef segmentRef)
      throws MsgStructElementSerializationException {
    Element segmentRefElement = new Element("SegmentRef");
    try {
      if(segmentRef.getRef() != null && segmentRef.getRef().getId() != null) {
        if(this.datatypeMap.containsKey(segmentRef.getRef().getId())){
          segmentRefElement.addAttribute(new Attribute("datatype",this.datatypeMap.get(segmentRef.getRef().getId())));
        } else {
          throw new DatatypeNotFoundException(segmentRef.getRef().getId());
        }
      }
      segmentRefElement.addAttribute(new Attribute("id",segmentRef.getId() != null ? segmentRef.getId() : ""));
      segmentRefElement.addAttribute(new Attribute("position",String.valueOf(segmentRef.getPosition())));
      segmentRefElement.addAttribute(new Attribute("name",segmentRef.getName() != null ? segmentRef.getName() : ""));
      segmentRefElement.addAttribute(new Attribute("text",segmentRef.getText() != null ? segmentRef.getText() : ""));
      segmentRefElement.addAttribute(new Attribute("max",segmentRef.getMax() != null ? segmentRef.getMax() : ""));
      segmentRefElement.addAttribute(new Attribute("min",String.valueOf(segmentRef.getMin())));
      segmentRefElement.addAttribute(new Attribute("type",Type.SEGMENTREF.name()));
      segmentRefElement.addAttribute(new Attribute("usage",segmentRef.getUsage() != null ? segmentRef.getUsage().name() : ""));
      return segmentRefElement;
    } catch (Exception exception) {
      throw new MsgStructElementSerializationException(exception,segmentRef);
    }
  }

  private Element serializeGroup(Group group) throws SerializationException {
    Element groupElement = new Element("Group");
    if(group.getBinding() != null) {
      Element binding = super.serializeResourceBinding(group.getBinding(), this.valuesetMap);
      if (binding != null) {
        groupElement.appendChild(binding);
      }
    }
    groupElement.addAttribute(new Attribute("name", group.getName()));
    for (MsgStructElement msgStructElm : group.getChildren()) {
      try {
        Element child = this.serializeMsgStructElement(msgStructElm);
        if (child != null) {
          groupElement.appendChild(child);
        }
      } catch (Exception exception) {
        throw new MsgStructElementSerializationException(exception, group);
      }
    }
    return groupElement;
  }

}
