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
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.RealKey;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.Usage;
import gov.nist.hit.hl7.igamt.common.base.service.CommonFilteringService;
import gov.nist.hit.hl7.igamt.common.base.util.ReferenceIndentifier;
import gov.nist.hit.hl7.igamt.common.base.util.ReferenceLocation;
import gov.nist.hit.hl7.igamt.common.base.util.RelationShip;
import gov.nist.hit.hl7.igamt.common.binding.service.BindingService;
import gov.nist.hit.hl7.igamt.common.binding.service.ResourceBindingProcessor;
import gov.nist.hit.hl7.igamt.common.exception.EntityNotFound;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Component;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeDependencyService;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.datatype.wrappers.DatatypeDependencies;
import gov.nist.hit.hl7.resource.dependency.DependencyFilter;

/**
 * @author Abdelghani El Ouakili
 *
 */
@Service
public class DatatypeDependencyServiceImpl implements DatatypeDependencyService {


  @Autowired
  DatatypeService datatypeService;
  @Autowired
  BindingService bindingService;
  @Autowired
  CommonFilteringService commonFilteringService;

  @Override
  public void updateDependencies(Datatype resource, HashMap<RealKey, String> newKeys) {

    if (resource instanceof ComplexDatatype) {
      for (Component c : ((ComplexDatatype) resource).getComponents()) {
        if (c.getRef() != null) {
          if (c.getRef().getId() != null) {
            RealKey key = new RealKey(c.getRef().getId(), Type.DATATYPE);
            if (newKeys.containsKey(key)) {
              c.getRef().setId(newKeys.get(key));
            }
          }
        }
      }
    }
    if (resource.getBinding() != null) {
      this.bindingService.substitute(resource.getBinding(), newKeys);
    }

  }


  @Override
  public DatatypeDependencies getDependencies(Datatype resource, DependencyFilter filter) throws EntityNotFound {
    DatatypeDependencies ret = new DatatypeDependencies();
    ResourceBindingProcessor rb = new ResourceBindingProcessor(resource.getBinding());
    if (resource instanceof ComplexDatatype) {
      this.process((ComplexDatatype)resource, ret, filter, rb, null);
    }
    return ret;
  }

  @Override
  public void process(Datatype datatype, DatatypeDependencies used, DependencyFilter filter,  ResourceBindingProcessor rb, String path) throws EntityNotFound {
    if (datatype instanceof ComplexDatatype) {
      ComplexDatatype complex =  (ComplexDatatype)datatype;
      for (Component c : complex.getComponents()) {
        if(commonFilteringService.allow(filter.getUsageFilter(), c)) {
          String pathId = path != null? path + '-' + c.getId(): c.getId();
          bindingService.processValueSetBinding(rb.getValueSetBindings(pathId), used.getValuesets(), filter.getExcluded());  

          if (c.getRef() != null) {
            if (c.getRef().getId() != null) {
              this.visit(c.getRef().getId(), used.getDatatypes(), used, filter, rb, pathId);
            }
          }
        }
      }
    }
  }

  @Override
  public void visit(String id, Map<String, Datatype> existing, DatatypeDependencies used,
      DependencyFilter filter, ResourceBindingProcessor rb, String parentPath) throws EntityNotFound {

	    if(id != null) {
	        Datatype d = existing.containsKey(id)? existing.get(id): datatypeService.findById(id);
	      	
	        if(d!= null) {
	          existing.put(d.getId(), d);
	          if(d instanceof ComplexDatatype) {
	            rb.addChild(d.getBinding(), parentPath);
	            this.process(d, used , filter, rb, parentPath);
	          }
	        }else throw new EntityNotFound(id);
	      }
  }


  @Override
  public Set<RelationShip> collectDependencies(Datatype elm) {

    Set<RelationShip> used = new HashSet<RelationShip>();
    HashMap<String, Usage> usageMap = new HashMap<String, Usage>();

    if (elm instanceof ComplexDatatype) {
      ComplexDatatype complex = (ComplexDatatype) elm;
      for (Component c : complex.getComponents()) {
        if (c.getRef() != null && c.getRef().getId() != null) {
          RelationShip rel = new RelationShip(new ReferenceIndentifier(c.getRef().getId(), Type.DATATYPE),
              new ReferenceIndentifier(elm.getId(), Type.DATATYPE),
              new ReferenceLocation(Type.COMPONENT, c.getPosition()+ "" , c.getName())
              );
          rel.setUsage(c.getUsage());
          usageMap.put(elm.getId()+"-"+c.getId(), c.getUsage());
          used.add(rel);
        }
      }

    }
    if (elm.getBinding() != null) {
      Set<RelationShip> bindingDependencies = bindingService
          .collectDependencies(new ReferenceIndentifier(elm.getId(), Type.DATATYPE), elm.getBinding(),usageMap);
      used.addAll(bindingDependencies);
    }
    return used;
  }



}
