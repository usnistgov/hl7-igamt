package gov.nist.hit.hl7.igamt.web.app.workspace;

import java.util.*;

import gov.nist.hit.hl7.auth.util.requests.FindUserResponse;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage;
import gov.nist.hit.hl7.igamt.web.app.model.WorkspaceDocumentCopy;
import gov.nist.hit.hl7.igamt.web.app.model.WorkspaceDocumentMove;
import gov.nist.hit.hl7.igamt.web.app.model.WorkspaceDocumentPublish;
import gov.nist.hit.hl7.igamt.workspace.domain.WorkspaceMetadata;
import gov.nist.hit.hl7.igamt.workspace.domain.WorkspaceUser;
import gov.nist.hit.hl7.igamt.workspace.model.*;
import gov.nist.hit.hl7.igamt.workspace.exception.CreateRequestException;
import gov.nist.hit.hl7.igamt.workspace.exception.WorkspaceForbidden;
import gov.nist.hit.hl7.igamt.workspace.exception.WorkspaceNotFound;
import gov.nist.hit.hl7.igamt.workspace.service.WorkspaceDocumentManagementService;
import gov.nist.hit.hl7.igamt.workspace.service.WorkspaceUserManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import gov.nist.hit.hl7.igamt.common.base.exception.ForbiddenOperationException;
import gov.nist.hit.hl7.igamt.common.base.service.CommonService;
import gov.nist.hit.hl7.igamt.workspace.domain.Workspace;
import gov.nist.hit.hl7.igamt.workspace.service.WorkspaceService;

import javax.servlet.http.HttpServletRequest;

@RestController
public class WorkspaceController {

	@Autowired
	WorkspaceService workspaceService;
	@Autowired
	private WorkspaceUserManagementService workspaceUserManagementService;
	@Autowired
	private WorkspaceDocumentManagementService workspaceDocumentManagementService;
	@Autowired
	CommonService commonService;

	@RequestMapping(value = "/api/workspace/create", method = RequestMethod.POST, produces = {
	"application/json" })
	public ResponseMessage<String> createWorkspace(
			@RequestBody WorkspaceCreateRequest workspaceCreateRequest,
			Authentication authentication
	) throws CreateRequestException {
		Workspace ws = this.workspaceService.createWorkspace(workspaceCreateRequest, authentication.getName());
		return new ResponseMessage<>(ResponseMessage.Status.SUCCESS, "Workspace Created Successfully",  ws.getId(), ws.getId(), new Date());
	}

	@RequestMapping(value = "/api/workspaces", method = RequestMethod.GET, produces = { "application/json" })
	public @ResponseBody List<WorkspaceListItem> getUserIG(Authentication authentication,
			@RequestParam("type") WorkspaceListType type) throws ForbiddenOperationException {
		String username = authentication.getPrincipal().toString();
		List<Workspace> workspaces = new ArrayList<>();
		if (type == null || type.equals(WorkspaceListType.MEMBER)) {
			workspaces = workspaceService.findByMember(username);
		} if (type.equals(WorkspaceListType.PENDING)) {
			workspaces = workspaceUserManagementService.getUserInvitations(username);
		} else if (type.equals(WorkspaceListType.ALL)) {
			commonService.checkAuthority(authentication, "ADMIN");
			workspaces = workspaceService.findAll();
		}
		return workspaceService.convertToDisplayList(workspaces, type.equals(WorkspaceListType.PENDING));
	}

	@RequestMapping(value = "/api/workspace/pending-count", method = RequestMethod.GET, produces = { "application/json" })
	public @ResponseBody WorkspacePendingNumber getWorkspacePendingCount(Authentication authentication) throws ForbiddenOperationException {
		String username = authentication.getPrincipal().toString();
		List<Workspace> workspaces = workspaceUserManagementService.getUserInvitations(username);
		WorkspacePendingNumber workspacePendingNumber = new WorkspacePendingNumber();
		workspacePendingNumber.setCount(workspaces != null ? workspaces.size() : 0);
		return workspacePendingNumber;
	}

