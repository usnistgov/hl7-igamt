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
package gov.nist.hit.hl7.igamt.common.binding.service;

import java.util.HashMap;

import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;

/**
 * @author Abdelghani El Ouakili
 *
 */
public class ResourceBindingProcessor {

  HashMap<String, StructureElementBinding> binding = new HashMap<String, StructureElementBinding>();

  void addBindings(String pathId, StructureElementBinding binding) {
    this.binding.put(pathId, binding);
  }
  public StructureElementBinding getBindingFor(String pathId) {
    if(this.binding.containsKey(pathId)) {
      return binding.get(pathId);

    }else  return null;
  }
  
  public ResourceBindingProcessor(ResourceBinding resourceBinding) {
    HashMap<String, StructureElementBinding> binding = new HashMap<String, StructureElementBinding>();

    if(resourceBinding.getChildren()!= null && resourceBinding.getChildren().isEmpty()) {
      for(StructureElementBinding child : resourceBinding.getChildren()) {
        binding.put(child.getElementId(), child);
        if(child.getChildren() != null) {
          this.processsStructureElementBinding(child.getElementId(), child);
        }
      }
    }
  }
  
  private void processsStructureElementBinding(String path, StructureElementBinding elm) {
    binding.put(path+'-'+elm.getElementId(), elm);

    if(elm.getChildren() != null) {
      for(StructureElementBinding child : elm.getChildren()) {
        if(child.getChildren() != null) {
          this.processsStructureElementBinding(path+'-'+elm.getElementId(), child);
        }
      }
    }
  }
  
  public void addChild(ResourceBinding resourceBinding, String path) {
    if(resourceBinding.getChildren()!= null && resourceBinding.getChildren().isEmpty()) {
      for(StructureElementBinding child : resourceBinding.getChildren()) {
        binding.put(path + child.getElementId(), child);
        if(child.getChildren() != null) {
          this.processsStructureElementBinding(path + child.getElementId(), child);
        }
      }
    }
  }
}
