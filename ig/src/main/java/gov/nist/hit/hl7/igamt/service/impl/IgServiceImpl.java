package gov.nist.hit.hl7.igamt.service.impl;

import java.io.File;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.xml.crypto.Data;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.Mongo;

import gov.nist.hit.hl7.igamt.compositeprofile.domain.CompositeProfileStructure;
import gov.nist.hit.hl7.igamt.compositeprofile.service.CompositeProfileStructureService;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.domain.IgMetaData;
import gov.nist.hit.hl7.igamt.ig.model.DefinitionTreeData;
import gov.nist.hit.hl7.igamt.ig.model.ElementTreeData;
import gov.nist.hit.hl7.igamt.ig.model.IGDisplay;
import gov.nist.hit.hl7.igamt.ig.model.IgToc;
import gov.nist.hit.hl7.igamt.ig.model.ListElement;
import gov.nist.hit.hl7.igamt.ig.model.TextSectionData;
import gov.nist.hit.hl7.igamt.ig.model.TreeData;
import gov.nist.hit.hl7.igamt.ig.model.TreeNode;
import gov.nist.hit.hl7.igamt.ig.repository.IgRepository;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.ig.util.SectionTemplate;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponent;
import gov.nist.hit.hl7.igamt.profilecomponent.service.ProfileComponentService;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.shared.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.shared.domain.Link;
import gov.nist.hit.hl7.igamt.shared.domain.Registry;
import gov.nist.hit.hl7.igamt.shared.domain.Section;
import gov.nist.hit.hl7.igamt.shared.domain.TextSection;
import gov.nist.hit.hl7.igamt.shared.domain.Type;
import gov.nist.hit.hl7.igamt.shared.domain.ValueSetRegistry;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.core.io.ClassPathResource;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
@Service("igService")
public class IgServiceImpl implements IgService{
	
	@Autowired
	IgRepository igRepository;
	
	@Autowired 
	DatatypeService datatypeService; 
	
	@Autowired
	SegmentService segmentService;
	
	@Autowired
	ConformanceProfileService conformanceProfileService;
	
	@Autowired
	ProfileComponentService profileComponentService;
	
	
	@Autowired
	CompositeProfileStructureService compositeProfileServie;
	

	@Autowired
	ValuesetService valueSetService;
	
	@Override
	public Ig findById(CompositeKey id) {
		// TODO Auto-generated method stub
		return igRepository.findOne(id);
	}

	@Override
	public List findAll() {
		// TODO Auto-generated method stub
		return igRepository.findAll();
	}

	@Override
	public void delete(CompositeKey id) {
		// TODO Auto-generated method stub
		igRepository.delete(id);
	}

	@Override
	public Ig save(Ig ig) {
		// TODO Auto-generated method stub
		return igRepository.save(ig);
	}

	@Override
	public List<Ig> findByUsername(String username) {
		// TODO Auto-generated method stub
		return igRepository.findByUsername(username);
	}

	@Override
	public IGDisplay convertDomainToModel(Ig ig) {
		// TODO Auto-generated method stub
		IGDisplay igDisplay= new IGDisplay();
		igDisplay.setMetadata(ig.getMetaData());
		igDisplay.setAuthor(ig.getUsername());
		igDisplay.setDateUpdated(ig.getUpdateDate());
		TreeNode start= new TreeNode();
		TreeData data = new TreeData();
		data.setType(Type.IGDOCUMENT);
		data.setLabel("TABLE OF CONTENT ");
		start.setExpanded(true);
		start.setData(data);
		List<TreeNode> firstLevel= new ArrayList<TreeNode>();
		for(TextSection s: ig.getContent()) {
			if(s.getType().equals(Type.TEXT)) {
			TreeNode node =	createTextSectionNode(s);
				firstLevel.add(node);
			}else if(s.getType().equals(Type.PROFILE)) {
				TreeNode profileNode=createProfileNode(s);
				firstLevel.add(profileNode);
			}	
		}
		firstLevel.sort((h1, h2) -> h1.compareTo(h2));
		start.setChildren(firstLevel);
		IgToc toc = new IgToc();
		List<TreeNode> nodes= new ArrayList<TreeNode>();
		nodes.add(start);

		toc.setContent(nodes);
		
		igDisplay.setToc(toc);
		
		return igDisplay;
	}

