package gov.nist.hit.hl7.igamt.constraints.domain;

import java.util.List;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;


public class ConformanceStatementsContainer {

  private Set<ConformanceStatement> conformanceStatements;
  private Type sourceType;
  private String key;
  private String label;

  public Set<ConformanceStatement> getConformanceStatements() {
    return conformanceStatements;
  }
  
  public ConformanceStatementsContainer(Set<ConformanceStatement> conformanceStatements,
      Type sourceType, String key, String label) {
    super();
    this.conformanceStatements = conformanceStatements;
    this.sourceType = sourceType;
    this.key = key;
    this.label = label;
  }

  public ConformanceStatementsContainer() {
    // TODO Auto-generated constructor stub
  }

  public void setConformanceStatements(Set<ConformanceStatement> conformanceStatements) {
    this.conformanceStatements = conformanceStatements;
  }

  public Type getSourceType() {
    return sourceType;
  }

  public void setSourceType(Type sourceType) {
    this.sourceType = sourceType;
  }

  public String getKey() {
    return key;
  }

  public void setKey(String key) {
    this.key = key;
  }

  public String getLabel() {
    return label;
  }

  public void setLabel(String label) {
    this.label = label;
  }


}
