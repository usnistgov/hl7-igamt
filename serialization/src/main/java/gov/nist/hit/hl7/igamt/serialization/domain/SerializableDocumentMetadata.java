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
import gov.nist.hit.hl7.igamt.common.base.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.PublicationInfo;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import gov.nist.hit.hl7.igamt.serialization.util.DateSerializationUtil;
import nu.xom.Attribute;
import nu.xom.Element;

/**
 *
 * @author Maxence Lefort on May 17, 2018.
 */
public class SerializableDocumentMetadata extends SerializableElement {

  private DocumentMetadata metadata;
  private DomainInfo domainInfo;
  private PublicationInfo publicationInfo;

  public SerializableDocumentMetadata(DocumentMetadata metadata, DomainInfo domainInfo, PublicationInfo publicationInfo) {
    super(metadata.getIdentifier(), "0", metadata.getTitle());
    this.metadata = metadata;
    this.domainInfo = domainInfo;
    this.publicationInfo = publicationInfo;
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
        new Attribute("title", metadata.getTitle() != null ? metadata.getTitle() : ""));
    metadataElement.addAttribute(
        new Attribute("topics", metadata.getTopics() != null ? metadata.getTopics() : ""));
    metadataElement.addAttribute(new Attribute("description",
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
    
    metadataElement.addAttribute(new Attribute("hl7Version",
        this.domainInfo != null
            && this.domainInfo.getVersion() != null
                ? this.domainInfo.getVersion()
                : ""));
    String domainCompatibilityVersions = "";
    if (this.domainInfo != null
        && this.domainInfo.getCompatibilityVersion() != null) {
      domainCompatibilityVersions =
          String.join(",", this.domainInfo.getCompatibilityVersion());
    }
    metadataElement
        .addAttribute(new Attribute("domainCompatibilityVersions", domainCompatibilityVersions));
    metadataElement.addAttribute(new Attribute("scope",
        this.domainInfo != null
            && this.domainInfo.getScope() != null
                ? this.domainInfo.getScope().name()
                : ""));
    metadataElement.addAttribute(new Attribute("publicationVersion",
        this.publicationInfo != null
            && this.publicationInfo.getPublicationVersion() != null
                ? this.publicationInfo.getPublicationVersion()
                : ""));
    String publicationDate = "";
    if (this.publicationInfo != null
        && this.publicationInfo.getPublicationDate() != null) {
      publicationDate = DateSerializationUtil
          .serializeDate(this.publicationInfo.getPublicationDate());
    }
    metadataElement.addAttribute(new Attribute("publicationDate", publicationDate));
    //TODO add appVersion
    return metadataElement;
  }



}
