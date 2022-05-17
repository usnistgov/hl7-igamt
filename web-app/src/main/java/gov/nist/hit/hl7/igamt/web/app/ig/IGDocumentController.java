package gov.nist.hit.hl7.igamt.web.app.ig;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.client.result.UpdateResult;
import com.opencsv.CSVReader;

import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGroup;
import gov.nist.hit.hl7.igamt.coconstraints.service.impl.SimpleCoConstraintService;
import gov.nist.hit.hl7.igamt.common.base.controller.BaseController;
import gov.nist.hit.hl7.igamt.common.base.domain.AccessType;
import gov.nist.hit.hl7.igamt.common.base.domain.DocumentInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.DocumentType;
import gov.nist.hit.hl7.igamt.common.base.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.Registry;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.Section;
import gov.nist.hit.hl7.igamt.common.base.domain.SharePermission;
import gov.nist.hit.hl7.igamt.common.base.domain.SourceType;
import gov.nist.hit.hl7.igamt.common.base.domain.TextSection;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;
import gov.nist.hit.hl7.igamt.common.base.exception.ForbiddenOperationException;
import gov.nist.hit.hl7.igamt.common.base.exception.ResourceNotFoundException;
import gov.nist.hit.hl7.igamt.common.base.exception.ValidationException;
import gov.nist.hit.hl7.igamt.common.base.exception.ValuesetNotFoundException;
import gov.nist.hit.hl7.igamt.common.base.model.DocumentSummary;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage.Status;
import gov.nist.hit.hl7.igamt.common.base.service.CommonService;
import gov.nist.hit.hl7.igamt.common.base.service.impl.DataFragment;
import gov.nist.hit.hl7.igamt.common.base.service.impl.InMemoryDomainExtensionServiceImpl;
import gov.nist.hit.hl7.igamt.common.base.util.RelationShip;
import gov.nist.hit.hl7.igamt.common.base.wrappers.AddResourceResponse;
import gov.nist.hit.hl7.igamt.common.base.wrappers.AddingInfo;
import gov.nist.hit.hl7.igamt.common.base.wrappers.AddingWrapper;
import gov.nist.hit.hl7.igamt.common.base.wrappers.CopyWrapper;
import gov.nist.hit.hl7.igamt.common.base.wrappers.CreationWrapper;
import gov.nist.hit.hl7.igamt.common.base.wrappers.SharedUsersInfo;
import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.igamt.common.exception.EntityNotFound;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.CompositeProfileState;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.CompositeProfileStructure;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.ProfileComponentsEvaluationResult;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.ResourceAndDisplay;
import gov.nist.hit.hl7.igamt.compositeprofile.service.CompositeProfileStructureService;
import gov.nist.hit.hl7.igamt.compositeprofile.service.impl.ConformanceProfileCompositeService;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.Group;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.MessageStructure;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRef;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRefOrGroup;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.event.display.MessageEventTreeNode;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.registry.ConformanceProfileRegistry;
import gov.nist.hit.hl7.igamt.conformanceprofile.repository.MessageStructureRepository;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.event.MessageEventService;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatement;
import gov.nist.hit.hl7.igamt.constraints.domain.Predicate;
import gov.nist.hit.hl7.igamt.constraints.repository.PredicateRepository;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Component;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DatatypeLabel;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DatatypeSelectItemGroup;
import gov.nist.hit.hl7.igamt.datatype.domain.registry.DatatypeRegistry;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.display.model.CopyInfo;
import gov.nist.hit.hl7.igamt.display.model.IGDisplayInfo;
import gov.nist.hit.hl7.igamt.display.model.IGMetaDataDisplay;
import gov.nist.hit.hl7.igamt.display.service.DisplayInfoService;
import gov.nist.hit.hl7.igamt.ig.controller.wrappers.CoConstraintGroupCreateWrapper;
import gov.nist.hit.hl7.igamt.ig.controller.wrappers.CompositeProfileCreationWrapper;
import gov.nist.hit.hl7.igamt.ig.controller.wrappers.CreateChildResponse;
import gov.nist.hit.hl7.igamt.ig.controller.wrappers.IGContentMap;
import gov.nist.hit.hl7.igamt.ig.controller.wrappers.ProfileComponentCreateWrapper;
import gov.nist.hit.hl7.igamt.ig.controller.wrappers.ReqId;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.domain.IgDocumentConformanceStatement;
import gov.nist.hit.hl7.igamt.ig.domain.IgTemplate;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.ComponentDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.DatatypeDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.IgDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.ValuesetBindingDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.verification.ComplianceReport;
import gov.nist.hit.hl7.igamt.ig.domain.verification.VerificationReport;
import gov.nist.hit.hl7.igamt.ig.exceptions.AddingException;
import gov.nist.hit.hl7.igamt.ig.exceptions.CloneException;
import gov.nist.hit.hl7.igamt.ig.exceptions.IGConverterException;
import gov.nist.hit.hl7.igamt.ig.exceptions.IGNotFoundException;
import gov.nist.hit.hl7.igamt.ig.exceptions.IGUpdateException;
import gov.nist.hit.hl7.igamt.ig.exceptions.ImportValueSetException;
import gov.nist.hit.hl7.igamt.ig.exceptions.PredicateNotFoundException;
import gov.nist.hit.hl7.igamt.ig.exceptions.SectionNotFoundException;
import gov.nist.hit.hl7.igamt.ig.exceptions.XReferenceFoundException;
import gov.nist.hit.hl7.igamt.ig.model.AddDatatypeResponseObject;
import gov.nist.hit.hl7.igamt.ig.model.AddMessageResponseObject;
import gov.nist.hit.hl7.igamt.ig.model.AddSegmentResponseObject;
import gov.nist.hit.hl7.igamt.ig.model.AddValueSetResponseObject;
import gov.nist.hit.hl7.igamt.ig.model.FilterIGInput;
import gov.nist.hit.hl7.igamt.ig.model.FilterResponse;
import gov.nist.hit.hl7.igamt.ig.model.IGDisplay;
import gov.nist.hit.hl7.igamt.ig.model.TreeNode;
import gov.nist.hit.hl7.igamt.ig.repository.IgTemplateRepository;
import gov.nist.hit.hl7.igamt.ig.service.AddService;
import gov.nist.hit.hl7.igamt.ig.service.CloneService;
import gov.nist.hit.hl7.igamt.ig.service.CrudService;
import gov.nist.hit.hl7.igamt.ig.service.DisplayConverterService;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.ig.service.ResourceManagementService;
import gov.nist.hit.hl7.igamt.ig.service.SharingService;
import gov.nist.hit.hl7.igamt.ig.service.VerificationService;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponent;
import gov.nist.hit.hl7.igamt.profilecomponent.exception.ProfileComponentNotFoundException;
import gov.nist.hit.hl7.igamt.profilecomponent.service.ProfileComponentService;
import gov.nist.hit.hl7.igamt.segment.domain.Field;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentSelectItemGroup;
import gov.nist.hit.hl7.igamt.segment.domain.registry.SegmentRegistry;
import gov.nist.hit.hl7.igamt.segment.exception.SegmentNotFoundException;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.service.impl.XMLSerializeServiceImpl;
import gov.nist.hit.hl7.igamt.valueset.domain.Code;
import gov.nist.hit.hl7.igamt.valueset.domain.CodeUsage;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.domain.property.ContentDefinition;
import gov.nist.hit.hl7.igamt.valueset.domain.property.Extensibility;
import gov.nist.hit.hl7.igamt.valueset.domain.property.Stability;
import gov.nist.hit.hl7.igamt.valueset.domain.registry.ValueSetRegistry;
import gov.nist.hit.hl7.igamt.valueset.service.FhirHandlerService;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;
import gov.nist.hit.hl7.igamt.xreference.exceptions.XReferenceException;
import gov.nist.hit.hl7.igamt.xreference.service.RelationShipService;

@RestController
public class IGDocumentController extends BaseController {

  @Autowired
  IgService igService;

  @Autowired
  RelationShipService relationShipService;

  @Autowired
  DisplayConverterService displayConverter;

  @Autowired
  MessageEventService messageEventService;

  @Autowired
  ConformanceProfileService conformanceProfileService;

  @Autowired
  CrudService crudService;
  
  @Autowired
  AddService addService;

  @Autowired
  DatatypeService datatypeService;

  @Autowired
  SegmentService segmentService;

  @Autowired
  ValuesetService valuesetService;

  @Autowired
  PredicateRepository predicateRepository;

  @Autowired
  MessageStructureRepository  messageStructureRepository;

  @Autowired
  DisplayInfoService displayInfoService;

  @Autowired
  VerificationService verificationService;

  @Autowired
  SimpleCoConstraintService coConstraintService;

  @Autowired
  XMLSerializeServiceImpl serializeService;

  @Autowired
  private FhirHandlerService fhirHandlerService;

  @Autowired
  private IgTemplateRepository igTemplateRepository;

  @Autowired
  SharingService sharingService;

  @Autowired
  CommonService commonService;

  @Autowired
  ProfileComponentService profileComponentService;

  @Autowired
  CompositeProfileStructureService compositeProfileService;
  
  @Autowired
  ConformanceProfileCompositeService compose;
  
  @Autowired
  InMemoryDomainExtensionServiceImpl inMemoryDomainExtensionService;
  
  @Autowired
  ResourceManagementService resourceManagementService;
  
  @Autowired
  CloneService cloneService;

  private String token;


  private static final String DATATYPE_DELETED = "DATATYPE_DELETED";
  private static final String SEGMENT_DELETED = "SEGMENT_DELETED";
  private static final String VALUESET_DELETE = "VALUESET_DELETE";
  private static final String CONFORMANCE_PROFILE_DELETE = "CONFORMANCE_PROFILE_DELETE";
  private static final String CC_GROUP_DELETED = "COCONSTRAINT_GROUP_DELETE";

