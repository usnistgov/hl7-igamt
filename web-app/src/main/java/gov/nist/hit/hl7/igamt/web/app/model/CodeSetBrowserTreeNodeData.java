package gov.nist.hit.hl7.igamt.web.app.model;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;

import java.util.Date;

public class CodeSetBrowserTreeNodeData {
	private String id;
	private String label;
	private Type type;
	private Date dateUpdated;
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

	public Date getDateUpdated() {
		return dateUpdated;
	}

	public void setDateUpdated(Date dateUpdated) {
		this.dateUpdated = dateUpdated;
	}

	public boolean isReadOnly() {
		return readOnly;
	}

	public void setReadOnly(boolean readOnly) {
		this.readOnly = readOnly;
	}
}
