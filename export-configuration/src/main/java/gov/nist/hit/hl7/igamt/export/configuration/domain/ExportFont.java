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

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 *
 * @author Maxence Lefort on May 15, 2018.
 */
@Document(collection = "exportFont")
public class ExportFont {
  @Id
  @GeneratedValue(strategy = GenerationType.TABLE)
  private String id;
  private String name;
  private String value;
  private static final String DEFAULT_NAME = "'Arial Narrow',sans-serif";
  private static final String DEFAULT_VALUE = "'Arial Narrow',sans-serif;";

  public ExportFont() {}

  public ExportFont(String name, String value) {
    this.name = name;
    this.value = value;
  }

  public static ExportFont getDefault() {
    return new ExportFont(DEFAULT_NAME, DEFAULT_VALUE);
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getValue() {
    return value;
  }

  public void setValue(String value) {
    this.value = value;
  }

}