  private static final String TABLE_OF_CONTENT_UPDATED = "TABLE_OF_CONTENT_UPDATED";
  private static final String METATDATA_UPDATED = "METATDATA_UPDATED";

  public IGDocumentController() {
  }

  @RequestMapping(value = "/api/igdocuments/{id}/datatypeLabels", method = RequestMethod.GET, produces = {
  "application/json" })
  public @ResponseBody Set<DatatypeLabel> getDatatypeLabels(@PathVariable("id") String id,
      Authentication authentication) throws IGNotFoundException {
    Ig igdoument = findIgById(id);
    Set<DatatypeLabel> result = new HashSet<DatatypeLabel>();

    for (Link link : igdoument.getDatatypeRegistry().getChildren()) {
      Datatype dt = this.datatypeService.findById(link.getId());
      if (dt != null) {
        DatatypeLabel label = new DatatypeLabel();
        label.setDomainInfo(dt.getDomainInfo());
        label.setExt(dt.getExt());
        label.setId(dt.getId());
        label.setLabel(dt.getLabel());
        if (dt instanceof ComplexDatatype)
          label.setLeaf(false);
        else
          label.setLeaf(true);
        label.setName(dt.getName());
        result.add(label);
      }
    }
    return result;
  }

  @RequestMapping(value = "/api/igdocuments/{id}/conformancestatement", method = RequestMethod.GET, produces = {
  "application/json" })
  public IgDocumentConformanceStatement getIgDocumentConformanceStatement(@PathVariable("id") String id,
      Authentication authentication) throws IGNotFoundException {
    Ig igdoument = findIgById(id);
    return igService.convertDomainToConformanceStatement(igdoument);
  }

  @RequestMapping(value = "/api/igdocuments/{id}/conformancestatement/summary", method = RequestMethod.GET, produces = {"application/json" })
  public Set<ConformanceStatement> getIgDocumentConformanceStatementSummary(@PathVariable("id") String id, Authentication authentication) throws IGNotFoundException {
    Ig igdoument = findIgById(id);
    return igService.conformanceStatementsSummary(igdoument);
  }

  @RequestMapping(value = "/api/igdocuments/{id}/conformancestatement/assertion", method = RequestMethod.POST, produces = {"application/text" })
  public @ResponseBody String getAssertionCS(@PathVariable("id") String id, @RequestBody ConformanceStatement cs, Authentication authentication) throws IGNotFoundException, IGUpdateException {
    return this.serializeService.generateAssertionScript(cs, id);
  }

  @RequestMapping(value = "/api/igdocuments/{id}/predicate/assertion", method = RequestMethod.POST, produces = {
  "application/text" })
  public @ResponseBody String getAssertionPD(@PathVariable("id") String id, @RequestBody Predicate p, Authentication authentication)
      throws IGNotFoundException, IGUpdateException {
    return this.serializeService.generateConditionScript(p, id);
  }

  @RequestMapping(value = "/api/igdocuments/{id}/{viewScope}/datatypeFalvorOptions/{dtId}", method = RequestMethod.GET, produces = {
  "application/json" })
  public @ResponseBody List<DatatypeSelectItemGroup> getDatatypeFlavorsOptions(@PathVariable("id") String id,
      @PathVariable("viewScope") String viewScope, @PathVariable("dtId") String dtId,
      Authentication authentication) throws IGNotFoundException {
    Ig igdoument = findIgById(id);
    List<DatatypeSelectItemGroup> result = new ArrayList<DatatypeSelectItemGroup>();
    Set<String> ids = this.gatherIds(igdoument.getDatatypeRegistry().getChildren());

    Datatype d = this.datatypeService.findById(dtId);

    result = datatypeService.getDatatypeFlavorsOptions(ids, d, viewScope);
    return result;
  }

  @RequestMapping(value = "/api/igdocuments/{id}/{viewScope}/segmentFalvorOptions/{segId}", method = RequestMethod.GET, produces = {
  "application/json" })
  public @ResponseBody List<SegmentSelectItemGroup> getSegmentFlavorsOptions(@PathVariable("id") String id,
      @PathVariable("viewScope") String viewScope, @PathVariable("segId") String segId,
      Authentication authentication) throws IGNotFoundException {
    Ig igdoument = findIgById(id);
    List<SegmentSelectItemGroup> result = new ArrayList<SegmentSelectItemGroup>();
    Set<String> ids = this.gatherIds(igdoument.getSegmentRegistry().getChildren());

    Segment s = this.segmentService.findById(segId);

    result = segmentService.getSegmentFlavorsOptions(ids, s, viewScope);
    return result;
  }

  @RequestMapping(value = "/api/igdocuments", method = RequestMethod.GET, produces = { "application/json" })
  public @ResponseBody List<DocumentSummary> getUserIG(Authentication authentication,
      @RequestParam("type") AccessType type) throws ForbiddenOperationException {
    String username = authentication.getPrincipal().toString();
    List<Ig> igdouments = new ArrayList<Ig>();

    if (type != null) {
      if (type.equals(AccessType.PUBLIC)) {

        igdouments = igService.findAllPreloadedIG();

      } else if (type.equals(AccessType.PRIVATE)) {

        igdouments = igService.findByUsername(username, Scope.USER);

      } else if (type.equals(AccessType.ALL)) {

        commonService.checkAuthority(authentication, "ADMIN");
        igdouments = igService.findAllUsersIG();

      } else if (type.equals(AccessType.SHARED)) {

        igdouments = igService.findAllSharedIG(username, Scope.USER);

      } else {
        igdouments = igService.findByUsername(username, Scope.USER);

      }
      return igService.convertListToDisplayList(igdouments);
    } else {
      igdouments = igService.findByUsername(username, Scope.USER);
      return igService.convertListToDisplayList(igdouments);
    }
  }

  /**
   * 
   * @param id
   * @param authentication
   * @return
   * @throws IGNotFoundException
   * @throws IGConverterException
   * @throws ResourceNotFoundException
   */
  @RequestMapping(value = "/api/igdocuments/{id}/display", method = RequestMethod.GET, produces = {
  "application/json" })

  public @ResponseBody IGDisplay getIgDisplay(@PathVariable("id") String id, Authentication authentication)
      throws IGNotFoundException, IGConverterException, ResourceNotFoundException {

    Ig igdoument = findIgById(id);

    IGContentMap igData = igService.collectData(igdoument);

    IGDisplay ret = displayConverter.convertDomainToModel(igdoument, igData);

    return ret;
  }

  /**
   *
   * @param id
   * @param authentication
   * @return
   * @throws IGNotFoundException
   * @throws IGConverterException
   */
  @RequestMapping(value = "/api/igdocuments/{id}", method = RequestMethod.GET, produces = { "application/json" })

  public @ResponseBody Ig getIg(@PathVariable("id") String id, Authentication authentication)
      throws IGNotFoundException {
    return findIgById(id);
  }

  /**
   *
   * @param authentication
   * @return
   * @throws IGNotFoundException
   * @throws IGUpdateException
   * @throws ForbiddenOperationException 
   */
  @RequestMapping(value = "/api/igdocuments/{id}/section", method = RequestMethod.POST, produces = {
  "application/json" })

  public @ResponseBody ResponseMessage<Object> updateIg(@PathVariable("id") String id, @RequestBody Section section,
      Authentication authentication) throws IGNotFoundException, IGUpdateException, ForbiddenOperationException {
    Ig ig = findIgById(id);
    commonService.checkRight(authentication, ig.getCurrentAuthor(), ig.getUsername());

    if (!ig.getUsername().equals(authentication.getPrincipal().toString())) {
      return new ResponseMessage<Object>(Status.FAILED, TABLE_OF_CONTENT_UPDATED, ig.getId(), new Date());
    } else {
      Section igSection = this.findSectionById(ig.getContent(), section.getId());
      igSection.setDescription(section.getDescription());
      igSection.setLabel(section.getLabel());
      this.igService.save(ig);
      return new ResponseMessage<Object>(Status.SUCCESS, TABLE_OF_CONTENT_UPDATED, ig.getId(), new Date());
    }
  }





  /**
   * 
   * @param id
   * @param authentication
   * @return
   * @throws IGNotFoundException
   * @throws IGUpdateException
   */
  @RequestMapping(value = "/api/igdocuments/{id}/updatetoc", method = RequestMethod.POST, produces = {
  "application/json" })

  public @ResponseBody ResponseMessage<Object> get(@PathVariable("id") String id, @RequestBody List<TreeNode> toc,
      Authentication authentication) throws IGNotFoundException, IGUpdateException {

    Set<TextSection> content = displayConverter.convertTocToDomain(toc);

    UpdateResult updateResult = igService.updateAttribute(id, "content", content, Ig.class, true);
    if (!updateResult.wasAcknowledged()) {
      throw new IGUpdateException(id);
    }
    return new ResponseMessage<Object>(Status.SUCCESS, TABLE_OF_CONTENT_UPDATED, id, new Date());
  }

  /**
   *
   * @param id
   * @param authentication
   * @return
   * @throws Exception 
   */
  @RequestMapping(value = "/api/igdocuments/{id}/update/sections", method = RequestMethod.POST, produces = {
  "application/json" })

  public @ResponseBody ResponseMessage<Object> updateSections(@PathVariable("id") String id,
      @RequestBody Set<TextSection> content, Authentication authentication)
          throws Exception {
    Ig ig = this.findIgById(id);
    commonService.checkRight(authentication, ig.getCurrentAuthor(), ig.getUsername());
    updateAndClean(content, ig);
    igService.save(ig);
    return new ResponseMessage<Object>(Status.SUCCESS, TABLE_OF_CONTENT_UPDATED, id, new Date());
  }

