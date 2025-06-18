package gov.nist.hit.hl7.igamt.common.config.service;

import java.util.List;

import gov.nist.hit.hl7.igamt.common.config.domain.UserConfig;

public interface UserConfigService {

	  public UserConfig save(UserConfig config);
	  public List<UserConfig> findByUsername(String s);

	  
}
