package gov.nist.hit.hl7.igamt.common.base.wrappers;

import java.util.List;

import gov.nist.hit.hl7.igamt.common.base.domain.DocumentMetadata;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;

public class CreationWrapper {
	
  private Scope scope;
  private List<AddingInfo> added;
  private DocumentMetadata metadata;
  private Type type;
  public CreationWrapper() {
    super();
  }

  public DocumentMetadata getMetadata() {
    return metadata;
  }

  public void setMetaData(DocumentMetadata metadata) {
    this.metadata = metadata;
  }

  public CreationWrapper(List<AddingInfo> added, DocumentMetadata metadata) {
    super();
    this.setAdded(added);
    this.metadata = metadata;
  }

  public Scope getScope() {
    return scope;
  }

  public void setScope(Scope scope) {
    this.scope = scope;
  }

  public List<AddingInfo> getAdded() {
	return added;
  }

  public void setAdded(List<AddingInfo> added) {
	this.added = added;
  }

  public Type getType() {
    return type;
  }

  public void setType(Type type) {
    this.type = type;
  }
}
