package gov.nist.hit.hl7.igamt.common.binding.domain;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;

public class BindingSource {
	Type type;
	String id;

	public BindingSource(Type type, String id) {
		this.type = type;
		this.id = id;
	}

	public Type getType() {
		return type;
	}

	public void setType(Type type) {
		this.type = type;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	@Override
	public boolean equals(Object o) {
		if(this == o) {
			return true;
		}
		if(o == null || getClass() != o.getClass()) {
			return false;
		}

		BindingSource that = (BindingSource) o;

		if(getType() != that.getType()) {
			return false;
		}
		return getId().equals(that.getId());
	}

	@Override
	public int hashCode() {
		int result = getType().hashCode();
		result = 31 * result + getId().hashCode();
		return result;
	}
}
