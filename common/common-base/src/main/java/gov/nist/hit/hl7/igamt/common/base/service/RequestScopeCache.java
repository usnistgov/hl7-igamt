package gov.nist.hit.hl7.igamt.common.base.service;


import gov.nist.hit.hl7.igamt.common.base.model.TriStateBoolean;

import java.util.Map;

public interface RequestScopeCache {
	Map<String, String> getImplementationGuideBindingIdentifierMap(String igId);
	TriStateBoolean valueSetHasRequiredUsageCodes(String vsId);
	boolean valueSetExists(String vsId);
}
