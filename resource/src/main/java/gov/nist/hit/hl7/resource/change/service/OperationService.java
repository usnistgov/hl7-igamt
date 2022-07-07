package gov.nist.hit.hl7.resource.change.service;

import java.util.Collection;

import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.exception.ForbiddenOperationException;

public interface OperationService {
	
	public void verifySave(Resource resource) throws ForbiddenOperationException;
	
	public void verifyDelete(Resource resource) throws ForbiddenOperationException;

    public  <T extends Resource> void verifySave(Collection<T> resources) throws ForbiddenOperationException;
}
