package gov.nist.hit.hl7.igamt.service;

import com.google.common.base.Strings;
import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.SourceType;
import gov.nist.hit.hl7.igamt.common.base.model.TriStateBoolean;
import gov.nist.hit.hl7.igamt.common.base.service.RequestScopeCache;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.valueset.domain.Code;
import gov.nist.hit.hl7.igamt.valueset.domain.CodeSetReference;
import gov.nist.hit.hl7.igamt.valueset.domain.CodeUsage;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.model.CodeSetVersionContent;
import gov.nist.hit.hl7.igamt.valueset.service.CodeSetService;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.context.annotation.RequestScope;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Service
@RequestScope
public class IgRequestScopeCache implements RequestScopeCache {

	private final Map<String, Map<String, String>> bindingIdentifiers = new HashMap<>();
	private final Map<String, TriStateBoolean> valueSetHasRequiredUsageCodes = new HashMap<>();
	private final Map<String, Boolean> valueSetExists = new HashMap<>();
	private final Map<String, Segment> segmentsCache = new HashMap<>();
	private final Map<String, Datatype> datatypeCache = new HashMap<>();
	private final Map<String, Valueset> valueSetCache = new HashMap<>();

	@Autowired
	private IgService igService;
	@Autowired
	private ValuesetService valuesetService;
	@Autowired
	private DatatypeService datatypeService;
	@Autowired
	private SegmentService segmentService;
	@Autowired
	private CodeSetService codeSetService;

	@Override
	public Map<String, String> getImplementationGuideBindingIdentifierMap(String igId) {
		if(!bindingIdentifiers.containsKey(igId)) {
			bindingIdentifiers.put(igId, loadImplementationGuideBindingIdentifierMap(igId));
		}
		return bindingIdentifiers.get(igId);
	}

	@Override
	public TriStateBoolean valueSetHasRequiredUsageCodes(String vsId) {
		if(!valueSetHasRequiredUsageCodes.containsKey(vsId)) {
			initValueSet(vsId);
		}
		return valueSetHasRequiredUsageCodes.get(vsId);
	}

	@Override
	public boolean valueSetExists(String vsId) {
		if(!valueSetExists.containsKey(vsId)) {
			initValueSet(vsId);
		}
		return valueSetExists.get(vsId);
	}

	@Override
	public <T> T getCacheResource(String resourceId, Class<T> clazz) {
		if(clazz.isAssignableFrom(Segment.class)) {
			if(segmentsCache.containsKey(resourceId)) {
				return clazz.cast(segmentsCache.get(resourceId));
			} else {
				Segment segment = segmentService.findById(resourceId);
				if(segment != null) {
					segmentsCache.put(resourceId, segment);
					return clazz.cast(segment);
				}
			}
		} else if(clazz.isAssignableFrom(Valueset.class)) {
			if(valueSetCache.containsKey(resourceId)) {
				return clazz.cast(valueSetCache.get(resourceId));
			} else {
				Valueset valueset = valuesetService.findById(resourceId);
				if(valueset != null) {
					valueSetCache.put(resourceId, valueset);
					return clazz.cast(valueset);
				}
			}
		} else if(clazz.isAssignableFrom(Datatype.class)) {
			if(datatypeCache.containsKey(resourceId)) {
				return clazz.cast(datatypeCache.get(resourceId));
			} else {
				Datatype datatype = datatypeService.findById(resourceId);
				if(datatype != null) {
					datatypeCache.put(resourceId, datatype);
					return clazz.cast(datatype);
				}
			}
		}
		return null;
	}

	@Override
	public <T> void cacheResource(T resource) {
		if(resource instanceof Segment) {
			this.segmentsCache.put(((Segment) resource).getId(), (Segment) resource);
		} else if(resource instanceof Valueset) {
			this.valueSetCache.put(((Valueset) resource).getId(), (Valueset) resource);
		}  else if(resource instanceof Datatype) {
			this.datatypeCache.put(((Datatype) resource).getId(), (Datatype) resource);
		}
	}

