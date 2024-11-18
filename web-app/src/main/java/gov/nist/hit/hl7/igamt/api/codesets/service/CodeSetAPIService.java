package gov.nist.hit.hl7.igamt.api.codesets.service;

import gov.nist.hit.hl7.igamt.access.exception.ResourceNotFoundAPIException;
import gov.nist.hit.hl7.igamt.api.codesets.exception.LatestVersionNotFoundException;
import gov.nist.hit.hl7.igamt.api.codesets.model.CodeSetInfo;
import gov.nist.hit.hl7.igamt.api.codesets.model.CodeSetMetadata;
import gov.nist.hit.hl7.igamt.api.codesets.model.CodeSetQueryResult;
import gov.nist.hit.hl7.igamt.api.security.domain.AccessKey;

import java.util.List;

public interface CodeSetAPIService {
	List<CodeSetInfo> getAllUserAccessCodeSet(AccessKey accessKey);
	CodeSetMetadata getCodeSetMetadata(String codeSetId) throws ResourceNotFoundAPIException;
	CodeSetQueryResult getCodeSetByQuery(String codeSetId, String version, String value) throws ResourceNotFoundAPIException, LatestVersionNotFoundException;
}