	private TreeNode createProfileNode(TextSection s) {
		
		TreeNode profileNode = new TreeNode();
		TextSectionData sectionTree= new TextSectionData();
		
		
		sectionTree.setLabel(s.getLabel());
		sectionTree.setType(s.getType());
		sectionTree.setPosition(s.getPosition());
		sectionTree.setContent(s.getDescription());
		profileNode.setId(s.getId());
		profileNode.setData(sectionTree);
		
		List<TreeNode> profileChildren  = new ArrayList<TreeNode>();

		if(s.getChildren() !=null && !s.getChildren().isEmpty()) {
			
			
			for (Section section : s.getChildren()) {
				if(section instanceof Registry) {
					
					Registry registry = (Registry) section;
					TreeNode childNode= new TreeNode();
					TreeData  childData=new TreeData();
					childNode.setId(registry.getId());
					childData.setPosition(registry.getPosition());
					childData.setLabel(registry.getLabel());
					Type type = section.getType();
					childData.setType(type);
					childNode.setData(childData);
					if( registry.getChildren() !=null && !registry.getChildren().isEmpty()) {
						

						List<TreeNode> sectionChildren= new ArrayList<TreeNode>();						

						if(type.equals(Type.PROFILECOMPONENTREGISTRY)) {
							sectionChildren= createPcsNodes(registry.getChildren());				
							
						}else if(type.equals(Type.CONFORMANCEPROFILEREGISTRY)) {
							sectionChildren= createCpsNodes(registry.getChildren());

						}else if( type.equals(Type.COMPOSITEPROFILEREGISTRY)) {
							sectionChildren= createCompositePrfileNodes(registry.getChildren());

						}else if(type.equals(Type.SEGMENTRGISTRY)) {
							sectionChildren= createSegmentsNodes(registry.getChildren());

						}else if(type.equals(Type.DATATYPEREGISTRY)) {
							sectionChildren= createDatatypesNodes(registry.getChildren());

						}else if( type.equals(Type.VALUESETREGISTRY)) {
							sectionChildren= createValueSetsNodes(registry.getChildren());

						}
						childNode.setChildren(sectionChildren);
					}
					
					profileChildren.add(childNode);
					
				}
			}
			profileChildren.sort((h1, h2) -> h1.compareTo(h2));

			
		}

		profileNode.setChildren(profileChildren);
		
		
		return profileNode;
		
	}

	private List<TreeNode> createCpsNodes(Set<Link> children) {
		// TODO Auto-generated method stub
		// TODO Auto-generated method stub
		List<TreeNode> Nodes= new ArrayList<TreeNode>();
		// TODO Auto-generated method stub
		for(Link l: children) {
			ConformanceProfile confromanceProfile= conformanceProfileService.findByKey(l.getId());
		if(confromanceProfile !=null) {
			TreeNode node = new TreeNode();
			ElementTreeData data = new ElementTreeData();
			data.setLabel(confromanceProfile.getName());
			data.setDescription(confromanceProfile.getDescription());
			data.setDomainInfo(confromanceProfile.getDomainInfo());
			data.setPosition(l.getPosition());
			data.setKey(l.getId());
			node.setData(data);
			node.setId(l.getId().getId());

			data.setType(Type.CONFORMANCEPROFILE);
			addChildrenByType(node, Type.CONFORMANCEPROFILE);
			Nodes.add(node);
		 }
		}
		Nodes.sort((h1, h2) -> h1.compareTo(h2));

		return Nodes;
	}

