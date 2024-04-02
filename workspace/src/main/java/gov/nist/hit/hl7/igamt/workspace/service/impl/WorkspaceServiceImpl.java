package gov.nist.hit.hl7.igamt.workspace.service.impl;

import java.util.*;
import java.util.stream.Collectors;

import com.google.common.base.Strings;
import gov.nist.hit.hl7.igamt.common.base.domain.WorkspaceAudience;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.workspace.domain.*;
import gov.nist.hit.hl7.igamt.workspace.exception.CreateRequestException;
import gov.nist.hit.hl7.igamt.workspace.exception.WorkspaceForbidden;
import gov.nist.hit.hl7.igamt.workspace.exception.WorkspaceNotFound;
import gov.nist.hit.hl7.igamt.workspace.model.*;
import gov.nist.hit.hl7.igamt.workspace.service.WorkspacePermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.exception.ForbiddenOperationException;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.workspace.repository.WorkspaceRepo;
import gov.nist.hit.hl7.igamt.workspace.service.WorkspaceService;
import gov.nist.hit.hl7.resource.change.service.OperationService;
import org.springframework.transaction.annotation.Transactional;

@Service
public class WorkspaceServiceImpl implements WorkspaceService {
	@Autowired
	WorkspaceRepo workspaceRepo;
	@Autowired
	OperationService operationService;
	@Autowired 
	IgService igService;
	@Autowired
    MongoTemplate mongoTemplate;
	@Autowired
	WorkspacePermissionService workspacePermissionService;
	
	@Override
	public Workspace findById(String id) throws WorkspaceNotFound {
		return workspaceRepo.findById(id).orElseThrow(() -> new WorkspaceNotFound(id));
	}

	@Override
	public Workspace createWorkspace(WorkspaceCreateRequest createInfo, String username) throws CreateRequestException {
		checkWorkspaceCreateRequest(createInfo);
		Workspace workspace = new Workspace();
		WorkspaceMetadata workspaceMetadata = new WorkspaceMetadata();
		workspaceMetadata.setDescription(createInfo.getDescription());
		workspaceMetadata.setTitle(createInfo.getTitle());
		workspace.setMetadata(workspaceMetadata);
		workspace.setUsername(username);
		workspace.setFolders(new HashSet<>());
		workspace.setDocuments(new HashSet<>());
		return this.workspaceRepo.save(workspace);
	}

	@Override
	public Workspace createFolder(String workspaceId, AddFolderRequest addFolderRequest, String username) throws Exception {
		Workspace workspace = this.workspaceRepo.findById(workspaceId)
				.orElseThrow(() -> new WorkspaceNotFound(workspaceId));
		if(!this.workspacePermissionService.isAdmin(workspace, username)) {
			throw new WorkspaceForbidden();
		}

		if(addFolderRequest == null) {
			throw new Exception("Folder creation request is invalid");
		} else {
			if(Strings.isNullOrEmpty(addFolderRequest.getTitle())) {
				throw new Exception("Folder title is required");
			}
		}

		if(workspace.getFolders() == null) {
			workspace.setFolders(new HashSet<>());
		}

		FolderMetadata folderMetadata = new FolderMetadata();
		folderMetadata.setTitle(addFolderRequest.getTitle());
		folderMetadata.setDescription(addFolderRequest.getDescription());
		Folder folder = new Folder();
		folder.setId(UUID.randomUUID().toString());
		folder.setChildren(new HashSet<>());
		folder.setMetadata(folderMetadata);
		int position = workspace.getFolders().stream().mapToInt(Folder::getPosition).max().orElse(0) + 1;
		folder.setPosition(position);
		workspace.getFolders().add(folder);
		return this.workspaceRepo.save(workspace);
	}

	@Override
	public Workspace deleteFolder(String workspaceId, String folderId, String username) throws Exception {
		Workspace workspace = this.workspaceRepo.findById(workspaceId)
				.orElseThrow(() -> new WorkspaceNotFound(workspaceId));
		if(!this.workspacePermissionService.isAdmin(workspace, username)) {
			throw new WorkspaceForbidden();
		}

		Folder folder = workspace.getFolders().stream()
				.filter((f) -> f.getId().equals(folderId)).findAny()
				.orElseThrow(() -> new Exception("Folder not found " + folderId));

		List<Ig> igs = folder.getChildren().stream().map((child) -> this.igService.findById(child.getId())).collect(Collectors.toList());

		// Delete IGs in the folder (Check that the IGs have the correct Audience)
		for(Ig ig: igs) {
			if(ig.getAudience() instanceof WorkspaceAudience) {
				WorkspaceAudience audience = (WorkspaceAudience) ig.getAudience();
				if(workspaceId.equals(audience.getWorkspaceId()) && folderId.equals(audience.getFolderId())) {
					this.igService.delete(ig);
				}
			}
		}

		// Delete workspace from the folder
		workspace.getFolders().remove(folder);
		// Delete user permissions related to the folder
		workspace.getUserAccessInfo().getUsers().forEach((user) -> {
			WorkspacePermissions permissions = user.getPermissions();
			if(permissions.getByFolder() != null) {
				permissions.getByFolder().remove(folderId);
			}
		});
		return this.workspaceRepo.save(workspace);
	}

