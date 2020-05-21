package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;

import java.util.Map;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.binding.domain.ExternalSingleCode;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatement;
import gov.nist.hit.hl7.igamt.constraints.domain.Predicate;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.ConstraintExportConfiguration;
import nu.xom.Element;

public interface ConstraintSerializationService {
	
	  public Element serializeConstraints(Set<ConformanceStatement> conformanceStatements, Map<String,Predicate> predicates,  ConstraintExportConfiguration constraintExportConfiguration);
	
	  public Element serializeConformanceStatement(ConformanceStatement conformanceStatement);
	  
	  public Element serializePredicate(Predicate predicate, String location);


//	  public Element serializeExternalSingleCode(ExternalSingleCode externalSingleCode);


}
