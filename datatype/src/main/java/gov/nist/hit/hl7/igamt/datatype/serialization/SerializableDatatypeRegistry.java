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
import nu.xom.Attribute;
import nu.xom.Element;
import nu.xom.Elements;

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
  
  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.serialization.domain.SerializableRegistry#getConformanceStatements(int)
   */
  @Override
  public Element getConformanceStatements(int level) {
    Element conformanceStatements = new Element("Section");
    conformanceStatements.addAttribute(new Attribute("id",super.getId()+"_cs"));
    conformanceStatements.addAttribute(new Attribute("position",super.getPosition()));
    conformanceStatements.addAttribute(new Attribute("title","Datatype level"));
    conformanceStatements.addAttribute(new Attribute("h",String.valueOf(level)));
    try {
      for(SerializableDatatype serializableDatatype : this.serializableDatatypes) {
        SerializableConstraints serializableConstraints = serializableDatatype.getConformanceStatements(level);
        if(serializableConstraints != null && serializableConstraints.getConstraintsCount() > 0) {
          Element datatypeConstraintsElement = new Element("Section");
          datatypeConstraintsElement.addAttribute(new Attribute("id",serializableDatatype.getId()+"_cs"));
          datatypeConstraintsElement.addAttribute(new Attribute("position",serializableDatatype.getPosition()));
          datatypeConstraintsElement.addAttribute(new Attribute("title",serializableDatatype.getTitle()));
          datatypeConstraintsElement.addAttribute(new Attribute("h",String.valueOf(level+1)));
          Element serializedConstraints = serializableConstraints.serialize();
          Elements constraintElements = serializedConstraints.getChildElements("Constraint");
          if(constraintElements.size() > 0) {
            for(int i = 0 ; i < constraintElements.size() ; i ++) {
              Element constraintElement = constraintElements.get(i);
              if(constraintElement != null) {
                datatypeConstraintsElement.appendChild(constraintElement.copy());
              }
            }
            conformanceStatements.appendChild(datatypeConstraintsElement);
          }
        }
      }
    } catch (SerializationException e) {
      e.printStackTrace();
    }
    if(conformanceStatements.getChildCount() > 0) {
      return conformanceStatements;
    }
    return null;
  }

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.serialization.domain.SerializableRegistry#getPredicates(int)
   */
  @Override
  public Element getPredicates(int level) {
    Element predicates = new Element("Section");
    predicates.addAttribute(new Attribute("id",super.getId()+"_pre"));
    predicates.addAttribute(new Attribute("position",super.getPosition()));
    predicates.addAttribute(new Attribute("title","Datatype level"));
    predicates.addAttribute(new Attribute("h",String.valueOf(level)));
    try {
      for(SerializableDatatype serializableDatatype : this.serializableDatatypes) {
        SerializableConstraints serializableConstraints = serializableDatatype.getPredicates(level);
        if(serializableConstraints != null && serializableConstraints.getConstraintsCount() > 0) {
          Element datatypeConstraintsElement = new Element("Section");
          datatypeConstraintsElement.addAttribute(new Attribute("id",serializableDatatype.getId()+"_pre"));
          datatypeConstraintsElement.addAttribute(new Attribute("position",serializableDatatype.getPosition()));
          datatypeConstraintsElement.addAttribute(new Attribute("title",serializableDatatype.getTitle()));
          datatypeConstraintsElement.addAttribute(new Attribute("h",String.valueOf(level+1)));
          Element serializedConstraints = serializableConstraints.serialize();
          Elements constraintElements = serializedConstraints.getChildElements("Constraint");
          if(constraintElements.size() > 0) {
            for(int i = 0 ; i < constraintElements.size() ; i ++) {
              Element constraintElement = constraintElements.get(i);
              if(constraintElement != null) {
                datatypeConstraintsElement.appendChild(constraintElement.copy());
              }
            }
            predicates.appendChild(datatypeConstraintsElement);
          }
        }
      }
    } catch (SerializationException e) {
      e.printStackTrace();
    }
    if(predicates.getChildCount() > 0) {
      return predicates;
    }
    return null;
  }

}
