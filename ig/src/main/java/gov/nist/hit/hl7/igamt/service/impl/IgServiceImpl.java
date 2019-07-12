package gov.nist.hit.hl7.igamt.service.impl;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.apache.commons.io.IOUtils;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.client.result.UpdateResult;

import gov.nist.hit.hl7.igamt.common.base.domain.DocumentMetadata;
import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.Registry;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.TextSection;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.exception.ValidationException;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.CompositeProfileStructure;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.registry.CompositeProfileRegistry;
import gov.nist.hit.hl7.igamt.compositeprofile.service.CompositeProfileStructureService;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.registry.ConformanceProfileRegistry;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatement;
import gov.nist.hit.hl7.igamt.constraints.domain.Level;
import gov.nist.hit.hl7.igamt.constraints.domain.display.ConformanceStatementsContainer;
import gov.nist.hit.hl7.igamt.constraints.repository.ConformanceStatementRepository;
import gov.nist.hit.hl7.igamt.constraints.repository.PredicateRepository;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DatatypeLabel;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DatatypeSelectItem;
import gov.nist.hit.hl7.igamt.datatype.domain.registry.DatatypeRegistry;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.ig.controller.wrappers.IGContentMap;
import gov.nist.hit.hl7.igamt.ig.domain.ConformanceProfileLabel;
import gov.nist.hit.hl7.igamt.ig.domain.ConformanceProfileSelectItem;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.domain.IgDocumentConformanceStatement;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.ComponentDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.ConformanceProfileDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.DatatypeBindingDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.DatatypeDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.FieldDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.IgDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.SegmentBindingDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.SegmentDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.SegmentRefOrGroupDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.ValuesetBindingDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.ValuesetDataModel;
import gov.nist.hit.hl7.igamt.ig.model.IgSummary;
import gov.nist.hit.hl7.igamt.ig.repository.IgRepository;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.ig.util.SectionTemplate;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponent;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.registry.ProfileComponentRegistry;
import gov.nist.hit.hl7.igamt.profilecomponent.service.ProfileComponentService;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentLabel;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentSelectItem;
import gov.nist.hit.hl7.igamt.segment.domain.registry.SegmentRegistry;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.service.impl.exception.DatatypeComponentSerializationException;
import gov.nist.hit.hl7.igamt.service.impl.exception.DatatypeSerializationException;
import gov.nist.hit.hl7.igamt.service.impl.exception.FieldSerializationException;
import gov.nist.hit.hl7.igamt.service.impl.exception.GroupSerializationException;
import gov.nist.hit.hl7.igamt.service.impl.exception.MessageSerializationException;
import gov.nist.hit.hl7.igamt.service.impl.exception.ProfileSerializationException;
import gov.nist.hit.hl7.igamt.service.impl.exception.SegmentSerializationException;
import gov.nist.hit.hl7.igamt.service.impl.exception.TableSerializationException;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.domain.registry.ValueSetRegistry;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;
import gov.nist.hit.hl7.igamt.xreference.service.RelationShipService;
import nu.xom.Attribute;
import nu.xom.Document;
import nu.xom.Element;

@Service("igService")
public class IgServiceImpl implements IgService {

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
  private ConformanceStatementRepository conformanceStatementRepository;

  @Autowired
  private PredicateRepository predicateRepository;
  
  @Autowired
  ValuesetService valueSetService;
  
  @Autowired
  RelationShipService relationshipService;
  
//  @Autowired
//  CoConstraintService coConstraintService;

  @Override
  public Ig findById(String id) {
    // TODO Auto-generated method stub
    return igRepository.findById(id).orElse(null);
  }

  @Override
  public List<Ig> findAll() {
    // TODO Auto-generated method stub
    return igRepository.findAll();
  }

  @Override
  public void delete(String id) {
    // TODO Auto-generated method stub
    igRepository.findById(id);
  }

  @Override
  public Ig save(Ig ig) {
    // TODO Auto-generated method stub
    ig.setUpdateDate(new Date());
    return igRepository.save(ig);
  }

  @Override
  public List<Ig> findByUsername(String username) {
    // TODO Auto-generated method stub
    return igRepository.findByUsername(username);
  }

