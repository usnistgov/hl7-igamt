package gov.nist.hit.hl7.igamt.common.base.domain.display;

import java.util.List;
import java.util.Set;

import gov.nist.diff.domain.DeltaAction;
import gov.nist.hit.hl7.igamt.common.base.domain.ActiveInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.PublicationInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.SourceType;
import gov.nist.hit.hl7.igamt.common.base.domain.Status;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;

public class DisplayElement {

  private String id;
  private String fixedName;
  private String variableName;
  private String description;
  private DomainInfo domainInfo;
  private Type type;
  private boolean leaf; // eventually for lazy loading
  private int position;
  private boolean differantial;
  private DeltaAction delta;
  private String origin;
  private boolean isFlavor;
  private Status status;
  private PublicationInfo publicationInfo;
  private ActiveInfo activeInfo;
  private Type parentType;
  private String parentId;
  private Set<String> libraryReferences;
  private List<DisplayElement> children;
  private String flavorExt;
  private String resourceName;

  public DeltaAction getDelta() {
    return delta;
  }

  public void setDelta(DeltaAction delta) {
    this.delta = delta;
  }

  public String getOrigin() {
    return origin;
  }

  public void setOrigin(String origin) {
    this.origin = origin;
  }

  public String getFixedName() {
    return fixedName;
  }

  public void setFixedName(String fixedName) {
    this.fixedName = fixedName;
  }

  public String getVariableName() {
    return variableName;
  }

  public void setVariableName(String variableName) {
    this.variableName = variableName;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public DomainInfo getDomainInfo() {
    return domainInfo;
  }

  public void setDomainInfo(DomainInfo domainInfo) {
    this.domainInfo = domainInfo;
  }

  public Type getType() {
    return type;
  }

  public void setType(Type type) {
    this.type = type;
  }

  public boolean isLeaf() {
    return leaf;
  }

  public void setLeaf(boolean leaf) {
    this.leaf = leaf;
  }

  public int getPosition() {
    return position;
  }

  public void setPosition(int position) {
    this.position = position;
  }

  public boolean isDifferantial() {
    return differantial;
  }

  public void setDifferantial(boolean differantial) {
    this.differantial = differantial;
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public boolean isFlavor() {
    return isFlavor;
  }

  public void setFlavor(boolean isFlavor) {
    this.isFlavor = isFlavor;
  }

  public Type getParentType() {
    return parentType;
  }

  public void setParentType(Type documentType) {
    this.parentType = documentType;
  }

  public String getParentId() {
    return parentId;
  }

  public void setParentId(String documentId) {
    this.parentId = documentId;
  }

  public Status getStatus() {
    return status;
  }

  public void setStatus(Status status) {
    this.status = status;
  }

  public PublicationInfo getPublicationInfo() {
    return publicationInfo;
  }

  public void setPublicationInfo(PublicationInfo publicationInfo) {
    this.publicationInfo = publicationInfo;
  }
  public ActiveInfo getActiveInfo() {
    return activeInfo;
  }
  public void setActiveInfo(ActiveInfo activeInfo) {
    this.activeInfo = activeInfo;
  }

  @Override
  public String toString() {
    return "DisplayElement [id=" + id + ", fixedName=" + fixedName + ", variableName=" + variableName + ", description="
        + description + ", domainInfo=" + domainInfo + ", type=" + type + ", leaf=" + leaf + ", position="
        + position + ", differantial=" + differantial + ", delta=" + delta + ", origin=" + origin + ", isFlavor="
        + isFlavor + ", status=" + status + ", publicationInfo=" + publicationInfo + ", parentType=" + parentType
        + ", parentId=" + parentId + "]";
  }

  public Set<String> getLibraryReferences() {
    return libraryReferences;
  }

  public void setLibraryReferences(Set<String> libraryReferences) {
    this.libraryReferences = libraryReferences;
  }

  public List<DisplayElement> getChildren() {
    return children;
  }

  public void setChildren(List<DisplayElement> children) {
    this.children = children;
  }

  public String getFlavorExt() {
    return flavorExt;
  }

  public void setFlavorExt(String flavorExt) {
    this.flavorExt = flavorExt;
  }

  public String getResourceName() {
    return resourceName;
  }

  public void setResourceName(String resourceName) {
    this.resourceName = resourceName;
  }

}
