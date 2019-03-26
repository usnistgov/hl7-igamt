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

import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.Registry;
import gov.nist.hit.hl7.igamt.common.base.domain.Section;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.registry.ConformanceProfileRegistry;
import gov.nist.hit.hl7.igamt.conformanceprofile.exception.ConformanceProfileNotFoundException;
import gov.nist.hit.hl7.igamt.constraints.repository.ConformanceStatementRepository;
import gov.nist.hit.hl7.igamt.constraints.repository.PredicateRepository;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.serialization.domain.SerializableConstraints;
import gov.nist.hit.hl7.igamt.serialization.domain.SerializableRegistry;
import gov.nist.hit.hl7.igamt.serialization.exception.RegistrySerializationException;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import nu.xom.Attribute;
import nu.xom.Element;
import nu.xom.Elements;

/**
 *
 * @author Maxence Lefort on Apr 9, 2018.
 */
public class SerializableConformanceProfileRegistry extends SerializableRegistry {

  private Map<String, ConformanceProfile> conformanceProfilesMap;
  private Map<String, String> valuesetNamesMap;
  private Map<String, String> valuesetLabelMap;
  private Map<String, Segment> segmentsMap;
  private Set<String> bindedGroupsAndSegmentRefs;
  private Set<SerializableConformanceProfile> serializableConformanceProfiles;
  private ConformanceStatementRepository conformanceStatementRepository;
  private PredicateRepository predicateRepository;

  /**
   * @param section
 * @param predicateRepository2 
   */
  public SerializableConformanceProfileRegistry(Section section, int level,
      ConformanceProfileRegistry conformanceProfileRegistry,
      Map<String, ConformanceProfile> conformanceProfilesMap, Map<String, Segment> segmentsMap,
      Map<String, String> valuesetNamesMap, Map<String, String> valuesetLabelMap, Set<String> bindedGroupsAndSegmentRefs,
      ConformanceStatementRepository conformanceStatementRepository, PredicateRepository predicateRepository) {
    super(section, level, conformanceProfileRegistry);
    this.conformanceProfilesMap = conformanceProfilesMap;
    this.valuesetNamesMap = valuesetNamesMap;
    this.valuesetLabelMap = valuesetLabelMap;
    this.segmentsMap = segmentsMap;
    this.bindedGroupsAndSegmentRefs = bindedGroupsAndSegmentRefs;
    this.serializableConformanceProfiles = new HashSet<>();
    this.conformanceStatementRepository = conformanceStatementRepository;
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
            if (conformanceProfilesMap.containsKey(conformanceProfileLink.getId())) {
              ConformanceProfile conformanceProfile =
                  conformanceProfilesMap.get(conformanceProfileLink.getId());
              SerializableConformanceProfile serializableConformanceProfile =
                  new SerializableConformanceProfile(conformanceProfile,
                      String.valueOf(conformanceProfileLink.getPosition()), this.getChildLevel(),
                      this.valuesetNamesMap, this.valuesetLabelMap, this.segmentsMap, this.bindedGroupsAndSegmentRefs, this.conformanceStatementRepository, this.predicateRepository);
              if(serializableConformanceProfile != null) {
                this.serializableConformanceProfiles.add(serializableConformanceProfile);
                Element conformanceProfileElement = serializableConformanceProfile.serialize();
                if (conformanceProfileElement != null) {
                  conformanceProfileRegistryElement.appendChild(conformanceProfileElement);
                }
              }
            } else {
              throw new ConformanceProfileNotFoundException(conformanceProfileLink.getId());
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

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.serialization.domain.SerializableRegistry#getConformanceStatements(int)
   */
  @Override
  public Element getConformanceStatements(int level) {
    Element conformanceStatements = new Element("Section");
    conformanceStatements.addAttribute(new Attribute("id",super.getId()+"_cs"));
    conformanceStatements.addAttribute(new Attribute("position",super.getPosition()));
    conformanceStatements.addAttribute(new Attribute("title","Conformance Profile level"));
    conformanceStatements.addAttribute(new Attribute("h",String.valueOf(level)));
    try {
      for(SerializableConformanceProfile serializableConformanceProfile : this.serializableConformanceProfiles) {
        SerializableConstraints serializableConstraints = serializableConformanceProfile.getConformanceStatements(level);
        if(serializableConstraints != null && serializableConstraints.getConstraintsCount() > 0) {
          Element conformanceProfileConstraintsElement = new Element("Section");
          conformanceProfileConstraintsElement.addAttribute(new Attribute("id",serializableConformanceProfile.getId()+"_cs"));
          conformanceProfileConstraintsElement.addAttribute(new Attribute("position",serializableConformanceProfile.getPosition()));
          conformanceProfileConstraintsElement.addAttribute(new Attribute("title",serializableConformanceProfile.getTitle()));
          conformanceProfileConstraintsElement.addAttribute(new Attribute("h",String.valueOf(level+1)));
          Element serializedConstraints = serializableConstraints.serialize();
          Elements constraintElements = serializedConstraints.getChildElements("Constraint");
          if(constraintElements.size() > 0) {
            for(int i = 0 ; i < constraintElements.size() ; i ++) {
              Element constraintElement = constraintElements.get(i);
              if(constraintElement != null) {
                conformanceProfileConstraintsElement.appendChild(constraintElement.copy());
              }
            }
            conformanceStatements.appendChild(conformanceProfileConstraintsElement);
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
    predicates.addAttribute(new Attribute("title","Conformance Profile level"));
    predicates.addAttribute(new Attribute("h",String.valueOf(level)));
    try {
      for(SerializableConformanceProfile serializableConformanceProfile : this.serializableConformanceProfiles) {
        SerializableConstraints serializableConstraints = serializableConformanceProfile.getPredicates(level);
        if(serializableConstraints != null && serializableConstraints.getConstraintsCount() > 0) {
          Element conformanceProfileConstraintsElement = new Element("Section");
          conformanceProfileConstraintsElement.addAttribute(new Attribute("id",serializableConformanceProfile.getId()+"_pre"));
          conformanceProfileConstraintsElement.addAttribute(new Attribute("position",serializableConformanceProfile.getPosition()));
          conformanceProfileConstraintsElement.addAttribute(new Attribute("title",serializableConformanceProfile.getTitle()));
          conformanceProfileConstraintsElement.addAttribute(new Attribute("h",String.valueOf(level+1)));
          Element serializedConstraints = serializableConstraints.serialize();
          Elements constraintElements = serializedConstraints.getChildElements("Constraint");
          if(constraintElements.size() > 0) {
            for(int i = 0 ; i < constraintElements.size() ; i ++) {
              Element constraintElement = constraintElements.get(i);
              if(constraintElement != null) {
                conformanceProfileConstraintsElement.appendChild(constraintElement.copy());
              }
            }
            predicates.appendChild(conformanceProfileConstraintsElement);
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
