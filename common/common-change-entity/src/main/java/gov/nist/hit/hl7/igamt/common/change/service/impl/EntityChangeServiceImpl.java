package gov.nist.hit.hl7.igamt.common.change.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.change.entity.domain.EntityChangeDomain;
import gov.nist.hit.hl7.igamt.common.change.service.EntityChangeService;

@Service
public class EntityChangeServiceImpl implements EntityChangeService {
  @Autowired
  gov.nist.hit.hl7.igamt.common.change.repository.EntityChangeRepository entityChangeRepository;

  public EntityChangeServiceImpl() {}

  /*
   * (non-Javadoc)
   * 
   * @see
   * gov.nist.hit.hl7.igamt.common.config.service.EntityChangeService#findAllByDocumentID(java.lang.
   * String)
   */
  @Override
  public List<EntityChangeDomain> findAllByDocumentID(String documentId) {
    return this.entityChangeRepository.findByDocumentId(documentId);
  }

  /*
   * (non-Javadoc)
   * 
   * @see
   * gov.nist.hit.hl7.igamt.common.config.service.EntityChangeService#findAllByDocumentIdANDTargetId
   * (java.lang.String, java.lang.String)
   */
  @Override
  public List<EntityChangeDomain> findAllByDocumentIdAndTargetId(String documentId,
      String targetId) {
    return this.entityChangeRepository.findByTargetIdAndDocumentId(targetId, documentId);
  }

  /*
   * (non-Javadoc)
   * 
   * @see
   * gov.nist.hit.hl7.igamt.common.config.service.EntityChangeService#save(gov.nist.hit.hl7.igamt.
   * common.change.entity.domain.EntityChangeDomain)
   */
  @Override
  public EntityChangeDomain save(EntityChangeDomain e) {
    return this.entityChangeRepository.save(e);
  }
}