  private void updateAndClean(Set<TextSection> content, Ig ig) throws Exception {
    TextSection orderdMessages  = findRegistryByType(Type.CONFORMANCEPROFILEREGISTRY, content);
    if(orderdMessages  != null ) {
      updateRegistryPosition(orderdMessages,  ig.getConformanceProfileRegistry());
    }
    TextSection orderedPcs  = findRegistryByType(Type.PROFILECOMPONENTREGISTRY, content);
    if(orderedPcs  != null ) {
      updateRegistryPosition(orderedPcs,  ig.getProfileComponentRegistry());
    }
    TextSection orderdedComposites  = findRegistryByType(Type.COMPOSITEPROFILEREGISTRY, content);
    if(orderdedComposites  != null ) {
      updateRegistryPosition(orderdedComposites,  ig.getCompositeProfileRegistry());
    }
    TextSection profile  = findRegistryByType(Type.PROFILE, content);
    if( profile !=null  && !profile.getChildren().isEmpty()) {
      for(TextSection profileChild : profile.getChildren() ) {
        profileChild.setChildren(new HashSet<TextSection>()); 
      }
    }
    ig.setContent(content);

  }


  private void updateRegistryPosition(TextSection orderedSection,
      Registry registry) {
    if(orderedSection.getChildren() != null) {
      Map<String, Integer> positionMap = new HashMap<String, Integer>();
      positionMap = orderedSection.getChildren().stream().collect(Collectors.toMap(TextSection::getId, TextSection::getPosition));
      if(registry.getChildren() != null) {
        for(Link l : registry.getChildren()) {
          if(positionMap.containsKey(l.getId())) {
            l.setPosition(positionMap.get(l.getId()));
          }
        }
      }
    }
  }

  /**
   * @param conformanceprofileregistry
   * @return
   */
  private TextSection findRegistryByType(Type type, Set<TextSection> content) {
    for(TextSection section: content) {
      if(section.getType().equals(Type.PROFILE)) {
        for(TextSection child : section.getChildren()) {
          if(child.getType().equals(type)) {
            return child;
          }
        }
      }
    }
    return null;
  }


  @RequestMapping(value = "/api/igdocuments/{id}/updatemetadata", method = RequestMethod.POST, produces = {
  "application/json" })
  public @ResponseBody ResponseMessage<Object> get(@PathVariable("id") String id,
      @RequestBody IGMetaDataDisplay metadata, Authentication authentication)
          throws IGNotFoundException, IGUpdateException {
    Ig ig = findIgById(id);
    ig.getMetadata().setTitle(metadata.getTitle());
    ig.getMetadata().setCoverPicture(metadata.getCoverPicture());
    ig.getMetadata().setHl7Versions(metadata.getHl7Versions());
    ig.getMetadata().setOrgName(metadata.getOrganization());
    ig.getMetadata().setSubTitle(metadata.getSubTitle());
    ig.getMetadata().setVersion(metadata.getVersion());
    ig.getMetadata().setHl7Versions(metadata.getHl7Versions());
    ig.setAuthorNotes(metadata.getAuthorNotes());
    ig.setAuthors(metadata.getAuthors());
    this.igService.save(ig);

    return new ResponseMessage<Object>(Status.SUCCESS, METATDATA_UPDATED, id, new Date());
  }

  @RequestMapping(value = "/api/igdocuments/findMessageEvents/{scope}/{version:.+}", method = RequestMethod.GET, produces = {
  "application/json" })
  public @ResponseBody ResponseMessage<List<MessageEventTreeNode>> getMessageEvents(
      @PathVariable("version") String version, @PathVariable Scope scope, Authentication authentication) {
    try {
      List<MessageStructure>  structures = messageEventService.findStructureByScopeAndVersion(version, scope, authentication.getName());
      List<MessageEventTreeNode> list = messageEventService.convertMessageStructureToEventTree(structures);
      return new ResponseMessage<>(Status.SUCCESS, null, null, null, false, null, list);
    } catch (Exception e) {
      throw e;
    }
  }

  /**
   * 
   * @param wrapper
   * @param authentication
   * @return
   * @throws Exception 
   */
  @RequestMapping(value = "/api/igdocuments/create", method = RequestMethod.POST, produces = { "application/json" })
  public @ResponseBody ResponseMessage<String> create(@RequestBody CreationWrapper wrapper,
      Authentication authentication)
          throws Exception {

    try {
      String username = authentication.getPrincipal().toString();
      Ig empty = igService.createEmptyIg();


      empty.setUsername(username);
      DomainInfo info = new DomainInfo();
      info.setScope(Scope.USER);
      empty.setDomainInfo(info);
      empty.setMetadata(wrapper.getMetadata());
      empty.setCreationDate(new Date());
      this.addService.addConformanceProfiles(empty, wrapper.getSelected(), username);
      Ig ret = igService.save(empty);
      return new ResponseMessage<String>(Status.SUCCESS, "", "IG created Successfuly", ret.getId(), false,
          ret.getUpdateDate(), ret.getId());

    } catch (Exception e) {
      throw e;
    }

  }

  /**
   * 
   * @param id
   * @param sectionId
   * @param authentication
   * @return
   * @throws IGNotFoundException
   * @throws SectionNotFoundException
   */
  @RequestMapping(value = "/api/igdocuments/{id}/section/{sectionId}", method = RequestMethod.GET, produces = {
  "application/json" })

  public @ResponseBody TextSection findSectionById(@PathVariable("id") String id,
      @PathVariable("sectionId") String sectionId, Authentication authentication)
          throws IGNotFoundException, SectionNotFoundException {
    Ig ig = igService.findIgContentById(id);
    if (ig != null) {
      TextSection s = igService.findSectionById(ig.getContent(), sectionId);
      if (s == null) {
        throw new SectionNotFoundException("Section Not Foud");
      } else {
        return s;
      }
    } else {
      throw new IGNotFoundException("Cannot found Id document");
    }
  }

  /**
   * 
   * @param id
   * @param elementId
   * @param authentication
   * @return
   * @return
   * @throws IGNotFoundException
   */
  @RequestMapping(value = "/api/igdocuments/{igId}/{type}/{elementId}/usage", method = RequestMethod.GET, produces = {
  "application/json" })
  public @ResponseBody Set<RelationShip> findUsage(@PathVariable("igId") String igId, @PathVariable("type") Type type,
      @PathVariable("elementId") String elementId, Authentication authentication) throws IGNotFoundException {
    Ig ig = findIgById(igId);

    Set<RelationShip> relations = igService.buildRelationShip(ig, type);
    return igService.findUsage(relations, type, elementId);
  }


  @RequestMapping(value = "/api/igdocuments/{id}/datatypes/{datatypeId}/delete", method = RequestMethod.DELETE, produces = {
  "application/json" })
  public ResponseMessage deleteDatatype(@PathVariable("id") String id, @PathVariable("datatypeId") String datatypeId,
      Authentication authentication) throws IGNotFoundException, XReferenceFoundException, XReferenceException, ForbiddenOperationException {
    Ig ig = findIgById(id);
    commonService.checkRight(authentication, ig.getCurrentAuthor(), ig.getUsername());

    Link found = findLinkById(datatypeId, ig.getDatatypeRegistry().getChildren());
    if (found != null) {
      ig.getDatatypeRegistry().getChildren().remove(found);
    }
    Datatype datatype = datatypeService.findById(datatypeId);
    if (datatype != null) {
      if (datatype.getDomainInfo().getScope().equals(Scope.USER)) {
        datatypeService.delete(datatype);
      }
    }
    igService.save(ig);
    return new ResponseMessage(Status.SUCCESS, DATATYPE_DELETED, datatypeId, new Date());
  }

  /**
   * 
   * @param id
   * @param segmentId
   * @param authentication
   * @return
   * @throws IGNotFoundException
   * @throws XReferenceFoundException
   * @throws XReferenceException
   * @throws ForbiddenOperationException 
   */
  @RequestMapping(value = "/api/igdocuments/{id}/segments/{segmentId}/delete", method = RequestMethod.DELETE, produces = {
  "application/json" })
  public ResponseMessage deleteSegment(@PathVariable("id") String id, @PathVariable("segmentId") String segmentId,
      Authentication authentication) throws IGNotFoundException, XReferenceFoundException, XReferenceException, ForbiddenOperationException {
    Ig ig = findIgById(id);
    commonService.checkRight(authentication, ig.getCurrentAuthor(), ig.getUsername());

    Link found = findLinkById(segmentId, ig.getSegmentRegistry().getChildren());
    if (found != null) {
      ig.getSegmentRegistry().getChildren().remove(found);
    }
    Segment segment = segmentService.findById(segmentId);
    if (segment != null) {
      if (segment.getDomainInfo().getScope().equals(Scope.USER)) {
        segmentService.delete(segment);
      }
    }
    ig = igService.save(ig);
    return new ResponseMessage(Status.SUCCESS, SEGMENT_DELETED, segmentId, new Date());
  }

