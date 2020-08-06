package gov.nist.hit.hl7.igamt.delta.service;

import java.util.HashMap;
import java.util.List;

import gov.nist.diff.domain.DeltaAction;
import gov.nist.hit.hl7.igamt.coconstraints.exception.CoConstraintGroupNotFoundException;
import gov.nist.hit.hl7.igamt.common.base.domain.RealKey;
import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.delta.domain.*;
import gov.nist.hit.hl7.igamt.delta.exception.IGDeltaException;
import gov.nist.hit.hl7.igamt.display.model.IGDisplayInfo;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;

public interface DeltaService {

  <T> EntityDelta<T> computeDelta(Type type, String documentId, String entityId) throws Exception;
  public Delta delta(Type type, String documentId, String entityId) throws CoConstraintGroupNotFoundException;
  public List<StructureDelta> delta(Type type, String entityId) throws IGDeltaException;
  DiffableResult diffable(Type type, String ig, String source, String target);
  public IGDisplayInfo delta(Ig ig, Ig origin) throws IGDeltaException;
  public ResourceDelta delta(Type type, Resource resource);
  public ValuesetDelta valuesetDelta(Valueset valueset);
  DeltaAction summarize(List<StructureDelta> deltaStructure, List<ConformanceStatementDelta> cfs);


}
