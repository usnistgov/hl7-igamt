package gov.nist.hit.hl7.igamt.profilecomponent.domain.property;

import gov.nist.hit.hl7.igamt.segment.domain.Field;

public interface ApplyField {
	void onField(Field elm);
}