  /**
   * 
   * @param id
   * @param valuesetId
   * @param authentication
   * @return
   * @throws IGNotFoundException
   * @throws XReferenceFoundException
   * @throws XReferenceException
   */
  @RequestMapping(value = "/api/igdocuments/{id}/valuesets/{valuesetId}/delete", method = RequestMethod.DELETE, produces = {
  "application/json" })
  public ResponseMessage deleteValueSet(@PathVariable("id") String id, @PathVariable("valuesetId") String valuesetId,
      Authentication authentication) throws IGNotFoundException, XReferenceFoundException, XReferenceException {

    Ig ig = findIgById(id);
    Link found = findLinkById(valuesetId, ig.getValueSetRegistry().getChildren());
    if (found != null) {
      ig.getValueSetRegistry().getChildren().remove(found);
    }
    Valueset valueSet = valuesetService.findById(valuesetId);
    if (valueSet != null) {
      if (valueSet.getDomainInfo().getScope().equals(Scope.USER)) {
        valuesetService.delete(valueSet);
      }
    }
    ig = igService.save(ig);
    return new ResponseMessage(Status.SUCCESS, VALUESET_DELETE, valuesetId, new Date());
  }

  @RequestMapping(value = "/api/igdocuments/{id}/conformanceprofiles/{conformanceprofileId}/delete", method = RequestMethod.DELETE, produces = {
  "application/json" })
  public ResponseMessage deleteConformanceProfile(@PathVariable("id") String id,
      @PathVariable("conformanceprofileId") String conformanceProfileId, Authentication authentication)
          throws IGNotFoundException, XReferenceFoundException, XReferenceException, ForbiddenOperationException {

    Ig ig = findIgById(id);
    commonService.checkRight(authentication, ig.getCurrentAuthor(), ig.getUsername());

    Link found = findLinkById(conformanceProfileId, ig.getConformanceProfileRegistry().getChildren());
    if (found != null) {
      ig.getConformanceProfileRegistry().getChildren().remove(found);
    }
    ConformanceProfile conformanceProfile = conformanceProfileService.findById(conformanceProfileId);
    if (conformanceProfile != null) {
      if (conformanceProfile.getDomainInfo().getScope().equals(Scope.USER)) {
        conformanceProfileService.delete(conformanceProfile);
      }
    }
    ig = igService.save(ig);
    return new ResponseMessage(Status.SUCCESS, CONFORMANCE_PROFILE_DELETE, conformanceProfileId, new Date());
  }

  @RequestMapping(value = "/api/igdocuments/{id}/profile-component/{pcId}/delete", method = RequestMethod.DELETE, produces = {
  "application/json" })
  public ResponseMessage deletProfileComponent(@PathVariable("id") String id,
      @PathVariable("pcId") String pcId, Authentication authentication)
          throws IGNotFoundException, ForbiddenOperationException {

    Ig ig = findIgById(id);
    commonService.checkRight(authentication, ig.getCurrentAuthor(), ig.getUsername());

    Link found = findLinkById(pcId, ig.getProfileComponentRegistry().getChildren());
    if (found != null) {
      ig.getProfileComponentRegistry().getChildren().remove(found);
    }
    profileComponentService.delete(pcId);
    ig = igService.save(ig);
    return new ResponseMessage(Status.SUCCESS, "Profile Component deleted", pcId, new Date());
  }

  @RequestMapping(value = "/api/igdocuments/{id}/composite-profile/{cpId}/delete", method = RequestMethod.DELETE, produces = {
  "application/json" })
  public ResponseMessage deleteCompoisteProfile(@PathVariable("id") String id,
      @PathVariable("cpId") String cpId, Authentication authentication)
          throws IGNotFoundException, ForbiddenOperationException {

    Ig ig = findIgById(id);
    commonService.checkRight(authentication, ig.getCurrentAuthor(), ig.getUsername());

    Link found = findLinkById(cpId, ig.getCompositeProfileRegistry().getChildren());
    if (found != null) {
      ig.getCompositeProfileRegistry().getChildren().remove(found);
    }
    compositeProfileService.delete(cpId);
    ig = igService.save(ig);
    return new ResponseMessage(Status.SUCCESS, "Composite Profile Deleted", cpId, new Date());
  }

  @RequestMapping(value = "/api/igdocuments/{id}/profile-component/{pcId}/removeContext", method = RequestMethod.POST, produces = {
  "application/json" })
  public DisplayElement deletProfileComponentContext(@PathVariable("id") String id,
      @PathVariable("pcId") String pcId,  @RequestBody String contextId, Authentication authentication)
          throws IGNotFoundException, ForbiddenOperationException, ProfileComponentNotFoundException {

    Ig ig = findIgById(id);
    commonService.checkRight(authentication, ig.getCurrentAuthor(), ig.getUsername());
    ProfileComponent pc = this.profileComponentService.deleteContextById(pcId, contextId );
    Link pcLink = ig.getProfileComponentRegistry().getLinkById(pcId);
    if(pcLink == null) {
      throw new ProfileComponentNotFoundException("Profile Component Link not found ") ;
    }
    profileComponentService.save(pc);
    return this.displayInfoService.convertProfileComponent(pc, pcLink.getPosition());

  }
  @RequestMapping(value = "/api/igdocuments/{id}/conformanceprofiles/{conformanceProfileId}/clone", method = RequestMethod.POST, produces = {"application/json"})
  public ResponseMessage<AddResourceResponse> cloneConformanceProfile(@RequestBody CopyWrapper wrapper,
      @PathVariable("id") String id, @PathVariable("conformanceProfileId") String conformanceProfileId,
      Authentication authentication) throws CloneException, IGNotFoundException, ForbiddenOperationException, EntityNotFound {
    Ig ig = findIgById(id);
    String username = authentication.getName();

    commonService.checkRight(authentication, ig.getCurrentAuthor(), ig.getUsername());
    
    ConformanceProfile clone =  resourceManagementService.createFlavor(ig.getConformanceProfileRegistry(), username, new DocumentInfo(id, DocumentType.IGDOCUMENT), Type.CONFORMANCEPROFILE, wrapper.getSelected());
    ig = igService.save(ig);

    AddResourceResponse response = new AddResourceResponse();
    response.setId(clone.getId());
    response.setReg(ig.getConformanceProfileRegistry());
    response.setDisplay(displayInfoService.convertConformanceProfile(clone,ig.getConformanceProfileRegistry().getChildren().size()+1));

    return new ResponseMessage<AddResourceResponse>(Status.SUCCESS, "", "Conformance profile clone Success",
        clone.getId(), false, clone.getUpdateDate(), response);
  }
  
  @RequestMapping(value = "/api/igdocuments/{id}/composite-profile/{compositeProfileId}/clone", method = RequestMethod.POST, produces = {"application/json"})
  public ResponseMessage<AddResourceResponse> cloneProfileComposite(@RequestBody CopyWrapper wrapper,
      @PathVariable("id") String id, @PathVariable("compositeProfileId") String compositeProfileId,
      Authentication authentication) throws CloneException, IGNotFoundException, ForbiddenOperationException, EntityNotFound {
    Ig ig = findIgById(id);
    commonService.checkRight(authentication, ig.getCurrentAuthor(), ig.getUsername());
    String username = authentication.getName();

    CompositeProfileStructure clone =  resourceManagementService.createFlavor(ig.getCompositeProfileRegistry(), username, new DocumentInfo(id, DocumentType.IGDOCUMENT), Type.COMPOSITEPROFILE, wrapper.getSelected());
    ig = igService.save(ig);

    AddResourceResponse response = new AddResourceResponse();
    response.setId(clone.getId());
    response.setReg(ig.getConformanceProfileRegistry());
    response.setDisplay(displayInfoService.convertCompositeProfile(clone,ig.getConformanceProfileRegistry().getChildren().size()+1));

    return new ResponseMessage<AddResourceResponse>(Status.SUCCESS, "", "Conformance profile clone Success",
        clone.getId(), false, clone.getUpdateDate(), response);
  }


  @RequestMapping(value = "/api/igdocuments/{id}/profile-component/{pcId}/clone", method = RequestMethod.POST, produces = {"application/json"})
  public ResponseMessage<AddResourceResponse> cloneProfileComponent(@RequestBody CopyWrapper wrapper,
      @PathVariable("id") String id, @PathVariable("pcId") String pcId,
      Authentication authentication) throws CloneException, IGNotFoundException, ForbiddenOperationException, EntityNotFound {
    Ig ig = findIgById(id);
    commonService.checkRight(authentication, ig.getCurrentAuthor(), ig.getUsername());
    String username = authentication.getName();
    ProfileComponent clone =  resourceManagementService.createFlavor(ig.getProfileComponentRegistry(), username, new DocumentInfo(id, DocumentType.IGDOCUMENT), Type.PROFILECOMPONENT, wrapper.getSelected());
    clone.setDerived(false);
    ig = igService.save(ig);

    AddResourceResponse response = new AddResourceResponse();
    response.setId(clone.getId());
    response.setReg(ig.getProfileComponentRegistry());
    response.setDisplay(displayInfoService.convertProfileComponent(clone, ig.getProfileComponentRegistry().getChildren().size() + 1));

    return new ResponseMessage<AddResourceResponse>(Status.SUCCESS, "", "Conformance profile clone Success",
        clone.getId(), false, clone.getUpdateDate(), response);
  }




  @RequestMapping(value = "/api/igdocuments/{id}/segments/{segmentId}/clone", method = RequestMethod.POST, produces = {
  "application/json" })
  public ResponseMessage<AddResourceResponse> cloneSegment(@RequestBody CopyWrapper wrapper, @PathVariable("id") String id,
      @PathVariable("segmentId") String segmentId, Authentication authentication)
          throws IGNotFoundException, ValidationException, CloneException, ForbiddenOperationException, EntityNotFound {
    Ig ig = findIgById(id);
    commonService.checkRight(authentication, ig.getCurrentAuthor(), ig.getUsername());

    String username = authentication.getPrincipal().toString();
    Segment clone =  resourceManagementService.createFlavor(ig.getSegmentRegistry(), username, new DocumentInfo(id, DocumentType.IGDOCUMENT), Type.SEGMENT, wrapper.getSelected());
    ig = igService.save(ig);
    
    AddResourceResponse response = new AddResourceResponse();
    response.setId(clone.getId());
    response.setReg(ig.getSegmentRegistry());
    response.setDisplay(displayInfoService.convertSegment(clone));

    return new ResponseMessage<AddResourceResponse>(Status.SUCCESS, "", "Segment profile clone Success", clone.getId(),
        false, clone.getUpdateDate(), response);
  }

