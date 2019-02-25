package gov.nist.hit.hl7.igamt.constraints.domain.display;

import java.util.HashMap;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.model.SectionInfo;
import gov.nist.hit.hl7.igamt.common.base.model.SectionType;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatement;

public class ConformanceStatementDisplay extends SectionInfo {
  private Set<ConformanceStatement> conformanceStatements;
  private Set<ConformanceStatement> availableConformanceStatements;
  private HashMap<String, ConformanceStatementsContainer> associatedConformanceStatementMap;
  private String name;

  public Set<ConformanceStatement> getConformanceStatements() {
    return conformanceStatements;
  }

  public void setConformanceStatements(Set<ConformanceStatement> conformanceStatements) {
    this.conformanceStatements = conformanceStatements;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public HashMap<String, ConformanceStatementsContainer> getAssociatedConformanceStatementMap() {
    return associatedConformanceStatementMap;
  }

  public void setAssociatedConformanceStatementMap(HashMap<String, ConformanceStatementsContainer> associatedConformanceStatementMap) {
    this.associatedConformanceStatementMap = associatedConformanceStatementMap;
  }
  

  public Set<ConformanceStatement> getAvailableConformanceStatements() {
    return availableConformanceStatements;
  }

  public void setAvailableConformanceStatements(Set<ConformanceStatement> availableConformanceStatements) {
    this.availableConformanceStatements = availableConformanceStatements;
  }

  public void complete(Resource elm, SectionType type, boolean readOnly, Set<ConformanceStatement> conformanceStatements, Set<ConformanceStatement> availableConformanceStatements, HashMap<String, ConformanceStatementsContainer> associatedConformanceStatementMap) {
    super.complete(this, elm, type, readOnly);
    this.setConformanceStatements(conformanceStatements);
    this.setAvailableConformanceStatements(availableConformanceStatements);
    this.setAssociatedConformanceStatementMap(associatedConformanceStatementMap);
    this.name = elm.getName();
  }
}
