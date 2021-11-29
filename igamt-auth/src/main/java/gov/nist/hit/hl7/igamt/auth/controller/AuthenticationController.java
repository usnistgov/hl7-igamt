package gov.nist.hit.hl7.igamt.auth.controller;


import java.io.IOException;
import java.util.Date;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import gov.nist.hit.hl7.auth.util.requests.AdminUserRequest;
import gov.nist.hit.hl7.auth.util.requests.ChangePasswordConfirmRequest;
import gov.nist.hit.hl7.auth.util.requests.ConnectionResponseMessage;
import gov.nist.hit.hl7.auth.util.requests.ConnectionResponseMessage.Status;
import gov.nist.hit.hl7.auth.util.requests.LoginRequest;
import gov.nist.hit.hl7.auth.util.requests.PasswordResetTokenResponse;
import gov.nist.hit.hl7.auth.util.requests.RegistrationRequest;
import gov.nist.hit.hl7.auth.util.requests.UserListResponse;
import gov.nist.hit.hl7.auth.util.requests.UserResponse;
import gov.nist.hit.hl7.auth.util.service.AuthenticationConverterService;
import gov.nist.hit.hl7.igamt.auth.emails.service.AccountManagmenEmailService;
import gov.nist.hit.hl7.igamt.auth.exception.AuthenticationException;
import gov.nist.hit.hl7.igamt.auth.service.AuthenticationService;

@RestController
public class AuthenticationController {

  @Autowired
  AuthenticationService authService;

  @Autowired
  AuthenticationConverterService auth;

  @Autowired
  AccountManagmenEmailService emailService;


  @RequestMapping(value = "/api/login", method = RequestMethod.POST)
  public ConnectionResponseMessage<UserResponse> login(@RequestBody LoginRequest user,
      HttpServletResponse response) throws AuthenticationException, IOException {

    try {

      ConnectionResponseMessage<UserResponse> resp = authService.connect(response, user);
      return resp;

    } catch (AuthenticationException e) {
      throw e;
    } catch (Exception e) {
      throw e;
    }
  }

  @RequestMapping(value = "/api/register", method = RequestMethod.POST)
  public ConnectionResponseMessage<UserResponse> register(@RequestBody RegistrationRequest user)
      throws AuthenticationException {
    try {

      ConnectionResponseMessage<UserResponse> response = authService.register(user);
      emailService.sendResgistrationEmail(user.getFullName(), user.getUsername(), user.getEmail());
      return response;

    } catch (AuthenticationException e) {
      throw e;
    } catch (Exception e) {
      throw e;
    }
  }

  @RequestMapping(value = "api/logout", method = RequestMethod.GET)
  @ResponseBody
  public void logout(HttpServletRequest req, HttpServletResponse res,
      Authentication authentication) {
    Cookie authCookie = new Cookie("authCookie", "");
    authCookie.setPath("/api");
    authCookie.setMaxAge(0);
    res.addCookie(authCookie);

  }

  @RequestMapping(value = "api/authentication", method = RequestMethod.GET)
  @ResponseBody
  public UserResponse getCurrentUser(HttpServletResponse res, Authentication authentication)
      throws IOException {

    return auth.getAuthentication(authentication);
  }
  
  @RequestMapping(value = "api/users", method = RequestMethod.GET)
  @ResponseBody
  public UserListResponse getAllUserList(HttpServletRequest req,
          HttpServletResponse res, Authentication authentication)
      throws IOException {

    return authService.getAllUsers(req);
  }

  @RequestMapping(value = "api/user/{username}", method = RequestMethod.GET)
  @ResponseBody
  public UserResponse getCurrentUser(@PathVariable("username") String username,
          HttpServletRequest req, HttpServletResponse res,
          Authentication authentication)
      throws IOException {

    return authService.getCurrentUser(username, req);
  }
  
  @RequestMapping(value = "api/adminUpdate", method = RequestMethod.POST)
  public ConnectionResponseMessage<UserResponse> updatePendingAdmin(@RequestBody AdminUserRequest requestPara, HttpServletRequest req)
      throws AuthenticationException {
    try {
      return authService.updatePendingAdmin(requestPara, req);
    } catch (AuthenticationException e) {
      throw e;
    } catch (Exception e) {
      throw e;
    }
  }
  
  @RequestMapping(value = "/api/user", method = RequestMethod.POST)
  public ConnectionResponseMessage<UserResponse> update(@RequestBody RegistrationRequest user, HttpServletRequest req)
      throws AuthenticationException {
    try {

      ConnectionResponseMessage<UserResponse> response = authService.update(user, req);
      return response;

    } catch (AuthenticationException e) {
      throw e;
    } catch (Exception e) {
      throw e;
    }
  }

  @RequestMapping(value = "api/password/reset", method = RequestMethod.POST)
  @ResponseBody
  public ConnectionResponseMessage<PasswordResetTokenResponse> resetPaswordRequest(
      HttpServletRequest req, HttpServletResponse res, @RequestBody String username)
      throws AuthenticationException {
    try {

      ConnectionResponseMessage<PasswordResetTokenResponse> response =
          authService.requestPasswordChange(username);
      if (response.getData() instanceof PasswordResetTokenResponse) {
        PasswordResetTokenResponse responseData = (PasswordResetTokenResponse) (response.getData());
        emailService.sendResetTokenUrl(responseData.getFullName(), responseData.getUsername(),
            responseData.getEmail(), getUrl(req, responseData.getToken()));
        return response;
      } else {
        throw new AuthenticationException("Invalid Data format");
      }

    } catch (AuthenticationException e) {
      throw e;
    }

  }

  @RequestMapping(value = "api/password/validatetoken", method = RequestMethod.POST)
  @ResponseBody
  public ConnectionResponseMessage<Boolean> validateToken(HttpServletRequest req, HttpServletResponse res,
      @RequestBody String token) throws AuthenticationException {
	   return new  ConnectionResponseMessage<Boolean>(Status.SUCCESS, null, "token is Valid", null, false, new Date(), authService.validateToken(token));
  }

  @RequestMapping(value = "api/password/reset/confirm", method = RequestMethod.POST)
  @ResponseBody
  public ConnectionResponseMessage<PasswordResetTokenResponse> confirmPasswordReset(
      HttpServletRequest req, HttpServletResponse res,
      @RequestBody ChangePasswordConfirmRequest requestObject) throws AuthenticationException {
    try {
      ConnectionResponseMessage<PasswordResetTokenResponse> response =
          authService.confirmChangePassword(requestObject);

      if (response.getData() instanceof PasswordResetTokenResponse) {
        PasswordResetTokenResponse responseData = (PasswordResetTokenResponse) (response.getData());
        emailService.sendRestPasswordSuccess(responseData.getFullName(), responseData.getUsername(),
            responseData.getEmail());
        return response;
      } else {
        throw new AuthenticationException("Invalid Data format");
      }
    } catch (AuthenticationException e) {
      throw e;
    }

  }


  private String getUrl(HttpServletRequest request, String token) {
    String scheme = request.getScheme();
    String host = request.getHeader("Host");
    return scheme +"://" + host + "/igamt"  + "/reset-password-confirm/" + token;
  }



}
