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

import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.Section;
import gov.nist.hit.hl7.igamt.common.base.domain.TextSection;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.registry.CompositeProfileRegistry;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.registry.ConformanceProfileRegistry;
import gov.nist.hit.hl7.igamt.constraints.repository.ConformanceStatementRepository;
import gov.nist.hit.hl7.igamt.constraints.repository.PredicateRepository;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.registry.DatatypeRegistry;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.registry.ProfileComponentRegistry;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.domain.registry.SegmentRegistry;
import gov.nist.hit.hl7.igamt.segment.service.CoConstraintService;
import gov.nist.hit.hl7.igamt.serialization.domain.SerializableRegistry;
import gov.nist.hit.hl7.igamt.serialization.domain.SerializableSection;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import gov.nist.hit.hl7.igamt.valueset.domain.registry.ValueSetRegistry;
import gov.nist.hit.hl7.igamt.valueset.serialization.SerializableValuesetStructure;
import nu.xom.Attribute;
import nu.xom.Element;

/**
 *
 * @author Maxence Lefort on May 7, 2018.
 */
public class SerializableProfile extends SerializableSection {

  private Map<String, Datatype> datatypesMap;
  private Map<String, String> datatypeNamesMap;
  private Map<String, SerializableValuesetStructure> valuesetsMap;
  private Map<String, String> valuesetNamesMap;
  private Map<String, String> valuesetLabelMap;
  private Map<String, Segment> segmentsMap;
  private Map<String, ConformanceProfile> conformanceProfilesMap;
  private ValueSetRegistry valueSetRegistry;
  private DatatypeRegistry datatypeRegistry;
  private SegmentRegistry segmentRegistry;
  private ConformanceProfileRegistry conformanceProfileRegistry;
  private ProfileComponentRegistry profileComponentRegistry;
  private CompositeProfileRegistry compositeProfileRegistry;
  private Set<String> bindedGroupsAndSegmentRefs;
  private Set<String> bindedFields;
  private Set<String> bindedSegments;
  private Set<String> bindedDatatypes;
  private Set<String> bindedComponents;
  private Set<String> bindedValueSets;
  private ExportConfiguration exportConfiguration;
  private Set<Element> conformanceStatements = new HashSet<>();
  private Set<Element> predicates = new HashSet<>();
  private CoConstraintService coConstraintService;
  private ConformanceStatementRepository conformanceStatementRepository;
  private PredicateRepository predicateRepository;