	private List<TreeNode> createValueSetsNodes(Set<Link> children) {
		
		List<TreeNode> Nodes= new ArrayList<TreeNode>();
		// TODO Auto-generated method stub
		for(Link l: children) {
		Valueset vs= 	valueSetService.findById(l.getId());
		if(vs !=null) {
			TreeNode node = new TreeNode();
			ElementTreeData data = new ElementTreeData();
			data.setLabel(vs.getBindingIdentifier());
			data.setDescription(vs.getName());
			data.setPosition(l.getPosition());
			data.setDomainInfo(vs.getDomainInfo());
			data.setKey(l.getId());
			data.setType(Type.VALUESET);
			node.setData(data);
			node.setId(l.getId().getId());
//			addChildrenByType(node, Type.VALUESET);
			Nodes.add(node);
		 }
		}
		Nodes.sort((h1, h2) -> h1.compareTo(h2));

		return Nodes;
		
	
	}

	private void addChildrenByType(TreeNode v, Type type) {
//		Type referenceType = type;
//		
//		
//		TreeNode metadataNode=new TreeNode();
//		DefinitionTreeData metadataData=new DefinitionTreeData(); 
//		metadataData.setLabel("MetaData");
//		metadataData.setPosition(1);
//		metadataData.setKey(v.getData().getKey());
//		metadataData.setReferenceType(referenceType);
//		metadataNode.setData(metadataData);
//		v.getChildren().add(metadataNode);
//		
//		
//		
//		TreeNode definition=new TreeNode();
//		DefinitionTreeData definitionData=new DefinitionTreeData(); 
//		definitionData.setLabel("Definition");
//		definitionData.setPosition(2);
//		definitionData.setKey(v.getData().getKey());
//		definitionData.setReferenceType(referenceType);
//		definition.setData(definitionData);
//		addDefinitionNodesByType(definition, referenceType);
//		
//		v.getChildren().add(definition);
//		
//		
//		 TreeNode crosRefs=new TreeNode();
//		 DefinitionTreeData  crosRefsData=new DefinitionTreeData(); 
//		 crosRefsData.setLabel("Cross-References");
//		 crosRefsData.setPosition(3);
//		 crosRefsData.setKey(v.getData().getKey());
//		 crosRefsData.setReferenceType(referenceType);
//		 crosRefs.setData( crosRefsData);
//		 v.getChildren().add(crosRefs);
//		
//		
//		
//		// TODO Auto-generated method stub
		
	}

	private void addDefinitionNodesByType(TreeNode definition, Type referenceType) {
		
		
		TreeNode prefDef=new TreeNode();
		DefinitionTreeData prefDefData=new DefinitionTreeData(); 
		prefDefData.setLabel("Pre-Text");
		prefDefData.setPosition(1);
		prefDefData.setKey(definition.getData().getKey());
		prefDefData.setReferenceType(referenceType);
		prefDef.setData(prefDefData);
		definition.getChildren().add(prefDef);
		
		
		TreeNode structure=new TreeNode();
		DefinitionTreeData structureData=new DefinitionTreeData(); 
		structureData.setLabel("Structure");
		structureData.setPosition(2);
		structureData.setKey(definition.getData().getKey());
		structureData.setReferenceType(referenceType);
		structure.setData(structureData);
		definition.getChildren().add(structure);
		
		
		TreeNode postDef=new TreeNode();
		DefinitionTreeData postDefData=new DefinitionTreeData(); 
		postDefData.setLabel("Post-Text");
		postDefData.setPosition(3);
		postDefData.setKey(definition.getData().getKey());
		postDefData.setReferenceType(referenceType);
		postDef.setData(postDefData);
		definition.getChildren().add(postDef);
		
		
		
		TreeNode ConfStat=new TreeNode();
		DefinitionTreeData ConfStatData=new DefinitionTreeData(); 
		ConfStatData.setLabel("Conformance Statement");
		ConfStatData.setPosition(4);
		ConfStatData.setKey(definition.getData().getKey());
		ConfStatData.setReferenceType(referenceType);
		ConfStat.setData(ConfStatData);
		definition.getChildren().add(ConfStat);
		
		TreeNode predicates=new TreeNode();
		DefinitionTreeData predicatesData=new DefinitionTreeData(); 
		predicatesData.setLabel("Predicates");
		predicatesData.setPosition(5);
		predicatesData.setKey(definition.getData().getKey());
		predicatesData.setReferenceType(referenceType);
		predicates.setData(predicatesData);
		definition.getChildren().add(predicates);
		
		
		if(referenceType.equals(Type.SEGMENT)) {
			Segment s= segmentService.findByKey(definition.getData().getKey());
			if(s !=null) {
				if(s.getName().equals("OBX")){
					
					TreeNode DynamicMapping=new TreeNode();
					DefinitionTreeData DynamicMappingData=new DefinitionTreeData(); 
					DynamicMappingData.setLabel("Dynamic Mapping");
					DynamicMappingData.setPosition(6);
					DynamicMappingData.setKey(definition.getData().getKey());
					DynamicMappingData.setReferenceType(referenceType);
					DynamicMapping.setData(DynamicMappingData);
					definition.getChildren().add(DynamicMapping);
					
					
					TreeNode CoConstraints=new TreeNode();
					DefinitionTreeData CoConstraintsData=new DefinitionTreeData(); 
					CoConstraintsData.setLabel("Co-Constraints");
					CoConstraintsData.setPosition(5);
					CoConstraintsData.setKey(definition.getData().getKey());
					CoConstraintsData.setReferenceType(referenceType);
					CoConstraints.setData(CoConstraintsData);
					definition.getChildren().add(CoConstraints);
					
					
					
				}	
			}
			
		}
		
		
		// TODO Auto-generated method stub
		
	}

