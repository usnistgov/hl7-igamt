package gov.nist.hit.hl7.igamt.ig.controller.wrappers;

import java.util.List;

import gov.nist.hit.hl7.igamt.ig.domain.IgMetaData;
import gov.nist.hit.hl7.igamt.shared.messageEvent.Event;

public class CreationWrapper {
private List<Event> msgEvts;
private IgMetaData metaData;
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
public IgMetaData getMetaData() {
	return metaData;
}
public void setMetaData(IgMetaData metaData) {
	this.metaData = metaData;
}
public CreationWrapper(List<Event> msgEvts, IgMetaData metaData) {
	super();
	this.msgEvts = msgEvts;
	this.metaData = metaData;
} 


}
