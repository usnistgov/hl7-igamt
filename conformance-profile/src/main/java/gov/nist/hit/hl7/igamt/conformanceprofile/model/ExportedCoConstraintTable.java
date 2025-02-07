package gov.nist.hit.hl7.igamt.conformanceprofile.model;

import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintTable;

public class ExportedCoConstraintTable {
	String contextPathId;
	String segmentPathId;
	String conformanceProfileId;
	CoConstraintTable table;

	public String getConformanceProfileId() {
		return conformanceProfileId;
	}

	public void setConformanceProfileId(String conformanceProfileId) {
		this.conformanceProfileId = conformanceProfileId;
	}

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

	public CoConstraintTable getTable() {
		return table;
	}

	public void setTable(CoConstraintTable table) {
		this.table = table;
	}
}
