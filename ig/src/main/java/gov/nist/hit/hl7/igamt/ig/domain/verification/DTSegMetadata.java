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
package gov.nist.hit.hl7.igamt.ig.domain.verification;

import gov.nist.hit.hl7.igamt.common.base.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;

/**
 * @author jungyubw
 *
 */
public class DTSegMetadata {

  private String name;
  private String extension;
  private String description;

  private DomainInfo domainInfo;

  /**
   * @param datatype
   */
  public DTSegMetadata(Datatype datatype) {
    this.name = datatype.getName();
    this.extension = datatype.getExt();
    this.description = datatype.getDescription();
    this.domainInfo = datatype.getDomainInfo();
  }

  /**
   * @param segment
   */
  public DTSegMetadata(Segment segment) {
    this.name = segment.getName();
    this.extension = segment.getExt();
    this.description = segment.getDescription();
    this.domainInfo = segment.getDomainInfo();
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getExtension() {
    return extension;
  }

  public void setExtension(String extension) {
    this.extension = extension;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public DomainInfo getDomainInfo() {
    return domainInfo;
  }

  public void setDomainInfo(DomainInfo domainInfo) {
    this.domainInfo = domainInfo;
  }


}
