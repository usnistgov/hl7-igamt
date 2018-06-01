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

import gov.nist.hit.hl7.igamt.common.base.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.valueset.domain.CodeSystem;
import gov.nist.hit.hl7.igamt.valueset.repository.CodeSystemRepository;
import gov.nist.hit.hl7.igamt.valueset.service.CodeSystemService;

/**
 *
 * @author Jungyub Woo on Mar 1, 2018.
 */

@Service("codeSystemService")
public class CodeSystemServiceImpl implements CodeSystemService {

  @Autowired
  private CodeSystemRepository codeSystemRepository;

  @Override
  public CodeSystem findById(CompositeKey id) {
    return codeSystemRepository.findOne(id);
  }

  @Override
  public CodeSystem create(CodeSystem codeSystem) {
    codeSystem.setId(new CompositeKey());
    codeSystem = codeSystemRepository.save(codeSystem);
    return codeSystem;
  }

  @Override
  public CodeSystem save(CodeSystem codeSystem) {
    codeSystem = codeSystemRepository.save(codeSystem);
    return codeSystem;
  }

  @Override
  public List<CodeSystem> findAll() {
    return codeSystemRepository.findAll();
  }

  @Override
  public void delete(CodeSystem valueset) {
    codeSystemRepository.delete(valueset);
  }

  @Override
  public void delete(CompositeKey id) {
    codeSystemRepository.delete(id);
  }

  @Override
  public void removeCollection() {
    codeSystemRepository.deleteAll();
  }


  @Override
  public List<CodeSystem> findByDomainInfoScopeAndDomainInfoVersionAndIdentifier(String scope,
      String hl7version, String identifier) {
    // TODO Auto-generated method stub
    return codeSystemRepository.findByDomainInfoScopeAndDomainInfoVersionAndIdentifier(scope,
        hl7version, identifier);
  }

  /*
   * (non-Javadoc)
   * 
   * @see gov.nist.hit.hl7.igamt.valueset.service.CodeSystemService#findLatestById(java.lang.String)
   */
  @Override
  public CodeSystem findLatestById(String id) {
    // TODO Auto-generated method stub
    return null;
  }


}
