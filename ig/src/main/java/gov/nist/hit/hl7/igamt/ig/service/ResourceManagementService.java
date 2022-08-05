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

import gov.nist.hit.hl7.igamt.common.base.domain.DocumentInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Registry;
import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.exception.ForbiddenOperationException;
import gov.nist.hit.hl7.igamt.common.base.util.CloneMode;
import gov.nist.hit.hl7.igamt.common.base.wrappers.AddingInfo;
import gov.nist.hit.hl7.igamt.common.exception.EntityNotFound;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;

/**
 * @author Abdelghani El Ouakili
 *
 */
public interface ResourceManagementService {

  <T extends Resource> T createFlavor(Registry reg, String username, DocumentInfo documentInfo, Type resourceType,
      AddingInfo selected) throws EntityNotFound, ForbiddenOperationException;

  <T extends Resource> T getElmentFormAddingInfo(String username, DocumentInfo documentInfo, Type resourceType, AddingInfo selected)
      throws EntityNotFound;

  /**
   * @param username
   * @param documentInfo
   * @param addingInfo
   * @return
 * @throws ForbiddenOperationException 
   */
  ConformanceProfile createProfile(String username, DocumentInfo documentInfo,
      AddingInfo addingInfo) throws ForbiddenOperationException;

  /**
   * @param res
   * @param string
   * @param username
   * @param documentInfo
   * @param cloneMode
   */
  void applyCloneResource(Resource res, String string, String username, DocumentInfo documentInfo,
      CloneMode cloneMode);
   
  
  
}