	private List<TreeNode> createDatatypesNodes(Set<Link> children) {
		// TODO Auto-generated method stub
		List<TreeNode> Nodes= new ArrayList<TreeNode>();
		// TODO Auto-generated method stub
		for(Link l: children) {
		Datatype dt= 	datatypeService.findByKey(l.getId());
		if(dt !=null) {
			TreeNode node = new TreeNode();
			ElementTreeData data = new ElementTreeData();
			data.setLabel(dt.getName());
			data.setDescription(dt.getDescription());
			data.setPosition(l.getPosition());
			data.setKey(l.getId());
			data.setDomainInfo(dt.getDomainInfo());
			data.setType(Type.DATATYPE);
			node.setData(data);

			addChildrenByType(node, Type.DATATYPE);
			Nodes.add(node);
		 }
		}
		Nodes.sort((h1, h2) -> h1.compareTo(h2));

		return Nodes;
	}

	private List<TreeNode> createSegmentsNodes(Set<Link> children) {
		// TODO Auto-generated method stub
		List<TreeNode> Nodes= new ArrayList<TreeNode>();
		// TODO Auto-generated method stub
		for(Link l: children) {
		Segment segment= segmentService.findByKey(l.getId());
		if(segment !=null) {
			TreeNode node = new TreeNode();
			ElementTreeData data = new ElementTreeData();
			data.setLabel(segment.getName());
			data.setExt(segment.getExt());
			data.setDescription(segment.getDescription());
			data.setPosition(l.getPosition());
			data.setDomainInfo(segment.getDomainInfo());

			data.setKey(l.getId());
			data.setType(Type.SEGMENT);
			node.setId(l.getId().getId());

			node.setData(data);

			//addChildrenByType(node, Type.SEGMENT);
			Nodes.add(node);
		 }
		}
		Nodes.sort((h1, h2) -> h1.compareTo(h2));

		return Nodes;
	}

	private List<TreeNode> createCompositePrfileNodes(Set<Link> children) {
		
		// TODO Auto-generated method stub
		List<TreeNode> Nodes= new ArrayList<TreeNode>();
		// TODO Auto-generated method stub
		for(Link l: children) {
		CompositeProfileStructure compositeProfile= compositeProfileServie.findByKey(l.getId());
		if(compositeProfile !=null) {
			TreeNode node = new TreeNode();
			ElementTreeData data = new ElementTreeData();
			data.setLabel(compositeProfile.getName());
			data.setDescription(compositeProfile.getDescription());
			data.setDomainInfo(compositeProfile.getDomainInfo());
			data.setPosition(l.getPosition());
			data.setKey(l.getId());
			data.setType(Type.COMPOSITEPROFILE);
			node.setData(data);
			node.setId(l.getId().getId());


			addChildrenByType(node, Type.COMPOSITEPROFILE);
			Nodes.add(node);
		  }
		}
		Nodes.sort((h1, h2) -> h1.compareTo(h2));

		return Nodes;
	}

