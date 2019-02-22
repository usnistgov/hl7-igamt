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
import gov.nist.diff.annotation.DeltaField;
import gov.nist.hit.hl7.igamt.common.base.domain.Ref;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.Usage;
import gov.nist.hit.hl7.igamt.common.base.domain.display.ViewScope;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRef;
import gov.nist.hit.hl7.igamt.constraints.domain.Predicate;
import gov.nist.hit.hl7.igamt.datatype.domain.display.BindingDisplay;

/**
 * @author jungyubw
 *
 */
public class SegmentRefDisplayModel extends SegmentRefOrGroupDisplayModel {
  public SegmentRefDisplayModel() {
    super();
    this.setType(Type.SEGMENTREF);
  }

  public SegmentRefDisplayModel(SegmentRef segmentRef) {
    super();
    this.setType(Type.SEGMENTREF);
    this.setCustom(segmentRef.isCustom());
    this.setId(segmentRef.getId());
    this.setMax(segmentRef.getMax());
    this.setMin(segmentRef.getMin());
    this.setName(segmentRef.getName());
    this.setPosition(segmentRef.getPosition());
    this.setText(segmentRef.getText());
    this.setUsage(segmentRef.getUsage());
    this.setRef(segmentRef.getRef());

  }

  private String idPath;
  private String path;
  private Usage trueUsage;
  private Usage falseUsage;
  private Predicate predicate;

  private Ref ref;

  @DeltaField
  private SegmentLabel segmentLabel;
  @DeltaField
  private Set<BindingDisplay> bindings;

  private ViewScope viewScope;

  public String getIdPath() {
    return idPath;
  }

  public void setIdPath(String idPath) {
    this.idPath = idPath;
  }

  public String getPath() {
    return path;
  }

  public void setPath(String path) {
    this.path = path;
  }

  public Ref getRef() {
    return ref;
  }

  public void setRef(Ref ref) {
    this.ref = ref;
  }

  public SegmentLabel getSegmentLabel() {
    return segmentLabel;
  }

  public void setSegmentLabel(SegmentLabel segmentLabel) {
    this.segmentLabel = segmentLabel;
  }

  public ViewScope getViewScope() {
    return viewScope;
  }

  public void setViewScope(ViewScope viewScope) {
    this.viewScope = viewScope;
  }

  public Set<BindingDisplay> getBindings() {
    return bindings;
  }

  public void setBindings(Set<BindingDisplay> bindings) {
    this.bindings = bindings;
  }

  /**
   * @param createBindingDisplay
   */
  public void addBinding(BindingDisplay binding) {
    if (this.bindings == null) this.bindings = new HashSet<BindingDisplay>();
    this.bindings.add(binding);
  }

  public Usage getTrueUsage() {
    return trueUsage;
  }

  public void setTrueUsage(Usage trueUsage) {
    this.trueUsage = trueUsage;
  }

  public Usage getFalseUsage() {
    return falseUsage;
  }

  public void setFalseUsage(Usage falseUsage) {
    this.falseUsage = falseUsage;
  }

  public Predicate getPredicate() {
    return predicate;
  }

  public void setPredicate(Predicate predicate) {
    this.predicate = predicate;
  }
}
