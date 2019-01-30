package gov.nist.hit.hl7.igamt.conformanceprofile.domain.display;

import java.util.HashMap;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.model.SectionInfo;
import gov.nist.hit.hl7.igamt.common.constraint.domain.ConformanceStatement;
import gov.nist.hit.hl7.igamt.common.constraint.domain.ConformanceStatementsContainer;



public class ConformanceProfileConformanceStatement extends SectionInfo {
  private String name;
  private String identifier;
  private String messageType;
  private String structId;
  private Set<ConformanceStatement> conformanceStatements;
  private Set<SegmentRefOrGroupStructureTreeModel> structure;
  private HashMap<String, ConformanceStatementsContainer> associatedConformanceStatementMap;

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

  public Set<SegmentRefOrGroupStructureTreeModel> getStructure() {
    return structure;
  }

  public void setStructure(Set<SegmentRefOrGroupStructureTreeModel> structure) {
    this.structure = structure;
  }

  public HashMap<String, ConformanceStatementsContainer> getAssociatedConformanceStatementMap() {
    return associatedConformanceStatementMap;
  }

  public void setAssociatedConformanceStatementMap(HashMap<String, ConformanceStatementsContainer> associatedConformanceStatementMap) {
    this.associatedConformanceStatementMap = associatedConformanceStatementMap;
  }



}

