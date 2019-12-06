/**
 * 
 * This software was developed at the National Institute of Standards and Technology by employees of
 * the Federal Government in the course of their official duties. Pursuant to title 17 Section 105
 * of the United States Code this software is not subject to copyright protection and is in the
 * public domain. This is an experimental system. NIST assumes no responsibility whatsoever for its
 * use by other parties, and makes no guarantees, expressed or implied, about its quality,
 * reliability, or any other characteristic. We would appreciate acknowledgement if the software is
 * used. This software can be redistributed and/or modified freely provided that any derivative
 * works bear some notice that they are derived from it, and any modified versions bear some notice
 * that they have been modified.
 * 
 */
package gov.nist.hit.hl7.igamt.export.configuration.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;

/**
 *
 * @author Maxence Lefort on May 8, 2018.
 */
public interface ExportConfigurationRepository extends MongoRepository<ExportConfiguration, String> {
  public ExportConfiguration findOneByUsername(String username);
  public List<ExportConfiguration> findByUsername(String username);
  public ExportConfiguration findOneById(String id);
  public ExportConfiguration findLatestById(String id);
  public ExportConfiguration findOneByDefaultConfigAndUsername(boolean defaultConfig, String username);

  
}
