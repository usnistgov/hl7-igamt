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
package gov.nist.hit.hl7.igamt.datatype.domain.registry;

import gov.nist.hit.hl7.igamt.common.base.domain.Registry;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;

/**
 * @author ena3
 *
 */
public class DatatypeRegistry extends Registry {

  public DatatypeRegistry() {
    super();
    this.type = Type.DATATYPEREGISTRY;
    // TODO Auto-generated constructor stub
  }

  public DatatypeRegistry(Type type) {
    super();
    this.type = type;
    // TODO Auto-generated constructor stub
  }

}
