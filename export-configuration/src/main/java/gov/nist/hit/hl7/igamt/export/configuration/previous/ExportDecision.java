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
package gov.nist.hit.hl7.igamt.export.configuration.previous;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportType;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.ExportFilterDecision;

/**
 * @author Abdelghani El Ouakili
 *
 */
@Document
public class ExportDecision {

  @Id
  private String id;
  private ExportType type;
  private String document;
  private String config;
  private String username;
  private ExportFilterDecision filterdDecision;


  public ExportDecision(ExportType type, String document, String config, String username,
      ExportFilterDecision filterdDecision) {
    super();
    this.type = type;
    this.document = document;
    this.config = config;
    this.username = username;
    this.filterdDecision = filterdDecision;
  }
  public String getDocument() {
    return document;
  }
  public void setDocument(String document) {
    this.document = document;
  }
  public String getConfig() {
    return config;
  }
  public void setConfig(String config) {
    this.config = config;
  }
  public String getUsername() {
    return username;
  }
  public void setUsername(String username) {
    this.username = username;
  }
  public ExportFilterDecision getDecision() {
    return decision;
  }
  public void setDecision(ExportFilterDecision decision) {
    this.decision = decision;
  }
  private ExportFilterDecision decision;
  public ExportType getType() {
    return type;
  }
  public void setType(ExportType type) {
    this.type = type;
  }
  public ExportFilterDecision getFilterdDecision() {
    return filterdDecision;
  }
  public void setFilterdDecision(ExportFilterDecision filterdDecision) {
    this.filterdDecision = filterdDecision;
  }
}
