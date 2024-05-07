package gov.nist.hit.hl7.igamt.api.codesets.model;

import java.util.List;

public class ResponseArray<T> {
	private List<T> list;

	public List<T> getList() {
		return list;
	}

	public void setList(List<T> list) {
		this.list = list;
	}
}
