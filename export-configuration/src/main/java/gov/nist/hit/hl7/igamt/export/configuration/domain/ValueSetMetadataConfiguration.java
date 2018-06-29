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
package gov.nist.hit.hl7.igamt.export.configuration.domain;

/**
 *
 * @author Maxence Lefort on Mar 13, 2018.
 */
public class ValueSetMetadataConfiguration {

  private boolean stability = true;
  private boolean extensibility = true;
  private boolean contentDefinition = true;
  private boolean oid = true;
  private boolean type = true;

  public ValueSetMetadataConfiguration() {
    super();
  }

  public ValueSetMetadataConfiguration(boolean stability, boolean extensibility,
      boolean contentDefinition, boolean oid, boolean type) {
    super();
    this.stability = stability;
    this.extensibility = extensibility;
    this.contentDefinition = contentDefinition;
    this.oid = oid;
    this.type = type;
  }

  public boolean isStability() {
    return stability;
  }

  public void setStability(boolean stability) {
    this.stability = stability;
  }

  public boolean isExtensibility() {
    return extensibility;
  }

  public void setExtensibility(boolean extensibility) {
    this.extensibility = extensibility;
  }

  public boolean isContentDefinition() {
    return contentDefinition;
  }

  public void setContentDefinition(boolean contentDefinition) {
    this.contentDefinition = contentDefinition;
  }

  public boolean isOid() {
    return oid;
  }

  public void setOid(boolean oid) {
    this.oid = oid;
  }

  public boolean isType() {
    return type;
  }

  public void setType(boolean type) {
    this.type = type;
  }



}
