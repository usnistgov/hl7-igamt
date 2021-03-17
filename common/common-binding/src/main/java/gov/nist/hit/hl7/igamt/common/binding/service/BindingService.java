package gov.nist.hit.hl7.igamt.common.binding.service;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.RealKey;
import gov.nist.hit.hl7.igamt.common.base.domain.Usage;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
import gov.nist.hit.hl7.igamt.common.base.util.ReferenceIndentifier;
import gov.nist.hit.hl7.igamt.common.base.util.RelationShip;
import gov.nist.hit.hl7.igamt.common.binding.display.DisplayValuesetBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;

public interface BindingService {

  Set<RelationShip> collectDependencies(ReferenceIndentifier parent, ResourceBinding binding, HashMap<String, Usage> usageMap);

  Set<String> processBinding(ResourceBinding binding);
  void substitute(ResourceBinding binding, HashMap<RealKey, String > newKeys);

  void lockConformanceStatements(ResourceBinding binding);
  public StructureElementBinding findAndCreateStructureElementBindingByIdPath(ResourceBinding binding,
      String location);

  /**
   * @param hashSet
   * @return
   */
  Set<ValuesetBinding> convertDisplayValuesetBinding(HashSet<DisplayValuesetBinding> hashSet);

  /**
   * @param binding
   * @param location
   */
  void deleteConformanceStatementById(ResourceBinding binding, String location);
  


}
