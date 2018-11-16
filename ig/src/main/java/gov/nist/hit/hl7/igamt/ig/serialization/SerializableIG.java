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
package gov.nist.hit.hl7.igamt.ig.serialization;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.Section;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.serialization.sections.SectionSerializationUtil;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.service.CoConstraintService;
import gov.nist.hit.hl7.igamt.serialization.domain.SerializableAbstractDomain;
import gov.nist.hit.hl7.igamt.serialization.domain.SerializableDocumentMetadata;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.serialization.SerializableValuesetStructure;
import nu.xom.Element;

/**
 *
 * @author Maxence Lefort on Apr 2, 2018.
 */
public class SerializableIG extends SerializableAbstractDomain {

  private Map<String, Datatype> datatypesMap;
  private Map<String, SerializableValuesetStructure> valueSetsMap;
  private Map<String, String> valuesetNamesMap;
  private Map<String, String> datatypeNamesMap;
  private Map<String, String> valuesetLabelMap;
  private Map<String, Segment> segmentsMap;
  private Map<String, ConformanceProfile> conformanceProfilesMap;
  private ExportConfiguration exportConfiguration;
  private Set<String> bindedGroupsAndSegmentRefs;
  private Set<String> bindedFields;
  private Set<String> bindedSegments;
  private Set<String> bindedDatatypes;
  private Set<String> bindedComponents;
  private Set<String> bindedValueSets;
  private CoConstraintService coConstraintService;

  public SerializableIG(Ig ig, String position,
      Map<String, Datatype> datatypesMap, Map<String, SerializableValuesetStructure> valueSetsMap,
      Map<String, Segment> segmentsMap, Map<String, ConformanceProfile> conformanceProfilesMap,
      ExportConfiguration exportConfiguration, Set<String> bindedGroupsAndSegmentRefs,
      Set<String> bindedFields, Set<String> bindedSegments, Set<String> bindedDatatypes,
      Set<String> bindedComponents, Set<String> bindedValueSets, CoConstraintService coConstraintService) {
    super(ig, position);
    this.datatypesMap = datatypesMap;
    this.valueSetsMap = valueSetsMap;
    this.segmentsMap = segmentsMap;
    this.conformanceProfilesMap = conformanceProfilesMap;
    this.exportConfiguration = exportConfiguration;
    this.bindedGroupsAndSegmentRefs = bindedGroupsAndSegmentRefs;
    this.bindedFields = bindedFields;
    this.bindedSegments = bindedSegments;
    this.bindedDatatypes = bindedDatatypes;
    this.bindedComponents = bindedComponents;
    this.bindedValueSets = bindedValueSets;
    this.populateNamesMap();
    this.coConstraintService=coConstraintService;
  }

  /*
   * (non-Javadoc)
   * 
   * @see gov.nist.hit.hl7.igamt.serialization.domain.SerializableElement#serialize()
   */
  @Override
  public Element serialize() throws SerializationException {
    Ig igDocument = (Ig) this.getAbstractDomain();
    Element igDocumentElement = super.getElement(Type.IGDOCUMENT);
    SerializableDocumentMetadata serializableDocumentMetadata =
        new SerializableDocumentMetadata(igDocument.getMetadata(), igDocument.getDomainInfo(), igDocument.getPublicationInfo());
    if (serializableDocumentMetadata != null) {
      Element metadataElement = serializableDocumentMetadata.serialize();
      if (metadataElement != null) {
        igDocumentElement.appendChild(metadataElement);
      }
    }
    for (Section section : igDocument.getContent()) {
      // startLevel is the base header level in the html/export. 1 = h1, 2 = h2...
      int startLevel = 1;
      Element sectionElement =
          SectionSerializationUtil.serializeSection(section, startLevel, datatypesMap,
              datatypeNamesMap, valueSetsMap, valuesetNamesMap, valuesetLabelMap, segmentsMap, conformanceProfilesMap,
              igDocument.getValueSetRegistry(), igDocument.getDatatypeRegistry(),
              igDocument.getSegmentRegistry(), igDocument.getConformanceProfileRegistry(),
              igDocument.getProfileComponentRegistry(), igDocument.getCompositeProfileRegistry(),
              this.bindedGroupsAndSegmentRefs, this.bindedFields, this.bindedSegments,
              this.bindedDatatypes, this.bindedComponents, this.bindedValueSets, this.exportConfiguration, this.coConstraintService);
      if (sectionElement != null) {
        igDocumentElement.appendChild(sectionElement);
      }
    }
    return igDocumentElement;
  }

  private void populateNamesMap() {
    datatypeNamesMap = new HashMap<>();
    if (datatypesMap != null) {
      for (String datatypeId : datatypesMap.keySet()) {
        Datatype datatype = datatypesMap.get(datatypeId);
        if (datatype != null) {
          datatypeNamesMap.put(datatypeId, datatype.getName());
        }
      }
    }
    valuesetNamesMap = new HashMap<>();
    valuesetLabelMap = new HashMap<>();
    if (valueSetsMap != null) {
      for (String valuesetId : valueSetsMap.keySet()) {
        Valueset valueset = valueSetsMap.get(valuesetId).getValueset();
        if (valueset != null) {
          valuesetNamesMap.put(valuesetId, valueset.getBindingIdentifier());
          valuesetLabelMap.put(valuesetId, valueset.getName());
        }
      }
    }
  }

  @Override
  public Map<String, String> getIdPathMap() {
    // Never used for the IG Document as it doesn't have any binding.
    return null;
  }

}
