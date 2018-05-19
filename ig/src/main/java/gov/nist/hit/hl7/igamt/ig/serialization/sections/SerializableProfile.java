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
package gov.nist.hit.hl7.igamt.ig.serialization.sections;

import java.util.Map;

import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.serialization.domain.SerializableSection;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import gov.nist.hit.hl7.igamt.shared.domain.Section;
import gov.nist.hit.hl7.igamt.shared.domain.TextSection;
import gov.nist.hit.hl7.igamt.shared.registries.CompositeProfileRegistry;
import gov.nist.hit.hl7.igamt.shared.registries.ConformanceProfileRegistry;
import gov.nist.hit.hl7.igamt.shared.registries.DatatypeRegistry;
import gov.nist.hit.hl7.igamt.shared.registries.ProfileComponentRegistry;
import gov.nist.hit.hl7.igamt.shared.registries.SegmentRegistry;
import gov.nist.hit.hl7.igamt.shared.registries.ValueSetRegistry;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import nu.xom.Element;

/**
 *
 * @author Maxence Lefort on May 7, 2018.
 */
public class SerializableProfile extends SerializableSection {

  private Map<String, Datatype> datatypesMap;
  private Map<String, String> datatypeNamesMap;
  private Map<String, Valueset> valuesetsMap;
  private Map<String, String> valuesetNamesMap;
  private Map<String, Segment> segmentsMap;
  private Map<String, ConformanceProfile> conformanceProfilesMap;
  private ValueSetRegistry valueSetRegistry;
  private DatatypeRegistry datatypeRegistry;
  private SegmentRegistry segmentRegistry;
  private ConformanceProfileRegistry conformanceProfileRegistry;
  private ProfileComponentRegistry profileComponentRegistry;
  private CompositeProfileRegistry compositeProfileRegistry;

  /**
   * @param section
   */
  public SerializableProfile(Section section, int level, Map<String, Datatype> datatypesMap,
      Map<String, String> datatypeNamesMap, Map<String, Valueset> valuesetsMap,
      Map<String, String> valuesetNamesMap, Map<String, Segment> segmentsMap,
      Map<String, ConformanceProfile> conformanceProfilesMap, ValueSetRegistry valueSetRegistry,
      DatatypeRegistry datatypeRegistry, SegmentRegistry segmentRegistry,
      ConformanceProfileRegistry conformanceProfileRegistry,
      ProfileComponentRegistry profileComponentRegistry,
      CompositeProfileRegistry compositeProfileRegistry) {
    super(section, level);
    this.datatypesMap = datatypesMap;
    this.datatypeNamesMap = datatypeNamesMap;
    this.valuesetsMap = valuesetsMap;
    this.valuesetNamesMap = valuesetNamesMap;
    this.segmentsMap = segmentsMap;
    this.conformanceProfilesMap = conformanceProfilesMap;
    this.valueSetRegistry = valueSetRegistry;
    this.datatypeRegistry = datatypeRegistry;
    this.segmentRegistry = segmentRegistry;
    this.conformanceProfileRegistry = conformanceProfileRegistry;
    this.profileComponentRegistry = profileComponentRegistry;
    this.compositeProfileRegistry = compositeProfileRegistry;
  }

  /*
   * (non-Javadoc)
   * 
   * @see gov.nist.hit.hl7.igamt.serialization.domain.SerializableElement#serialize()
   */
  @Override
  public Element serialize() throws SerializationException {
    Element profileElement = super.getElement();
    if (((TextSection) super.getSection()).getChildren() != null) {
      for (Section section : ((TextSection) super.getSection()).getChildren()) {
        SerializableSection childSection = SerializableSectionFactory.getSerializableSection(
            section, this.getChildLevel(), datatypesMap, datatypeNamesMap, valuesetsMap, valuesetNamesMap, segmentsMap,
            conformanceProfilesMap, valueSetRegistry, datatypeRegistry, segmentRegistry,
            conformanceProfileRegistry, profileComponentRegistry, compositeProfileRegistry);
        if (childSection != null) {
          Element childSectionElement = childSection.serialize();
          if (childSectionElement != null) {
            profileElement.appendChild(childSectionElement);
          }
        }
      }
    }
    return profileElement;
  }

}