  @RequestMapping(value = "/api/igdocuments/{id}/datatypes/{datatypeId}/clone", method = RequestMethod.POST, produces = {
  "application/json" })
  public ResponseMessage<AddResourceResponse> copyDatatype(@RequestBody CopyWrapper wrapper, @PathVariable("id") String id,
      @PathVariable("datatypeId") String datatypeId, Authentication authentication)
          throws IGNotFoundException, CloneException, ForbiddenOperationException, EntityNotFound {
    Ig ig = findIgById(id);
    commonService.checkRight(authentication, ig.getCurrentAuthor(), ig.getUsername());

    String username = authentication.getPrincipal().toString();
    Datatype clone =  resourceManagementService.createFlavor(ig.getDatatypeRegistry(), username, new DocumentInfo(id, DocumentType.IGDOCUMENT), Type.DATATYPE, wrapper.getSelected());
    ig = igService.save(ig);
    AddResourceResponse response = new AddResourceResponse();
    
    response.setId(clone.getId());
    response.setReg(ig.getDatatypeRegistry());
    response.setDisplay(displayInfoService.convertDatatype(clone));
    return new ResponseMessage<AddResourceResponse>(Status.SUCCESS, "", "Datatype clone Success", clone.getId(), false,
        clone.getUpdateDate(), response);
  }

  @RequestMapping(value = "/api/igdocuments/{id}/valuesets/{valuesetId}/clone", method = RequestMethod.POST, produces = {
  "application/json" })

  public ResponseMessage<AddResourceResponse> cloneValueSet(@RequestBody CopyWrapper wrapper, @PathVariable("id") String id,
      @PathVariable("valuesetId") String valuesetId, Authentication authentication)
          throws CloneException, IGNotFoundException, ForbiddenOperationException, EntityNotFound {
    Ig ig = findIgById(id);
    commonService.checkRight(authentication, ig.getCurrentAuthor(), ig.getUsername());
    String username = authentication.getPrincipal().toString();
   
    Valueset clone =  resourceManagementService.createFlavor(ig.getValueSetRegistry(), username, new DocumentInfo(id, DocumentType.IGDOCUMENT), Type.VALUESET, wrapper.getSelected());
    ig = igService.save(ig);
    AddResourceResponse response = new AddResourceResponse();
    response.setId(clone.getId());
    response.setReg(ig.getValueSetRegistry());
    response.setDisplay(displayInfoService.convertValueSet(clone));
    return new ResponseMessage<AddResourceResponse>(Status.SUCCESS, "", "Value Set clone Success", clone.getId(), false,
        clone.getUpdateDate(), response);
  }

  @RequestMapping(value = "/api/igdocuments/{id}/conformanceprofiles/add", method = RequestMethod.POST, produces = {
  "application/json" })
  public ResponseMessage<IGDisplayInfo> addConforanceProfile(@PathVariable("id") String id,
      @RequestBody AddingWrapper wrapper, Authentication authentication)
          throws IGNotFoundException, AddingException, ForbiddenOperationException, EntityNotFound {
    String username = authentication.getPrincipal().toString();
    Ig ig = findIgById(id);
    commonService.checkRight(authentication, ig.getCurrentAuthor(), ig.getUsername());
    AddMessageResponseObject objects = this.addService.addConformanceProfiles(ig, wrapper.getSelected(), username);
    ig = igService.save(ig);
    IGDisplayInfo info = displayInfoService.createReturn(ig, objects);
    

    return new ResponseMessage<IGDisplayInfo>(Status.SUCCESS, "", "Conformance profile Added Succesfully",
        ig.getId(), false, ig.getUpdateDate(), info);
  }

  @RequestMapping(value = "/api/igdocuments/{id}/segments/add", method = RequestMethod.POST, produces = {
  "application/json" })
  public ResponseMessage<IGDisplayInfo> addSegments(@PathVariable("id") String id, @RequestBody AddingWrapper wrapper,
      Authentication authentication) throws IGNotFoundException, ValidationException, AddingException, EntityNotFound {
    String username = authentication.getPrincipal().toString();
    Ig ig = findIgById(id);

    AddMessageResponseObject objects = addService.addSegments(ig, wrapper.getSelected(), username);
    ig = igService.save(ig);
    IGDisplayInfo info = displayInfoService.createReturn(ig, objects);
    
    return new ResponseMessage<IGDisplayInfo>(Status.SUCCESS, "", "segment Added Succesfully", ig.getId(), false,
        ig.getUpdateDate(), info);
  }

  @RequestMapping(value = "/api/igdocuments/{id}/co-constraint-group/create", method = RequestMethod.POST, produces = {
  "application/json" })
  public ResponseMessage<CreateChildResponse> createCoConstraint(
      @PathVariable("id") String id,
      @RequestBody CoConstraintGroupCreateWrapper coConstraintGroupCreateWrapper,
      Authentication authentication) throws IGNotFoundException, SegmentNotFoundException, ForbiddenOperationException {
    String username = authentication.getPrincipal().toString();
    Ig ig = findIgById(id);
    commonService.checkRight(authentication, ig.getCurrentAuthor(), ig.getUsername());

    CoConstraintGroup group = this.coConstraintService.createCoConstraintGroupPrototype(coConstraintGroupCreateWrapper.getBaseSegment());
    group.setUsername(username);
    group.setType(Type.COCONSTRAINTGROUP);
    group.setCreationDate(new Date());
    group.setUpdateDate(new Date());
    group.setName(coConstraintGroupCreateWrapper.getName());
    group.setDocumentId(id);
    group.setDocumentInfo(new DocumentInfo(id, DocumentType.IGDOCUMENT));
    this.coConstraintService.saveCoConstraintGroup(group);
    ig.getCoConstraintGroupRegistry().getChildren().add(this.coConstraintService.createIgLink(group, ig.getCoConstraintGroupRegistry().getChildren().size(), username));

    this.igService.save(ig);

    CreateChildResponse response = new CreateChildResponse(group.getId(), ig.getCoConstraintGroupRegistry(), this.displayInfoService.convertCoConstraintGroup(group));

    return new ResponseMessage<CreateChildResponse>(Status.SUCCESS, "", "CoConstraint Group Created Successfully", ig.getId(), false,
        ig.getUpdateDate(), response);
  }

  @RequestMapping(value = "/api/igdocuments/{id}/co-constraint-group/{ccGroupId}/delete", method = RequestMethod.DELETE, produces = {
  "application/json" })
  public ResponseMessage deleteCoConstraintGroup(
      @PathVariable("id") String id,
      @PathVariable("ccGroupId") String ccGroupId,
      Authentication authentication) throws IGNotFoundException, ForbiddenOperationException {
    Ig ig = findIgById(id);
    commonService.checkRight(authentication, ig.getCurrentAuthor(), ig.getUsername());

    Link found = findLinkById(ccGroupId, ig.getCoConstraintGroupRegistry().getChildren());
    if (found != null) {
      ig.getCoConstraintGroupRegistry().getChildren().remove(found);
    }
    try {
      CoConstraintGroup coConstraintGroup = this.coConstraintService.findById(ccGroupId);
      if (coConstraintGroup != null) {
        if (coConstraintGroup.getDomainInfo().getScope().equals(Scope.USER)) {
          this.coConstraintService.delete(coConstraintGroup);
        }
      }
    } catch (EntityNotFound e) {
      e.printStackTrace();
    }
    igService.save(ig);
    return new ResponseMessage(Status.SUCCESS, CC_GROUP_DELETED, ccGroupId, new Date());
  }




  @RequestMapping(value = "/api/igdocuments/{id}/profile-component/create", method = RequestMethod.POST, produces = {
  "application/json" })
  public ResponseMessage<CreateChildResponse> createProfileComponent(
      @PathVariable("id") String id,
      @RequestBody ProfileComponentCreateWrapper profileComponentCreateWrapper,
      Authentication authentication) throws IGNotFoundException, ForbiddenOperationException {
    String username = authentication.getPrincipal().toString();
    Ig ig = findIgById(id);
    commonService.checkRight(authentication, ig.getCurrentAuthor(), ig.getUsername());

    ProfileComponent pc = this.igService.createProfileComponent(ig, profileComponentCreateWrapper.name , profileComponentCreateWrapper.children);
    CreateChildResponse createChildResponse = new CreateChildResponse(pc.getId(), ig.getProfileComponentRegistry(), this.displayInfoService.convertProfileComponent(pc, ig.getProfileComponentRegistry().getChildren().size() + 1));
    this.igService.save(ig);

    return new ResponseMessage<CreateChildResponse>(Status.SUCCESS, "", "Profile Component Created Successfully", ig.getId(), false,
        ig.getUpdateDate(), createChildResponse);
  }


