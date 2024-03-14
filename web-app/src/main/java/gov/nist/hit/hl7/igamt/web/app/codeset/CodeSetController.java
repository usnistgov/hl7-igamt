package gov.nist.hit.hl7.igamt.web.app.codeset;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import gov.nist.hit.hl7.igamt.access.active.NotifySave;
import gov.nist.hit.hl7.igamt.common.base.domain.AccessType;
import gov.nist.hit.hl7.igamt.common.base.exception.ForbiddenOperationException;
import gov.nist.hit.hl7.igamt.common.base.exception.ResourceNotFoundException;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage.Status;
import gov.nist.hit.hl7.igamt.common.base.service.CommonService;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.ChangeItemDomain;
import gov.nist.hit.hl7.igamt.valueset.domain.CodeSet;
import gov.nist.hit.hl7.igamt.valueset.domain.CodeSetVersion;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.exception.ValuesetException;
import gov.nist.hit.hl7.igamt.valueset.model.CodeSetCreateRequest;
import gov.nist.hit.hl7.igamt.valueset.model.CodeSetInfo;
import gov.nist.hit.hl7.igamt.valueset.model.CodeSetListItem;
import gov.nist.hit.hl7.igamt.valueset.model.CodeSetListType;
import gov.nist.hit.hl7.igamt.valueset.model.CodeSetVersionContent;
import gov.nist.hit.hl7.igamt.valueset.service.CodeSetService;
import gov.nist.hit.hl7.igamt.workspace.domain.Workspace;
import gov.nist.hit.hl7.igamt.workspace.exception.WorkspaceForbidden;
import gov.nist.hit.hl7.igamt.workspace.exception.WorkspaceNotFound;
import gov.nist.hit.hl7.igamt.workspace.model.AddFolderRequest;
import gov.nist.hit.hl7.igamt.workspace.model.FolderContent;
import gov.nist.hit.hl7.igamt.workspace.model.WorkspaceInfo;
import gov.nist.hit.hl7.igamt.workspace.model.WorkspaceListItem;
import gov.nist.hit.hl7.igamt.workspace.model.WorkspaceListType;

@RestController
public class CodeSetController {

	
	@Autowired
	CodeSetService codeSetService;
	
	@Autowired
	CommonService commonService;
	
	
	@RequestMapping(value = "/api/code-set/create", method = RequestMethod.POST, produces = { "application/json" })
	public ResponseMessage<String> createWorkspace(
			@RequestBody CodeSetCreateRequest CodeSetCreateRequest,
			Authentication authentication
	) {
		CodeSet ws = this.codeSetService.createCodeSet(CodeSetCreateRequest, authentication.getName());
		return new ResponseMessage<>(ResponseMessage.Status.SUCCESS, "Code Set Created Successfully",  ws.getId(), ws.getId(), new Date());
	}
	
	
	@RequestMapping(value = "/api/code-set/{id}/state", method = RequestMethod.GET, produces = { "application/json" })
	@ResponseBody
//	@PreAuthorize("AccessWorkspace(#id, READ)")
	public CodeSetInfo getWorkspaceInfo(
			Authentication authentication,
			@PathVariable("id") String id
	) throws  ResourceNotFoundException, ForbiddenOperationException {
		String username = authentication.getPrincipal().toString();
		return codeSetService.getCodeSetInfo(id, username);
	}
	
	
//	@RequestMapping(value = "/api/code-set/{id}/folder/{folderId}", method = RequestMethod.POST, produces = { "application/json" })
//	@ResponseBody
////	@PreAuthorize("IsWorkspaceAdmin(#id)")
//	public ResponseMessage<String> editFolder(
//			Authentication authentication,
//			@PathVariable("id") String id,
//			@PathVariable("folderId") String folderId,
//			@RequestBody AddFolderRequest addFolderRequest
//	) throws Exception {
//		String username = authentication.getPrincipal().toString();
//		workspaceService.updateFolder(id, folderId, addFolderRequest, username);
//		return new ResponseMessage<>(ResponseMessage.Status.SUCCESS, "Folder Updated Successfully",  id, new Date());
//	}

	@RequestMapping(value = "/api/code-set/{id}/code-set-version/{versionId}", method = RequestMethod.GET, produces = { "application/json" })
	@ResponseBody
//	@PreAuthorize("AccessWorkspaceFolder(#id, #folderId, READ)")
	public CodeSetVersionContent getFolderContent(
			Authentication authentication,
			@PathVariable("id") String id,
			@PathVariable("versionId") String versionId
	) throws ResourceNotFoundException {
		String username = authentication.getPrincipal().toString();
		return codeSetService.getCodeSetVersionContent(id, versionId, username);
	}
	
	
	@RequestMapping(value = "/api/code-set/{id}/code-set-version/{versionId}", method = RequestMethod.POST, produces = { "application/json" })
	@ResponseBody
	public ResponseMessage<?> applyStructureChanges(@PathVariable("id") String id,
			@PathVariable("versionId") String versionId, @RequestBody CodeSetVersionContent content,
			Authentication authentication) throws ValuesetException, IOException, ForbiddenOperationException, ResourceNotFoundException {
		String username = authentication.getPrincipal().toString();

		CodeSetVersion ret = codeSetService.saveCodeSetContent(id, versionId, content, username);
		return new ResponseMessage(Status.SUCCESS, "Code set Saved", ret.getId(), null);
	}
	
	
	

	@RequestMapping(value = "/api/code-sets", method = RequestMethod.GET, produces = { "application/json" })
	public @ResponseBody List<CodeSetListItem> getUserWorkspaces(
			Authentication authentication,
			@RequestParam("type") CodeSetListType type
	) throws ForbiddenOperationException {
		String username = authentication.getPrincipal().toString();
		List<CodeSet> codesets = new ArrayList<>();
		
		if (type != null) {
			if (type.equals(CodeSetListType.PRIVATE)) {

				codesets = codeSetService.findByPrivateAudienceEditor(username);

			} else if (type.equals(CodeSetListType.ALL)) {

				commonService.checkAuthority(authentication, "ADMIN");
				codesets = codeSetService.findAllPrivateCodeSet();

			}
			return codeSetService.convertToDisplayList(codesets);
		} else {
			codesets = codeSetService.findByPrivateAudienceEditor(username);
			return codeSetService.convertToDisplayList(codesets);
		}
		
	}
	
	
}
