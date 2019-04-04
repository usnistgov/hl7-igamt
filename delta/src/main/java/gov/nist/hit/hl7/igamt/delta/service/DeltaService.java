package gov.nist.hit.hl7.igamt.delta.service;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.delta.domain.DiffableResult;
import gov.nist.hit.hl7.igamt.delta.domain.EntityDelta;
import gov.nist.hit.hl7.igamt.delta.domain.IGDelta;

public interface DeltaService {

  <T> EntityDelta<T> computeDelta(Type type, String documentId, String entityId) throws Exception;
  IGDelta computeIgDelta(String IgId) throws Exception;


}
