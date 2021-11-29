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
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.Usage;
import gov.nist.hit.hl7.igamt.constraints.domain.Predicate;
import gov.nist.hit.hl7.igamt.constraints.domain.ViewScope;
import gov.nist.hit.hl7.igamt.datatype.domain.display.BindingDisplay;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DatatypeLabel;
import gov.nist.hit.hl7.igamt.segment.domain.Field;

/**
 * @author jungyubw
 *
 */
public class FieldDisplayDataModel extends Field {

  public FieldDisplayDataModel() {
    super();
    this.setType(Type.FIELD);
  }

  public FieldDisplayDataModel(Field field) {
    super();
    this.setType(Type.FIELD);
    this.setChangeLog(field.getChangeLog());
    this.setConfLength(field.getConfLength());
    this.setCustom(field.isCustom());
    this.setId(field.getId());
    this.setMax(field.getMax());
    this.setMaxLength(field.getMaxLength());
    this.setMin(field.getMin());
    this.setMinLength(field.getMinLength());
    this.setName(field.getName());
    this.setPosition(field.getPosition());
    this.setRef(field.getRef());
    this.setText(field.getText());
    this.setUsage(field.getUsage());
  }

  private String idPath;
  private String path;
  private Usage trueUsage;
  private Usage falseUsage;
  private Predicate predicate;

  @DeltaField
  private DatatypeLabel datatypeLabel;
  @DeltaField
  private BindingDisplay binding;

  @DeltaField
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

  public DatatypeLabel getDatatypeLabel() {
    return datatypeLabel;
  }

  public void setDatatypeLabel(DatatypeLabel datatypeLabel) {
    this.datatypeLabel = datatypeLabel;
  }

  public ViewScope getViewScope() {
    return viewScope;
  }

  public void setViewScope(ViewScope viewScope) {
    this.viewScope = viewScope;
  }

  public BindingDisplay getBinding() {
    return binding;
  }

  public void setBinding(BindingDisplay binding) {
    this.binding = binding;
  }


  @Override
  public String toString() {
    return "FieldDisplayDataModel [idPath=" + idPath + ", path=" + path + ", datatypeLabel="
        + datatypeLabel + ", bindings=" + binding + ", viewScope=" + viewScope + "]";
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
