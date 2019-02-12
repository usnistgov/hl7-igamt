package gov.nist.hit.hl7.igamt.service.impl;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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
import gov.nist.hit.hl7.igamt.common.constraint.domain.ConformanceStatement;
import gov.nist.hit.hl7.igamt.common.constraint.domain.ConformanceStatementsContainer;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.CompositeProfileStructure;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.registry.CompositeProfileRegistry;
import gov.nist.hit.hl7.igamt.compositeprofile.model.CompositeProfile;
import gov.nist.hit.hl7.igamt.compositeprofile.service.CompositeProfileStructureService;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.registry.ConformanceProfileRegistry;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.registry.DatatypeRegistry;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.domain.IgDocumentConformanceStatement;
import gov.nist.hit.hl7.igamt.ig.model.IgSummary;
import gov.nist.hit.hl7.igamt.ig.repository.IgRepository;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.ig.util.SectionTemplate;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponent;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.registry.ProfileComponentRegistry;
import gov.nist.hit.hl7.igamt.profilecomponent.service.ProfileComponentService;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.domain.registry.SegmentRegistry;
import gov.nist.hit.hl7.igamt.segment.serialization.exception.CoConstraintSaveException;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.domain.registry.ValueSetRegistry;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;

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
  ValuesetService valueSetService;

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
  public Ig clone(Ig ig, String username) throws CoConstraintSaveException {
    Ig newIg = new Ig();
    newIg.setId(null);
    newIg.setMetadata(ig.getMetadata().clone());
    newIg.setContent(ig.getContent());
    newIg.setUsername(username);
    newIg.setDomainInfo(ig.getDomainInfo());
    newIg.getDomainInfo().setScope(Scope.USER);

    HashMap<String, String> conformanceProfilesMap = getNewIdsMap(ig.getCompositeProfileRegistry());
    HashMap<String, String> valuesetsMap = getNewIdsMap(ig.getValueSetRegistry());
    HashMap<String, String> datatypesMap = getNewIdsMap(ig.getDatatypeRegistry());
    HashMap<String, String> segmentsMap = getNewIdsMap(ig.getSegmentRegistry());

    newIg.setValueSetRegistry(
        copyValueSetRegistry(ig.getValueSetRegistry(), valuesetsMap, username));
    newIg.setDatatypeRegistry(
        copyDatatypeRegistry(ig.getDatatypeRegistry(), valuesetsMap, datatypesMap, username));
    newIg.setSegmentRegistry(copySegmentRegistry(ig.getSegmentRegistry(), valuesetsMap,
        datatypesMap, segmentsMap, username));
    newIg.setConformanceProfileRegistry(
        copyConformanceProfileRegistry(ig.getConformanceProfileRegistry(), valuesetsMap,
            datatypesMap, segmentsMap, conformanceProfilesMap, username));

    this.save(newIg);
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
            conformanceProfilesMap.get(l.getId()), segmentsMap, valuesetsMap, l, username));
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
      HashMap<String, String> segmentsMap, HashMap<String, String> valuesetsMap,
      HashMap<String, String> datatypesMap, String username) throws CoConstraintSaveException {
    // TODO Auto-generated method stub
    SegmentRegistry newReg = new SegmentRegistry();
    HashSet<Link> children = new HashSet<Link>();
    for (Link l : segmentRegistry.getChildren()) {
      if (!segmentsMap.containsKey(l.getId())) {
        children.add(l);
      } else {
        children.add(segmentService.cloneSegment(segmentsMap.get(l.getId()), datatypesMap,
            valuesetsMap, l, username));
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
        children.add(this.datatypeService.cloneDatatype(datatypesMap, valuesetsMap, l, username));
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
        children.add(this.valueSetService.cloneValueSet(valuesetsMap.get(l.getId()), l, username));
      }
    }
    newReg.setChildren(children);
    return newReg;
  }

  private HashMap<String, String> getNewIdsMap(Registry reg) {

    HashMap<String, String> map = new HashMap<String, String>();
    if (reg != null && reg.getChildren() != null) {
      for (Link l : reg.getChildren()) {
        if (l.getDomainInfo() == null) {
          System.out.println(l.getId());
        }
        if (l.getDomainInfo().getScope().toString().equals(Scope.USER.toString())) {
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
    
    for(Link link : igdoument.getConformanceProfileRegistry().getChildren()){
      ConformanceProfile cp = this.conformanceProfileService.findById(link.getId());
      if(cp.getBinding() != null && cp.getBinding().getConformanceStatements() != null && cp.getBinding().getConformanceStatements().size() > 0){
        associatedMSGConformanceStatementMap.put(cp.getIdentifier(), new ConformanceStatementsContainer(cp.getBinding().getConformanceStatements(), Type.CONFORMANCEPROFILE, link.getId(), cp.getIdentifier()));
      }
      this.conformanceProfileService.convertDomainToContextStructure(cp, associatedSEGConformanceStatementMap, associatedDTConformanceStatementMap);
    }
    
    IgDocumentConformanceStatement igDocumentConformanceStatement = new IgDocumentConformanceStatement();
    igDocumentConformanceStatement.setAssociatedDTConformanceStatementMap(associatedDTConformanceStatementMap);
    igDocumentConformanceStatement.setAssociatedSEGConformanceStatementMap(associatedSEGConformanceStatementMap);
    igDocumentConformanceStatement.setAssociatedMSGConformanceStatementMap(associatedMSGConformanceStatementMap);
    return igDocumentConformanceStatement;
  }



}
