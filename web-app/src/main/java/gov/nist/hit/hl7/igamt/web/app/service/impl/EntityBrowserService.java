package gov.nist.hit.hl7.igamt.web.app.service.impl;

import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.workspace.domain.WorkspacePermissionType;
import gov.nist.hit.hl7.igamt.workspace.model.FolderInfo;
import gov.nist.hit.hl7.igamt.workspace.model.WorkspaceInfo;
import gov.nist.hit.hl7.igamt.workspace.service.WorkspaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class EntityBrowserService {

    @Autowired
    IgService igService;

    @Autowired
    WorkspaceService workspaceService;

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
        return igService.findByUsername(username, Scope.USER).stream().map(ig -> this.igToTreeNode(ig, false)).collect(Collectors.toList());
    }

    private List<BrowserTreeNode> getBrowserTreeNodePublicIgList() {
        return igService.findAllPreloadedIG().stream().map(ig -> this.igToTreeNode(ig, true)).collect(Collectors.toList());
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
        browserTreeNode.setReadOnly(WorkspacePermissionType.VIEW.equals(folder.getPermissionType()));
        BrowserTreeNode node = new BrowserTreeNode();
        node.setData(browserTreeNode);
        return node;
    }

}
