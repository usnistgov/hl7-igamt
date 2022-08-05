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
 
import gov.nist.hit.hl7.igamt.common.base.exception.ForbiddenOperationException; 
import gov.nist.hit.hl7.igamt.common.base.exception.ResourceNotFoundException; 
import gov.nist.hit.hl7.igamt.common.base.wrappers.SharedUsersInfo; 
 
/** 
 * @author Abdelghani El Ouakili 
 * 
 */ 
public interface SharingService { 
 
  public void shareIg(String id, SharedUsersInfo sharedUsersInfo) throws ResourceNotFoundException, ForbiddenOperationException; 
  public void shareDatatype(String id, SharedUsersInfo sharedUsersInfo) throws ResourceNotFoundException, ForbiddenOperationException; 
  public void shareSegment(String id, SharedUsersInfo sharedUsersInfo) throws ResourceNotFoundException, ForbiddenOperationException; 
  public void shareValueset(String id, SharedUsersInfo sharedUsersInfo) throws ResourceNotFoundException, ForbiddenOperationException; 
  public void shareConformanceProfile(String id, SharedUsersInfo sharedUsersInfo) throws ResourceNotFoundException; 
  public void shareCoConstraintGroup(String elm, SharedUsersInfo sharedUsersInfo) throws ResourceNotFoundException; 
 
} 
