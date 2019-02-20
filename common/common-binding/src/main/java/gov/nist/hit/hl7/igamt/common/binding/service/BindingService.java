package gov.nist.hit.hl7.igamt.common.binding.service;

import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.util.ReferenceIndentifier;
import gov.nist.hit.hl7.igamt.common.base.util.RelationShip;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;

public interface BindingService {
	
	Set<RelationShip> collectDependencies(ReferenceIndentifier parent, ResourceBinding binding);

}
