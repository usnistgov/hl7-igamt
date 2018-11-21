package gov.nist.hit.hl7.igamt.conformanceprofile.domain.display;

import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.common.constraint.domain.ConformanceStatement;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRefOrGroup;



public class ConformanceProfileConformanceStatement {
  private String id;
  private DomainInfo domainInfo;
  private String name;
  private String identifier;
  private String messageType;
  private String structId;
  private Set<ConformanceStatement> conformanceStatements;
  private Set<SegmentRefOrGroup> children;

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public DomainInfo getDomainInfo() {
    return domainInfo;
  }

  public void setDomainInfo(DomainInfo domainInfo) {
    this.domainInfo = domainInfo;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getIdentifier() {
    return identifier;
  }

  public void setIdentifier(String identifier) {
    this.identifier = identifier;
  }

  public String getMessageType() {
    return messageType;
  }

  public void setMessageType(String messageType) {
    this.messageType = messageType;
  }

  public String getStructId() {
    return structId;
  }

  public void setStructId(String structId) {
    this.structId = structId;
  }

  public Set<ConformanceStatement> getConformanceStatements() {
    return conformanceStatements;
  }

  public void setConformanceStatements(Set<ConformanceStatement> conformanceStatements) {
    this.conformanceStatements = conformanceStatements;
  }

  public Set<SegmentRefOrGroup> getChildren() {
    return children;
  }

  public void setChildren(Set<SegmentRefOrGroup> children) {
    this.children = children;
  }
}

