package gov.nist.hit.hl7.igamt.web.app.model;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;

import java.util.Date;

public class CodeSetVersionBrowserTreeNodeData {
	private String id;
	private String label;
	private Type type;
	private Date dateCommitted;
	private boolean latestStable;
	private boolean readOnly;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	}

	public Type getType() {
		return type;
	}

	public void setType(Type type) {
		this.type = type;
	}

	public boolean isReadOnly() {
		return readOnly;
	}

	public void setReadOnly(boolean readOnly) {
		this.readOnly = readOnly;
	}

	public Date getDateCommitted() {
		return dateCommitted;
	}

	public void setDateCommitted(Date dateCommitted) {
		this.dateCommitted = dateCommitted;
	}

	public boolean isLatestStable() {
		return latestStable;
	}

	public void setLatestStable(boolean latestStable) {
		this.latestStable = latestStable;
	}
}
