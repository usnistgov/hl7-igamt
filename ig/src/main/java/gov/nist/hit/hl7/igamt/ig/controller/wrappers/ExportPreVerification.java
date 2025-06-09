package gov.nist.hit.hl7.igamt.ig.controller.wrappers;

public class ExportPreVerification {
	private ReqId ids;
	private String exportType;

	public String getExportType() {
		return exportType;
	}

	public void setExportType(String exportType) {
		this.exportType = exportType;
	}

	public ReqId getIds() {
		return ids;
	}

	public void setIds(ReqId ids) {
		this.ids = ids;
	}
}
