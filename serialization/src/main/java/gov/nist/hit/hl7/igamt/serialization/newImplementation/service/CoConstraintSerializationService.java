package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;

import org.springframework.stereotype.Service;


import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintTable;
import nu.xom.Element;

@Service
public interface CoConstraintSerializationService {
	public Element SerializeCoConstraintVerbose(CoConstraintTable coConstraintsTable);
	public Element SerializeCoConstraintCompact(CoConstraintTable coConstraintsTable);

}
