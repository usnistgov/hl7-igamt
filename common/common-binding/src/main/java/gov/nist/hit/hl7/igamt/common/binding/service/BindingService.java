package gov.nist.hit.hl7.igamt.common.binding.service;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.RealKey;
import gov.nist.hit.hl7.igamt.common.base.domain.Usage;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
import gov.nist.hit.hl7.igamt.common.base.util.ReferenceIndentifier;
import gov.nist.hit.hl7.igamt.common.base.util.RelationShip;
import gov.nist.hit.hl7.igamt.common.binding.display.DisplayValuesetBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.InternalSingleCode;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;

public interface BindingService {

  public Set<RelationShip> collectDependencies(ReferenceIndentifier parent, ResourceBinding binding, HashMap<String, Usage> usageMap);

  public Set<String> processBinding(ResourceBinding binding);
  
  public void substitute(ResourceBinding binding, HashMap<RealKey, String > newKeys);

  void lockConformanceStatements(ResourceBinding binding);
  
  public StructureElementBinding findAndCreateStructureElementBindingByIdPath(ResourceBinding binding,
      String location);
  
  public Set<ValuesetBinding> convertDisplayValuesetBinding(HashSet<DisplayValuesetBinding> hashSet);

  public void deleteConformanceStatementById(ResourceBinding binding, String location);

  public void processAndSubstitute(InternalSingleCode internalSingleCode,
      HashMap<RealKey, String> newKeys);


  public void processAndSubstitute(Set<ValuesetBinding> valuesetBindings,
      HashMap<RealKey, String> newKeys);

  public Set<String> processValueSetBinding(Set<ValuesetBinding> valuesetBindings);

  /**
   * @param valueSetBindings
   * @param valuesets
   * @param excluded
   */
  public void processValueSetBinding(Set<ValuesetBinding> valueSetBindings,
      HashMap<String, Boolean> valuesets, Map<RealKey, Boolean> excluded);
  


}
