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

public class ResponseMessage<T> {

  private Status status;
  private String type;
  private String text;
  private String resourceId;
  private boolean hide;
  private Date date;
  private T data;

  public ResponseMessage(Status status, String type, String text, String resourceId, boolean hide,
      Date date, T data) {
    super();
    this.status = status;
    this.type = type;
    this.text = text;
    this.resourceId = resourceId;
    this.hide = hide;
    this.date = date;
    this.data = data;
  }

  public ResponseMessage() {
    super();
    // TODO Auto-generated constructor stub
  }

  /**
   * @param failed
   * @param localizedMessage
   */
  public ResponseMessage(Status status, String localizedMessage) {
    super();
    this.status = status;
    this.text = localizedMessage;
    // TODO Auto-generated constructor stub
  }

  /**
   * @param success
   * @param tableOfContentUpdated
   * @param id
   * @param date2
   */
  public ResponseMessage(Status status, String message, String id, Date date) {
    // TODO Auto-generated constructor stub
    this.status = status;
    this.text = message;
    this.resourceId = id;
    this.date = date;

  }

  public ResponseMessage(Status status, String message, String id, T data, Date date) {
    // TODO Auto-generated constructor stub
    this.status = status;
    this.text = message;
    this.resourceId = id;
    this.date = date;
    this.data = data;

  }

  public ResponseMessage(Status status, T data, boolean hide) {
    // TODO Auto-generated constructor stub
    this.status = status;
    this.data = data;
    this.hide = hide;

  }

  public enum Status {
    SUCCESS, WARNING, INFO, FAILED;
  }



  public Status getStatus() {
    return status;
  }

  public void setStatus(Status status) {
    this.status = status;
  }

  public String getType() {
    return type;
  }

  public void setType(String type) {
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

  public Object getData() {
    return data;
  }

  public void setData(T data) {
    this.data = data;
  }


}