  @RequestMapping(value = "/api/igdocuments/{id}/composite-profile/create", method = RequestMethod.POST, produces = {
  "application/json" })
  public ResponseMessage<CreateChildResponse> createCompositeProfile(
      @PathVariable("id") String id,
      @RequestBody CompositeProfileCreationWrapper wrapper,
      Authentication authentication) throws IGNotFoundException, ForbiddenOperationException {
    String username = authentication.getPrincipal().toString();
    Ig ig = findIgById(id);
    commonService.checkRight(authentication, ig.getCurrentAuthor(), ig.getUsername());

    CompositeProfileStructure cp = this.igService.createCompositeProfileSercice(ig, wrapper);
    cp.setUsername(username);
    compositeProfileService.save(cp);

    CreateChildResponse createChildResponse = new CreateChildResponse(cp.getId(), ig.getCompositeProfileRegistry(), this.displayInfoService.convertCompositeProfile(cp, ig.getProfileComponentRegistry().getChildren().size()+1));
    this.igService.save(ig);

    return new ResponseMessage<CreateChildResponse>(Status.SUCCESS, "", "Composite Profile Created Successfully", ig.getId(), false,
        ig.getUpdateDate(), createChildResponse);
  }


  @RequestMapping(value = "/api/igdocuments/{id}/profile-component/{pcId}/addChildren", method = RequestMethod.POST, produces = {
  "application/json" })
  public ResponseMessage<CreateChildResponse> updatePcChildren(
      @PathVariable("id") String id,
      @PathVariable("pcId") String pcId,
      @RequestBody List<DisplayElement> children,
      Authentication authentication) throws IGNotFoundException, ForbiddenOperationException, ProfileComponentNotFoundException {
    Ig ig = findIgById(id);
    commonService.checkRight(authentication, ig.getCurrentAuthor(), ig.getUsername());
    Link pcLink = ig.getProfileComponentRegistry().getLinkById(pcId);
    if(pcLink == null) {
      throw new ProfileComponentNotFoundException("Profile Component Link not found ") ;
    }    ProfileComponent pc = this.profileComponentService.addChildrenFromDisplayElement(pcId, children);
    CreateChildResponse createChildResponse = new CreateChildResponse(pc.getId(), ig.getProfileComponentRegistry(), this.displayInfoService.convertProfileComponent(pc, pcLink.getPosition()));
    this.igService.save(ig);
    return new ResponseMessage<CreateChildResponse>(Status.SUCCESS, "", "Profile Component updated Successfully", ig.getId(), false,
        ig.getUpdateDate(), createChildResponse);
  }

  @RequestMapping(value = "/api/igdocuments/{documentId}/coconstraints/group/segment/{id}", method = RequestMethod.GET, produces = {"application/json" })
  public List<DisplayElement> getCoConstraintGroupForSegment(@PathVariable("id") String id,
      @PathVariable("documentId") String documentId,
      Authentication authentication) throws EntityNotFound {
    List<CoConstraintGroup> groups = this.coConstraintService.findByBaseSegmentAndDocumentIdAndUsername(id, documentId, authentication.getName());
    return groups.stream().map(this.displayInfoService::convertCoConstraintGroup).collect(Collectors.toList());
  }

  @RequestMapping(value = "/api/igdocuments/{id}/datatypes/add", method = RequestMethod.POST, produces = {
  "application/json" })
  public ResponseMessage<IGDisplayInfo> addDatatypes(@PathVariable("id") String id,
      @RequestBody AddingWrapper wrapper, Authentication authentication)
          throws IGNotFoundException, AddingException, ForbiddenOperationException, EntityNotFound {
    String username = authentication.getPrincipal().toString();
    Ig ig = findIgById(id);
    commonService.checkRight(authentication, ig.getCurrentAuthor(), ig.getUsername());
    
    AddMessageResponseObject objects = addService.addDatatypes(ig, wrapper.getSelected(), username);
    ig = igService.save(ig);
    IGDisplayInfo info = displayInfoService.createReturn(ig, objects);
    
    return new ResponseMessage<IGDisplayInfo>(Status.SUCCESS, "", "Data type Added Succesfully", ig.getId(), false,
        ig.getUpdateDate(), info);
  }

  @RequestMapping(value = "/api/igdocuments/{id}/valuesets/add", method = RequestMethod.POST, produces = {
  "application/json" })
  public ResponseMessage<IGDisplayInfo> addValueSets(@PathVariable("id") String id,
      @RequestBody AddingWrapper wrapper, Authentication authentication)
          throws IGNotFoundException, AddingException, ForbiddenOperationException, EntityNotFound {
    String username = authentication.getPrincipal().toString();
    Ig ig = findIgById(id);
    commonService.checkRight(authentication, ig.getCurrentAuthor(), ig.getUsername());

    AddValueSetResponseObject objects = crudService.addValueSets(wrapper.getSelected(), ig, username);

    igService.save(ig);
    IGDisplayInfo info = new IGDisplayInfo();
    info.setIg(ig);
    if(objects.getValueSets() != null && !objects.getValueSets().isEmpty()) {
      info.setValueSets(displayInfoService.convertValueSets(objects.getValueSets()));
      Optional<Valueset> vs = objects.getValueSets().stream().findAny();
      if(vs.isPresent()) {
        info.setTargetResourceId(objects.getValueSets().stream().findAny().get().getId());
      }
    }
    return new ResponseMessage<IGDisplayInfo>(Status.SUCCESS, "", "Value Sets Added Succesfully", ig.getId(), false,
        ig.getUpdateDate(), info);
  }

  @RequestMapping(value = "/api/igdocuments/{id}/clone", method = RequestMethod.POST, produces = {
  "application/json" })
  public @ResponseBody ResponseMessage<String> copy(@PathVariable("id") String id, @RequestBody CopyInfo info,  Authentication authentication)
      throws IGNotFoundException, EntityNotFound {
    String username = authentication.getPrincipal().toString();
    Ig ig = findIgById(id);
    Ig clone = cloneService.clone(ig, username, info);
    //Ig clone = this.igService.clone(ig, username, info);
    return new ResponseMessage<String>(Status.SUCCESS, "", "Ig Cloned Successfully", clone.getId(), false,
        clone.getUpdateDate(), clone.getId());
  }

  @RequestMapping(value = "/api/igdocuments/{id}/publish", method = RequestMethod.POST, produces = {
  "application/json" })
  public @ResponseBody ResponseMessage<String> publish(@PathVariable("id") String id, Authentication authentication)
      throws IGNotFoundException, IGUpdateException, ForbiddenOperationException {
    Ig ig = findIgById(id);
    commonService.checkRight(authentication, ig.getCurrentAuthor(), ig.getUsername());
    this.igService.publishIG(ig);
    return new ResponseMessage<String>(Status.SUCCESS, "", "Ig published Successfully", id, false,
        new Date(), id);
  }

  @RequestMapping(value = "/api/igdocuments/{id}/updateSharedUser", method = RequestMethod.POST, produces = {
  "application/json" })
  public @ResponseBody ResponseMessage<String> updateSharedUser(@PathVariable("id") String id, @RequestBody SharedUsersInfo sharedUsersInfo, Authentication authentication)
      throws IGNotFoundException, IGUpdateException, ResourceNotFoundException, ForbiddenOperationException {
    Ig ig = findIgById(id);
    commonService.checkRight(authentication, ig.getUsername(), ig.getUsername());
    this.sharingService.shareIg(id, sharedUsersInfo);
    return new ResponseMessage<String>(Status.SUCCESS, "", "Ig Shared Users Successfully Updated", id, false,
        new Date(), id);
  }

  @RequestMapping(value = "/api/igdocuments/{id}", method = RequestMethod.DELETE, produces = { "application/json" })
  public @ResponseBody ResponseMessage<String> archive(@PathVariable("id") String id, Authentication authentication)
      throws IGNotFoundException, ForbiddenOperationException {

    Ig ig = findIgById(id);
    commonService.checkRight(authentication, ig.getCurrentAuthor(), ig.getUsername());

    igService.delete(ig);
    return new ResponseMessage<String>(Status.SUCCESS, "", "Ig deleted Successfully", ig.getId(), false,
        ig.getUpdateDate(), ig.getId());
  }

  @RequestMapping(value = "/api/igdocuments/{id}/state", method = RequestMethod.GET, produces = {
  "application/json" })
  public @ResponseBody IGDisplayInfo getState(@PathVariable("id") String id, Authentication authentication)
      throws IGNotFoundException, ForbiddenOperationException {

    Ig ig = findIgById(id);
    String cUser = authentication.getPrincipal().toString();
    
    if ( ig.getUsername() == null || ig.getStatus() !=null && ig.getStatus().equals(gov.nist.hit.hl7.igamt.common.base.domain.Status.PUBLISHED)) {
      ig.setSharePermission(SharePermission.READ);  
    } else {
      if(!ig.getUsername().equals(cUser)) {
        if(ig.getCurrentAuthor() != null && ig.getCurrentAuthor().equals(cUser)) {
          ig.setSharePermission(SharePermission.WRITE);
        } else {
          if((ig.getSharedUsers() !=null && ig.getSharedUsers().contains(cUser)) || this.commonService.isAdmin(authentication)) {
            ig.setSharePermission(SharePermission.READ);
          }else {
            throw new ForbiddenOperationException("Access denied");
          }
        }    	
      }
    } 
    return displayInfoService.covertIgToDisplay(ig);
  }
  @RequestMapping(value = "/api/igdocuments/{id}/valueset/{vsId}", method = RequestMethod.GET, produces = {
  "application/json" })
  public @ResponseBody Valueset getValueSetInIG(@PathVariable("id") String id ,@PathVariable("vsId") String vsId, Authentication authentication)
      throws IGNotFoundException, ValuesetNotFoundException {
    return this.igService.getValueSetInIg(id, vsId);	
  }

  @RequestMapping(value = "/api/igdocuments/{id}/valueset/{vsId}/resource", method = RequestMethod.GET, produces = {
  "application/json" })
  public @ResponseBody Set<Valueset> getValueSetInIGAsResource(@PathVariable("id") String id ,@PathVariable("vsId") String vsId, Authentication authentication)
      throws IGNotFoundException, ValuesetNotFoundException {
    HashSet<Valueset> ret = new HashSet<Valueset>();
    Valueset vs = this.igService.getValueSetInIg(id, vsId);
    ret.add(vs);
    return ret;

  }
  
