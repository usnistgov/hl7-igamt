package gov.nist.hit.hl7.igamt.common.base.model;

import gov.nist.hit.hl7.igamt.common.base.domain.Resource;

public class DisplayMetadata extends SectionInfo {

  private String authorNote;
  

  public String getAuthorNote() {
    return authorNote;
  }
  public void setAuthorNote(String authorNote) {
    this.authorNote = authorNote;
  }

	public void complete(Resource obj, SectionType type, boolean readOnly) {
		super.complete(this, obj, type, readOnly);
		this.authorNote=obj.getAuthorNotes();
	}
	
	
}