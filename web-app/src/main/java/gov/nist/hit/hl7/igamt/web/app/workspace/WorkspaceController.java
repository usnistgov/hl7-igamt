package gov.nist.hit.hl7.igamt.web.app.workspace;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage;
import gov.nist.hit.hl7.igamt.workspace.domain.WorkspaceMetadata;
import gov.nist.hit.hl7.igamt.workspace.model.*;
import gov.nist.hit.hl7.igamt.workspace.exception.CreateRequestException;
import gov.nist.hit.hl7.igamt.workspace.exception.WorkspaceForbidden;
import gov.nist.hit.hl7.igamt.workspace.exception.WorkspaceNotFound;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import gov.nist.hit.hl7.igamt.common.base.domain.AccessType;
import gov.nist.hit.hl7.igamt.common.base.exception.ForbiddenOperationException;
import gov.nist.hit.hl7.igamt.common.base.service.CommonService;
import gov.nist.hit.hl7.igamt.web.app.service.MovingService;
import gov.nist.hit.hl7.igamt.workspace.domain.Workspace;
import gov.nist.hit.hl7.igamt.workspace.domain.WorkspaceAccessType;
import gov.nist.hit.hl7.igamt.workspace.service.WorkspaceService;

@RestController
public class WorkspaceController {

	@Autowired
	WorkspaceService workspaceService;
	@Autowired
	MovingService movingService;
	@Autowired
	CommonService commonService;

	@RequestMapping(value = "/api/workspace/create", method = RequestMethod.POST, produces = {
	"application/json" })
	public ResponseMessage<String> createWorkspace(
			@RequestBody WorkspaceCreateRequest workspaceCreateRequest,
			Authentication authentication
	) throws CreateRequestException {
		Workspace ws = this.workspaceService.create(workspaceCreateRequest, authentication.getName());
		return new ResponseMessage<>(ResponseMessage.Status.SUCCESS, "Workspace Created Successfully",  ws.getId(), ws.getId(), new Date());
	}

	@RequestMapping(value = "/api/workspaces", method = RequestMethod.GET, produces = { "application/json" })
	public @ResponseBody List<WorkspaceListItem> getUserIG(Authentication authentication,
			@RequestParam("type") AccessType type) throws ForbiddenOperationException {
		String username = authentication.getPrincipal().toString();
		List<Workspace> workspaces = new ArrayList<>();
		if (type == null) {
			workspaces = workspaceService.findByAccessType(WorkspaceAccessType.PUBLIC);
		} else if (type.equals(AccessType.PUBLIC)) {
			workspaces = workspaceService.findByAccessType(WorkspaceAccessType.PUBLIC);
		} else if (type.equals(AccessType.PRIVATE)) {
			workspaces = workspaceService.findByMember(username);
		} else if (type.equals(AccessType.ALL)) {
			commonService.checkAuthority(authentication, "ADMIN");
			workspaces = workspaceService.findByAll();
		} else if (type.equals(AccessType.SHARED)) {
			workspaces = workspaceService.findByMemberPending(username);
		}
		return workspaceService.convertToDisplayList(workspaces);
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

	@RequestMapping(value = "/api/workspace/{id}/update-folder/{folderId}", method = RequestMethod.POST, produces = { "application/json" })
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

}



