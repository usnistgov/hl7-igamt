package gov.nist.hit.hl7.igamt.conformanceprofile.service.event.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.Status;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.wrappers.ResourcePicker;
import gov.nist.hit.hl7.igamt.common.base.wrappers.ResourcePickerList;
import gov.nist.hit.hl7.igamt.common.base.wrappers.VariableKey;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.MessageStructure;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.event.Event;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.event.display.EventTreeData;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.event.display.EventTreeNode;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.event.display.MessageEventTreeData;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.event.display.MessageEventTreeNode;
import gov.nist.hit.hl7.igamt.conformanceprofile.repository.MessageStructureRepository;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.event.MessageEventService;


@Service
public class MessageEventServiceImpl implements MessageEventService {

  @Autowired
  MessageStructureRepository messageStructureRepository;
  @Autowired
  MongoTemplate mongoTemplate;

  public MessageEventServiceImpl() {
  }

  @Override
  public List<MessageEventTreeNode> convertMessageStructureToEventTree(List<MessageStructure> messageStructures) {
    List<MessageEventTreeNode> treeNodes = new ArrayList<MessageEventTreeNode>();
    
    for(MessageStructure structure: messageStructures ) {
             
      MessageEventTreeData treedata = new MessageEventTreeData();
      MessageEventTreeNode treenode = new MessageEventTreeNode();
      treenode.setData(treedata);

      treedata.setId(structure.getId());
      treedata.setHl7Version(structure.getDomainInfo().getVersion());
      treedata.setName(structure.getStructID());
      treedata.setType(Type.EVENTS);
      treedata.setDescription(structure.getDescription());
      List<EventTreeNode> children= new ArrayList<EventTreeNode>();

      for (Event ev : structure.getEvents()) {
    	  
    	  
        EventTreeData data = new EventTreeData();
        data.setName(ev.getName());
        data.setHl7Version(ev.getHl7Version());
        data.setDescription(ev.getDescription());
        data.setParentStructId(structure.getStructID());
        data.setId(structure.getId());
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

    @Override
    public List<MessageStructure> findStructureByScopeAndVersion(String version, Scope scope, String username) {
        Criteria criteria = new Criteria();
        criteria.and("domainInfo.scope").is(scope);
        criteria.and("domainInfo.version").is(version);

        if(!scope.equals(Scope.HL7STANDARD)) {
            criteria.and("participants").in(username);
        }

        if(scope.equals(Scope.USERCUSTOM)) {
            criteria.and("status").is(Status.PUBLISHED);
        }

        Query qry = Query.query(criteria);
        return mongoTemplate.find(qry, MessageStructure.class);
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





}