	@Override
	public Workspace updateFolder(String workspaceId, String folderId, AddFolderRequest addFolderRequest, String username) throws Exception {
		Workspace workspace = this.workspaceRepo.findById(workspaceId)
				.orElseThrow(() -> new WorkspaceNotFound(workspaceId));
		if(!this.workspacePermissionService.isAdmin(workspace, username)) {
			throw new WorkspaceForbidden();
		}

		if(addFolderRequest == null) {
			throw new Exception("Folder creation request is invalid");
		} else {
			if(Strings.isNullOrEmpty(addFolderRequest.getTitle())) {
				throw new Exception("Folder title is required");
			}
		}

		if(workspace.getFolders() == null) {
			workspace.setFolders(new HashSet<>());
		}

		Folder folder = workspace.getFolders().stream()
				.filter((f) -> f.getId().equals(folderId)).findAny()
				.orElseThrow(() -> new Exception("Folder not found " + folderId));
		FolderMetadata folderMetadata = new FolderMetadata();
		folderMetadata.setTitle(addFolderRequest.getTitle());
		folderMetadata.setDescription(addFolderRequest.getDescription());
		folder.setMetadata(folderMetadata);
		return this.workspaceRepo.save(workspace);
	}

	@Override
	public Workspace saveHomeContent(String workspaceId, HomeContentWrapper home, String username) throws Exception {
		Workspace workspace = this.workspaceRepo.findById(workspaceId)
				.orElseThrow(() -> new WorkspaceNotFound(workspaceId));
		if(!this.workspacePermissionService.isAdmin(workspace, username)) {
			throw new WorkspaceForbidden();
		}

		workspace.setHomePageContent(home.getValue());
		this.workspaceRepo.save(workspace);

		return workspace;
	}

	@Override
	public Workspace saveMetadata(String workspaceId, WorkspaceMetadataWrapper metadataWrapper, String username) throws Exception {
		Workspace workspace = this.workspaceRepo.findById(workspaceId)
				.orElseThrow(() -> new WorkspaceNotFound(workspaceId));
		if(!this.workspacePermissionService.isAdmin(workspace, username)) {
			throw new WorkspaceForbidden();
		}

		if(metadataWrapper == null) {
			throw new Exception("Workspace update request is invalid");
		} else {
			if(Strings.isNullOrEmpty(metadataWrapper.getTitle())) {
				throw new Exception("Workspace title is required");
			}
		}

		workspace.getMetadata().setTitle(metadataWrapper.getTitle());
		workspace.getMetadata().setDescription(metadataWrapper.getDescription());
		this.workspaceRepo.save(workspace);
		return workspace;
	}

