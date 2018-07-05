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
package gov.nist.hit.hl7.igamt.common.base.model;

import java.util.Date;

/**
 * @author Harold Affo
 *
 */
public class ResponseMessage {

  public enum Type {
    SUCCESS, WARNING, INFO, FAILED;
  }

  private Type type;
  private String text;
  private String resourceId;
  private boolean hide;
  private Date date;



  public ResponseMessage(Type type, String text, String resourceId) {
    this.type = type;
    this.text = text;
    this.resourceId = resourceId;
    this.date = new Date();
  }


  public ResponseMessage(Type type, String text, String resourceId, boolean hide) {
    this.type = type;
    this.text = text;
    this.resourceId = resourceId;
    this.hide = hide;
  }


  public Type getType() {
    return type;
  }


  public void setType(Type type) {
    this.type = type;
  }


  public String getText() {
    return text;
  }


  public void setText(String text) {
    this.text = text;
  }


  public String getResourceId() {
    return resourceId;
  }


  public void setResourceId(String resourceId) {
    this.resourceId = resourceId;
  }


  public boolean isHide() {
    return hide;
  }


  public void setHide(boolean hide) {
    this.hide = hide;
  }


  public Date getDate() {
    return date;
  }


  public void setDate(Date date) {
    this.date = date;
  }



}
