/**
 * This software was developed at the National Institute of Standards and Technology by employees of
 * the Federal Government in the course of their official duties. Pursuant to title 17 Section 105
 * of the United States Code this software is not subject to copyright protection and is in the
 * public domain. This is an experimental system. NIST assumes no responsibility whatsoever for its
 * use by other parties, and makes no guarantees, expressed or implied, about its quality,
 * reliability, or any other characteristic. We would appreciate acknowledgement if the software is
 * used. This software can be redistributed and/or modified freely provided that any derivative
 * works bear some notice that they are derived from it, and any modified versions bear some notice
 * that they have been modified.
 */
package gov.nist.hit.hl7.igamt.ig.domain.datamodel;

import java.util.Date;

import gov.nist.hit.hl7.igamt.common.base.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.PublicationInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;

/**
 * @author jungyubw
 *
 */
public class DatatypeBindingDataModel {
  private String id;
  private Date creationDate;
  private Date updateDate;
  private String name;
  private Type type;
  private String origin;
  private PublicationInfo publicationInfo;
  private DomainInfo domainInfo;
  private String username;
  private String comment;
  private String description;
  private String createdFrom;
  private String authorNotes;
  private String usageNotes;
  private String from;
  private Long version;
  private String ext;
  private String purposeAndUse;
  private String preDef;
  private String postDef;

  public DatatypeBindingDataModel() {
    super();
  }
  
  public DatatypeBindingDataModel(Datatype d) {
    super();
    this.id = d.getId();
    this.creationDate = d.getCreationDate();
    this.updateDate = d.getUpdateDate();
    this.name = d.getName();
    this.type = d.getType();
    this.origin = d.getOrigin();
    this.publicationInfo = d.getPublicationInfo();
    this.domainInfo = d.getDomainInfo();
    this.username = d.getUsername();
    this.comment = d.getComment();
    this.description = d.getComment();
    this.createdFrom = d.getCreatedFrom();
    this.authorNotes = d.getAuthorNotes();
    this.usageNotes = d.getUsageNotes();
    this.from = d.getFrom();
    this.version = d.getVersion();
    this.ext = d.getExt();
    this.purposeAndUse = d.getPurposeAndUse();
    this.preDef = d.getPreDef();
    this.postDef = d.getPostDef();
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public Date getCreationDate() {
    return creationDate;
  }

  public void setCreationDate(Date creationDate) {
    this.creationDate = creationDate;
  }

  public Date getUpdateDate() {
    return updateDate;
  }

  public void setUpdateDate(Date updateDate) {
    this.updateDate = updateDate;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Type getType() {
    return type;
  }

  public void setType(Type type) {
    this.type = type;
  }

  public String getOrigin() {
    return origin;
  }

  public void setOrigin(String origin) {
    this.origin = origin;
  }

  public PublicationInfo getPublicationInfo() {
    return publicationInfo;
  }

  public void setPublicationInfo(PublicationInfo publicationInfo) {
    this.publicationInfo = publicationInfo;
  }

  public DomainInfo getDomainInfo() {
    return domainInfo;
  }

  public void setDomainInfo(DomainInfo domainInfo) {
    this.domainInfo = domainInfo;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getComment() {
    return comment;
  }

  public void setComment(String comment) {
    this.comment = comment;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getCreatedFrom() {
    return createdFrom;
  }

  public void setCreatedFrom(String createdFrom) {
    this.createdFrom = createdFrom;
  }

  public String getAuthorNotes() {
    return authorNotes;
  }

  public void setAuthorNotes(String authorNotes) {
    this.authorNotes = authorNotes;
  }

  public String getUsageNotes() {
    return usageNotes;
  }

  public void setUsageNotes(String usageNotes) {
    this.usageNotes = usageNotes;
  }

  public String getFrom() {
    return from;
  }

  public void setFrom(String from) {
    this.from = from;
  }

  public Long getVersion() {
    return version;
  }

  public void setVersion(Long version) {
    this.version = version;
  }

  public String getExt() {
    return ext;
  }

  public void setExt(String ext) {
    this.ext = ext;
  }

  public String getPurposeAndUse() {
    return purposeAndUse;
  }

  public void setPurposeAndUse(String purposeAndUse) {
    this.purposeAndUse = purposeAndUse;
  }

  public String getPreDef() {
    return preDef;
  }

  public void setPreDef(String preDef) {
    this.preDef = preDef;
  }

  public String getPostDef() {
    return postDef;
  }

  public void setPostDef(String postDef) {
    this.postDef = postDef;
  }


}