  /**
   * @param section
 * @param predicateRepository 
   */
  public SerializableProfile(Section section, int level, Map<String, Datatype> datatypesMap,
      Map<String, String> datatypeNamesMap, Map<String, SerializableValuesetStructure> valuesetsMap,
      Map<String, String> valuesetNamesMap, Map<String, String> valuesetLabelMap, Map<String, Segment> segmentsMap,
      Map<String, ConformanceProfile> conformanceProfilesMap, ValueSetRegistry valueSetRegistry,
      DatatypeRegistry datatypeRegistry, SegmentRegistry segmentRegistry,
      ConformanceProfileRegistry conformanceProfileRegistry,
      ProfileComponentRegistry profileComponentRegistry,
      CompositeProfileRegistry compositeProfileRegistry, Set<String> bindedGroupsAndSegmentRefs,
      Set<String> bindedFields, Set<String> bindedSegments, Set<String> bindedDatatypes,
      Set<String> bindedComponents, Set<String> bindedValueSets, ExportConfiguration exportConfiguration,
      CoConstraintService coConstraintService, ConformanceStatementRepository conformanceStatementRepository,
      PredicateRepository predicateRepository) {
    super(section, level);
    this.datatypesMap = datatypesMap;
    this.datatypeNamesMap = datatypeNamesMap;
    this.valuesetsMap = valuesetsMap;
    this.valuesetNamesMap = valuesetNamesMap;
    this.valuesetLabelMap = valuesetLabelMap;
    this.segmentsMap = segmentsMap;
    this.conformanceProfilesMap = conformanceProfilesMap;
    this.valueSetRegistry = valueSetRegistry;
    this.datatypeRegistry = datatypeRegistry;
    this.segmentRegistry = segmentRegistry;
    this.conformanceProfileRegistry = conformanceProfileRegistry;
    this.conformanceStatementRepository = conformanceStatementRepository;
    this.profileComponentRegistry = profileComponentRegistry;
    this.compositeProfileRegistry = compositeProfileRegistry;
    this.bindedGroupsAndSegmentRefs = bindedGroupsAndSegmentRefs;
    this.bindedFields = bindedFields;
    this.bindedSegments = bindedSegments;
    this.bindedDatatypes = bindedDatatypes;
    this.bindedComponents = bindedComponents;
    this.bindedValueSets = bindedValueSets;
    this.exportConfiguration = exportConfiguration;
    this.coConstraintService=coConstraintService;
    this.conformanceStatementRepository = conformanceStatementRepository;
    this.predicateRepository = predicateRepository;
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
        SerializableSection childSection =
            SerializableSectionFactory.getSerializableSection(section, this.getChildLevel(),
                datatypesMap, datatypeNamesMap, valuesetsMap, valuesetNamesMap, valuesetLabelMap, segmentsMap,
                conformanceProfilesMap, valueSetRegistry, datatypeRegistry, segmentRegistry,
                conformanceProfileRegistry, profileComponentRegistry, compositeProfileRegistry,
                this.bindedGroupsAndSegmentRefs, this.bindedFields, this.bindedSegments,
                this.bindedDatatypes, this.bindedComponents, this.bindedValueSets, this.exportConfiguration,
                this.coConstraintService, this.conformanceStatementRepository, this.predicateRepository);
        if (childSection != null) {
          Element childSectionElement = childSection.serialize();
          if (childSectionElement != null) {
            profileElement.appendChild(childSectionElement);
          }
          if(childSection instanceof SerializableRegistry) {
            Element childConformanceStatements = ((SerializableRegistry) childSection).getConformanceStatements(super.getLevel() + 3);
            if(childConformanceStatements != null) {
              this.conformanceStatements.add(childConformanceStatements);
            }
            Element childPredicates = ((SerializableRegistry) childSection).getPredicates(super.getLevel() + 3);
            if(childPredicates != null) {
              this.predicates.add(childPredicates);
            }
          }
        }
      }
      Element conformanceInformationSection = this.serializeConformanceInformation(String.valueOf(((TextSection) super.getSection()).getChildren().size()+1));
      if(conformanceInformationSection != null) {
        profileElement.appendChild(conformanceInformationSection);
      }
    }
    return profileElement;
  }

  /**
   * @return
   */
  private Element serializeConformanceInformation(String position) {
    Element conformanceInformationSection = new Element("Section");
    conformanceInformationSection.addAttribute(new Attribute("id","conformance_information"));
    conformanceInformationSection.addAttribute(new Attribute("position",position));
    conformanceInformationSection.addAttribute(new Attribute("title","Conformance information"));
    conformanceInformationSection.addAttribute(new Attribute("h",String.valueOf(super.getLevel()+1)));
    Element conformanceStatementsSection = new Element("Section");
    conformanceStatementsSection.addAttribute(new Attribute("id","conformance_information_conformance_statements"));
    conformanceStatementsSection.addAttribute(new Attribute("position","1"));
    conformanceStatementsSection.addAttribute(new Attribute("title","Conformance statements"));
    conformanceStatementsSection.addAttribute(new Attribute("h",String.valueOf(super.getLevel()+2)));
    for(Element conformanceStatement : this.conformanceStatements) {
      conformanceStatementsSection.appendChild(conformanceStatement);
    }
    conformanceInformationSection.appendChild(conformanceStatementsSection);
    Element predicatesSection = new Element("Section");
    predicatesSection.addAttribute(new Attribute("id","conformance_information_predicates"));
    predicatesSection.addAttribute(new Attribute("position","2"));
    predicatesSection.addAttribute(new Attribute("title","Predicates"));
    predicatesSection.addAttribute(new Attribute("h",String.valueOf(super.getLevel()+2)));
    for(Element predicate : this.predicates) {
      predicatesSection.appendChild(predicate);
    }
    conformanceInformationSection.appendChild(predicatesSection);
    return conformanceInformationSection;
  }

}
