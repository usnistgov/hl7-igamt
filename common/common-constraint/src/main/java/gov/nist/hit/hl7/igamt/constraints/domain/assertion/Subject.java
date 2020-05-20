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
package gov.nist.hit.hl7.igamt.constraints.domain.assertion;

import gov.nist.diff.annotation.DeltaField;

// import gov.nist.healthcare.diff.utils.annotation.DeltaField;

/**
 * @author jungyubw
 *
 */
public class Subject {

  @DeltaField
  private Path path;
  @DeltaField
  private String occurenceType;
  @DeltaField
  private int occurenceValue;
  @DeltaField
  private String occurenceIdPath;
  @DeltaField
  private String occurenceLocationStr;

  public String getOccurenceType() {
    return occurenceType;
  }

  public void setOccurenceType(String occurenceType) {
    this.occurenceType = occurenceType;
  }

  public int getOccurenceValue() {
    return occurenceValue;
  }

  public void setOccurenceValue(int occurenceValue) {
    this.occurenceValue = occurenceValue;
  }

  public String getOccurenceIdPath() {
    return occurenceIdPath;
  }

  public void setOccurenceIdPath(String occurenceIdPath) {
    this.occurenceIdPath = occurenceIdPath;
  }

  public String getOccurenceLocationStr() {
    return occurenceLocationStr;
  }

  public void setOccurenceLocationStr(String occurenceLocationStr) {
    this.occurenceLocationStr = occurenceLocationStr;
  }



  public Subject() {
    super();
  }

  public Path getPath() {
    return path;
  }

  public void setPath(Path path) {
    this.path = path;
  }

  @Override
  public String toString() {
    return "Subject [path=" + path + "]";
  }



}
