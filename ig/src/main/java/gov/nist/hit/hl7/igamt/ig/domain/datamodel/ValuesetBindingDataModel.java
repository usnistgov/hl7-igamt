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
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.domain.property.Constant.SourceType;
import gov.nist.hit.hl7.igamt.valueset.domain.property.ContentDefinition;
import gov.nist.hit.hl7.igamt.valueset.domain.property.Extensibility;
import gov.nist.hit.hl7.igamt.valueset.domain.property.Stability;

/**
 * @author jungyubw
 *
 */
public class ValuesetBindingDataModel {
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
  private String bindingIdentifier;
  private String oid;
  private String intensionalComment;
  private String url;
  private Stability stability = Stability.Undefined;
  private Extensibility extensibility = Extensibility.Undefined;
  private ContentDefinition contentDefinition = ContentDefinition.Undefined;
  private SourceType sourceType = SourceType.INTERNAL;
  private int numberOfCodes;
  
  private ValuesetBinding valuesetBinding;

  public ValuesetBindingDataModel(Valueset vs) {
    this.id = vs.getId();
    this.creationDate = vs.getCreationDate();
    this.updateDate = vs.getUpdateDate();
    this.name = vs.getName();
    this.type = vs.getType();
    this.origin = vs.getOrigin();
    this.publicationInfo = vs.getPublicationInfo();
    this.domainInfo = vs.getDomainInfo();
    this.username = vs.getUsername();
    this.comment = vs.getComment();
    this.description = vs.getDescription();
    this.createdFrom = vs.getCreatedFrom();
    this.authorNotes = vs.getAuthorNotes();
    this.usageNotes = vs.getUsageNotes();
    this.from = vs.getFrom();
    this.bindingIdentifier = vs.getBindingIdentifier();
    this.oid = vs.getOid();
    this.intensionalComment = vs.getIntensionalComment();
    this.url = vs.getUrl();
    this.stability = vs.getStability();
    this.extensibility = vs.getExtensibility();
    this.contentDefinition = vs.getContentDefinition();
    this.sourceType = vs.getSourceType();
    this.numberOfCodes = vs.getNumberOfCodes();
  }

  public ValuesetBindingDataModel() {
    // TODO Auto-generated constructor stub
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

  public String getBindingIdentifier() {
    return bindingIdentifier;
  }

  public void setBindingIdentifier(String bindingIdentifier) {
    this.bindingIdentifier = bindingIdentifier;
  }

  public String getOid() {
    return oid;
  }

  public void setOid(String oid) {
    this.oid = oid;
  }

  public String getIntensionalComment() {
    return intensionalComment;
  }

  public void setIntensionalComment(String intensionalComment) {
    this.intensionalComment = intensionalComment;
  }

  public String getUrl() {
    return url;
  }

  public void setUrl(String url) {
    this.url = url;
  }

  public Stability getStability() {
    return stability;
  }

  public void setStability(Stability stability) {
    this.stability = stability;
  }

  public Extensibility getExtensibility() {
    return extensibility;
  }

  public void setExtensibility(Extensibility extensibility) {
    this.extensibility = extensibility;
  }

  public ContentDefinition getContentDefinition() {
    return contentDefinition;
  }

  public void setContentDefinition(ContentDefinition contentDefinition) {
    this.contentDefinition = contentDefinition;
  }

  public SourceType getSourceType() {
    return sourceType;
  }

  public void setSourceType(SourceType sourceType) {
    this.sourceType = sourceType;
  }

  public int getNumberOfCodes() {
    return numberOfCodes;
  }

  public void setNumberOfCodes(int numberOfCodes) {
    this.numberOfCodes = numberOfCodes;
  }

  public ValuesetBinding getValuesetBinding() {
    return valuesetBinding;
  }

  public void setValuesetBinding(ValuesetBinding valuesetBinding) {
    this.valuesetBinding = valuesetBinding;
  }



}
