package gov.nist.hit.hl7.igamt.common.base.service;


import java.util.Map;

public interface RequestScopeCache {
	Map<String, String> getImplementationGuideBindingIdentifierMap(String igId);
}
