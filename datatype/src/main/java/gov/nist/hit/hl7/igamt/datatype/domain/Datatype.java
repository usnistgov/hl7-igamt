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


import java.util.Date;

import org.springframework.data.mongodb.core.mapping.Document;

import gov.nist.hit.hl7.igamt.common.base.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;


/**
 *
 * @author Maxence Lefort on Feb 21, 2018.
 */
@Document(collection = "datatype")
public class Datatype extends Resource {


  private String ext;
  private String purposeAndUse;
  private ResourceBinding binding;


  public ResourceBinding getBinding() {
    return binding;
  }

  public void setBinding(ResourceBinding binding) {
    this.binding = binding;
  }

  public Datatype() {}

  public String getExt() {
    return ext;
  }

  public void setExt(String ext) {
    this.ext = ext;
  }

  public String getPurposeAndUse() {
    return purposeAndUse;
  }

  public void setPurposeAndUse(String purposeAndUse) {
    this.purposeAndUse = purposeAndUse;
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
    clone.setBinding(this.binding);
    clone.setComment(this.getComment());
    clone.setCreatedFrom(this.getId());
    clone.setDescription(this.getDescription());
    DomainInfo domainInfo = this.getDomainInfo();
    domainInfo.setScope(Scope.USER);
    clone.setId(null);
    clone.setPostDef(this.getPostDef());
    clone.setPreDef(this.getPreDef());
    clone.setName(this.getName());
    clone.setDomainInfo(domainInfo);
    clone.setCreationDate(new Date());
    clone.setUpdateDate(new Date());
    return clone;

  };

}
