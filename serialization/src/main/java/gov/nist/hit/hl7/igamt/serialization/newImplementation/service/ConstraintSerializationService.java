package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;

import gov.nist.hit.hl7.igamt.common.binding.domain.ExternalSingleCode;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatement;
import gov.nist.hit.hl7.igamt.constraints.domain.Predicate;
import nu.xom.Element;

public interface ConstraintSerializationService {
	
	  public Element serializeConformanceStatement(ConformanceStatement conformanceStatement);
	  
	  public Element serializePredicate(Predicate predicate);

	  public Element serializeExternalSingleCode(ExternalSingleCode externalSingleCode);


}
