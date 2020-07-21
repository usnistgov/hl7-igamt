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
package gov.nist.hit.hl7.igamt.auth.service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;

import gov.nist.hit.hl7.auth.util.requests.ChangePasswordConfirmRequest;
import gov.nist.hit.hl7.auth.util.requests.ConnectionResponseMessage;
import gov.nist.hit.hl7.auth.util.requests.LoginRequest;
import gov.nist.hit.hl7.auth.util.requests.PasswordResetTokenResponse;
import gov.nist.hit.hl7.auth.util.requests.RegistrationRequest;
import gov.nist.hit.hl7.auth.util.requests.UserListResponse;
import gov.nist.hit.hl7.auth.util.requests.UserResponse;
import gov.nist.hit.hl7.auth.util.requests.AccountLogRequest;
import gov.nist.hit.hl7.igamt.auth.exception.AuthenticationException;

/**
 * @author ena3
 *
 */
public interface AuthenticationService {
  public ConnectionResponseMessage<UserResponse> connect(HttpServletResponse response,
      LoginRequest user) throws AuthenticationException;

  public ConnectionResponseMessage<UserResponse> register(RegistrationRequest user)
      throws AuthenticationException;

  ConnectionResponseMessage<PasswordResetTokenResponse> requestPasswordChange(String email)
      throws AuthenticationException;

  boolean validateToken(String token) throws AuthenticationException;

  ConnectionResponseMessage<PasswordResetTokenResponse> confirmChangePassword(
      ChangePasswordConfirmRequest requestObject) throws AuthenticationException;

  public UserResponse getAuthentication(Authentication authentiction);
  
  public UserListResponse getAllUsers(HttpServletRequest req);
  public UserResponse getCurrentUser(String username, HttpServletRequest req);

  public ConnectionResponseMessage<UserResponse> update(RegistrationRequest user, HttpServletRequest req) throws AuthenticationException;

  public ConnectionResponseMessage<UserResponse> accountlog(AccountLogRequest user, HttpServletRequest req);
}
