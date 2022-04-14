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
package gov.nist.hit.hl7.igamt.common.base.service.impl;

import java.util.ArrayList;
import java.util.Date;

import gov.nist.hit.hl7.igamt.common.base.domain.ActiveInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.PublicationInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.SharePermission;

/**
 * @author Abdelghani El Ouakili
 *
 */
public class CloneServiceImpl {


  public void applyResourcePermutations(Resource resource, String id, String username ) {
    resource.setUsername(username);
    resource.setUpdateDate(new Date());
    resource.setCreationDate(new Date());
    resource.setActiveInfo(new ActiveInfo());
    resource.setPublicationInfo(new PublicationInfo() );
    resource.setCreatedFrom(resource.getId());
    resource.setStatus(null);
    resource.setFrom(resource.getId());
    resource.setVersion(1L);
    resource.setSharedUsers(new ArrayList<String>());
    resource.getSharedUsers().add(username);
    resource.setCurrentAuthor(username);
    resource.setSharePermission(SharePermission.WRITE);
    resource.setId(id);

  }

}