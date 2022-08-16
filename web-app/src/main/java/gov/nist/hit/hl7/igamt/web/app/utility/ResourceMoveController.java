package gov.nist.hit.hl7.igamt.web.app.utility;

import gov.nist.hit.hl7.igamt.common.base.domain.DocumentStructure;
import gov.nist.hit.hl7.igamt.web.app.model.ResourceMovingInfo;
import gov.nist.hit.hl7.igamt.web.app.service.MovingService;
import gov.nist.hit.hl7.igamt.workspace.model.WorkspaceInfo;
import gov.nist.hit.hl7.igamt.workspace.service.WorkspaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
public class ResourceMoveController {

    @Autowired
    private MovingService movingService;
    @Autowired
    private WorkspaceService workspaceService;

    @RequestMapping(value = "/api/move/workspace", method = RequestMethod.POST, produces = { "application/json" })
    @ResponseBody
    @PreAuthorize("AccessResource(#resourceMovingInfo.getDocumentType().toString(), #resourceMovingInfo.getDocumentId(), WRITE)")
    public WorkspaceInfo move(
            @RequestBody ResourceMovingInfo resourceMovingInfo,
            Authentication authentication
    ) throws Exception {
        DocumentStructure documentStructure = this.movingService.moveDocumentToWorkspace(
                resourceMovingInfo.getDocumentId(),
                resourceMovingInfo.getDocumentType(),
                resourceMovingInfo.getWorkspaceId(),
                resourceMovingInfo.getFolderId(),
                authentication.getName()
        );
        return this.workspaceService.addToWorkspace(resourceMovingInfo.getWorkspaceId(), resourceMovingInfo.getFolderId(), authentication.getName(), documentStructure, documentStructure.getType());
    }

}
