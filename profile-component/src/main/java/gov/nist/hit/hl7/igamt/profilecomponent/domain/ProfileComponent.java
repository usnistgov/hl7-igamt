/**
 * 
 */
package gov.nist.hit.hl7.igamt.profilecomponent.domain;

import java.util.Set;


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
public class ProfileComponent extends gov.nist.hit.hl7.igamt.shared.domain.Resource {

  public enum Level {
    MESSAGE, SEGMENT
  }

  private Level level;
  private String sourceId;
  private String structure;
  private Set<ProfileComponentItem> profileComponentItems;
  private Set<String> compositeProfileIds;

  public ProfileComponent(Level level, String sourceId, String structure,
      Set<ProfileComponentItem> profileComponentItems, Set<String> compositeProfileIds) {
    super();
    this.level = level;
    this.sourceId = sourceId;
    this.structure = structure;
    this.profileComponentItems = profileComponentItems;
    this.compositeProfileIds = compositeProfileIds;
  }

  public Level getLevel() {
    return level;
  }

  public void setLevel(Level level) {
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

  public Set<String> getCompositeProfileIds() {
    return compositeProfileIds;
  }

  public void setCompositeProfileIds(Set<String> compositeProfileIds) {
    this.compositeProfileIds = compositeProfileIds;
  }



}
