package gov.nist.hit.hl7.igamt.conformanceprofile.service.event.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
    Collections.sort(treeNodes);
    return treeNodes;
  }



}
