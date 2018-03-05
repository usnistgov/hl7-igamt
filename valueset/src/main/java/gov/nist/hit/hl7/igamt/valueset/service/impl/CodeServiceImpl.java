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

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.valueset.domain.Code;
import gov.nist.hit.hl7.igamt.valueset.repository.CodeRepository;
import gov.nist.hit.hl7.igamt.valueset.service.CodeService;

/**
 *
 * @author Jungyub Woo on Mar 1, 2018.
 */

@Service("codeService")
public class CodeServiceImpl implements CodeService {

  @Autowired
  private CodeRepository codeRepository;

  @Override
  public Code findById(String id) {
    return codeRepository.findOne(id);
  }

  @Override
  public Code create(Code code) {
    code.setId(new ObjectId().toString());
    code = codeRepository.save(code);
    return code;
  }

  @Override
  public Code save(Code code) {
    code = codeRepository.save(code);
    return code;
  }

  @Override
  public void delete(Code code) {
    codeRepository.delete(code);
  }

  @Override
  public void delete(String id) {
    codeRepository.delete(id);
  }

}
