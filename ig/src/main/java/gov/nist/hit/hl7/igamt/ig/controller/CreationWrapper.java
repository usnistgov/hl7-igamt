package gov.nist.hit.hl7.igamt.ig.controller;

import java.util.List;

import gov.nist.hit.hl7.igamt.shared.domain.DocumentMetadata;
import gov.nist.hit.hl7.igamt.shared.messageEvent.Event;

public class CreationWrapper {
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


}
