package gov.nist.hit.hl7.igamt.valueset.service;

import java.util.List;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.exception.ForbiddenOperationException;
import gov.nist.hit.hl7.igamt.common.base.exception.ResourceNotFoundException;
import gov.nist.hit.hl7.igamt.valueset.domain.Code;
import gov.nist.hit.hl7.igamt.valueset.domain.CodeSet;
import gov.nist.hit.hl7.igamt.valueset.domain.CodeSetVersion;
import gov.nist.hit.hl7.igamt.valueset.exception.CodeSetCommitException;
import gov.nist.hit.hl7.igamt.valueset.model.*;

public interface CodeSetService {

	List<CodeSetVersionMetadata> getCodeSetVersionMetadata(CodeSet codeSet);

	CodeSet createCodeSet(CodeSetCreateRequest codeSetCreateRequest, String name);

	CodeSetInfo getCodeSetInfo(String id, boolean includeInProgress, boolean viewOnly) throws ResourceNotFoundException;

	CodeSetVersionContent getCodeSetVersionContent(String id, String codeSetVersionId) throws ResourceNotFoundException;

	CodeSetVersion saveCodeSetVersionContent(
			String id,
			String versionId,
			Set<Code> codes
	) throws ResourceNotFoundException, ForbiddenOperationException;

	CodeSetVersion commit(
			String codeSetId,
			String codeSetVersionId,
			CodeSetVersionCommit commit
	) throws ResourceNotFoundException, CodeSetCommitException;

	List<CodeSetListItem> convertToDisplayList(List<CodeSet> codeSets);

	List<CodeSet> findByPrivateAudienceEditor(String username);

	List<CodeSet> findByPrivateAudienceViewer(String username);

	List<CodeSet> findAllPrivateCodeSet();

	CodeSet findCodeSetById(String id)throws ResourceNotFoundException;

	CodeSetVersion findCodeSetVersion(String codeSetId, String codeSetVersionId)throws ResourceNotFoundException;

	CodeSetVersion findCodeSetVersionById(String id) throws ResourceNotFoundException;

	List<CodeSet> findByPublicAudienceAndStatusPublished();

	CodeSet saveCodeSetContent(String id, CodeSetInfo content) throws Exception;

	void updateViewers(String id, List<String> viewers) throws Exception;

	void deleteCodeSet(String id) throws ForbiddenOperationException, ResourceNotFoundException;

	CodeSet publish(String id) throws ForbiddenOperationException, ResourceNotFoundException;
	
	CodeSet clone(String id, boolean includeInProgress, String username) throws Exception;

	CodeSetVersionContent getLatestCodeVersion(String codeSetId) throws Exception;

	void deleteCodeSetVersion(String id, String versionId) throws Exception;

	List<CodeDelta> getCodeDelta(String codeSetId, String codeSetVersionId, String targetId) throws Exception;
}
