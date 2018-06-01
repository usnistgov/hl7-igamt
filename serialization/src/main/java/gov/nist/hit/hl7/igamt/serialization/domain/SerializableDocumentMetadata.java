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
package gov.nist.hit.hl7.igamt.serialization.domain;

import gov.nist.hit.hl7.igamt.common.base.domain.DocumentMetadata;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import nu.xom.Attribute;
import nu.xom.Element;

/**
 *
 * @author Maxence Lefort on May 17, 2018.
 */
public class SerializableDocumentMetadata extends SerializableElement {

  private DocumentMetadata metadata;

  /**
   * @param id
   * @param position
   * @param title
   */
  public SerializableDocumentMetadata(DocumentMetadata metadata) {
    super(metadata.getIdentifier(), "0", metadata.getTitle());
    this.metadata = metadata;
  }

  /*
   * (non-Javadoc)
   * 
   * @see gov.nist.hit.hl7.igamt.serialization.domain.SerializableElement#serialize()
   */
  @Override
  public Element serialize() throws SerializationException {
    Element metadataElement = new Element("Metadata");
    metadataElement.addAttribute(
        new Attribute("topics", metadata.getTopics() != null ? metadata.getTopics() : ""));
    metadataElement.addAttribute(new Attribute("specificationName",
        metadata.getSpecificationName() != null ? metadata.getSpecificationName() : ""));
    metadataElement.addAttribute(new Attribute("identifier",
        metadata.getIdentifier() != null ? metadata.getIdentifier() : ""));
    metadataElement.addAttribute(new Attribute("implementationNotes",
        metadata.getImplementationNotes() != null ? metadata.getImplementationNotes() : ""));
    metadataElement.addAttribute(
        new Attribute("orgName", metadata.getOrgName() != null ? metadata.getOrgName() : ""));
    metadataElement.addAttribute(new Attribute("coverPicture",
        metadata.getCoverPicture() != null ? metadata.getCoverPicture() : ""));
    metadataElement.addAttribute(
        new Attribute("subTitle", metadata.getSubTitle() != null ? metadata.getSubTitle() : ""));
    return metadataElement;
  }



}
