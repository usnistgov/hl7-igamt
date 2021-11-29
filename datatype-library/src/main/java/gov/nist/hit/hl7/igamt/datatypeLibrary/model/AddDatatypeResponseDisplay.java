package gov.nist.hit.hl7.igamt.datatypeLibrary.model;

import java.util.ArrayList;
import java.util.List;

/**
 * @author ena3
 *
 */
public class AddDatatypeResponseDisplay {
  List<TreeNode> datatypes = new ArrayList<TreeNode>();



  public List<TreeNode> getDatatypes() {
    return datatypes;
  }

  public void setDatatypes(List<TreeNode> datatypes) {
    this.datatypes = datatypes;
  }

}
