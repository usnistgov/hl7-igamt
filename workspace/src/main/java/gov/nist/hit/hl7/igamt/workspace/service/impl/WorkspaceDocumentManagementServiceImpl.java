package gov.nist.hit.hl7.igamt.workspace.service.impl;

import com.google.common.base.Strings;
import gov.nist.hit.hl7.igamt.common.base.domain.Status;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.WorkspaceAudience;
import gov.nist.hit.hl7.igamt.common.base.exception.ResourceNotFoundException;
import gov.nist.hit.hl7.igamt.common.base.util.CloneMode;
import gov.nist.hit.hl7.igamt.common.base.wrappers.CreationWrapper;
import gov.nist.hit.hl7.igamt.display.model.CopyInfo;
import gov.nist.hit.hl7.igamt.display.model.PublishingInfo;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.service.CloneService;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.workspace.domain.DocumentLink;
import gov.nist.hit.hl7.igamt.workspace.domain.Folder;
import gov.nist.hit.hl7.igamt.workspace.domain.Workspace;
import gov.nist.hit.hl7.igamt.workspace.domain.WorkspacePermissionType;
import gov.nist.hit.hl7.igamt.workspace.exception.WorkspaceForbidden;
import gov.nist.hit.hl7.igamt.workspace.exception.WorkspaceNotFound;
import gov.nist.hit.hl7.igamt.workspace.repository.WorkspaceRepo;
import gov.nist.hit.hl7.igamt.workspace.service.WorkspaceDocumentManagementService;
import gov.nist.hit.hl7.igamt.workspace.service.WorkspacePermissionService;
import gov.nist.hit.hl7.igamt.workspace.service.WorkspaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Comparator;
import java.util.concurrent.atomic.AtomicReference;

@Service
public class WorkspaceDocumentManagementServiceImpl implements WorkspaceDocumentManagementService {
    @Autowired
    WorkspaceRepo workspaceRepo;
    @Autowired
    WorkspaceService workspaceService;
    @Autowired
    WorkspacePermissionService workspacePermissionService;
    @Autowired
    IgService igService;
    @Autowired
    CloneService cloneService;

    @Override
    @Transactional
    public Workspace moveIg(String igId, String title, String workspaceId, String sourceFolderId, String targetFolder, boolean clone, String username) throws Exception {
        if(clone) {
            CopyInfo copyInfo = new CopyInfo();
            copyInfo.setMode(CloneMode.CLONE);
            Ig ig = this.igService.findById(igId);
            Ig cloned = cloneService.clone(ig, username, copyInfo);
            if(!Strings.isNullOrEmpty(title)) {
                cloned.getMetadata().setTitle(title);
            }

            if(!Strings.isNullOrEmpty(targetFolder)) {
                return this.addDocumentToWorkspace(cloned, workspaceId, targetFolder, username);
            } else {
                return this.workspaceService.findById(workspaceId);
            }
        } else {
            if(!Strings.isNullOrEmpty(targetFolder)) {
                Ig ig = this.igService.findById(igId);
                this.addDocumentToWorkspace(ig, workspaceId, targetFolder, username);
                return this.removeDocumentFromWorkspace(ig, workspaceId, sourceFolderId, false, username);
            } else {
                throw new Exception("Target folder is required");
            }
        }
    }

    @Override
    public Workspace publishIg(String igId, String workspaceId, String folderId, PublishingInfo info, String username) throws Exception {
        Ig ig = this.igService.findById(igId);
        if(ig != null) {
            this.igService.publishIG(ig, info);
            return this.removeDocumentFromWorkspace(ig, workspaceId, folderId, false, username);
        } else {
            throw new ResourceNotFoundException(igId, Type.IGDOCUMENT);
        }
    }

    @Override
    @Transactional
    public Workspace cloneIgAndMoveToWorkspaceLocation(String igId, String cloneName, String workspaceId, String folderId, CopyInfo copyInfo, String username) throws Exception {
        // CLONE IG
        Ig ig = this.igService.findById(igId);
        Ig clone = cloneService.clone(ig, username, copyInfo);
        if(!Strings.isNullOrEmpty(cloneName)) {
            clone.getMetadata().setTitle(cloneName);
        }
        // ADD TO WORKSPACE
        return this.addDocumentToWorkspace(clone, workspaceId, folderId, username);
    }

