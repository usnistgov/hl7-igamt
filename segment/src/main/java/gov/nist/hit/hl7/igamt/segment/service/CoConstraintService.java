package gov.nist.hit.hl7.igamt.segment.service;

import java.util.Map;

import gov.nist.hit.hl7.igamt.coconstraints.domain.CoConstraintTable;
import gov.nist.hit.hl7.igamt.common.base.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.segment.serialization.exception.CoConstraintSaveException;

public interface CoConstraintService {

  public CoConstraintTable getLatestCoConstraintForSegment(String id);

  public CoConstraintTable clone(Map<String, CompositeKey> datatypes,
      Map<String, CompositeKey> valueSets, CompositeKey segmentId, CoConstraintTable cc);

  public Map<String, CompositeKey> references(CoConstraintTable cc);

  public CoConstraintTable saveCoConstraintForSegment(String id, CoConstraintTable cc, String user)
      throws CoConstraintSaveException;

}
