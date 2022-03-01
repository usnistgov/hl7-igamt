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
package gov.nist.hit.hl7.igamt.coconstraints.service;

import java.util.HashMap;
import java.util.List;
import java.util.Set;

import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraint;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintBinding;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintCell;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGroup;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintTable;
import gov.nist.hit.hl7.igamt.coconstraints.wrappers.CoConstraintsDependencies;
import gov.nist.hit.hl7.igamt.common.base.domain.RealKey;
import gov.nist.hit.hl7.igamt.common.base.util.ReferenceIndentifier;
import gov.nist.hit.hl7.igamt.common.base.util.RelationShip;
import gov.nist.hit.hl7.igamt.common.exception.EntityNotFound;
import gov.nist.hit.hl7.igamt.datatype.wrappers.DatatypeDependencies;
import gov.nist.hit.hl7.resource.dependency.DependencyFilter;
import gov.nist.hit.hl7.resource.dependency.DependencyService;

/**
 * @author Abdelghani El Ouakili
 *
 */
public interface CoConstraintDependencyService extends DependencyService< CoConstraintGroup, CoConstraintsDependencies> {


  void process(CoConstraintGroup ccGroup, CoConstraintsDependencies used, DependencyFilter filter) throws EntityNotFound;

  void process(CoConstraint cc, CoConstraintsDependencies used, DependencyFilter filter) throws EntityNotFound;

  void process(CoConstraintCell cell, DatatypeDependencies used, DependencyFilter filter) throws EntityNotFound;

  void updateDepenedencies(CoConstraintTable value, HashMap<RealKey, String> newKeys);

  void updateDepenedencies(CoConstraintCell cell, HashMap<RealKey, String> newKeys);

  Set<RelationShip> collectDependencies(ReferenceIndentifier parent,
      List<CoConstraintBinding> coConstraintsBindings);




}
