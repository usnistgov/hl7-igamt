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
package gov.nist.hit.hl7.igamt.compositeprofile.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.CompositeProfileStructure;
import gov.nist.hit.hl7.igamt.compositeprofile.repository.CompositeProfileStructureRepository;
import gov.nist.hit.hl7.igamt.compositeprofile.service.CompositeProfileStructureService;


/**
 * 
 * Created by Jungyub Woo on Feb 20, 2018.
 */

@Service("compositeProfileStructureService")
public class CompositeProfileStructureServiceImpl implements CompositeProfileStructureService {
  @Autowired
  CompositeProfileStructureRepository compositeProfileStructureRepository;

  @Override
  public CompositeProfileStructure findByKey(CompositeKey key) {
    return compositeProfileStructureRepository.findById(key).get();
  }

  @Override
  public CompositeProfileStructure create(CompositeProfileStructure compositeProfileStructure) {
    compositeProfileStructure.setId(new CompositeKey());
    return compositeProfileStructureRepository.save(compositeProfileStructure);
  }

  @Override
  public CompositeProfileStructure save(CompositeProfileStructure compositeProfileStructure) {
    // compositeProfileStructure
    // .setId(CompositeKeyUtil.updateVersion(compositeProfileStructure.getId()));
    return compositeProfileStructureRepository.save(compositeProfileStructure);
  }

  @Override
  public List<CompositeProfileStructure> findAll() {
    return compositeProfileStructureRepository.findAll();
  }

  @Override
  public void delete(CompositeProfileStructure compositeProfileStructure) {
    compositeProfileStructureRepository.delete(compositeProfileStructure);
  }

  @Override
  public void delete(CompositeKey key) {
    compositeProfileStructureRepository.deleteById(key);
  }

  @Override
  public void removeCollection() {
    compositeProfileStructureRepository.deleteAll();

  }
}
