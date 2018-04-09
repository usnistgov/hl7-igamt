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

import java.util.Map;

import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.serialization.domain.SerializableSection;
import gov.nist.hit.hl7.igamt.serialization.exception.RegistrySerializationException;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import gov.nist.hit.hl7.igamt.shared.domain.Link;
import gov.nist.hit.hl7.igamt.shared.domain.Registry;
import gov.nist.hit.hl7.igamt.shared.domain.exception.DatatypeNotFoundException;
import nu.xom.Element;

/**
 *
 * @author Maxence Lefort on Apr 6, 2018.
 */
public class SerializableDatatypeRegistry extends SerializableSection {

  private Map<String, Datatype> datatypesMap;
  private Map<String, String> datatypeNamesMap;
  
  /**
   * @param section
   */
  public SerializableDatatypeRegistry(Registry registry, Map<String, Datatype> datatypesMap, Map<String, String> datatypeNamesMap) {
    super(registry);
    this.datatypesMap = datatypesMap;
    this.datatypeNamesMap = datatypeNamesMap;
  }

  @Override
  public Element serialize() throws SerializationException {
    Registry datatypeRegistry = (Registry) super.getSection();
    try {
      Element datatypeRegistryElement = super.getElement();
      if(datatypeRegistry != null) {
        if(!datatypeRegistry.getChildren().isEmpty()) {
          for(Link datatypeLink : datatypeRegistry.getChildren()) {
            if(datatypesMap.containsKey(datatypeLink.getId().getId())) {
              Datatype datatype = datatypesMap.get(datatypeLink.getId().getId());
              SerializableDatatype serializableDatatype = new SerializableDatatype(datatype, String.valueOf(datatypeLink.getPosition()),datatypeNamesMap);
              Element datatypeElement = serializableDatatype.serialize();
              if(datatypeElement!=null) {
                datatypeRegistryElement.appendChild(datatypeElement);
              }
            } else {
              throw new DatatypeNotFoundException(datatypeLink.getId().getId());
            }
          }
        }
      }
      return datatypeRegistryElement;
    } catch (Exception exception) {
      throw new RegistrySerializationException(exception, datatypeRegistry);
    }
  }
  
  
  

}
