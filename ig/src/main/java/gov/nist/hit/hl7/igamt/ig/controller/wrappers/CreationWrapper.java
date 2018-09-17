package gov.nist.hit.hl7.igamt.ig.controller.wrappers;

import java.util.List;

import gov.nist.hit.hl7.igamt.common.base.domain.DocumentMetadata;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.event.Event;

public class CreationWrapper {
  private Scope scope;
  private List<Event> msgEvts;
  private DocumentMetadata metadata;

  public CreationWrapper() {
    super();
    // TODO Auto-generated constructor stub
  }

  public List<Event> getMsgEvts() {
    return msgEvts;
  }

  public void setMsgEvts(List<Event> msgEvts) {
    this.msgEvts = msgEvts;
  }

  public DocumentMetadata getMetadata() {
    return metadata;
  }

  public void setMetaData(DocumentMetadata metadata) {
    this.metadata = metadata;
  }

  public CreationWrapper(List<Event> msgEvts, DocumentMetadata metadata) {
    super();
    this.msgEvts = msgEvts;
    this.metadata = metadata;
  }

  public Scope getScope() {
    return scope;
  }

  public void setScope(Scope scope) {
    this.scope = scope;
  }


}
