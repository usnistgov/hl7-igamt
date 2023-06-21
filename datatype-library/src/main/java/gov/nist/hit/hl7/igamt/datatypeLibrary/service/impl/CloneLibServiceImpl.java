package gov.nist.hit.hl7.igamt.datatypeLibrary.service.impl;

import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.*;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraint;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintBinding;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintBindingSegment;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGroup;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintTableConditionalBinding;
import gov.nist.hit.hl7.igamt.coconstraints.service.CoConstraintService;
import gov.nist.hit.hl7.igamt.common.base.exception.ForbiddenOperationException;
import gov.nist.hit.hl7.igamt.common.base.service.CommonService;
import gov.nist.hit.hl7.igamt.common.base.util.CloneMode;
import gov.nist.hit.hl7.igamt.common.binding.service.BindingService;
import gov.nist.hit.hl7.igamt.common.config.service.ConfigService;
import gov.nist.hit.hl7.igamt.common.exception.EntityNotFound;
import gov.nist.hit.hl7.igamt.common.slicing.service.SlicingService;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.CompositeProfileStructure;
import gov.nist.hit.hl7.igamt.compositeprofile.service.CompositeProfileDependencyService;
import gov.nist.hit.hl7.igamt.compositeprofile.service.CompositeProfileStructureService;
import gov.nist.hit.hl7.igamt.compositeprofile.service.impl.ConformanceProfileCompositeService;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.repository.MessageStructureRepository;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileDependencyService;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.constraints.repository.ConformanceStatementRepository;
import gov.nist.hit.hl7.igamt.constraints.repository.PredicateRepository;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeDependencyService;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.datatypeLibrary.domain.DatatypeLibrary;
import gov.nist.hit.hl7.igamt.datatypeLibrary.repository.DatatypeLibraryRepository;
import gov.nist.hit.hl7.igamt.datatypeLibrary.service.CloneLibService;
import gov.nist.hit.hl7.igamt.display.model.CopyInfo;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.model.RegistryUpdateReturn;
import gov.nist.hit.hl7.igamt.ig.repository.IgRepository;
import gov.nist.hit.hl7.igamt.ig.service.CloneService;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.ig.service.ResourceManagementService;
import gov.nist.hit.hl7.igamt.ig.util.SectionTemplate;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponent;
import gov.nist.hit.hl7.igamt.profilecomponent.service.ProfileComponentDependencyService;
import gov.nist.hit.hl7.igamt.profilecomponent.service.ProfileComponentService;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.service.SegmentDependencyService;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.domain.registry.ValueSetRegistry;
import gov.nist.hit.hl7.igamt.valueset.service.FhirHandlerService;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;
import gov.nist.hit.hl7.igamt.xreference.service.RelationShipService;
import gov.nist.hit.hl7.resource.change.service.ApplyClone;
import gov.nist.hit.hl7.igamt.coconstraints.service.CoConstraintDependencyService;

/**
 * @author Abdelghani El Ouakili
 *
 */
@Service
public class CloneLibServiceImpl implements  CloneLibService {

  @Autowired
  DatatypeLibraryRepository libRepo;

  @Autowired
  MongoTemplate mongoTemplate;

  @Autowired
  DatatypeService datatypeService;

  @Autowired
  ConfigService configService;

  @Autowired
  PredicateRepository predicateRepository;

  @Autowired
  ValuesetService valueSetService;

  @Autowired
  RelationShipService relationshipService;


  @Autowired
  CommonService commonService;

  @Autowired
  CompositeProfileStructureService compositeProfileService;

  @Autowired
  BindingService bindingService;

  @Autowired
  ApplyClone applyClone;

  @Autowired
  IgService igService;

  @Autowired
  ConformanceProfileDependencyService conformanceProfileDependencyService;
  @Autowired
  SegmentDependencyService segmentDependencyService;
  @Autowired
  MessageStructureRepository messageStructureRepository;
  @Autowired
  ResourceManagementService resourceManagementService;
  @Autowired
  DatatypeDependencyService datatypeDependencyService;

  @Autowired
  ProfileComponentDependencyService profileComponentDependencyService;
  @Autowired
  CompositeProfileDependencyService compositeProfilDependencyService;
  @Autowired
  CoConstraintDependencyService CoConstraintDependencyService;


  @Override
  public DatatypeLibrary clone(DatatypeLibrary lib, String username, CopyInfo copyInfo) throws ForbiddenOperationException, EntityNotFound {

    updateIGAttributes(lib, username, copyInfo);
    HashMap<RealKey, String> newKeys = generateNewIds(lib);
    DocumentInfo documentInfo = new DocumentInfo(this.generateAbstractDomainId(), DocumentType.DATATYPELIBRARY);
    RegistryUpdateReturn<Datatype> datatypeClones = cloneRegistry(lib.getDatatypeRegistry(), username, newKeys, documentInfo, Type.DATATYPE, copyInfo.getMode());


    RegistryUpdateReturn<Valueset> valueSetClones = cloneRegistry(lib.getValueSetRegistry(), username, newKeys, documentInfo, Type.VALUESET, copyInfo.getMode());



    try {

      if(datatypeClones.getSavedResources() != null && !datatypeClones.getSavedResources().isEmpty() ) {
    	  
    	 for (Datatype clone: datatypeClones.getSavedResources()) {
    		 
    	          ActiveInfo active = new ActiveInfo();
    	          active.setStatus(ActiveStatus.ACTIVE);
    	          active.setStart(new Date());
    	          clone.setActiveInfo(active);
    	          clone.setParentType(Type.DATATYPELIBRARY);
    	          clone.setLibraryReferences(new HashSet<String>());
    	          clone.setUsername(username);
    	          clone.setVersion(null);
    		 
    	 }
    	  	  
        this.datatypeService.saveAll(datatypeClones.getSavedResources());
        lib.getDatatypeRegistry().setChildren(datatypeClones.getLinks());
      }


      if(valueSetClones.getSavedResources() != null && !valueSetClones.getSavedResources().isEmpty()) {
        this.valueSetService.saveAll(valueSetClones.getSavedResources());
        lib.getValueSetRegistry().setChildren(valueSetClones.getLinks());
      }
     

      lib.setId(documentInfo.getDocumentId());
      DatatypeLibrary ret  = this.libRepo.save(lib);

      return ret;
    } catch(Exception e) {
     // this.libRepo.deleteById(documentInfo.getDocumentId());
      throw e;
    }
  }

