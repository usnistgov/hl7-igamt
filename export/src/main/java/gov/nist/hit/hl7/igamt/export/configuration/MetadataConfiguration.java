/**
 * 
 * This software was developed at the National Institute of Standards and Technology by employees of
 * the Federal Government in the course of their official duties. Pursuant to title 17 Section 105
 * of the United States Code this software is not subject to copyright protection and is in the
 * public domain. This is an experimental system. NIST assumes no responsibility whatsoever for its
 * use by other parties, and makes no guarantees, expressed or implied, about its quality,
 * reliability, or any other characteristic. We would appreciate acknowledgement if the software is
 * used. This software can be redistributed and/or modified freely provided that any derivative
 * works bear some notice that they are derived from it, and any modified versions bear some notice
 * that they have been modified.
 * 
 */
package gov.nist.hit.hl7.igamt.export.configuration;

/**
 *
 * @author Maxence Lefort on Mar 13, 2018.
 */
public class MetadataConfiguration {

  private boolean hl7version = false;
  private boolean publicationDate = false;
  private boolean publicationVersion = false;
  private boolean scope = false;

  public MetadataConfiguration() {
    super();
  }

  public MetadataConfiguration(boolean hl7version, boolean publicationDate,
      boolean publicationVersion, boolean scope) {
    super();
    this.hl7version = hl7version;
    this.publicationDate = publicationDate;
    this.publicationVersion = publicationVersion;
    this.scope = scope;
  }

  public boolean isHl7version() {
    return hl7version;
  }

  public void setHl7version(boolean hl7version) {
    this.hl7version = hl7version;
  }

  public boolean isPublicationDate() {
    return publicationDate;
  }

  public void setPublicationDate(boolean publicationDate) {
    this.publicationDate = publicationDate;
  }

  public boolean isPublicationVersion() {
    return publicationVersion;
  }

  public void setPublicationVersion(boolean publicationVersion) {
    this.publicationVersion = publicationVersion;
  }

  public boolean isScope() {
    return scope;
  }

  public void setScope(boolean scope) {
    this.scope = scope;
  }
  
}
