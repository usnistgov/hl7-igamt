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
package gov.nist.hit.hl7.igamt.segment.domain.display;

import java.util.HashSet;
import java.util.Set;
import gov.nist.diff.annotation.DeltaField;
import gov.nist.hit.hl7.igamt.common.base.model.SectionInfo;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatement;

/**
 * @author jungyubw
 *
 */
public class SegmentStructureDisplay extends SectionInfo {

  @DeltaField
  private Set<FieldStructureTreeModel> structure;
  @DeltaField
  private String name;

  @DeltaField
  private Set<ConformanceStatement> conformanceStatements;

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getLabel() {
    return label;
  }

  public void setLabel(String label) {
    this.label = label;
  }

  public Set<FieldStructureTreeModel> getStructure() {
    return structure;
  }

  public void setStructure(Set<FieldStructureTreeModel> structure) {
    this.structure = structure;
  }

  /**
   * @param fieldDisplayModel
   */
  public void addField(FieldStructureTreeModel fieldStructureTreeModel) {
    if (this.structure == null)
      this.structure = new HashSet<FieldStructureTreeModel>();
    this.structure.add(fieldStructureTreeModel);
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Set<ConformanceStatement> getConformanceStatements() {
    return conformanceStatements;
  }

  public void setConformanceStatements(Set<ConformanceStatement> conformanceStatements) {
    this.conformanceStatements = conformanceStatements;
  }
}
