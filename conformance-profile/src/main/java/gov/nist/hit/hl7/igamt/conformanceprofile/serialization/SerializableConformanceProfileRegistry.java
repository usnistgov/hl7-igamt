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
import gov.nist.hit.hl7.igamt.serialization.domain.SerializableSection;
import gov.nist.hit.hl7.igamt.serialization.exception.RegistrySerializationException;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import gov.nist.hit.hl7.igamt.shared.domain.Link;
import gov.nist.hit.hl7.igamt.shared.domain.Registry;
import gov.nist.hit.hl7.igamt.shared.domain.exception.ConformanceProfileNotFoundException;
import nu.xom.Element;

/**
 *
 * @author Maxence Lefort on Apr 9, 2018.
 */
public class SerializableConformanceProfileRegistry extends SerializableSection {

  private Map<String, ConformanceProfile> conformanceProfilesMap;
  private Map<String, String> datatypeNamesMap;
  private Map<String, String> valuesetNamesMap;
  
  /**
   * @param section
   */
  public SerializableConformanceProfileRegistry(Registry conformanceProfileRegistry, Map<String, ConformanceProfile> conformanceProfilesMap, Map<String, String> datatypeNamesMap, Map<String, String> valuesetNamesMap) {
    super(conformanceProfileRegistry);
    this.conformanceProfilesMap = conformanceProfilesMap;
    this.datatypeNamesMap = datatypeNamesMap;
    this.valuesetNamesMap = valuesetNamesMap;
  }

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.serialization.domain.SerializableElement#serialize()
   */
  @Override
  public Element serialize() throws SerializationException {
    Registry conformanceProfileRegistry = (Registry) super.getSection();
    try {
      Element conformanceProfileRegistryElement = super.getElement();
      if(conformanceProfileRegistry != null) {
        if(!conformanceProfileRegistry.getChildren().isEmpty()) {
          for(Link conformanceProfileLink : conformanceProfileRegistry.getChildren()) {
            if(conformanceProfilesMap.containsKey(conformanceProfileLink.getId().getId())) {
              ConformanceProfile conformanceProfile = conformanceProfilesMap.get(conformanceProfileLink.getId().getId());
              SerializableConformanceProfile serializableConformanceProfile = new SerializableConformanceProfile(conformanceProfile, String.valueOf(conformanceProfileLink.getPosition()),datatypeNamesMap, this.valuesetNamesMap);
              Element conformanceProfileElement = serializableConformanceProfile.serialize();
              if(conformanceProfileElement!=null) {
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
      throw new RegistrySerializationException(exception, conformanceProfileRegistry);
    }
  }


}
