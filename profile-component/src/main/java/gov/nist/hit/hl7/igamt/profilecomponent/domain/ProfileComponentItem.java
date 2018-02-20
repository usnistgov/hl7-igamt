package gov.nist.hit.hl7.igamt.profilecomponent.domain;

import java.util.Set;

import gov.nist.hit.hl7.igamt.profilecomponent.domain.delta.DeltaObject;

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
 * <p>
 * Created by Maxence Lefort on Feb 20, 2018.
 */
public class ProfileComponentItem {

  private String path;
  private Set<DeltaObject> deltaObjects;

  public ProfileComponentItem(String path, Set<DeltaObject> deltaObjects) {
    super();
    this.path = path;
    this.deltaObjects = deltaObjects;
  }

  public String getPath() {
    return path;
  }

  public void setPath(String path) {
    this.path = path;
  }

  public Set<DeltaObject> getDeltaObjects() {
    return deltaObjects;
  }

  public void setDeltaObjects(Set<DeltaObject> deltaObjects) {
    this.deltaObjects = deltaObjects;
  }

}

