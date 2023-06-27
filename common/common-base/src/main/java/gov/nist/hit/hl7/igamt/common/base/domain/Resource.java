package gov.nist.hit.hl7.igamt.common.base.domain;

import org.springframework.data.annotation.Transient;

import java.util.Set;

public abstract class Resource extends AbstractDomain {

  private String preDef;
  private String postDef;
  protected String parentId;// where the Resource was created or published. The resource can be deprecated from another library but the parent Id remains the same
  protected Set<String> libraryReferences;
  protected Type parentType;
  private String purposeAndUse;
  private String shortDescription;
  private String fixedExtension;
  private String structureIdentifier;
  @Transient
  private Set<GenerationDirective> generatedUsing;
  @Transient
  private boolean generated;
  
  private ResourceOrigin resourceOrigin;
  private DocumentInfo documentInfo;

  public Resource() {
    super();
    // TODO Auto-generated constructor stub
  }


  public Resource(String preDef, String postDef) {
    super();
    this.preDef = preDef;
    this.postDef = postDef;
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
  
  public abstract Resource clone();
  
  protected void complete(Resource elm) {
      super.complete(elm);
      elm.postDef=preDef;
      elm.postDef=postDef;
      elm.parentId = parentId;
      elm.parentType = parentType;
      elm.shortDescription = shortDescription;
      elm.purposeAndUse = purposeAndUse;
      elm.fixedExtension = fixedExtension;
      elm.setStructureIdentifier(structureIdentifier);
      elm.setResourceOrigin(resourceOrigin);
      elm.generatedUsing = generatedUsing;
      elm.generated = generated;
      elm.setDocumentInfo(documentInfo);

  }


  public String getParentId() {
    return parentId;
  }


  public void setParentId(String documentId) {
    this.parentId = documentId;
  }


  public Type getParentType() {
    return parentType;
  }


  public void setParentType(Type documentType) {
    this.parentType = documentType;
  }


  public String getPurposeAndUse() {
    return purposeAndUse;
  }


  public void setPurposeAndUse(String purposeAndUse) {
    this.purposeAndUse = purposeAndUse;
  }


  public String getShortDescription() {
    return shortDescription;
  }


  public void setShortDescription(String shortDescription) {
    this.shortDescription = shortDescription;
  }  
  
  public Set<String> getLibraryReferences() {
    return libraryReferences;
  }


  public void setLibraryReferences(Set<String> libraryReferences) {
    this.libraryReferences = libraryReferences;
  }

  
 // abstract String getSectionTitle();
  
  public String getPublicationDateString() {
    String s = null;
    if(this.getPublicationInfo() !=null && this.getPublicationInfo().getPublicationDate() !=null) {
      s = this.getPublicationInfo().getPublicationDate().toString();
      if(this.getActiveInfo() !=null && this.getActiveInfo().getStatus() !=null && this.getActiveInfo().getStatus().equals(ActiveStatus.DEPRECATED)) {
        s = '[' + s + "," + this.getActiveInfo().getEnd() + "]";
      }
    }
    return s;
  }


  public String getFixedExtension() {
    return fixedExtension;
  }


  public void setFixedExtension(String fixedExtension) {
    this.fixedExtension = fixedExtension;
  }

  public Set<GenerationDirective> getGeneratedUsing() {
    return generatedUsing;
  }

  public void setGeneratedUsing(Set<GenerationDirective> generatedUsing) {
    this.generatedUsing = generatedUsing;
  }

  public boolean isGenerated() {
    return generated;
  }

  public void setGenerated(boolean generated) {
    this.generated = generated;
  }


  public String getStructureIdentifier() {
    return structureIdentifier;
  }


  public void setStructureIdentifier(String structureIdentifier) {
    this.structureIdentifier = structureIdentifier;
  }


  public ResourceOrigin getResourceOrigin() {
    return resourceOrigin;
  }


  public void setResourceOrigin(ResourceOrigin resourceOrigin) {
    this.resourceOrigin = resourceOrigin;
  }


  public DocumentInfo getDocumentInfo() {
    return documentInfo;
  }


  public void setDocumentInfo(DocumentInfo documentInfo) {
    this.documentInfo = documentInfo;
  }
}