    @Override
    @Transactional
    public Ig createIgAndMoveToWorkspaceLocation(CreationWrapper wrapper, String username) throws Exception {
        // CLONE IG
        Ig ig = this.igService.createIg(wrapper, username);
        // ADD TO WORKSPACE
        this.addDocumentToWorkspace(ig, wrapper.getWorkspace().getId(), wrapper.getWorkspace().getFolderId(), username);
        return ig;
    }

    @Override
    @Transactional
    public Workspace addDocumentToWorkspace(Ig document, String workspaceId, String folderId, String username) throws Exception {
        Workspace workspace = this.workspaceRepo.findById(workspaceId)
                .orElseThrow(() -> new WorkspaceNotFound(workspaceId));
        if(Status.PUBLISHED.equals(document.getStatus())) {
            throw new Exception("Can not add a published IG to workspace");
        }
        WorkspacePermissionType permission = workspacePermissionService.getWorkspacePermissionTypeByFolder(workspace, username, folderId);
        if(permission != null && permission.equals(WorkspacePermissionType.EDIT)) {
            Folder folder = workspace.getFolders().stream()
                    .filter((f) -> f.getId().equals(folderId))
                    .findFirst()
                    .orElseThrow(() -> new Exception("Folder not found"));
            int position = workspace.getFolders().stream()
                    .mapToInt(Folder::getPosition)
                    .max()
                    .orElseThrow(() -> new Exception("Folder not found"));

            DocumentLink link = new DocumentLink();
            link.setId(document.getId());
            link.setType(Type.IGDOCUMENT);
            link.setPosition(position + 1);
            folder.getChildren().add(link);

            WorkspaceAudience workspaceAudience = new WorkspaceAudience();
            workspaceAudience.setWorkspaceId(workspaceId);
            workspaceAudience.setFolderId(folderId);
            document.setAudience(workspaceAudience);
            this.igService.save(document);
            return this.workspaceRepo.save(workspace);
        } else {
            throw new WorkspaceForbidden();
        }
    }

    @Override
    @Transactional
    public Workspace deleteDocumentFromWorkspace(String igId, String workspaceId, String folderId, String username) throws Exception {
        Ig ig = this.igService.findById(igId);
        if(ig != null) {
            return this.removeDocumentFromWorkspace(ig, workspaceId, folderId, true, username);
        } else {
            throw new ResourceNotFoundException(igId, Type.IGDOCUMENT);
        }
    }


    @Override
    @Transactional
    public Workspace removeDocumentFromWorkspace(Ig document, String workspaceId, String folderId, boolean delete, String username) throws Exception {
        Workspace workspace = this.workspaceRepo.findById(workspaceId)
                .orElseThrow(() -> new WorkspaceNotFound(workspaceId));
        WorkspacePermissionType permission = workspacePermissionService.getWorkspacePermissionTypeByFolder(workspace, username, folderId);
        if(permission != null && permission.equals(WorkspacePermissionType.EDIT)) {
            Folder folder = workspace.getFolders().stream()
                    .filter((f) -> f.getId().equals(folderId))
                    .findFirst()
                    .orElseThrow(() -> new Exception("Folder not found"));
            DocumentLink documentLink = folder.getChildren().stream()
                    .filter((d) -> d.getId().equals(document.getId()))
                    .findFirst()
                    .orElseThrow(() -> new Exception("Ig document not found"));

            folder.getChildren().remove(documentLink);
            AtomicReference<Integer> i = new AtomicReference<>(0);
            folder.getChildren().stream().sorted(Comparator.comparingInt(DocumentLink::getPosition)).forEachOrdered((a) -> {
                a.setPosition(i.get());
                i.getAndSet(i.get() + 1);
            });

            if(delete) {
                if(Status.PUBLISHED.equals(document.getStatus())) {
                    throw new Exception("Can not delete a published IG");
                }
                this.igService.delete(document);
            }

            return this.workspaceRepo.save(workspace);
        } else {
            throw new WorkspaceForbidden();
        }
    }
}
