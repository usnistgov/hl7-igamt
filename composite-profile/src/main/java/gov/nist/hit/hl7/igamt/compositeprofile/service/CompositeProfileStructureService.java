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

import java.util.List;
import java.util.Set;
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

  public List<CompositeProfileStructure> findByIdIn(Set<String> ids);
  
  void applyChanges(CompositeProfileStructure pc, List<ChangeItemDomain> cItems)
      throws ApplyChangeException;
  
  List<CompositeProfileStructure> saveAll(Set<CompositeProfileStructure> compositeProfileStructures);

}
