package gov.nist.hit.hl7.igamt.common.base.wrappers;

import java.util.List;

import gov.nist.hit.hl7.igamt.common.base.domain.DocumentMetadata;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;

public class CreationWrapper {
	
  private Scope scope;
  private DocumentMetadata metadata;
  private List<AddingInfo> selected;
  
  public List<AddingInfo> getSelected() {
    return selected;
  }

  public void setSelected(List<AddingInfo> selected) {
    this.selected = selected;
  }


  public CreationWrapper() {
    super();
  }

  public DocumentMetadata getMetadata() {
    return metadata;
  }

  public void setMetaData(DocumentMetadata metadata) {
    this.metadata = metadata;
  }

  public CreationWrapper(List<AddingInfo> msgEvts, DocumentMetadata metadata) {
    super();
    this.setSelected(msgEvts);
    this.metadata = metadata;
  }

  public Scope getScope() {
    return scope;
  }

  public void setScope(Scope scope) {
    this.scope = scope;
  }

}
