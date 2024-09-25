package gov.nist.hit.hl7.igamt.ig.tests.dependencies;

import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetStrength;
import gov.nist.hit.hl7.igamt.common.exception.EntityNotFound;
import gov.nist.hit.hl7.igamt.ig.configuration.RunTestConfiguration;
import gov.nist.hit.hl7.igamt.ig.mock.data.Mocks;
import gov.nist.hit.hl7.igamt.ig.mock.model.ResourceSet;
import gov.nist.hit.hl7.igamt.ig.mock.utils.DatatypeMockBuilder;
import gov.nist.hit.hl7.igamt.ig.mock.utils.SegmentMockBuilder;
import gov.nist.hit.hl7.igamt.ig.mock.utils.SlicingBuilder;
import gov.nist.hit.hl7.igamt.ig.service.TestResourceLoader;
import gov.nist.hit.hl7.igamt.segment.repository.SegmentRepository;
import gov.nist.hit.hl7.igamt.segment.service.SegmentDependencyService;
import gov.nist.hit.hl7.igamt.segment.wrappers.SegmentDependencies;
import gov.nist.hit.hl7.resource.dependency.DependencyFilter;
import org.junit.After;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Collections;
import java.util.HashMap;

import static org.junit.Assert.*;

@RunWith(SpringRunner.class)
@Import({RunTestConfiguration.class})
public class SegmentDependenciesTest {

	@Autowired
	private TestResourceLoader testResourceLoader;
	@Autowired
	private SegmentDependencyService segmentDependencyService;
	@Autowired
	private SegmentRepository segmentRepository;

	@Test
	public void findReferencedDatatypesInFieldsAndComponentsAndSubComponents() {
		// --- Create Mocks and Load Data
		ResourceSet resources = new ResourceSet()
				.withSegments(
						Mocks.TWO_FIELD_TST_SEGMENT().build()
				)
				.withDatatypes(
						Mocks.TWO_LEVEL_DATATYPE().build(),
						Mocks.THREE_COMPONENT_CODED_CWE().build(),
						Mocks.ST().build(),
						Mocks.DT().build(),
						Mocks.DTM().build(),
						Mocks.DECOY().build()
				);
		this.testResourceLoader.loadResourceSet(resources);

		// --- Run test
		try {
			SegmentDependencies dependencies = this.segmentDependencyService
					.getDependencies(
							segmentRepository.findOneById("TWO_FIELD_TST_SEGMENT"),
							new DependencyFilter()
					);
			assertTrue(dependencies.getDatatypes().containsKey("THREE_COMPONENT_CODED_CWE"));
			assertTrue(dependencies.getDatatypes().containsKey("TWO_LEVEL_DATATYPE"));
			assertTrue(dependencies.getDatatypes().containsKey("ST"));
			assertTrue(dependencies.getDatatypes().containsKey("DT"));
			assertTrue(dependencies.getDatatypes().containsKey("DTM"));
			assertEquals(0, dependencies.getValuesets().size());
			assertEquals(5, dependencies.getDatatypes().size());
		} catch(EntityNotFound e) {
			throw new RuntimeException(e);
		}
	}

