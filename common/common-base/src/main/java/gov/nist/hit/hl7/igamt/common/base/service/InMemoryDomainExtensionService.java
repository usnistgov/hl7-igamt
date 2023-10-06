package gov.nist.hit.hl7.igamt.common.base.service;

import java.util.List;

import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.service.impl.DataExtension;

public interface InMemoryDomainExtensionService {
	
	// --- Used by repositories
	<T extends Resource> T findById(String id, Class<T> as);
	<T extends Resource> List<T> getAll(Class<T> as);
	
	// --- Extending
	String getToken();
	<T extends Resource> void put(String token, List<T> resource);
	void clear(String token);
	String put(DataExtension extension);
	String put(DataExtension extension, Resource context);

}
