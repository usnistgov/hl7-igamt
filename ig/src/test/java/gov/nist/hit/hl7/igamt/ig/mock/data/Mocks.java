package gov.nist.hit.hl7.igamt.ig.mock.data;

import gov.nist.hit.hl7.igamt.common.base.domain.Usage;

import gov.nist.hit.hl7.igamt.ig.mock.utils.ConformanceProfileMockBuilder;
import gov.nist.hit.hl7.igamt.ig.mock.utils.DatatypeMockBuilder;
import gov.nist.hit.hl7.igamt.ig.mock.utils.SegmentMockBuilder;

public class Mocks {
	public static DatatypeMockBuilder ST() {
		return new DatatypeMockBuilder()
				.asHL7()
				.withId("ST")
				.withNameAndVersion("ST", "2.5.1");
	}
	public static DatatypeMockBuilder DT() {
		return new DatatypeMockBuilder()
				.asHL7()
				.withId("DT")
				.withNameAndVersion("DT", "2.5.1");
	}
	public static DatatypeMockBuilder DTM() {
		return new DatatypeMockBuilder()
				.asHL7()
				.withId("DTM")
				.withNameAndVersion("DTM", "2.5.1");
	}
	public static DatatypeMockBuilder NM() {
		return new DatatypeMockBuilder()
				.asHL7()
				.withId("NM")
				.withNameAndVersion("NM", "2.5.1");
	}
	public static DatatypeMockBuilder VARIES() {
		return new DatatypeMockBuilder()
				.asHL7()
				.withId("VARIES")
				.withNameAndVersion("VARIES", "2.5.1");
	}
	public static DatatypeMockBuilder DECOY() {
		return new DatatypeMockBuilder()
				.asHL7()
				.withId("DECOY")
				.withNameAndVersion("DECOY", "2.5.1");
	}
	public static DatatypeMockBuilder THREE_COMPONENT_CODED_CWE() {
		return new DatatypeMockBuilder()
				.asHL7()
				.asComplex()
				.withId("THREE_COMPONENT_CODED_CWE")
				.withNameAndVersion("CWE", "2.5.1")
				.addComponentWithLength("Component 1 (Code)", Usage.R, "0", "10", "ST")
				.addComponentWithLength("Component 2 (Text)", Usage.O, "0", "10", "ST")
				.addComponentWithLength("Component 3 (Code System)", Usage.R, "0", "10", "ST");
	}
	public static DatatypeMockBuilder TWO_LEVEL_DATATYPE() {
		return new DatatypeMockBuilder()
				.asHL7()
				.asComplex()
				.withId("TWO_LEVEL_DATATYPE")
				.withNameAndVersion("TL", "2.5.1")
				.addComponentWithLength("Component 1 (Coded)", Usage.R, "0", "30", "THREE_COMPONENT_CODED_CWE")
				.addComponentWithLength("Component 2 (Primitive)", Usage.R, "0", "10", "DT");
	}
	public static SegmentMockBuilder ONE_FIELD_TOP_SEGMENT() {
		return new SegmentMockBuilder()
				.asHL7()
				.withId("ONE_FIELD_TOP_SEGMENT")
				.withNameAndVersion("TOP", "2.5.1")
				.addFieldNoLength("Field 1 (Primitive)", Usage.R, 1, "1", "ST");
	}
	public static SegmentMockBuilder TWO_FIELD_TST_SEGMENT() {
		return new SegmentMockBuilder()
				.asHL7()
				.withId("TWO_FIELD_TST_SEGMENT")
				.withNameAndVersion("TST", "2.5.1")
				.addFieldNoLength("Field 1 (Complex)", Usage.R, 1, "1", "TWO_LEVEL_DATATYPE")
				.addFieldNoLength("Field 2 (Primitive)", Usage.R, 1, "1", "DTM");
	}
	public static SegmentMockBuilder VARIES_SEGMENT() {
		return new SegmentMockBuilder()
				.asHL7()
				.withId("VARIES_SEGMENT")
				.withNameAndVersion("VAR", "2.5.1")
				.addFieldNoLength("Field 1 (Primitive)", Usage.R, 1, "1", "ST")
				.addFieldNoLength("Field 2 (Primitive)", Usage.R, 1, "1", "VARIES")
				.addFieldNoLength("Field 3 (Primitive)", Usage.R, 1, "1", "NM");
	}
	public static ConformanceProfileMockBuilder PROFILE_WITH_ONE_TOP_SEG_ONE_GRP_ONE_TST_SEG() {
		return new ConformanceProfileMockBuilder()
				.withId("PROFILE_WITH_ONE_TOP_SEG_ONE_GRP_ONE_TST")
				.addSegRef("TOP", Usage.R, 1, "1", "ONE_FIELD_TOP_SEGMENT")
				.createGroup("GRP_1", Usage.R, 1, "*")
					.withNestedGroup("NESTED_GRP", Usage.R, 1, "*")
						.withSegRef("TST", Usage.R, 1, "1", "TWO_FIELD_TST_SEGMENT")
					.closeNestedGroup()
				.closeGroup();
	}
	public static ConformanceProfileMockBuilder PROFILE_WITH_VARIES() {
		return new ConformanceProfileMockBuilder()
				.withId("PROFILE_WITH_VARIES")
				.addSegRef("TOP", Usage.R, 1, "1", "ONE_FIELD_TOP_SEGMENT")
				.createGroup("GRP_1", Usage.R, 1, "*")
				.withNestedGroup("NESTED_GRP", Usage.R, 1, "*")
				.withSegRef("VAR", Usage.R, 1, "1", "VARIES_SEGMENT")
				.closeNestedGroup()
				.closeGroup();
	}
}