  private String generateAbstractDomainId() {
    return new ObjectId().toString();
  }

  public DatatypeLibrary updateIGAttributes(DatatypeLibrary lib, String username, CopyInfo info) {
    applyClone.updateAbstractDomainAttributes(lib, this.generateAbstractDomainId(), username);
    lib.setDraft(false);
    lib.setDomainInfo(lib.getDomainInfo());
    lib.getDomainInfo().setScope(Scope.USER);
    lib.setStatus(null);

    PrivateAudience audience = new PrivateAudience();
    audience.setEditor(username);
    audience.setViewers(new HashSet<>());
    lib.setAudience(audience);

    if(info.getMode().equals(CloneMode.CLONE)) {
      lib.getMetadata().setTitle(lib.getMetadata().getTitle() + "[clone]");
      lib.setContent(lib.getContent());

    }
    return lib;
  }


  private HashMap<RealKey, String> generateNewIds(DatatypeLibrary ig) {
    HashMap<RealKey, String> newKeys= new HashMap<RealKey, String>();
    addKeys(ig.getValueSetRegistry(), Type.VALUESET, newKeys);
    addKeys(ig.getDatatypeRegistry(), Type.DATATYPE, newKeys);

    return newKeys;

  }

  @SuppressWarnings("unchecked")
  public <T extends Resource> RegistryUpdateReturn<T> cloneRegistry(Registry reg, String username, HashMap<RealKey, String> newKeys, DocumentInfo documentInfo, Type resourceType, CloneMode cloneMode) throws EntityNotFound {
    RegistryUpdateReturn<T> ret = new RegistryUpdateReturn<T>();
    Set<Link> links  = new HashSet<Link>();
    ret.setSavedResources(new HashSet<T>());
    if(reg instanceof ValueSetRegistry) {
    	updateCodePresence((ValueSetRegistry)reg, newKeys);

    }
    if(reg.getChildren() != null) {
      for(Link l: reg.getChildren()) {
        if(this.shouldClone(l)) {
          Resource res = getResourceByType(l.getId(), username, documentInfo, resourceType);
          RealKey rel = new RealKey(l.getId(), resourceType);
          resourceManagementService.applyCloneResource(res, newKeys.get(rel), username, documentInfo, cloneMode); // resource with new Id
          updateDependencies(res, newKeys); // resource with updated dependencies
          l.setId(newKeys.get(rel));
          l.setDerived(res.isDerived());
          l.setOrigin(res.getOrigin());
          ret.getSavedResources().add((T)res);
        }
        links.add(l);
      }
    }

    ret.setLinks(links);
    return ret;

  }

  private void updateCodePresence(ValueSetRegistry reg, HashMap<RealKey, String> newKeys) {
	  HashMap<String, Boolean> newCodesPresence = new HashMap<String, Boolean>();



	  if(reg.getCodesPresence() != null) {
		  for(String s: reg.getCodesPresence().keySet() ) {
			  if(s != null ) {
				  RealKey key = new RealKey(s, Type.VALUESET);
				  if(newKeys.containsKey(key)) {
					newCodesPresence.put(newKeys.get(key),reg.getCodesPresence().get(s));
				  }else {
					newCodesPresence.put(s,reg.getCodesPresence().get(s));

				  }
			  }
		  }
	  }
	  reg.setCodesPresence(newCodesPresence);
 	}

	/**
	 * @param res
	 * @param newKeys
	 */
	private void updateDependencies(Resource resource, HashMap<RealKey, String> newKeys) {


		if (resource instanceof Datatype) {
			this.datatypeDependencyService.updateDependencies((Datatype) resource, newKeys);

		}
	}

	private boolean shouldClone(Link link) {
		return link.isUser();
	}

	private TextSection createSectionContent(SectionTemplate template) {
		TextSection section = new TextSection();
		section.setId(new ObjectId().toString());
		section.setType(Type.fromString(template.getType()));
		section.setDescription("");
		section.setLabel(template.getLabel());
		section.setPosition(template.getPosition());

		if (template.getChildren() != null) {
			Set<TextSection> children = new HashSet<TextSection>();
			for (SectionTemplate child : template.getChildren()) {
				children.add(createSectionContent(child));
			}
			section.setChildren(children);
		}
		return section;
	}

	public Resource getResourceByType(String id, String username, DocumentInfo parent, Type type)
			throws EntityNotFound {

		switch (type) {
	
		case DATATYPE:
			return datatypeService.findById(id);

		case VALUESET:
			return valueSetService.findById(id);
		default:
			break;
		}
		return null;
	}

	private void addKeys(Registry reg, Type type, HashMap<RealKey, String> map) {
		if (reg != null && reg.getChildren() != null) {
			for (Link l : reg.getChildren()) {
				if (l.getDomainInfo().getScope().equals(Scope.USER)) {
					String newId = new ObjectId().toString();
					map.put(new RealKey(l.getId(), type), newId);
				} else {
					map.put(new RealKey(l.getId(), type), l.getId());
				}
			}
		}
	}

}
