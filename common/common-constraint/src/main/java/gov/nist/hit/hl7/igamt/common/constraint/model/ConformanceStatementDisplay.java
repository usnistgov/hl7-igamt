package gov.nist.hit.hl7.igamt.common.constraint.model;

import java.util.HashMap;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.model.SectionInfo;
import gov.nist.hit.hl7.igamt.common.base.model.SectionType;
import gov.nist.hit.hl7.igamt.common.constraint.domain.ConformanceStatement;
import gov.nist.hit.hl7.igamt.common.constraint.domain.ConformanceStatementsContainer;

public class ConformanceStatementDisplay extends SectionInfo {
  private Set<ConformanceStatement> conformanceStatements;
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
  
  public void complete(Resource elm, SectionType type, boolean readOnly, Set<ConformanceStatement> conformanceStatements, HashMap<String, ConformanceStatementsContainer> associatedConformanceStatementMap) {
    super.complete(this, elm, type, readOnly);
    this.setConformanceStatements(conformanceStatements);
    this.setAssociatedConformanceStatementMap(associatedConformanceStatementMap);
    this.name = elm.getName();
  }

}
