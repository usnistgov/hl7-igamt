package gov.nist.hit.hl7.igamt.workspace.service;

import gov.nist.hit.hl7.igamt.workspace.domain.WorkspacePermissionType;
import gov.nist.hit.hl7.igamt.workspace.domain.WorkspacePermissions;
import gov.nist.hit.hl7.igamt.workspace.exception.CreateRequestException;
import gov.nist.hit.hl7.igamt.workspace.exception.InvalidPermissionsException;
import gov.nist.hit.hl7.igamt.workspace.model.WorkspaceCreateRequest;

import java.util.ArrayList;
import java.util.List;

public interface WorkspaceVerificationService {
    void checkWorkspaceCreateRequest(WorkspaceCreateRequest createInfo) throws CreateRequestException;
    void checkPermissions(WorkspacePermissions permissions) throws InvalidPermissionsException;
}
