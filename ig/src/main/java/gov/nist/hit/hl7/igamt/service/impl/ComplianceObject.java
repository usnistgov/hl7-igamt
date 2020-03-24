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
package gov.nist.hit.hl7.igamt.service.impl;

import gov.nist.hit.hl7.igamt.common.base.domain.Usage;

/**
 * @author jungyubw
 *
 */
public class ComplianceObject {
  private String positionPath;
  private String path;
  private Usage usage;
  private Integer min;
  private String max;
  private String minLength;
  private String maxLength;
  
  public ComplianceObject() {
    super();
  }
  
  public ComplianceObject(String positionPath, String path, Usage usage, Integer min, String max, String minLength, String maxLength) {
    super();
    this.positionPath = positionPath;
    this.path = path;
    this.usage = usage;
    this.min = min;
    this.max = max;
    this.minLength = minLength;
    this.maxLength = maxLength;
  }
  
  public String getPositionPath() {
    return positionPath;
  }
  public void setPositionPath(String positionPath) {
    this.positionPath = positionPath;
  }
  public String getPath() {
    return path;
  }
  public void setPath(String path) {
    this.path = path;
  }
  public Usage getUsage() {
    return usage;
  }
  public void setUsage(Usage usage) {
    this.usage = usage;
  }
  public Integer getMin() {
    return min;
  }
  public void setMin(Integer min) {
    this.min = min;
  }
  public String getMax() {
    return max;
  }
  public void setMax(String max) {
    this.max = max;
  }

  public String getMinLength() {
    return minLength;
  }

  public void setMinLength(String minLength) {
    this.minLength = minLength;
  }

  public String getMaxLength() {
    return maxLength;
  }

  public void setMaxLength(String maxLength) {
    this.maxLength = maxLength;
  }
  
  
}
