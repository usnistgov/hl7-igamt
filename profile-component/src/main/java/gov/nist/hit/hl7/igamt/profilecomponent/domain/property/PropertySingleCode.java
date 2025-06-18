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

import gov.nist.hit.hl7.igamt.common.binding.domain.*;
import gov.nist.hit.hl7.igamt.common.binding.service.BindingService;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;

import java.util.List;

/**
 *
 * @author Maxence Lefort on Feb 23, 2018.
 */
public class PropertySingleCode extends PropertyBinding implements ApplyResourceBinding {

  private List<SingleCodeBinding> singleCodeBindings;


  public PropertySingleCode() {
    super(PropertyType.SINGLECODE);
  }

  public List<SingleCodeBinding> getSingleCodeBindings() {
    return singleCodeBindings;
  }

  public void setSingleCodeBindings(List<SingleCodeBinding> singleCodeBindings) {
    this.singleCodeBindings = singleCodeBindings;
  }

  @Override
  public void onResourceBinding(ResourceBinding resourceBinding, BindingService bindingService) {
    StructureElementBinding structureElementBinding = this.getStructureBinding(resourceBinding, this.target, bindingService);
    structureElementBinding.setSingleCodeBindings(singleCodeBindings);
  }
}
