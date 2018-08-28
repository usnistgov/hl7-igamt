package gov.nist.hit.hl7.igamt.common.config.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.config.domain.Config;
import gov.nist.hit.hl7.igamt.common.config.service.ConfigService;

@Service
public class ConfigServiceImpl implements ConfigService {
  @Autowired
  gov.nist.hit.hl7.igamt.common.config.repository.ConfigRepository configRepository;

  public ConfigServiceImpl() {}

  @Override
  public Config findOne() {
    // TODO Auto-generated method stub
    List<Config> constants = configRepository.findAll();
    if (constants != null && !constants.isEmpty()) {
      return constants.get(0);
    } else {
      return null;
    }
  }

  @Override
  public Config save(Config shared) {
    // TODO Auto-generated method stub
    return configRepository.save(shared);
  }

}
