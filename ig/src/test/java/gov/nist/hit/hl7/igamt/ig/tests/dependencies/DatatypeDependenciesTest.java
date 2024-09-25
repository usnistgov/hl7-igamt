package gov.nist.hit.hl7.igamt.ig.tests.dependencies;

import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetStrength;
import gov.nist.hit.hl7.igamt.common.exception.EntityNotFound;
import gov.nist.hit.hl7.igamt.datatype.repository.DatatypeRepository;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeDependencyService;
import gov.nist.hit.hl7.igamt.datatype.wrappers.DatatypeDependencies;
import gov.nist.hit.hl7.igamt.ig.configuration.RunTestConfiguration;
import gov.nist.hit.hl7.igamt.ig.mock.data.Mocks;
import gov.nist.hit.hl7.igamt.ig.mock.model.ResourceSet;
import gov.nist.hit.hl7.igamt.ig.mock.utils.DatatypeMockBuilder;
import gov.nist.hit.hl7.igamt.ig.service.TestResourceLoader;
import gov.nist.hit.hl7.resource.dependency.DependencyFilter;
import org.junit.After;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.junit4.SpringRunner;
import java.util.Collections;

import static org.junit.Assert.*;

@RunWith(SpringRunner.class)
@Import({RunTestConfiguration.class})
public class DatatypeDependenciesTest {

	@Autowired
	private TestResourceLoader testResourceLoader;
	@Autowired
	private DatatypeDependencyService datatypeDependencyService;
	@Autowired
	private DatatypeRepository datatypeRepository;

	@Test
	public void findReferencedDatatypesInComponentsAndSubComponents() {
		// --- Create Mocks and Load Data
		ResourceSet resources = new ResourceSet()
				.withDatatypes(
						Mocks.TWO_LEVEL_DATATYPE().build(),
						Mocks.THREE_COMPONENT_CODED_CWE().build(),
						Mocks.ST().build(),
						Mocks.DT().build(),
						Mocks.DECOY().build()
				);
		this.testResourceLoader.loadResourceSet(resources);

		// --- Run test
		try {
			DatatypeDependencies dependencies = this.datatypeDependencyService
					.getDependencies(
							datatypeRepository.findOneById("TWO_LEVEL_DATATYPE"),
							new DependencyFilter()
					);
			assertTrue(dependencies.getDatatypes().containsKey("THREE_COMPONENT_CODED_CWE"));
			assertTrue(dependencies.getDatatypes().containsKey("ST"));
			assertTrue(dependencies.getDatatypes().containsKey("DT"));
			assertEquals(0, dependencies.getValuesets().size());
			assertEquals(3, dependencies.getDatatypes().size());
		} catch(EntityNotFound e) {
			throw new RuntimeException(e);
		}
	}

	@Test
	public void findReferencedValueSetsInComponents() throws Exception {
		// --- Create Mocks and Load Data
		ResourceSet resources = new ResourceSet()
				.withDatatypes(
					((DatatypeMockBuilder) Mocks.THREE_COMPONENT_CODED_CWE()
					                           .createResourceBinding()
					                           .addValueSetBinding("3", new ValuesetBinding(ValuesetStrength.R, Collections.singletonList("VS_01")))
					                           .add())
					                           .build(),
					Mocks.ST().build(),
					Mocks.DT().build(),
					Mocks.DECOY().build()
				);
		this.testResourceLoader.loadResourceSet(resources);
		// --- Run test
		try {
			DatatypeDependencies dependencies = this.datatypeDependencyService
					.getDependencies(
							datatypeRepository.findOneById("THREE_COMPONENT_CODED_CWE"),
							new DependencyFilter()
					);
			assertTrue(dependencies.getDatatypes().containsKey("ST"));
			assertTrue(dependencies.getValuesets().containsKey("VS_01"));
			assertEquals(1, dependencies.getValuesets().size());
			assertEquals(1, dependencies.getDatatypes().size());
		} catch(EntityNotFound e) {
			throw new RuntimeException(e);
		}
	}

