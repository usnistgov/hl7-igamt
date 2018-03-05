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
package gov.nist.hit.hl7.igamt.valueset.domain;

/**
 * @author jungyubw
 *
 */
public class CodeRef {

  private String codeId;
  private String codeSystemId;
  private int position;
  private CodeUsage usage;

  public CodeRef(String codeId, String codeSystemId, int position, CodeUsage usage) {
    super();
    this.codeId = codeId;
    this.codeSystemId = codeSystemId;
    this.position = position;
    this.usage = usage;
  }

  public CodeRef() {
    // TODO Auto-generated constructor stub
  }

  public String getCodeId() {
    return codeId;
  }

  public void setCodeId(String codeId) {
    this.codeId = codeId;
  }

  public String getCodeSystemId() {
    return codeSystemId;
  }

  public void setCodeSystemId(String codeSystemId) {
    this.codeSystemId = codeSystemId;
  }

  public int getPosition() {
    return position;
  }

  public void setPosition(int position) {
    this.position = position;
  }

  public CodeUsage getUsage() {
    return usage;
  }

  public void setUsage(CodeUsage usage) {
    this.usage = usage;
  }


}
