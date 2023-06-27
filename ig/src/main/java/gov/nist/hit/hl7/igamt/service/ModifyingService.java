package gov.nist.hit.hl7.igamt.service;

import java.util.Map;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.StructureElement;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;

public interface ModifyingService {

	public void cleanResourceNarratives(Resource resource, Map<PropertyType, Boolean> exclude);

	<T extends Resource> void cleanResourcesNarratives(Set<T> resources, Map<PropertyType, Boolean> map);

	<T extends StructureElement> void cleanStructureElementNarratives(Set<T> structureElements,
			Map<PropertyType, Boolean> map);
	<T extends Resource> void cleanResources(Set<T> resources, Map<PropertyType, Boolean> map);
	
}
