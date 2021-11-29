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
package gov.nist.hit.hl7.igamt.datatype.domain;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * @author jungyubw
 *
 */
public class DateTimeConstraints  implements Serializable {
  /**
   * 
   */
  private static final long serialVersionUID = -3513484929589802482L;
  private List<DateTimeComponentDefinition> dateTimeComponentDefinitions = new ArrayList<DateTimeComponentDefinition>();
  private String errorMessage;
  private String simplePattern;
  private String regex;
  
  
  public DateTimeConstraints() {
    super();
  }

  public DateTimeConstraints(List<DateTimeComponentDefinition> dateTimeComponentDefinitions) {
    super();
    this.dateTimeComponentDefinitions = dateTimeComponentDefinitions;
  }

  public List<DateTimeComponentDefinition> getDateTimeComponentDefinitions() {
    return dateTimeComponentDefinitions;
  }

  public void setDateTimeComponentDefinitions(List<DateTimeComponentDefinition> dateTimeComponentDefinitions) {
    this.dateTimeComponentDefinitions = dateTimeComponentDefinitions;
  }

  public String getErrorMessage() {
    return errorMessage;
  }

  public void setErrorMessage(String errorMessage) {
    this.errorMessage = errorMessage;
  }

  public String getSimplePattern() {
    return simplePattern;
  }

  public void setSimplePattern(String simplePattern) {
    this.simplePattern = simplePattern;
  }

  public String getRegex() {
    return regex;
  }

  public void setRegex(String regex) {
    this.regex = regex;
  }
  
  
  
  
}
