package gov.nist.hit.hl7.igamt.service.impl;

import java.util.Set;

import gov.nist.hit.hl7.igamt.ig.domain.Ig;

public interface CrudService {
	
	
	void addConformanceProfiles(Set<String> ids,Ig ig);
	
	void addSegments(Set<String> ids, Ig ig);

	void addDatatypes(Set<String> ids, Ig ig);

	void addValueSets(Set<String> ids, Ig ig);

	

}
