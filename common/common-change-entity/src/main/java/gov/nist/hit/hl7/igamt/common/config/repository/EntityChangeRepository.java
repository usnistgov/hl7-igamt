package gov.nist.hit.hl7.igamt.common.config.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import gov.nist.hit.hl7.igamt.common.change.entity.domain.EntityChangeDomain;

@Repository
public interface EntityChangeRepository extends MongoRepository<EntityChangeDomain, String> {
  List<EntityChangeDomain> findByTargetId(String targetId);

  List<EntityChangeDomain> findByTargetIdAndDocumentId(String targetId, String documentId);

  List<EntityChangeDomain> findByDocumentId(String documentId);
}
