package gov.nist.hit.hl7.igamt.segment.domain.display;

import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.model.DisplayMetadata;
import gov.nist.hit.hl7.igamt.common.base.model.SectionType;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;

public class DisplayMetadataSegment extends DisplayMetadata {
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
	public void complete(Segment obj, SectionType type, boolean readOnly) {
		super.complete(this, obj, type, readOnly);
		this.ext=obj.getExt();
		this.name=obj.getName();
	}

}
