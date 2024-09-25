package gov.nist.hit.hl7.igamt.ig.tests.dependencies;

import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetStrength;
import gov.nist.hit.hl7.igamt.common.exception.EntityNotFound;
import gov.nist.hit.hl7.igamt.conformanceprofile.repository.ConformanceProfileRepository;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileDependencyService;
import gov.nist.hit.hl7.igamt.conformanceprofile.wrappers.ConformanceProfileDependencies;
import gov.nist.hit.hl7.igamt.ig.configuration.RunTestConfiguration;
import gov.nist.hit.hl7.igamt.ig.mock.data.Mocks;
import gov.nist.hit.hl7.igamt.ig.mock.model.ResourceSet;
import gov.nist.hit.hl7.igamt.ig.mock.utils.ConformanceProfileMockBuilder;
import gov.nist.hit.hl7.igamt.ig.mock.utils.DatatypeMockBuilder;
import gov.nist.hit.hl7.igamt.ig.mock.utils.SegmentMockBuilder;
import gov.nist.hit.hl7.igamt.ig.mock.utils.SlicingBuilder;
import gov.nist.hit.hl7.igamt.ig.service.TestResourceLoader;
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
public class ConformanceProfileDependenciesTest {

	@Autowired
	private TestResourceLoader testResourceLoader;
	@Autowired
	private ConformanceProfileDependencyService conformanceProfileDependencyService;
	@Autowired
	private ConformanceProfileRepository conformanceProfileRepository;

	@Test
	public void findReferencedSegmentsAndDatatypes() {
		// --- Create Mocks and Load Data
		ResourceSet resources = new ResourceSet()
				.withConformanceProfile(
						Mocks.PROFILE_WITH_ONE_TOP_SEG_ONE_GRP_ONE_TST_SEG().build()
				)
				.withSegments(
						Mocks.ONE_FIELD_TOP_SEGMENT().build(),
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
			ConformanceProfileDependencies dependencies = this.conformanceProfileDependencyService
					.getDependencies(
							conformanceProfileRepository.findOneById("PROFILE_WITH_ONE_TOP_SEG_ONE_GRP_ONE_TST"),
							new DependencyFilter()
					);
			assertTrue(dependencies.getSegments().containsKey("ONE_FIELD_TOP_SEGMENT"));
			assertTrue(dependencies.getSegments().containsKey("TWO_FIELD_TST_SEGMENT"));
			assertTrue(dependencies.getDatatypes().containsKey("TWO_LEVEL_DATATYPE"));
			assertTrue(dependencies.getDatatypes().containsKey("THREE_COMPONENT_CODED_CWE"));
			assertTrue(dependencies.getDatatypes().containsKey("ST"));
			assertTrue(dependencies.getDatatypes().containsKey("DT"));
			assertTrue(dependencies.getDatatypes().containsKey("DTM"));
			assertEquals(0, dependencies.getValuesets().size());
			assertEquals(2, dependencies.getSegments().size());
			assertEquals(5, dependencies.getDatatypes().size());
		} catch(EntityNotFound e) {
			throw new RuntimeException(e);
		}
	}

