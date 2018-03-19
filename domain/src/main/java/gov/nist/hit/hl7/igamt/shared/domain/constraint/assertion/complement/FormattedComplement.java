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
package gov.nist.hit.hl7.igamt.shared.domain.constraint.assertion.complement;

/**
 * @author jungyubw
 *
 */
public class FormattedComplement extends Complement {

  public enum FormatType {
    iso, positive, negative, numeric, alphanumeric, regrex
  }

  private FormatType type;
  private String regexPattern;

  public FormattedComplement() {
    this.complementKey = ComplementKey.FORMATTED;
  }

  public FormatType getType() {
    return type;
  }

  public void setType(FormatType type) {
    this.type = type;
  }

  public String getRegexPattern() {
    return regexPattern;
  }

  public void setRegexPattern(String regexPattern) {
    this.regexPattern = regexPattern;
  }


}
