package gov.nist.hit.hl7.igamt.examples.repository;

import gov.nist.hit.hl7.igamt.examples.domain.IgExampleMessages;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface IgExampleMessagesRepository extends MongoRepository<IgExampleMessages, String> {
}
