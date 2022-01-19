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
package gov.nist.hit.hl7.igamt.ig.service;

import java.util.HashMap;

import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.RealKey;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.util.CloneMode;
import gov.nist.hit.hl7.igamt.display.model.CopyInfo;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;

/**
 * @author Abdelghani El Ouakili
 *
 */
public interface CloneService {

  public Ig clone(Ig ig, String username, CopyInfo info);
  public Link cloneConformanceProfile(String key, HashMap<RealKey, String> newKeys, Link l, String username,
      Scope scope, CloneMode cloneMode);
  public Link cloneProfileComponent(String newId, HashMap<RealKey, String> newKeys, Link l,
      String username, Scope scope, CloneMode cloneMode);
  public Link cloneSegment(String key, HashMap<RealKey, String> newKeys, Link l, String username, Scope scope, CloneMode cloneMode);
  public Link cloneDatatype( String newId, HashMap<RealKey, String> newKey, Link l,
      String username, Scope scope, CloneMode cloneMode);
  public Link cloneValueSet(String newkey, Link l, String username, Scope scope, CloneMode cloneMode);
  

}
