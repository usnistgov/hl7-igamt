package gov.nist.hit.hl7.igamt.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.xml.crypto.Data;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.mongodb.Mongo;

import gov.nist.hit.hl7.igamt.compositeprofile.domain.CompositeProfileStructure;
import gov.nist.hit.hl7.igamt.compositeprofile.service.CompositeProfileStructureService;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.model.ElementTreeData;
import gov.nist.hit.hl7.igamt.ig.model.IGDisplay;
import gov.nist.hit.hl7.igamt.ig.model.IgToc;
import gov.nist.hit.hl7.igamt.ig.model.TextSectionData;
import gov.nist.hit.hl7.igamt.ig.model.TreeData;
import gov.nist.hit.hl7.igamt.ig.model.TreeNode;
import gov.nist.hit.hl7.igamt.ig.repository.IgRepository;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
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
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;
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
		TreeNode start= new TreeNode();
		TreeData data = new TreeData();
		data.setType(Type.IGDOCUMENT);
		start.setData(data);
		
		for(TextSection s: ig.getContent()) {
			if(s.getType().equals(Type.TEXT)) {
			TreeNode node =	createTextSectionNode(s);
			start.getChildren().add(node);
			}else if(s.getType().equals(Type.PROFILE)) {
				TreeNode profileNode=createProfileNode(s);
				start.getChildren().add(profileNode);
			}	
		}
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
		
		
		//sectionTree.setDateUpdated(s.getDateUpdated());
		sectionTree.setLabel(s.getLabel());
		sectionTree.setType(s.getType());
		sectionTree.setPosition(s.getPosition());
		sectionTree.setContent(s.getDescription());
		profileNode.setData(sectionTree);
		
		List<TreeNode> profileChildren  = new ArrayList<TreeNode>();

		if(s.getChildren() !=null && !s.getChildren().isEmpty()) {
			
			
			for (Section section : s.getChildren()) {
				if(section instanceof Registry) {
					
					Registry registry = (Registry) section;
					TreeNode childNode= new TreeNode();
					TreeData  childData=new TreeData();
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
			data.setType(Type.CONFORMANCEPROFILE);
			addChildrenByType(node, Type.CONFORMANCEPROFILE);
			node.setData(data);
			Nodes.add(node);
		 }
		}
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
			addChildrenByType(node, Type.VALUESET);
			node.setData(data);
			Nodes.add(node);
		 }
		}
		return Nodes;
		
	
	}

	private void addChildrenByType(TreeNode v, Type valueset) {
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
			addChildrenByType(node, Type.DATATYPE);
			node.setData(data);
			Nodes.add(node);
		 }
		}
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
			addChildrenByType(node, Type.SEGMENT);
			node.setData(data);
			Nodes.add(node);
		 }
		}
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
			addChildrenByType(node, Type.COMPOSITEPROFILE);
			node.setData(data);
			Nodes.add(node);
		  }
		}
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
			addChildrenByType(node, Type.COMPOSITEPROFILE);
			node.setData(data);
			Nodes.add(node);
		 }
		}
		return Nodes;
	}

	private TreeNode createTextSectionNode(TextSection s) {	
		TreeNode t = new TreeNode();
		TextSectionData sectionTree= new TextSectionData();
		
		//sectionTree.setDateUpdated(s.getDateUpdated());
		sectionTree.setLabel(s.getLabel());
		sectionTree.setPosition(s.getPosition());
		sectionTree.setType(Type.TEXT);
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


}
