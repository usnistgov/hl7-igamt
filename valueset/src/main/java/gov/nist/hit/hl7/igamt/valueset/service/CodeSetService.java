package gov.nist.hit.hl7.igamt.valueset.service;

import java.util.List;

import gov.nist.hit.hl7.igamt.common.base.exception.ForbiddenOperationException;
import gov.nist.hit.hl7.igamt.common.base.exception.ResourceNotFoundException;
import gov.nist.hit.hl7.igamt.valueset.domain.CodeSet;
import gov.nist.hit.hl7.igamt.valueset.domain.CodeSetVersion;
import gov.nist.hit.hl7.igamt.valueset.model.CodeSetCreateRequest;
import gov.nist.hit.hl7.igamt.valueset.model.CodeSetInfo;
import gov.nist.hit.hl7.igamt.valueset.model.CodeSetListItem;
import gov.nist.hit.hl7.igamt.valueset.model.CodeSetVersionContent;

public interface CodeSetService {

	CodeSet createCodeSet(CodeSetCreateRequest codeSetCreateRequest, String name);

	CodeSetInfo getCodeSetInfo(String id, String username)
			throws ResourceNotFoundException, ForbiddenOperationException;

	CodeSetVersionContent getCodeSetVersionContent(String id, String codeSetVersionId, String username) throws ResourceNotFoundException;

	CodeSetVersion saveCodeSetVersionContent(String id, String versionId, CodeSetVersionContent content, String username) throws ResourceNotFoundException, ForbiddenOperationException;

	List<CodeSet> findByUsername(String username);

	List<CodeSet> findAll();

	List<CodeSetListItem> convertToDisplayList(List<CodeSet> codesets);

	List<CodeSet> findByPrivateAudienceEditor(String username);

	List<CodeSet> findByPrivateAudienceViewer(String username);

	List<CodeSet> findAllPrivateCodeSet();

	CodeSetVersion commit(String id, String versionId, CodeSetVersionContent content, String username)
			throws ResourceNotFoundException, ForbiddenOperationException;

	void addCodeSetVersion(String id) throws ResourceNotFoundException;

	CodeSetVersion findById(String id) throws ResourceNotFoundException;

	List<CodeSet> findByPublicAudienceAndStatusPublished();

	CodeSet saveCodeSetContent(String id, CodeSetInfo content, String username)
			throws ResourceNotFoundException, ForbiddenOperationException;

	void addCodeSetVersion(String id, CodeSetVersion from) throws ResourceNotFoundException;

	void updateViewers(String id, List<String> viewers, String username) throws Exception;

	void deleteCodeSet(String id, String username) throws ForbiddenOperationException, ResourceNotFoundException;

	CodeSet publish(String id, String username) throws ForbiddenOperationException, ResourceNotFoundException;
	
	CodeSet clone(String id, String username) throws ForbiddenOperationException, ResourceNotFoundException;

	CodeSetVersionContent getLatestCodeVersion(String parentId) throws ResourceNotFoundException;



}