	@Test
	public void findReferencedValueSetsInFieldComponentSubComponent() throws Exception {
		// --- Create Mocks and Load Data
		ResourceSet resources = new ResourceSet()
				.withSegments(
						((SegmentMockBuilder) Mocks.TWO_FIELD_TST_SEGMENT()
						                           .createResourceBinding()
						                           .addValueSetBinding("2", new ValuesetBinding(ValuesetStrength.R, Collections.singletonList("VS_01")))
						                           .addValueSetBinding("3", new ValuesetBinding(ValuesetStrength.R, Collections.singletonList("VS_FIELD_NOT_EXISTS")))
						                           .add()).build()
				)
				.withDatatypes(
						((DatatypeMockBuilder) Mocks.TWO_LEVEL_DATATYPE()
						                            .createResourceBinding()
						                            .addValueSetBinding("1", new ValuesetBinding(ValuesetStrength.R, Collections.singletonList("VS_02")))
						                            .add())
								.build(),
						((DatatypeMockBuilder) Mocks.THREE_COMPONENT_CODED_CWE()
						                            .createResourceBinding()
						                            .addValueSetBinding("1", new ValuesetBinding(ValuesetStrength.R, Collections.singletonList("VS_03")))
						                            .add())
								.build(),
						Mocks.ST().build(),
						Mocks.DT().build(),
						Mocks.DTM().build(),
						Mocks.DECOY().build()
				);
		this.testResourceLoader.loadResourceSet(resources);
		// --- Run test
		try {
			SegmentDependencies dependencies = this.segmentDependencyService
					.getDependencies(
							segmentRepository.findOneById("TWO_FIELD_TST_SEGMENT"),
							new DependencyFilter()
					);
			assertTrue(dependencies.getDatatypes().containsKey("THREE_COMPONENT_CODED_CWE"));
			assertTrue(dependencies.getDatatypes().containsKey("TWO_LEVEL_DATATYPE"));
			assertTrue(dependencies.getDatatypes().containsKey("ST"));
			assertTrue(dependencies.getDatatypes().containsKey("DT"));
			assertTrue(dependencies.getDatatypes().containsKey("DTM"));
			assertTrue(dependencies.getValuesets().containsKey("VS_01"));
			assertTrue(dependencies.getValuesets().containsKey("VS_02"));
			assertTrue(dependencies.getValuesets().containsKey("VS_03"));
			assertFalse(dependencies.getValuesets().containsKey("VS_FIELD_NOT_EXISTS")); // Binding on a field that does not exist will not be found by dependency service
			assertEquals(3, dependencies.getValuesets().size());
			assertEquals(5, dependencies.getDatatypes().size());
		} catch(EntityNotFound e) {
			throw new RuntimeException(e);
		}
	}

	@Test
	public void findReferencedValueSetsFromNestedBindingsComponentSubComponent() throws Exception {
		// --- Create Mocks and Load Data
		ResourceSet resources = new ResourceSet()
				.withSegments(
						((SegmentMockBuilder) Mocks.TWO_FIELD_TST_SEGMENT()
						                           .createResourceBinding()
						                           .addValueSetBinding("1-1", new ValuesetBinding(ValuesetStrength.R, Collections.singletonList("VS_01")))
						                           .add()).build()
				)
				.withDatatypes(
						((DatatypeMockBuilder) Mocks.TWO_LEVEL_DATATYPE()
						                            .createResourceBinding()
						                            .addValueSetBinding("1-3", new ValuesetBinding(ValuesetStrength.R, Collections.singletonList("VS_02")))
						                            .add())
								.build(),
						Mocks.THREE_COMPONENT_CODED_CWE().build(),
						Mocks.ST().build(),
						Mocks.DT().build(),
						Mocks.DTM().build(),
						Mocks.DECOY().build()
				);
		this.testResourceLoader.loadResourceSet(resources);
		// --- Run test
		try {
			SegmentDependencies dependencies = this.segmentDependencyService
					.getDependencies(
							segmentRepository.findOneById("TWO_FIELD_TST_SEGMENT"),
							new DependencyFilter()
					);
			assertTrue(dependencies.getDatatypes().containsKey("THREE_COMPONENT_CODED_CWE"));
			assertTrue(dependencies.getDatatypes().containsKey("TWO_LEVEL_DATATYPE"));
			assertTrue(dependencies.getDatatypes().containsKey("ST"));
			assertTrue(dependencies.getDatatypes().containsKey("DT"));
			assertTrue(dependencies.getDatatypes().containsKey("DTM"));
			assertTrue(dependencies.getValuesets().containsKey("VS_01"));
			assertTrue(dependencies.getValuesets().containsKey("VS_02"));
			assertEquals(2, dependencies.getValuesets().size());
			assertEquals(5, dependencies.getDatatypes().size());
		} catch(EntityNotFound e) {
			throw new RuntimeException(e);
		}
	}

