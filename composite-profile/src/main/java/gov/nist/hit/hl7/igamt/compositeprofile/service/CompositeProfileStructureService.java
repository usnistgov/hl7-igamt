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

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.RealKey;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.util.CloneMode;
import gov.nist.hit.hl7.igamt.common.base.util.RelationShip;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.ChangeItemDomain;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.CompositeProfileStructure;
import gov.nist.hit.hl7.resource.change.exceptions.ApplyChangeException;

/**
 * 
 * Created by Jungyub Woo on Feb 20, 2018.
 */
public interface CompositeProfileStructureService {
  public CompositeProfileStructure findById(String id);

  public CompositeProfileStructure create(CompositeProfileStructure compositeProfileStructure);

  public CompositeProfileStructure save(CompositeProfileStructure compositeProfileStructure);

  public List<CompositeProfileStructure> findAll();

  public void delete(CompositeProfileStructure compositeProfileStructure);

  public void delete(String id);

  public void removeCollection();

  public Link cloneCompositeProfile(String string, HashMap<RealKey, String> newKeys, Link l,
      String username, Scope user, CloneMode cloneMode);

  public List<CompositeProfileStructure> findByIdIn(Set<String> ids);

  public Set<RelationShip> collectDependencies(CompositeProfileStructure composite);
  
  void applyChanges(CompositeProfileStructure pc, List<ChangeItemDomain> cItems, String documentId)
      throws ApplyChangeException;

  void updateDependencies(CompositeProfileStructure elm, HashMap<RealKey, String> newKeys);
  
  List<CompositeProfileStructure> saveAll(Set<CompositeProfileStructure> compositeProfileStructures);

}
