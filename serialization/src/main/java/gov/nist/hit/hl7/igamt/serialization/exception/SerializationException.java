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
package gov.nist.hit.hl7.igamt.serialization.exception;

import java.util.Map;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;


/**
 *
 * @author Maxence Lefort on Mar 22, 2018.
 */
public class SerializationException extends Exception {

  /**
   * 
   */
  private static final long serialVersionUID = 8382595266411607L;
  protected Type type;
  protected String location;
  protected String message;

  public SerializationException(Throwable cause, Type type, String location, String message) {
    super(cause);
    this.type = type;
    this.location = location;
    this.message = message;
  }

  public SerializationException(Throwable cause, Type type, String location) {
    this(cause, type, location, null);
  }

  public String printError() {
    StringBuilder errorBuilder = new StringBuilder();
    errorBuilder.append(type.name());
    errorBuilder.append("[");
    errorBuilder.append(this.location);
    errorBuilder.append("]");
    if (this.message != null) {
      errorBuilder.append(" -> ");
      errorBuilder.append(this.message);
    }
    errorBuilder.append(" => ");
    if (super.getCause() instanceof SerializationException) {
      errorBuilder.append(((SerializationException) super.getCause()).printError());
    } else {
      errorBuilder.append(super.getCause().getClass().getName());
      errorBuilder.append(" -> ");
      errorBuilder.append(super.getCause().getLocalizedMessage());
    }
    return errorBuilder.toString();
  }

  protected static String generateLocation(Map<String, String> locationParameters) {
    StringBuilder stringBuilder = new StringBuilder();
    for (String key : locationParameters.keySet()) {
      stringBuilder.append(key);
      stringBuilder.append(":");
      stringBuilder.append(locationParameters.get(key));
      stringBuilder.append(",");
    }
    // removing the last comma
    stringBuilder.deleteCharAt(stringBuilder.length());
    return stringBuilder.toString();
  }

  public Type getType() {
    return type;
  }

  public void setType(Type type) {
    this.type = type;
  }

  public String getLocation() {
    return location;
  }

  public void setLocation(String location) {
    this.location = location;
  }

  @Override
  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }

}