	@Test
	public void findReferencedValueSetsFromOverriddenLocationSubComponent() throws Exception {
		// --- Create Mocks and Load Data
		ResourceSet resources = new ResourceSet()
				.withSegments(
						((SegmentMockBuilder) Mocks.TWO_FIELD_TST_SEGMENT()
						                           .createResourceBinding()
						                           .addValueSetBinding("1-1-1", new ValuesetBinding(ValuesetStrength.R, Collections.singletonList("VS_01")))
						                           .add()).build()
				)
				.withDatatypes(
						((DatatypeMockBuilder) Mocks.TWO_LEVEL_DATATYPE()
						                            .createResourceBinding()
						                            .addValueSetBinding("1-1", new ValuesetBinding(ValuesetStrength.R, Collections.singletonList("VS_02")))
						                            .add())
								.build(),
						((DatatypeMockBuilder) Mocks.THREE_COMPONENT_CODED_CWE()
						                            .createResourceBinding()
						                            .addValueSetBinding("1", new ValuesetBinding(ValuesetStrength.R, Collections.singletonList("VS_03")))
						                            .add())
								.build(),
						Mocks.ST().build(),
						Mocks.DT().build(),
						Mocks.DTM().build(),
						Mocks.DECOY().build()
				);
		this.testResourceLoader.loadResourceSet(resources);
		// --- Run test
		try {
			SegmentDependencies dependencies = this.segmentDependencyService
					.getDependencies(
							segmentRepository.findOneById("TWO_FIELD_TST_SEGMENT"),
							new DependencyFilter()
					);
			assertTrue(dependencies.getDatatypes().containsKey("THREE_COMPONENT_CODED_CWE"));
			assertTrue(dependencies.getDatatypes().containsKey("TWO_LEVEL_DATATYPE"));
			assertTrue(dependencies.getDatatypes().containsKey("ST"));
			assertTrue(dependencies.getDatatypes().containsKey("DT"));
			assertTrue(dependencies.getDatatypes().containsKey("DTM"));
			assertTrue(dependencies.getValuesets().containsKey("VS_01"));
			assertTrue(dependencies.getValuesets().containsKey("VS_02"));
			assertTrue(dependencies.getValuesets().containsKey("VS_03"));
			assertEquals(3, dependencies.getValuesets().size());
			assertEquals(5, dependencies.getDatatypes().size());
		} catch(EntityNotFound e) {
			throw new RuntimeException(e);
		}
	}

	@Test
	public void findReferencedDatatypesAndValueSetsFromDynamicMapping() throws Exception {
		// --- Create Mocks and Load Data
		ResourceSet resources = new ResourceSet()
				.withSegments(
						Mocks.VARIES_SEGMENT()
						     .withDynamicMapping("2", "3", new HashMap<String, String>() {{
								 put("CWE", "CWE_IZ");
							     put("TL", "TWO_LEVEL_DATATYPE");
						     }})
						     .build()
				)
				.withDatatypes(
						Mocks.ST().build(),
						Mocks.DT().build(),
						Mocks.VARIES().build(),
						Mocks.NM().build(),
						((DatatypeMockBuilder) Mocks.THREE_COMPONENT_CODED_CWE()
						                            .createResourceBinding()
						                            .addValueSetBinding("1", new ValuesetBinding(ValuesetStrength.R, Collections.singletonList("VS_01")))
						                            .add())
								.withId("CWE_IZ")
								.build(),
						((DatatypeMockBuilder) Mocks.TWO_LEVEL_DATATYPE()
						                            .createResourceBinding()
						                            .addValueSetBinding("1-1", new ValuesetBinding(ValuesetStrength.R, Collections.singletonList("VS_02")))
						                            .add())
								.build(),
						((DatatypeMockBuilder) Mocks.THREE_COMPONENT_CODED_CWE()
						                            .createResourceBinding()
						                            .addValueSetBinding("1", new ValuesetBinding(ValuesetStrength.R, Collections.singletonList("VS_03")))
						                            .add())
								.build(),
						Mocks.DECOY().build()
				);
		this.testResourceLoader.loadResourceSet(resources);

		// --- Run test
		try {
			SegmentDependencies dependencies = this.segmentDependencyService
					.getDependencies(
							segmentRepository.findOneById("VARIES_SEGMENT"),
							new DependencyFilter()
					);
			assertTrue(dependencies.getDatatypes().containsKey("THREE_COMPONENT_CODED_CWE"));
			assertTrue(dependencies.getDatatypes().containsKey("CWE_IZ"));
			assertTrue(dependencies.getDatatypes().containsKey("TWO_LEVEL_DATATYPE"));
			assertTrue(dependencies.getDatatypes().containsKey("ST"));
			assertTrue(dependencies.getDatatypes().containsKey("DT"));
			assertTrue(dependencies.getDatatypes().containsKey("NM"));
			assertTrue(dependencies.getDatatypes().containsKey("VARIES"));
			assertTrue(dependencies.getValuesets().containsKey("VS_01"));
			assertTrue(dependencies.getValuesets().containsKey("VS_02"));
			assertTrue(dependencies.getValuesets().containsKey("VS_03"));
			assertEquals(3, dependencies.getValuesets().size());
			assertEquals(7, dependencies.getDatatypes().size());
		} catch(EntityNotFound e) {
			throw new RuntimeException(e);
		}
	}

