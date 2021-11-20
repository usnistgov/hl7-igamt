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
package gov.nist.hit.hl7.igamt.common.binding.domain;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.ConstraintType;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.ChangeReason;
import gov.nist.hit.hl7.igamt.constraints.domain.AssertionConformanceStatement;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatement;
import gov.nist.hit.hl7.igamt.constraints.domain.FreeTextConformanceStatement;


/**
 * @author jungyubw
 */
public class ResourceBinding extends Binding {
    /**
     *
     */
    private static final long serialVersionUID = 1L;
    @Deprecated
    private Set<String> conformanceStatementIds;
    private Set<ConformanceStatement> conformanceStatements;
    private List<ChangeReason> conformanceStatementsChangeLog;

    public ResourceBinding() {
        super();
    }

    public ResourceBinding(String elementId, Set<StructureElementBinding> children, Set<ConformanceStatement> conformanceStatements) {
        super(elementId, children);
        this.conformanceStatements = conformanceStatements;
    }

    @Deprecated
    public Set<String> getConformanceStatementIds() {
        return conformanceStatementIds;
    }

    @Deprecated
    public void setConformanceStatementIds(Set<String> conformanceStatementIds) {
        this.conformanceStatementIds = conformanceStatementIds;
    }


    public void addConformanceStatement(ConformanceStatement cs) {
        if (conformanceStatements == null) {
            this.conformanceStatements = new HashSet<ConformanceStatement>();
        }
        if (cs.getType().equals(ConstraintType.FREE)) {
            this.conformanceStatements.add((FreeTextConformanceStatement) cs);
        } else if (cs.getType().equals(ConstraintType.ASSERTION)) {
            this.conformanceStatements.add((AssertionConformanceStatement) cs);
        } else {
            System.out.println("wrong!!!");

        }
    }

  public List<ChangeReason> getConformanceStatementsChangeLog() {
      if(conformanceStatementsChangeLog == null) {
        conformanceStatementsChangeLog = new ArrayList<>();
      }
      return conformanceStatementsChangeLog;
  }

  public void setConformanceStatementsChangeLog(List<ChangeReason> conformanceStatementsChangeLog) {
    this.conformanceStatementsChangeLog = conformanceStatementsChangeLog;
  }

  @Override
    public String toString() {
        return "ResourceBinding [conformanceStatementIds=" + conformanceStatementIds + ", conformanceStatements="
                + conformanceStatements + ", elementId=" + elementId + ", locationInfo=" + locationInfo + ", children="
                + children + "]";
    }

    public Set<ConformanceStatement> getConformanceStatements() {
        return conformanceStatements;
    }

    public void setConformanceStatements(Set<ConformanceStatement> conformanceStatements) {
        this.conformanceStatements = conformanceStatements;
    }
}