	@Test
	public void findReferencedValueSetsAllLevels() throws Exception {
		// --- Create Mocks and Load Data
		ResourceSet resources = new ResourceSet()
				.withConformanceProfile(
						((ConformanceProfileMockBuilder) Mocks.PROFILE_WITH_ONE_TOP_SEG_ONE_GRP_ONE_TST_SEG()
						                                      .createResourceBinding()
						                                      .addValueSetBinding("1-1", new ValuesetBinding(ValuesetStrength.R, Collections.singletonList("VS_01")))
						                                      .addValueSetBinding("1", new ValuesetBinding(ValuesetStrength.R, Collections.singletonList("VS_ON_SEG_REF")))
						                                      .addValueSetBinding("2", new ValuesetBinding(ValuesetStrength.R, Collections.singletonList("VS_ON_GROUP")))
						                                      .add()).build()
				)
				.withSegments(
						((SegmentMockBuilder) Mocks.ONE_FIELD_TOP_SEGMENT()
						                           .createResourceBinding()
						                           .addValueSetBinding("1", new ValuesetBinding(ValuesetStrength.R, Collections.singletonList("VS_02")))
						                           .add()).build(),
						((SegmentMockBuilder) Mocks.TWO_FIELD_TST_SEGMENT()
						                           .createResourceBinding()
						                           .addValueSetBinding("2", new ValuesetBinding(ValuesetStrength.R, Collections.singletonList("VS_03")))
						                           .add()).build()
				)
				.withDatatypes(
						((DatatypeMockBuilder) Mocks.TWO_LEVEL_DATATYPE()
						                            .createResourceBinding()
						                            .addValueSetBinding("1", new ValuesetBinding(ValuesetStrength.R, Collections.singletonList("VS_04")))
						                            .add())
								.build(),
						((DatatypeMockBuilder) Mocks.THREE_COMPONENT_CODED_CWE()
						                            .createResourceBinding()
						                            .addValueSetBinding("1", new ValuesetBinding(ValuesetStrength.R, Collections.singletonList("VS_05")))
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
			ConformanceProfileDependencies dependencies = this.conformanceProfileDependencyService
					.getDependencies(
							conformanceProfileRepository.findOneById("PROFILE_WITH_ONE_TOP_SEG_ONE_GRP_ONE_TST"),
							new DependencyFilter()
					);
			assertTrue(dependencies.getSegments().containsKey("ONE_FIELD_TOP_SEGMENT"));
			assertTrue(dependencies.getSegments().containsKey("TWO_FIELD_TST_SEGMENT"));
			assertTrue(dependencies.getDatatypes().containsKey("TWO_LEVEL_DATATYPE"));
			assertTrue(dependencies.getDatatypes().containsKey("THREE_COMPONENT_CODED_CWE"));
			assertTrue(dependencies.getDatatypes().containsKey("ST"));
			assertTrue(dependencies.getDatatypes().containsKey("DT"));
			assertTrue(dependencies.getDatatypes().containsKey("DTM"));
			assertTrue(dependencies.getValuesets().containsKey("VS_01"));
			assertTrue(dependencies.getValuesets().containsKey("VS_02"));
			assertTrue(dependencies.getValuesets().containsKey("VS_03"));
			assertTrue(dependencies.getValuesets().containsKey("VS_04"));
			assertTrue(dependencies.getValuesets().containsKey("VS_05"));
			assertFalse(dependencies.getValuesets().containsKey("VS_ON_SEG_REF")); // Bindings that target a segment ref will not be found by dependency service
			assertFalse(dependencies.getValuesets().containsKey("VS_ON_GROUP")); // Bindings that target a group will not be found by dependency service
			assertEquals(5, dependencies.getValuesets().size());
			assertEquals(2, dependencies.getSegments().size());
			assertEquals(5, dependencies.getDatatypes().size());
		} catch(EntityNotFound e) {
			throw new RuntimeException(e);
		}
	}

	@Test
	public void findReferencedOverriddenValueSetsAllLevels() throws Exception {
		// --- Create Mocks and Load Data
		ResourceSet resources = new ResourceSet()
				.withConformanceProfile(
						((ConformanceProfileMockBuilder) Mocks.PROFILE_WITH_ONE_TOP_SEG_ONE_GRP_ONE_TST_SEG()
						                                      .createResourceBinding()
						                                      .addValueSetBinding("2-1-1-1-1-1", new ValuesetBinding(ValuesetStrength.R, Collections.singletonList("VS_01")))
						                                      .add()).build()
				)
				.withSegments(
						((SegmentMockBuilder) Mocks.ONE_FIELD_TOP_SEGMENT()
						                           .createResourceBinding()
						                           .addValueSetBinding("1", new ValuesetBinding(ValuesetStrength.R, Collections.singletonList("VS_02")))
						                           .add()).build(),
						((SegmentMockBuilder) Mocks.TWO_FIELD_TST_SEGMENT()
						                           .createResourceBinding()
						                           .addValueSetBinding("1-1-1", new ValuesetBinding(ValuesetStrength.R, Collections.singletonList("VS_03")))
						                           .add()).build()
				)
				.withDatatypes(
						((DatatypeMockBuilder) Mocks.TWO_LEVEL_DATATYPE()
						                            .createResourceBinding()
						                            .addValueSetBinding("1-1", new ValuesetBinding(ValuesetStrength.R, Collections.singletonList("VS_04")))
						                            .add())
								.build(),
						((DatatypeMockBuilder) Mocks.THREE_COMPONENT_CODED_CWE()
						                            .createResourceBinding()
						                            .addValueSetBinding("1", new ValuesetBinding(ValuesetStrength.R, Collections.singletonList("VS_05")))
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
			ConformanceProfileDependencies dependencies = this.conformanceProfileDependencyService
					.getDependencies(
							conformanceProfileRepository.findOneById("PROFILE_WITH_ONE_TOP_SEG_ONE_GRP_ONE_TST"),
							new DependencyFilter()
					);
			assertTrue(dependencies.getSegments().containsKey("ONE_FIELD_TOP_SEGMENT"));
			assertTrue(dependencies.getSegments().containsKey("TWO_FIELD_TST_SEGMENT"));
			assertTrue(dependencies.getDatatypes().containsKey("TWO_LEVEL_DATATYPE"));
			assertTrue(dependencies.getDatatypes().containsKey("THREE_COMPONENT_CODED_CWE"));
			assertTrue(dependencies.getDatatypes().containsKey("ST"));
			assertTrue(dependencies.getDatatypes().containsKey("DT"));
			assertTrue(dependencies.getDatatypes().containsKey("DTM"));
			assertTrue(dependencies.getValuesets().containsKey("VS_01"));
			assertTrue(dependencies.getValuesets().containsKey("VS_02"));
			assertTrue(dependencies.getValuesets().containsKey("VS_03"));
			assertTrue(dependencies.getValuesets().containsKey("VS_04"));
			assertTrue(dependencies.getValuesets().containsKey("VS_05"));
			assertEquals(5, dependencies.getValuesets().size());
			assertEquals(2, dependencies.getSegments().size());
			assertEquals(5, dependencies.getDatatypes().size());
		} catch(EntityNotFound e) {
			throw new RuntimeException(e);
		}
	}


	@Test
	public void findReferencedFromDynamicMapping() throws Exception {
		// --- Create Mocks and Load Data
		ResourceSet resources = new ResourceSet()
				.withConformanceProfile(
						Mocks.PROFILE_WITH_VARIES().build()
				)
				.withSegments(
						Mocks.VARIES_SEGMENT()
						     .withDynamicMapping("2", "3", new HashMap<String, String>() {{
							     put("CWE", "CWE_IZ");
							     put("TL", "TWO_LEVEL_DATATYPE");
						     }})
						     .build(),
						Mocks.ONE_FIELD_TOP_SEGMENT().build()
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
			ConformanceProfileDependencies dependencies = this.conformanceProfileDependencyService
					.getDependencies(
							conformanceProfileRepository.findOneById("PROFILE_WITH_VARIES"),
							new DependencyFilter()
					);
			assertTrue(dependencies.getSegments().containsKey("ONE_FIELD_TOP_SEGMENT"));
			assertTrue(dependencies.getSegments().containsKey("VARIES_SEGMENT"));
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
			assertEquals(2, dependencies.getSegments().size());
			assertEquals(7, dependencies.getDatatypes().size());
		} catch(EntityNotFound e) {
			throw new RuntimeException(e);
		}
	}

	@Test
	public void findReferencedFromCoConstraints() throws Exception {

	}

	@Test
	public void findReferencedFromDatatypeSlicing() throws Exception {
		// --- Create Mocks and Load Data
		ResourceSet resources = new ResourceSet()
				.withConformanceProfile(
						Mocks.PROFILE_WITH_VARIES().build()
				)
				.withSegments(
						Mocks.VARIES_SEGMENT()
						     .withSlicing(
								     SlicingBuilder
										     .create().addOccurrenceSlicing("2")
										     .addSlice(1, "TWO_LEVEL_DATATYPE")
										     .addSlice(2, "THREE_COMPONENT_CODED_CWE")
										     .add().build()
						     )
						     .build(),
						Mocks.ONE_FIELD_TOP_SEGMENT().build()
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
			ConformanceProfileDependencies dependencies = this.conformanceProfileDependencyService
					.getDependencies(
							conformanceProfileRepository.findOneById("PROFILE_WITH_VARIES"),
							new DependencyFilter()
					);
			assertTrue(dependencies.getSegments().containsKey("ONE_FIELD_TOP_SEGMENT"));
			assertTrue(dependencies.getSegments().containsKey("VARIES_SEGMENT"));
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

	@Test
	public void findReferencedFromSegmentSlicing() throws Exception {
		// --- Create Mocks and Load Data
		ResourceSet resources = new ResourceSet()
				.withConformanceProfile(
						Mocks.PROFILE_WITH_VARIES()
						     .withSlicing(
								     SlicingBuilder
										     .create().addOccurrenceSlicing("2.1.1")
										     .addSlice(1, "TWO_FIELD_TST_SEGMENT")
										     .add().build()
						     )
						     .build()
				)
				.withSegments(
						Mocks.VARIES_SEGMENT().build(),
						Mocks.ONE_FIELD_TOP_SEGMENT().build(),
						Mocks.TWO_FIELD_TST_SEGMENT().build()
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
						Mocks.DTM().build(),
						Mocks.VARIES().build(),
						Mocks.DECOY().build()
				);
		this.testResourceLoader.loadResourceSet(resources);

		// --- Run test
		try {
			ConformanceProfileDependencies dependencies = this.conformanceProfileDependencyService
					.getDependencies(
							conformanceProfileRepository.findOneById("PROFILE_WITH_VARIES"),
							new DependencyFilter()
					);
			assertTrue(dependencies.getSegments().containsKey("ONE_FIELD_TOP_SEGMENT"));
			assertTrue(dependencies.getSegments().containsKey("VARIES_SEGMENT"));
			assertTrue(dependencies.getSegments().containsKey("TWO_FIELD_TST_SEGMENT"));
			assertTrue(dependencies.getDatatypes().containsKey("THREE_COMPONENT_CODED_CWE"));
			assertTrue(dependencies.getDatatypes().containsKey("TWO_LEVEL_DATATYPE"));
			assertTrue(dependencies.getDatatypes().containsKey("ST"));
			assertTrue(dependencies.getDatatypes().containsKey("DT"));
			assertTrue(dependencies.getDatatypes().containsKey("DTM"));
			assertTrue(dependencies.getDatatypes().containsKey("NM"));
			assertTrue(dependencies.getDatatypes().containsKey("VARIES"));
			assertTrue(dependencies.getValuesets().containsKey("VS_01"));
			assertEquals(1, dependencies.getValuesets().size());
			assertEquals(7, dependencies.getDatatypes().size());
		} catch(EntityNotFound e) {
			throw new RuntimeException(e);
		}
	}


	@After
	public void afterEveryTest() {
		this.testResourceLoader.clear();
	}
}
