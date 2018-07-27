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

import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.Registry;
import gov.nist.hit.hl7.igamt.common.base.domain.Section;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.registry.DatatypeRegistry;
import gov.nist.hit.hl7.igamt.datatype.exception.DatatypeNotFoundException;
import gov.nist.hit.hl7.igamt.serialization.domain.SerializableConstraints;
import gov.nist.hit.hl7.igamt.serialization.domain.SerializableRegistry;
import gov.nist.hit.hl7.igamt.serialization.exception.RegistrySerializationException;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import nu.xom.Element;

/**
 *
 * @author Maxence Lefort on Apr 6, 2018.
 */
public class SerializableDatatypeRegistry extends SerializableRegistry {

  private Map<String, Datatype> datatypesMap;
  private Map<String, String> datatypeNamesMap;
  private Map<String, String> valuesetNamesMap;
  private Map<String, String> valuesetLabelMap;
  private Set<String> bindedDatatypes;
  private Set<String> bindedComponents;
  private Set<SerializableDatatype> serializableDatatypes;

  /**
   * @param section
   */
  public SerializableDatatypeRegistry(Section section, int level, DatatypeRegistry datatypeRegistry,
      Map<String, Datatype> datatypesMap, Map<String, String> datatypeNamesMap,
      Map<String, String> valuesetNamesMap, Map<String, String> valuesetLabelMap, Set<String> bindedDatatypes, Set<String> bindedComponents) {
    super(section, level, datatypeRegistry);
    this.datatypesMap = datatypesMap;
    this.datatypeNamesMap = datatypeNamesMap;
    this.valuesetNamesMap = valuesetNamesMap;
    this.valuesetLabelMap = valuesetLabelMap;
    this.bindedComponents = bindedComponents;
    this.bindedDatatypes = bindedDatatypes;
    this.serializableDatatypes = new HashSet<>();
  }

  @Override
  public Element serialize() throws SerializationException {
    Registry datatypeRegistry = super.getRegistry();
    try {
      Element datatypeRegistryElement = super.getElement();
      if (datatypeRegistry != null) {
        if (!datatypeRegistry.getChildren().isEmpty()) {
          for (Link datatypeLink : datatypeRegistry.getChildren()) {
            if(this.bindedDatatypes.contains(datatypeLink.getId().getId())) {
              if (datatypesMap.containsKey(datatypeLink.getId().getId())) {
                Datatype datatype = datatypesMap.get(datatypeLink.getId().getId());
                SerializableDatatype serializableDatatype =
                    new SerializableDatatype(datatype, String.valueOf(datatypeLink.getPosition()),
                        this.getChildLevel(), datatypeNamesMap, valuesetNamesMap, valuesetLabelMap, bindedComponents);
                if(serializableDatatype != null) {
                  this.serializableDatatypes.add(serializableDatatype);
                  Element datatypeElement = serializableDatatype.serialize();
                  if (datatypeElement != null) {
                    datatypeRegistryElement.appendChild(datatypeElement);
                  }
                }
              } else {
                throw new DatatypeNotFoundException(datatypeLink.getId().getId());
              }
            }
          }
        }
      }
      return datatypeRegistryElement;
    } catch (Exception exception) {
      throw new RegistrySerializationException(exception, super.getSection(), datatypeRegistry);
    }
  }
  
  @Override
  public Set<SerializableConstraints> getConformanceStatements(int level) {
    Set<SerializableConstraints> conformanceStatements = new HashSet<>();
    for(SerializableDatatype serializableDatatype : this.serializableDatatypes) {
      conformanceStatements.add(serializableDatatype.getConformanceStatements(level));
    }
    return conformanceStatements;
  }

  @Override
  public Set<SerializableConstraints> getPredicates(int level) {
    Set<SerializableConstraints> predicates = new HashSet<>();
    for(SerializableDatatype serializableDatatype : this.serializableDatatypes) {
      predicates.add(serializableDatatype.getPredicates(level));
    }
    return predicates;
  }



}
