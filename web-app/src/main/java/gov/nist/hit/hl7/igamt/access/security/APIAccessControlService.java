package gov.nist.hit.hl7.igamt.access.security;

import com.google.common.base.Strings;
import gov.nist.hit.hl7.igamt.access.common.ResourceAccessInfoFetcher;
import gov.nist.hit.hl7.igamt.access.model.AccessLevel;
import gov.nist.hit.hl7.igamt.access.model.AccessToken;
import gov.nist.hit.hl7.igamt.access.model.CodeSetAccessInfo;
import gov.nist.hit.hl7.igamt.api.security.domain.AccessKey;
import gov.nist.hit.hl7.igamt.api.security.repository.AccessKeyRepository;
import gov.nist.hit.hl7.igamt.api.security.service.AccessKeyService;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.access.exception.APIResourceNotFoundException;
import gov.nist.hit.hl7.igamt.common.base.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.util.*;
import java.util.function.Function;

@Service
public class APIAccessControlService {

	private final String AKI_KEY_HEADER = "X-API-KEY";
	@Autowired
	ResourceAccessInfoFetcher resourceAccessInfoFetcher;
	@Autowired
	AccessKeyRepository accessKeyRepository;
	@Autowired
	AccessControlService accessControlService;
	@Autowired
	AccessKeyService accessKeyService;

	public boolean checkResourceAPIAccessPermission(Type type, String id, AccessLevel requested) throws APIResourceNotFoundException {
		try {
			switch(type) {
				case CODESET:
					CodeSetAccessInfo codeSetAccessInfo = resourceAccessInfoFetcher.getCodeSetAccessInfo(id);
					boolean requiresAPIKey = true; // for now, all code sets will require API Key even public ones
					return checkResourceAPIAccess(
							type,
							id,
							requiresAPIKey,
							(token) -> accessControlService.evaluateAccessLevel(
									accessControlService.checkCodeSetAccessPermission(
											codeSetAccessInfo,
											token
									),
									requested
							),
							requested
					);
			}
			return false;
		} catch(ResourceNotFoundException resourceNotFoundException) {
			throw new APIResourceNotFoundException(resourceNotFoundException.getId(), resourceNotFoundException.getType());
		}
	}

	public boolean checkResourceAPIAccess(Type type, String id, boolean requiresAPIKey, Function<AccessToken, Boolean> checkFn, AccessLevel requested) {
		if(requiresAPIKey) {
			AccessKey key = getAccessKey();
			if(key == null || !key.isValid() || !isGranted(type, id, key)) {
				return false;
			}
			AccessToken token = new AccessToken(key.getUsername(), Collections.emptySet());
			return checkFn.apply(token);
		} else {
			return accessControlService.evaluateAccessLevel(L(AccessLevel.READ), requested);
		}
	}

	public boolean isGranted(Type type, String id, AccessKey key) {
		Set<String> grantedResources = key.getResources().get(type);
		return grantedResources != null && grantedResources.contains(id);
	}

	public AccessKey getAccessKey() {
		HttpServletRequest request = getHttpServletRequest();
		String keyHeader = request.getHeader(AKI_KEY_HEADER);
		if(Strings.isNullOrEmpty(keyHeader)) {
			return null;
		} else {
			String keyHash = accessKeyService.getKeyHash(keyHeader);
			return accessKeyRepository.findByToken(keyHash);
		}
	}

	public HttpServletRequest getHttpServletRequest() {
		return ((ServletRequestAttributes) Objects.requireNonNull(RequestContextHolder.getRequestAttributes())).getRequest();
	}

	private Set<AccessLevel> L(AccessLevel... levels) {
		return new HashSet<>(Arrays.asList(levels));
	}
}
