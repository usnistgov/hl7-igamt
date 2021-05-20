/**
 * 
 * This software was developed at the National Institute of Standards and Technology by employees of
 * the Federal Government in the course of their official duties. Pursuant to title 17 Section 105
 * of the United States Code this software is not subject to copyright protection and is in the
 * public domain. This is an experimental system. NIST assumes no responsibility whatsoever for its
 * use by other parties, and makes no guarantees, expressed or implied, about its quality,
 * reliability, or any other characteristic. We would appreciate acknowledgement if the software is
 * used. This software can be redistributed and/or modified freely provided that any derivative
 * works bear some notice that they are derived from it, and any modified versions bear some notice
 * that they have been modified.
 * 
 */
package gov.nist.hit.hl7.igamt.profilecomponent.domain.property;

import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
import gov.nist.hit.hl7.igamt.common.binding.service.BindingService;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.ChangeType;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatement;
import org.bson.types.ObjectId;

import java.util.HashSet;

/**
 *
 * @author Maxence Lefort on Feb 22, 2018.
 */
public class PropertyConformanceStatement extends PropertyBinding implements ApplyResourceBinding {

  private ChangeType change;
  private String targetId;
  private ConformanceStatement payload;


  public PropertyConformanceStatement() {
    super(PropertyType.STATEMENT);
  }

  public ChangeType getChange() {
    return change;
  }

  public void setChange(ChangeType change) {
    this.change = change;
  }

  public String getTargetId() {
    return targetId;
  }

  public void setTargetId(String targetId) {
    this.targetId = targetId;
  }

  public ConformanceStatement getPayload() {
    return payload;
  }

  public void setPayload(ConformanceStatement payload) {
    this.payload = payload;
  }

  @Override
  public void onResourceBinding(ResourceBinding resourceBinding, BindingService bindingService) {
    if(change.equals(ChangeType.ADD) && this.payload != null) {
      this.payload.setId(new ObjectId().toString());
      resourceBinding.addConformanceStatement(this.payload);
    }

    if(change.equals(ChangeType.DELETE) && resourceBinding != null && resourceBinding.getConformanceStatements() != null) {
      resourceBinding.getConformanceStatements().removeIf((elm) -> elm.getId().equals(targetId));
    }
  }
}
