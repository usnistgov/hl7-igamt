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
package gov.nist.hit.hl7.igamt.datatype.domain;


import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.Status;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;


/**
 *
 * @author Maxence Lefort on Feb 21, 2018.
 */
@Document(collection = "datatype")
public class Datatype extends Resource {


  private String ext;
  private ResourceBinding binding;


  public ResourceBinding getBinding() {
    return binding;
  }

  public void setBinding(ResourceBinding binding) {
    this.binding = binding;
  }

  public Datatype() {
	  super();
	  super.setType(Type.DATATYPE);
  }

  public String getExt() {
    return ext;
  }

  public void setExt(String ext) {
    this.ext = ext;
  }

  /*
   * (non-Javadoc)
   * 
   * @see gov.nist.hit.hl7.igamt.shared.domain.AbstractDomain#getLabel()
   */
  @Override
  public String getLabel() {
    if (this.ext != null && !this.ext.isEmpty()) {
      return this.getName() + "_" + this.ext;
    }
    return this.getName();
  }

  @Override
  public Datatype clone() {

    Datatype clone = new Datatype();
    complete(clone);
    return clone;

  }

  public void complete(Datatype elm) {
      super.complete(elm);
      elm.ext = ext;
      elm.binding = binding;
  }

  /**
   * @return
   */
  public String getFixedName() {
    if(this.getStatus() != null && this.getStatus().equals(Status.PUBLISHED)) {
      if(this.getDomainInfo().getScope().equals(Scope.SDTF)) {
        return this.getLabel();
      }
    }
    // TODO Auto-generated method stub
    return this.getName();
  }
}
