package gov.nist.hit.hl7.igamt.workspace.service.impl;

import com.google.common.base.Strings;
import gov.nist.hit.hl7.igamt.workspace.domain.WorkspacePermissionType;
import gov.nist.hit.hl7.igamt.workspace.domain.WorkspacePermissions;
import gov.nist.hit.hl7.igamt.workspace.exception.CreateRequestException;
import gov.nist.hit.hl7.igamt.workspace.exception.InvalidPermissionsException;
import gov.nist.hit.hl7.igamt.workspace.model.WorkspaceCreateRequest;
import gov.nist.hit.hl7.igamt.workspace.service.WorkspaceVerificationService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class WorkspaceVerificationServiceImpl implements WorkspaceVerificationService {

    @Override
    public void checkWorkspaceCreateRequest(WorkspaceCreateRequest createInfo) throws CreateRequestException {
        List<String> errors = new ArrayList<>();

        // Check Fields
        if(createInfo == null) {
            errors.add("Request cannot be null");
        } else {
            if(Strings.isNullOrEmpty(createInfo.getTitle())) {
                errors.add("Workspace title is required");
            }
        }

        if(errors.size() > 0) {
            throw new CreateRequestException(errors);
        }
    }

    @Override
    public void checkPermissions(WorkspacePermissions permissions) throws InvalidPermissionsException {
        List<String> errors = new ArrayList<>();
        if(permissions.isAdmin()) {
            if(permissions.getGlobal() != null) {
                errors.add("Global permissions can't be set for admin");
            }

            if(permissions.getByFolder() != null && !permissions.getByFolder().isEmpty()) {
                errors.add("Permissions by folder can't be set for admin");
            }
        } else if(permissions.getGlobal() != null) {
            if(permissions.getGlobal().equals(WorkspacePermissionType.EDIT)) {
                if(permissions.getByFolder() != null && !permissions.getByFolder().isEmpty()) {
                    errors.add("Permissions by folder can't be set for a user with global EDIT permission");
                }
            }
        }
        if(!errors.isEmpty()) {
            throw new InvalidPermissionsException(String.join(", ", errors));
        }
    }
}
