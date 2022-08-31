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
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
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
  public Set<ValuesetBinding> getValueSetBindings(String pathId) {
    if(this.binding.containsKey(pathId)) {
      return this.binding.get(pathId).getValuesetBindings();
    }else  return null;
  }
  
  public ResourceBindingProcessor(ResourceBinding resourceBinding) {
    binding = new HashMap<String, StructureElementBinding>();

    if(resourceBinding.getChildren()!= null) {
      for(StructureElementBinding child : resourceBinding.getChildren()) {
        if(child.getChildren() != null) {
          this.processsStructureElementBinding(null, child);
        }
      }
    }
  }
  
  /**
   * 
   */
  public ResourceBindingProcessor() {
    binding = new HashMap<String, StructureElementBinding>();
  }
  private void processsStructureElementBinding(String path, StructureElementBinding elm) {
    String newKey = path != null? path + '-' + elm.getElementId() : elm.getElementId();
    binding.put(newKey, elm);

    if(elm.getChildren() != null) {
      for(StructureElementBinding child : elm.getChildren()) {
        if(child.getChildren() != null) {
          this.processsStructureElementBinding(newKey, child);
        }
      }
    }
  }
  
  public void addChild(ResourceBinding resourceBinding, String parent) {
	  System.out.println(parent);
    if(resourceBinding.getChildren()!= null) {
      for(StructureElementBinding child : resourceBinding.getChildren()) {
        String path_id = (parent != null? parent +'-'+ child.getElementId(): child.getElementId());
        if(path_id.equals("10-7-1")) {
        	System.out.println(path_id);
        }
        this.binding.put(path_id, child);
        System.out.println(path_id);
        if(child.getChildren() != null) {
          for(StructureElementBinding sub : child.getChildren()) {
            if(child.getChildren() != null) {
              this.processsStructureElementBinding(path_id, sub);
            }
          }
        }
      }
    }
  }
  
  public HashMap<String, StructureElementBinding> get(){
	return binding;
	  
  }
  
  
 
}
