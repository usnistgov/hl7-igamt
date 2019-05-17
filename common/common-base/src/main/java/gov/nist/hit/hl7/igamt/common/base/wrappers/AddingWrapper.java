package gov.nist.hit.hl7.igamt.common.base.wrappers;

import java.util.List;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;

public class AddingWrapper {
	private String documentId;
	private List<AddingInfo> selected;
	private Type type;
	
	public String getDocumentId() {
		return documentId;
	}
	public void setDocumentId(String documentId) {
		this.documentId = documentId;
	}
	public List<AddingInfo> getSelected() {
		return selected;
	}
	public void setSelected(List<AddingInfo> selected) {
		this.selected = selected;
	}
	public Type getType() {
		return type;
	}
	public void setType(Type type) {
		this.type = type;
	}
}
