package gov.nist.hit.hl7.igamt.web.app.service;

import gov.nist.hit.hl7.igamt.web.app.workspace.ResourceMovingInfo;
import gov.nist.hit.hl7.igamt.workspace.domain.Workspace;

public interface MovingService {

	void moveToWorkspace(Workspace workspace, ResourceMovingInfo info, String cUser);
	

}
