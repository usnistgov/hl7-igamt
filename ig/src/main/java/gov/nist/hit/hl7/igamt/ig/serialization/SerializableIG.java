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

import java.util.Map;

import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.domain.IgMetaData;
import gov.nist.hit.hl7.igamt.ig.serialization.sections.SectionSerializationUtil;
import gov.nist.hit.hl7.igamt.serialization.domain.SerializableAbstractDomain;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import gov.nist.hit.hl7.igamt.shared.domain.AbstractDomain;
import gov.nist.hit.hl7.igamt.shared.domain.Resource;
import gov.nist.hit.hl7.igamt.shared.domain.Section;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import nu.xom.Attribute;
import nu.xom.Element;

/**
 *
 * @author Maxence Lefort on Apr 2, 2018.
 */
public class SerializableIG extends SerializableAbstractDomain {

  Map<String, Datatype> datatypesMap;
  Map<String, Valueset> valueSetsMap;
  
  /**
   * @param abstractDomain
   * @param position
   */
  public SerializableIG(AbstractDomain abstractDomain, String position, Map<String, Datatype> datatypesMap, Map<String, Valueset> valueSetsMap) {
    super(abstractDomain, position);
    this.datatypesMap = datatypesMap;
    this.valueSetsMap = valueSetsMap;
  }

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.serialization.domain.SerializableElement#serialize()
   */
  @Override
  public Element serialize() throws SerializationException {
    Ig igDocument = (Ig) this.getAbstractDomain();
    Element igDocumentElement = super.getElement("Document");
    Element igMetadata = serializeIgMetadata(igDocument.getMetaData());
    if(igMetadata != null) {
      igDocumentElement.appendChild(igMetadata);
    }
    
    for(Section section : igDocument.getContent()) {
      Element sectionElement = SectionSerializationUtil.serializeSection(section,datatypesMap);
      if(sectionElement != null) {
        igDocumentElement.appendChild(sectionElement);
      }
    }
    return igDocumentElement;
  }

  /**
   * @param metaData
   * @return
   */
  private Element serializeIgMetadata(IgMetaData metaData) {
    Element igMetadataElement = new Element("IgMetadata");
    igMetadataElement.addAttribute(new Attribute("topics",metaData.getTopics() != null ? metaData.getTopics() : ""));
    igMetadataElement.addAttribute(new Attribute("specificationName",metaData.getSpecificationName() != null ? metaData.getSpecificationName() : ""));
    igMetadataElement.addAttribute(new Attribute("identifier",metaData.getIdentifier() != null ? metaData.getIdentifier() : ""));
    igMetadataElement.addAttribute(new Attribute("implementationNotes",metaData.getImplementationNotes() != null ? metaData.getImplementationNotes() : ""));
    igMetadataElement.addAttribute(new Attribute("orgName",metaData.getOrgName() != null ? metaData.getOrgName() : ""));
    igMetadataElement.addAttribute(new Attribute("coverPicture",metaData.getCoverPicture() != null ? metaData.getCoverPicture() : ""));
    igMetadataElement.addAttribute(new Attribute("subTitle",metaData.getSubTitle() != null ? metaData.getSubTitle() : ""));
    return igMetadataElement;
  }

}
