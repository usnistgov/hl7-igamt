package gov.nist.hit.hl7.factory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.valueset.service.CodeSystemService;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;


@Service
public class MessageEventFacory {
	@Autowired
	 ConformanceProfileService conformanceProfileService;
	
	@Autowired
	CodeSystemService codeSystemService;
	
	@Autowired
	ValuesetService valueSetService;
	
	
	
	
	
}
