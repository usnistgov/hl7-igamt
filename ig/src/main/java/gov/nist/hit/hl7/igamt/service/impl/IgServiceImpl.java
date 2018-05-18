package gov.nist.hit.hl7.igamt.service.impl;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import gov.nist.hit.hl7.igamt.compositeprofile.service.CompositeProfileStructureService;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.model.ListElement;
import gov.nist.hit.hl7.igamt.ig.repository.IgRepository;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.ig.util.SectionTemplate;
import gov.nist.hit.hl7.igamt.profilecomponent.service.ProfileComponentService;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.shared.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.shared.domain.DocumentMetadata;
import gov.nist.hit.hl7.igamt.shared.domain.Link;
import gov.nist.hit.hl7.igamt.shared.domain.TextSection;
import gov.nist.hit.hl7.igamt.shared.domain.Type;
import gov.nist.hit.hl7.igamt.shared.registries.ConformanceProfileRegistry;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;
@Service("igService")
public class IgServiceImpl implements IgService{
	
	@Autowired
	IgRepository igRepository;
	
	@Autowired
   MongoTemplate mongoTemplate;
    
	
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
	public List<ListElement> convertListToDisplayList(List<Ig> igdouments) {
		// TODO Auto-generated method stub
		
		List<ListElement> igs=new ArrayList<ListElement>();
		for(Ig ig : igdouments) {
			ListElement element = new ListElement();
			
			element.setCoverpage(ig.getMetadata().getCoverPicture());
			element.setDateUpdated(ig.getUpdateDate());
			element.setTitle(ig.getMetadata().getTitle());
			element.setSubtitle(ig.getMetadata().getSubTitle());
			//element.setConfrmanceProfiles(confrmanceProfiles);
			element.setCoverpage(ig.getMetadata().getCoverPicture());
			element.setId(ig.getId());
			element.setUsername(ig.getUsername());
			List<String> conformanceProfileNames=new ArrayList<String>();
			ConformanceProfileRegistry conformanceProfileRegistry= ig.getConformanceProfileRegistry();
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
	        emptyIg.setMetadata(new DocumentMetadata());
	        Set<TextSection> content= new HashSet<TextSection>();
	        for(SectionTemplate template : igTemplates) {
	        		content.add(createSectionContent(template));
	        }
	        emptyIg.setContent(content);
			return emptyIg;
	}
	private TextSection createSectionContent(SectionTemplate template) {
		// TODO Auto-generated method stub
		TextSection section = new TextSection();
		section.setId( new ObjectId().toString());
		section.setType(Type.fromString(template.getType()));
		section.setDescription("");
		section.setLabel(template.getLabel());
		section.setPosition(template.getPosition());
		
		if(template.getChildren()!=null) {
		Set<TextSection> children = new HashSet<TextSection>();
		    for(SectionTemplate child : template.getChildren()) {
	        		children.add(createSectionContent(child));
	        }
			section.setChildren(children);
		}
		return section;
		
	}

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.ig.service.IgService#convertDomainToModel(gov.nist.hit.hl7.igamt.ig.domain.Ig)
   */
	   @Override
	    public List<Ig> findLatestByUsername(String username) {
	        // TODO Auto-generated method stub
	        List<Ig> allUsersIgs=this.findIgIdsForUser(username);
	        
	        Map<String, Integer> map = new HashMap<String , Integer>();
	        
	        for(Ig ig : allUsersIgs) {
	        String id= ig.getId().getId();
	        
	            if(id != null) {
	            if(!map.containsKey(id)) {
	                map.put(id, ig.getId().getVersion());
	            }else {
	                int current = map.get(id);
	                if(current<ig.getId().getVersion()) {
	                    map.put(id, ig.getId().getVersion());
	                    }
	                }
	            }
	            
	        } 
	        
	        List<Ig> allIgs = new ArrayList<Ig>();
	        
	        for(String id : map.keySet()) {
	        Ig ig =  this.findById(new CompositeKey(id,map.get(id)));
	        
	        allIgs.add(ig);
	        }
	        return allIgs;
	    }

	    @Override
	    public Ig findLatestById(String id) {       
	      Query query = new Query();
	      query.addCriteria(Criteria.where("_id._id").is(new ObjectId(id)));
	      query.with(new Sort(Sort.Direction.DESC, "_id.version"));
	      query.limit(1);
	      Ig ig = mongoTemplate.findOne(query, Ig.class);
	      return ig;
	    
	    }
	
	
	    @Override
        public List<Ig> findIgIdsForUser(String username) {
            // TODO Auto-generated method stub
            return igRepository.findIgIdsForUser(username);
        }

 
	
	

}
