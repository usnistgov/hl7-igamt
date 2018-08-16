package gov.nist.hit.hl7.igamt.auth.service.impl;

import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.X509Certificate;

import javax.annotation.PostConstruct;
import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.TrustAllStrategy;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.ssl.SSLContextBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import gov.nist.hit.hl7.auth.util.requests.ChangePasswordConfirmRequest;
import gov.nist.hit.hl7.auth.util.requests.ChangePasswordRequest;
import gov.nist.hit.hl7.auth.util.requests.LoginRequest;
import gov.nist.hit.hl7.auth.util.requests.RegistrationRequest;
import gov.nist.hit.hl7.igamt.auth.exception.AuthenticationException;
import gov.nist.hit.hl7.igamt.auth.service.AuthenticationService;


@Service
public class AuthenticationServiceImpl implements AuthenticationService {

  @Autowired
  Environment env;

  private static final String AUTH_URL = "auth.url";
  private static final String AUTH_URL_VALIDATE_TOKEN = "auth.validatetoken";
  private static final String AUTH_URL_RESET_PASSWORD_CONFIRM = "auth.resetpasswordconfirm";


  RestTemplate restTemplate;

  static {
    disableSslVerification();
  }

  private static void disableSslVerification() {
    try {
      // Create a trust manager that does not validate certificate chains
      TrustManager[] trustAllCerts = new TrustManager[] {new X509TrustManager() {
        @Override
        public java.security.cert.X509Certificate[] getAcceptedIssuers() {
          return null;
        }

        @Override
        public void checkClientTrusted(X509Certificate[] certs, String authType) {}

        @Override
        public void checkServerTrusted(X509Certificate[] certs, String authType) {}
      }};

      // Install the all-trusting trust manager
      SSLContext sc = SSLContext.getInstance("SSL");
      sc.init(null, trustAllCerts, new java.security.SecureRandom());
      HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());

      // Create all-trusting host name verifier
      HostnameVerifier allHostsValid = new HostnameVerifier() {
        @Override
        public boolean verify(String hostname, SSLSession session) {
          return true;
        }
      };

      // Install the all-trusting host verifier
      HttpsURLConnection.setDefaultHostnameVerifier(allHostsValid);
    } catch (NoSuchAlgorithmException e) {
      e.printStackTrace();
    } catch (KeyManagementException e) {
      e.printStackTrace();
    }
  }

  @PostConstruct
  @SuppressWarnings("deprecation")
  public void init() {
    try {
      SSLContextBuilder builder = new SSLContextBuilder();
      builder.loadTrustMaterial(null, new TrustAllStrategy());
      SSLConnectionSocketFactory socketFactory = new SSLConnectionSocketFactory(builder.build(),
          SSLConnectionSocketFactory.ALLOW_ALL_HOSTNAME_VERIFIER);
      CloseableHttpClient httpClient = HttpClients.custom().setSSLSocketFactory(socketFactory)
          .setHostnameVerifier(SSLConnectionSocketFactory.ALLOW_ALL_HOSTNAME_VERIFIER).build();
      HttpComponentsClientHttpRequestFactory fct =
          new HttpComponentsClientHttpRequestFactory(httpClient);
      this.restTemplate = new RestTemplate(fct);
    } catch (KeyManagementException | NoSuchAlgorithmException | KeyStoreException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
    }
  }


  @Override
  public String connect(LoginRequest user) throws AuthenticationException {
    try {
      HttpHeaders headers = new HttpHeaders();
      headers.add("Content-type", "application/json");
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
      String message = e.getResponseBodyAsString();

      throw new AuthenticationException(message);
    } catch (Exception e) {
      e.printStackTrace();
      throw new AuthenticationException(e.getMessage());
    }
  }

  @Override
  public void register(RegistrationRequest user) throws AuthenticationException {

    try {
      HttpHeaders headers = new HttpHeaders();
      headers.add("Content-type", "application/json");
      RestTemplate restTemplate = new RestTemplate();
      HttpEntity<RegistrationRequest> request = new HttpEntity<>(user);


      ResponseEntity<RegistrationRequest> response =
          restTemplate.exchange(env.getProperty(AUTH_URL) + "register", HttpMethod.POST, request,
              RegistrationRequest.class);
    } catch (HttpClientErrorException e) {
      String message = e.getResponseBodyAsString();

      throw new AuthenticationException(message);
    } catch (Exception e) {
      e.printStackTrace();
      throw new AuthenticationException(e.getMessage());
    }
  }


  @Override
  public void requestPasswordChange(String email, String url) throws AuthenticationException {
    // TODO Auto-generated method stub
    try {
      HttpHeaders headers = new HttpHeaders();
      headers.add("Content-type", "application/json");
      RestTemplate restTemplate = new RestTemplate();
      ChangePasswordRequest changePasswordRequest = new ChangePasswordRequest();
      changePasswordRequest.setEmail(email);
      changePasswordRequest.setUrl(url);
      HttpEntity<ChangePasswordRequest> request =
          new HttpEntity<ChangePasswordRequest>(changePasswordRequest);
      ResponseEntity<ChangePasswordRequest> response =
          restTemplate.exchange(env.getProperty(AUTH_URL) + "password/reset", HttpMethod.POST,
              request, ChangePasswordRequest.class);
    } catch (HttpClientErrorException e) {
      String message = e.getResponseBodyAsString();

      throw new AuthenticationException(message);
    } catch (Exception e) {
      e.printStackTrace();
      throw new AuthenticationException(e.getMessage());
    }
  }

  @Override
  public boolean validateToken(String token) throws AuthenticationException {
    // TODO Auto-generated method stub
    try {
      HttpHeaders headers = new HttpHeaders();
      headers.add("Content-type", "application/json");
      RestTemplate restTemplate = new RestTemplate();

      HttpEntity<String> request = new HttpEntity<String>(token);
      ResponseEntity<Boolean> response =
          restTemplate.exchange(env.getProperty(AUTH_URL) + "password/validatetoken",
              HttpMethod.POST, request, Boolean.class);
      return response.getBody();
    } catch (HttpClientErrorException e) {
      String message = e.getResponseBodyAsString();

      throw new AuthenticationException(message);
    } catch (Exception e) {
      e.printStackTrace();
      throw new AuthenticationException(e.getMessage());
    }
  }

  @Override
  public boolean confirmChangePassword(ChangePasswordConfirmRequest requestObject)
      throws AuthenticationException {
    // TODO Auto-generated method stub
    try {
      HttpHeaders headers = new HttpHeaders();
      headers.add("Content-type", "application/json");
      RestTemplate restTemplate = new RestTemplate();
      HttpEntity<ChangePasswordConfirmRequest> request =
          new HttpEntity<ChangePasswordConfirmRequest>(requestObject);
      ResponseEntity<Boolean> response =
          restTemplate.exchange(env.getProperty(AUTH_URL) + "password/reset/confirm",
              HttpMethod.POST, request, Boolean.class);
      return response.getBody();

    } catch (HttpClientErrorException e) {
      String message = e.getResponseBodyAsString();
      throw new AuthenticationException(message);
    } catch (Exception e) {
      e.printStackTrace();
      throw new AuthenticationException(e.getMessage());
    }
  }

}
