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
package gov.nist.hit.hl7.igamt.compositeprofile.service;

import gov.nist.hit.hl7.igamt.common.exception.EntityNotFound;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.CompositeProfileStructure;
import gov.nist.hit.hl7.igamt.compositeprofile.wrappers.CompositeProfileStructureDependencies;
import gov.nist.hit.hl7.resource.dependency.DependencyFilter;
import gov.nist.hit.hl7.resource.dependency.DependencyService;

/**
 * @author Abdelghani El Ouakili
 *
 */
public interface CompositeProfileDependencyService extends DependencyService<CompositeProfileStructure, CompositeProfileStructureDependencies>  {


  void process(CompositeProfileStructure elm,
      CompositeProfileStructureDependencies compositeProfileStructureDependencies,
      DependencyFilter filter) throws EntityNotFound;

}
