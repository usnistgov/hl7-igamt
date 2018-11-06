package gov.nist.hit.hl7.igamt.common.change.entity.domain;

import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class EntityChangeDomain {
  @Id
  private String id;

  private String targetId; //segmentId
  private int targetVersion; //segmentVersion
  private EntityType targetType; 
  private DocumentType documentType;
  private String documentId; //IgId
  private List<ChangeItemDomain> changeItems;
  private Date updateDate;

  public EntityChangeDomain() {
    super();
    this.updateDate = new Date();
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getTargetId() {
    return targetId;
  }

  public void setTargetId(String targetId) {
    this.targetId = targetId;
  }

  public int getTargetVersion() {
    return targetVersion;
  }

  public void setTargetVersion(int targetVersion) {
    this.targetVersion = targetVersion;
  }

  public EntityType getTargetType() {
    return targetType;
  }

  public void setTargetType(EntityType targetType) {
    this.targetType = targetType;
  }

  public DocumentType getDocumentType() {
    return documentType;
  }

  public void setDocumentType(DocumentType documentType) {
    this.documentType = documentType;
  }

  public String getDocumentId() {
    return documentId;
  }

  public void setDocumentId(String documentId) {
    this.documentId = documentId;
  }

  public List<ChangeItemDomain> getChangeItems() {
    return changeItems;
  }

  public void setChangeItems(List<ChangeItemDomain> changeItems) {
    this.changeItems = changeItems;
  }

  public Date getUpdateDate() {
    return updateDate;
  }

  public void setUpdateDate(Date updateDate) {
    this.updateDate = updateDate;
  }



}
