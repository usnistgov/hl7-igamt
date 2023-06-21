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
package gov.nist.hit.hl7.igamt.display.model;

import gov.nist.hit.hl7.igamt.common.base.util.CloneMode;
import gov.nist.hit.hl7.igamt.ig.domain.IgTemplate;

/**
 * @author Abdelghani El Ouakili
 *
 */
public class CopyInfo {

  private CloneMode mode; 
  private IgTemplate template;
  private boolean inherit;
 
  

  public CopyInfo() {
    super();
    // TODO Auto-generated constructor stub
  }
  
  public CloneMode getMode() {
    return mode;
  }
  public void setMode(CloneMode mode) {
    this.mode = mode;
  }

  public IgTemplate getTemplate() {
    return template;
  }

  public void setTemplate(IgTemplate template) {
    this.template = template;
  }
  public boolean isInherit() {
    return inherit;
  }

  public void setInherit(boolean inherit) {
    this.inherit = inherit;
  }

  
}
