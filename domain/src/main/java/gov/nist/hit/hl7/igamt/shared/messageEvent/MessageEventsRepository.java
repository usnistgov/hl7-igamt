package gov.nist.hit.hl7.igamt.shared.messageEvent;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface MessageEventsRepository extends MongoRepository<MessageEvents, String> {

}
