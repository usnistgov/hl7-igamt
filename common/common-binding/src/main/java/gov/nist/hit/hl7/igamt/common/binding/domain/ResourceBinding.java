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

import java.util.HashSet;
import java.util.Set;


/**
 * @author jungyubw
 *
 */
public class ResourceBinding extends Binding {
  private Set<String> conformanceStatementIds;

  public ResourceBinding() {
    super();
  }

  public ResourceBinding(String elementId, Set<StructureElementBinding> children, Set<String> conformanceStatementIds) {
    super(elementId, children);
    this.conformanceStatementIds = conformanceStatementIds;
  }
  
  public Set<String> getConformanceStatementIds() {
    return conformanceStatementIds;
  }

  public void setConformanceStatementIds(Set<String> conformanceStatementIds) {
    this.conformanceStatementIds = conformanceStatementIds;
  }

  public void addConformanceStatement(String conformanceStatementId) {
    if (conformanceStatementIds == null) {
      this.conformanceStatementIds = new HashSet<String>();
    }
    this.conformanceStatementIds.add(conformanceStatementId);

  }
}
