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
package gov.nist.hit.hl7.igamt.ig.domain;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;

import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatementsContainer;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DatatypeSelectItem;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentSelectItem;

/**
 * @author jungyubw
 *
 */
public class IgDocumentConformanceStatement {
  private HashMap<String, ConformanceStatementsContainer> associatedMSGConformanceStatementMap;
  private HashMap<String, ConformanceStatementsContainer> associatedSEGConformanceStatementMap;
  private HashMap<String, ConformanceStatementsContainer> associatedDTConformanceStatementMap;

  private Set<DatatypeSelectItem> usersDatatypesSelectItems;
  private Set<SegmentSelectItem> usersSegmentSelectItems;
  private Set<ConformanceProfileSelectItem> usersConformanceProfileSelectItems;

  public HashMap<String, ConformanceStatementsContainer> getAssociatedMSGConformanceStatementMap() {
    return associatedMSGConformanceStatementMap;
  }

  public void setAssociatedMSGConformanceStatementMap(
      HashMap<String, ConformanceStatementsContainer> associatedMSGConformanceStatementMap) {
    this.associatedMSGConformanceStatementMap = associatedMSGConformanceStatementMap;
  }

  public HashMap<String, ConformanceStatementsContainer> getAssociatedSEGConformanceStatementMap() {
    return associatedSEGConformanceStatementMap;
  }

  public void setAssociatedSEGConformanceStatementMap(
      HashMap<String, ConformanceStatementsContainer> associatedSEGConformanceStatementMap) {
    this.associatedSEGConformanceStatementMap = associatedSEGConformanceStatementMap;
  }

  public HashMap<String, ConformanceStatementsContainer> getAssociatedDTConformanceStatementMap() {
    return associatedDTConformanceStatementMap;
  }

  public void setAssociatedDTConformanceStatementMap(
      HashMap<String, ConformanceStatementsContainer> associatedDTConformanceStatementMap) {
    this.associatedDTConformanceStatementMap = associatedDTConformanceStatementMap;
  }

  public Set<DatatypeSelectItem> getUsersDatatypesSelectItems() {
    return usersDatatypesSelectItems;
  }

  public void setUsersDatatypesSelectItems(
      Set<DatatypeSelectItem> usersDatatypesSelectItems) {
    this.usersDatatypesSelectItems = usersDatatypesSelectItems;
  }
  
  public void addUsersDatatypeSelectItem(DatatypeSelectItem item){
    if(this.usersDatatypesSelectItems == null) this.usersDatatypesSelectItems = new HashSet<DatatypeSelectItem>();
    this.usersDatatypesSelectItems.add(item);
  }

  public Set<SegmentSelectItem> getUsersSegmentSelectItems() {
    return usersSegmentSelectItems;
  }

  public void setUsersSegmentSelectItems(Set<SegmentSelectItem> usersSegmentSelectItems) {
    this.usersSegmentSelectItems = usersSegmentSelectItems;
  }
  
  public void addUsersSegmentSelectItem(SegmentSelectItem item){
    if(this.usersSegmentSelectItems == null) this.usersSegmentSelectItems = new HashSet<SegmentSelectItem>();
    this.usersSegmentSelectItems.add(item);
  }

  public Set<ConformanceProfileSelectItem> getUsersConformanceProfileSelectItems() {
    return usersConformanceProfileSelectItems;
  }

  public void setUsersConformanceProfileSelectItems(Set<ConformanceProfileSelectItem> usersConformanceProfileSelectItems) {
    this.usersConformanceProfileSelectItems = usersConformanceProfileSelectItems;
  }
  
  public void addUsersConformanceProfileSelectItem(ConformanceProfileSelectItem item){
    if(this.usersConformanceProfileSelectItems == null) this.usersConformanceProfileSelectItems = new HashSet<ConformanceProfileSelectItem>();
    this.usersConformanceProfileSelectItems.add(item);
  }
}