  @RequestMapping(value = "/api/igdocuments/{id}/filter/", method = RequestMethod.POST, produces = {
  "application/json" })
  public @ResponseBody FilterResponse filter(@PathVariable("id") String id , @RequestBody FilterIGInput filter , Authentication authentication)
      throws IGNotFoundException, ValuesetNotFoundException, EntityNotFound {
    
    return this.igService.getFilterResponse( id, filter);
  }

  /**
   * 
   * @param links
   * @return
   */
  private Set<String> gatherIds(Set<Link> links) {
    Set<String> results = new HashSet<String>();
    links.forEach(link -> results.add(link.getId()));
    return results;
  }

  /**
   * 
   * @param id
   * @param links
   * @return
   */
  private Link findLinkById(String id, Set<Link> links) {
    for (Link link : links) {
      if (link.getId().equals(id)) {
        return link;
      }
    }
    return null;
  }

  /**
   * @param content
   * @param sectionId
   * @return
   */
  private TextSection findSectionById(Set<TextSection> content, String sectionId) {
    // TODO Auto-generated method stub
    for (TextSection s : content) {
      TextSection ret = findSectionInside(s, sectionId);
      if (ret != null) {
        return ret;
      }
    }
    return null;

  }

  /**
   * @param s
   * @param sectionId
   * @return
   */
  private TextSection findSectionInside(TextSection s, String sectionId) {
    // TODO Auto-generated method stub
    if (s.getId().equals(sectionId)) {
      return s;
    }
    if (s.getChildren() != null && !s.getChildren().isEmpty()) {
      for (TextSection ss : s.getChildren()) {
        TextSection ret = findSectionInside(ss, sectionId);
        if (ret != null) {
          return ret;
        } 
      }
    }
    return null;
  }

  private Ig findIgById(String id) throws IGNotFoundException {
    Ig ig = igService.findById(id);
    if (ig == null) {
      throw new IGNotFoundException(id);
    }
    return ig;
  }

  @RequestMapping(value = "/api/igdocuments/{id}/valuesets/uploadCSVFile",
      method = RequestMethod.POST)
  public ResponseMessage<AddResourceResponse> addValuesetFromCSV(@PathVariable("id") String id,
      @RequestParam("file") MultipartFile csvFile, Authentication authentication) throws ImportValueSetException, IGNotFoundException, ForbiddenOperationException {
    CSVReader reader = null;
    Ig ig = findIgById(id);
    commonService.checkRight(authentication, ig.getCurrentAuthor(), ig.getUsername());

    if (!csvFile.isEmpty()) {
      try {
        reader = new CSVReader(new FileReader(this.multipartToFile(csvFile, "CSVFile")));
        int index = 0;
        String[] row;

        Valueset newVS = new Valueset();
        DomainInfo domainInfo = new DomainInfo();
        domainInfo.setScope(Scope.USER);
        newVS.setDomainInfo(domainInfo);
        newVS.setSourceType(SourceType.INTERNAL);
        while ((row = reader.readNext()) != null) {

          index = index + 1;

          if (index > 1 && index < 11) {
            if (row.length > 1 && !row[1].isEmpty()) {
              switch (row[0]) {
                case "Mapping Identifier":
                  newVS.setBindingIdentifier(row[1]);
                  break;
                case "Name":
                  newVS.setName(row[1]);
                  break;
                case "Description":
                  newVS.setDescription(row[1]);
                  break;
                case "OID":
                  newVS.setOid(row[1]);
                  break;
                case "Version":
                  newVS.getDomainInfo().setVersion(row[1]);
                  break;
                case "Extensibility":
                  newVS.setExtensibility(Extensibility.valueOf(row[1]));
                  break;
                case "Stability":
                  newVS.setStability(Stability.valueOf(row[1]));
                  break;
                case "Content Definition":
                  newVS.setContentDefinition(ContentDefinition.valueOf(row[1]));
                  break;
                case "Comment":
                  newVS.setComment(row[1]);
              }
            }
          } else if (index > 13) {

            Code code = new Code();
            code.setValue(row[0]);
            code.setDescription(row[1]);
            code.setCodeSystem(row[2]);
            code.setUsage(CodeUsage.valueOf(row[3]));
            code.setComments(row[4]);

            if (code.getCodeSystem() != null && !code.getCodeSystem().isEmpty())
              newVS.getCodeSystems().add(code.getCodeSystem());
            if (code.getValue() != null && !code.getValue().isEmpty()) {
              newVS.getCodes().add(code);
            }
          }
        }

        reader.close();
        newVS.getDomainInfo().setScope(Scope.USER);
        newVS.setUsername(ig.getUsername());
        newVS.setCurrentAuthor(ig.getCurrentAuthor());
        newVS.setSharedUsers(ig.getSharedUsers());
        newVS.setSharePermission(ig.getSharePermission());
        newVS.setDocumentInfo(new DocumentInfo(ig.getId(), DocumentType.IGDOCUMENT));
        newVS = this.valuesetService.save(newVS);
        


        ig.getValueSetRegistry().getChildren()
        .add(new Link(newVS.getId(), newVS.getDomainInfo(), ig.getValueSetRegistry().getChildren().size() + 1));
        ig = igService.save(ig);
        AddResourceResponse response = new AddResourceResponse();
        response.setId(newVS.getId());
        response.setReg(ig.getValueSetRegistry());
        response.setDisplay(displayInfoService.convertValueSet(newVS));
        return new ResponseMessage<AddResourceResponse>(Status.SUCCESS, "", "Value Set clone Success", newVS.getId(), false,
            newVS.getUpdateDate(), response);
      } catch (Exception e) {
        throw new ImportValueSetException(e.getLocalizedMessage());
      }
    }else {
      throw new ImportValueSetException("File is Empty");
    }
  }

  public File multipartToFile(MultipartFile multipart, String fileName)
      throws IllegalStateException, IOException {
    File convFile = new File(System.getProperty("java.io.tmpdir") + "/" + fileName);
    multipart.transferTo(convFile);
    return convFile;
  }

  @RequestMapping(value = "/api/igdocuments/{id}/grand", method = RequestMethod.GET, produces = {"application/json"})
  public @ResponseBody IgDataModel getIgGrandObject(@PathVariable("id") String id, Authentication authentication) throws Exception {
    return this.igService.generateDataModel(findIgById(id));
  }

  private String updateFileName(String str) {
    return str.replaceAll(" ", "-").replaceAll("\\*", "-").replaceAll("\"", "-").replaceAll(":", "-").replaceAll(";", "-").replaceAll("=", "-").replaceAll(",", "-");
  }

