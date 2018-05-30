package gov.nist.hit.hl7.igamt.common.config.service;

import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.config.domain.Config;

@Service
public interface ConfigService {

  public Config findOne();

  public Config save(Config shared);

}