	@Test
	public void findReferencedDatatypesAndValueSetsFromSlicing() throws Exception {
		// --- Create Mocks and Load Data
		ResourceSet resources = new ResourceSet()
				.withSegments(
						Mocks.VARIES_SEGMENT()
						     .withSlicing(
									 SlicingBuilder
											 .create().addOccurrenceSlicing("2")
											 .addSlice(1, "TWO_LEVEL_DATATYPE")
											 .addSlice(2, "THREE_COMPONENT_CODED_CWE")
											 .add().addOccurrenceSlicing("4")
											 .addSlice(1, "NOT_FOUND_PATH")
											 .add().build()
						     )
						     .build()
				)
				.withDatatypes(
						Mocks.TWO_LEVEL_DATATYPE().build(),
						((DatatypeMockBuilder) Mocks.THREE_COMPONENT_CODED_CWE()
						                            .createResourceBinding()
						                            .addValueSetBinding("1", new ValuesetBinding(ValuesetStrength.R, Collections.singletonList("VS_01")))
						                            .add())
								.build(),
						Mocks.ST().build(),
						Mocks.NM().build(),
						Mocks.DT().build(),
						Mocks.VARIES().build(),
						Mocks.DECOY().build()
				);
		this.testResourceLoader.loadResourceSet(resources);

		// --- Run test
		try {
			SegmentDependencies dependencies = this.segmentDependencyService
					.getDependencies(
							segmentRepository.findOneById("VARIES_SEGMENT"),
							new DependencyFilter()
					);
			assertFalse(dependencies.getDatatypes().containsKey("NOT_FOUND_PATH")); // Slicing on an element's path that does not exist will not be found by dependency service
			assertTrue(dependencies.getDatatypes().containsKey("THREE_COMPONENT_CODED_CWE"));
			assertTrue(dependencies.getDatatypes().containsKey("TWO_LEVEL_DATATYPE"));
			assertTrue(dependencies.getDatatypes().containsKey("ST"));
			assertTrue(dependencies.getDatatypes().containsKey("DT"));
			assertTrue(dependencies.getDatatypes().containsKey("NM"));
			assertTrue(dependencies.getDatatypes().containsKey("VARIES"));
			assertTrue(dependencies.getValuesets().containsKey("VS_01"));
			assertEquals(1, dependencies.getValuesets().size());
			assertEquals(6, dependencies.getDatatypes().size());
		} catch(EntityNotFound e) {
			throw new RuntimeException(e);
		}
	}

	@After
	public void afterEveryTest() {
		this.testResourceLoader.clear();
	}
}
