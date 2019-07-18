package gov.nist.hit.hl7.igamt.ig.service;

import java.io.IOException;
import java.io.InputStream;

import org.springframework.http.ResponseEntity;

import gov.nist.hit.hl7.igamt.service.impl.exception.GVTExportException;
import gov.nist.hit.hl7.igamt.service.impl.exception.GVTLoginException;

/**
 * 
 * @author haffo
 *
 */

public interface GvtService {

  public ResponseEntity<?> send(InputStream io, String authorization, String url, String domain)
      throws GVTExportException, IOException;

  public boolean validCredentials(String authorization, String url) throws GVTLoginException;

  public ResponseEntity<?> getDomains(String authorization, String url) throws GVTLoginException;

  ResponseEntity<?> createDomain(String authorization, String url, String key, String name,
      String homeTitle) throws GVTExportException, IOException;


}
