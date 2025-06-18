package gov.nist.hit.hl7.igamt.coconstraints.repository;

import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGroup;

import gov.nist.hit.hl7.igamt.common.base.domain.DocumentType;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface CoConstraintGroupRepository extends MongoRepository<CoConstraintGroup, String> {

    public Optional<CoConstraintGroup> findById(String key);
    public List<CoConstraintGroup> findByDocumentInfoDocumentIdAndDocumentInfoType(String documentId, DocumentType type);
    public List<CoConstraintGroup> findByIdIn(Set<String> ids);


}
