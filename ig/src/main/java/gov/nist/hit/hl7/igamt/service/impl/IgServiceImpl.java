package gov.nist.hit.hl7.igamt.service.impl;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.zip.ZipOutputStream;

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

import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGroup;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGroupRegistry;
import gov.nist.hit.hl7.igamt.coconstraints.service.CoConstraintService;
//import gov.nist.hit.hl7.igamt.coconstraints.domain.CoConstraintTable;
import gov.nist.hit.hl7.igamt.common.base.domain.DocumentMetadata;
import gov.nist.hit.hl7.igamt.common.base.domain.Level;
import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.RealKey;
import gov.nist.hit.hl7.igamt.common.base.domain.Registry;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.SharePermission;
import gov.nist.hit.hl7.igamt.common.base.domain.SourceType;
import gov.nist.hit.hl7.igamt.common.base.domain.Status;
import gov.nist.hit.hl7.igamt.common.base.domain.TextSection;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.exception.ValidationException;
import gov.nist.hit.hl7.igamt.common.base.exception.ValuesetNotFoundException;
import gov.nist.hit.hl7.igamt.common.base.model.DocumentSummary;
import gov.nist.hit.hl7.igamt.common.base.service.CommonService;
import gov.nist.hit.hl7.igamt.common.base.util.CloneMode;
import gov.nist.hit.hl7.igamt.common.base.util.RelationShip;
import gov.nist.hit.hl7.igamt.common.base.wrappers.SharedUsersInfo;
import gov.nist.hit.hl7.igamt.common.config.domain.Config;
import gov.nist.hit.hl7.igamt.common.config.service.ConfigService;
//import gov.nist.hit.hl7.igamt.common.config.domain.Config;
//import gov.nist.hit.hl7.igamt.common.config.service.ConfigService;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.CompositeProfileStructure;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.registry.CompositeProfileRegistry;
import gov.nist.hit.hl7.igamt.compositeprofile.service.CompositeProfileStructureService;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.registry.ConformanceProfileRegistry;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatement;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatementsContainer;
import gov.nist.hit.hl7.igamt.constraints.domain.Predicate;
import gov.nist.hit.hl7.igamt.constraints.repository.ConformanceStatementRepository;
import gov.nist.hit.hl7.igamt.constraints.repository.PredicateRepository;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DatatypeLabel;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DatatypeSelectItem;
import gov.nist.hit.hl7.igamt.datatype.domain.registry.DatatypeRegistry;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.display.model.CopyInfo;
import gov.nist.hit.hl7.igamt.ig.controller.wrappers.IGContentMap;
import gov.nist.hit.hl7.igamt.ig.domain.ConformanceProfileLabel;
import gov.nist.hit.hl7.igamt.ig.domain.ConformanceProfileSelectItem;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.domain.IgDocumentConformanceStatement;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.ConformanceProfileDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.DatatypeDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.IgDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.SegmentDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.ValuesetBindingDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.ValuesetDataModel;
import gov.nist.hit.hl7.igamt.ig.exceptions.IGNotFoundException;
import gov.nist.hit.hl7.igamt.ig.exceptions.IGUpdateException;
import gov.nist.hit.hl7.igamt.ig.repository.IgRepository;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.ig.service.XMLSerializeService;
import gov.nist.hit.hl7.igamt.ig.util.SectionTemplate;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponent;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.registry.ProfileComponentRegistry;
import gov.nist.hit.hl7.igamt.profilecomponent.service.ProfileComponentService;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentLabel;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentSelectItem;
import gov.nist.hit.hl7.igamt.segment.domain.registry.SegmentRegistry;
//import gov.nist.hit.hl7.igamt.segment.service.CoConstraintService;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.service.impl.exception.ProfileSerializationException;
import gov.nist.hit.hl7.igamt.service.impl.exception.TableSerializationException;
import gov.nist.hit.hl7.igamt.valueset.domain.Code;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.domain.registry.ValueSetRegistry;
import gov.nist.hit.hl7.igamt.valueset.service.FhirHandlerService;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;
import gov.nist.hit.hl7.igamt.xreference.service.RelationShipService;

@Service("igService")
public class IgServiceImpl implements IgService {

  @Autowired
  IgRepository igRepository;

  @Autowired
  MongoTemplate mongoTemplate;

  @Autowired
  DatatypeService datatypeService;

  @Autowired
  ConfigService configService;

  @Autowired
  SegmentService segmentService;

  @Autowired
  ConformanceProfileService conformanceProfileService;

  @Autowired
  ProfileComponentService profileComponentService;

  @Autowired
  CompositeProfileStructureService compositeProfileServie;

  @Autowired
  ConformanceStatementRepository conformanceStatementRepository;

  @Autowired
  PredicateRepository predicateRepository;

  @Autowired
  ValuesetService valueSetService;

  @Autowired
  RelationShipService relationshipService;

