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
package gov.nist.hit.hl7.igamt.datatypeLibrary.service;

import java.util.HashMap;
import gov.nist.hit.hl7.igamt.datatype.domain.Component;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.exception.DatatypeNotFoundException;
import gov.nist.hit.hl7.igamt.datatypeLibrary.util.DeltaTreeNode;
import gov.nist.hit.hl7.igamt.datatypeLibrary.util.EvolutionPropertie;

/**
 * @author ena3
 *
 */
public interface EvolutionComparatorService {
  boolean compareDatatypes(Datatype d1, Datatype d2, HashMap<EvolutionPropertie, Boolean> criterias)
      throws DatatypeNotFoundException;

  boolean compareComponent(Component c1, Component c2,
      HashMap<EvolutionPropertie, Boolean> criterias) throws DatatypeNotFoundException;


  DeltaTreeNode getDatatypesDelta(Datatype d1, Datatype d2,
      HashMap<EvolutionPropertie, Boolean> criterias) throws DatatypeNotFoundException;

}