  @RequestMapping(value = "/api/export/ig/{id}/xml/validation", method = RequestMethod.POST, produces = { "application/json" }, consumes = "application/x-www-form-urlencoded; charset=UTF-8")
  public void exportXML(@PathVariable("id") String id, Authentication authentication, FormData formData, HttpServletResponse response) throws Exception {
    ObjectMapper mapper = new ObjectMapper();
    mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    ReqId reqIds = mapper.readValue(formData.getJson(), ReqId.class);
    System.out.println(reqIds);
    Ig ig = findIgById(id);
    if (ig != null)  {
      CompositeProfileState cps = null;
      Ig selectedIg = this.makeSelectedIg(ig, reqIds, cps);
      IgDataModel igModel = this.igService.generateDataModel(selectedIg);
      InputStream content = this.igService.exportValidationXMLByZip(igModel, reqIds.getConformanceProfilesId(), reqIds.getCompositeProfilesId());
      response.setContentType("application/zip");
      response.setHeader("Content-disposition", "attachment;filename=" + this.updateFileName(igModel.getModel().getMetadata().getTitle()) + "-" + id + "_" + new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date()) + ".zip");
      FileCopyUtils.copy(content, response.getOutputStream());
      this.inMemoryDomainExtensionService.clear(this.token);
    }
  }

  @RequestMapping(value = "/api/igdocuments/{ig}/predicate/{id}", method = RequestMethod.GET,
      produces = {"application/json"})
  public @ResponseBody
  Predicate getPredicate(@PathVariable("ig") String ig, @PathVariable("id") String id, Authentication authentication) throws IGNotFoundException, PredicateNotFoundException {
    Ig igdocument = findIgById(ig);
    if(igdocument.getUsername().equals(authentication.getName())) {
      return this.predicateRepository.findById(id).orElseThrow(() -> {
        return new PredicateNotFoundException(id);
      });
    } else {
      throw new PredicateNotFoundException(id);
    }
  }

  @RequestMapping(value = "/api/igdocuments/{igid}/verification", method = RequestMethod.GET, produces = {"application/json"})
  public @ResponseBody VerificationReport verificationIGById(@PathVariable("igid") String igid, Authentication authentication) {
    Ig ig = this.igService.findById(igid);
    if (ig != null) {
    	for(Link l : ig.getCompositeProfileRegistry().getChildren()) {
        	
        	if(l != null) {
        		CompositeProfileState cps = this.eval(l.getId());
                Link newLink = new Link(cps.getConformanceProfile().getResource());
                ig.getConformanceProfileRegistry().getChildren().add(newLink);
        	}
        }
        
    	VerificationReport report =  this.verificationService.verifyIg(ig, true);	
        this.inMemoryDomainExtensionService.clear(this.token);
        return report;
    }
    return null;
  }

  @RequestMapping(value = "/api/igdocuments/{igid}/compliance", method = RequestMethod.GET, produces = {"application/json"})
  public @ResponseBody ComplianceReport complianceIGById(@PathVariable("igid") String igid, Authentication authentication) {
    Ig ig = this.igService.findById(igid);
    if (ig != null) return this.verificationService.verifyIgForCompliance(igid);
    return null;
  }

  @RequestMapping(value = "/api/igdocuments/{igid}/preverification", method = RequestMethod.POST, produces = { "application/json" })
  public @ResponseBody VerificationReport preVerification(@PathVariable("igid") String igid, @RequestBody ReqId reqIds, Authentication authentication) throws Exception {	    
    System.out.println(reqIds);  
    Ig ig = this.igService.findById(igid);
    if (ig != null)  {
      CompositeProfileState cps = null;
      Ig selectedIg = this.makeSelectedIg(ig, reqIds, cps);
      VerificationReport report = this.verificationService.verifyIg(selectedIg, false);		  
      this.inMemoryDomainExtensionService.clear(this.token);
      return report;
    }
    return null;
  }

  private Ig makeSelectedIg(Ig ig, ReqId reqIds, CompositeProfileState cps) throws IOException {
    Ig selectedIg = new Ig();
    selectedIg.setId(ig.getId());
    selectedIg.setDomainInfo(ig.getDomainInfo());
    selectedIg.setMetadata(ig.getMetadata());
    selectedIg.setConformanceProfileRegistry(new ConformanceProfileRegistry());
    selectedIg.setSegmentRegistry(new SegmentRegistry());
    selectedIg.setDatatypeRegistry(new DatatypeRegistry());
    selectedIg.setValueSetRegistry(new ValueSetRegistry());

    for(String id : reqIds.getConformanceProfilesId()) {
      Link l = ig.getConformanceProfileRegistry().getLinkById(id);

      if(l != null) {
        selectedIg.getConformanceProfileRegistry().getChildren().add(l);

        this.visitSegmentRefOrGroup(this.conformanceProfileService.findById(l.getId()).getChildren(), selectedIg, ig);
      }
    }
    
    for(String id : reqIds.getCompositeProfilesId()) {
    	Link l = ig.getCompositeProfileRegistry().getLinkById(id);
    	
    	if(l != null) {
    		cps = this.eval(l.getId());
            this.visitSegmentRefOrGroup(cps.getConformanceProfile().getResource().getChildren(), selectedIg, ig);
            Link newLink = new Link(cps.getConformanceProfile().getResource());
            this.inMemoryDomainExtensionService.put(newLink.getId(), cps.getConformanceProfile().getResource());
            selectedIg.getConformanceProfileRegistry().getChildren().add(newLink);
    	}
    }

    return selectedIg;
  }
  
  private CompositeProfileState eval(String id) {
	  ProfileComponentsEvaluationResult<ConformanceProfile> profileComponentsEvaluationResult = compose.create(compositeProfileService.findById(id));
	  DataFragment<ConformanceProfile> df = profileComponentsEvaluationResult.getResources();
	  this.token = this.inMemoryDomainExtensionService.put(df.getContext());
	  Stream<Datatype> datatypes = df.getContext().getResources().stream().filter((r) -> r instanceof Datatype).map((r) -> (Datatype) r);
	  Stream<Segment> segments = df.getContext().getResources().stream().filter((r) -> r instanceof Segment).map((r) -> (Segment) r);
	  CompositeProfileState state = new CompositeProfileState();
	  state.setConformanceProfile(new ResourceAndDisplay<>(this.conformanceProfileService.convertConformanceProfile(df.getPayload(), 0), df.getPayload()));
	  state.setDatatypes(datatypes.map((dt) -> new ResourceAndDisplay<>(this.datatypeService.convertDatatype(dt), dt)).collect(Collectors.toList()));
	  state.setSegments(segments.map((sg) -> new ResourceAndDisplay<>(this.segmentService.convertSegment(sg), sg)).collect(Collectors.toList()));
	  Map<PropertyType, Set<String>> refChanges = profileComponentsEvaluationResult.getChangedReferences();
	  List<Datatype> refDatatype = this.datatypeService.findByIdIn(refChanges.get(PropertyType.DATATYPE));
	  List<Segment> refSegment = this.segmentService.findByIdIn(refChanges.get(PropertyType.SEGMENTREF));
	  state.setReferences(Stream.concat(refDatatype.stream(), refSegment.stream()).collect(Collectors.toList()));
	  return state;
  }

  private void visitSegmentRefOrGroup(Set<SegmentRefOrGroup> srgs, Ig selectedIg, Ig all) {
    srgs.forEach(srg -> {
      if(srg instanceof Group) {
        Group g = (Group)srg;
        if(g.getChildren() != null) this.visitSegmentRefOrGroup(g.getChildren(), selectedIg, all);
      } else if (srg instanceof SegmentRef) {
        SegmentRef sr = (SegmentRef)srg;

        if(sr != null && sr.getId() != null && sr.getRef() != null) {
          Link l = all.getSegmentRegistry().getLinkById(sr.getRef().getId());
          if(l == null) {
        	  Segment s = this.inMemoryDomainExtensionService.findById(sr.getRef().getId(), Segment.class);
        	  if( s != null) l = new Link(s);
          }
          if(l != null) {
            selectedIg.getSegmentRegistry().getChildren().add(l);
            Segment s = this.segmentService.findById(l.getId());
            if(s == null) s = this.inMemoryDomainExtensionService.findById(l.getId(), Segment.class);
            if (s != null && s.getChildren() != null) {
              this.visitSegment(s.getChildren(), selectedIg, all);
              if(s.getBinding() != null && s.getBinding().getChildren() != null) this.collectVS(s.getBinding().getChildren(), selectedIg, all);
            }
            //For Dynamic Mapping
            if (s != null && s.getDynamicMappingInfo() != null && s.getDynamicMappingInfo().getItems() != null) {
              s.getDynamicMappingInfo().getItems().forEach(item -> {
                Link link = all.getDatatypeRegistry().getLinkById(item.getDatatypeId());
                if(link != null) {
                  selectedIg.getDatatypeRegistry().getChildren().add(link);
                  Datatype dt = this.datatypeService.findById(link.getId());
                  if (dt != null && dt instanceof ComplexDatatype) {
                    ComplexDatatype cdt = (ComplexDatatype)dt;
                    if(cdt.getComponents() != null) {
                      this.visitDatatype(cdt.getComponents(), selectedIg, all);
                      if(cdt.getBinding() != null && cdt.getBinding().getChildren() != null) this.collectVS(cdt.getBinding().getChildren(), selectedIg, all);
                    }
                  }

                }           		
              });
            }
          }
        }
      }
    });

  }

  private void collectVS(Set<StructureElementBinding> sebs, Ig selectedIg, Ig all) {
    sebs.forEach(seb -> {
      if(seb.getValuesetBindings() != null) {
        seb.getValuesetBindings().forEach(b -> {
          if(b.getValueSets() != null) {
            b.getValueSets().forEach(id -> {
              Link l = all.getValueSetRegistry().getLinkById(id);
              if(l != null) {
                selectedIg.getValueSetRegistry().getChildren().add(l);
              }
            });
          }
        });
      }
    });

  }

  private void visitSegment(Set<Field> fields, Ig selectedIg, Ig all) {
    fields.forEach(f -> {
      if(f.getRef() != null && f.getRef().getId() != null) {
        Link l = all.getDatatypeRegistry().getLinkById(f.getRef().getId());
        if(l == null) {
        	Datatype dt = this.inMemoryDomainExtensionService.findById(f.getRef().getId(), ComplexDatatype.class);
        	if(dt != null) l = new Link(dt);
        }
        if(l != null) {
          selectedIg.getDatatypeRegistry().getChildren().add(l);
          Datatype dt = this.datatypeService.findById(l.getId());
          if(dt == null) dt = this.inMemoryDomainExtensionService.findById(l.getId(), ComplexDatatype.class);
          if (dt != null && dt instanceof ComplexDatatype) {
            ComplexDatatype cdt = (ComplexDatatype)dt;
            if(cdt.getComponents() != null) {
              this.visitDatatype(cdt.getComponents(), selectedIg, all);
              if(cdt.getBinding() != null && cdt.getBinding().getChildren() != null) this.collectVS(cdt.getBinding().getChildren(), selectedIg, all);
            }
          }
        }
      }
    });

  }

  private void visitDatatype(Set<Component> components, Ig selectedIg, Ig all) {
    components.forEach(c -> {
      if(c.getRef() != null && c.getRef().getId() != null) {
        Link l = all.getDatatypeRegistry().getLinkById(c.getRef().getId());
        if(l == null) {
        	Datatype dt = this.inMemoryDomainExtensionService.findById(c.getRef().getId(), ComplexDatatype.class);
        	if(dt != null) l = new Link(dt);
        }
        if(l != null) {
          selectedIg.getDatatypeRegistry().getChildren().add(l);
          Datatype dt = this.datatypeService.findById(l.getId());
          if(dt == null) dt = this.inMemoryDomainExtensionService.findById(l.getId(), ComplexDatatype.class);
          if (dt != null && dt instanceof ComplexDatatype) {
            ComplexDatatype cdt = (ComplexDatatype)dt;
            if(cdt.getComponents() != null) {
              this.visitDatatype(cdt.getComponents(), selectedIg, all);
              if(cdt.getBinding() != null && cdt.getBinding().getChildren() != null) this.collectVS(cdt.getBinding().getChildren(), selectedIg, all);
            }
          }
        }
      }
    });
  }

  @RequestMapping(value = "/api/igdocuments/igTemplates", method = RequestMethod.GET, produces = { "application/json" })
  public @ResponseBody  List<IgTemplate> igTemplates( Authentication authentication) throws Exception {
    List<IgTemplate> templates = this.igTemplateRepository.findAll();
    return templates;
  }

}
