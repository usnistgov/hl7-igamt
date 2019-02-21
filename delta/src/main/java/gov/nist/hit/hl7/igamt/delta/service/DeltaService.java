package gov.nist.hit.hl7.igamt.delta.service;

import gov.nist.diff.domain.DeltaObject;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.ConformanceProfileStructureDisplay;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DatatypeStructureDisplay;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentStructureDisplay;

public interface DeltaService {

  DeltaObject<ConformanceProfileStructureDisplay> conformanceProfileDelta(String idA, String idB)
      throws Exception;

  DeltaObject<SegmentStructureDisplay> segmentDelta(String idA, String idB) throws Exception;

  DeltaObject<DatatypeStructureDisplay> datatypeDelta(String idA, String idB) throws Exception;

}
