package gov.nist.hit.hl7.igamt.service.impl;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.TrustStrategy;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import gov.nist.hit.hl7.igamt.ig.service.GVTService;
import gov.nist.hit.hl7.igamt.service.impl.exception.GVTExportException;
import gov.nist.hit.hl7.igamt.service.impl.exception.GVTLoginException;


@Service
public class GVTServiceImpl implements GVTService {

  @Autowired
  private Environment env;

  private RestTemplate restTemplate;
  
  private static final String EXPORT_ENDPOINT = "gvt.export-endpoint";
  private static final String CREATE_DOMAN_ENDPOINT = "gvt.create-domain-endpoint";
  private static final String LOGIN_ENDPOINT = "gvt.login-endpoint";
  private static final String DOMAINS_ENDPOINT = "gvt.domain-endpoint";

  @PostConstruct
  @SuppressWarnings("deprecation")
  public void init() {
//    try {
//      SSLContextBuilder builder = new SSLContextBuilder();
//      builder.loadTrustMaterial(null, new TrustAllStrategy());
//      SSLConnectionSocketFactory socketFactory = new SSLConnectionSocketFactory(builder.build(), SSLConnectionSocketFactory.ALLOW_ALL_HOSTNAME_VERIFIER);
//      CloseableHttpClient httpClient = HttpClients.custom().setSSLSocketFactory(socketFactory).setHostnameVerifier(SSLConnectionSocketFactory.ALLOW_ALL_HOSTNAME_VERIFIER).build();
//      HttpComponentsClientHttpRequestFactory fct =
//          new HttpComponentsClientHttpRequestFactory(httpClient);
//      this.restTemplate = new RestTemplate(fct);
//    } catch (KeyManagementException | NoSuchAlgorithmException | KeyStoreException e) {
//      // TODO Auto-generated catch block
//      e.printStackTrace();
//    }
  }

//  public class TrustAllStrategy implements TrustStrategy {
//    @Override
//    public boolean isTrusted(X509Certificate[] chain, String authType) throws CertificateException {
//      return true;
//    }
//  }


  public GVTServiceImpl() {
    super();
  }


  @Override
  public ResponseEntity<?> send(InputStream io, String authorization, String url, String domain)
      throws GVTExportException, IOException {
    LinkedMultiValueMap<String, Object> parts = new LinkedMultiValueMap<>();
    File oFile = toFile(io);
    parts.add("file", new FileSystemResource(oFile));
    parts.add("domain", domain);
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.MULTIPART_FORM_DATA);
    headers.add("Authorization", "Basic " + authorization);
    HttpEntity<LinkedMultiValueMap<String, Object>> requestEntity =
        new HttpEntity<LinkedMultiValueMap<String, Object>>(parts, headers);
    ResponseEntity<?> response =
        restTemplate.exchange(url + env.getProperty(EXPORT_ENDPOINT)   , HttpMethod.POST, requestEntity, Map.class);
    return response;
  }

  @Override
  public ResponseEntity<?> createDomain(String authorization, String url, String key, String name,
      String homeTitle) throws GVTExportException, IOException {
    MultiValueMap<String, String> params = new LinkedMultiValueMap<String, String>();
    params.add("key", key);
    params.add("name", name);
    params.add("homeTitle", homeTitle);
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
    headers.add("Authorization", "Basic " + authorization);
    HttpEntity<MultiValueMap<String, String>> request =
        new HttpEntity<MultiValueMap<String, String>>(params, headers);
    ResponseEntity<?> response =
        restTemplate.postForEntity(url + env.getProperty(CREATE_DOMAN_ENDPOINT), request, Map.class);
    return response;
  }


  public File toFile(InputStream io) {
    OutputStream outputStream = null;
    File f = null;
    try {
      // write the inputStream to a FileOutputStream
      f = File.createTempFile("IGAMT", ".zip");
      outputStream = new FileOutputStream(f);
      int read = 0;
      byte[] bytes = new byte[1024];
      while ((read = io.read(bytes)) != -1) {
        outputStream.write(bytes, 0, read);
      }
    } catch (IOException e) {
      e.printStackTrace();
    } finally {
      if (io != null) {
        try {
          io.close();
        } catch (IOException e) {
          e.printStackTrace();
        }
      }
      if (outputStream != null) {
        try {
          // outputStream.flush();
          outputStream.close();
        } catch (IOException e) {
          e.printStackTrace();
        }

      }
    }
    return f;
  }

  @Override
  public boolean validCredentials(String authorization, String url) throws GVTLoginException {
    try {
      HttpHeaders headers = new HttpHeaders();
      headers.add("Authorization", authorization);
      HttpEntity<String> entity = new HttpEntity<String>("", headers);
      ResponseEntity<String> response =
          restTemplate.exchange(url + env.getProperty(LOGIN_ENDPOINT), HttpMethod.GET, entity, String.class);
      if (response.getStatusCode() == HttpStatus.OK) {
        return true;
      }
      throw new GVTLoginException(response.getBody());
    } catch (HttpClientErrorException e) {
      throw new GVTLoginException(e.getMessage());
    } catch (Exception e) {
      throw new GVTLoginException(e.getMessage());
    }
  }

  public ResponseEntity<?> getDomains(String authorization, String url) throws GVTLoginException {
    try {
      HttpHeaders headers = new HttpHeaders();
      headers.add("Authorization", authorization);
      HttpEntity<String> entity = new HttpEntity<String>("", headers);
      ResponseEntity<List> response =
          restTemplate.exchange(url + env.getProperty(DOMAINS_ENDPOINT), HttpMethod.GET, entity, List.class);
      return response;
    } catch (HttpClientErrorException e) {
      throw new GVTLoginException(e.getMessage());
    } catch (Exception e) {
      throw new GVTLoginException(e.getMessage());
    }
  }


}
