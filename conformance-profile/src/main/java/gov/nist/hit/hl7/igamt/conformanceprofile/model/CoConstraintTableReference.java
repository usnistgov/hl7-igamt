package gov.nist.hit.hl7.igamt.conformanceprofile.model;

public class CoConstraintTableReference {
	String contextPathId;
	String segmentPathId;
	String conformanceProfileId;
	int tableIndex;

	public String getContextPathId() {
		return contextPathId;
	}

	public void setContextPathId(String contextPathId) {
		this.contextPathId = contextPathId;
	}

	public String getSegmentPathId() {
		return segmentPathId;
	}

	public void setSegmentPathId(String segmentPathId) {
		this.segmentPathId = segmentPathId;
	}

	public int getTableIndex() {
		return tableIndex;
	}

	public void setTableIndex(int tableIndex) {
		this.tableIndex = tableIndex;
	}

	public String getConformanceProfileId() {
		return conformanceProfileId;
	}

	public void setConformanceProfileId(String conformanceProfileId) {
		this.conformanceProfileId = conformanceProfileId;
	}
}
