package gov.nist.hit.hl7.igamt.common.config.service.impl;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.config.domain.Config;
import gov.nist.hit.hl7.igamt.common.config.service.ConfigService;

@Service
public class ConfigServiceImpl implements ConfigService {
  public static final String FROALA_KEY = "froala.key";
  @Autowired
  gov.nist.hit.hl7.igamt.common.config.repository.ConfigRepository configRepository;
  @Autowired
  Environment env;

  public ConfigServiceImpl() {}

  @Override
  public Config findOne() {
    List<Config> constants = configRepository.findAll();
    if (constants != null && !constants.isEmpty()) {
      return this.mergeConfig(constants.get(0));
    } else {
      return null;
    }
  }

  private Config mergeConfig(Config config){

    HashMap<String, Object> froalaConfig =   config.getFroalaConfig();
    froalaConfig.put("key", env.getProperty(FROALA_KEY));
    config.setFroalaConfig(froalaConfig);
    config.setCodesLimit(Integer.valueOf(env.getProperty("codes.limit")));
    config.setPhinvadsReferenceUrl(env.getProperty("codes.phinvadURL"));
    return config;
  }
  @Override
  public Config save(Config shared) {
    return configRepository.save(shared);
  }

@Override
  public boolean isCodedElement(String name) {
	return name.matches("^C(W|N)?E$");
  }

@Override
public void deleteAll() {
	configRepository.deleteAll();
}

}
