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
package gov.nist.hit.hl7.igamt.valueset.serialization;

import java.util.Map;

import gov.nist.hit.hl7.igamt.serialization.domain.SerializableRegistry;
import gov.nist.hit.hl7.igamt.serialization.exception.RegistrySerializationException;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import gov.nist.hit.hl7.igamt.shared.domain.Link;
import gov.nist.hit.hl7.igamt.shared.domain.Section;
import gov.nist.hit.hl7.igamt.shared.domain.exception.ValuesetNotFoundException;
import gov.nist.hit.hl7.igamt.shared.registries.Registry;
import gov.nist.hit.hl7.igamt.shared.registries.ValueSetRegistry;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import nu.xom.Element;

/**
 *
 * @author Maxence Lefort on Apr 9, 2018.
 */
public class SerializableValuesetRegistry extends SerializableRegistry {

  private Map<String, Valueset> valuesetsMap;

  /**
   * @param section
   */
  public SerializableValuesetRegistry(Section section, int level, ValueSetRegistry valueSetRegistry,
      Map<String, Valueset> valuesetsMap) {
    super(section, level, valueSetRegistry);
    this.valuesetsMap = valuesetsMap;
  }

  /*
   * (non-Javadoc)
   * 
   * @see gov.nist.hit.hl7.igamt.serialization.domain.SerializableElement#serialize()
   */
  @Override
  public Element serialize() throws SerializationException {
    Registry valuesetRegistry = super.getRegistry();
    try {
      Element valuesetRegistryElement = super.getElement();
      if (valuesetRegistry != null) {
        if (!valuesetRegistry.getChildren().isEmpty()) {
          for (Link valuesetLink : valuesetRegistry.getChildren()) {
            if (valuesetsMap.containsKey(valuesetLink.getId().getId())) {
              Valueset valueset = valuesetsMap.get(valuesetLink.getId().getId());
              SerializableValueSet serializableValueSet =
                  new SerializableValueSet(valueset, String.valueOf(valuesetLink.getPosition()));
              Element valuesetElement = serializableValueSet.serialize();
              if (valuesetElement != null) {
                valuesetRegistryElement.appendChild(valuesetElement);
              }
            } else {
              throw new ValuesetNotFoundException(valuesetLink.getId().getId());
            }
          }
        }
      }
      return valuesetRegistryElement;
    } catch (Exception exception) {
      throw new RegistrySerializationException(exception, super.getSection(), valuesetRegistry);
    }
  }

}
