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
package gov.nist.hit.hl7.igamt.profilecomponent.domain;

import java.util.HashSet;
import java.util.Set;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;

/**
 * A profile component is an objects that contains all the changes between the source (a message or
 * a segment) and the targeted composite profile.
 * 
 * Created by Maxence Lefort on Feb 20, 2018.
 */
public class ProfileComponentContext {

  /**
   * 
   */
  private String id;
  private Type level;
  private String sourceId;
  private String structure;
  private int position;
  private Set<ProfileComponentItem> profileComponentItems;


  /**
   * @param id
   * @param level
   * @param sourceId
   * @param structure
   * @param position
   * @param profileComponentItems
   */
  public ProfileComponentContext(String id, Type level, String sourceId, String structure,
      int position, Set<ProfileComponentItem> profileComponentItems) {
    super();
    this.id = id;
    this.level = level;
    this.sourceId = sourceId;
    this.structure = structure;
    this.position = position;
    this.profileComponentItems = profileComponentItems;
  }

  public ProfileComponentContext() {
    super();
    // TODO Auto-generated constructor stub
  }

  public enum Level {
    MESSAGE, SEGMENT
  }

  public Type getLevel() {
    return level;
  }

  public void setLevel(Type level) {
    this.level = level;
  }

  public String getSourceId() {
    return sourceId;
  }

  public void setSourceId(String sourceId) {
    this.sourceId = sourceId;
  }

  public String getStructure() {
    return structure;
  }

  public void setStructure(String structure) {
    this.structure = structure;
  }

  public Set<ProfileComponentItem> getProfileComponentItems() {
    return profileComponentItems;
  }

  public void setProfileComponentItems(Set<ProfileComponentItem> profileComponentItems) {
    this.profileComponentItems = profileComponentItems;
  }

  public void addProfileComponentItem(ProfileComponentItem item) {
    if (this.profileComponentItems == null)
      this.profileComponentItems = new HashSet<ProfileComponentItem>();
    this.profileComponentItems.add(item);
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public int getPosition() {
    return position;
  }

  public void setPosition(int position) {
    this.position = position;
  }
}
