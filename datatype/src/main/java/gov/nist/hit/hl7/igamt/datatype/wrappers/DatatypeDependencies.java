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
package gov.nist.hit.hl7.igamt.datatype.wrappers;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.wrappers.DependencyWrapper;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;

/**
 * @author Abdelghani El Ouakili
 *
 */
public class DatatypeDependencies extends DependencyWrapper {
  
  HashMap<String, Datatype> datatypes = new HashMap<String, Datatype>();
  HashMap<String, Boolean> valuesets = new HashMap<String, Boolean>();
  
  public HashMap<String, Datatype> getDatatypes() {
    return datatypes;
  }
  public void setDatatypes(HashMap<String, Datatype> datatypes) {
    this.datatypes = datatypes;
  }
  public HashMap<String, Boolean> getValuesets() {
    return valuesets;
  }
  public void setValuesets(HashMap<String, Boolean> valuesets) {
    this.valuesets = valuesets;
  }

}
