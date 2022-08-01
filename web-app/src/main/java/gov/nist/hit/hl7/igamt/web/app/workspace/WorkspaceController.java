package gov.nist.hit.hl7.igamt.web.app.workspace;

import java.util.ArrayList;
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

import gov.nist.hit.hl7.igamt.common.base.domain.AccessType;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.SharePermission;
import gov.nist.hit.hl7.igamt.common.base.exception.ForbiddenOperationException;
import gov.nist.hit.hl7.igamt.common.base.model.DocumentSummary;
import gov.nist.hit.hl7.igamt.common.base.service.CommonService;
import gov.nist.hit.hl7.igamt.display.model.IGDisplayInfo;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.exceptions.IGNotFoundException;
import gov.nist.hit.hl7.igamt.web.app.service.MovingService;
import gov.nist.hit.hl7.igamt.workspace.domain.Workspace;
import gov.nist.hit.hl7.igamt.workspace.domain.WorkspaceAccessType;
import gov.nist.hit.hl7.igamt.workspace.model.WorkspaceDisplayInfo;
import gov.nist.hit.hl7.igamt.workspace.model.WorkspaceListItem;
import gov.nist.hit.hl7.igamt.workspace.service.WorkspaceService;
@RestController
public class WorkspaceController {

	@Autowired
	WorkspaceService workspaceService;
	@Autowired
	MovingService movingService;
	@Autowired
	CommonService commonService;

	@RequestMapping(value = "/api/workspaces/create", method = RequestMethod.POST, produces = {
	"application/json" })
	//	  @PreAuthorize("AccessResource('IGDOCUMENT', #id, WRITE)")
	public Workspace createWorkspace(
			@RequestBody Workspace workspace,
			Authentication authentication) throws IGNotFoundException, ForbiddenOperationException {
		String username = authentication.getPrincipal().toString();
		workspace.setUsername(username);

		return this.workspaceService.create(workspace);
	}


	@RequestMapping(value = "/api/workspaces", method = RequestMethod.GET, produces = { "application/json" })
	public @ResponseBody List<WorkspaceListItem> getUserIG(Authentication authentication,
			@RequestParam("type") AccessType type) throws ForbiddenOperationException {
		String username = authentication.getPrincipal().toString();
		List<Workspace> workspaces = new ArrayList<Workspace>();

		if (type == null) {
			workspaces = workspaceService.findByAccessType(WorkspaceAccessType.PUBLIC);
		} else if (type.equals(AccessType.PUBLIC)) {

			workspaces = workspaceService.findByAccessType(WorkspaceAccessType.PUBLIC);

		} else if (type.equals(AccessType.PRIVATE)) {

			workspaces = workspaceService.findByAccessTypeAndUsername(WorkspaceAccessType.PRIVATE, username);

		} else if (type.equals(AccessType.ALL)) {

			commonService.checkAuthority(authentication, "ADMIN");
			workspaces = workspaceService.findByAll();

		} else if (type.equals(AccessType.SHARED)) {

			workspaces = workspaceService.findShared(username);

		}
				
		return workspaceService.convertToDisplayList(workspaces);
	
	}

	
	  @RequestMapping(value = "/api/workspaces/{id}/state", method = RequestMethod.GET, produces = {
	  "application/json" })
	 // @PreAuthorize("AccessResource('WORKSPACE', #id, READ)")
	  public @ResponseBody WorkspaceDisplayInfo getState(@PathVariable("id") String id, Authentication authentication)
	      throws IGNotFoundException, ForbiddenOperationException {

	    Workspace workspace = workspaceService.findById(id);
	    String cUser = authentication.getPrincipal().toString();
	    
	    return workspaceService.convertToDispalyInfo(workspace);
	  }





	  @RequestMapping(value = "/api/workspaces/{id}/import", method = RequestMethod.POST, produces = {
	  "application/json" })
	 // @PreAuthorize("AccessResource('WORKSPACE', #id, READ)")
	  public @ResponseBody WorkspaceDisplayInfo moveTo(@PathVariable("id") String id, @RequestBody ResourceMovingInfo info, Authentication authentication)
	      throws IGNotFoundException, ForbiddenOperationException {

	    Workspace workspace = workspaceService.findById(id);
	    String cUser = authentication.getPrincipal().toString();
	    movingService.moveToWorkspace(workspace, info, cUser);
	    workspaceService.save(workspace);
	    return workspaceService.convertToDispalyInfo(workspace);
	  }


}



