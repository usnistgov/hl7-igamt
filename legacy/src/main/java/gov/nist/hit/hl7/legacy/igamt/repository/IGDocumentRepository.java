package gov.nist.hit.hl7.legacy.igamt.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.IGDocument;

@Repository("igDocumentRepository")
public interface IGDocumentRepository extends MongoRepository<IGDocument, String> {
}
