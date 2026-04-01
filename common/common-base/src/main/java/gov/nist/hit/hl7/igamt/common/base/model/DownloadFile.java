package gov.nist.hit.hl7.igamt.common.base.model;

import java.io.InputStream;

/**
 * Simple holder for downloadable file content.
 */
public class DownloadFile {
  private final String fileName;
  private final String contentType;
  private final InputStream stream;

  public DownloadFile(String fileName, String contentType, InputStream stream) {
    this.fileName = fileName;
    this.contentType = contentType;
    this.stream = stream;
  }

  public String getFileName() {
    return fileName;
  }

  public String getContentType() {
    return contentType;
  }

  public InputStream getStream() {
    return stream;
  }
}