	@RequestMapping(value = "/api/workspace/{id}/state", method = RequestMethod.GET, produces = { "application/json" })
	@ResponseBody
	public WorkspaceInfo getWorkspaceInfo(
			Authentication authentication,
			@PathVariable("id") String id
	) throws WorkspaceForbidden, WorkspaceNotFound {
		String username = authentication.getPrincipal().toString();
		return workspaceService.getWorkspaceInfo(id, username);
	}

	@RequestMapping(value = "/api/workspace/{id}/add-folder", method = RequestMethod.POST, produces = { "application/json" })
	@ResponseBody
	public ResponseMessage<String> getWorkspaceInfo(
			Authentication authentication,
			@PathVariable("id") String id,
			@RequestBody AddFolderRequest addFolderRequest
	) throws Exception {
		String username = authentication.getPrincipal().toString();
		workspaceService.createFolder(id, addFolderRequest, username);
		return new ResponseMessage<>(ResponseMessage.Status.SUCCESS, "Folder Created Successfully",  id, new Date());
	}

	@RequestMapping(value = "/api/workspace/{id}/folder/{folderId}", method = RequestMethod.POST, produces = { "application/json" })
	@ResponseBody
	public ResponseMessage<String> getWorkspaceInfo(
			Authentication authentication,
			@PathVariable("id") String id,
			@PathVariable("folderId") String folderId,
			@RequestBody AddFolderRequest addFolderRequest
	) throws Exception {
		String username = authentication.getPrincipal().toString();
		workspaceService.updateFolder(id, folderId, addFolderRequest, username);
		return new ResponseMessage<>(ResponseMessage.Status.SUCCESS, "Folder Updated Successfully",  id, new Date());
	}

	@RequestMapping(value = "/api/workspace/{id}/folder/{folderId}", method = RequestMethod.GET, produces = { "application/json" })
	@ResponseBody
	public FolderContent getFolderContent(
			Authentication authentication,
			@PathVariable("id") String id,
			@PathVariable("folderId") String folderId
	) throws Exception {
		String username = authentication.getPrincipal().toString();
		return workspaceService.getFolderContent(id, folderId, username);
	}

	@RequestMapping(value = "/api/workspace/{id}/folder/{folderId}", method = RequestMethod.DELETE, produces = { "application/json" })
	@ResponseBody
	public ResponseMessage<String> deleteFolderContent(
			Authentication authentication,
			@PathVariable("id") String id,
			@PathVariable("folderId") String folderId
	) throws Exception {
		String username = authentication.getPrincipal().toString();
		workspaceService.deleteFolder(id, folderId, username);
		return new ResponseMessage<>(ResponseMessage.Status.SUCCESS, "Folder Deleted Successfully",  id, new Date());

	}

	@RequestMapping(value = "/api/workspace/{id}/home", method = RequestMethod.POST, produces = { "application/json" })
	@ResponseBody
	public ResponseMessage<String> saveHomeContent(
			Authentication authentication,
			@PathVariable("id") String id,
			@RequestBody HomeContentWrapper homeContent
	) throws Exception {
		String username = authentication.getPrincipal().toString();
		Workspace ws = workspaceService.saveHomeContent(id, homeContent, username);
		return new ResponseMessage<>(ResponseMessage.Status.SUCCESS, "Home Page Saved Successfully", id, ws.getHomePageContent(), new Date());
	}

	@RequestMapping(value = "/api/workspace/{id}/metadata", method = RequestMethod.POST, produces = { "application/json" })
	@ResponseBody
	public ResponseMessage<WorkspaceMetadata> saveMetadata(
			Authentication authentication,
			@PathVariable("id") String id,
			@RequestBody  WorkspaceMetadataWrapper metadata
	) throws Exception {
		String username = authentication.getPrincipal().toString();
		Workspace ws = workspaceService.saveMetadata(id, metadata, username);
		return new ResponseMessage<>(ResponseMessage.Status.SUCCESS, "Metadata Saved Successfully", id, ws.getMetadata(), new Date());
	}

