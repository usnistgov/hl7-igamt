package gov.nist.hit.hl7.igamt.conformanceprofile.repository.event;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.event.MessageEvent;

@Repository
public interface MessageEventsRepository extends MongoRepository<MessageEvent, String> {

  List<MessageEvent> findByHl7Version(String hl7Version);
}
