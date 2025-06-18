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
package gov.nist.hit.hl7.igamt.ig.domain.verification;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;

/**
 * @author jungyubw
 *
 */
public class DTSegVerificationResult extends VerificationResult{

  private DTSegMetadata metadata;

  public DTSegVerificationResult() {
    super();
  }

  public DTSegVerificationResult(Datatype datatype) {
    super();
    this.setResourceId(datatype.getId());
    this.setResourceType(Type.DATATYPE);
    this.metadata = new DTSegMetadata(datatype);
  }
  
  public DTSegVerificationResult(Segment segment) {
    super();
    this.setResourceId(segment.getId());
    this.setResourceType(Type.SEGMENT);
    this.metadata = new DTSegMetadata(segment);
  }

  public DTSegMetadata getMetadata() {
    return metadata;
  }

  public void setMetadata(DTSegMetadata metadata) {
    this.metadata = metadata;
  }

}
