package gov.nist.hit.hl7.igamt.ig.repository;

import gov.nist.hit.hl7.igamt.ig.domain.IgXmlExportConfiguration;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IgXmlExportConfigurationRepository extends MongoRepository<IgXmlExportConfiguration, String> {
	IgXmlExportConfiguration findByIgIdAndUsername(String igId, String username);
}
