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

import gov.nist.hit.hl7.igamt.common.base.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.PublicationInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;


/**
 *
 * @author Maxence Lefort on Feb 21, 2018.
 */
public class PrimitiveDatatype extends Datatype {



  public PrimitiveDatatype() {
    super();
    // TODO Auto-generated constructor stub
  }

  public PrimitiveDatatype(String id, String version, String name, PublicationInfo publicationInfo,
      DomainInfo domainInfo, String username, String comment, String description, String preDef,
      String postDef, String ext, String purposeAndUse, ResourceBinding resourceBinding) {
    // super(id, version, name, publicationInfo, domainInfo, username, comment, description, preDef,
    // postDef, ext, purposeAndUse, resourceBinding);
    // TODO Auto-generated constructor stub
  }

  @Override
  public PrimitiveDatatype clone() {

    PrimitiveDatatype clone = new PrimitiveDatatype();
    clone.setComment(this.getComment());
    clone.setCreatedFrom(this.getId().getId());
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
