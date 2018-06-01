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

import org.apache.commons.lang3.StringUtils;

import gov.nist.hit.hl7.igamt.common.base.domain.MsgStructElement;
import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.exception.SegmentNotFoundException;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.Group;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRef;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.serialization.domain.SerializableResource;
import gov.nist.hit.hl7.igamt.serialization.exception.MsgStructElementSerializationException;
import gov.nist.hit.hl7.igamt.serialization.exception.ResourceSerializationException;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import nu.xom.Attribute;
import nu.xom.Element;

/**
 *
 * @author Maxence Lefort on Mar 28, 2018.
 */
public class SerializableConformanceProfile extends SerializableResource {

  private Map<String, String> valuesetNamesMap;
  private Map<String, Segment> segmentsMap;
  private int level;

  /**
   * @param resource
   * @param position
   */
  public SerializableConformanceProfile(ConformanceProfile conformanceProfile, String position,
      int level, Map<String, String> valuesetNamesMap, Map<String, Segment> segmentsMap) {
    super(conformanceProfile, position);
    this.valuesetNamesMap = valuesetNamesMap;
    this.segmentsMap = segmentsMap;
    this.level = level;
  }

  @Override
  public Element serialize() throws ResourceSerializationException {
    ConformanceProfile conformanceProfile = (ConformanceProfile) this.getAbstractDomain();
    if (conformanceProfile != null) {
      try {
        Element conformanceProfileElement = super.getElement(Type.CONFORMANCEPROFILE);
        conformanceProfileElement.addAttribute(new Attribute("identifier",
            conformanceProfile.getIdentifier() != null ? conformanceProfile.getIdentifier() : ""));
        conformanceProfileElement.addAttribute(new Attribute("messageType",
            conformanceProfile.getMessageType() != null ? conformanceProfile.getMessageType()
                : ""));
        conformanceProfileElement.addAttribute(new Attribute("event",
            conformanceProfile.getEvent() != null ? conformanceProfile.getEvent() : ""));
        conformanceProfileElement.addAttribute(new Attribute("structID",
            conformanceProfile.getStructID() != null ? conformanceProfile.getStructID() : ""));
        if (conformanceProfile.getChildren() != null
            && conformanceProfile.getChildren().size() > 0) {
          for (MsgStructElement msgStructElm : conformanceProfile.getChildren()) {
            if (msgStructElm != null) {
              Element msgStructElement = this.serializeMsgStructElement(msgStructElm, 0);
              if (msgStructElement != null) {
                conformanceProfileElement.appendChild(msgStructElement);
              }
            }
          }
        }
        return super.getSectionElement(conformanceProfileElement, this.level);
      } catch (Exception exception) {
        throw new ResourceSerializationException(exception, Type.CONFORMANCEPROFILE,
            (Resource) this.getAbstractDomain());
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
  private Element serializeMsgStructElement(MsgStructElement msgStructElm, int depth)
      throws SerializationException {
    try {
      Element msgStructElement;
      if (msgStructElm instanceof Group) {
        msgStructElement = serializeGroup((Group) msgStructElm, depth);
      } else if (msgStructElm instanceof SegmentRef) {
        Segment segment = this.segmentsMap.get(((SegmentRef) msgStructElm).getRef().getId());
        if (segment == null) {
          throw new SegmentNotFoundException(((SegmentRef) msgStructElm).getRef().getId());
        }
        msgStructElement = serializeSegmentRef((SegmentRef) msgStructElm, segment, depth);
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
    } catch (SegmentNotFoundException e) {
      throw new MsgStructElementSerializationException(e, msgStructElm);
    }
  }

  /**
   * @param msgStructElm @return @throws
   */
  private Element serializeSegmentRef(SegmentRef segmentRef, Segment segment, int depth)
      throws MsgStructElementSerializationException {
    Element segmentRefElement = new Element("SegmentRef");
    try {
      segmentRefElement
          .addAttribute(new Attribute("id", segmentRef.getId() != null ? segmentRef.getId() : ""));
      segmentRefElement
          .addAttribute(new Attribute("position", String.valueOf(segmentRef.getPosition())));
      segmentRefElement
          .addAttribute(new Attribute("name", segment.getName() != null ? segment.getName() : ""));
      segmentRefElement.addAttribute(new Attribute("description",
          segment.getDescription() != null ? segment.getDescription() : ""));
      segmentRefElement.addAttribute(
          new Attribute("text", segmentRef.getText() != null ? segmentRef.getText() : ""));
      segmentRefElement.addAttribute(
          new Attribute("max", segmentRef.getMax() != null ? segmentRef.getMax() : ""));
      segmentRefElement.addAttribute(new Attribute("min", String.valueOf(segmentRef.getMin())));
      segmentRefElement.addAttribute(new Attribute("type", Type.SEGMENTREF.name()));
      segmentRefElement.addAttribute(new Attribute("usage",
          segmentRef.getUsage() != null ? segmentRef.getUsage().name() : ""));
      segmentRefElement.addAttribute(new Attribute("iDRef", segmentRef.getId()));
      segmentRefElement.addAttribute(new Attribute("iDSeg", segmentRef.getRef().getId()));
      if (segment != null && segment.getName() != null) {
        segmentRefElement.addAttribute(
            new Attribute("Ref", StringUtils.repeat(".", 4 * depth) + segment.getName()));
        segmentRefElement.addAttribute(new Attribute("label", segment.getLabel()));
      }
      segmentRefElement.addAttribute(new Attribute("depth", String.valueOf(depth)));
      segmentRefElement.addAttribute(new Attribute("min", segmentRef.getMin() + ""));
      segmentRefElement.addAttribute(new Attribute("max", segmentRef.getMax() + ""));
      return segmentRefElement;

    } catch (Exception exception) {
      throw new MsgStructElementSerializationException(exception, segmentRef);
    }
  }

  private Element serializeGroup(Group group, int depth) throws SerializationException {
    Element groupElement = new Element("Group");
    if (group.getBinding() != null) {
      Element binding;
      try {
        binding = super.serializeResourceBinding(group.getBinding(), this.valuesetNamesMap);
      } catch (SerializationException exception) {
        throw new MsgStructElementSerializationException(exception, group);
      }
      if (binding != null) {
        groupElement.appendChild(binding);
      }

    }
    groupElement.addAttribute(new Attribute("name", group.getName()));
    Element elementGroupBegin = new Element("SegmentRef");
    elementGroupBegin.addAttribute(new Attribute("idGpe", group.getId()));
    elementGroupBegin.addAttribute(new Attribute("name", group.getName()));
    elementGroupBegin
        .addAttribute(new Attribute("description", "BEGIN " + group.getName() + " GROUP"));
    elementGroupBegin.addAttribute(new Attribute("usage", String.valueOf(group.getUsage())));
    elementGroupBegin.addAttribute(new Attribute("min", group.getMin() + ""));
    elementGroupBegin.addAttribute(new Attribute("max", group.getMax()));
    elementGroupBegin.addAttribute(new Attribute("ref", StringUtils.repeat(".", 4 * depth) + "["));
    elementGroupBegin.addAttribute(new Attribute("position", String.valueOf(group.getPosition())));
    groupElement.appendChild(elementGroupBegin);
    for (MsgStructElement msgStructElm : group.getChildren()) {
      try {
        Element child = this.serializeMsgStructElement(msgStructElm, depth + 1);
        if (child != null) {
          groupElement.appendChild(child);
        }
      } catch (Exception exception) {
        throw new MsgStructElementSerializationException(exception, group);
      }
    }
    Element elementGroupEnd = new Element("SegmentRef");
    elementGroupEnd.addAttribute(new Attribute("idGpe", group.getId()));
    elementGroupEnd.addAttribute(new Attribute("name", "END " + group.getName() + " GROUP"));
    elementGroupEnd.addAttribute(new Attribute("description", "END " + group.getName() + " GROUP"));
    elementGroupEnd.addAttribute(new Attribute("usage", group.getUsage().toString()));
    elementGroupEnd.addAttribute(new Attribute("min", group.getMin() + ""));
    elementGroupEnd.addAttribute(new Attribute("max", group.getMax()));
    elementGroupEnd.addAttribute(new Attribute("ref", StringUtils.repeat(".", 4 * depth) + "]"));
    elementGroupEnd.addAttribute(new Attribute("depth", String.valueOf(depth)));
    elementGroupEnd.addAttribute(new Attribute("position", String.valueOf(group.getPosition())));
    groupElement.appendChild(elementGroupEnd);
    return groupElement;
  }

}
