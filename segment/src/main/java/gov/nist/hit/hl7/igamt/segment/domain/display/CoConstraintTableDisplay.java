package gov.nist.hit.hl7.igamt.segment.domain.display;

import gov.nist.hit.hl7.igamt.coconstraints.domain.CoConstraintTable;
import gov.nist.hit.hl7.igamt.common.base.model.SectionInfo;

public class CoConstraintTableDisplay extends SectionInfo{
	CoConstraintTable data;

	public CoConstraintTable getData() {
		return data;
	}

	public void setData(CoConstraintTable data) {
		this.data = data;
	}
	
}
