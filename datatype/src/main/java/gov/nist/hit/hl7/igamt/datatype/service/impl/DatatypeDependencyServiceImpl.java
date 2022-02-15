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
package gov.nist.hit.hl7.igamt.datatype.service.impl;


import java.util.HashMap;


import org.springframework.beans.factory.annotation.Autowired;

import gov.nist.hit.hl7.igamt.common.base.domain.RealKey;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
import gov.nist.hit.hl7.igamt.common.binding.service.ResourceBindingProcessor;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Component;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeDependencyService;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.datatype.wrappers.DatatypeDependencies;

import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.resource.dependency.DependencyFilter;

/**
 * @author Abdelghani El Ouakili
 *
 */
public class DatatypeDependencyServiceImpl implements DatatypeDependencyService {


  @Autowired
  DatatypeService datatypeService;

  @Override
  public void updateDependencies(Datatype resource, HashMap<RealKey, String> newKeys) {

  }


  @Override
  public DatatypeDependencies getDependencies(Datatype resource, DependencyFilter filter) {
    DatatypeDependencies ret = new DatatypeDependencies();
    ResourceBindingProcessor rb = new ResourceBindingProcessor(resource.getBinding());
    if (resource instanceof ComplexDatatype) {
      this.process((ComplexDatatype)resource, ret, filter, rb, null);
    }


    return ret;
  }

  @Override
  public void process(Datatype datatype, DatatypeDependencies used, DependencyFilter filter,  ResourceBindingProcessor rb, String path) {
    if (datatype instanceof ComplexDatatype) {
      ComplexDatatype complex =  (ComplexDatatype)datatype;
      for (Component c : complex.getComponents()) {
        String pathId = path != null? path + '-' + c.getId(): c.getId();
        if (c.getRef() != null) {
          if (c.getRef().getId() != null) {
            if(used.getDatatypes().containsKey(c.getRef().getId()) && !this.filter(c, filter)) {
              Datatype child = this.datatypeService.findById(c.getRef().getId());
              rb.addChild(child.getBinding(), pathId);
              used.getDatatypes().put(child.getId(), child);
              if (child instanceof ComplexDatatype) {
                this.process((ComplexDatatype)child, used, filter, rb, pathId);
              }                
            }
          }
        }
      }
    }
  }


  /**
   * @param binding
   * @param path
   * @param valuesets
   */
  private void processBinding(ResourceBinding binding, String path,
      HashMap<String, Valueset> valuesets) {


  }


  /**
   * @param c
   * @param filter
   * @return
   */
  private boolean filter(Component c, DependencyFilter filter) {
    // TODO Auto-generated method stub
    return false;
  }







}