  @Autowired
  XMLSerializeService xmlSerializeService;

  @Autowired
  CoConstraintService coConstraintService;

  @Autowired
  FhirHandlerService fhirHandlerService;
 

  @Autowired
  CommonService commonService;

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
  public List<DocumentSummary> convertListToDisplayList(List<Ig> igdouments) {
    // TODO Auto-generated method stub

    List<DocumentSummary> igs = new ArrayList<DocumentSummary>();
    for (Ig ig : igdouments) {
      DocumentSummary element = new DocumentSummary();

      element.setCoverpage(ig.getMetadata().getCoverPicture());
      element.setDateUpdated(ig.getUpdateDate());
      element.setTitle(ig.getMetadata().getTitle());
      element.setSubtitle(ig.getMetadata().getSubTitle());
      // element.setConfrmanceProfiles(confrmanceProfiles);
      element.setCoverpage(ig.getMetadata().getCoverPicture());
      element.setId(ig.getId());
      element.setDerived(ig.isDerived());
      element.setUsername(ig.getUsername());
      element.setStatus(ig.getStatus());
      element.setSharePermission(ig.getSharePermission());
      element.setSharedUsers(ig.getSharedUsers());
      element.setCurrentAuthor(ig.getCurrentAuthor());
      List<String> conformanceProfileNames = new ArrayList<String>();
      ConformanceProfileRegistry conformanceProfileRegistry = ig.getConformanceProfileRegistry();
      if (conformanceProfileRegistry != null) {
        if (conformanceProfileRegistry.getChildren() != null) {
          for (Link i : conformanceProfileRegistry.getChildren()) {
            ConformanceProfile conformanceProfile =
                conformanceProfileService.findDisplayFormat(i.getId());
            if (conformanceProfile != null) {
              conformanceProfileNames
              .add(conformanceProfile.getName());
            }
          }
        }
      }
      element.setElements(conformanceProfileNames);
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
        .andOperator(Criteria.where("domainInfo.scope").is(scope.toString()), Criteria.where("status").ne(Status.PUBLISHED));
    Query qry = Query.query(where);
    qry.fields().include("domainInfo");
    qry.fields().include("id");
    qry.fields().include("metadata");
    qry.fields().include("username");
    qry.fields().include("conformanceProfileRegistry");
    qry.fields().include("creationDate");
    qry.fields().include("updateDate");
    qry.fields().include("sharedUsers");
    qry.fields().include("currentAuthor");

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
    qry.fields().include("sharedUsers");
    qry.fields().include("currentAuthor");
    List<Ig> igs = mongoTemplate.find(qry, Ig.class);
    return igs;
  }


  @Override
  public List<Ig> findAllPreloadedIG() {
    Criteria where = Criteria.where("status").is(Status.PUBLISHED);
    Query qry = Query.query(where);
    qry.fields().include("domainInfo");
    qry.fields().include("id");
    qry.fields().include("metadata");
    qry.fields().include("username");
    qry.fields().include("conformanceProfileRegistry");
    qry.fields().include("creationDate");
    qry.fields().include("updateDate");
    qry.fields().include("sharedUsers");
    qry.fields().include("currentAuthor");
    List<Ig> igs = mongoTemplate.find(qry, Ig.class);
    return igs;
  }


  @Override
  public List<Ig> findAllSharedIG(String username, Scope scope) {
    Criteria where = Criteria.where("sharedUsers").in(username).andOperator(Criteria.where("domainInfo.scope").is(scope.toString()), Criteria.where("status").ne(Status.PUBLISHED));
    Query qry = Query.query(where);
    qry.fields().include("domainInfo");
    qry.fields().include("id");
    qry.fields().include("metadata");
    qry.fields().include("username");
    qry.fields().include("conformanceProfileRegistry");
    qry.fields().include("creationDate");
    qry.fields().include("updateDate");
    qry.fields().include("sharedUsers");
    qry.fields().include("currentAuthor");

    List<Ig> igs = mongoTemplate.find(qry, Ig.class);
    igs.forEach(ig -> {
      if(ig.getCurrentAuthor() != null && ig.getCurrentAuthor().equals(username)) ig.setSharePermission(SharePermission.WRITE);
      else ig.setSharePermission(SharePermission.READ);    			
    });

    return igs;
  }


  @Override
  public UpdateResult updateAttribute(String id, String attributeName, Object value, Class<?> entityClass) {
    // TODO Auto-generated method stub
    Query query = new Query();
    query.addCriteria(Criteria.where("_id").is(new ObjectId(id)));
    query.fields().include(attributeName);
    Update update = new Update();
    update.set(attributeName, value);
    update.set("updateDate", new Date());
    return mongoTemplate.updateFirst(query, update, entityClass);

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
  public Ig clone(Ig ig, String username, CopyInfo info) {
    Ig newIg = new Ig();
    newIg.setId(new ObjectId().toString());
    newIg.setFrom(ig.getId());
    newIg.setOrigin(ig.getId());
    newIg.setMetadata(ig.getMetadata().clone());
    newIg.setUsername(username);
    newIg.setDomainInfo(ig.getDomainInfo());
    newIg.getDomainInfo().setScope(Scope.USER);
    newIg.setStatus(null);
    HashMap<RealKey, String> newKeys= new HashMap<RealKey, String>();
    newKeys.put(new RealKey(ig.getId(),Type.IGDOCUMENT), newIg.getId());
    addKeys(ig.getConformanceProfileRegistry(), Type.CONFORMANCEPROFILE, newKeys);
    addKeys(ig.getValueSetRegistry(), Type.VALUESET, newKeys);
    addKeys(ig.getDatatypeRegistry(), Type.DATATYPE, newKeys);
    addKeys(ig.getSegmentRegistry(), Type.SEGMENT, newKeys);
    addKeys(ig.getCoConstraintGroupRegistry(), Type.COCONSTRAINTGROUP, newKeys);
    newIg.setValueSetRegistry(copyValueSetRegistry(ig.getValueSetRegistry(), newKeys, username));
    newIg.setDatatypeRegistry(copyDatatypeRegistry(ig.getDatatypeRegistry(), newKeys, username, info.getMode()));
    newIg.setSegmentRegistry(copySegmentRegistry(ig.getSegmentRegistry(),newKeys, username,info.getMode()));
    newIg.setConformanceProfileRegistry(copyConformanceProfileRegistry(ig.getConformanceProfileRegistry(), newKeys, username, info.getMode()));
    newIg.setCoConstraintGroupRegistry(
        copyCoConstraintGRoupRegistry(ig.getCoConstraintGroupRegistry(), newKeys, username, newIg.getId())
        );
    newIg.getDomainInfo().setScope(Scope.USER);
    if(info.getMode().equals(CloneMode.CLONE)) {
      newIg.getMetadata().setTitle(newIg.getMetadata().getTitle() + "[clone]");
      newIg.setContent(ig.getContent());

    }else if(info.getMode().equals(CloneMode.DERIVE)){
      newIg.getMetadata().setTitle(newIg.getMetadata().getTitle() + "[derived]");
      newIg.setDerived(true); 
      if(info.isInherit()) {
        newIg.setContent(ig.getContent());
      }else {
        Set<TextSection> content = new HashSet<TextSection>();
        if(info.getTemplate() !=null && info.getTemplate().getChildren() !=null) {
          for (SectionTemplate template : info.getTemplate().getChildren()) {

            content.add(createSectionContent(template));
          }
          newIg.setContent(content);
        }else {
          newIg.setContent(ig.getContent());

        }
      }

    }
    newIg.setCreationDate(new Date());

    newIg = this.save(newIg);
    return newIg;
  }



  private CoConstraintGroupRegistry copyCoConstraintGRoupRegistry(
      CoConstraintGroupRegistry coConstraintGroupRegistry, HashMap<RealKey, String> newKeys,
      String username, String documentTarget) {
    CoConstraintGroupRegistry newReg = new CoConstraintGroupRegistry();
    HashSet<Link> children = new HashSet<Link>();
    for (Link l : coConstraintGroupRegistry.getChildren()) {
      RealKey key  = new RealKey(l.getId(), Type.COCONSTRAINTGROUP);
      if (!l.isUser()) {
        children.add(l);
      } else {
        children.add(coConstraintService.clone(
            newKeys.get(key),newKeys,l, username, Scope.USER, documentTarget));
      }
    }
    newReg.setChildren(children);
    return newReg;
  }

  private void addKeysForConstraints(Ig newIg, Ig ig, HashMap<RealKey, String> newKeys) {
    Ig[] wrapper = {newIg};
    this.conformanceStatementRepository.findByIgDocumentId(ig.getId()).forEach((cs) -> {
      this.addKeyAndUpdateCS(cs, newKeys, wrapper);
    });

    this.predicateRepository.findByIgDocumentId(ig.getId()).forEach((cp) -> {
      this.addKeyAndUpdateCP(cp, newKeys, wrapper);
    });
  }

  private void addKeyAndUpdateCP(Predicate cp, HashMap<RealKey, String> newKeys, Ig[] wrapper) {
    String oldId = cp.getId();
    cp.setId(null);
    cp.setIgDocumentId(wrapper[0].getId());
    if(cp.getSourceIds() != null) {
      if(cp.getLevel().equals(Level.DATATYPE)) {
        this.updateSourceIdsForCP(cp, Type.DATATYPE, newKeys);
      } else if(cp.getLevel().equals(Level.SEGMENT)) {
        this.updateSourceIdsForCP(cp, Type.SEGMENT, newKeys);
      } else if(cp.getLevel().equals(Level.CONFORMANCEPROFILE)) {
        this.updateSourceIdsForCP(cp, Type.CONFORMANCEPROFILE, newKeys);
      }	    		
    }
    newKeys.put(new RealKey(oldId, Type.PREDICATE), this.predicateRepository.save(cp).getId());
  }


  private void updateSourceIdsForCP(Predicate cp, Type type, HashMap<RealKey, String> newKeys) {
    HashSet<String> newSourceIds = new HashSet<String>();
    cp.getSourceIds().forEach((sourceId) -> {
      String newSourceId = newKeys.get(new RealKey(sourceId, type));
      if(newSourceId != null) newSourceIds.add(newSourceId);
    });
    cp.setSourceIds(newSourceIds);
  }

  private void addKeyAndUpdateCS(ConformanceStatement cs, HashMap<RealKey, String> newKeys, Ig[] wrapper) {
    String oldId = cs.getId();
    cs.setId(null);
    cs.setIgDocumentId(wrapper[0].getId());

    if(cs.getSourceIds() != null) {
      if(cs.getLevel().equals(Level.DATATYPE)) {
        this.updateSourceIdsForCS(cs, Type.DATATYPE, newKeys);
      } else if(cs.getLevel().equals(Level.SEGMENT)) {
        this.updateSourceIdsForCS(cs, Type.SEGMENT, newKeys);
      } else if(cs.getLevel().equals(Level.CONFORMANCEPROFILE)) {
        this.updateSourceIdsForCS(cs, Type.CONFORMANCEPROFILE, newKeys);
      }	    		
    }

    newKeys.put(new RealKey(oldId, Type.CONFORMANCESTATEMENT), this.conformanceStatementRepository.save(cs).getId());
  }

  private void updateSourceIdsForCS(ConformanceStatement cs, Type type, HashMap<RealKey, String> newKeys) {
    HashSet<String> newSourceIds = new HashSet<String>();
    cs.getSourceIds().forEach((sourceId) -> {
      String newSourceId = newKeys.get(new RealKey(sourceId, type));
      if(newSourceId != null) newSourceIds.add(newSourceId);
    });
    cs.setSourceIds(newSourceIds);
  }

  /**
   * @param conformanceProfileRegistry
   * @param valuesetsMap
   * @param datatypesMap
   * @param segmentsMap
   * @param username
   * @param clone 
   * @return
   */

  private ConformanceProfileRegistry copyConformanceProfileRegistry(
      ConformanceProfileRegistry conformanceProfileRegistry,
      HashMap<RealKey, String> newKeys, String username, CloneMode clone) {

    // TODO Auto-generated method stub
    // TODO Auto-generated method stub

    ConformanceProfileRegistry newReg = new ConformanceProfileRegistry();
    HashSet<Link> children = new HashSet<Link>();
    for (Link l : conformanceProfileRegistry.getChildren()) {
      RealKey key  = new RealKey(l.getId(), Type.CONFORMANCEPROFILE);
      if (!l.isUser()) {
        children.add(l);
      } else {
        children.add(conformanceProfileService.cloneConformanceProfile(
            newKeys.get(key),newKeys,l, username, Scope.USER, clone));
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
   * @param clone 
   * @return
   * @throws CoConstraintSaveException
   */
  private SegmentRegistry copySegmentRegistry(SegmentRegistry segmentRegistry,
      HashMap<RealKey, String> newKeys, String username, CloneMode cloneMode) {
    // TODO Auto-generated method stub
    SegmentRegistry newReg = new SegmentRegistry();
    HashSet<Link> children = new HashSet<Link>();
    for (Link l : segmentRegistry.getChildren()) {
      RealKey key = new RealKey(l.getId(), Type.SEGMENT);
      if (!l.isUser()) {
        children.add(l);
      } else {
        children.add(segmentService.cloneSegment(newKeys.get(key),newKeys, l, username,Scope.USER, cloneMode));
      }
    }
    newReg.setChildren(children);
    return newReg;
  }

  private Link updateCoConstraintsGroup(Segment oldSeg, Link cloneSegmentLink, HashMap<String, String> datatypes, HashMap<String, String> valueSets, String username, String oldDocumentId, String newDocumentId) {
    Segment newSeg = this.segmentService.findById(cloneSegmentLink.getId());
    this.coConstraintService.findByBaseSegmentAndDocumentIdAndUsername(oldSeg.getId(), oldDocumentId, username).stream().forEach(group -> {
      CoConstraintGroup newGroup = this.coConstraintService.clone(group.getId(), datatypes, valueSets);
      newGroup.setBaseSegment(cloneSegmentLink.getId());
      newGroup.setDocumentId(newDocumentId);
      newGroup.setId(null);
      this.coConstraintService.saveCoConstraintGroup(newGroup);
    });
    return cloneSegmentLink;
  }

  /**
   * @param datatypeRegistry
   * @param clone 
   * @param valuesetsMap
   * @param datatypesMap
   * @return
   */
  private DatatypeRegistry copyDatatypeRegistry(DatatypeRegistry datatypeRegistry,
      HashMap<RealKey, String> newKeys, String username, CloneMode cloneMode) {
    // TODO Auto-generated method stub
    DatatypeRegistry newReg = new DatatypeRegistry();
    HashSet<Link> children = new HashSet<Link>();
    for (Link l : datatypeRegistry.getChildren()) {
      RealKey key = new RealKey(l.getId(), Type.DATATYPE);

      if (!l.isUser()) {
        children.add(l);
      } else {
        children.add(this.datatypeService.cloneDatatype(newKeys.get(key),newKeys, l, username, Scope.USER, cloneMode));
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
      HashMap<RealKey, String> newKeys, String username) {
    // TODO Auto-generated method stub
    ValueSetRegistry newReg = new ValueSetRegistry();
    newReg.setExportConfig(reg.getExportConfig());
    newReg.setCodesPresence(reg.getCodesPresence());
    HashSet<Link> children = new HashSet<Link>();
    for (Link l : reg.getChildren()) {
      RealKey key = new RealKey(l.getId(), Type.VALUESET);
      if (!l.isUser()) {
        children.add(l);
      } else {
        Link newLink = this.valueSetService.cloneValueSet(newKeys.get(key), l, username, Scope.USER);    	  	
        children.add(newLink);
      }
    }
    newReg.setChildren(children);
    return newReg;
  }

  private void addKeys(Registry reg, Type type, HashMap<RealKey, String> map) {
    if (reg != null && reg.getChildren() != null) {
      for (Link l : reg.getChildren()) {
        if (!l.getDomainInfo().getScope().equals(Scope.HL7STANDARD) && !l.getDomainInfo().getScope().equals(Scope.PHINVADS)) {
          String newId = new ObjectId().toString();
          map.put(new RealKey(l.getId(), type), newId);
        } else {
          map.put(new RealKey(l.getId(), type), l.getId());
        }
      }
    }
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
  @Override
  public Valueset getValueSetInIg(String id, String vsId) throws ValuesetNotFoundException, IGNotFoundException {
    Ig ig = this.findById(id);
    if(ig == null ) {
      throw new IGNotFoundException(id);
    }
    Valueset vs= valueSetService.findById(vsId);

    if(vs == null) {
      throw new ValuesetNotFoundException(vsId);
    }
    if(vs.getBindingIdentifier().equals("HL70396") && vs.getSourceType().equals(SourceType.EXTERNAL)) {
      vs.setCodes(fhirHandlerService.getValusetCodeForDynamicTable());
    }
    if(vs.getDomainInfo() !=null && vs.getDomainInfo().getScope() != null){
      if(vs.getDomainInfo().getScope().equals(Scope.PHINVADS)) {
        Config conf = this.configService.findOne();
        if(conf !=null) {
          vs.setUrl(conf.getPhinvadsUrl()+vs.getOid());
        }
      }
    }
    if(ig.getValueSetRegistry().getCodesPresence() != null ) {
      if (ig.getValueSetRegistry().getCodesPresence().containsKey(vs.getId())) {
        if (ig.getValueSetRegistry().getCodesPresence().get(vs.getId())) {
          vs.setIncludeCodes(true);
        } else {
          vs.setIncludeCodes(false);
          vs.setCodes(new HashSet<Code>());
        }
      }else {
        vs.setIncludeCodes(true);
      }
    }
    return vs;
  }

  /*
   * (non-Javadoc)
   * 
   * @see
   * gov.nist.hit.hl7.igamt.ig.service.IgService#generateDataModel(gov.nist.hit.hl7.igamt.ig.domain.
   * Ig)
   */
  @Override
  public IgDataModel generateDataModel(Ig ig) throws Exception {
    IgDataModel igDataModel = new IgDataModel();
    igDataModel.setModel(ig);

    Set<DatatypeDataModel> datatypes = new HashSet<DatatypeDataModel>();
    Set<SegmentDataModel> segments = new HashSet<SegmentDataModel>();
    Set<ConformanceProfileDataModel> conformanceProfiles =
        new HashSet<ConformanceProfileDataModel>();
    Set<ValuesetDataModel> valuesets = new HashSet<ValuesetDataModel>();
    Map<String, ValuesetBindingDataModel> valuesetBindingDataModelMap =
        new HashMap<String, ValuesetBindingDataModel>();

    for (Link link : ig.getValueSetRegistry().getChildren()) {
      Valueset vs = this.getValueSetInIg(ig.getId(), link.getId());
      if (vs != null) {
        ValuesetDataModel valuesetDataModel = new ValuesetDataModel();
        valuesetDataModel.setModel(vs);
        valuesetBindingDataModelMap.put(vs.getId(), new ValuesetBindingDataModel(vs));
        valuesets.add(valuesetDataModel);
      } else
        throw new Exception("Valueset is missing.");
    }

    for (Link link : ig.getDatatypeRegistry().getChildren()) {
      Datatype d = this.datatypeService.findById(link.getId());
      if (d != null) {
        DatatypeDataModel datatypeDataModel = new DatatypeDataModel();
        datatypeDataModel.putModel(d, this.datatypeService, valuesetBindingDataModelMap,
            this.conformanceStatementRepository, this.predicateRepository);
        datatypes.add(datatypeDataModel);
      }
      else throw new Exception("Datatype is missing.");
    }

    for (Link link : ig.getSegmentRegistry().getChildren()) {
      Segment s = this.segmentService.findById(link.getId());
      if (s != null) {
        SegmentDataModel segmentDataModel = new SegmentDataModel();
        segmentDataModel.putModel(s, this.datatypeService, valuesetBindingDataModelMap, this.conformanceStatementRepository, this.predicateRepository);
        // CoConstraintTable coConstraintTable =
        // this.coConstraintService.getCoConstraintForSegment(s.getId());
        // segmentDataModel.setCoConstraintTable(coConstraintTable);
        segments.add(segmentDataModel);
      } else
        throw new Exception("Segment is missing.");
    }

    for (Link link : ig.getConformanceProfileRegistry().getChildren()) {
      ConformanceProfile cp = this.conformanceProfileService.findById(link.getId());
      if (cp != null) {
        ConformanceProfileDataModel conformanceProfileDataModel = new ConformanceProfileDataModel();
        conformanceProfileDataModel.putModel(cp, valuesetBindingDataModelMap,
            this.conformanceStatementRepository, this.predicateRepository, this.segmentService);
        conformanceProfiles.add(conformanceProfileDataModel);
      } else
        throw new Exception("ConformanceProfile is missing.");
    }

    igDataModel.setDatatypes(datatypes);
    igDataModel.setSegments(segments);
    igDataModel.setConformanceProfiles(conformanceProfiles);
    igDataModel.setValuesets(valuesets);


    return igDataModel;
  }

  @Override
  public InputStream exportValidationXMLByZip(IgDataModel igModel, String[] conformanceProfileIds,
      String[] compositeProfileIds) throws CloneNotSupportedException, IOException,
  ClassNotFoundException, ProfileSerializationException, TableSerializationException {

    this.xmlSerializeService.normalizeIgModel(igModel, conformanceProfileIds);

    ByteArrayOutputStream outputStream = null;
    byte[] bytes;
    outputStream = new ByteArrayOutputStream();
    ZipOutputStream out = new ZipOutputStream(outputStream);

    String profileXMLStr = this.xmlSerializeService.serializeProfileToDoc(igModel).toXML();
    String constraintXMLStr = this.xmlSerializeService.serializeConstraintsXML(igModel).toXML();

    constraintXMLStr = this.addValuesetsFromConstraints(constraintXMLStr, igModel, 0);

    String valueSetXMLStr = this.xmlSerializeService.serializeValueSetXML(igModel).toXML();

    this.xmlSerializeService.generateIS(out, profileXMLStr, "Profile.xml");
    this.xmlSerializeService.generateIS(out, valueSetXMLStr, "ValueSets.xml");
    this.xmlSerializeService.generateIS(out, constraintXMLStr, "Constraints.xml");

    out.close();
    bytes = outputStream.toByteArray();
    return new ByteArrayInputStream(bytes);
  }

  private String addValuesetsFromConstraints(String constraintXMLStr, IgDataModel igModel, int fromIndex) {
    int beginIndex = constraintXMLStr.indexOf("ValueSetID=\"", fromIndex);
    int endIndex = constraintXMLStr.indexOf( "\"" , beginIndex + "ValueSetID=\"".length());
    if(beginIndex < 0 || endIndex < 0 || endIndex < beginIndex) {
    } else {
      String bId = constraintXMLStr.substring(beginIndex + "ValueSetID=\"".length() , endIndex);
      ValuesetDataModel vdm = igModel.findValuesetByBId(bId);

      if(vdm == null) {
        System.out.println("###### MissingValueSet Detected :: " + bId);
        Ig ig = this.findById(igModel.getModel().getId());

        Valueset found = this.findVSFromIGByBid(ig, bId);
        if(found != null) {
          System.out.println("###### MissingValueSet Found :: " + bId);
          ValuesetDataModel valuesetDataModel = new ValuesetDataModel();
          valuesetDataModel.setModel(found);
          igModel.getValuesets().add(valuesetDataModel);
          String defaultHL7Version = this.findDefaultHL7Version(igModel);
          String modifiedBId;
          if (defaultHL7Version != null && found.getDomainInfo() != null && found.getDomainInfo().getVersion() != null && !found.getBindingIdentifier().equals("HL70396")) {
            if (defaultHL7Version
                .equals(found.getDomainInfo().getVersion())) {
              modifiedBId = this.str(found.getBindingIdentifier());
            } else {
              modifiedBId = this.str(found.getBindingIdentifier() + "_" + found.getDomainInfo().getVersion().replaceAll("\\.", "-"));
            }
          } else {
            modifiedBId = this.str(found.getBindingIdentifier());
          }

          return addValuesetsFromConstraints(constraintXMLStr.substring(0, beginIndex) + " ValueSetID=\"" + modifiedBId  + constraintXMLStr.substring(endIndex), igModel, endIndex);
        }
      } else {
        String defaultHL7Version = this.findDefaultHL7Version(igModel);
        String modifiedBId;
        if (defaultHL7Version != null && vdm.getModel().getDomainInfo() != null && vdm.getModel().getDomainInfo().getVersion() != null && !vdm.getModel().getBindingIdentifier().equals("HL70396")) {
          if (defaultHL7Version
              .equals(vdm.getModel().getDomainInfo().getVersion())) {
            modifiedBId = this.str(vdm.getModel().getBindingIdentifier());
          } else {
            modifiedBId = this.str(vdm.getModel().getBindingIdentifier() + "_" + vdm.getModel().getDomainInfo().getVersion().replaceAll("\\.", "-"));
          }
        } else {
          modifiedBId = this.str(vdm.getModel().getBindingIdentifier());
        }

        return addValuesetsFromConstraints(constraintXMLStr.substring(0, beginIndex) + " ValueSetID=\"" + modifiedBId  + constraintXMLStr.substring(endIndex), igModel, endIndex);
      }
    }
    return constraintXMLStr;
  }

  private String str(String value) {
    return value != null ? value : "";
  }

  private String findDefaultHL7Version(IgDataModel igModel) {
    if(igModel.getModel().getMetadata() != null &&
        igModel.getModel().getMetadata().getHl7Versions() != null && 
        igModel.getModel().getMetadata().getHl7Versions().size() > 0) {
      return igModel.getModel().getMetadata().getHl7Versions().get(0);
    }


    if(igModel.getModel().getConformanceProfileRegistry() != null && 
        igModel.getModel().getConformanceProfileRegistry().getChildren()	!= null &&
        igModel.getModel().getConformanceProfileRegistry().getChildren().size() > 0) {
      for(Link l : igModel.getModel().getConformanceProfileRegistry().getChildren()) {
        if(l.getDomainInfo() != null && l.getDomainInfo().getVersion() != null)
          return l.getDomainInfo().getVersion();
      }
    }
    return "NOTFOUND";
  }

  private Valueset findVSFromIGByBid(Ig ig, String bId) {
    for(Link l : ig.getValueSetRegistry().getChildren()) {
      if(l.getId() != null) {
        Valueset vs = this.valueSetService.findById(l.getId());

        if(vs.getBindingIdentifier().equals(bId)) return vs;
      }
    }

    return null;

  }

  @Override
  public Set<RelationShip> findUsage(Set<RelationShip> relations, Type type, String elementId) {
    relations.removeIf(x -> (!x.getChild().getId().equals(elementId) || !x.getChild().getType().equals(type)));
    return relations;
  }	
  @Override
  public Set<RelationShip> buildRelationShip(Ig ig, Type type) {
    // TODO Auto-generated method stub
    Set<RelationShip> ret = new HashSet<RelationShip>();

    switch (type) {
      case DATATYPE:
        addSegmentsRelations(ig, ret);
        addDatatypesRelations(ig, ret);
        addConformanceProfilesRelations(ig, ret);
        addCoConstraintsGroupRelations(ig, ret);
        return ret;

      case SEGMENT:
        addConformanceProfilesRelations(ig, ret);
        addCoConstraintsGroupRelations(ig, ret);
        return ret;

      case VALUESET:
        addConformanceProfilesRelations(ig, ret);
        addSegmentsRelations(ig, ret);
        addDatatypesRelations(ig, ret);
        addCoConstraintsGroupRelations(ig, ret);
        return ret;

      case COCONSTRAINTGROUP:
        addConformanceProfilesRelations(ig, ret);
      default:
        return ret;

    }
  }

  /**
   * @param ig
   * @param ret
   */
  private void addCoConstraintsGroupRelations(Ig ig, Set<RelationShip> ret) {
    // TODO Auto-generated method stub
    List<CoConstraintGroup> groups = coConstraintService
        .findByIdIn(ig.getCoConstraintGroupRegistry().getLinksAsIds());
    for (CoConstraintGroup group : groups) {
      ret.addAll(coConstraintService.collectDependencies(group));
    }
  }

  @Override
  public Set<RelationShip> builAllRelations(Ig ig) {
    // TODO Auto-generated method stub
    Set<RelationShip> ret = new HashSet<RelationShip>();
    addConformanceProfilesRelations(ig, ret);
    addSegmentsRelations(ig, ret);
    addDatatypesRelations(ig, ret);
    addCoConstraintsGroupRelations(ig, ret);
    return ret;
  }

  private void addConformanceProfilesRelations(Ig ig, Set<RelationShip> ret) {
    List<ConformanceProfile> profiles = conformanceProfileService
        .findByIdIn(ig.getConformanceProfileRegistry().getLinksAsIds());
    for (ConformanceProfile profile : profiles) {
      ret.addAll(conformanceProfileService.collectDependencies(profile));
    }
  }

  private void addSegmentsRelations(Ig ig, Set<RelationShip> ret) {
    List<Segment> segments = segmentService.findByIdIn(ig.getSegmentRegistry().getLinksAsIds());
    for (Segment s : segments) {
      ret.addAll(segmentService.collectDependencies(s));
    }

  }

  private void addDatatypesRelations(Ig ig, Set<RelationShip> ret) {
    List<Datatype> datatypes = datatypeService.findByIdIn(ig.getDatatypeRegistry().getLinksAsIds());
    for (Datatype dt : datatypes) {
      ret.addAll(datatypeService.collectDependencies(dt));
    }
  }

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.ig.service.IgService#publishIG()
   */
  @Override
  public void publishIG(Ig ig)  throws IGNotFoundException, IGUpdateException{
    // TODO Auto-generated method stub

    for ( Link l: ig.getConformanceProfileRegistry().getChildren()) {
      if(l.getDomainInfo() !=null && l.getDomainInfo().getScope() !=null && l.getDomainInfo().getScope().equals(Scope.USER)) {
        UpdateResult updateResult = this.updateAttribute(l.getId(), "status", Status.PUBLISHED, ConformanceProfile.class);
        if(! updateResult.wasAcknowledged()) {
          throw new IGUpdateException("Could not publish Conformance profile:" +l.getId());
        }
      }
    }
    for ( Link l: ig.getSegmentRegistry().getChildren()) {
      if(l.getDomainInfo() !=null && l.getDomainInfo().getScope() !=null && l.getDomainInfo().getScope().equals(Scope.USER)) {
        UpdateResult updateResult = this.updateAttribute(l.getId(), "status", Status.PUBLISHED, Segment.class);
        if(! updateResult.wasAcknowledged()) {
          throw new IGUpdateException("Could not publish segment:" +l.getId());
        }
      }
    }

    for ( Link l: ig.getDatatypeRegistry().getChildren()) {
      if(l.getDomainInfo() !=null && l.getDomainInfo().getScope() !=null && l.getDomainInfo().getScope().equals(Scope.USER)) {
        UpdateResult updateResult = this.updateAttribute(l.getId(), "status", Status.PUBLISHED, Datatype.class);
        if(! updateResult.wasAcknowledged()) {
          throw new IGUpdateException("Could not publish Datatype:" +l.getId());
        }
      }
    }
    for ( Link l: ig.getValueSetRegistry().getChildren()) {
      if(l.getDomainInfo() !=null && l.getDomainInfo().getScope() !=null && l.getDomainInfo().getScope().equals(Scope.USER)) {
        UpdateResult updateResult = this.updateAttribute(l.getId(), "status", Status.PUBLISHED, Valueset.class);
        if(! updateResult.wasAcknowledged()) {
          throw new IGUpdateException("Could not publish Value set:" +l.getId());
        }
      }
    }
    
    for ( Link l: ig.getCoConstraintGroupRegistry().getChildren()) {
      if(l.getDomainInfo() !=null && l.getDomainInfo().getScope() !=null && l.getDomainInfo().getScope().equals(Scope.USER)) {
        UpdateResult updateResult = this.updateAttribute(l.getId(), "status", Status.PUBLISHED, Valueset.class);
        if(! updateResult.wasAcknowledged()) {
          throw new IGUpdateException("Could not publish Value set:" +l.getId());
        }
      }
    }

    UpdateResult updateResult = this.updateAttribute(ig.getId(), "status", Status.PUBLISHED, Ig.class);
    if(! updateResult.wasAcknowledged()) {
      throw new IGUpdateException("Could not publish Ig:" +ig.getId());
    }
  }

  @Override
  public Set<ConformanceStatement> conformanceStatementsSummary(Ig igdoument) {
    return this.conformanceStatementRepository.findByIgDocumentId(igdoument.getId());
  }


  @Override
  public void updateSharedUser(String id, SharedUsersInfo sharedUsersInfo) {
    if(id != null && sharedUsersInfo != null) {
      Ig ig = this.findById(id);
      if(ig != null) {
        ig.setCurrentAuthor(sharedUsersInfo.getCurrentAuthor());
        ig.setSharedUsers(sharedUsersInfo.getSharedUsers());
      }
      this.save(ig);
    }
  }

}
