package gov.nist.hit.hl7.igamt.ig.controller.wrappers;

import java.util.List;

import gov.nist.hit.hl7.igamt.common.base.domain.DocumentMetadata;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.wrappers.AddingInfo;

public class CreationWrapper {
	
  private Scope scope;
  private List<AddingInfo> msgEvts;
  private DocumentMetadata metadata;

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
    this.setMsgEvts(msgEvts);
    this.metadata = metadata;
  }

  public Scope getScope() {
    return scope;
  }

  public void setScope(Scope scope) {
    this.scope = scope;
  }

  public List<AddingInfo> getMsgEvts() {
	return msgEvts;
  }

  public void setMsgEvts(List<AddingInfo> msgEvts) {
	this.msgEvts = msgEvts;
  }
}