	private Map<String, String> loadImplementationGuideBindingIdentifierMap(String igId) {
		Map<String, String> bindingIdentifiers = new HashMap<>();
		Ig ig = igService.findById(igId);
		String defaultVersion = igService.findDefaultHL7Version(ig);
		if(ig == null) {
			return bindingIdentifiers;
		}
		for(Link link : ig.getValueSetRegistry().getChildren()) {
			Valueset vs = this.getCacheResource(link.getId(), Valueset.class);
			if(vs != null) {
				if(vs.getDocumentInfo() != null && !vs.getDocumentInfo().getDocumentId().equals(igId)) {
					continue;
				}
				bindingIdentifiers.put(this.valuesetService.findXMLRefIdById(vs, defaultVersion), link.getId());
			}
		}
		return bindingIdentifiers;
	}

	private TriStateBoolean initValueSet(String vsId) {
		Valueset vs = this.getCacheResource(vsId, Valueset.class);
		if(vs == null) {
			this.valueSetExists.put(vsId, false);
			return this.valueSetHasRequiredUsageCodes.put(vsId, TriStateBoolean.FALSE);
		}
		this.valueSetExists.put(vsId, true);
		if(vs.getDomainInfo() != null &&
				vs.getDomainInfo().getScope() != null &&
				vs.getDomainInfo().getScope().equals(Scope.HL7STANDARD)) {
			return this.valueSetHasRequiredUsageCodes.put(vsId, TriStateBoolean.FALSE);
		} else if(vs.getSourceType() != null) {
			if(vs.getSourceType().equals(SourceType.INTERNAL)) {
				if(vs.getCodes() != null && !vs.getCodes().isEmpty()) {
					return this.valueSetHasRequiredUsageCodes.put(vsId, this.hasRequiredUsageCodes(vs.getCodes()));
				}
				return this.valueSetHasRequiredUsageCodes.put(vsId, TriStateBoolean.FALSE);
			} else if(vs.getSourceType().equals(SourceType.INTERNAL_TRACKED)) {
				if(vs.getCodeSetReference() == null) {
					return this.valueSetHasRequiredUsageCodes.put(vsId, TriStateBoolean.UNDEFINED);
				} else {
					CodeSetReference reference = vs.getCodeSetReference();
					if(Strings.isNullOrEmpty(reference.getVersionId())) {
						try {
							CodeSetVersionContent content = codeSetService.getLatestCodeVersion(reference.getCodeSetId());
							return this.valueSetHasRequiredUsageCodes.put(vsId, this.hasRequiredUsageCodes(content.getCodes()));
						} catch(Exception e) {
							return this.valueSetHasRequiredUsageCodes.put(vsId, TriStateBoolean.UNDEFINED);
						}
					} else {
						try {
							CodeSetVersionContent content = codeSetService.getCodeSetVersionContent(reference.getCodeSetId(), reference.getVersionId());
							return this.valueSetHasRequiredUsageCodes.put(vsId, this.hasRequiredUsageCodes(content.getCodes()));
						} catch(Exception e) {
							return this.valueSetHasRequiredUsageCodes.put(vsId, TriStateBoolean.UNDEFINED);
						}
					}
				}
			} else {
				return this.valueSetHasRequiredUsageCodes.put(vsId, TriStateBoolean.UNDEFINED);
			}
		}
		return this.valueSetHasRequiredUsageCodes.put(vsId, TriStateBoolean.UNDEFINED);
	}

	private TriStateBoolean hasRequiredUsageCodes(Set<Code> codes) {
		return codes.stream()
		  .filter((code) -> code.getUsage() != null && code.getUsage().equals(CodeUsage.R))
		  .findFirst().map((code) -> TriStateBoolean.TRUE).orElse(TriStateBoolean.FALSE);
	}
}
