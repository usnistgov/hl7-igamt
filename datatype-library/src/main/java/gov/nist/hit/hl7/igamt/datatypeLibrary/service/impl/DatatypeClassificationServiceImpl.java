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
package gov.nist.hit.hl7.igamt.datatypeLibrary.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.datatypeLibrary.domain.DatatypeClassification;
import gov.nist.hit.hl7.igamt.datatypeLibrary.domain.DatatypeVersionGroup;
import gov.nist.hit.hl7.igamt.datatypeLibrary.repository.DatatypeClassificationRepository;
import gov.nist.hit.hl7.igamt.datatypeLibrary.service.DatatypeClassificationService;

/**
 * @author ena3
 *
 */
@Service
public class DatatypeClassificationServiceImpl implements DatatypeClassificationService {

  @Autowired
  DatatypeClassificationRepository datatypeClassificationRepository;

  /*
   * (non-Javadoc)
   * 
   * @see gov.nist.hit.hl7.igamt.datatypeLibrary.service.DatatypeClassificationService#findById()
   */
  @Override
  public DatatypeClassification findById(String id) {
    // TODO Auto-generated method stub
    return datatypeClassificationRepository.findById(id).get();
  }

  /*
   * (non-Javadoc)
   * 
   * @see gov.nist.hit.hl7.igamt.datatypeLibrary.service.DatatypeClassificationService#deleteById()
   */
  @Override
  public void deleteById(String id) {
    // TODO Auto-generated method stub
    datatypeClassificationRepository.deleteById(id);
  }

  /*
   * (non-Javadoc)
   * 
   * @see
   * gov.nist.hit.hl7.igamt.datatypeLibrary.service.DatatypeClassificationService#save(gov.nist.hit.
   * hl7.igamt.datatypeLibrary.domain.DatatypeClassification)
   */
  @Override
  public DatatypeClassification save(DatatypeClassification elm) {
    // TODO Auto-generated method stub
    return datatypeClassificationRepository.save(elm);
  }

  /*
   * (non-Javadoc)
   * 
   * @see gov.nist.hit.hl7.igamt.datatypeLibrary.service.DatatypeClassificationService#findAll()
   */
  @Override
  public List<DatatypeClassification> findAll() {
    // TODO Auto-generated method stub
    return datatypeClassificationRepository.findAll();
  }

  /*
   * (non-Javadoc)
   * 
   * @see gov.nist.hit.hl7.igamt.datatypeLibrary.service.DatatypeClassificationService#deleteAll()
   */
  @Override
  public void deleteAll() {
    // TODO Auto-generated method stub
    datatypeClassificationRepository.deleteAll();
  }

  /*
   * (non-Javadoc)
   * 
   * @see
   * gov.nist.hit.hl7.igamt.datatypeLibrary.service.DatatypeClassificationService#findByName(java.
   * lang.String)
   */
  @Override
  public DatatypeClassification findByName(String name) {
    // TODO Auto-generated method stub
    return datatypeClassificationRepository.findByName(name);
  }

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.datatypeLibrary.service.DatatypeClassificationService#findCompatibility(java.lang.String, java.lang.String)
   */
  @Override
  public List<String> findCompatibility(String name, String version) {
    // TODO Auto-generated method stub
    DatatypeClassification classification= findByName(name);
    for(DatatypeVersionGroup group: classification.getClasses()) {
      for(String v: group.getVersions()) {
        if(v.equals(version)) {
          return group.getVersions();
        }
      }
    }
    return new ArrayList<String>() { 
      { 
        add(version);
      } 
    }; 
  }


}
