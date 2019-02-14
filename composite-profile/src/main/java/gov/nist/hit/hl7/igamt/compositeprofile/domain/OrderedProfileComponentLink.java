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
package gov.nist.hit.hl7.igamt.compositeprofile.domain;

/**
 * 
 * Created by Jungyub Woo on Mar 15, 2018.
 */
public class OrderedProfileComponentLink implements Comparable<OrderedProfileComponentLink> {

  private int position;
  private String profileComponentId;

  public OrderedProfileComponentLink() {
    super();
  }

  public int getPosition() {
    return position;
  }

  public void setPosition(int position) {
    this.position = position;
  }

  public String getProfileComponentId() {
    return profileComponentId;
  }

  public void setProfileComponentId(String profileComponentId) {
    this.profileComponentId = profileComponentId;
  }

  @Override
  public int compareTo(OrderedProfileComponentLink o) {
    return this.position - o.position;
  }
}
