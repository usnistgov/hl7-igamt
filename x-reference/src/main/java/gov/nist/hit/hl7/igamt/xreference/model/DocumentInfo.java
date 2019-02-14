package gov.nist.hit.hl7.igamt.xreference.model;

import gov.nist.hit.hl7.igamt.common.change.entity.domain.DocumentType;

public class DocumentInfo {
  
  private String id; 
  
  private String title; 
  
  private DocumentType documentType;

  public DocumentInfo(String id, String title, DocumentType documentType) {
    super();
    this.id = id;
    this.title = title;
    this.documentType = documentType;
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public DocumentType getDocumentType() {
    return documentType;
  }

  public void setDocumentType(DocumentType documentType) {
    this.documentType = documentType;
  }
  

}
