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
package gov.nist.hit.hl7.igamt.datatypeLibrary.wrappers;

import gov.nist.hit.hl7.igamt.common.base.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.common.base.domain.DomainInfo;

/**
 * @author ena3
 *
 */
public class AddingInfo {
  public AddingInfo() {
    super();
    // TODO Auto-generated constructor stub
  }

  public AddingInfo(DomainInfo domainInfo, String name, String ext, String description,
      boolean flavor, CompositeKey id) {
    super();
    this.domainInfo = domainInfo;
    this.name = name;
    this.ext = ext;
    this.description = description;
    this.flavor = flavor;
    this.id = id;
  }

  public DomainInfo getDomainInfo() {
    return domainInfo;
  }

  public void setDomainInfo(DomainInfo domainInfo) {
    this.domainInfo = domainInfo;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getExt() {
    return ext;
  }

  public void setExt(String ext) {
    this.ext = ext;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public boolean isFlavor() {
    return flavor;
  }

  public void setFlavor(boolean flavor) {
    this.flavor = flavor;
  }

  public CompositeKey getId() {
    return id;
  }

  public void setId(CompositeKey id) {
    this.id = id;
  }

  private DomainInfo domainInfo;
  private String name;

  private String ext;
  private String description;
  private boolean flavor;
  private CompositeKey id;

}