	@RequestMapping(value = "/api/workspace/{id}/users", method = RequestMethod.GET, produces = { "application/json" })
	@ResponseBody
	public Set<WorkspaceUser> getUsers(
			@PathVariable("id") String id
	) throws Exception {
		Workspace workspace = this.workspaceService.findById(id);
		if(workspace != null) {
			if(workspace.getUserAccessInfo().getUsers() == null) {
				return new HashSet<>();
			} else {
				return workspace.getUserAccessInfo().getUsers();
			}
		} else {
			throw new WorkspaceNotFound(id);
		}
	}

	@RequestMapping(value = "/api/workspace/{id}/users/add", method = RequestMethod.POST, produces = { "application/json" })
	@ResponseBody
	public ResponseMessage<WorkspaceUser> addUser(
			Authentication authentication,
			@PathVariable("id") String id,
			@RequestBody  AddUserRequest addUserRequest,
			HttpServletRequest request
	) throws Exception {
		String current = authentication.getPrincipal().toString();
		FindUserResponse findUserResponse = this.workspaceUserManagementService.getUserByUsernameOrEmail(addUserRequest.getValue(), addUserRequest.isEmail(), request);
		if(findUserResponse.isExists()) {
			WorkspaceUser user = this.workspaceUserManagementService.invite(id, current, findUserResponse.getUsername(), addUserRequest.getPermissions());
			return new ResponseMessage<>(ResponseMessage.Status.SUCCESS, "Invitation sent successfully", id, user, new Date());
		} else {
			return new ResponseMessage<>(ResponseMessage.Status.FAILED, "User does not exist", id, null, new Date());
		}
	}

	@RequestMapping(value = "/api/workspace/{id}/users/accept", method = RequestMethod.POST, produces = { "application/json" })
	@ResponseBody
	public ResponseMessage<WorkspaceUser> acceptInvite(
			Authentication authentication,
			@PathVariable("id") String id
	) throws Exception {
		String current = authentication.getPrincipal().toString();
		this.workspaceUserManagementService.acceptInvitation(id, current);
		return new ResponseMessage<>(ResponseMessage.Status.SUCCESS, "Invitation accepted", id, null, new Date());
	}

	@RequestMapping(value = "/api/workspace/{id}/users/decline", method = RequestMethod.POST, produces = { "application/json" })
	@ResponseBody
	public ResponseMessage<WorkspaceUser> declineInvite(
			Authentication authentication,
			@PathVariable("id") String id
	) throws Exception {
		String current = authentication.getPrincipal().toString();
		this.workspaceUserManagementService.declineInvitation(id, current);
		return new ResponseMessage<>(ResponseMessage.Status.SUCCESS, "Invitation declined", id, null, new Date());
	}

	@RequestMapping(value = "/api/workspace/{id}/users/update", method = RequestMethod.POST, produces = { "application/json" })
	@ResponseBody
	public ResponseMessage<WorkspaceUser> updateUser(
			Authentication authentication,
			@PathVariable("id") String id,
			@RequestBody UserUpdateRequest userUpdateRequest
	) throws Exception {
		String current = authentication.getPrincipal().toString();
		Workspace workspace = this.workspaceService.findById(id);
		this.workspaceUserManagementService.changeUserPermissions(workspace, current, userUpdateRequest.getUsername(), userUpdateRequest.getPermissions());
		return new ResponseMessage<>(ResponseMessage.Status.SUCCESS, "User Updated Successfully", id, null, new Date());
	}

	@RequestMapping(value = "/api/workspace/{id}/users/delete", method = RequestMethod.POST, produces = { "application/json" })
	@ResponseBody
	public ResponseMessage<WorkspaceUser> deleteUser(
			Authentication authentication,
			@PathVariable("id") String id,
			@RequestBody UserDeleteRequest userDeleteRequest
	) throws Exception {
		String current = authentication.getPrincipal().toString();
		Workspace workspace = this.workspaceService.findById(id);
		this.workspaceUserManagementService.removeUser(workspace, current, userDeleteRequest.getUsername());
		return new ResponseMessage<>(ResponseMessage.Status.SUCCESS, "User Updated Successfully", id, null, new Date());
	}

