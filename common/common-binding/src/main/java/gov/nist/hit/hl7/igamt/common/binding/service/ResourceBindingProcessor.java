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
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.BindingSource;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;

/**
 * @author Abdelghani El Ouakili
 *
 */
public class ResourceBindingProcessor {

  HashMap<String, Map<BindingSource, StructureElementBinding>> binding;

  public ResourceBindingProcessor() {
    binding = new HashMap<>();
  }

  public ResourceBindingProcessor(BindingSource source, ResourceBinding resourceBinding) {
    binding = new HashMap<>();
    if(resourceBinding.getChildren()!= null) {
      for(StructureElementBinding child : resourceBinding.getChildren()) {
        if(child.getChildren() != null) {
          this.processStructureElementBinding(source, null, child);
        }
      }
    }
  }

  void addBindings(BindingSource source, String pathId, StructureElementBinding binding) {
    Map<BindingSource, StructureElementBinding> bindingsForPath = this.binding.computeIfAbsent(pathId, (k) -> new HashMap<>());
    bindingsForPath.put(source, binding);
  }

  public Set<ValuesetBinding> getValueSetBindings(String pathId) {
    if(this.binding.containsKey(pathId)) {
      return this.binding.get(pathId).values().stream()
                         .filter((binding) -> binding.getValuesetBindings() != null)
                         .flatMap((binding) -> binding.getValuesetBindings().stream())
                         .collect(Collectors.toSet());
    } else {
      return null;
    }
  }

  private void processStructureElementBinding(BindingSource source, String parent, StructureElementBinding elm) {
    String path = parent != null ? parent + '-' + elm.getElementId() : elm.getElementId();
    this.addBindings(source, path, elm);

    if(elm.getChildren() != null) {
      for(StructureElementBinding child : elm.getChildren()) {
        if(child.getChildren() != null) {
          this.processStructureElementBinding(source, path, child);
        }
      }
    }
  }
  
  public void addChild(BindingSource source, ResourceBinding resourceBinding, String parent) {
    if(resourceBinding.getChildren()!= null) {
      for(StructureElementBinding child : resourceBinding.getChildren()) {
        String path_id = (parent != null? parent +'-'+ child.getElementId(): child.getElementId());
        this.addBindings(source, path_id, child);
        if(child.getChildren() != null) {
          for(StructureElementBinding sub : child.getChildren()) {
            if(child.getChildren() != null) {
              this.processStructureElementBinding(source, path_id, sub);
            }
          }
        }
      }
    }
  }
  
  public HashMap<String, Map<BindingSource, StructureElementBinding>> get(){
	return binding;
  }
}