	private List<TreeNode> createPcsNodes(Set<Link> children) {
		// TODO Auto-generated method stub
		List<TreeNode> Nodes= new ArrayList<TreeNode>();
		// TODO Auto-generated method stub
		for(Link l: children) {
		ProfileComponent profileComponent= profileComponentService.findByCompositeKey(l.getId());
		if(profileComponent != null) {
			TreeNode node = new TreeNode();
			ElementTreeData data = new ElementTreeData();
			data.setLabel(profileComponent.getName());
			data.setDescription(profileComponent.getName());
			data.setDomainInfo(profileComponent.getDomainInfo());
			data.setPosition(l.getPosition());
			data.setKey(l.getId());
			data.setType(Type.COMPOSITEPROFILE);
			node.setData(data);
			addChildrenByType(node, Type.COMPOSITEPROFILE);
			Nodes.add(node);
		 }
		}
		Nodes.sort((h1, h2) -> h1.compareTo(h2));

		return Nodes;
	}

	private TreeNode createTextSectionNode(TextSection s) {	
		TreeNode t = new TreeNode();
		TextSectionData sectionTree= new TextSectionData();
		
		//sectionTree.setDateUpdated(s.getDateUpdated());
		sectionTree.setLabel(s.getLabel());
		sectionTree.setPosition(s.getPosition());
		sectionTree.setType(Type.TEXT);
		t.setId(s.getId());

		sectionTree.setContent(s.getDescription());
		t.setData(sectionTree);
		
		
		if(s.getChildren() !=null && !s.getChildren().isEmpty()) {
			
			List<TreeNode> children  = new ArrayList<TreeNode>();
			
			for (Section section : s.getChildren()) {
				if(s instanceof TextSection) {
					TextSection sect= (TextSection)section;
					children.add(createTextSectionNode(sect));
				}
				
			}
			children.sort((h1, h2) -> h1.compareTo(h2));

			t.setChildren(children);
			
		}
		
		
		return t;
		
		
		
	}

	@Override
	public Ig ConvertModelToDomain(IGDisplay ig) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Ig> findLatestByUsername(String username) {
		// TODO Auto-generated method stub
		List<Ig> allUsersIgs=this.findByUsername(username);
		
		Map<String, Ig> map = new HashMap<String , Ig>();
		
		for(Ig ig : allUsersIgs) {
			
		String id= ig.getId().getId();
			if(id != null) {
			if(!map.containsKey(id)) {
				map.put(id, ig);
			}else {
				Ig current = map.get(id);
				if(current.getId().getVersion()<ig.getId().getVersion()) {
					map.put(id, ig);
					}
				}
			}
			
		}
		return new ArrayList<Ig>(map.values());
	}

	@Override
	public Ig findLatestById(String id) {
//		return igRepository.findOne(new CompositeKey(id, 1));
//		 new Sort(Sort.Direction.DESC, "_id.version"));
		
		Ig ig= igRepository.findLatestById(new ObjectId(id), new Sort(Sort.Direction.DESC, "_id.version") ).get(0);
		return ig;
		
	
//		List<Ig> igs=igRepository.findByIdId(new Mongo.ObjectId(id));
//		if(igs !=null && !igs.isEmpty()){
//			Ig ig = igs.get(0);
//			if(igs.size()>1) {
//				for( int i =1; i<igs.size(); i++) {
//					if(igs.get(i).getId().getVersion()>ig.getId().getVersion()) {
//						ig = igs.get(i);
//					}
//				}
//			}
//			return ig;
//				
//	}
//		return null;

	}

