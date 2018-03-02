/**
 * 
 * This software was developed at the National Institute of Standards and Technology by employees of
 * the Federal Government in the course of their official duties. Pursuant to title 17 Section 105
 * of the United States Code this software is not subject to copyright protection and is in the
 * public domain. This is an experimental system. NIST assumes no responsibility whatsoever for its
 * use by other parties, and makes no guarantees, expressed or implied, about its quality,
 * reliability, or any other characteristic. We would appreciate acknowledgement if the software is
 * used. This software can be redistributed and/or modified freely provided that any derivative
 * works bear some notice that they are derived from it, and any modified versions bear some notice
 * that they have been modified.
 * 
 */
package gov.nist.hit.hl7.igamt.valueset.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.shared.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.shared.util.CompositeKeyUtil;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.repository.ValuesetRepository;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;

/**
 *
 * @author Jungyub Woo on Mar 1, 2018.
 */

@Service("valuesetService")
public class ValuesetServiceImpl implements ValuesetService {

  @Autowired
  private ValuesetRepository valuesetRepository;
  
  @Override
  public Valueset findById(CompositeKey id) {
    return valuesetRepository.findOne(id);
  }
  
  @Override
  public Valueset create(Valueset valueset) {
    valueset.setId(new CompositeKey());
    valueset = valuesetRepository.save(valueset);
    return valueset;
  }
  
  @Override
  public Valueset createFromLegacy(Valueset valueset, String legacyId) {
    valueset.setId(new CompositeKey(legacyId));
    valueset = valuesetRepository.save(valueset);
    return valueset;
  }

  @Override
  public Valueset save(Valueset valueset) {
    valueset.setId(CompositeKeyUtil.updateVersion(valueset.getId()));
    valueset = valuesetRepository.save(valueset);
    return valueset;
  }

  @Override
  public List<Valueset> findAll() {
    return valuesetRepository.findAll();
  }

  @Override
  public void delete(Valueset valueset) {
    valuesetRepository.delete(valueset);
  }

  @Override
  public void delete(CompositeKey id) {
    valuesetRepository.delete(id);
  }
  
}
