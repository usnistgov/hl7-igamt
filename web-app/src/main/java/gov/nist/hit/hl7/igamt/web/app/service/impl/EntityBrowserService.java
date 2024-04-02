package gov.nist.hit.hl7.igamt.web.app.service.impl;

import gov.nist.hit.hl7.igamt.common.base.domain.*;
import gov.nist.hit.hl7.igamt.common.base.model.EntityLocation;
import gov.nist.hit.hl7.igamt.common.base.model.EntityLocationType;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.valueset.domain.CodeSet;
import gov.nist.hit.hl7.igamt.valueset.service.CodeSetService;
import gov.nist.hit.hl7.igamt.web.app.model.*;
import gov.nist.hit.hl7.igamt.workspace.domain.WorkspacePermissionType;
import gov.nist.hit.hl7.igamt.workspace.model.FolderInfo;
import gov.nist.hit.hl7.igamt.workspace.model.WorkspaceInfo;
import gov.nist.hit.hl7.igamt.workspace.service.WorkspaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class EntityBrowserService {

    @Autowired
    IgService igService;

    @Autowired
    WorkspaceService workspaceService;

    @Autowired
    CodeSetService codeSetService;

    public Set<EntityLocation> getDocumentLocationInformation(String id, DocumentType type, String username) throws Exception {
        if(DocumentType.IGDOCUMENT.equals(type)) {
            Ig ig = this.igService.findById(id);
            return getDocumentLocationInformation(ig, username);
        } else {
            return null;
        }
    }


    public Set<EntityLocation> getDocumentLocationInformation(Ig ig, String username) throws Exception {
        Set<EntityLocation> locations = new HashSet<>();
        if(ig.getAudience() != null) {
            if(ig.getAudience().getType().equals(AudienceType.PRIVATE)) {
                PrivateAudience privateAudience = (PrivateAudience) ig.getAudience();
                if(privateAudience.getEditor().equals(username)) {
                    EntityLocation location = new EntityLocation();
                    location.setId(BrowserScope.PRIVATE_IG_LIST.toString());
                    location.setLabel("Owned Implementation Guides");
                    location.setType(EntityLocationType.SCOPE);
                    location.setPosition(0);
                    locations.add(location);
                } else if(privateAudience.getViewers().contains(username)) {
                    EntityLocation location = new EntityLocation();
                    location.setId(BrowserScope.SHARED_IG_LIST.toString());
                    location.setLabel("Shared With Me Implementation Guides");
                    location.setType(EntityLocationType.SCOPE);
                    location.setPosition(0);
                    locations.add(location);
                }
            } else if(ig.getAudience().getType().equals(AudienceType.PUBLIC)) {
                EntityLocation location = new EntityLocation();
                location.setId(BrowserScope.PUBLIC_IG_LIST.toString());
                location.setLabel("Public Implementation Guides");
                location.setType(EntityLocationType.SCOPE);
                location.setPosition(0);
                locations.add(location);
            } else if(ig.getAudience().getType().equals(AudienceType.WORKSPACE)) {
                WorkspaceAudience workspaceAudience = (WorkspaceAudience) ig.getAudience();
                WorkspaceInfo ws = this.workspaceService.getWorkspaceInfo(workspaceAudience.getWorkspaceId(), username);
                FolderInfo folderInfo = ws.getFolders().stream().filter((f) -> f.getId().equals(workspaceAudience.getFolderId())).findFirst()
                        .orElseThrow(() -> new Exception("Folder not found"));

                EntityLocation wsLocation = new EntityLocation();
                wsLocation.setId(ws.getId());
                wsLocation.setLabel(ws.getMetadata().getTitle());
                wsLocation.setType(EntityLocationType.WORKSPACE);
                wsLocation.setPosition(0);
                locations.add(wsLocation);

                EntityLocation folderLocation = new EntityLocation();
                folderLocation.setId(folderInfo.getId());
                folderLocation.setLabel(folderInfo.getMetadata().getTitle());
                folderLocation.setType(EntityLocationType.FOLDER);
                folderLocation.setPosition(1);
                locations.add(folderLocation);
            }
        }
        return locations;
    }

    public List<BrowserTreeNode> getBrowserTreeNodeByScope(BrowserScope scope, String username) {
        switch (scope) {
            case WORKSPACES:
                return this.getBrowserTreeNodeWorkspaces(username);
            case PUBLIC_IG_LIST:
                return this.getBrowserTreeNodePublicIgList();
            case PRIVATE_IG_LIST:
                return this.getBrowserTreeNodePrivateIgList(username);
            default:
                return new ArrayList<>();
        }
    }

    private List<BrowserTreeNode> getBrowserTreeNodePrivateIgList(String username) {
        return igService.findByPrivateAudienceEditor(username).stream().map(ig -> this.igToTreeNode(ig, false)).collect(Collectors.toList());
    }

    private List<BrowserTreeNode> getBrowserTreeNodePublicIgList() {
        return igService.findByPublicAudienceAndStatusPublished().stream().map(ig -> this.igToTreeNode(ig, true)).collect(Collectors.toList());
    }

    private List<BrowserTreeNode> getBrowserTreeNodeWorkspaces(String username) {
        return workspaceService.findByMember(username).stream().map((workspace) -> {
            WorkspaceInfo ws;
            try {
                ws = this.workspaceService.getWorkspaceInfo(workspace, username);
                BrowserTreeNode node = this.workspaceToTreeNode(ws);
                if(ws.getFolders() != null) {
                    node.setChildren(ws.getFolders().stream().map(this::folderToTreeNode).collect(Collectors.toList()));
                }
                return node;
            } catch (Exception e) {
               return null;
            }
        })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    public BrowserTreeNode igToTreeNode(Ig ig, boolean readOnly) {
        BrowserTreeNodeData browserTreeNode = new BrowserTreeNodeData();
        browserTreeNode.setId(ig.getId());
        browserTreeNode.setLabel(ig.getMetadata().getTitle());
        browserTreeNode.setType(Type.IGDOCUMENT);
        browserTreeNode.setDomainInfo(ig.getDomainInfo());
        browserTreeNode.setDateUpdated(ig.getUpdateDate());
        browserTreeNode.setReadOnly(readOnly);
        browserTreeNode.setDeprecated(ig.getDeprecated());
        browserTreeNode.setLocked(ig.getStatus() != null && ig.getStatus().equals(Status.LOCKED));
        browserTreeNode.setDraft(ig.getDraft() != null && ig.getDraft());
        BrowserTreeNode node = new BrowserTreeNode();
        node.setData(browserTreeNode);
        return node;
    }

    public BrowserTreeNode workspaceToTreeNode(WorkspaceInfo workspace) {
        BrowserTreeNodeData browserTreeNode = new BrowserTreeNodeData();
        browserTreeNode.setId(workspace.getId());
        browserTreeNode.setLabel(workspace.getMetadata().getTitle());
        browserTreeNode.setType(Type.WORKSPACE);
        browserTreeNode.setDateUpdated(workspace.getUpdated());
        browserTreeNode.setReadOnly(true);
        BrowserTreeNode node = new BrowserTreeNode();
        node.setData(browserTreeNode);
        return node;
    }

    public BrowserTreeNode folderToTreeNode(FolderInfo folder) {
        BrowserTreeNodeData browserTreeNode = new BrowserTreeNodeData();
        browserTreeNode.setId(folder.getId());
        browserTreeNode.setLabel(folder.getMetadata().getTitle());
        browserTreeNode.setType(Type.FOLDER);
        boolean permission = WorkspacePermissionType.VIEW.equals(folder.getPermissionType());
        browserTreeNode.setReadOnly(permission);
        List<BrowserTreeNode> children = folder.getChildren()
                .stream()
                .filter(link -> link.getType().equals(Type.IGDOCUMENT))
                .map(link -> this.igService.findById(link.getId()))
                .map(ig -> this.igToTreeNode(ig, permission))
                .collect(Collectors.toList());

        BrowserTreeNode node = new BrowserTreeNode();
        node.setChildren(children);
        node.setData(browserTreeNode);
        return node;
    }

    public List<CodeSetBrowserTreeNode> getCodeSetTreeNodeByScope(CodeSetBrowserScope scope, String username) {
        switch (scope) {
            case PUBLIC:
                return this.getBrowserTreeNodePublicCodeSetList(username);
            case PRIVATE:
                return this.getBrowserTreeNodePrivateCodeSetList(username);
            default:
                return new ArrayList<>();
        }
    }

    private List<CodeSetBrowserTreeNode> getBrowserTreeNodePublicCodeSetList(String username) {
        return codeSetService.findByPublicAudienceAndStatusPublished().stream().map(cs -> {
            return this.codeSetToTreeNode(cs, !cs.getUsername().equals(username));
        }).collect(Collectors.toList());
    }

    private List<CodeSetBrowserTreeNode> getBrowserTreeNodePrivateCodeSetList(String username) {
        return codeSetService.findByPrivateAudienceEditor(username).stream().map(cs -> this.codeSetToTreeNode(cs, false)).collect(Collectors.toList());
    }

    public CodeSetBrowserTreeNode codeSetToTreeNode(CodeSet cs, boolean readOnly) {
        CodeSetBrowserTreeNodeData browserTreeNode = new CodeSetBrowserTreeNodeData();
        browserTreeNode.setId(cs.getId());
        browserTreeNode.setLabel(cs.getName());
        browserTreeNode.setType(Type.CODESET);
        browserTreeNode.setDateUpdated(cs.getDateUpdated());
        browserTreeNode.setReadOnly(readOnly);
        CodeSetBrowserTreeNode node = new CodeSetBrowserTreeNode();
        node.setData(browserTreeNode);
        return node;
    }

}
