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
package gov.nist.hit.hl7.igamt.export.configuration.newModel;

import java.util.HashMap;
import java.util.Map;

/**
 * @author Abdelghani El Ouakili
 *
 */
public class DeltaExportFilterDecision  extends ExportFilterDecision {
  
  private Map<String, Boolean> added = new HashMap<String, Boolean>();
  private Map<String, Boolean> changed = new HashMap<String, Boolean>();
  
  public Map<String, Boolean> getAdded() {
    return added;
  }
  public void setAdded(Map<String, Boolean> added) {
    this.added = added;
  }
  public Map<String, Boolean> getChanged() {
    return changed;
  }
  public void setChanged(Map<String, Boolean> changed) {
    this.changed = changed;
  }


}
