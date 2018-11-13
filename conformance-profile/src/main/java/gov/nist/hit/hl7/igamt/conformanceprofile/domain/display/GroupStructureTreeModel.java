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
package gov.nist.hit.hl7.igamt.conformanceprofile.domain.display;

import java.util.HashSet;
import java.util.Set;

/**
 * @author jungyubw
 *
 */
public class GroupStructureTreeModel extends SegmentRefOrGroupStructureTreeModel {
  private GroupDisplayModel data;
  private Set<SegmentRefOrGroupStructureTreeModel> children;

  public GroupStructureTreeModel() {
    super();
  }

  public GroupDisplayModel getData() {
    return data;
  }

  public void setData(GroupDisplayModel data) {
    this.data = data;
  }

  public Set<SegmentRefOrGroupStructureTreeModel> getChildren() {
    return children;
  }

  public void setChildren(Set<SegmentRefOrGroupStructureTreeModel> children) {
    this.children = children;
  }
  
  public void addGroup(GroupStructureTreeModel groupStructureTreeModel) {
    if (this.children == null)
      this.children = new HashSet<SegmentRefOrGroupStructureTreeModel>();
    this.children.add(groupStructureTreeModel);
  }
  
  public void addSegment(SegmentRefStructureTreeModel segmentRefStructureTreeModel) {
    if (this.children == null)
      this.children = new HashSet<SegmentRefOrGroupStructureTreeModel>();
    this.children.add(segmentRefStructureTreeModel);
  }
}
