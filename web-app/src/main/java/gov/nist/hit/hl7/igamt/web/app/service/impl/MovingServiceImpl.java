package gov.nist.hit.hl7.igamt.web.app.service.impl;

import gov.nist.hit.hl7.igamt.access.security.AccessControlService;
import gov.nist.hit.hl7.igamt.common.base.domain.*;
import gov.nist.hit.hl7.igamt.datatypeLibrary.service.DatatypeLibraryService;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.workspace.domain.WorkspacePermissionType;
import gov.nist.hit.hl7.igamt.workspace.exception.WorkspaceForbidden;
import gov.nist.hit.hl7.igamt.workspace.service.WorkspacePermissionService;
import gov.nist.hit.hl7.igamt.workspace.service.WorkspaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.web.app.service.MovingService;
import java.util.HashSet;

@Service
public class MovingServiceImpl implements MovingService {

	@Autowired
	private WorkspacePermissionService workspacePermissionService;
	@Autowired
	WorkspaceService workspaceService;
	@Autowired
	IgService igService;
	@Autowired
	DatatypeLibraryService datatypeLibrary;
	@Autowired
	AccessControlService accessControlService;

	@Override
	public DocumentStructure moveDocumentToWorkspace(String documentId, DocumentType type, String workspaceId, String folderId, String username) throws Exception {
		WorkspacePermissionType permission = this.workspacePermissionService.getWorkspacePermissionTypeByFolder(workspaceId, folderId, username);
		if(permission != null && permission.equals(WorkspacePermissionType.EDIT)) {
			WorkspaceAudience audience = new WorkspaceAudience();
			audience.setWorkspaceId(workspaceId);
			audience.setFolderId(folderId);
			return this.setAudience(documentId, type, audience);
		} else {
			throw new WorkspaceForbidden();
		}
	}

	public DocumentStructure setAudience(String documentId, DocumentType type, Audience audience) throws Exception {
		if (type.equals(DocumentType.IGDOCUMENT)) {
			Ig ig = this.igService.findById(documentId);
			ig.setAudience(audience);
			return this.igService.save(ig);
		} else {
			throw new Exception("Operation not supported");
		}
	}

	@Override
	public void moveDocumentToPrivateScope(String documentId, DocumentType type, String username) throws Exception {
		PrivateAudience audience = new PrivateAudience();
		audience.setEditor(username);
		audience.setViewers(new HashSet<>());
		this.setAudience(documentId, type, audience);
	}
}
