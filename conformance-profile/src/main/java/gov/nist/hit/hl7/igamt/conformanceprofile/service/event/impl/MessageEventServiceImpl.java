package gov.nist.hit.hl7.igamt.conformanceprofile.service.event.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.wrappers.ResourcePicker;
import gov.nist.hit.hl7.igamt.common.base.wrappers.ResourcePickerList;
import gov.nist.hit.hl7.igamt.common.base.wrappers.VariableKey;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.event.Event;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.event.MessageEvent;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.event.display.EventTreeData;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.event.display.EventTreeNode;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.event.display.MessageEventTreeData;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.event.display.MessageEventTreeNode;
import gov.nist.hit.hl7.igamt.conformanceprofile.repository.event.MessageEventsRepository;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.event.MessageEventService;


@Service
public class MessageEventServiceImpl implements MessageEventService {

  @Autowired
  MessageEventsRepository messageEventRepository;

  public MessageEventServiceImpl() {
    // TODO Auto-generated constructor stub
  }

  @Override
  public MessageEvent save(MessageEvent ev) {
    return messageEventRepository.save(ev);
  }

  @Override
  public List<MessageEventTreeNode> findByHl7Version(String hl7Version) {
    return convertToMessageEventTreeNode(messageEventRepository.findByHl7Version(hl7Version));
  }

  private List<MessageEventTreeNode> convertToMessageEventTreeNode(
      List<MessageEvent> messageEvents) {
    List<MessageEventTreeNode> treeNodes = new ArrayList<MessageEventTreeNode>();

    for (MessageEvent msgEvent : messageEvents) {
      MessageEventTreeData treedata = new MessageEventTreeData();
      MessageEventTreeNode treenode = new MessageEventTreeNode();
      treenode.setData(treedata);

      treedata.setId(msgEvent.getId());
      treedata.setHl7Version(msgEvent.getHl7Version());
      treedata.setName(msgEvent.getName());
      treedata.setType(msgEvent.getType());
      treedata.setDescription(msgEvent.getDescription());
      List<EventTreeNode> children= new ArrayList<EventTreeNode>();

      for (Event ev : msgEvent.getChildren()) {
    	  
    	  
        EventTreeData data = new EventTreeData();
        data.setName(ev.getName());
        data.setHl7Version(ev.getHl7Version());
        data.setDescription(ev.getDescription());
        data.setParentStructId(ev.getParentStructId());
        data.setId(ev.getId());
        EventTreeNode node = new EventTreeNode();
        node.setName(ev.getName());
        node.setData(data);
        children.add(node);
        
      }
	  children = children.stream().sorted((EventTreeNode t1, EventTreeNode t2) -> t1.compareTo(t2)).collect(Collectors.toList());
      for(int i=0;i<children.size();i++) {
    	  children.get(i).getData().setName(children.get(i).getData().getName());
      }
    	  treenode.setChildren(children);
      treeNodes.add(treenode);
    }
    Collections.sort(treeNodes);
    return treeNodes;
  }

@Override
public ResourcePickerList convertToDisplay(List<MessageEventTreeNode> list) {
	// TODO Auto-generated method stub
	ResourcePickerList ret = new ResourcePickerList();
	List<VariableKey> selectors = new ArrayList<VariableKey>();
	List<ResourcePicker> children = new ArrayList<ResourcePicker>();
	selectors.add(VariableKey.EVENT);
	ret.setSelectors(selectors);
	for(MessageEventTreeNode node: list) {
		
		ResourcePicker child = new ResourcePicker();
		child.setDescription(node.getData().getDescription());
		child.setFixedName(node.getData().getName());
		child.setComplements(createComplement(node));
		children.add(child);
	}
	ret.setChildren(children);
	return ret;
	
}

private Map<VariableKey, List<String>> createComplement(MessageEventTreeNode node) {
	// TODO Auto-generated method stub
	 List<String> events = new ArrayList<String>();
	 Map<VariableKey, List<String>> ret = new HashMap<VariableKey, List<String>> ();
	 for(EventTreeNode s:  node.getChildren()) {
		 events.add(s.getData().getName());
	 }
	ret.put(VariableKey.EVENT, events);
	return ret; 
}

/* (non-Javadoc)
 * @see gov.nist.hit.hl7.igamt.conformanceprofile.service.event.MessageEventService#deleteAll()
 */
@Override
public void deleteAll() {
  // TODO Auto-generated method stub
  this.messageEventRepository.deleteAll();
  
}



}
