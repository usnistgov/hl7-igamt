package gov.nist.hit.hl7.igamt.auth.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import gov.nist.hit.hl7.auth.util.requests.LoginRequest;
import gov.nist.hit.hl7.auth.util.requests.RegistrationRequest;

@Service
public class AuthenticationService {

  @Autowired
  Environment env;

  private static final String AUTH_URL = "auth.url";

  public String connect(LoginRequest user) throws AuthenticationException {
    try {
      HttpHeaders headers = new HttpHeaders();
      headers.add("Content-type", "application/json");
      RestTemplate restTemplate = new RestTemplate();
      HttpEntity<LoginRequest> request = new HttpEntity<>(user);
      System.out.println(env.getProperty(AUTH_URL));
      ResponseEntity<LoginRequest> response = restTemplate.exchange(
          env.getProperty(AUTH_URL) + "/api/login", HttpMethod.POST, request, LoginRequest.class);
      if (response.getStatusCode() == HttpStatus.OK) {
        if (response.getHeaders().containsKey("Authorization")) {
          return response.getHeaders().get("Authorization").get(0);
        } else {
          throw new AuthenticationException("Token is missing");
        }
      } else {
        throw new AuthenticationException("Unautorized");
      }
    } catch (HttpClientErrorException e) {

      throw new AuthenticationException(e.getMessage());
    } catch (Exception e) {
      e.printStackTrace();
      throw new AuthenticationException(e.getMessage());
    }
  }

  public void register(RegistrationRequest user) throws AuthenticationException {

    try {
      HttpHeaders headers = new HttpHeaders();
      headers.add("Content-type", "application/json");
      RestTemplate restTemplate = new RestTemplate();
      HttpEntity<RegistrationRequest> request = new HttpEntity<>(user);


      ResponseEntity<RegistrationRequest> response =
          restTemplate.exchange(env.getProperty(AUTH_URL) + "/register/", HttpMethod.POST, request,
              RegistrationRequest.class);
    } catch (HttpClientErrorException e) {

      throw new AuthenticationException(e.getMessage());
    } catch (Exception e) {
      e.printStackTrace();
      throw new AuthenticationException(e.getMessage());
    }
  }

}
