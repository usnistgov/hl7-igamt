package gov.nist.hit.hl7.igamt.web.app.service.impl;

import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.web.app.service.MovingService;
import gov.nist.hit.hl7.igamt.web.app.workspace.ResourceMovingInfo;
import gov.nist.hit.hl7.igamt.workspace.domain.DocumentLink;
import gov.nist.hit.hl7.igamt.workspace.domain.Workspace;

@Service
public class MovingServiceImpl implements MovingService {

	@Override
	public void moveToWorkspace(Workspace workspace, ResourceMovingInfo info, String cUser) {
		if(info.getResourceType().equals(Type.IGDOCUMENT)) {
			DocumentLink link = new DocumentLink();
			link.setId(info.getResourceId());
			link.setType(info.getResourceType());
			if(info.getFolderId() == null) {
				workspace.getDocuments().add(link);
			}
		}
		
		
	}

}
