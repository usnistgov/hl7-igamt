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

import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.AbstractDomain;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.exception.ForbiddenOperationException;
import gov.nist.hit.hl7.igamt.common.base.service.CommonService;

/**
 * @author ena3
 *
 */
@Service
public class CommonServiceImpl implements CommonService {



  @Override
  public void checkAuthority(Authentication auth, String role)  throws ForbiddenOperationException {
    // TODO Auto-generated method stub
    if(!auth.getAuthorities().contains(new SimpleGrantedAuthority(role))) {

      throw  new ForbiddenOperationException("The User must have the " +role+ " rights"+"to perform this operation");
    }
  }

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.common.base.service.CommonService#checkRight(org.springframework.security.core.Authentication, java.lang.String)
   */
  @Override
  public void checkRight(Authentication auth, String author, String username)
      throws ForbiddenOperationException {
    // TODO Auto-generated method stub
    if(username==null) {
      throw  new ForbiddenOperationException("Resource change not allowed");
    } 
    //if(!auth.getAuthorities().contains(new SimpleGrantedAuthority("ADMIN"))) {
//      boolean allowed = author !=null? auth.getName().equals(author): auth.getName().equals(username);
    
//      if(!allowed) {
//       throw new ForbiddenOperationException("The User must be the current author or an admin of this resource to perform this operation");
//      }
   // }
  }

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.common.base.service.CommonService#isAdmin(org.springframework.security.core.Authentication)
   */
  @Override
  public boolean isAdmin(Authentication auth) {
    // TODO Auto-generated method stub
    return auth.getAuthorities().contains(new SimpleGrantedAuthority("ADMIN"));
  }


}



