package gov.nist.hit.hl7.igamt.service.impl;

import java.util.Collection;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.Comment;
import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.StructureElement;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.Group;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRefOrGroup;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.service.ModifyingService;
@Service
public class ModifyingServiceImpl implements ModifyingService {

	@Override
	public void cleanResourceNarratives(Resource resource, Map<PropertyType, Boolean> map) {

		if (map.containsKey(PropertyType.PREDEF)) {
			resource.setPreDef(null);
		}
		if (map.containsKey(PropertyType.POSTDEF)) {
			resource.setPostDef(null);
		} 
		if (map.containsKey(PropertyType.AUTHORNOTES)) {
			resource.setAuthorNotes(null);
		}
		if (map.containsKey(PropertyType.USAGENOTES)) {
			resource.setUsageNotes(null);
		} 
		if (map.containsKey(PropertyType.SHORTDESCRIPTION)) {
			resource.setShortDescription(null);
		}
		if (map.containsKey(PropertyType.DESCRIPTION)) {
			resource.setDescription(null);
		}
	}

	@Override
	public  <T extends Resource> void cleanResourcesNarratives(Set<T> resources, Map<PropertyType, Boolean> map) {
		for(T resource:  resources) {
			cleanResourceNarratives(resource, map);
		}
	}

	
	@Override
	public  <T extends StructureElement> void cleanStructureElementNarratives(Set<T> structureElements, Map<PropertyType, Boolean> map) {
		for(T structureElement:  structureElements) {
			cleanStructureElementNarratives(structureElement, map);
		}
	}

	private void cleanStructureElementNarratives(StructureElement structureElement, Map<PropertyType, Boolean> map) {
		if (map.containsKey(PropertyType.COMMENT)) {
			structureElement.setComments(new HashSet<Comment>());
		} 
		if (map.containsKey(PropertyType.DEFINITIONTEXT)) {
			structureElement.setText(null);
		}
		if(structureElement instanceof Group) {
			for(SegmentRefOrGroup child:  ((Group)structureElement).getChildren()) {
				cleanStructureElementNarratives(child, map);
			}
		}
		
	}

	@Override
	public <T extends Resource> void cleanResources(Set<T> resources, Map<PropertyType, Boolean> map) {

		for(T resource:  resources) {
			cleanResourceNarratives(resource, map);
			if(resource instanceof ComplexDatatype) {
				this.cleanStructureElementNarratives(((ComplexDatatype)resource).getComponents(), map);
			}
			if(resource instanceof Segment ) {
				this.cleanStructureElementNarratives(((Segment)resource).getChildren(), map);

			}
			if(resource instanceof ConformanceProfile ) {
				this.cleanStructureElementNarratives(((ConformanceProfile)resource).getChildren(), map);

			}
			
		}
		
	}

}
