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
import gov.nist.hit.hl7.igamt.constraints.repository.ConformanceStatementRepository;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.domain.registry.SegmentRegistry;
import gov.nist.hit.hl7.igamt.segment.exception.SegmentNotFoundException;
import gov.nist.hit.hl7.igamt.segment.service.CoConstraintService;
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
public class SerializableSegmentRegistry extends SerializableRegistry {

  private Map<String, Segment> segmentsMap;
  private Map<String, Datatype> datatypesMap;
  private Map<String, String> datatypeNamesMap;
  private Map<String, String> valuesetNamesMap;
  private Map<String, String> valuesetLabelMap;
  private Set<String> bindedSegments;
  private Set<String> bindedFields;
  private Set<SerializableSegment> serializableSegments;
  private CoConstraintService coConstraintService;
  private ExportConfiguration exportConfiguration;
private ConformanceStatementRepository conformanceStatementRepository;
  
  /**
   * @param section
 * @param datatypesMap 
 * @param exportConfiguration 
   */
  public SerializableSegmentRegistry(Section section, int level, SegmentRegistry segmentRegistry,
		  Map<String, Segment> segmentsMap, Map<String, Datatype> datatypesMap, Map<String, String> datatypeNamesMap,
		  Map<String, String> valuesetNamesMap, Map<String, String> valuesetLabelMap, Set<String> bindedSegments,
		  Set<String> bindedFields, CoConstraintService coConstraintService, ExportConfiguration exportConfiguration, 
		  ConformanceStatementRepository conformanceStatementRepository) {
	  super(section, level, segmentRegistry);
	  this.segmentsMap = segmentsMap;
	  this.datatypeNamesMap = datatypeNamesMap;
	  this.valuesetNamesMap = valuesetNamesMap;
	  this.valuesetLabelMap = valuesetLabelMap;
	  this.bindedSegments = bindedSegments;
	  this.bindedFields = bindedFields;
	  this.serializableSegments = new HashSet<>();
	  this.datatypesMap=datatypesMap;
	  this.coConstraintService=coConstraintService;
	  this.exportConfiguration=exportConfiguration;
	  this.conformanceStatementRepository=conformanceStatementRepository;
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
//            if(bindedSegments.contains(segmentLink.getId().getId())) {
              if (segmentsMap.containsKey(segmentLink.getId())) {
                Segment segment = segmentsMap.get(segmentLink.getId());
                System.out.println("Segment name :" + segment.getName() + segment.getExt());
                SerializableSegment serializableSegment =
                    new SerializableSegment(segment, String.valueOf(segmentLink.getPosition()), this.getChildLevel(),
                        this.datatypesMap, this.datatypeNamesMap, this.valuesetNamesMap, this.valuesetLabelMap, this.bindedFields, this.coConstraintService,this.exportConfiguration, this.conformanceStatementRepository);
                if (serializableSegment != null) {
                  Element segmentElement = serializableSegment.serialize();
                  if (segmentElement != null) {
                    segmentRegistryElement.appendChild(segmentElement);
                  }
                  this.serializableSegments.add(serializableSegment);
                }
              } else {
                throw new SegmentNotFoundException(segmentLink.getId());
              }
            }
          }
        }
//      }
      return segmentRegistryElement;
    } catch (Exception exception) {
      throw new RegistrySerializationException(exception, super.getSection(), segmentRegistry);
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
    conformanceStatements.addAttribute(new Attribute("title","Segment level"));
    conformanceStatements.addAttribute(new Attribute("h",String.valueOf(level)));
    try {
      for(SerializableSegment serializableSegment : this.serializableSegments) {
        SerializableConstraints serializableConstraints = serializableSegment.getConformanceStatements(level);
        if(serializableConstraints != null && serializableConstraints.getConstraintsCount() > 0) {
          Element segmentConstraintsElement = new Element("Section");
          segmentConstraintsElement.addAttribute(new Attribute("id",serializableSegment.getId()+"_cs"));
          segmentConstraintsElement.addAttribute(new Attribute("position",serializableSegment.getPosition()));
          segmentConstraintsElement.addAttribute(new Attribute("title",serializableSegment.getTitle()));
          segmentConstraintsElement.addAttribute(new Attribute("h",String.valueOf(level+1)));
          Element serializedConstraints = serializableConstraints.serialize();
          Elements constraintElements = serializedConstraints.getChildElements("Constraint");
          if(constraintElements.size() > 0) {
            for(int i = 0 ; i < constraintElements.size() ; i ++) {
              Element constraintElement = constraintElements.get(i);
              if(constraintElement != null) {
                segmentConstraintsElement.appendChild(constraintElement.copy());
              }
            }
            conformanceStatements.appendChild(segmentConstraintsElement);
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
    predicates.addAttribute(new Attribute("title","Segment level"));
    predicates.addAttribute(new Attribute("h",String.valueOf(level)));
    try {
      for(SerializableSegment serializableSegment : this.serializableSegments) {
        SerializableConstraints serializableConstraints = serializableSegment.getPredicates(level);
        if(serializableConstraints != null && serializableConstraints.getConstraintsCount() > 0) {
          Element segmentConstraintsElement = new Element("Section");
          segmentConstraintsElement.addAttribute(new Attribute("id",serializableSegment.getId()+"_pre"));
          segmentConstraintsElement.addAttribute(new Attribute("position",serializableSegment.getPosition()));
          segmentConstraintsElement.addAttribute(new Attribute("title",serializableSegment.getTitle()));
          segmentConstraintsElement.addAttribute(new Attribute("h",String.valueOf(level+1)));
          Element serializedConstraints = serializableConstraints.serialize();
          Elements constraintElements = serializedConstraints.getChildElements("Constraint");
          if(constraintElements.size() > 0) {
            for(int i = 0 ; i < constraintElements.size() ; i ++) {
              Element constraintElement = constraintElements.get(i);
              if(constraintElement != null) {
                segmentConstraintsElement.appendChild(constraintElement.copy());
              }
            }
            predicates.appendChild(segmentConstraintsElement);
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
