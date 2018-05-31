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

import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.Registry;
import gov.nist.hit.hl7.igamt.common.base.domain.Section;
import gov.nist.hit.hl7.igamt.common.exception.ConformanceProfileNotFoundException;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.registry.ConformanceProfileRegistry;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.serialization.domain.SerializableRegistry;
import gov.nist.hit.hl7.igamt.serialization.exception.RegistrySerializationException;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import nu.xom.Element;

/**
 *
 * @author Maxence Lefort on Apr 9, 2018.
 */
public class SerializableConformanceProfileRegistry extends SerializableRegistry {

  private Map<String, ConformanceProfile> conformanceProfilesMap;
  private Map<String, String> valuesetNamesMap;
  private Map<String, Segment> segmentsMap;

  /**
   * @param section
   */
  public SerializableConformanceProfileRegistry(Section section, int level,
      ConformanceProfileRegistry conformanceProfileRegistry,
      Map<String, ConformanceProfile> conformanceProfilesMap, Map<String, Segment> segmentsMap,
      Map<String, String> valuesetNamesMap) {
    super(section, level, conformanceProfileRegistry);
    this.conformanceProfilesMap = conformanceProfilesMap;
    this.valuesetNamesMap = valuesetNamesMap;
    this.segmentsMap = segmentsMap;
  }

  /*
   * (non-Javadoc)
   * 
   * @see gov.nist.hit.hl7.igamt.serialization.domain.SerializableElement#serialize()
   */
  @Override
  public Element serialize() throws SerializationException {
    Registry conformanceProfileRegistry = super.getRegistry();
    try {
      Element conformanceProfileRegistryElement = super.getElement();
      if (conformanceProfileRegistry != null) {
        if (!conformanceProfileRegistry.getChildren().isEmpty()) {
          for (Link conformanceProfileLink : conformanceProfileRegistry.getChildren()) {
            if (conformanceProfilesMap.containsKey(conformanceProfileLink.getId().getId())) {
              ConformanceProfile conformanceProfile =
                  conformanceProfilesMap.get(conformanceProfileLink.getId().getId());
              SerializableConformanceProfile serializableConformanceProfile =
                  new SerializableConformanceProfile(conformanceProfile,
                      String.valueOf(conformanceProfileLink.getPosition()), this.getChildLevel(),
                      this.valuesetNamesMap, this.segmentsMap);
              Element conformanceProfileElement = serializableConformanceProfile.serialize();
              if (conformanceProfileElement != null) {
                conformanceProfileRegistryElement.appendChild(conformanceProfileElement);
              }
            } else {
              throw new ConformanceProfileNotFoundException(conformanceProfileLink.getId().getId());
            }
          }
        }
      }
      return conformanceProfileRegistryElement;
    } catch (Exception exception) {
      throw new RegistrySerializationException(exception, super.getSection(),
          conformanceProfileRegistry);
    }
  }


}