  @Override
  public List<IgSummary> convertListToDisplayList(List<Ig> igdouments) {
    // TODO Auto-generated method stub

    List<IgSummary> igs = new ArrayList<IgSummary>();
    for (Ig ig : igdouments) {
      IgSummary element = new IgSummary();

      element.setCoverpage(ig.getMetadata().getCoverPicture());
      element.setDateUpdated(ig.getUpdateDate());
      element.setTitle(ig.getMetadata().getTitle());
      element.setSubtitle(ig.getMetadata().getSubTitle());
      // element.setConfrmanceProfiles(confrmanceProfiles);
      element.setCoverpage(ig.getMetadata().getCoverPicture());
      element.setId(ig.getId());
      element.setUsername(ig.getUsername());
      List<String> conformanceProfileNames = new ArrayList<String>();
      ConformanceProfileRegistry conformanceProfileRegistry = ig.getConformanceProfileRegistry();
      if (conformanceProfileRegistry != null) {
        if (conformanceProfileRegistry.getChildren() != null) {
          for (Link i : conformanceProfileRegistry.getChildren()) {
            ConformanceProfile conformanceProfile =
                conformanceProfileService.findDisplayFormat(i.getId());
            if (conformanceProfile != null) {
              conformanceProfileNames
                  .add(conformanceProfile.getName() + conformanceProfile.getIdentifier());
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
  public Ig createEmptyIg()
      throws JsonParseException, JsonMappingException, FileNotFoundException, IOException {
    // TODO Auto-generated method stub
    ObjectMapper objectMapper = new ObjectMapper();
    objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    List<SectionTemplate> igTemplates =
        objectMapper.readValue(IgServiceImpl.class.getResourceAsStream("/IgTemplate.json"),
            new TypeReference<List<SectionTemplate>>() {});
    Ig emptyIg = new Ig();
    emptyIg.setMetadata(new DocumentMetadata());
    Set<TextSection> content = new HashSet<TextSection>();
    for (SectionTemplate template : igTemplates) {
      content.add(createSectionContent(template));
    }
    emptyIg.setContent(content);
    return emptyIg;
  }

  private TextSection createSectionContent(SectionTemplate template) {
    // TODO Auto-generated method stub
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

  /*
   * (non-Javadoc)
   * 
   * @see
   * gov.nist.hit.hl7.igamt.ig.service.IgService#convertDomainToModel(gov.nist.hit.hl7.igamt.ig.
   * domain.Ig) >>>>>>> b6d5591cb74490526e1a1758d67d772b946cea99
   */
  @Override
  public List<Ig> findByUsername(String username, Scope scope) {



    Criteria where = Criteria.where("username").is(username)
        .andOperator(Criteria.where("domainInfo.scope").is(scope.toString()));

    Query qry = Query.query(where);
    qry.fields().include("domainInfo");
    qry.fields().include("id");
    qry.fields().include("metadata");
    qry.fields().include("username");
    qry.fields().include("conformanceProfileRegistry");
    qry.fields().include("creationDate");
    qry.fields().include("updateDate");

    List<Ig> igs = mongoTemplate.find(qry, Ig.class);
    return igs;
  }

  @Override
  @PreAuthorize("hasAuthority('ADMIN')")
  public List<Ig> findAllUsersIG() {
    Criteria where = Criteria.where("domainInfo.scope").is(Scope.USER);
    Query qry = Query.query(where);
    qry.fields().include("domainInfo");
    qry.fields().include("id");
    qry.fields().include("metadata");
    qry.fields().include("username");
    qry.fields().include("conformanceProfileRegistry");
    qry.fields().include("creationDate");
    qry.fields().include("updateDate");
    List<Ig> igs = mongoTemplate.find(qry, Ig.class);
    return igs;
  }


  @Override
  public List<Ig> findAllPreloadedIG() {
    Criteria where = Criteria.where("domainInfo.scope").is(Scope.PRELOADED);
    Query qry = Query.query(where);
    qry.fields().include("domainInfo");
    qry.fields().include("id");
    qry.fields().include("metadata");
    qry.fields().include("username");
    qry.fields().include("conformanceProfileRegistry");
    qry.fields().include("creationDate");
    qry.fields().include("updateDate");

    List<Ig> igs = mongoTemplate.find(qry, Ig.class);
    return igs;
  }

  @Override
  public UpdateResult updateAttribute(String id, String attributeName, Object value) {
    // TODO Auto-generated method stub
    Query query = new Query();
    query.addCriteria(Criteria.where("_id").is(new ObjectId(id)));
    query.fields().include(attributeName);
    Update update = new Update();
    update.set(attributeName, value);
    update.set("updateDate", new Date());
    return mongoTemplate.updateFirst(query, update, Ig.class);

  }


  @Override
  public List<Ig> findIgIdsForUser(String username) {
    // TODO Auto-generated method stub
    return igRepository.findIgIdsForUser(username);
  }


  @Override
  public Ig findIgContentById(String id) {
    // TODO Auto-generated method stub
    Query query = new Query();
    query.addCriteria(Criteria.where("_id").is(new ObjectId(id)));
    query.fields().include("id");
    query.fields().include("content");
    query.limit(1);

    Ig ig = mongoTemplate.findOne(query, Ig.class);
    return ig;

  }


  @Override
  public Ig findIgMetadataById(String id) {
    // TODO Auto-generated method stub
    Query query = new Query();
    query.fields().include("id");
    query.fields().include("metadata");
    query.limit(1);

    Ig ig = mongoTemplate.findOne(query, Ig.class);
    return ig;
  }

  /**
   * @param content
   * @param sectionId
   * @return
   */
  @Override
  public TextSection findSectionById(Set<TextSection> content, String sectionId) {
    // TODO Auto-generated method stub
    for (TextSection s : content) {
      TextSection ret = findSectionInside(s, sectionId);
      if (ret != null) {
        return ret;
      }
    }
    return null;
  }

  private TextSection findSectionInside(TextSection s, String sectionId) {
    // TODO Auto-generated method stub
    if (s.getId().equals(sectionId)) {
      return s;
    }
    if (s.getChildren() != null && s.getChildren().size() > 0) {
      for (TextSection ss : s.getChildren()) {
        TextSection ret = findSectionInside(ss, sectionId);
        if (ret != null) {
          return ret;
        }
      }
      return null;
    }
    return null;
  }

  @Override
  public Ig clone(Ig ig, String username) {
    Ig newIg = new Ig();
    newIg.setId(null);
    newIg.setFrom(ig.getId());
    newIg.setMetadata(ig.getMetadata().clone());
    newIg.setContent(ig.getContent());
    newIg.setUsername(username);
    newIg.setDomainInfo(ig.getDomainInfo());
    newIg.getDomainInfo().setScope(Scope.USER);

    HashMap<String, String> conformanceProfilesMap =
        getNewIdsMap(ig.getConformanceProfileRegistry());
    HashMap<String, String> valuesetsMap = getNewIdsMap(ig.getValueSetRegistry());
    HashMap<String, String> datatypesMap = getNewIdsMap(ig.getDatatypeRegistry());
    HashMap<String, String> segmentsMap = getNewIdsMap(ig.getSegmentRegistry());



    newIg.setValueSetRegistry(
        copyValueSetRegistry(ig.getValueSetRegistry(), valuesetsMap, username));
    newIg.setDatatypeRegistry(
        copyDatatypeRegistry(ig.getDatatypeRegistry(), valuesetsMap, datatypesMap, username));
    newIg.setSegmentRegistry(copySegmentRegistry(ig.getSegmentRegistry(),valuesetsMap,datatypesMap,segmentsMap, username));
    newIg.setConformanceProfileRegistry(
        copyConformanceProfileRegistry(ig.getConformanceProfileRegistry(), valuesetsMap,
            datatypesMap, segmentsMap, conformanceProfilesMap, username));
    return newIg;
  }

  /**
   * @param conformanceProfileRegistry
   * @param valuesetsMap
   * @param datatypesMap
   * @param segmentsMap
   * @param username
   * @return
   */

  private ConformanceProfileRegistry copyConformanceProfileRegistry(
      ConformanceProfileRegistry conformanceProfileRegistry, HashMap<String, String> valuesetsMap,
      HashMap<String, String> datatypesMap, HashMap<String, String> segmentsMap,
      HashMap<String, String> conformanceProfilesMap, String username) {

    // TODO Auto-generated method stub
    // TODO Auto-generated method stub

    ConformanceProfileRegistry newReg = new ConformanceProfileRegistry();
    HashSet<Link> children = new HashSet<Link>();
    for (Link l : conformanceProfileRegistry.getChildren()) {
      if (!conformanceProfilesMap.containsKey(l.getId())) {
        children.add(l);
      } else {
        children.add(conformanceProfileService.cloneConformanceProfile(
            conformanceProfilesMap.get(l.getId()),valuesetsMap,segmentsMap,l, username, Scope.USER));
      }
    }
    newReg.setChildren(children);
    return newReg;
  }

  /**
   * @param segmentRegistry
   * @param valuesetsMap
   * @param datatypesMap
   * @param segmentsMap
   * @param username
   * @return
   * @throws CoConstraintSaveException
   */
  private SegmentRegistry copySegmentRegistry(SegmentRegistry segmentRegistry,
      HashMap<String, String> valuesetsMap , HashMap<String, String> datatypesMap,
      HashMap<String, String> segmentsMap, String username) {
    // TODO Auto-generated method stub
    SegmentRegistry newReg = new SegmentRegistry();
    HashSet<Link> children = new HashSet<Link>();
    for (Link l : segmentRegistry.getChildren()) {
      if (!segmentsMap.containsKey(l.getId())) {
        children.add(l);
      } else {
        children.add(segmentService.cloneSegment(segmentsMap.get(l.getId()),
            valuesetsMap,datatypesMap, l, username,Scope.USER));
      }
    }
    newReg.setChildren(children);
    return newReg;
  }

  /**
   * @param datatypeRegistry
   * @param valuesetsMap
   * @param datatypesMap
   * @return
   */
  private DatatypeRegistry copyDatatypeRegistry(DatatypeRegistry datatypeRegistry,
      HashMap<String, String> valuesetsMap, HashMap<String, String> datatypesMap, String username) {
    // TODO Auto-generated method stub
    DatatypeRegistry newReg = new DatatypeRegistry();
    HashSet<Link> children = new HashSet<Link>();
    for (Link l : datatypeRegistry.getChildren()) {
      if (!datatypesMap.containsKey(l.getId())) {
        children.add(l);
      } else {
        children.add(this.datatypeService.cloneDatatype(valuesetsMap,datatypesMap, l, username,Scope.USER));
      }
    }

    newReg.setChildren(children);
    return newReg;
  }

  /**
   * @param valueSetRegistry
   * @param valuesetsMap
   */
  private ValueSetRegistry copyValueSetRegistry(ValueSetRegistry reg,
      HashMap<String, String> valuesetsMap, String username) {
    // TODO Auto-generated method stub
    ValueSetRegistry newReg = new ValueSetRegistry();
    newReg.setExportConfig(reg.getExportConfig());
    newReg.setCodesPresence(reg.getCodesPresence());
    HashSet<Link> children = new HashSet<Link>();
    for (Link l : reg.getChildren()) {
      if (!valuesetsMap.containsKey(l.getId())) {
        children.add(l);
      } else {
    	  	Link newLink = this.valueSetService.cloneValueSet(valuesetsMap.get(l.getId()), l, username, Scope.USER);    	  	
        children.add(newLink);
      }
    }
    newReg.setChildren(children);
    return newReg;
  }

  private HashMap<String, String> getNewIdsMap(Registry reg) {
	  HashMap<String, String> map = new HashMap<String, String>();
    if (reg != null && reg.getChildren() != null) {
      for (Link l : reg.getChildren()) {
        if (l.getDomainInfo().getScope().equals(Scope.USER)) {
          map.put(l.getId(), new ObjectId().toString());
        }
      }
    }
    return map;
  }

  @Override
  public void delete(Ig ig) {

    if (ig.getDomainInfo() != null) {
      ig.getDomainInfo().setScope(Scope.ARCHIVED);
    }
    archiveConformanceProfiles(ig.getConformanceProfileRegistry());
    archiveCompositePrfile(ig.getCompositeProfileRegistry());
    archiveProfileComponents(ig.getProfileComponentRegistry());
    try {
      archiveSegmentRegistry(ig.getSegmentRegistry());
    } catch (ValidationException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
    }
    archiveDatatypeRegistry(ig.getDatatypeRegistry());
    archiveValueSetRegistry(ig.getValueSetRegistry());
    this.save(ig);

  }

  private void archiveCompositePrfile(CompositeProfileRegistry compositeProfileRegistry) {
    // TODO Auto-generated method stub
    for (Link l : compositeProfileRegistry.getChildren()) {
      if (l.getDomainInfo() != null && l.getDomainInfo().getScope().equals(Scope.USER)) {
        l.getDomainInfo().setScope(Scope.ARCHIVED);
        CompositeProfileStructure el = compositeProfileServie.findById(l.getId());
        if (el != null) {
          el.getDomainInfo().setScope(Scope.ARCHIVED);
          compositeProfileServie.save(el);
        }
      }
    }

  }

  private void archiveValueSetRegistry(ValueSetRegistry valueSetRegistry) {
    // TODO Auto-generated method stub
    for (Link l : valueSetRegistry.getChildren()) {
      if (l.getDomainInfo() != null && l.getDomainInfo().getScope().equals(Scope.USER)) {
        l.getDomainInfo().setScope(Scope.ARCHIVED);
        Valueset el = valueSetService.findById(l.getId());
        if (el != null) {
          el.getDomainInfo().setScope(Scope.ARCHIVED);
          valueSetService.save(el);
        }
      }
    }
  }

  private void archiveDatatypeRegistry(DatatypeRegistry datatypeRegistry) {
    // TODO Auto-generated method stub
    for (Link l : datatypeRegistry.getChildren()) {
      if (l.getDomainInfo() != null && l.getDomainInfo().getScope().equals(Scope.USER)) {
        l.getDomainInfo().setScope(Scope.ARCHIVED);
        Datatype el = datatypeService.findById(l.getId());
        if (el != null) {
          el.getDomainInfo().setScope(Scope.ARCHIVED);
          datatypeService.save(el);
        }
      }
    }
  }

  private void archiveSegmentRegistry(SegmentRegistry segmentRegistry) throws ValidationException {
    // TODO Auto-generated method stub
    for (Link l : segmentRegistry.getChildren()) {
      if (l.getDomainInfo() != null && l.getDomainInfo().getScope().equals(Scope.USER)) {
        l.getDomainInfo().setScope(Scope.ARCHIVED);
        Segment el = segmentService.findById(l.getId());
        if (el != null) {
          el.getDomainInfo().setScope(Scope.ARCHIVED);
          segmentService.save(el);
        }
      }
    }
  }

  private void archiveProfileComponents(ProfileComponentRegistry profileComponentRegistry) {
    // TODO Auto-generated method stub
    for (Link l : profileComponentRegistry.getChildren()) {
      if (l.getDomainInfo() != null && l.getDomainInfo().getScope().equals(Scope.USER)) {
        l.getDomainInfo().setScope(Scope.ARCHIVED);
        ProfileComponent el = profileComponentService.findById(l.getId());
        if (el != null) {
          el.getDomainInfo().setScope(Scope.ARCHIVED);
          profileComponentService.save(el);
        }
      }
    }
  }

  private void archiveConformanceProfiles(ConformanceProfileRegistry compositeProfileRegistry) {
    // TODO Auto-generated method stub
    for (Link l : compositeProfileRegistry.getChildren()) {
      if (l.getDomainInfo() != null && l.getDomainInfo().getScope().equals(Scope.USER)) {
        l.getDomainInfo().setScope(Scope.ARCHIVED);
        ConformanceProfile el = conformanceProfileService.findById(l.getId());
        if (el != null) {
          el.getDomainInfo().setScope(Scope.ARCHIVED);
          conformanceProfileService.save(el);
        }
      }
    }
  }

  /*
   * (non-Javadoc)
   * 
   * @see
   * gov.nist.hit.hl7.igamt.ig.service.IgService#convertDomainToConformanceStatement(gov.nist.hit.
   * hl7.igamt.ig.domain.Ig)
   */
  @Override
  public IgDocumentConformanceStatement convertDomainToConformanceStatement(Ig igdoument) {
    HashMap<String, ConformanceStatementsContainer> associatedMSGConformanceStatementMap = new HashMap<String, ConformanceStatementsContainer>();
    HashMap<String, ConformanceStatementsContainer> associatedSEGConformanceStatementMap = new HashMap<String, ConformanceStatementsContainer>();
    HashMap<String, ConformanceStatementsContainer> associatedDTConformanceStatementMap = new HashMap<String, ConformanceStatementsContainer>();
    
    Set<ConformanceStatement> allIGCSs = this.conformanceStatementRepository.findByIgDocumentId(igdoument.getId());
    for(ConformanceStatement cs : allIGCSs) {
      System.out.println(cs);
      if(cs.getLevel().equals(Level.DATATYPE)) {
        if(cs.getSourceIds() != null && cs.getSourceIds().size() > 0) {
          for(String dtId : cs.getSourceIds()) {
            Datatype dt = this.datatypeService.findById(dtId);
            if(dt != null) {
              if (associatedDTConformanceStatementMap.containsKey(dt.getLabel())) {
                associatedDTConformanceStatementMap.get(dt.getLabel()).getConformanceStatements().add(cs);
              } else {
                ConformanceStatementsContainer csc = new ConformanceStatementsContainer(new HashSet<ConformanceStatement>(), Type.DATATYPE, dtId, dt.getLabel());
                csc.getConformanceStatements().add(cs);
                associatedDTConformanceStatementMap.put(dt.getLabel(), csc);
              }  
            }
          }
        }else {
          if (associatedDTConformanceStatementMap.containsKey("NotAssociated")) {
            associatedDTConformanceStatementMap.get("NotAssociated").getConformanceStatements().add(cs);
          } else {
            ConformanceStatementsContainer csc = new ConformanceStatementsContainer(new HashSet<ConformanceStatement>(), Type.DATATYPE, "NotAssociated", "Not associated");
            csc.getConformanceStatements().add(cs);
            associatedDTConformanceStatementMap.put("NotAssociated", csc);
          } 
        }
      } else if(cs.getLevel().equals(Level.SEGMENT)) {
        if(cs.getSourceIds() != null && cs.getSourceIds().size() > 0) {
          for(String segId : cs.getSourceIds()) {
            Segment s = this.segmentService.findById(segId);
            if(s != null) {
              if (associatedSEGConformanceStatementMap.containsKey(s.getLabel())) {
                associatedSEGConformanceStatementMap.get(s.getLabel()).getConformanceStatements().add(cs);
              } else {
                ConformanceStatementsContainer csc = new ConformanceStatementsContainer(new HashSet<ConformanceStatement>(), Type.SEGMENT, segId, s.getLabel());
                csc.getConformanceStatements().add(cs);
                associatedSEGConformanceStatementMap.put(s.getLabel(), csc);
              }  
            }
          }
        }else {
          if (associatedSEGConformanceStatementMap.containsKey("NotAssociated")) {
            associatedSEGConformanceStatementMap.get("NotAssociated").getConformanceStatements().add(cs);
          } else {
            ConformanceStatementsContainer csc = new ConformanceStatementsContainer(new HashSet<ConformanceStatement>(), Type.SEGMENT, "NotAssociated", "Not associated");
            csc.getConformanceStatements().add(cs);
            associatedSEGConformanceStatementMap.put("NotAssociated", csc);
          } 
        }
      } else if(cs.getLevel().equals(Level.CONFORMANCEPROFILE)) {
        if(cs.getSourceIds() != null && cs.getSourceIds().size() > 0) {
          for(String cpId : cs.getSourceIds()) {
            ConformanceProfile cp = this.conformanceProfileService.findById(cpId);
            if(cp != null) {
              if (associatedMSGConformanceStatementMap.containsKey(cp.getLabel())) {
                associatedMSGConformanceStatementMap.get(cp.getLabel()).getConformanceStatements().add(cs);
              } else {
                ConformanceStatementsContainer csc = new ConformanceStatementsContainer(new HashSet<ConformanceStatement>(), Type.CONFORMANCEPROFILE, cpId, cp.getLabel());
                csc.getConformanceStatements().add(cs);
                associatedMSGConformanceStatementMap.put(cp.getLabel(), csc);
              }  
            }
          }
        }else {
          if (associatedMSGConformanceStatementMap.containsKey("NotAssociated")) {
            associatedMSGConformanceStatementMap.get("NotAssociated").getConformanceStatements().add(cs);
          } else {
            ConformanceStatementsContainer csc = new ConformanceStatementsContainer(new HashSet<ConformanceStatement>(), Type.CONFORMANCEPROFILE, "NotAssociated", "Not associated");
            csc.getConformanceStatements().add(cs);
            associatedMSGConformanceStatementMap.put("NotAssociated", csc);
          } 
        }
      }
    }
    IgDocumentConformanceStatement igDocumentConformanceStatement = new IgDocumentConformanceStatement();
    igDocumentConformanceStatement.setAssociatedDTConformanceStatementMap(associatedDTConformanceStatementMap);
    igDocumentConformanceStatement.setAssociatedSEGConformanceStatementMap(associatedSEGConformanceStatementMap);
    igDocumentConformanceStatement.setAssociatedMSGConformanceStatementMap(associatedMSGConformanceStatementMap);
    
    for(Link msgLink : igdoument.getConformanceProfileRegistry().getChildren()){
      ConformanceProfile msg = this.conformanceProfileService.findById(msgLink.getId());
      if(msg != null && msg.getDomainInfo() != null){
        ConformanceProfileLabel conformanceProfileLabel = new ConformanceProfileLabel();
        conformanceProfileLabel.setDomainInfo(msg.getDomainInfo());
        conformanceProfileLabel.setId(msg.getId());
        conformanceProfileLabel.setLabel(msg.getLabel());
        conformanceProfileLabel.setName(msg.getStructID());
        igDocumentConformanceStatement.addUsersConformanceProfileSelectItem(new ConformanceProfileSelectItem(msg.getLabel(), conformanceProfileLabel));
      }
    }
    
    for(Link segLink : igdoument.getSegmentRegistry().getChildren()){
      Segment seg = this.segmentService.findById(segLink.getId());
      if(seg != null && seg.getDomainInfo() != null && seg.getDomainInfo().getScope() != null && seg.getDomainInfo().getScope().equals(Scope.USER)){
        SegmentLabel segmentLabel = new SegmentLabel();
        segmentLabel.setDomainInfo(seg.getDomainInfo());
        segmentLabel.setExt(seg.getExt());
        segmentLabel.setId(seg.getId());
        segmentLabel.setLabel(seg.getLabel());
        segmentLabel.setName(seg.getName());
        igDocumentConformanceStatement.addUsersSegmentSelectItem(new SegmentSelectItem(seg.getLabel(), segmentLabel));
      }
    }
    
    for(Link dtLink : igdoument.getDatatypeRegistry().getChildren()){
      Datatype dt = this.datatypeService.findById(dtLink.getId());
      if(dt != null && dt.getDomainInfo() != null && dt.getDomainInfo().getScope() != null && dt.getDomainInfo().getScope().equals(Scope.USER)){
        DatatypeLabel datatypeLabel = new DatatypeLabel();
        datatypeLabel.setDomainInfo(dt.getDomainInfo());
        datatypeLabel.setExt(dt.getExt());
        datatypeLabel.setId(dt.getId());
        datatypeLabel.setLabel(dt.getLabel());
        datatypeLabel.setName(dt.getName());
        igDocumentConformanceStatement.addUsersDatatypeSelectItem(new DatatypeSelectItem(dt.getLabel(), datatypeLabel));
      }
    }
    return igDocumentConformanceStatement;
  }

  private Set<ConformanceStatement> collectCS(Set<String> conformanceStatementIds) {
    Set<ConformanceStatement> result = new HashSet<ConformanceStatement>();
    if (conformanceStatementIds != null) {
      for (String id : conformanceStatementIds) {
        result.add(this.conformanceStatementRepository.findById(id).get());
      }
    }

    return result;
  }

@Override
public IGContentMap collectData(Ig ig) {
	IGContentMap contentMap= new IGContentMap();

	List<ConformanceProfile> conformanceProfiles = conformanceProfileService.findByIdIn(ig.getConformanceProfileRegistry().getLinksAsIds());
	
    Map<String, ConformanceProfile> conformanceProfilesMap = conformanceProfiles.stream().collect(
            Collectors.toMap(x -> x.getId(), x->x));
    contentMap.setConformanceProfiles(conformanceProfilesMap);
	
    
	List<Segment> segments = segmentService.findByIdIn(ig.getSegmentRegistry().getLinksAsIds());
	  Map<String, Segment> segmentsMap = segments.stream().collect(
	            Collectors.toMap(x -> x.getId(), x->x));
	  
	  contentMap.setSegments(segmentsMap);


	List<Datatype> datatypes = datatypeService.findByIdIn(ig.getDatatypeRegistry().getLinksAsIds());
	  Map<String, Datatype> datatypesMap = datatypes.stream().collect(
	            Collectors.toMap(x -> x.getId(), x->x));
	  contentMap.setDatatypes(datatypesMap);
	  
	List<Valueset> valuesets= valueSetService.findByIdIn(ig.getValueSetRegistry().getLinksAsIds());
	  Map<String, Valueset> valuesetsMap = valuesets.stream().collect(
	            Collectors.toMap(x -> x.getId(), x->x));
	  
	  contentMap.setValuesets(valuesetsMap);
//	  
//	List<CompositeProfile> compositeProfiles = compositeProfileServie.findAllById(ig.getCompositeProfileRegistry().getLinksAsIds());
//	    Map<String, CompositeProfile> compositeProfilesMap = compositeProfiles.stream().collect(
//	            Collectors.toMap(x -> x.getId(), x->x));
//	    contentMap.setCompositeProfiles(compositeProfilesMap);
//	    
	  return contentMap;
	}

	@Override
	public void buildDependencies(IGContentMap contentMap){
				
		for(ConformanceProfile p: contentMap.getConformanceProfiles().values()) {
			relationshipService.saveAll(conformanceProfileService.collectDependencies(p));
		}
		for(Segment s: contentMap.getSegments().values()) {
			relationshipService.saveAll(segmentService.collectDependencies(s));
		}
		for(Datatype d: contentMap.getDatatypes().values()) {
			relationshipService.saveAll(datatypeService.collectDependencies(d));
		}
	
	}

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.ig.service.IgService#generateDataModel(gov.nist.hit.hl7.igamt.ig.domain.Ig)
   */
  @Override
  public IgDataModel generateDataModel(Ig ig) throws Exception {
    IgDataModel igDataModel = new IgDataModel();
    igDataModel.setModel(ig);
    
    Set<DatatypeDataModel> datatypes = new HashSet<DatatypeDataModel>();
    Set<SegmentDataModel> segments = new HashSet<SegmentDataModel>();
    Set<ConformanceProfileDataModel> conformanceProfiles = new HashSet<ConformanceProfileDataModel>();
    Set<ValuesetDataModel> valuesets = new HashSet<ValuesetDataModel>();
    Map<String, ValuesetBindingDataModel> valuesetBindingDataModelMap = new HashMap<String, ValuesetBindingDataModel>();
    
    for (Link link : ig.getValueSetRegistry().getChildren()) {
      Valueset vs = this.valueSetService.findById(link.getId());
      if(vs != null){
        ValuesetDataModel valuesetDataModel = new ValuesetDataModel();
        valuesetDataModel.setModel(vs);
        valuesetBindingDataModelMap.put(vs.getId(), new ValuesetBindingDataModel(vs));
        valuesets.add(valuesetDataModel);
      }else throw new Exception("Valueset is missing.");
    }
    
    for (Link link : ig.getDatatypeRegistry().getChildren()) {
      Datatype d = this.datatypeService.findById(link.getId());
      if(d != null){
        DatatypeDataModel datatypeDataModel = new DatatypeDataModel();
        datatypeDataModel.putModel(d, this.datatypeService, valuesetBindingDataModelMap, this.conformanceStatementRepository, this.predicateRepository);
        datatypes.add(datatypeDataModel);
      }else throw new Exception("Datatype is missing.");
    }
    
    for (Link link : ig.getSegmentRegistry().getChildren()) {
      Segment s = this.segmentService.findById(link.getId());
      if(s != null){
        SegmentDataModel segmentDataModel = new SegmentDataModel();
        segmentDataModel.putModel(s, this.datatypeService, valuesetBindingDataModelMap, this.conformanceStatementRepository, this.predicateRepository);
//        CoConstraintTable coConstraintTable = this.coConstraintService.getCoConstraintForSegment(s.getId());
//        segmentDataModel.setCoConstraintTable(coConstraintTable);
        segments.add(segmentDataModel);
      }else throw new Exception("Segment is missing.");
    }
    
    for (Link link : ig.getConformanceProfileRegistry().getChildren()) {
      ConformanceProfile cp = this.conformanceProfileService.findById(link.getId());
      if(cp != null){
        ConformanceProfileDataModel conformanceProfileDataModel = new ConformanceProfileDataModel();
        conformanceProfileDataModel.putModel(cp, valuesetBindingDataModelMap, this.conformanceStatementRepository, this.predicateRepository, this.segmentService);
        conformanceProfiles.add(conformanceProfileDataModel);
      }else throw new Exception("ConformanceProfile is missing.");
    }
    
    igDataModel.setDatatypes(datatypes);
    igDataModel.setSegments(segments);
    igDataModel.setConformanceProfiles(conformanceProfiles);
    igDataModel.setValuesets(valuesets);
    
    
    return igDataModel;
  }

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.ig.service.IgService#exportValidationXMLByZip(gov.nist.hit.hl7.igamt.ig.domain.datamodel.IgDataModel, java.lang.String[], java.lang.String[])
   */
  @Override
  public InputStream exportValidationXMLByZip(IgDataModel igModel, String[] conformanceProfileIds, String[] compositeProfileIds) throws CloneNotSupportedException, IOException, ClassNotFoundException, ProfileSerializationException {
    
    this.normalizeIgModel(igModel, conformanceProfileIds);

    ByteArrayOutputStream outputStream = null;
    byte[] bytes;
    outputStream = new ByteArrayOutputStream();
    ZipOutputStream out = new ZipOutputStream(outputStream);

    String profileXMLStr = this.serializeProfileToDoc(igModel).toXML();
//    String valueSetXMLStr = this.serializeTableXML(profile, metadata, tablesMap).toXML();
//    String constraintXMLStr = this.serializeConstraintsXML(profile, metadata, segmentsMap, datatypesMap, tablesMap).toXML();
   
    System.out.println(profileXMLStr);

    this.generateProfileIS(out, profileXMLStr);
//    this.generateValueSetIS(out, valueSetXMLStr);
//    this.generateConstraintsIS(out, constraintXMLStr);

    out.close();
    bytes = outputStream.toByteArray();
    return new ByteArrayInputStream(bytes);
  }
  
  /**
   * @param igModel
   * @return
   * @throws ProfileSerializationException 
   */
  private Document serializeProfileToDoc(IgDataModel igModel) throws ProfileSerializationException {
    try {
      Element e = new Element("ConformanceProfile");
      this.serializeProfileMetaData(e, igModel, "Validation");

      Element ms = new Element("Messages");
      for (ConformanceProfileDataModel  cpModel : igModel.getConformanceProfiles()) {
        ms.appendChild(this.serializeConformanceProfile(cpModel, igModel));
      }
      e.appendChild(ms);

      
      Element ss = new Element("Segments");
      for (SegmentDataModel sModel : igModel.getSegments()) {
        ss.appendChild(this.serializeSegment(sModel, igModel));
      }
      e.appendChild(ss);

      Element ds = new Element("Datatypes");
      for (DatatypeDataModel dModel : igModel.getDatatypes()) {
        ds.appendChild(this.serializeDatatype(dModel, igModel));
      }
      e.appendChild(ds);

      Document doc = new Document(e);

      return doc;
    } catch (Exception e) {
      throw new ProfileSerializationException(e, igModel != null ? igModel.getModel().getId() : "");
    }
  }
  
  /**
   * @param dModel
   * @param igModel
   * @return
   * @throws DatatypeSerializationException 
   */
  private Element serializeDatatype(DatatypeDataModel dModel, IgDataModel igModel) throws DatatypeSerializationException {
    try {
      Element elmDatatype = new Element("Datatype");
      
      if(igModel.getModel().getDomainInfo() != null && igModel.getModel().getDomainInfo().getVersion() != null && dModel.getModel().getDomainInfo() != null && dModel.getModel().getDomainInfo().getVersion() != null) {
        if(igModel.getModel().getDomainInfo().getVersion().equals(dModel.getModel().getDomainInfo().getVersion())){
          elmDatatype.addAttribute(new Attribute("Label", this.str(dModel.getModel().getLabel())));
          elmDatatype.addAttribute( new Attribute("ID", this.str(dModel.getModel().getLabel())));
        }else{
          elmDatatype.addAttribute(new Attribute("Label", this.str(dModel.getModel().getLabel() + "_" + dModel.getModel().getDomainInfo().getVersion().replaceAll("\\.", "-")))); 
          elmDatatype.addAttribute(new Attribute("ID", this.str(dModel.getModel().getLabel() + "_" + dModel.getModel().getDomainInfo().getVersion().replaceAll("\\.", "-")))); 
        }
      } else {
        elmDatatype.addAttribute(new Attribute("Label", this.str(dModel.getModel().getLabel())));
        elmDatatype.addAttribute(new Attribute("ID", this.str(dModel.getModel().getLabel())));
      }

      elmDatatype.addAttribute(new Attribute("Name", this.str(dModel.getModel().getName())));
      elmDatatype.addAttribute(new Attribute("Label", this.str(dModel.getModel().getLabel())));
      elmDatatype.addAttribute(new Attribute("Version", this.str(dModel.getModel().getDomainInfo().getVersion())));
      if (dModel.getModel().getDescription() == null || dModel.getModel().getDescription().equals("")) {
        elmDatatype.addAttribute(new Attribute("Description", "NoDesc"));
      } else {
        elmDatatype.addAttribute(new Attribute("Description", this.str(dModel.getModel().getDescription())));
      }

      if (dModel.getComponentDataModels() != null && dModel.getComponentDataModels().size() > 0) {
        Map<Integer, ComponentDataModel> components = new HashMap<Integer, ComponentDataModel>();
        for (ComponentDataModel cModel : dModel.getComponentDataModels()) {
          components.put(cModel.getModel().getPosition(), cModel);
        }

        for (int i = 1; i < components.size() + 1; i++) {
          try {
            ComponentDataModel c = components.get(i);
            Element elmComponent = new Element("Component");
            
            elmComponent.addAttribute(new Attribute("Name", this.str(c.getModel().getName())));
            elmComponent.addAttribute(new Attribute("Usage", this.str(c.getModel().getUsage().toString())));

            if(igModel.getModel().getDomainInfo() != null && igModel.getModel().getDomainInfo().getVersion() != null && c.getDatatype().getDomainInfo() != null && c.getDatatype().getDomainInfo().getVersion() != null) {
              if(igModel.getModel().getDomainInfo().getVersion().equals(c.getDatatype().getDomainInfo().getVersion())){
                elmComponent.addAttribute(new Attribute("Datatype", this.str(c.getDatatype().getLabel())));
              }else{
                elmComponent.addAttribute(new Attribute("Datatype", this.str(c.getDatatype().getLabel() + "_" + c.getDatatype().getDomainInfo().getVersion().replaceAll("\\.", "-")))); 
              }
            } else {
              elmComponent.addAttribute(new Attribute("Datatype", this.str(c.getDatatype().getLabel())));
            }
            
            if (c.getModel().getMinLength() != null && !c.getModel().getMinLength().isEmpty()) {
              elmComponent.addAttribute(new Attribute("MinLength", this.str(c.getModel().getMinLength())));

            } else {
              elmComponent.addAttribute(new Attribute("MinLength", "NA"));
            }

            if (c.getModel().getMaxLength() != null && !c.getModel().getMaxLength().isEmpty()) {
              elmComponent.addAttribute(new Attribute("MaxLength", this.str(c.getModel().getMaxLength())));

            } else {
              elmComponent.addAttribute(new Attribute("MaxLength", "NA"));

            }
            if (c.getModel().getConfLength() != null && !c.getModel().getConfLength().equals("")) {
              elmComponent.addAttribute(new Attribute("ConfLength", this.str(c.getModel().getConfLength())));
            } else {
              elmComponent.addAttribute(new Attribute("ConfLength", "NA"));
            }

            Set<ValuesetBindingDataModel> valueSetBindings = c.getValuesets();
            if (valueSetBindings != null && valueSetBindings.size() > 0) {
              String bindingString = "";
              String bindingStrength = null;
              Set<Integer> bindingLocation = null;

              for (ValuesetBindingDataModel binding : valueSetBindings) {
                try {
                  bindingStrength = binding.getValuesetBinding().getStrength().toString();
                  if(binding.getValuesetBinding().getValuesetLocations() != null && binding.getValuesetBinding().getValuesetLocations().size() > 0) bindingLocation = binding.getValuesetBinding().getValuesetLocations();
                  if (binding != null && binding.getBindingIdentifier() != null && !binding.getBindingIdentifier().equals("")) {
                    if(igModel.getModel().getDomainInfo() != null && igModel.getModel().getDomainInfo().getVersion() != null && binding.getDomainInfo() != null && binding.getDomainInfo().getVersion() != null) {
                      if(igModel.getModel().getDomainInfo().getVersion().equals(binding.getDomainInfo().getVersion())){
                        bindingString = bindingString + binding.getBindingIdentifier() + ":";
                      }else{
                        bindingString = bindingString + binding.getBindingIdentifier() + "_"  + binding.getDomainInfo().getVersion().replaceAll("\\.", "-") + ":";
                      }
                    } else {
                      bindingString = bindingString + binding.getBindingIdentifier() + ":";
                    }
                  }
                } catch (Exception e) {
                  e.printStackTrace();
                  throw new TableSerializationException(e, "" + c.getModel().getPosition());
                }


              }

              if (!bindingString.equals("")) elmComponent.addAttribute(new Attribute("Binding", bindingString.substring(0, bindingString.length() - 1)));
              if (bindingStrength != null) elmComponent.addAttribute(new Attribute("BindingStrength", bindingStrength));
              if (bindingLocation != null && bindingLocation.size() > 0) {
                String bindingLocationStr = "";
                for(Integer index : bindingLocation) {
                  bindingLocationStr = bindingLocationStr + index + ":";
                }
                
                elmComponent.addAttribute(new Attribute("BindingLocation", bindingLocationStr.substring(0, bindingLocationStr.length() - 1)));
              } else {
              }
            }

            elmDatatype.appendChild(elmComponent);
          } catch (Exception e) {
            throw new DatatypeComponentSerializationException(e, i);
          }

        }
      }
      return elmDatatype;
    } catch (Exception e) {
      throw new DatatypeSerializationException(e, dModel.getModel().getLabel());
    }
  }

  /**
   * @param sModel
   * @param igModel
   * @return
   * @throws SegmentSerializationException 
   */
  private Element serializeSegment(SegmentDataModel sModel, IgDataModel igModel) throws SegmentSerializationException {
    try {
      //TODO DynamicMapping Need
      Element elmSegment = new Element("Segment");
      
      if(igModel.getModel().getDomainInfo() != null && igModel.getModel().getDomainInfo().getVersion() != null && sModel.getModel().getDomainInfo() != null && sModel.getModel().getDomainInfo().getVersion() != null) {
        if(igModel.getModel().getDomainInfo().getVersion().equals(sModel.getModel().getDomainInfo().getVersion())){
          elmSegment.addAttribute(new Attribute("Label", this.str(sModel.getModel().getLabel())));
          elmSegment.addAttribute( new Attribute("ID", this.str(sModel.getModel().getLabel())));
        }else{
          elmSegment.addAttribute(new Attribute("Label", this.str(sModel.getModel().getLabel() + "_" + sModel.getModel().getDomainInfo().getVersion().replaceAll("\\.", "-")))); 
          elmSegment.addAttribute(new Attribute("ID", this.str(sModel.getModel().getLabel() + "_" + sModel.getModel().getDomainInfo().getVersion().replaceAll("\\.", "-")))); 
        }
      } else {
        elmSegment.addAttribute(new Attribute("Label", this.str(sModel.getModel().getLabel())));
        elmSegment.addAttribute(new Attribute("ID", this.str(sModel.getModel().getLabel())));
      }
      
      elmSegment.addAttribute(new Attribute("Name", this.str(sModel.getModel().getName())));
      elmSegment.addAttribute(new Attribute("Version", this.str(sModel.getModel().getDomainInfo().getVersion())));
      if (sModel.getModel().getDescription() == null || sModel.getModel().getDescription().equals("")) {
        elmSegment.addAttribute(new Attribute("Description", "NoDesc"));
      } else {
        elmSegment.addAttribute(new Attribute("Description", this.str(sModel.getModel().getDescription())));
      }

      Map<Integer, FieldDataModel> fields = new HashMap<Integer, FieldDataModel>();

      for (FieldDataModel fModel : sModel.getFieldDataModels()) {
        fields.put(fModel.getModel().getPosition(), fModel);
      }

      for (int i = 1; i < fields.size() + 1; i++) {
        try {
          FieldDataModel f = fields.get(i);

          if (f != null) {
            DatatypeBindingDataModel dBindingModel = f.getDatatype();

            Element elmField = new Element("Field");
            elmField.addAttribute(new Attribute("Name", this.str(f.getModel().getName())));
            elmField.addAttribute(new Attribute("Usage", this.str(f.getModel().getUsage().toString())));
            
            if(igModel.getModel().getDomainInfo() != null && igModel.getModel().getDomainInfo().getVersion() != null && dBindingModel.getDomainInfo() != null && dBindingModel.getDomainInfo().getVersion() != null) {
              if(igModel.getModel().getDomainInfo().getVersion().equals(dBindingModel.getDomainInfo().getVersion())){
                elmField.addAttribute(new Attribute("Datatype", this.str(dBindingModel.getLabel())));
              }else{
                elmSegment.addAttribute(new Attribute("Datatype", this.str(dBindingModel.getLabel() + "_" + dBindingModel.getDomainInfo().getVersion().replaceAll("\\.", "-")))); 
              }
            } else {
              elmField.addAttribute(new Attribute("Datatype", this.str(dBindingModel.getLabel())));
            }

            if (f.getModel().getMinLength() != null && !f.getModel().getMinLength().isEmpty()) {
              elmField.addAttribute(new Attribute("MinLength", this.str(f.getModel().getMinLength())));

            } else {
              elmField.addAttribute(new Attribute("MinLength", "NA"));
            }

            if (f.getModel().getMaxLength() != null && !f.getModel().getMaxLength().isEmpty()) {
              elmField.addAttribute(new Attribute("MaxLength", this.str(f.getModel().getMaxLength())));

            } else {
              elmField.addAttribute(new Attribute("MaxLength", "NA"));

            }

            if (f.getModel().getConfLength() != null && !f.getModel().getConfLength().equals("")) {
              elmField.addAttribute(new Attribute("ConfLength", this.str(f.getModel().getConfLength())));
            } else {
              elmField.addAttribute(new Attribute("ConfLength", "NA"));
            }

            Set<ValuesetBindingDataModel> valueSetBindings = f.getValuesets();
            if (valueSetBindings != null && valueSetBindings.size() > 0) {
              String bindingString = "";
              String bindingStrength = null;
              Set<Integer> bindingLocation = null;

              for (ValuesetBindingDataModel binding : valueSetBindings) {
                try {
                  bindingStrength = binding.getValuesetBinding().getStrength().toString();
                  if(binding.getValuesetBinding().getValuesetLocations() != null && binding.getValuesetBinding().getValuesetLocations().size() > 0) bindingLocation = binding.getValuesetBinding().getValuesetLocations();
                  if (binding != null && binding.getBindingIdentifier() != null && !binding.getBindingIdentifier().equals("")) {
                    if(igModel.getModel().getDomainInfo() != null && igModel.getModel().getDomainInfo().getVersion() != null && binding.getDomainInfo() != null && binding.getDomainInfo().getVersion() != null) {
                      if(igModel.getModel().getDomainInfo().getVersion().equals(binding.getDomainInfo().getVersion())){
                        bindingString = bindingString + binding.getBindingIdentifier() + ":";
                      }else{
                        bindingString = bindingString + binding.getBindingIdentifier() + "_"  + binding.getDomainInfo().getVersion().replaceAll("\\.", "-") + ":";
                      }
                    } else {
                      bindingString = bindingString + binding.getBindingIdentifier() + ":";
                    }
                  }
                } catch (Exception e) {
                  e.printStackTrace();
                  throw new TableSerializationException(e, "" + f.getModel().getPosition());
                }


              }

              if (!bindingString.equals("")) elmField.addAttribute(new Attribute("Binding", bindingString.substring(0, bindingString.length() - 1)));
              if (bindingStrength != null) elmField.addAttribute(new Attribute("BindingStrength", bindingStrength));
              if (bindingLocation != null && bindingLocation.size() > 0) {
                String bindingLocationStr = "";
                for(Integer index : bindingLocation) {
                  bindingLocationStr = bindingLocationStr + index + ":";
                }
                
                elmField.addAttribute(new Attribute("BindingLocation", bindingLocationStr.substring(0, bindingLocationStr.length() - 1)));
              } else {
              }
            }

            elmField.addAttribute(new Attribute("Min", "" + f.getModel().getMin()));
            elmField.addAttribute(new Attribute("Max", "" + f.getModel().getMax()));
            elmSegment.appendChild(elmField);
          }
        } catch (Exception e) {
          e.printStackTrace();
          throw new FieldSerializationException(e, "Field[" + i + "]");
        }
      }

      return elmSegment;
    } catch (Exception e) {
      e.printStackTrace();
      throw new SegmentSerializationException(e, sModel != null ? sModel.getModel().getId() : "");
    }
  }

  /**
   * @param cpModel
   * @param igModel
   * @return
   */
  private Element serializeConformanceProfile(ConformanceProfileDataModel cpModel, IgDataModel igModel) throws MessageSerializationException {
    try {
      Element elmMessage = new Element("Message");
      elmMessage.addAttribute(new Attribute("ID", cpModel.getModel().getId()));
      if (cpModel.getModel().getIdentifier() != null && !cpModel.getModel().getIdentifier().equals("")) elmMessage.addAttribute(new Attribute("Identifier", this.str(cpModel.getModel().getIdentifier())));
      if (cpModel.getModel().getName() != null && !cpModel.getModel().getName().equals("")) elmMessage.addAttribute(new Attribute("Name", this.str(cpModel.getModel().getName())));
      elmMessage.addAttribute(new Attribute("Type", this.str(cpModel.getModel().getMessageType())));
      elmMessage.addAttribute(new Attribute("Event", this.str(cpModel.getModel().getEvent())));
      elmMessage.addAttribute(new Attribute("StructID", this.str(cpModel.getModel().getStructID())));
      
      if (cpModel.getModel().getDescription() != null && !cpModel.getModel().getDescription().equals("")) elmMessage.addAttribute(new Attribute("Description", this.str(cpModel.getModel().getDescription())));

      Map<Integer, SegmentRefOrGroupDataModel> segmentRefOrGroupDataModels = new HashMap<Integer, SegmentRefOrGroupDataModel>();

      for (SegmentRefOrGroupDataModel segmentRefOrGroupDataModel  : cpModel.getSegmentRefOrGroupDataModels()) {
        segmentRefOrGroupDataModels.put(segmentRefOrGroupDataModel.getModel().getPosition(), segmentRefOrGroupDataModel);
      }

      for (int i = 1; i < segmentRefOrGroupDataModels.size() + 1; i++) {
        SegmentRefOrGroupDataModel segmentRefOrGroupDataModel = segmentRefOrGroupDataModels.get(i);
        if (segmentRefOrGroupDataModel.getType().equals(Type.SEGMENTREF)) {
          elmMessage.appendChild(serializeSegmentRef(segmentRefOrGroupDataModel, igModel));
        } else if (segmentRefOrGroupDataModel.getType().equals(Type.GROUP)) {
          elmMessage.appendChild(serializeGroup(segmentRefOrGroupDataModel, igModel));
        }
      }

      return elmMessage;
    } catch (Exception e) {
      e.printStackTrace();
      throw new MessageSerializationException(e, cpModel != null ? cpModel.getModel().getId() : "");
    }
  }

  /**
   * @param segmentRefOrGroupDataModel
   * @param igModel
   * @return
   * @throws GroupSerializationException 
   */
  private Element serializeGroup(SegmentRefOrGroupDataModel segmentRefOrGroupDataModel, IgDataModel igModel) throws GroupSerializationException {
    try {
      Element elmGroup = new Element("Group");
      elmGroup.addAttribute(new Attribute("ID", this.str(segmentRefOrGroupDataModel.getModel().getId())));
      elmGroup.addAttribute(new Attribute("Name", this.str(segmentRefOrGroupDataModel.getModel().getName())));
      elmGroup.addAttribute(new Attribute("Usage", this.str(segmentRefOrGroupDataModel.getModel().getUsage().toString())));
      elmGroup.addAttribute(new Attribute("Min", this.str(segmentRefOrGroupDataModel.getModel().getMin() + "")));
      elmGroup.addAttribute(new Attribute("Max", this.str(segmentRefOrGroupDataModel.getModel().getMax())));

      Map<Integer, SegmentRefOrGroupDataModel> segmentRefOrGroupDataModels = new HashMap<Integer, SegmentRefOrGroupDataModel>();

      for (SegmentRefOrGroupDataModel child  : segmentRefOrGroupDataModel.getChildren()) {
        segmentRefOrGroupDataModels.put(child.getModel().getPosition(), child);
      }

      for (int i = 1; i < segmentRefOrGroupDataModels.size() + 1; i++) {
        SegmentRefOrGroupDataModel childModel = segmentRefOrGroupDataModels.get(i);
        if (childModel.getType().equals(Type.SEGMENTREF)) {
          elmGroup.appendChild(serializeSegmentRef(childModel, igModel));
        } else if (childModel.getType().equals(Type.GROUP)) {
          elmGroup.appendChild(serializeGroup(childModel, igModel));
        }
      }

      return elmGroup;
    } catch (Exception e) {
      e.printStackTrace();
      throw new GroupSerializationException(e, segmentRefOrGroupDataModel != null ? segmentRefOrGroupDataModel.getModel().getId() : "");
    }
  }

  /**
   * @param segmentRefOrGroupDataModel
   * @param igModel
   * @return
   * @throws SegmentSerializationException 
   */
  private Element serializeSegmentRef(SegmentRefOrGroupDataModel segmentRefOrGroupDataModel, IgDataModel igModel) throws SegmentSerializationException {
    try {
      SegmentBindingDataModel segModel = segmentRefOrGroupDataModel.getSegment();
      Element elmSegment = new Element("Segment");
      
      if(igModel.getModel().getDomainInfo() != null && igModel.getModel().getDomainInfo().getVersion() != null && segModel.getDomainInfo() != null && segModel.getDomainInfo().getVersion() != null) {
        if(igModel.getModel().getDomainInfo().getVersion().equals(segModel.getDomainInfo().getVersion())){
          elmSegment.addAttribute(new Attribute("Ref", this.str(segModel.getLabel())));
        }else{
          elmSegment.addAttribute(new Attribute("Ref", this.str(segModel.getLabel() + "_" + segModel.getDomainInfo().getVersion().replaceAll("\\.", "-")))); 
        }
      } else {
        elmSegment.addAttribute(new Attribute("Ref", this.str(segModel.getLabel())));
      }
      
      elmSegment.addAttribute(new Attribute("Usage", this.str(segmentRefOrGroupDataModel.getModel().getUsage().toString())));
      elmSegment.addAttribute(new Attribute("Min", this.str(segmentRefOrGroupDataModel.getModel().getMin() + "")));
      elmSegment.addAttribute(new Attribute("Max", this.str(segmentRefOrGroupDataModel.getModel().getMax())));
      return elmSegment;
    } catch (Exception e) {
      e.printStackTrace();
        throw new SegmentSerializationException(e, segmentRefOrGroupDataModel != null ? segmentRefOrGroupDataModel.getModel().getId() : "");
    }
  }

  private void serializeProfileMetaData(Element e, IgDataModel igModel, String type) {
    if (type.equals("Validation")) {
      Attribute schemaDecl = new Attribute("noNamespaceSchemaLocation",
          "https://raw.githubusercontent.com/Jungyubw/NIST_healthcare_hl7_v2_profile_schema/master/Schema/NIST%20Validation%20Schema/Profile.xsd");
      schemaDecl.setNamespace("xsi", "http://www.w3.org/2001/XMLSchema-instance");
      e.addAttribute(schemaDecl);
    } else if (type.equals("Display")) {
      Attribute schemaDecl = new Attribute("noNamespaceSchemaLocation",
          "https://raw.githubusercontent.com/Jungyubw/NIST_healthcare_hl7_v2_profile_schema/master/Schema/NIST%20Display%20Schema/Profile.xsd");
      schemaDecl.setNamespace("xsi", "http://www.w3.org/2001/XMLSchema-instance");
      e.addAttribute(schemaDecl);
    }
    
    if(igModel != null && igModel.getModel() != null) {
      e.addAttribute(new Attribute("ID", igModel.getModel().getId()));
      if (igModel.getModel().getDomainInfo() != null && igModel.getModel().getDomainInfo().getVersion() != null) e.addAttribute(new Attribute("HL7Version", this.str(igModel.getModel().getDomainInfo().getVersion())));  
      
      Element elmMetaData = new Element("MetaData");
      
      if(igModel.getModel().getMetadata() != null) {
        elmMetaData.addAttribute(new Attribute("Name", !this.str(igModel.getModel().getMetadata().getTitle()).equals("") ? this.str(igModel.getModel().getMetadata().getTitle()) : "No Title Info"));
        elmMetaData.addAttribute(new Attribute("OrgName", !this.str(igModel.getModel().getMetadata().getOrgName()).equals("") ? this.str(igModel.getModel().getMetadata().getOrgName()) : "No Org Info"));
        elmMetaData.addAttribute(new Attribute("Version", !this.str(igModel.getModel().getVersion() + "").equals("") ? this.str(igModel.getModel().getVersion() + "") : "No Version Info"));
        
        if(igModel.getModel().getUpdateDate() != null) 
          elmMetaData.addAttribute(new Attribute("Date", !this.str(igModel.getModel().getUpdateDate().toString()).equals("") ? this.str(igModel.getModel().getUpdateDate().toString()) : "No Date Info"));
        else elmMetaData.addAttribute(new Attribute("Date", "No Date Info"));
        
        elmMetaData.addAttribute(new Attribute("SpecificationName", !this.str(igModel.getModel().getMetadata().getSpecificationName()).equals("") ? this.str(igModel.getModel().getMetadata().getSpecificationName()) : "No Version Info"));
      }
      e.appendChild(elmMetaData);
    }
  }

  private void generateProfileIS(ZipOutputStream out, String profileXML) throws IOException {
    byte[] buf = new byte[1024];
    out.putNextEntry(new ZipEntry("Profile.xml"));
    InputStream inProfile = IOUtils.toInputStream(profileXML);
    int lenTP;
    while ((lenTP = inProfile.read(buf)) > 0) {
      out.write(buf, 0, lenTP);
    }
    out.closeEntry();
    inProfile.close();
  }
  
  private String str(String value) {
    return value != null ? value : "";
  }
  
  
  private void normalizeIgModel(IgDataModel igModel, String[] conformanceProfileIds) throws CloneNotSupportedException, ClassNotFoundException, IOException {
    Map<String, DatatypeDataModel> toBeAddedDTs = new HashMap<String, DatatypeDataModel>();
    Map<String, SegmentDataModel> toBeAddedSegs = new HashMap<String, SegmentDataModel>();

    for (DatatypeDataModel dtModel : igModel.getDatatypes()) {
      for (String key : dtModel.getValuesetMap().keySet()) {
        List<String> pathList = new LinkedList<String>(Arrays.asList(key.split("\\.")));
        
        if (pathList.size() > 1) {
          ComponentDataModel cModel = dtModel.findComponentDataModelByPosition(Integer.parseInt(pathList.remove(0)));

          DatatypeDataModel childDtModel = igModel.findDatatype(cModel.getDatatype().getId());
          if (childDtModel == null) childDtModel = toBeAddedDTs.get(cModel.getDatatype().getId());
          DatatypeDataModel copyDtModel = (DatatypeDataModel)this.makeCopy(childDtModel);

          int randumNum = new SecureRandom().nextInt(100000);
          copyDtModel.getModel().setId(childDtModel.getModel().getId() + "_A" + randumNum);
          String ext = childDtModel.getModel().getExt();
          if (ext == null) ext = "";
          copyDtModel.getModel().setExt(ext + "_A" + randumNum);
          toBeAddedDTs.put(copyDtModel.getModel().getId(), copyDtModel);
          cModel.getDatatype().setId(copyDtModel.getModel().getId());

          updateChildDatatype(pathList, copyDtModel, igModel, dtModel.getValuesetMap().get(key), toBeAddedDTs);
        }
      }
    }

    for (SegmentDataModel segModel : igModel.getSegments()) {
      for (String key : segModel.getValuesetMap().keySet()) {
        List<String> pathList = new LinkedList<String>(Arrays.asList(key.split("\\.")));

        if (pathList.size() > 1) {
          FieldDataModel fModel = segModel.findFieldDataModelByPosition(Integer.parseInt(pathList.remove(0)));

          DatatypeDataModel childDtModel = igModel.findDatatype(fModel.getDatatype().getId());
          if (childDtModel == null) childDtModel = toBeAddedDTs.get(fModel.getDatatype().getId());
          DatatypeDataModel copyDtModel = (DatatypeDataModel)this.makeCopy(childDtModel);

          int randumNum = new SecureRandom().nextInt(100000);
          copyDtModel.getModel().setId(childDtModel.getModel().getId() + "_A" + randumNum);
          String ext = childDtModel.getModel().getExt();
          if (ext == null) ext = "";
          copyDtModel.getModel().setExt(ext + "_A" + randumNum);
          toBeAddedDTs.put(copyDtModel.getModel().getId(), copyDtModel);
          fModel.getDatatype().setId(copyDtModel.getModel().getId());

          updateChildDatatype(pathList, copyDtModel, igModel, segModel.getValuesetMap().get(key), toBeAddedDTs);
        }
      }
    }

    for (ConformanceProfileDataModel cpModel : igModel.getConformanceProfiles()) {
      for (String key : cpModel.getValuesetMap().keySet()) {
        List<String> pathList = new LinkedList<String>(Arrays.asList(key.split("\\.")));
        SegmentRefOrGroupDataModel childModel = cpModel.findChildByPosition(Integer.parseInt(pathList.remove(0)));
        updateGroupOrSegmentRefModel(pathList, childModel, igModel, cpModel.getValuesetMap().get(key), toBeAddedDTs, toBeAddedSegs);
      }
    }
    
    for (String key : toBeAddedDTs.keySet()) {
      igModel.getDatatypes().add(toBeAddedDTs.get(key));
    }
    for (String key : toBeAddedSegs.keySet()) {
      igModel.getSegments().add(toBeAddedSegs.get(key));
    }
  }

  private void updateGroupOrSegmentRefModel(List<String> pathList, SegmentRefOrGroupDataModel sgModel, IgDataModel igModel, Set<ValuesetBindingDataModel> valuesetBindingDataModels, Map<String, DatatypeDataModel> toBeAddedDTs, Map<String, SegmentDataModel> toBeAddedSegs) throws ClassNotFoundException, IOException {
    if (sgModel.getType().equals(Type.GROUP)) {
      SegmentRefOrGroupDataModel childModel = sgModel.findChildByPosition(Integer.parseInt(pathList.remove(0)));
      updateGroupOrSegmentRefModel(pathList, childModel, igModel, valuesetBindingDataModels, toBeAddedDTs, toBeAddedSegs);
    } else {
      SegmentDataModel sModel = igModel.findSegment(sgModel.getSegment().getId());
      if (sModel == null) sModel = toBeAddedSegs.get(sgModel.getSegment().getId());
      SegmentDataModel copySModel = (SegmentDataModel)this.makeCopy(sModel);
      int randumNum = new SecureRandom().nextInt(100000);
      copySModel.getModel().setId(sModel.getModel().getId() + "_A" + randumNum);
      String ext = sModel.getModel().getExt();
      if (ext == null)
        ext = "";
      copySModel.getModel().setExt(ext + "_A" + randumNum);

      if (pathList.size() == 1) {
        if(valuesetBindingDataModels != null && valuesetBindingDataModels.size() > 0) {
          valuesetBindingDataModels = this.makeCopySet(valuesetBindingDataModels);
          copySModel.getValuesetMap().put(pathList.get(0), valuesetBindingDataModels);
          FieldDataModel fModel = copySModel.findFieldDataModelByPosition(Integer.parseInt(pathList.get(0)));
          fModel.setValuesets(valuesetBindingDataModels);
        }
      } else if (pathList.size() > 1) {
        FieldDataModel fModel = copySModel.findFieldDataModelByPosition(Integer.parseInt(pathList.remove(0)));
        
        DatatypeDataModel childDtModel = igModel.findDatatype(fModel.getDatatype().getId());
        if (childDtModel == null) childDtModel = toBeAddedDTs.get(fModel.getDatatype().getId());
        DatatypeDataModel copyDtModel = (DatatypeDataModel)this.makeCopy(childDtModel);

        randumNum = new SecureRandom().nextInt(100000);
        copyDtModel.getModel().setId(childDtModel.getModel().getId() + "_A" + randumNum);
        String ext2 = childDtModel.getModel().getExt();
        if (ext2 == null) ext2 = "";
        copyDtModel.getModel().setExt(ext2 + "_A" + randumNum);
        toBeAddedDTs.put(copyDtModel.getModel().getId(), copyDtModel);
        fModel.getDatatype().setId(copyDtModel.getModel().getId());
        
        this.updateChildDatatype(pathList, copyDtModel, igModel, valuesetBindingDataModels, toBeAddedDTs);
      }
      sgModel.getSegment().setId(copySModel.getModel().getId());
      toBeAddedSegs.put(copySModel.getModel().getId(), copySModel);
    }
    
  }

  private void updateChildDatatype(List<String> pathList, DatatypeDataModel dtModel, IgDataModel igModel, Set<ValuesetBindingDataModel> valuesetBindingDataModels, Map<String, DatatypeDataModel> toBeAddedDTs) throws ClassNotFoundException, IOException {
    if (pathList.size() == 1) {
      if(valuesetBindingDataModels != null && valuesetBindingDataModels.size() > 0) {
        valuesetBindingDataModels = this.makeCopySet(valuesetBindingDataModels);
        dtModel.getValuesetMap().put(pathList.get(0), valuesetBindingDataModels);
        ComponentDataModel cModel = dtModel.findComponentDataModelByPosition(Integer.parseInt(pathList.get(0)));
        cModel.setValuesets(valuesetBindingDataModels);
      }

    } else if (pathList.size() > 1) {
      ComponentDataModel cModel = dtModel.findComponentDataModelByPosition(Integer.parseInt(pathList.remove(0)));
      
      DatatypeDataModel childDtModel = igModel.findDatatype(cModel.getDatatype().getId());
      if (childDtModel == null) childDtModel = toBeAddedDTs.get(cModel.getDatatype().getId());
      DatatypeDataModel copyDtModel = (DatatypeDataModel)this.makeCopy(childDtModel);

      int randumNum = new SecureRandom().nextInt(100000);
      copyDtModel.getModel().setId(childDtModel.getModel().getId() + "_A" + randumNum);
      String ext = childDtModel.getModel().getExt();
      if (ext == null) ext = "";
      copyDtModel.getModel().setExt(ext + "_A" + randumNum);
      toBeAddedDTs.put(copyDtModel.getModel().getId(), copyDtModel);
      cModel.getDatatype().setId(copyDtModel.getModel().getId());
      
      this.updateChildDatatype(pathList, copyDtModel, igModel, valuesetBindingDataModels, toBeAddedDTs);
    }
    
  }
  
  private Object makeCopy(Object original) throws IOException, ClassNotFoundException {
    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    ObjectOutputStream oos = new ObjectOutputStream(baos);
    oos.writeObject(original);
    ByteArrayInputStream bais = new ByteArrayInputStream(baos.toByteArray());
    ObjectInputStream ois = new ObjectInputStream(bais);
    return ois.readObject();
  }
  
  private Set<ValuesetBindingDataModel> makeCopySet(Set<ValuesetBindingDataModel> valuesetBindingDataModels) throws IOException, ClassNotFoundException {
    Set<ValuesetBindingDataModel> copy = new HashSet<ValuesetBindingDataModel>();
    for(ValuesetBindingDataModel o : valuesetBindingDataModels){
      copy.add((ValuesetBindingDataModel)this.makeCopy(o));
    }
    return copy;
  }
}
