package gov.nist.hit.hl7.igamt.valueset.service;

import java.util.List;
import java.util.Set;

import gov.nist.hit.hl7.igamt.valueset.domain.Code;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;

public interface FhirHandlerService {
	
	public List<Valueset> getPhinvadsValuesets();
	public Set<Code> getValusetCodes(String oid);
	Set<Code> getValusetCodeForDynamicTable();
}
