package gov.nist.hit.hl7.igamt.workspace.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.exception.ForbiddenOperationException;
import gov.nist.hit.hl7.igamt.common.base.model.DocumentSummary;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.workspace.domain.DocumentLink;
import gov.nist.hit.hl7.igamt.workspace.domain.Folder;
import gov.nist.hit.hl7.igamt.workspace.domain.Workspace;
import gov.nist.hit.hl7.igamt.workspace.domain.WorkspaceAccessType;
import gov.nist.hit.hl7.igamt.workspace.model.WorkspaceDisplayInfo;
import gov.nist.hit.hl7.igamt.workspace.model.WorkspaceListItem;
import gov.nist.hit.hl7.igamt.workspace.repository.WorkspaceRepo;
import gov.nist.hit.hl7.igamt.workspace.service.WorkspaceService;
import gov.nist.hit.hl7.resource.change.service.OperationService;

@Service
public class WorkspaceServiceImpl implements WorkspaceService {

	
	@Autowired
	WorkspaceRepo workspaceRepo;
	
	@Autowired
	OperationService operationService;
	
	@Autowired 
	IgService igService; 
	
	@Override
	public Workspace findById(String id) {
		return workspaceRepo.findById(id).orElse(null);
	}

	@Override
	public Workspace create(Workspace workspace) {
		workspace.setUpdateDate(new Date());
		Workspace ret =this.workspaceRepo.insert(workspace);
		return ret;
	}

	@Override
	public Workspace save(Workspace workspace) throws ForbiddenOperationException {
		Workspace ret =this.workspaceRepo.save(workspace);
		return ret;
	}

	@Override
	public List<Workspace> findAll() {
		return workspaceRepo.findAll();
	}

	@Override
	public void delete(Workspace workspace) throws ForbiddenOperationException {
		this.workspaceRepo.delete(workspace);
	}


	@Override
	public List<Workspace> findShared(String username) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Workspace> findByAccessType(WorkspaceAccessType type) {
		return this.workspaceRepo.findByAccessType(type);
	}

	@Override
	public List<Workspace> findByAccessTypeAndUsername(WorkspaceAccessType type, String username) {
		return this.workspaceRepo.findByUsernameAndAccessType(username, type);
	}

	@Override
	public List<Workspace> findByAll() {
		return workspaceRepo.findAll();
	}

	@Override
	public List<WorkspaceListItem> convertToDisplayList(List<Workspace> workspaces) {
		List<WorkspaceListItem> ret = new ArrayList<WorkspaceListItem>();
		for(Workspace workspace: workspaces) {
			
			WorkspaceListItem item = new WorkspaceListItem();
			item.setId(workspace.getId());
			item.setTitle(workspace.getMetadata().getTitle());
			item.setCoverPicture(workspace.getMetadata().getCoverPicture());
			item.setDateUpdated(workspace.getUpdateDate() != null? workspace.getUpdateDate().toString(): "");
			item.setElements(new ArrayList<String>());
			ret.add(item);
		}
		return ret;
	}

	@Override
	public WorkspaceDisplayInfo convertToDispalyInfo(Workspace workspace) {
		WorkspaceDisplayInfo ret = new WorkspaceDisplayInfo();
		ret.setIgs(new ArrayList<DocumentSummary>());
		List<DocumentLink> documents = new ArrayList<DocumentLink>();
		ret.setWorkspace(workspace);
		if(workspace.getDocuments() != null) {
			for (DocumentLink link: workspace.getDocuments()) {
				documents.add(link);
			}
		}
		
		if(workspace.getFolders() != null) {
			for (Folder f: workspace.getFolders() ) {
				if(f.getChildren() != null) {
					for (DocumentLink link: workspace.getDocuments()) {
						documents.add(link);
					}
				}	
				
			}
		}
		List<String> igs = documents
				  .stream()
				  .filter(d -> d.getType().equals(Type.IGDOCUMENT)).map( x-> x.getId())
				  .collect(Collectors.toList());
		if(igs != null) {
		ret.setIgs(this.igService.convertListToDisplayList(this.igService.findByIdIn(igs)));
		}

		return ret;
		
	}
	
	


}
