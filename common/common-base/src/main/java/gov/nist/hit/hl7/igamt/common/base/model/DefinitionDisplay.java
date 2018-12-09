package gov.nist.hit.hl7.igamt.common.base.model;

import gov.nist.hit.hl7.igamt.common.base.domain.AbstractDomain;
import gov.nist.hit.hl7.igamt.common.base.domain.Resource;

public class DefinitionDisplay extends SectionInfo {
	
	private String text;

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}
	
	
	

	public void  build(Resource obj, SectionType type, boolean readOnly) {
		super.complete(this, obj, type, readOnly);
		if(type.equals(SectionType.POSTDEF)) {
			this.text=obj.getPostDef();

		}else if (type.equals(SectionType.PREDEF))  {
			this.text=obj.getPreDef();
		}		
	}
}
