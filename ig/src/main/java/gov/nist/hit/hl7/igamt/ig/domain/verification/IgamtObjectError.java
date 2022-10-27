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
package gov.nist.hit.hl7.igamt.ig.domain.verification;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;

/**
 * @author jungyubw
 *
 */
public class IgamtObjectError {  
  private String code;
  private String target;
  private Type targetType;
  private Object targetMeta;
  private String description;
  @Deprecated
  private String location;
  private String handleBy;
  private String severity;
  private Location locationInfo;
  
  public IgamtObjectError(){
    super();
  }

  @Deprecated
  public IgamtObjectError(String code, String target, Type targetType, Object targetMeta, String description,
      String location, String severity, String handleBy) {
    super();
    this.code = code;
    this.target = target;
    this.targetType = targetType;
    this.targetMeta = targetMeta;
    this.description = description;
    this.location = location;
    this.severity = severity;
    this.handleBy = handleBy;
  }

  public IgamtObjectError(String code, String target, Type targetType, Object targetMeta, Location locationInfo, String description, String severity, String handleBy) {
    super();
    this.code = code;
    this.target = target;
    this.targetType = targetType;
    this.targetMeta = targetMeta;
    this.description = description;
    this.locationInfo = locationInfo;
    this.severity = severity;
    this.handleBy = handleBy;
  }

  public String getCode() {
    return code;
  }

  public void setCode(String code) {
    this.code = code;
  }

  public String getTarget() {
    return target;
  }

  public void setTarget(String target) {
    this.target = target;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  @Deprecated
  public String getLocation() {
    return location;
  }

  @Deprecated
  public void setLocation(String location) {
    this.location = location;
  }

  public String getSeverity() {
    return severity;
  }

  public void setSeverity(String severity) {
    this.severity = severity;
  }

  public Type getTargetType() {
    return targetType;
  }

  public void setTargetType(Type targetType) {
    this.targetType = targetType;
  }

  public Object getTargetMeta() {
    return targetMeta;
  }

  public void setTargetMeta(Object targetMeta) {
    this.targetMeta = targetMeta;
  }

  public String getHandleBy() {
    return handleBy;
  }

  public void setHandleBy(String handleBy) {
    this.handleBy = handleBy;
  }

  public Location getLocationInfo() {
    return locationInfo;
  }

  public void setLocationInfo(Location locationInfo) {
    this.locationInfo = locationInfo;
  }

@Override
public String toString() {
	return "IgamtObjectError [code=" + code + ", target=" + target + ", targetType=" + targetType + ", targetMeta="
			+ targetMeta + ", description=" + description + ", location=" + location + ", handleBy=" + handleBy
			+ ", severity=" + severity + ", locationInfo=" + locationInfo + "]";
}
}