	@Test
	public void findReferencedValueSetsInSubComponents() throws Exception {
		// --- Create Mocks and Load Data
		ResourceSet resources = new ResourceSet()
				.withDatatypes(
						((DatatypeMockBuilder) Mocks.THREE_COMPONENT_CODED_CWE()
	                            .createResourceBinding()
	                            .addValueSetBinding("3", new ValuesetBinding(ValuesetStrength.R, Collections.singletonList("VS_01")))
								.addValueSetBinding("4", new ValuesetBinding(ValuesetStrength.R, Collections.singletonList("VS_COMP_NOT_EXISTS")))
	                            .add())
								.build(),
						Mocks.TWO_LEVEL_DATATYPE().build(),
						Mocks.ST().build(),
						Mocks.DT().build(),
						Mocks.DECOY().build()
				);
		this.testResourceLoader.loadResourceSet(resources);
		// --- Run test
		try {
			DatatypeDependencies dependencies = this.datatypeDependencyService
					.getDependencies(
							datatypeRepository.findOneById("TWO_LEVEL_DATATYPE"),
							new DependencyFilter()
					);
			assertTrue(dependencies.getDatatypes().containsKey("ST"));
			assertTrue(dependencies.getDatatypes().containsKey("DT"));
			assertTrue(dependencies.getDatatypes().containsKey("THREE_COMPONENT_CODED_CWE"));
			assertTrue(dependencies.getValuesets().containsKey("VS_01"));
			assertFalse(dependencies.getValuesets().containsKey("VS_COMP_NOT_EXISTS")); // Binding on a component that does not exist will not be found by dependency service
			assertEquals(1, dependencies.getValuesets().size());
			assertEquals(3, dependencies.getDatatypes().size());
		} catch(EntityNotFound e) {
			throw new RuntimeException(e);
		}
	}

	@Test
	public void findReferencedValueSetsFromNestedBindings() throws Exception {
		// --- Create Mocks and Load Data
		ResourceSet resources = new ResourceSet()
				.withDatatypes(
						((DatatypeMockBuilder) Mocks.TWO_LEVEL_DATATYPE()
	                            .createResourceBinding()
	                            .addValueSetBinding("1-3", new ValuesetBinding(ValuesetStrength.R, Collections.singletonList("VS_01")))
	                            .add())
								.build(),
						Mocks.THREE_COMPONENT_CODED_CWE().build(),
						Mocks.ST().build(),
						Mocks.DT().build(),
						Mocks.DECOY().build()
				);
		this.testResourceLoader.loadResourceSet(resources);
		// --- Run test
		try {
			DatatypeDependencies dependencies = this.datatypeDependencyService
					.getDependencies(
							datatypeRepository.findOneById("TWO_LEVEL_DATATYPE"),
							new DependencyFilter()
					);
			assertTrue(dependencies.getDatatypes().containsKey("ST"));
			assertTrue(dependencies.getDatatypes().containsKey("DT"));
			assertTrue(dependencies.getDatatypes().containsKey("THREE_COMPONENT_CODED_CWE"));
			assertTrue(dependencies.getValuesets().containsKey("VS_01"));
			assertEquals(1, dependencies.getValuesets().size());
			assertEquals(3, dependencies.getDatatypes().size());
		} catch(EntityNotFound e) {
			throw new RuntimeException(e);
		}
	}

	@Test
	public void findReferencedValueSetsFromSubComponentAndOverriddenByNestedBindings() throws Exception {
		// --- Create Mocks and Load Data
		ResourceSet resources = new ResourceSet()
				.withDatatypes(
						((DatatypeMockBuilder) Mocks.TWO_LEVEL_DATATYPE()
						                            .createResourceBinding()
						                            .addValueSetBinding("1-3", new ValuesetBinding(ValuesetStrength.R, Collections.singletonList("VS_01")))
						                            .add())
								.build(),
						((DatatypeMockBuilder) Mocks.THREE_COMPONENT_CODED_CWE()
						                            .createResourceBinding()
						                            .addValueSetBinding("3", new ValuesetBinding(ValuesetStrength.R, Collections.singletonList("VS_02")))
						                            .add())
								.build(),
						Mocks.ST().build(),
						Mocks.DT().build(),
						Mocks.DECOY().build()
				);
		this.testResourceLoader.loadResourceSet(resources);
		// --- Run test
		try {
			DatatypeDependencies dependencies = this.datatypeDependencyService
					.getDependencies(
							datatypeRepository.findOneById("TWO_LEVEL_DATATYPE"),
							new DependencyFilter()
					);
			assertTrue(dependencies.getDatatypes().containsKey("ST"));
			assertTrue(dependencies.getDatatypes().containsKey("DT"));
			assertTrue(dependencies.getDatatypes().containsKey("THREE_COMPONENT_CODED_CWE"));
			assertTrue(dependencies.getValuesets().containsKey("VS_01"));
			assertTrue(dependencies.getValuesets().containsKey("VS_02"));
			assertEquals(2, dependencies.getValuesets().size());
			assertEquals(3, dependencies.getDatatypes().size());
		} catch(EntityNotFound e) {
			throw new RuntimeException(e);
		}
	}

	@After
	public void afterEveryTest() {
		this.testResourceLoader.clear();
	}
}