	public void checkWorkspaceCreateRequest(
			WorkspaceCreateRequest createInfo
	) throws CreateRequestException {
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
	public Workspace save(Workspace workspace) throws ForbiddenOperationException {
		return this.workspaceRepo.save(workspace);
	}

	@Override
	public List<Workspace> findAll() {
		return workspaceRepo.findAll();
	}

	@Override
	@Transactional
	public void delete(Workspace workspace, String performedBy) throws WorkspaceForbidden {
		if(this.workspacePermissionService.isOwner(workspace, performedBy)) {
			workspace.getFolders().forEach((folder) -> {
				folder.getChildren().forEach((child) -> {
					Ig ig = this.igService.findById(child.getId());
					if(ig != null) {
						try {
							this.igService.delete(ig);
						} catch (ForbiddenOperationException e) {
							throw new RuntimeException(e);
						}
					}
				});
			});
			this.workspaceRepo.delete(workspace);
		} else {
			throw new WorkspaceForbidden();
		}
	}

	public Map<String, Map<String, WorkspacePermissionType>> getUserWorkspacesPermissions(String username) {
		Map<String, Map<String, WorkspacePermissionType>> workspacesFolders = new HashMap<>();
		List<Workspace> workspaces = this.findByMember(username);
		for(Workspace workspace: workspaces) {
			WorkspaceUser user = workspace.getUserAccessInfo().getUsers().stream().filter(u -> u.getUsername().equals(username)).findFirst().orElse(null);
			Map<String, WorkspacePermissionType> folders = getUserAccessibleFolders(workspace, username, user);
			workspacesFolders.put(workspace.getId(), folders);
		}
		return workspacesFolders;
	}

	Map<String, WorkspacePermissionType> getUserAccessibleFolders(Workspace workspace, String username, WorkspaceUser workspaceUser) {
		Map<String, WorkspacePermissionType> folderPermissions = new HashMap<>();

		if(workspace.getUsername().equals(username) || workspaceUser.getPermissions().isAdmin() || WorkspacePermissionType.EDIT.equals(workspaceUser.getPermissions().getGlobal())) {
			workspace.getFolders().forEach((folder) -> folderPermissions.put(folder.getId(), WorkspacePermissionType.EDIT));
		} else {
			WorkspacePermissions permissions = workspaceUser.getPermissions();
			if(permissions.getGlobal() != null) {
				workspace.getFolders().forEach((folder) -> folderPermissions.put(folder.getId(), permissions.getGlobal()));
			} else {
				permissions.getByFolder().keySet().stream().filter(k -> permissions.getByFolder().get(k) != null).forEach((folderId) -> {
					folderPermissions.put(folderId, permissions.getByFolder().get(folderId));
				});
			}
		}
		return folderPermissions;
	}

    @Override
    public List<Workspace> findByMember(String username) {
		Query query = new Query(new Criteria().orOperator(
				Criteria.where("userAccessInfo.users").elemMatch(
						new Criteria().andOperator(
								Criteria.where("username").is(username),
								Criteria.where("status").is(InvitationStatus.ACCEPTED.toString())
						)
				),
				Criteria.where("username").is(username)
		));
        return this.mongoTemplate.find(query, Workspace.class);
    }

	private WorkspaceInfo toWorkspaceInfo(Workspace workspace, String username) {
		WorkspaceInfo workspaceInfo = new WorkspaceInfo();
		workspaceInfo.setHomePageContent(workspace.getHomePageContent());
		workspaceInfo.setMetadata(workspace.getMetadata());
		workspaceInfo.setId(workspace.getId());
		workspaceInfo.setOwner(workspace.getUsername());
		workspaceInfo.setCreated(workspace.getCreationDate());
		workspaceInfo.setUpdated(workspace.getUpdateDate());
		workspaceInfo.setAdmin(this.workspacePermissionService.isAdmin(workspace, username));
		workspaceInfo.setFolders(new HashSet<>());
		if(workspace.getFolders() != null) {
			for(Folder folder: workspace.getFolders()) {
				WorkspacePermissionType wpt = this.workspacePermissionService
						.getWorkspacePermissionTypeByFolder(workspace, username, folder.getId());
				if(wpt != null) {
					FolderInfo folderInfo = new FolderInfo();
					folderInfo.setId(folder.getId());
					folderInfo.setMetadata(folder.getMetadata());
					folderInfo.setChildren(folder.getChildren());
					folderInfo.setPermissionType(wpt);
					folderInfo.setPosition(folder.getPosition());
					folderInfo.setWorkspaceId(workspace.getId());
					folderInfo.setEditors(this.workspacePermissionService.getFolderEditors(workspace, folder.getId()));
					workspaceInfo.getFolders().add(folderInfo);
				}
			}
		}
		return workspaceInfo;
	}

	@Override
	public WorkspaceInfo getWorkspaceInfo(String id, String username) throws WorkspaceNotFound, WorkspaceForbidden {
		Workspace workspace = this.workspaceRepo.findById(id)
				.orElseThrow(() -> new WorkspaceNotFound(id));
		if(this.workspacePermissionService.hasAccessTo(workspace, username)) {
			return this.toWorkspaceInfo(workspace, username);
		}
		throw new WorkspaceForbidden();
	}

	@Override
	public WorkspaceInfo getWorkspaceInfo(Workspace workspace, String username) throws WorkspaceNotFound, WorkspaceForbidden {
		if(this.workspacePermissionService.hasAccessTo(workspace, username)) {
			return this.toWorkspaceInfo(workspace, username);
		}
		throw new WorkspaceForbidden();
	}

	@Override
	public List<WorkspaceListItem> convertToDisplayList(List<Workspace> workspaces, boolean invitation) {
		List<WorkspaceListItem> ret = new ArrayList<WorkspaceListItem>();
		for(Workspace workspace: workspaces) {
			WorkspaceListItem item = new WorkspaceListItem();
			item.setId(workspace.getId());
			item.setTitle(workspace.getMetadata().getTitle());
			item.setDescription(workspace.getMetadata().getDescription());
			item.setUsername(workspace.getUsername());
			item.setCoverPicture(workspace.getMetadata().getLogoImageId());
			item.setDateUpdated(workspace.getUpdateDate() != null? workspace.getUpdateDate().toString(): "");
			item.setInvitation(invitation);
			ret.add(item);
		}
		return ret;
	}


	@Override
	public FolderContent getFolderContent(String workspaceId, String folderId, String username) throws Exception {
		WorkspaceInfo ws = this.getWorkspaceInfo(workspaceId, username);
		FolderInfo folderInfo = ws.getFolders().stream().filter((f) -> f.getId().equals(folderId)).findFirst()
				.orElseThrow(() -> new Exception("Folder not found"));
		List<Ig> igs = folderInfo.getChildren()
				.stream()
				.filter(link -> link.getType().equals(Type.IGDOCUMENT))
				.map(link -> this.igService.findById(link.getId()))
				.collect(Collectors.toList());
		FolderContent content = new FolderContent();
		content.setId(folderId);
		content.setMetadata(folderInfo.getMetadata());
		content.setPermissionType(folderInfo.getPermissionType());
		content.setEditors(folderInfo.getEditors());
		content.setPosition(folderInfo.getPosition());
		content.setChildren(folderInfo.getChildren());
		content.setWorkspaceId(workspaceId);
		content.setDocuments(this.igService.convertListToDisplayList(igs));
		return content;
	}


}
