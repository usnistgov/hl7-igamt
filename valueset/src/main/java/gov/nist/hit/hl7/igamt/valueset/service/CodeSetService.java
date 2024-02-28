package gov.nist.hit.hl7.igamt.valueset.service;

import gov.nist.hit.hl7.igamt.common.base.exception.ForbiddenOperationException;
import gov.nist.hit.hl7.igamt.common.base.exception.ResourceNotFoundException;
import gov.nist.hit.hl7.igamt.valueset.domain.CodeSet;
import gov.nist.hit.hl7.igamt.valueset.model.CodeSetCreateRequest;
import gov.nist.hit.hl7.igamt.valueset.model.CodeSetInfo;
import gov.nist.hit.hl7.igamt.valueset.model.CodeSetVersionContent;

public interface CodeSetService {

	CodeSet createCodeSet(CodeSetCreateRequest codeSetCreateRequest, String name);

	CodeSetInfo getCodeSetInfo(String id, String username)
			throws ResourceNotFoundException, ForbiddenOperationException;

	CodeSetVersionContent getCodeSetVersionContent(String id, String codeSetVersionId, String username) throws ResourceNotFoundException;


}
