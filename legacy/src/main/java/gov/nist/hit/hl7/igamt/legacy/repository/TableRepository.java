package gov.nist.hit.hl7.igamt.legacy.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Table;

@Repository("tableRepository")
public interface TableRepository extends MongoRepository<Table, String> {
}
