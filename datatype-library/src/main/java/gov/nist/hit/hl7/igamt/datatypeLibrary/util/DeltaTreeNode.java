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
package gov.nist.hit.hl7.igamt.datatypeLibrary.util;

import java.util.ArrayList;
import java.util.List;

/**
 * @author ena3
 *
 */
public class DeltaTreeNode {

  private DeltaRowData data = new DeltaRowData();
  private int position;
  private List<DeltaTreeNode> children = new ArrayList<DeltaTreeNode>();

  public DeltaRowData getData() {
    return data;
  }

  public void setData(DeltaRowData data) {
    this.data = data;
  }

  public List<DeltaTreeNode> getChildren() {
    return children;
  }

  public void setChildren(List<DeltaTreeNode> children) {
    this.children = children;
  }

  public int getPosition() {
    return position;
  }

  public void setPosition(int position) {
    this.position = position;
  }


}
