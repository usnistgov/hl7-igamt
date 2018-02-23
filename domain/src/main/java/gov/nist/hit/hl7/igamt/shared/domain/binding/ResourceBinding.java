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
package gov.nist.hit.hl7.igamt.shared.domain.binding;

import java.util.Set;

import gov.nist.hit.hl7.igamt.shared.domain.constraint.ConformanceStatement;

/**
 * @author jungyubw
 *
 */
public class ResourceBinding extends Binding {
  private Set<ConformanceStatement> conformanceStatements;
  private Set<ConformanceStatementCrossRef> conformanceStatementCrossRefs;
  
  public ResourceBinding(String elementId, Set<StructureElementBinding> children,
      Set<ConformanceStatement> conformanceStatements,
      Set<ConformanceStatementCrossRef> conformanceStatementCrossRefs) {
    super(elementId, children);
    this.conformanceStatements = conformanceStatements;
    this.conformanceStatementCrossRefs = conformanceStatementCrossRefs;
  }

  public Set<ConformanceStatement> getConformanceStatements() {
    return conformanceStatements;
  }

  public void setConformanceStatements(Set<ConformanceStatement> conformanceStatements) {
    this.conformanceStatements = conformanceStatements;
  }

  public Set<ConformanceStatementCrossRef> getConformanceStatementCrossRefs() {
    return conformanceStatementCrossRefs;
  }

  public void setConformanceStatementCrossRefs(Set<ConformanceStatementCrossRef> conformanceStatementCrossRefs) {
    this.conformanceStatementCrossRefs = conformanceStatementCrossRefs;
  }


}
