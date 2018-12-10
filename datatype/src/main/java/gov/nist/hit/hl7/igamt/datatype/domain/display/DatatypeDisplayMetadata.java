package gov.nist.hit.hl7.igamt.datatype.domain.display;

import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.model.DisplayMetadata;
import gov.nist.hit.hl7.igamt.common.base.model.SectionType;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;

public class DatatypeDisplayMetadata extends DisplayMetadata {
	private String ext;
	private String name;

	public String getExt() {
		return ext;
	}

	public void setExt(String ext) {
		this.ext = ext;
	}
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	public void complete(Datatype obj, SectionType type, boolean readOnly) {
		super.complete(this, obj, type, readOnly);
		this.ext=obj.getExt();
		this.name=obj.getName();
	}

}