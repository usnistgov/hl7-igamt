package gov.nist.hit.hl7.igamt.ig.tests.dependencies;

import gov.nist.hit.hl7.igamt.datatype.repository.DatatypeRepository;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeDependencyService;
import gov.nist.hit.hl7.igamt.ig.configuration.RunTestConfiguration;
import gov.nist.hit.hl7.igamt.ig.service.TestResourceLoader;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@Import({RunTestConfiguration.class})
public class CoConstraintGroupDependenciesTest {

	@Autowired
	private TestResourceLoader testResourceLoader;
	@Autowired
	private DatatypeDependencyService datatypeDependencyService;
	@Autowired
	private DatatypeRepository datatypeRepository;



}
