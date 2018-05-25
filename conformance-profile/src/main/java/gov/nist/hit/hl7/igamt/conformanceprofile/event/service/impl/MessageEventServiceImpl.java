package gov.nist.hit.hl7.igamt.conformanceprofile.event.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.conformanceprofile.event.domain.Event;
import gov.nist.hit.hl7.igamt.conformanceprofile.event.domain.MessageEvent;
import gov.nist.hit.hl7.igamt.conformanceprofile.event.domain.display.EventTreeData;
import gov.nist.hit.hl7.igamt.conformanceprofile.event.domain.display.EventTreeNode;
import gov.nist.hit.hl7.igamt.conformanceprofile.event.domain.display.MessageEventTreeData;
import gov.nist.hit.hl7.igamt.conformanceprofile.event.domain.display.MessageEventTreeNode;
import gov.nist.hit.hl7.igamt.conformanceprofile.event.repository.MessageEventsRepository;
import gov.nist.hit.hl7.igamt.conformanceprofile.event.service.MessageEventService;


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

      for (Event ev : msgEvent.getChildren()) {
        EventTreeData data = new EventTreeData();
        data.setName(ev.getName());
        data.setParentStructId(ev.getParentStructId());
        data.setId(ev.getId());
        EventTreeNode node = new EventTreeNode();
        node.setData(data);
        treenode.getChildren().add(node);
      }
      treeNodes.add(treenode);
    }
    return treeNodes;
  }



}
