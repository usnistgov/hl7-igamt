package gov.nist.hit.hl7.igamt.auth.controller;


import java.io.IOException;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import gov.nist.hit.hl7.auth.util.requests.ChangePasswordConfirmRequest;
import gov.nist.hit.hl7.auth.util.requests.LoginRequest;
import gov.nist.hit.hl7.auth.util.requests.RegistrationRequest;
import gov.nist.hit.hl7.igamt.auth.exception.AuthenticationException;
import gov.nist.hit.hl7.igamt.auth.service.AuthenticationService;

@RestController
public class AuthenticationController {

  @Autowired
  AuthenticationService authService;


  @RequestMapping(value = "/api/login", method = RequestMethod.POST)
  public UserResponse login(@RequestBody LoginRequest user, HttpServletResponse response)
      throws AuthenticationException, IOException {


    UserResponse userResponse = new UserResponse();
    userResponse.setUsername(user.getUsername());
    try {
      String token = authService.connect(user);
      HttpHeaders headers = new HttpHeaders();
      headers.add(HttpHeaders.CONTENT_TYPE, "application/json; charset=UTF-8");
      headers.add("Authorization", token);

      Cookie authCookie = new Cookie("authCookie", token);
      authCookie.setPath("/api");
      authCookie.setMaxAge(1111111111);
      authCookie.setHttpOnly(true);
      response.setContentType("application/json");
      response.addCookie(authCookie);
    } catch (AuthenticationException e) {
      response.sendError(403);
    }
    return userResponse;


  }



  @RequestMapping(value = "/api/register", method = RequestMethod.POST)
  public ResponseEntity register(@RequestBody RegistrationRequest user)
      throws AuthenticationException {
    try {
      authService.register(user);
      HttpHeaders headers = new HttpHeaders();
      headers.add(HttpHeaders.CONTENT_TYPE, "application/json; charset=UTF-8");
      ResponseEntity<String> response =
          ResponseEntity.ok().headers(headers).body(user.getUsername());
      return response;

    } catch (AuthenticationException e) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());

    }
  }



  @RequestMapping(value = "api/logout", method = RequestMethod.GET)
  @ResponseBody
  public void logout(HttpServletRequest req, HttpServletResponse res,
      Authentication authentication) {
    Cookie authCookie = new Cookie("authCookie", "");
    authCookie.setPath("/api");
    authCookie.setMaxAge(0);
    authCookie.setHttpOnly(true);
    res.addCookie(authCookie);

  }


  @RequestMapping(value = "api/authentication", method = RequestMethod.GET)
  @ResponseBody
  public UserResponse getCurrentUser(HttpServletResponse res) throws IOException {
    UserResponse response = new UserResponse();

    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null && !(authentication instanceof AnonymousAuthenticationToken)) {
      response.setUsername(authentication.getName());
      return response;
    } else {
      response.setUsername("Guest");
      res.sendError(500);
      return response;
    }

  }

  @RequestMapping(value = "api/password/reset", method = RequestMethod.POST)
  @ResponseBody
  public void resetPaswordRequest(HttpServletRequest req, HttpServletResponse res,
      @RequestBody String email) throws AuthenticationException {
    getUrl(req);

    authService.requestPasswordChange(email, getUrl(req));

  }

  @RequestMapping(value = "api/password/validatetoken", method = RequestMethod.POST)
  @ResponseBody
  public void validateToken(HttpServletRequest req, HttpServletResponse res,
      @RequestBody String token) throws AuthenticationException {
    authService.validateToken(token);

  }


  @RequestMapping(value = "api/password/reset/confirm", method = RequestMethod.POST)
  @ResponseBody
  public void confirmPasswordReset(HttpServletRequest req, HttpServletResponse res,
      @RequestBody ChangePasswordConfirmRequest requestObject) throws AuthenticationException {
    authService.confirmChangePassword(requestObject);

  }


  private String getUrl(HttpServletRequest request) {
    String scheme = request.getScheme();
    String host = request.getHeader("Host");
    return scheme + "://" + host + "/#/reset-password-confirm";
  }


}
