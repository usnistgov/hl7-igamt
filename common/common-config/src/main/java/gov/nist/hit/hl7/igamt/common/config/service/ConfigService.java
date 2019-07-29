package gov.nist.hit.hl7.igamt.common.config.service;

import gov.nist.hit.hl7.igamt.common.config.domain.Config;

public interface ConfigService {

  public Config findOne();
  public Config save(Config shared);
  public boolean isCodedElement(String name);
  public void deleteAll();


}
