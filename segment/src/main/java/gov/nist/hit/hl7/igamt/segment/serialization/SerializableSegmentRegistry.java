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

import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.Registry;
import gov.nist.hit.hl7.igamt.common.base.domain.Section;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.domain.registry.SegmentRegistry;
import gov.nist.hit.hl7.igamt.segment.exception.SegmentNotFoundException;
import gov.nist.hit.hl7.igamt.serialization.domain.SerializableConstraints;
import gov.nist.hit.hl7.igamt.serialization.domain.SerializableRegistry;
import gov.nist.hit.hl7.igamt.serialization.exception.RegistrySerializationException;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import nu.xom.Element;

/**
 *
 * @author Maxence Lefort on Apr 9, 2018.
 */
public class SerializableSegmentRegistry extends SerializableRegistry {

  private Map<String, Segment> segmentsMap;
  private Map<String, String> datatypeNamesMap;
  private Map<String, String> valuesetNamesMap;
  private Map<String, String> valuesetLabelMap;
  private Set<String> bindedSegments;
  private Set<String> bindedFields;
  private Set<SerializableSegment> serializableSegments;
  
  /**
   * @param section
   */
  public SerializableSegmentRegistry(Section section, int level, SegmentRegistry segmentRegistry,
      Map<String, Segment> segmentsMap, Map<String, String> datatypeNamesMap,
      Map<String, String> valuesetNamesMap, Map<String, String> valuesetLabelMap, Set<String> bindedSegments, Set<String> bindedFields) {
    super(section, level, segmentRegistry);
    this.segmentsMap = segmentsMap;
    this.datatypeNamesMap = datatypeNamesMap;
    this.valuesetNamesMap = valuesetNamesMap;
    this.valuesetLabelMap = valuesetLabelMap;
    this.bindedSegments = bindedSegments;
    this.bindedFields = bindedFields;
    this.serializableSegments = new HashSet<>();
  }

  /*
   * (non-Javadoc)
   * 
   * @see gov.nist.hit.hl7.igamt.serialization.domain.SerializableElement#serialize()
   */
  @Override
  public Element serialize() throws SerializationException {
    Registry segmentRegistry = super.getRegistry();
    try {
      Element segmentRegistryElement = super.getElement();
      if (segmentRegistry != null) {
        if (segmentRegistry.getChildren() != null && !segmentRegistry.getChildren().isEmpty()) {
          for (Link segmentLink : segmentRegistry.getChildren()) {
            if(bindedSegments.contains(segmentLink.getId().getId())) {
              if (segmentsMap.containsKey(segmentLink.getId().getId())) {
                Segment segment = segmentsMap.get(segmentLink.getId().getId());
                SerializableSegment serializableSegment =
                    new SerializableSegment(segment, super.position, this.getChildLevel(),
                        this.datatypeNamesMap, this.valuesetNamesMap, this.valuesetLabelMap, this.bindedFields);
                if (serializableSegment != null) {
                  Element segmentElement = serializableSegment.serialize();
                  if (segmentElement != null) {
                    segmentRegistryElement.appendChild(segmentElement);
                  }
                  this.serializableSegments.add(serializableSegment);
                }
              } else {
                throw new SegmentNotFoundException(segmentLink.getId().getId());
              }
            }
          }
        }
      }
      return segmentRegistryElement;
    } catch (Exception exception) {
      throw new RegistrySerializationException(exception, super.getSection(), segmentRegistry);
    }
  }

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.serialization.domain.SerializableRegistry#getConformanceStatements(int)
   */
  @Override
  public Set<SerializableConstraints> getConformanceStatements(int level) {
    Set<SerializableConstraints> conformanceStatements = new HashSet<>();
    for(SerializableSegment serializableSegment : this.serializableSegments) {
      conformanceStatements.add(serializableSegment.getConformanceStatements(level));
    }
    return conformanceStatements;
  }

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.serialization.domain.SerializableRegistry#getPredicates(int)
   */
  @Override
  public Set<SerializableConstraints> getPredicates(int level) {
    Set<SerializableConstraints> predicates = new HashSet<>();
    for(SerializableSegment serializableSegment : this.serializableSegments) {
      predicates.add(serializableSegment.getPredicates(level));
    }
    return predicates;
  }

}
