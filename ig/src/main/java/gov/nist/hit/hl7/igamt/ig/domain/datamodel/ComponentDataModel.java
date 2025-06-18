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
package gov.nist.hit.hl7.igamt.ig.domain.datamodel;

import java.io.Serializable;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.Comment;
import gov.nist.hit.hl7.igamt.common.binding.domain.ExternalSingleCode;
import gov.nist.hit.hl7.igamt.common.binding.domain.InternalSingleCode;
import gov.nist.hit.hl7.igamt.common.binding.domain.SingleCodeBinding;
import gov.nist.hit.hl7.igamt.constraints.domain.Predicate;
import gov.nist.hit.hl7.igamt.datatype.domain.Component;
import gov.nist.hit.hl7.igamt.service.impl.XMLSerializeServiceImpl;

/**
 * @author jungyubw
 *
 */
public class ComponentDataModel implements Serializable{

  private Component model;

  private DatatypeBindingDataModel datatype;
  private Predicate predicate;
  private List<SingleCodeBinding> singleCodes;
  private Set<ValuesetBindingDataModel> valuesets = new HashSet<ValuesetBindingDataModel>();
  
  public ComponentDataModel(){
    
  }

  public ComponentDataModel(Component c, Predicate predicate,
		  List<SingleCodeBinding> singleCodes, Set<ValuesetBindingDataModel> valuesets, DatatypeBindingDataModel datatype) {
    this.model = c;
    this.predicate = predicate;
    this.setSingleCodes(singleCodes);
    
    
    Set<ValuesetBindingDataModel> newValuesets = new HashSet<ValuesetBindingDataModel>();
    if(valuesets != null) {
        for(ValuesetBindingDataModel item:valuesets) {

        	ValuesetBindingDataModel newItem = XMLSerializeServiceImpl.cloneThroughJson(item);
        	newValuesets.add(newItem);
        }    	
    }

    
    this.valuesets = newValuesets;
    
    this.datatype = datatype;
    
  }

public Component getModel() {
    return model;
  }

  public void setModel(Component model) {
    this.model = model;
  }

  public Predicate getPredicate() {
    return predicate;
  }

  public void setPredicate(Predicate predicate) {
    this.predicate = predicate;
  }

  public Set<ValuesetBindingDataModel> getValuesets() {
    return valuesets;
  }

  public void setValuesets(Set<ValuesetBindingDataModel> valuesets) {
    this.valuesets = valuesets;
  }

  public DatatypeBindingDataModel getDatatype() {
    return datatype;
  }

  public void setDatatype(DatatypeBindingDataModel datatype) {
    this.datatype = datatype;
  }

public List<SingleCodeBinding> getSingleCodes() {
	return singleCodes;
}

public void setSingleCodes(List<SingleCodeBinding> singleCodes) {
	this.singleCodes = singleCodes;
}


}