	@RequestMapping(value = "/api/workspace/clone", method = RequestMethod.POST, produces = { "application/json" })
	@ResponseBody
	@PreAuthorize("AccessResource(#workspaceDocumentCopy.getDocumentType().toString(), #workspaceDocumentCopy.getDocumentId(), READ)")
	public WorkspaceInfo clone(
			@RequestBody WorkspaceDocumentCopy workspaceDocumentCopy,
			Authentication authentication
	) throws Exception {
		Workspace workspace = workspaceDocumentManagementService.cloneIgAndMoveToWorkspaceLocation(
				workspaceDocumentCopy.getDocumentId(),
				workspaceDocumentCopy.getName(),
				workspaceDocumentCopy.getWorkspaceId(),
				workspaceDocumentCopy.getFolderId(),
				workspaceDocumentCopy.getCopyInfo(),
				authentication.getName()
		);
		return this.workspaceService.getWorkspaceInfo(workspace, authentication.getName());
	}

	@RequestMapping(value = "/api/workspace/move", method = RequestMethod.POST, produces = { "application/json" })
	@ResponseBody
	@PreAuthorize("AccessResource(#workspaceDocumentMove.getDocumentType().toString(), #workspaceDocumentMove.getDocumentId(), WRITE)")
	public WorkspaceInfo clone(
			@RequestBody WorkspaceDocumentMove workspaceDocumentMove,
			Authentication authentication
	) throws Exception {
		Workspace workspace = workspaceDocumentManagementService.moveIg(
				workspaceDocumentMove.getDocumentId(),
				workspaceDocumentMove.getTitle(),
				workspaceDocumentMove.getWorkspaceId(),
				workspaceDocumentMove.getSourceFolderId(),
				workspaceDocumentMove.getFolderId(),
				workspaceDocumentMove.isClone(),
				authentication.getName()
		);
		return this.workspaceService.getWorkspaceInfo(workspace, authentication.getName());
	}

	@RequestMapping(value = "/api/workspace/publish", method = RequestMethod.POST, produces = { "application/json" })
	@ResponseBody
	@PreAuthorize("AccessResource(#workspaceDocumentPublish.getDocumentType().toString(), #workspaceDocumentPublish.getDocumentId(), WRITE)")
	public WorkspaceInfo publish(
			@RequestBody WorkspaceDocumentPublish workspaceDocumentPublish,
			Authentication authentication
	) throws Exception {
		Workspace workspace = workspaceDocumentManagementService.publishIg(
				workspaceDocumentPublish.getDocumentId(),
				workspaceDocumentPublish.getWorkspaceId(),
				workspaceDocumentPublish.getFolderId(),
				workspaceDocumentPublish.getInfo(),
				authentication.getName()
		);
		return this.workspaceService.getWorkspaceInfo(workspace, authentication.getName());
	}

	@RequestMapping(value = "/api/workspace/{wsId}/folder/{folderId}/document/{documentType}/{documentId}", method = RequestMethod.DELETE, produces = { "application/json" })
	@ResponseBody
	@PreAuthorize("AccessResource(#documentType, #documentId, WRITE)")
	public WorkspaceInfo deleteDocument(
			@PathVariable("wsId") String workspaceId,
			@PathVariable("folderId") String folderId,
			@PathVariable("documentId") String documentId,
			@PathVariable("documentType") Type documentType,
			Authentication authentication
	) throws Exception {
		Workspace workspace = workspaceDocumentManagementService.deleteDocumentFromWorkspace(
				documentId,
				workspaceId,
				folderId,
				authentication.getName()
		);
		return this.workspaceService.getWorkspaceInfo(workspace, authentication.getName());
	}


}