	@Override
	public List<ListElement> convertListToDisplayList(List<Ig> igdouments) {
		// TODO Auto-generated method stub
		
		List<ListElement> igs=new ArrayList<ListElement>();
		for(Ig ig : igdouments) {
			ListElement element = new ListElement();
			
			element.setCoverpage(ig.getMetaData().getCoverPicture());
			element.setDateUpdated(ig.getUpdateDate());
			element.setTitle(ig.getMetaData().getTitle());
			element.setSubtitle(ig.getMetaData().getSubTitle());
			//element.setConfrmanceProfiles(confrmanceProfiles);
			element.setCoverpage(ig.getMetaData().getCoverPicture());
			element.setId(ig.getId());
			element.setUsername(ig.getUsername());
			List<String> conformanceProfileNames=new ArrayList<String>();
			Registry conformanceProfileRegistry= ig.getConformanceProfileLibrary();
			if(conformanceProfileRegistry !=null) {
				if(conformanceProfileRegistry.getChildren() !=null) {
					for(Link i : conformanceProfileRegistry.getChildren()) {
						ConformanceProfile	 conformanceProfile=conformanceProfileService.findDisplayFormat(i.getId());
 						if(conformanceProfile !=null) {
						conformanceProfileNames.add(conformanceProfile.getName()+ conformanceProfile.getIdentifier());
						}
					}
				}
			}
			element.setConformanceProfiles(conformanceProfileNames);
			igs.add(element);
		}
		return igs;
	}

	@Override
	public List<Ig> finByScope(String string) {
		// TODO Auto-generated method stub
		return igRepository.findByDomainInfoScope(string);
	}

	@Override
	public Ig CreateEmptyIg() throws JsonParseException, JsonMappingException, FileNotFoundException, IOException{
		// TODO Auto-generated method stub
	        File ig = new ClassPathResource("IgTemplate.json").getFile();
	        	ObjectMapper objectMapper = new ObjectMapper();
	        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
	        List<SectionTemplate> igTemplates = objectMapper.readValue(ig, new TypeReference<List<SectionTemplate>>(){});
	        Ig emptyIg = new Ig();
	        emptyIg.setMetaData(new IgMetaData());
	        Set<TextSection> content= new HashSet<TextSection>();
	        for(SectionTemplate template : igTemplates) {
	        	if(template.getType().equals(Type.TEXT.toString())) {
	        		content.add(createSectionContent(template));
	         	} else if(template.getType().equals(Type.PROFILE.toString())) {
	        		content.add(createProfileContent(template));
	         	}
	        }
	        emptyIg.setContent(content);
			return emptyIg;
	}

	private TextSection createProfileContent(SectionTemplate template) {
		// TODO Auto-generated method stub
		TextSection section = new TextSection();
		section.setId( new ObjectId().toString());
		section.setType(Type.PROFILE);
		section.setLabel(template.getLabel());
		section.setPosition(template.getPosition());
		if(template.getChildren()!=null) {
			Set<Section> children = new HashSet<Section>();
		    for(SectionTemplate child : template.getChildren()) {
		    		if(child.getType() !=Type.VALUESETREGISTRY.getValue()) {
		    			Registry r= new Registry(new ObjectId().toString(), null, Type.fromString(child.getType()), child.getPosition(), child.getLabel());
		    			children.add(r);
		    		}else {
		    			ValueSetRegistry r= new ValueSetRegistry(new ObjectId().toString(), null, Type.fromString(child.getType()), child.getPosition(), child.getLabel());
		    			children.add(r);
		    		}
	        }
			section.setChildren(children);
			
		}
		return section;
		
	
	}

	private TextSection createSectionContent(SectionTemplate template) {
		// TODO Auto-generated method stub
		TextSection section = new TextSection();
		section.setId( new ObjectId().toString());
		section.setType(Type.TEXT);
		section.setDescription("");
		section.setLabel(template.getLabel());
		section.setPosition(template.getPosition());
		
		if(template.getChildren()!=null) {
		Set<Section> children = new HashSet<Section>();
		    for(SectionTemplate child : template.getChildren()) {
	        	if(child.getType().equals(Type.TEXT.toString())) {
	        		children.add(createSectionContent(template));
	        	}
	        }
			section.setChildren(children);
		}
		return section;
		
	}
	
	
	
	

}
