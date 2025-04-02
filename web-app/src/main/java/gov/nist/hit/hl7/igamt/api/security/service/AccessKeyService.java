package gov.nist.hit.hl7.igamt.api.security.service;

import com.google.common.base.Strings;
import gov.nist.hit.hl7.igamt.access.exception.ResourceAccessDeniedException;
import gov.nist.hit.hl7.igamt.access.model.Action;
import gov.nist.hit.hl7.igamt.access.model.AccessToken;
import gov.nist.hit.hl7.igamt.access.security.AccessControlService;
import gov.nist.hit.hl7.igamt.api.security.domain.AccessKey;
import gov.nist.hit.hl7.igamt.api.security.model.AccessKeyDisplay;
import gov.nist.hit.hl7.igamt.api.security.model.GeneratedAccessKey;
import gov.nist.hit.hl7.igamt.api.security.repository.AccessKeyRepository;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;
import gov.nist.hit.hl7.igamt.common.base.exception.ResourceNotFoundException;
import gov.nist.hit.hl7.igamt.valueset.domain.CodeSet;
import gov.nist.hit.hl7.igamt.valueset.repository.CodeSetRepository;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AccessKeyService {

	@Autowired
	AccessControlService accessControlService;
	@Autowired
	AccessKeyRepository accessKeyRepository;
	@Autowired
	CodeSetRepository codeSetRepository;

	public GeneratedAccessKey createAccessKey(String username, String name, Map<Type, Set<String>> resources, boolean expires, int validityDays) throws Exception {
		if(expires && validityDays <= 0) {
			throw new Exception("Number of days before key expires cannot be lower or equals 0");
		}

		if(Strings.isNullOrEmpty(name) || Strings.isNullOrEmpty(name.trim())) {
			throw new Exception("Name is required");
		}

		if(resources == null || resources.size() == 0) {
			throw new Exception("Resources are required");
		}

		AccessToken token = new AccessToken(username, Collections.emptySet());
		for(Type type: resources.keySet()) {
			for(String id: resources.get(type)) {
				if(!accessControlService.checkResourceAccessPermission(type, id, token, Action.READ)) {
					throw new ResourceAccessDeniedException("You do not have permission to access resource " + id + " of type "+ type);
				}
			}
		}

		AccessKey accessKey = new AccessKey();
		if(expires) {
			Date now = new Date();
			now = DateUtils.addDays(now, validityDays);
			accessKey.setExpireAt(now);
		}
		accessKey.setResources(resources);
		accessKey.setUsername(username);
		String plainToken = generateStrongRandomKey();
		accessKey.setToken(getKeyHash(plainToken));
		accessKey.setCreatedAt(new Date());
		accessKey.setName(name);
		accessKeyRepository.save(accessKey);
		return new GeneratedAccessKey(getAccessKeyDisplay(accessKey, username), plainToken);
	}

	public void deleteAccessKey(String keyId) throws Exception {
		AccessKey accessKey = this.accessKeyRepository.findById(keyId).orElseThrow(() -> new Exception("Access key not found."));
		this.accessKeyRepository.delete(accessKey);
	}

	public List<AccessKeyDisplay> getUserAccessKeys(String username) {
		return this.accessKeyRepository.findByUsername(username)
		                               .stream()
		                               .map(k -> this.getAccessKeyDisplay(k, username))
		                               .collect(Collectors.toList());
	}


	private AccessKeyDisplay getAccessKeyDisplay(AccessKey accessKey, String username) {
		AccessToken token = new AccessToken(username, Collections.emptySet());
		AccessKeyDisplay accessKeyDisplay = new AccessKeyDisplay();
		accessKeyDisplay.setId(accessKey.getId());
		accessKeyDisplay.setName(accessKey.getName());
		accessKeyDisplay.setCreatedAt(accessKey.getCreatedAt());
		accessKeyDisplay.setExpireAt(accessKey.getExpireAt());
		Map<Type, Set<DisplayElement>> display = new HashMap<>();
		for(Type type: accessKey.getResources().keySet()) {
			for(String id: accessKey.getResources().get(type)) {
				try {
					if(accessControlService.checkResourceAccessPermission(type, id, token, Action.READ)) {
						// API support only CODE SET
						if(type.equals(Type.CODESET)) {
							CodeSet codeSet = codeSetRepository.findById(id).orElse(null);
							if(codeSet != null) {
								DisplayElement element = new DisplayElement();
								element.setId(codeSet.getId());
								element.setVariableName(codeSet.getName());
								element.setDescription(codeSet.getDescription());
								display.computeIfAbsent(type, k -> new HashSet<>());
								display.get(type).add(element);
							}
						}
					}
				} catch(ResourceNotFoundException ignored) {}
			}
		}
		accessKeyDisplay.setResources(display);
		return accessKeyDisplay;
	}

	private String generateStrongRandomKey() {
		String random = RandomStringUtils.random(32, 0, 0, true, true, null, new SecureRandom());
		return "igamt_" + random;
	}

	public String getKeyHash(String key) {
		return DigestUtils.sha256Hex(key);
	}
}
