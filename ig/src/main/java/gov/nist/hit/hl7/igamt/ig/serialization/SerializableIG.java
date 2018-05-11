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

import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.domain.IgMetaData;
import gov.nist.hit.hl7.igamt.ig.serialization.sections.SectionSerializationUtil;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.serialization.domain.SerializableAbstractDomain;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import gov.nist.hit.hl7.igamt.shared.domain.AbstractDomain;
import gov.nist.hit.hl7.igamt.shared.domain.Section;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import nu.xom.Attribute;
import nu.xom.Element;

/**
 *
 * @author Maxence Lefort on Apr 2, 2018.
 */
public class SerializableIG extends SerializableAbstractDomain {

  private Map<String, Datatype> datatypesMap;
  private Map<String, Valueset> valueSetsMap;
  private Map<String, String> valuesetNamesMap;
  private Map<String, String> datatypeNamesMap;
  private Map<String, Segment> segmentsMap;
  private Map<String, ConformanceProfile> conformanceProfilesMap;

  /**
   * @param abstractDomain
   * @param position
   */
  public SerializableIG(Ig ig, String position, Map<String, Datatype> datatypesMap,
      Map<String, Valueset> valueSetsMap, Map<String, Segment> segmentsMap,
      Map<String, ConformanceProfile> conformanceProfilesMap) {
    super(ig, position);
    this.datatypesMap = datatypesMap;
    this.valueSetsMap = valueSetsMap;
    this.segmentsMap = segmentsMap;
    this.conformanceProfilesMap = conformanceProfilesMap;
    this.populateNamesMap();
  }

  /*
   * (non-Javadoc)
   * 
   * @see gov.nist.hit.hl7.igamt.serialization.domain.SerializableElement#serialize()
   */
  @Override
  public Element serialize() throws SerializationException {
    Ig igDocument = (Ig) this.getAbstractDomain();
    Element igDocumentElement = super.getElement("Document");
    Element igMetadata = serializeIgMetadata(igDocument.getMetaData());
    if (igMetadata != null) {
      igDocumentElement.appendChild(igMetadata);
    }

    for (Section section : igDocument.getContent()) {
      Element sectionElement = SectionSerializationUtil.serializeSection(section, datatypesMap,
          datatypeNamesMap, valueSetsMap, valuesetNamesMap, segmentsMap, conformanceProfilesMap,
          igDocument.getValueSetRegistry(), igDocument.getDatatypeRegistry(),
          igDocument.getSegmentRegistry(), igDocument.getConformanceProfileRegistry(),
          igDocument.getProfileComponentRegistry(), igDocument.getCompositeProfileRegistry());
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
    if (valueSetsMap != null) {
      for (String valuesetId : valueSetsMap.keySet()) {
        Valueset valueset = valueSetsMap.get(valuesetId);
        if (valueset != null) {
          valuesetNamesMap.put(valuesetId, valueset.getName());
        }
      }
    }
  }

  /**
   * @param metaData
   * @return
   */
  private Element serializeIgMetadata(IgMetaData metaData) {
    Element igMetadataElement = new Element("IgMetadata");
    igMetadataElement.addAttribute(
        new Attribute("topics", metaData.getTopics() != null ? metaData.getTopics() : ""));
    igMetadataElement.addAttribute(new Attribute("specificationName",
        metaData.getSpecificationName() != null ? metaData.getSpecificationName() : ""));
    igMetadataElement.addAttribute(new Attribute("identifier",
        metaData.getIdentifier() != null ? metaData.getIdentifier() : ""));
    igMetadataElement.addAttribute(new Attribute("implementationNotes",
        metaData.getImplementationNotes() != null ? metaData.getImplementationNotes() : ""));
    igMetadataElement.addAttribute(
        new Attribute("orgName", metaData.getOrgName() != null ? metaData.getOrgName() : ""));
    igMetadataElement.addAttribute(new Attribute("coverPicture",
        metaData.getCoverPicture() != null ? metaData.getCoverPicture() : ""));
    igMetadataElement.addAttribute(
        new Attribute("subTitle", metaData.getSubTitle() != null ? metaData.getSubTitle() : ""));
    return igMetadataElement;
  }

}
