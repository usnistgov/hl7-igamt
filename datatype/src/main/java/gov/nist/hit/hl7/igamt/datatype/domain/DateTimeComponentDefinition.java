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

import gov.nist.hit.hl7.igamt.shared.domain.Usage;

/**
 * @author jungyubw
 *
 */
public class DateTimeComponentDefinition {

  private int position;
  private String name;
  private String description;
  private Usage usage;
  private DateTimePredicate dateTimePredicate;

  public DateTimeComponentDefinition(int position, String name, String description, Usage usage,
      DateTimePredicate dateTimePredicate) {
    super();
    this.position = position;
    this.name = name;
    this.description = description;
    this.usage = usage;
    this.dateTimePredicate = dateTimePredicate;
  }

  public int getPosition() {
    return position;
  }

  public void setPosition(int position) {
    this.position = position;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public Usage getUsage() {
    return usage;
  }

  public void setUsage(Usage usage) {
    this.usage = usage;
  }

  public DateTimePredicate getDateTimePredicate() {
    return dateTimePredicate;
  }

  public void setDateTimePredicate(DateTimePredicate dateTimePredicate) {
    this.dateTimePredicate = dateTimePredicate;
  }


}
