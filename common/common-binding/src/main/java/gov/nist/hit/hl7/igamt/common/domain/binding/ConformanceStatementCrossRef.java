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
package gov.nist.hit.hl7.igamt.common.domain.binding;

import java.util.Set;

/**
 * @author jungyubw
 *
 */
public class ConformanceStatementCrossRef extends ConstraintCrossRef {

  private Set<String> conformanceStatementIds;

  public ConformanceStatementCrossRef(
      gov.nist.hit.hl7.igamt.common.constraint.domain.assertion.Path path,
      Set<String> conformanceStatementIds) {
    super(path);
    this.conformanceStatementIds = conformanceStatementIds;
  }

  public Set<String> getConformanceStatementIds() {
    return conformanceStatementIds;
  }

  public void setConformanceStatementIds(Set<String> conformanceStatementIds) {
    this.conformanceStatementIds = conformanceStatementIds;
  }
}
