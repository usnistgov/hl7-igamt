package gov.nist.hit.hl7.igamt.common.config.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.config.domain.Config;
import gov.nist.hit.hl7.igamt.common.config.domain.UserConfig;
import gov.nist.hit.hl7.igamt.common.config.repository.UserConfigRepository;
import gov.nist.hit.hl7.igamt.common.config.service.UserConfigService;
@Service
public class UserConfigImpl implements UserConfigService {

	@Autowired
	UserConfigRepository userConfigRepository;
	


	@Override
	public UserConfig save(UserConfig config) {
		return this.userConfigRepository.save(config);
	}

	@Override
	public List<UserConfig> findByUsername(String s) {
		return userConfigRepository.findByUsername(s);
	}
	
	

}
