package gov.nist.hit.hl7.igamt.service;

import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.service.RequestScopeCache;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.context.annotation.RequestScope;

import java.util.HashMap;
import java.util.Map;

@Service
@RequestScope
public class IgRequestScopeCache implements RequestScopeCache {

	private final Map<String, Map<String, String>> bindingIdentifiers = new HashMap<>();

	@Autowired
	private IgService igService;
	@Autowired
	private ValuesetService valuesetService;

	@Override
	public Map<String, String> getImplementationGuideBindingIdentifierMap(String igId) {
		if(!bindingIdentifiers.containsKey(igId)) {
			bindingIdentifiers.put(igId, loadImplementationGuideBindingIdentifierMap(igId));
		}
		return bindingIdentifiers.get(igId);
	}

	private Map<String, String> loadImplementationGuideBindingIdentifierMap(String igId) {
		Map<String, String> bindingIdentifiers = new HashMap<>();
		Ig ig = igService.findById(igId);
		String defaultVersion = igService.findDefaultHL7Version(ig);
		if(ig == null) {
			return bindingIdentifiers;
		}
		for(Link link : ig.getValueSetRegistry().getChildren()) {
			Valueset vs = valuesetService.findById(link.getId());
			if(vs != null) {
				if(vs.getDocumentInfo() != null && !vs.getDocumentInfo().getDocumentId().equals(igId)) {
					continue;
				}
				bindingIdentifiers.put(this.valuesetService.findXMLRefIdById(vs, defaultVersion), link.getId());
			}
		}
		return bindingIdentifiers;
	}
}
