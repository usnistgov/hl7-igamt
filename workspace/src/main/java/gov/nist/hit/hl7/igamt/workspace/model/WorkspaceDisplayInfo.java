package gov.nist.hit.hl7.igamt.workspace.model;

import java.util.ArrayList;
import java.util.List;

import gov.nist.hit.hl7.igamt.common.base.model.DocumentSummary;
import gov.nist.hit.hl7.igamt.workspace.domain.Workspace;

public class WorkspaceDisplayInfo {

	List<DocumentSummary> igs;
	Workspace workspace;
	
	public List<DocumentSummary> getIgs() {
		return igs;
	}
	public void setIgs(List<DocumentSummary> igs) {
		this.igs = igs;
	}
	public Workspace getWorkspace() {
		return workspace;
	}
	public void setWorkspace(Workspace workspace) {
		this.workspace = workspace;
	}
	public WorkspaceDisplayInfo() {
		super();
		igs = new ArrayList<DocumentSummary>();
	}
}
