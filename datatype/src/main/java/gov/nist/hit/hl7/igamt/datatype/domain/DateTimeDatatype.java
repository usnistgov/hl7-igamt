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

import java.util.ArrayList;

import gov.nist.hit.hl7.igamt.common.base.domain.Usage;



/**
 * @author jungyubw
 *
 */
public class DateTimeDatatype extends PrimitiveDatatype {

  private static final long serialVersionUID = 1L;
  private DateTimeConstraints dateTimeConstraints;
  private Boolean allowEmpty = false;
  public DateTimeDatatype() {
    super();
  }

  public DateTimeConstraints getDateTimeConstraints() {
    if(this.dateTimeConstraints == null || this.dateTimeConstraints.getDateTimeComponentDefinitions() == null) {
      this.dateTimeConstraints = new DateTimeConstraints();
      if (this.getName().equals("DTM")) {
        this.dateTimeConstraints.setDateTimeComponentDefinitions(new ArrayList<DateTimeComponentDefinition>());
        this.dateTimeConstraints.getDateTimeComponentDefinitions().add(new DateTimeComponentDefinition(1, "Year", "YYYY", Usage.R));
        this.dateTimeConstraints.getDateTimeComponentDefinitions().add(new DateTimeComponentDefinition(2, "Month", "MM", Usage.O));
        this.dateTimeConstraints.getDateTimeComponentDefinitions().add(new DateTimeComponentDefinition(3, "Day", "DD", Usage.O));
        this.dateTimeConstraints.getDateTimeComponentDefinitions().add(new DateTimeComponentDefinition(4, "Hour", "HH", Usage.O));
        this.dateTimeConstraints.getDateTimeComponentDefinitions().add(new DateTimeComponentDefinition(5, "Minute", "MM", Usage.O));
        this.dateTimeConstraints.getDateTimeComponentDefinitions().add(new DateTimeComponentDefinition(6, "Second", "SS", Usage.O));
        this.dateTimeConstraints.getDateTimeComponentDefinitions().add(new DateTimeComponentDefinition(7, "1/10 second", "S...", Usage.O));
        this.dateTimeConstraints.getDateTimeComponentDefinitions().add(new DateTimeComponentDefinition(8, "1/100 second", ".S..", Usage.O));
        this.dateTimeConstraints.getDateTimeComponentDefinitions().add(new DateTimeComponentDefinition(9, "1/1000 second", "..S.", Usage.O));
        this.dateTimeConstraints.getDateTimeComponentDefinitions().add(new DateTimeComponentDefinition(10, "1/10000 second", "...S", Usage.O));
        this.dateTimeConstraints.getDateTimeComponentDefinitions().add(new DateTimeComponentDefinition(11, "Time Zone", "+/-ZZZZ", Usage.O));

        if(this.allowEmpty){
          this.dateTimeConstraints.setErrorMessage("The value SHALL follow the Date/Time pattern 'YYYY[MM[DD[HH[MM[SS[.S[S[S[S]]]]]]]]][+/-ZZZZ]' or 0000.");
          this.dateTimeConstraints.setRegex("^(\\d{4}|\\d{6}|\\d{8}|\\d{10}|\\d{12}|\\d{14}|\\d{14}\\.\\d|\\d{14}\\.\\d{2}|\\d{14}\\.\\d{3}|\\d{14}\\.\\d{4})([+-]\\d{4})?|0000$");
        }else{
          this.dateTimeConstraints.setErrorMessage("The value SHALL follow the Date/Time pattern 'YYYY[MM[DD[HH[MM[SS[.S[S[S[S]]]]]]]]][+/-ZZZZ]'.");
          this.dateTimeConstraints.setRegex("^(\\d{4}|\\d{6}|\\d{8}|\\d{10}|\\d{12}|\\d{14}|\\d{14}\\.\\d|\\d{14}\\.\\d{2}|\\d{14}\\.\\d{3}|\\d{14}\\.\\d{4})([+-]\\d{4})?$");
        }
      } else if (this.getName().equals("DT")) {
        this.dateTimeConstraints.setDateTimeComponentDefinitions(new ArrayList<DateTimeComponentDefinition>());
        this.dateTimeConstraints.getDateTimeComponentDefinitions().add(new DateTimeComponentDefinition(1, "Year", "YYYY", Usage.R));
        this.dateTimeConstraints.getDateTimeComponentDefinitions().add(new DateTimeComponentDefinition(2, "Month", "MM", Usage.O));
        this.dateTimeConstraints.getDateTimeComponentDefinitions().add(new DateTimeComponentDefinition(3, "Day", "DD", Usage.O));
        if(this.allowEmpty){
          this.dateTimeConstraints.setErrorMessage("The value SHALL follow the Date/Time pattern 'YYYY[MM[DD]]'or 0000.");
          this.dateTimeConstraints.setRegex("^(\\d{4}|\\d{6}|\\d{8})|0000$");
        }else{
          this.dateTimeConstraints.setErrorMessage("The value SHALL follow the Date/Time pattern 'YYYY[MM[DD]]'.");
          this.dateTimeConstraints.setRegex("^(\\d{4}|\\d{6}|\\d{8})$");
        }

      }  else if (this.getName().equals("TM")) {
        this.dateTimeConstraints.setDateTimeComponentDefinitions(new ArrayList<DateTimeComponentDefinition>());
        this.dateTimeConstraints.getDateTimeComponentDefinitions().add(new DateTimeComponentDefinition(4, "Hour", "HH", Usage.R));
        this.dateTimeConstraints.getDateTimeComponentDefinitions().add(new DateTimeComponentDefinition(5, "Minute", "MM", Usage.O));
        this.dateTimeConstraints.getDateTimeComponentDefinitions().add(new DateTimeComponentDefinition(6, "Second", "SS", Usage.O));
        this.dateTimeConstraints.getDateTimeComponentDefinitions().add(new DateTimeComponentDefinition(7, "1/10 second", "S...", Usage.O));
        this.dateTimeConstraints.getDateTimeComponentDefinitions().add(new DateTimeComponentDefinition(8, "1/100 second", ".S..", Usage.O));
        this.dateTimeConstraints.getDateTimeComponentDefinitions().add(new DateTimeComponentDefinition(9, "1/1000 second", "..S.", Usage.O));
        this.dateTimeConstraints.getDateTimeComponentDefinitions().add(new DateTimeComponentDefinition(10, "1/10000 second", "...S", Usage.O));
        this.dateTimeConstraints.getDateTimeComponentDefinitions().add(new DateTimeComponentDefinition(11, "Time Zone", "+/-ZZZZ", Usage.O));
        if(this.allowEmpty){
          this.dateTimeConstraints.setErrorMessage("The value SHALL follow the Date/Time pattern 'HH[MM[SS[.S[S[S[S]]]]]][+/-ZZZZ]'or 0000.");
          this.dateTimeConstraints.setRegex("^(\\d{2}|\\d{4}|\\d{6}|\\d{6}\\.\\d|\\d{6}\\.\\d{2}|\\d{6}\\.\\d{3}|\\d{6}\\.\\d{4})([+-]\\d{4})?|0000$");

        }else{
          this.dateTimeConstraints.setErrorMessage("The value SHALL follow the Date/Time pattern 'HH[MM[SS[.S[S[S[S]]]]]][+/-ZZZZ]'.");
          this.dateTimeConstraints.setRegex("^(\\d{2}|\\d{4}|\\d{6}|\\d{6}\\.\\d|\\d{6}\\.\\d{2}|\\d{6}\\.\\d{3}|\\d{6}\\.\\d{4})([+-]\\d{4})?$");
        }

      }
      
      return this.dateTimeConstraints;
    } else return this.dateTimeConstraints;
  }

  public void setDateTimeConstraints(DateTimeConstraints dateTimeConstraints) {
    this.dateTimeConstraints = dateTimeConstraints;
  }

  @Override
  public DateTimeDatatype clone() {

    DateTimeDatatype clone = new DateTimeDatatype();
    super.complete(clone);
    clone.dateTimeConstraints = dateTimeConstraints;
    clone.setAllowEmpty(this.allowEmpty);
    return clone;

  };

  public void setAllowEmpty(Boolean allowEmpty) {
    this.allowEmpty = allowEmpty;
  }

  public Boolean getAllowEmpty() {
    return allowEmpty;
  }
}
