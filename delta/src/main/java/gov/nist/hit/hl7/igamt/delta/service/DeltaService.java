package gov.nist.hit.hl7.igamt.delta.service;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.delta.domain.DiffableResult;
import gov.nist.hit.hl7.igamt.delta.domain.EntityDelta;

public interface DeltaService {

  <T> EntityDelta<T> computeDelta(Type type, String documentId, String entityId) throws Exception;

  DiffableResult diffable(Type type, String ig, String source, String target);

}
