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

import java.util.Map;

import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.serialization.domain.SerializableSection;
import gov.nist.hit.hl7.igamt.serialization.exception.RegistrySerializationException;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import gov.nist.hit.hl7.igamt.shared.domain.Link;
import gov.nist.hit.hl7.igamt.shared.domain.Section;
import gov.nist.hit.hl7.igamt.shared.domain.exception.SegmentNotFoundException;
import gov.nist.hit.hl7.igamt.shared.registries.Registry;
import nu.xom.Element;

/**
 *
 * @author Maxence Lefort on Apr 9, 2018.
 */
public class SerializableSegmentRegistry extends SerializableSection {

  private Map<String, Segment> segmentsMap;
  private Map<String, String> datatypeNamesMap;
  private Map<String, String> valuesetNamesMap;

  /**
   * @param section
   */
  public SerializableSegmentRegistry(Section section, Map<String, Segment> segmentsMap,
      Map<String, String> datatypeNamesMap, Map<String, String> valuesetNamesMap) {
    super(section);
    this.segmentsMap = segmentsMap;
    this.datatypeNamesMap = datatypeNamesMap;
    this.valuesetNamesMap = valuesetNamesMap;
  }

  /*
   * (non-Javadoc)
   * 
   * @see gov.nist.hit.hl7.igamt.serialization.domain.SerializableElement#serialize()
   */
  @Override
  public Element serialize() throws SerializationException {
    Registry segmentRegistry = (Registry) super.getSection();
    try {
      Element segmentRegistryElement = super.getElement();
      if (segmentRegistry != null) {
        if (segmentRegistry.getChildren() != null && !segmentRegistry.getChildren().isEmpty()) {
          for (Link segmentLink : segmentRegistry.getChildren()) {
            if (segmentsMap.containsKey(segmentLink.getId().getId())) {
              Segment segment = segmentsMap.get(segmentLink.getId().getId());
              SerializableSegment serializableSegment = new SerializableSegment(segment,
                  super.position, this.datatypeNamesMap, this.valuesetNamesMap);
              if (serializableSegment != null) {
                Element segmentElement = serializableSegment.serialize();
                if (segmentElement != null) {
                  segmentRegistryElement.appendChild(segmentElement);
                }
              }
            } else {
              throw new SegmentNotFoundException(segmentLink.getId().getId());
            }
          }
        }
      }
      return segmentRegistryElement;
    } catch (Exception exception) {
      throw new RegistrySerializationException(exception, segmentRegistry);
    }
  }

}
