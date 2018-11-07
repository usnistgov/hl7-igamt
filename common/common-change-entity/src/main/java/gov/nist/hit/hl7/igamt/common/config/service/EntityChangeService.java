package gov.nist.hit.hl7.igamt.common.config.service;

import java.util.List;

import gov.nist.hit.hl7.igamt.common.change.entity.domain.EntityChangeDomain;

public interface EntityChangeService {
  public List<EntityChangeDomain> findAllByDocumentID(String documentId);

  public List<EntityChangeDomain> findAllByDocumentIdAndTargetId(String documentId,
      String targetId);

  public EntityChangeDomain save(EntityChangeDomain e);
}
