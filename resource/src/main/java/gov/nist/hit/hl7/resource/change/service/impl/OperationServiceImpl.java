package gov.nist.hit.hl7.resource.change.service.impl;

import java.util.Collection;

import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.exception.ForbiddenOperationException;
import gov.nist.hit.hl7.resource.change.service.OperationService;

@Service
public class OperationServiceImpl implements OperationService {

	@Override
	public void verifySave(Resource resource) throws ForbiddenOperationException {
		if(resource.getDomainInfo().getScope().equals(Scope.HL7STANDARD) || resource.getId().startsWith("HL7")) {
			throw new ForbiddenOperationException("Cannot save HL7 RESOURCES");
		}
		
	}

	@Override
	public void verifyDelete(Resource resource) throws ForbiddenOperationException {
		if(resource.getDomainInfo().getScope().equals(Scope.HL7STANDARD) || resource.getId().startsWith("HL7")) {
			throw new ForbiddenOperationException("Cannot save HL7 RESOURCES");
		}
	}

	@Override
	public <T extends Resource> void verifySave(Collection<T> resources) throws ForbiddenOperationException {
		
		for(T res : resources) {
			this.verifySave(res);
		}
	}

}
