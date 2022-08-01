package gov.nist.hit.hl7.igamt.workspace.service;

import java.util.List;

import gov.nist.hit.hl7.igamt.common.base.exception.ForbiddenOperationException;
import gov.nist.hit.hl7.igamt.workspace.domain.Workspace;
import gov.nist.hit.hl7.igamt.workspace.domain.WorkspaceAccessType;
import gov.nist.hit.hl7.igamt.workspace.model.WorkspaceDisplayInfo;
import gov.nist.hit.hl7.igamt.workspace.model.WorkspaceListItem;

public interface WorkspaceService {

	Workspace findById(String id);

	Workspace create(Workspace workspace);

	Workspace save(Workspace workspace) throws ForbiddenOperationException;

	List<Workspace> findAll();

	void delete(Workspace workspace) throws ForbiddenOperationException;

	List<Workspace> findByAccessType(WorkspaceAccessType public1);

	List<Workspace> findByAccessTypeAndUsername(WorkspaceAccessType private1, String username);

	List<Workspace> findShared(String username);

	List<Workspace> findByAll();

	List<WorkspaceListItem> convertToDisplayList(List<Workspace> workspaces);

	WorkspaceDisplayInfo convertToDispalyInfo(Workspace workspace);
	
}
