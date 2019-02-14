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

import gov.nist.hit.hl7.igamt.common.base.domain.Resource;



/**
 * A profile component is an objects that contains all the changes between the source (a message or
 * a segment) and the targeted composite profile.
 * 
 * Created by Maxence Lefort on Feb 20, 2018.
 */
public class ProfileComponent extends Resource {

  private Level level;
  private String sourceId;
  private String structure;
  private Set<ProfileComponentItem> profileComponentItems;


  public ProfileComponent() {
    super();
    // TODO Auto-generated constructor stub
  }

  public enum Level {
    MESSAGE, SEGMENT
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

  public void addProfileComponentItem(ProfileComponentItem item) {
    if (this.profileComponentItems == null)
      this.profileComponentItems = new HashSet<ProfileComponentItem>();
    this.profileComponentItems.add(item);
  }

  /*
   * (non-Javadoc)
   * 
   * @see gov.nist.hit.hl7.igamt.shared.domain.AbstractDomain#getLabel()
   */
  @Override
  public String getLabel() {
    return this.getName();
  }

	@Override
	public ProfileComponent clone() {
		// TODO Auto-generated method stub
		return null;
	}
}
