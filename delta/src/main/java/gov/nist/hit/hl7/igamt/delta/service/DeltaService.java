package gov.nist.hit.hl7.igamt.delta.service;

import java.util.HashMap;
import java.util.List;

import gov.nist.diff.domain.DeltaAction;
import gov.nist.hit.hl7.igamt.common.base.domain.RealKey;
import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.delta.domain.ConformanceStatementDelta;
import gov.nist.hit.hl7.igamt.delta.domain.Delta;
import gov.nist.hit.hl7.igamt.delta.domain.DiffableResult;
import gov.nist.hit.hl7.igamt.delta.domain.EntityDelta;
import gov.nist.hit.hl7.igamt.delta.domain.StructureDelta;
import gov.nist.hit.hl7.igamt.delta.domain.ValuesetDelta;
import gov.nist.hit.hl7.igamt.delta.exception.IGDeltaException;
import gov.nist.hit.hl7.igamt.display.model.IGDisplayInfo;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;

public interface DeltaService {

  <T> EntityDelta<T> computeDelta(Type type, String documentId, String entityId) throws Exception;
  public Delta delta(Type type, String documentId, String entityId);
  public List<StructureDelta> delta(Type type, String entityId) throws IGDeltaException;
  DiffableResult diffable(Type type, String ig, String source, String target);
  public IGDisplayInfo delta(Ig ig, Ig origin) throws IGDeltaException;
  public List<StructureDelta> delta(Type type, Resource resource);
  public ValuesetDelta valuesetDelta(Valueset valueset);
  DeltaAction summarize(List<StructureDelta> deltaStructure, List<ConformanceStatementDelta> cfs);


}
