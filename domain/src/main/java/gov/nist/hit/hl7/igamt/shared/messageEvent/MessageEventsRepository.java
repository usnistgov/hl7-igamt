package gov.nist.hit.hl7.igamt.shared.messageEvent;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import gov.nist.hit.hl7.igamt.shared.domain.CompositeKey;
@Repository
public interface MessageEventsRepository extends MongoRepository<MessageEvent, CompositeKey> {

	List<MessageEvent> findByHl7Version(String hl7Version);
}
