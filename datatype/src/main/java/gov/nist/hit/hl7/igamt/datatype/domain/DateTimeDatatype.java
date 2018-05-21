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
package gov.nist.hit.hl7.igamt.datatype.domain;

import java.util.Date;

import gov.nist.hit.hl7.igamt.shared.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.shared.domain.Scope;

/**
 * @author jungyubw
 *
 */
public class DateTimeDatatype extends PrimitiveDatatype {

  private DateTimeConstraints dateTimeConstraints;

  public DateTimeDatatype() {
    super();
  }

  public DateTimeConstraints getDateTimeConstraints() {
    return dateTimeConstraints;
  }

  public void setDateTimeConstraints(DateTimeConstraints dateTimeConstraints) {
    this.dateTimeConstraints = dateTimeConstraints;
  }

  @Override
  public DateTimeDatatype clone() {

    DateTimeDatatype clone = new DateTimeDatatype();
    clone.setComment(this.getComment());
    clone.setCreatedFrom(this.getId().getId());
    clone.setDescription(this.getDescription());
    DomainInfo domainInfo = this.getDomainInfo();
    domainInfo.setScope(Scope.USER);
    clone.setId(null);
    clone.setPostDef(this.getPostDef());
    clone.setPreDef(this.getPreDef());
    clone.setDateTimeConstraints(dateTimeConstraints);
    clone.setName(this.getName());
    clone.setDomainInfo(domainInfo);
    clone.setCreationDate(new Date());
    clone.setUpdateDate(new Date());
    return clone;

  };
}
