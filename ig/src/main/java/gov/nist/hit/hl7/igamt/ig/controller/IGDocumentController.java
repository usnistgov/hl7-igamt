package gov.nist.hit.hl7.igamt.ig.controller;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.rmi.server.ExportException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import javax.servlet.http.HttpServletResponse;

import org.bson.types.ObjectId;
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

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.client.result.UpdateResult;
import com.opencsv.CSVReader;

import gov.nist.hit.hl7.igamt.common.base.controller.BaseController;
import gov.nist.hit.hl7.igamt.common.base.domain.AccessType;
import gov.nist.hit.hl7.igamt.common.base.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.Section;
import gov.nist.hit.hl7.igamt.common.base.domain.SourceType;
import gov.nist.hit.hl7.igamt.common.base.domain.TextSection;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.exception.ResourceNotFoundException;
import gov.nist.hit.hl7.igamt.common.base.exception.ValidationException;
import gov.nist.hit.hl7.igamt.common.base.exception.ValuesetNotFoundException;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage.Status;
import gov.nist.hit.hl7.igamt.common.base.util.RelationShip;
import gov.nist.hit.hl7.igamt.common.base.wrappers.AddingInfo;
import gov.nist.hit.hl7.igamt.common.base.wrappers.AddingWrapper;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.event.display.MessageEventTreeNode;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.event.MessageEventService;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatement;
import gov.nist.hit.hl7.igamt.constraints.domain.Predicate;
import gov.nist.hit.hl7.igamt.constraints.repository.ConformanceStatementRepository;
import gov.nist.hit.hl7.igamt.constraints.repository.PredicateRepository;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DatatypeLabel;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DatatypeSelectItemGroup;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.display.model.CloneMode;
import gov.nist.hit.hl7.igamt.display.model.CopyInfo;
import gov.nist.hit.hl7.igamt.display.model.IGDisplayInfo;
import gov.nist.hit.hl7.igamt.display.model.IGMetaDataDisplay;
import gov.nist.hit.hl7.igamt.display.model.XMLVerificationReport;
import gov.nist.hit.hl7.igamt.display.service.DisplayInfoService;
import gov.nist.hit.hl7.igamt.ig.controller.wrappers.AddResourceResponse;
import gov.nist.hit.hl7.igamt.ig.controller.wrappers.CopyWrapper;
import gov.nist.hit.hl7.igamt.ig.controller.wrappers.CreationWrapper;
import gov.nist.hit.hl7.igamt.ig.controller.wrappers.IGContentMap;
import gov.nist.hit.hl7.igamt.ig.controller.wrappers.ReqId;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.domain.IgDocumentConformanceStatement;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.IgDataModel;
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
import gov.nist.hit.hl7.igamt.ig.model.IGDisplay;
import gov.nist.hit.hl7.igamt.ig.model.IgSummary;
import gov.nist.hit.hl7.igamt.ig.model.TreeNode;
import gov.nist.hit.hl7.igamt.ig.service.CrudService;
import gov.nist.hit.hl7.igamt.ig.service.DisplayConverterService;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.ig.service.VerificationService;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentSelectItemGroup;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.valueset.domain.Code;
import gov.nist.hit.hl7.igamt.valueset.domain.CodeUsage;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.domain.property.ContentDefinition;
import gov.nist.hit.hl7.igamt.valueset.domain.property.Extensibility;
import gov.nist.hit.hl7.igamt.valueset.domain.property.Stability;
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
  DatatypeService datatypeService;

  @Autowired
  SegmentService segmentService;

  @Autowired
  ValuesetService valuesetService;

  @Autowired
  ConformanceStatementRepository conformanceStatementRepository;

  @Autowired
  PredicateRepository predicateRepository;

  @Autowired
  DisplayInfoService displayInfoService;
  
  @Autowired
  VerificationService verificationService;

  private static final String DATATYPE_DELETED = "DATATYPE_DELETED";
  private static final String SEGMENT_DELETED = "SEGMENT_DELETED";
  private static final String VALUESET_DELETE = "VALUESET_DELETE";
  private static final String CONFORMANCE_PROFILE_DELETE = "CONFORMANCE_PROFILE_DELETE";

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



  /**
   * 
   * @param id
   * @param response
   * @throws ExportException
   */
  //	@RequestMapping(value = "/api/igdocuments/{id}/export/html", method = RequestMethod.GET)
  //	public @ResponseBody void exportIgDocumentToHtml(@PathVariable("id") String id, HttpServletResponse response)
  //			throws ExportException {
  //		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
  //		if (authentication != null) {
  //			String username = authentication.getPrincipal().toString();
  //			ExportedFile exportedFile = igExportService.exportIgDocumentToHtml(username, id);
  //			response.setContentType("text/html");
  //			response.setHeader("Content-disposition", "attachment;filename=" + exportedFile.getFileName());
  //			try {
  //				FileCopyUtils.copy(exportedFile.getContent(), response.getOutputStream());
  //			} catch (IOException e) {
  //				throw new ExportException(e, "Error while sending back exported IG Document with id " + id);
  //			}
  //		} else {
  //			throw new AuthenticationCredentialsNotFoundException("No Authentication ");
  //		}
  //	}

  // @RequestMapping(value = "/api/igdocuments/{id}/export/html", method =
  // RequestMethod.GET)
  // public @ResponseBody void exportIgDocumentToHtml(@PathVariable("id") String
  // id,
  // HttpServletResponse response) throws ExportException {
  // Authentication authentication =
  // SecurityContextHolder.getContext().getAuthentication();
  // if (authentication != null) {
  // String username = authentication.getPrincipal().toString();
  // ExportedFile exportedFile = igExportService.exportIgDocumentToHtml(username,
  // id);
  // File coCons;
  // response.setContentType("text/html");
  // response.setHeader("Content-disposition",
  // "attachment;filename=" + "CoconstraintExcel.xsl");
  // try {
  // coCons = new
  // ClassPathResource("CoconstaintHTMLForConverting.html").getFile();
  // InputStream targetStream = new FileInputStream(coCons);
  // FileCopyUtils.copy(targetStream, response.getOutputStream());
  // } catch (IOException e) {
  // throw new ExportException(e, "Error while sending back exported IG Document
  // with id " + id);
  // }
  // } else {
  // throw new AuthenticationCredentialsNotFoundException("No Authentication ");
  // }
  // }

  //	/**
  //	 * 
  //	 * @param id
  //	 * @param response
  //	 * @param authentication
  //	 * @throws ExportException
  //	 */
  //	@RequestMapping(value = "/api/igdocuments/{id}/export/word", method = RequestMethod.GET)
  //	public @ResponseBody void exportIgDocumentToWord(@PathVariable("id") String id, HttpServletResponse response,
  //			Authentication authentication) throws ExportException {
  //		if (authentication != null) {
  //			String username = authentication.getPrincipal().toString();
  //			ExportedFile exportedFile = igExportService.exportIgDocumentToWord(username, id);
  //			response.setContentType("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
  //			response.setHeader("Content-disposition", "attachment;filename=" + exportedFile.getFileName());
  //			try {
  //				FileCopyUtils.copy(exportedFile.getContent(), response.getOutputStream());
  //			} catch (IOException e) {
  //				throw new ExportException(e, "Error while sending back exported IG Document with id " + id);
  //			}
  //		} else {
  //			throw new AuthenticationCredentialsNotFoundException("No Authentication ");
  //		}
  //	}

  @RequestMapping(value = "/api/igdocuments", method = RequestMethod.GET, produces = { "application/json" })
  public @ResponseBody List<IgSummary> getUserIG(Authentication authentication,
      @RequestParam("type") AccessType type) {
    String username = authentication.getPrincipal().toString();
    List<Ig> igdouments = new ArrayList<Ig>();

    if (type != null) {
      if (type.equals(AccessType.PUBLIC)) {

        igdouments = igService.findAllPreloadedIG();

      } else if (type.equals(AccessType.PRIVATE)) {

        igdouments = igService.findByUsername(username, Scope.USER);

      } else if (type.equals(AccessType.ALL)) {

        igdouments = igService.findAllUsersIG();

      } else if (type.equals(AccessType.SHARED)) {
        // TODO
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

    //		igService.buildDependencies(igData);

    // List<RelationShip> relationShip=relationShipService.findAll();
    // System.out.println(relationShip);
    //
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
   */
  @RequestMapping(value = "/api/igdocuments/{id}/section", method = RequestMethod.POST, produces = {
  "application/json" })

  public @ResponseBody ResponseMessage<Object> updateIg(@PathVariable("id") String id, @RequestBody Section section,
      Authentication authentication) throws IGNotFoundException, IGUpdateException {
    Ig ig = findIgById(id);
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

    UpdateResult updateResult = igService.updateAttribute(id, "content", content, Ig.class);
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
   * @throws IGNotFoundException
   * @throws IGUpdateException
   */
  @RequestMapping(value = "/api/igdocuments/{id}/update/sections", method = RequestMethod.POST, produces = {
  "application/json" })

  public @ResponseBody ResponseMessage<Object> updateSections(@PathVariable("id") String id,
      @RequestBody Set<TextSection> content, Authentication authentication)
          throws IGNotFoundException, IGUpdateException {

    UpdateResult updateResult = igService.updateAttribute(id, "content", content, Ig.class);
    if (!updateResult.wasAcknowledged()) {
      throw new IGUpdateException(id);
    }
    return new ResponseMessage<Object>(Status.SUCCESS, TABLE_OF_CONTENT_UPDATED, id, new Date());
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

  @RequestMapping(value = "/api/igdocuments/findMessageEvents/{version:.+}", method = RequestMethod.GET, produces = {
  "application/json" })

  public @ResponseBody ResponseMessage<List<MessageEventTreeNode>> getMessageEvents(
      @PathVariable("version") String version, Authentication authentication) {
    try {

      List<MessageEventTreeNode> list = messageEventService.findByHl7Version(version);

      return new ResponseMessage<List<MessageEventTreeNode>>(Status.SUCCESS, null, null, null, false, null, list);
    } catch (Exception e) {
      throw e;
    }

  }

  /**
   * 
   * @param wrapper
   * @param authentication
   * @return
   * @throws JsonParseException
   * @throws JsonMappingException
   * @throws FileNotFoundException
   * @throws IOException
   * @throws AddingException
   */
  @RequestMapping(value = "/api/igdocuments/create", method = RequestMethod.POST, produces = { "application/json" })
  public @ResponseBody ResponseMessage<String> create(@RequestBody CreationWrapper wrapper,
      Authentication authentication)
          throws JsonParseException, JsonMappingException, FileNotFoundException, IOException, AddingException {

    try {
      String username = authentication.getPrincipal().toString();
      Ig empty = igService.createEmptyIg();
      Set<String> savedIds = new HashSet<String>();
      for (AddingInfo ev : wrapper.getMsgEvts()) {
        ConformanceProfile profile = conformanceProfileService.findById(ev.getOriginalId());
        if (profile != null) {
          ConformanceProfile clone = profile.clone();
          clone.setUsername(username);
          clone.setDescription(ev.getDescription());
          clone.getDomainInfo().setScope(Scope.USER);
          clone.setEvent(ev.getName());
          clone.setName(ev.getExt());
          // clone.setIdentifier(ev.getExt());
          clone = conformanceProfileService.save(clone);
          savedIds.add(clone.getId());
        }
      }
      empty.setUsername(username);
      DomainInfo info = new DomainInfo();
      info.setScope(Scope.USER);
      empty.setDomainInfo(info);
      empty.setMetadata(wrapper.getMetadata());
      empty.setCreationDate(new Date());
      crudService.AddConformanceProfilesToEmptyIg(savedIds, empty);
      Ig ret = igService.save(empty);
      return new ResponseMessage<String>(Status.SUCCESS, "", "IG created Successfuly", ret.getId(), false,
          ret.getUpdateDate(), ret.getId());

    } catch (Exception e) {
      throw e;
    }

  }

  public IgService getIgService() {
    return igService;
  }

  public void setIgService(IgService igService) {
    this.igService = igService;
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
   * @param datatypeId
   * @param authentication
   * @return
   * @return
   * @throws IGNotFoundException
   * @throws XReferenceException
   */
  @RequestMapping(value = "/api/igdocuments/{id}/datatypes/{datatypeId}/crossref", method = RequestMethod.GET, produces = {
  "application/json" })
  public @ResponseBody List<RelationShip> findDatatypeCrossRef(@PathVariable("id") String id,
      @PathVariable("datatypeId") String datatypeId, Authentication authentication)
          throws IGNotFoundException, XReferenceException {

    return this.relationShipService.findCrossReferences(datatypeId);

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

  private Set<RelationShip> findUsage(Set<RelationShip> relations, Type type, String elementId) {
    // TODO Auto-generated method stub
    relations.removeIf(x -> (!x.getChild().getId().equals(elementId) || !x.getChild().getType().equals(type)));
    return relations;
  }

  private Set<RelationShip> buildRelationShip(Ig ig, Type type) {
    // TODO Auto-generated method stub
    Set<RelationShip> ret = new HashSet<RelationShip>();

    switch (type) {
      case DATATYPE:

        addSegmentsRelations(ig, ret);
        addDatatypesRelations(ig, ret);
        return ret;

      case SEGMENT:

        addConformanceProfilesRelations(ig, ret);
        return ret;

      case VALUESET:
        addConformanceProfilesRelations(ig, ret);
        addSegmentsRelations(ig, ret);
        addDatatypesRelations(ig, ret);
        return ret;

      default:
        return ret;

    }
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

  @RequestMapping(value = "/api/igdocuments/{id}/datatypes/{datatypeId}/delete", method = RequestMethod.DELETE, produces = {
  "application/json" })
  public ResponseMessage deleteDatatype(@PathVariable("id") String id, @PathVariable("datatypeId") String datatypeId,
      Authentication authentication) throws IGNotFoundException, XReferenceFoundException, XReferenceException {
    // Map<String, List<CrossRefsNode>> xreferences = findDatatypeCrossRef(id,
    // datatypeId, authentication);
    // if (xreferences != null && !xreferences.isEmpty()) {
    // throw new XReferenceFoundException(datatypeId, xreferences);
    // }
    Ig ig = findIgById(id);
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
   */
  @RequestMapping(value = "/api/igdocuments/{id}/segments/{segmentId}/delete", method = RequestMethod.DELETE, produces = {
  "application/json" })
  public ResponseMessage deleteSegment(@PathVariable("id") String id, @PathVariable("segmentId") String segmentId,
      Authentication authentication) throws IGNotFoundException, XReferenceFoundException, XReferenceException {
    // Map<String, List<CrossRefsNode>> xreferences = findSegmentCrossRef(id,
    // segmentId, authentication);
    // if (xreferences != null && !xreferences.isEmpty()) {
    // throw new XReferenceFoundException(segmentId, xreferences);
    // }
    Ig ig = findIgById(id);
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
    // Map<String, List<CrossRefsNode>> xreferences = findValueSetCrossRef(id,
    // valuesetId, authentication);
    // if (xreferences != null && !xreferences.isEmpty()) {
    // throw new XReferenceFoundException(valuesetId, xreferences);
    // }

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

  /**
   * 
   * @param id
   * @param conformanceProfileId
   * @param authentication
   * @return
   * @throws IGNotFoundException
   * @throws XReferenceFoundException
   * @throws XReferenceException
   */
  @RequestMapping(value = "/api/igdocuments/{id}/conformanceprofiles/{conformanceprofileId}/delete", method = RequestMethod.DELETE, produces = {
  "application/json" })
  public ResponseMessage deleteConformanceProfile(@PathVariable("id") String id,
      @PathVariable("conformanceprofileId") String conformanceProfileId, Authentication authentication)
          throws IGNotFoundException, XReferenceFoundException, XReferenceException {

    Ig ig = findIgById(id);
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

  @RequestMapping(value = "/api/igdocuments/{id}/conformanceprofiles/{conformanceProfileId}/clone", method = RequestMethod.POST, produces = {
  "application/json" })
  public ResponseMessage<AddResourceResponse> cloneConformanceProfile(@RequestBody CopyWrapper wrapper,
      @PathVariable("id") String id, @PathVariable("conformanceProfileId") String conformanceProfileId,
      Authentication authentication) throws CloneException, IGNotFoundException {
    Ig ig = findIgById(id);
    String username = authentication.getName();
    ConformanceProfile profile = conformanceProfileService.findById(wrapper.getSelected().getOriginalId());
    if (profile == null) {
      throw new CloneException("Failed to build conformance profile tree structure");
    }
    ConformanceProfile clone = profile.clone();
    clone.setUsername(username);
    clone.setName(wrapper.getSelected().getExt());
    clone.getDomainInfo().setScope(Scope.USER);
    clone = conformanceProfileService.save(clone);

    if (clone.getBinding() != null && clone.getBinding().getConformanceStatementIds() != null) {
      for (String csId : clone.getBinding().getConformanceStatementIds()) {
        Optional<ConformanceStatement> container = this.conformanceStatementRepository.findById(csId);
        if (container.isPresent()) {
          container.get().addSourceId(clone.getId());
          this.conformanceStatementRepository.save(container.get());
        }
      }
    }
    ig.getConformanceProfileRegistry().getChildren().add(new Link(clone.getId(), clone.getDomainInfo(),
        ig.getConformanceProfileRegistry().getChildren().size() + 1));
    ig = igService.save(ig);

    AddResourceResponse response = new AddResourceResponse();
    response.setId(clone.getId());
    response.setReg(ig.getConformanceProfileRegistry());
    response.setDisplay(displayInfoService.convertConformanceProfile(clone));

    return new ResponseMessage<AddResourceResponse>(Status.SUCCESS, "", "Conformance profile clone Success",
        clone.getId(), false, clone.getUpdateDate(), response);
  }

  @RequestMapping(value = "/api/igdocuments/{id}/segments/{segmentId}/clone", method = RequestMethod.POST, produces = {
  "application/json" })
  public ResponseMessage<AddResourceResponse> cloneSegment(@RequestBody CopyWrapper wrapper, @PathVariable("id") String id,
      @PathVariable("segmentId") String segmentId, Authentication authentication)
          throws IGNotFoundException, ValidationException, CloneException {
    Ig ig = findIgById(id);
    String username = authentication.getPrincipal().toString();
    Segment segment = segmentService.findById(segmentId);
    if (segment == null) {
      throw new CloneException("Cannot find segment with id=" + segmentId);
    }
    Segment clone = segment.clone();
    clone.setUsername(username);
    clone.setName(segment.getName());
    clone.setExt(wrapper.getSelected().getExt());
    clone.getDomainInfo().setScope(Scope.USER);

    clone = segmentService.save(clone);

    if (clone.getBinding() != null && clone.getBinding().getConformanceStatementIds() != null) {
      for (String csId : clone.getBinding().getConformanceStatementIds()) {
        Optional<ConformanceStatement> container = this.conformanceStatementRepository.findById(csId);
        if (container.isPresent()) {
          container.get().addSourceId(clone.getId());
          this.conformanceStatementRepository.save(container.get());
        }
      }
    }
    ig.getSegmentRegistry().getChildren()
    .add(new Link(clone.getId(), clone.getDomainInfo(), ig.getSegmentRegistry().getChildren().size() + 1));
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
          throws IGNotFoundException, CloneException {
    Ig ig = findIgById(id);
    String username = authentication.getPrincipal().toString();
    Datatype datatype = datatypeService.findById(datatypeId);
    if (datatype == null) {
      throw new CloneException("Cannot find datatype with id=" + datatypeId);
    }
    Datatype clone = datatype.clone();
    clone.setUsername(username);
    clone.setId(new ObjectId().toString());
    clone.setExt(wrapper.getSelected().getExt());
    clone.getDomainInfo().setScope(Scope.USER);

    clone = datatypeService.save(clone);

    if (clone.getBinding() != null && clone.getBinding().getConformanceStatementIds() != null) {
      for (String csId : clone.getBinding().getConformanceStatementIds()) {
        Optional<ConformanceStatement> container = this.conformanceStatementRepository.findById(csId);
        if (container.isPresent()) {
          container.get().addSourceId(clone.getId());
          this.conformanceStatementRepository.save(container.get());
        }
      }
    }
    ig.getDatatypeRegistry().getChildren()
    .add(new Link(clone.getId(), clone.getDomainInfo(), ig.getDatatypeRegistry().getChildren().size() + 1));
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
          throws CloneException, IGNotFoundException {
    Ig ig = findIgById(id);
    String username = authentication.getPrincipal().toString();
    Valueset valueset = valuesetService.findById(valuesetId);
    if (valueset == null) {
      throw new CloneException("Cannot find valueset with id=" + valuesetId);
    }
    Valueset clone = valueset.clone();
    clone.getDomainInfo().setScope(Scope.USER);

    clone.setUsername(username);
    clone.setBindingIdentifier(wrapper.getSelected().getExt());
    clone.getDomainInfo().setScope(Scope.USER);
    clone = valuesetService.save(clone);
    ig.getValueSetRegistry().getChildren()
    .add(new Link(clone.getId(), clone.getDomainInfo(), ig.getValueSetRegistry().getChildren().size() + 1));
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
          throws IGNotFoundException, AddingException {
    String username = authentication.getPrincipal().toString();
    Ig ig = findIgById(id);
    Set<String> savedIds = new HashSet<String>();
    for (AddingInfo ev : wrapper.getSelected()) {
      ConformanceProfile profile = conformanceProfileService.findById(ev.getOriginalId());
      if (profile != null) {
        ConformanceProfile clone = profile.clone();
        clone.setUsername(username);
        clone.getDomainInfo().setScope(Scope.USER);
        clone.setDescription(ev.getDescription());
        clone.setEvent(ev.getName());
        clone.setIdentifier(ev.getExt());
        clone.setName(ev.getExt());
        clone = conformanceProfileService.save(clone);
        savedIds.add(clone.getId());
      }
    }
    AddMessageResponseObject objects = crudService.addConformanceProfiles(savedIds, ig);
    ig = igService.save(ig);
    IGDisplayInfo info = new IGDisplayInfo();
    info.setIg(ig);
    info.setMessages(displayInfoService.convertConformanceProfiles(objects.getConformanceProfiles()));
    info.setSegments(displayInfoService.convertSegments(objects.getSegments()));
    info.setDatatypes(displayInfoService.convertDatatypes(objects.getDatatypes()));
    info.setValueSets(displayInfoService.convertValueSets(objects.getValueSets()));

    return new ResponseMessage<IGDisplayInfo>(Status.SUCCESS, "", "Conformance profile Added Succesfully",
        ig.getId(), false, ig.getUpdateDate(), info);

  }

  @RequestMapping(value = "/api/igdocuments/{id}/segments/add", method = RequestMethod.POST, produces = {
  "application/json" })
  public ResponseMessage<IGDisplayInfo> addSegments(@PathVariable("id") String id, @RequestBody AddingWrapper wrapper,
      Authentication authentication) throws IGNotFoundException, ValidationException, AddingException {
    String username = authentication.getPrincipal().toString();
    Ig ig = findIgById(id);
    Set<String> savedIds = new HashSet<String>();
    for (AddingInfo elm : wrapper.getSelected()) {
      if (elm.isFlavor()) {
        Segment segment = segmentService.findById(elm.getOriginalId());
        if (segment != null) {
          Segment clone = segment.clone();
          clone.getDomainInfo().setScope(Scope.USER);

          clone.setUsername(username);
          clone.setName(segment.getName());
          clone.setExt(elm.getExt());
          clone = segmentService.save(clone);
          savedIds.add(clone.getId());
        }
      } else {
        savedIds.add(elm.getId());
      }
    }
    AddSegmentResponseObject objects = crudService.addSegments(savedIds, ig);
    ig = igService.save(ig);
    IGDisplayInfo info = new IGDisplayInfo();
    info.setIg(ig);
    info.setSegments(displayInfoService.convertSegments(objects.getSegments()));
    info.setDatatypes(displayInfoService.convertDatatypes(objects.getDatatypes()));
    info.setValueSets(displayInfoService.convertValueSets(objects.getValueSets()));

    return new ResponseMessage<IGDisplayInfo>(Status.SUCCESS, "", "segment Added Succesfully", ig.getId(), false,
        ig.getUpdateDate(), info);
  }

  @RequestMapping(value = "/api/igdocuments/{id}/datatypes/add", method = RequestMethod.POST, produces = {
  "application/json" })
  public ResponseMessage<IGDisplayInfo> addDatatypes(@PathVariable("id") String id,
      @RequestBody AddingWrapper wrapper, Authentication authentication)
          throws IGNotFoundException, AddingException {
    String username = authentication.getPrincipal().toString();
    Ig ig = findIgById(id);
    Set<String> savedIds = new HashSet<String>();
    for (AddingInfo elm : wrapper.getSelected()) {
      if (elm.isFlavor()) {
        Datatype datatype = datatypeService.findById(elm.getOriginalId());
        if (datatype != null) {
          Datatype clone = datatype.clone();
          clone.getDomainInfo().setScope(Scope.USER);

          clone.setUsername(username);
          clone.setName(datatype.getName());
          clone.setExt(elm.getExt());
          clone = datatypeService.save(clone);

          savedIds.add(clone.getId());
        }
      } else {
        savedIds.add(elm.getId());
      }
    }
    AddDatatypeResponseObject objects = crudService.addDatatypes(savedIds, ig);
    ig = igService.save(ig);
    IGDisplayInfo info = new IGDisplayInfo();
    info.setIg(ig);
    info.setDatatypes(displayInfoService.convertDatatypes(objects.getDatatypes()));
    info.setValueSets(displayInfoService.convertValueSets(objects.getValueSets()));

    return new ResponseMessage<IGDisplayInfo>(Status.SUCCESS, "", "Data type Added Succesfully", ig.getId(), false,
        ig.getUpdateDate(), info);
  }

  @RequestMapping(value = "/api/igdocuments/{id}/valuesets/add", method = RequestMethod.POST, produces = {
  "application/json" })
  public ResponseMessage<IGDisplayInfo> addValueSets(@PathVariable("id") String id,
      @RequestBody AddingWrapper wrapper, Authentication authentication)
          throws IGNotFoundException, AddingException {
    String username = authentication.getPrincipal().toString();
    Ig ig = findIgById(id);
    Set<String> savedIds = new HashSet<String>();
    for (AddingInfo elm : wrapper.getSelected()) {

      if (elm.isFlavor()) {
        if(elm.getOriginalId() !=null) {
          Valueset valueset = valuesetService.findById(elm.getOriginalId());
          if (valueset != null) {
            Valueset clone = valueset.clone();
            clone.getDomainInfo().setScope(Scope.USER);
            if(!elm.isIncludeChildren()) {
              clone.setSourceType(SourceType.EXTERNAL);
              clone.setCodes(new HashSet<Code>());	
            }
            clone.setUsername(username);
            clone.setBindingIdentifier(elm.getName());
            clone.setSourceType(elm.getSourceType());
            clone = valuesetService.save(clone);
            ig.getValueSetRegistry().getCodesPresence().put(clone.getId(), elm.isIncludeChildren());
            savedIds.add(clone.getId());
          }
        } else {
          Valueset valueset= new Valueset();
          DomainInfo info = new DomainInfo();
          info.setScope(Scope.USER);
          info.setVersion(null);
          valueset.setDomainInfo(info);
          if(!elm.isIncludeChildren()) {
            valueset.setSourceType(SourceType.EXTERNAL);
            valueset.setCodes(new HashSet<Code>());	
          } else {
            valueset.setSourceType(SourceType.INTERNAL);
          }
          valueset.setUsername(username);
          valueset.setBindingIdentifier(elm.getName());
          valueset.setUrl(elm.getUrl());
          Valueset saved = valuesetService.save(valueset);
          ig.getValueSetRegistry().getCodesPresence().put(saved.getId(), elm.isIncludeChildren());
          savedIds.add(saved.getId());

        }

      } else {
        ig.getValueSetRegistry().getCodesPresence().put(elm.getId(), elm.isIncludeChildren());
        savedIds.add(elm.getId());
      }
    }
    AddValueSetResponseObject objects = crudService.addValueSets(savedIds, ig);
    igService.save(ig);
    IGDisplayInfo info = new IGDisplayInfo();
    info.setIg(ig);
    info.setValueSets(displayInfoService.convertValueSets(objects.getValueSets()));

    return new ResponseMessage<IGDisplayInfo>(Status.SUCCESS, "", "Value Sets Added Succesfully", ig.getId(), false,
        ig.getUpdateDate(), info);
  }

  @RequestMapping(value = "/api/igdocuments/{id}/clone", method = RequestMethod.POST, produces = {
  "application/json" })
  public @ResponseBody ResponseMessage<String> copy(@PathVariable("id") String id, @RequestBody CopyInfo info,  Authentication authentication)
      throws IGNotFoundException {
    String username = authentication.getPrincipal().toString();

    Ig ig = findIgById(id);
    Ig clone = this.igService.clone(ig, username);
    clone.getDomainInfo().setScope(Scope.USER);
    if(info.getMode().equals(CloneMode.CLONE)) {
      clone.getMetadata().setTitle(clone.getMetadata().getTitle() + "[clone]");
    }else if(info.getMode().equals(CloneMode.DERIVE)){
      clone.getMetadata().setTitle(clone.getMetadata().getTitle() + "[derived]");
      clone.setDerived(true); 
    }
    clone.setCreationDate(new Date());
    
    clone = igService.save(clone);
    return new ResponseMessage<String>(Status.SUCCESS, "", "Ig Cloned Successfully", clone.getId(), false,
        clone.getUpdateDate(), clone.getId());
  }
  
  @RequestMapping(value = "/api/igdocuments/{id}/publish", method = RequestMethod.POST, produces = {
  "application/json" })
  public @ResponseBody ResponseMessage<String> publish(@PathVariable("id") String id, Authentication authentication)
      throws IGNotFoundException, IGUpdateException {
    String username = authentication.getPrincipal().toString();

    this.igService.publishIG(id);
    return new ResponseMessage<String>(Status.SUCCESS, "", "Ig published Successfully", id, false,
        new Date(), id);
  }

  @RequestMapping(value = "/api/igdocuments/{id}", method = RequestMethod.DELETE, produces = { "application/json" })
  public @ResponseBody ResponseMessage<String> archive(@PathVariable("id") String id, Authentication authentication)
      throws IGNotFoundException {

    Ig ig = findIgById(id);
    igService.delete(ig);
    return new ResponseMessage<String>(Status.SUCCESS, "", "Ig deleted Successfully", ig.getId(), false,
        ig.getUpdateDate(), ig.getId());
  }

  @RequestMapping(value = "/api/igdocuments/{id}/state", method = RequestMethod.GET, produces = {
  "application/json" })
  public @ResponseBody IGDisplayInfo getState(@PathVariable("id") String id, Authentication authentication)
      throws IGNotFoundException {

    Ig ig = findIgById(id);
    displayInfoService.covertIgToDisplay(ig);
    return displayInfoService.covertIgToDisplay(ig);
  }
  
  @RequestMapping(value = "/api/igdocuments/{id}/delta", method = RequestMethod.GET, produces = {
  "application/json" })
  public @ResponseBody IGDisplayInfo getDeltaDisplay(@PathVariable("id") String id, Authentication authentication)
      throws IGNotFoundException {

    Ig ig = findIgById(id);
    
    displayInfoService.covertIgToDisplay(ig);
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
      @RequestParam("file") MultipartFile csvFile) throws ImportValueSetException {
    CSVReader reader = null;
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
        Ig ig = findIgById(id);
        newVS = this.valuesetService.save(newVS);
        newVS.getDomainInfo().setScope(Scope.USER);
        newVS.setUsername(ig.getUsername());
      

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


  @RequestMapping(value = "/api/igdocuments/exportTests", method = RequestMethod.GET, produces = {"application/json"})
  public void  test(HttpServletResponse response, Authentication authentication) throws Exception {
    //		IgDataModel igModel = this.igService.generateDataModel(findIgById("5d38babd0739e61e3825b183"));
    IgDataModel igModel = this.igService.generateDataModel(findIgById("5b5b69ad84ae99a4bd0d1f74"));

    InputStream content = this.igService.exportValidationXMLByZip(igModel, new String[] {"5d38babd0739e61e3825b183"}, null);
    response.setContentType("application/zip");
    response.setHeader("Content-disposition", "attachment;filename=" + this.updateFileName(igModel.getModel().getMetadata().getTitle()) + "-" + "5b5b69ad84ae99a4bd0d1f74" + "_" + new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date()) + ".zip");
    FileCopyUtils.copy(content, response.getOutputStream());
  }

  private String updateFileName(String str) {
    return str.replaceAll(" ", "-").replaceAll("\\*", "-").replaceAll("\"", "-").replaceAll(":", "-").replaceAll(";", "-").replaceAll("=", "-").replaceAll(",", "-");
  }


  @RequestMapping(value = "/api/export/ig/{id}/xml/validation", method = RequestMethod.POST, produces = { "application/json" }, consumes = "application/x-www-form-urlencoded; charset=UTF-8")

  public void exportXML(@PathVariable("id") String id, Authentication authentication,FormData formData,
      HttpServletResponse response)
          throws Exception {
    IgDataModel igModel = this.igService.generateDataModel(findIgById(id));		
    ObjectMapper mapper = new ObjectMapper();
    mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    ReqId reqIds = mapper.readValue(formData.getJson(), ReqId.class);

    InputStream content = this.igService.exportValidationXMLByZip(igModel, reqIds.getConformanceProfilesId(), reqIds.getCompositeProfilesId());
    response.setContentType("application/zip");
    response.setHeader("Content-disposition", "attachment;filename=" + this.updateFileName(igModel.getModel().getMetadata().getTitle()) + "-" + id + "_" + new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date()) + ".zip");
    FileCopyUtils.copy(content, response.getOutputStream());
  }

  @RequestMapping(value = "/api/igdocuments/{ig}/predicate/{id}", method = RequestMethod.GET,
      produces = {"application/json"})
  public @ResponseBody
  Predicate getPredicate(@PathVariable("ig") String ig, @PathVariable("id") String id,
      Authentication authentication) throws IGNotFoundException, PredicateNotFoundException {
    Ig igdocument = findIgById(ig);
    if(igdocument.getUsername().equals(authentication.getName())) {
      return this.predicateRepository.findById(id).orElseThrow(() -> {
        return new PredicateNotFoundException(id);
      });
    } else {
      throw new PredicateNotFoundException(id);
    }
  }
  
  
//  @RequestMapping(value = "/api/verification/xml", method = RequestMethod.POST, produces = {"application/json"})
//  public @ResponseBodyVerificationReport verifyXML(@RequestBody String profileXML,
//      @RequestBody String constraintXML, @RequestBody String valuesetXML,
//      Authentication authentication) {
//    return this.verificationService.verifyXMLs(profileXML, constraintXML, valuesetXML);
//  }
//
//  @RequestMapping(value = "/api/verification/valueset", method = RequestMethod.POST, produces = {"application/json"})
//  public @ResponseBody VerificationResult verifyValueset(@RequestParam(name = "dId", required = true) String documentId, @RequestBody Valueset valueset, Authentication authentication) {
//    return this.verificationService.verifyValueset(valueset, documentId, null);
//  }
//  
//  @RequestMapping(value = "/api/verification/datatype", method = RequestMethod.POST, produces = {"application/json"})
//  public @ResponseBody VerificationResult verifyDatatype(@RequestParam(name = "dId", required = true) String documentId, @RequestBody Datatype datatype, Authentication authentication) {
//    return this.verificationService.verifyDatatype(datatype, documentId, null);
//  }
//  
//  @RequestMapping(value = "/api/verification/segment", method = RequestMethod.POST, produces = {"application/json"})
//  public @ResponseBody VerificationResult verifySegment(@RequestParam(name = "dId", required = true) String documentId, @RequestBody Segment segment, Authentication authentication) {
//    return this.verificationService.verifySegment(segment, documentId, null);
//  }
//  
//  @RequestMapping(value = "/api/verification/conformance-profile", method = RequestMethod.POST, produces = {"application/json"})
//  public @ResponseBody VerificationResult verifyConformanceProfile(@RequestParam(name = "dId", required = true) String documentId, @RequestBody ConformanceProfile conformanceProfile, Authentication authentication) {
//    return this.verificationService.verifyConformanceProfile(conformanceProfile, documentId, null);
//  }
//  
//  @RequestMapping(value = "/api/verification/{documentId}/valueset/{valuesetId}", method = RequestMethod.GET, produces = {"application/json"})
//  public @ResponseBody VerificationResult verifyValuesetById(@PathVariable("documentId") String documentId, @PathVariable("valuesetId") String valuesetId, Authentication authentication) {
//    Valueset vs = this.valuesetService.findById(valuesetId);
//    if(vs != null) return this.verificationService.verifyValueset(vs, documentId, null);
//    return null;
//  }
//  
//  @RequestMapping(value = "/api/verification/{documentId}/datatype/{datatypeId}", method = RequestMethod.GET, produces = {"application/json"})
//  public @ResponseBody VerificationResult verifyDatatypeById(@PathVariable("documentId") String documentId, @PathVariable("datatypeId") String datatypeId, Authentication authentication) {
//    Datatype dt = this.datatypeService.findById(datatypeId);
//    if (dt != null) return this.verificationService.verifyDatatype(dt, documentId, null);
//    return null;
//  }
//  
//  @RequestMapping(value = "/api/verification/{documentId}/segment/{segmentId}", method = RequestMethod.GET, produces = {"application/json"})
//  public @ResponseBody VerificationResult verifySegmentById(@PathVariable("documentId") String documentId, @PathVariable("segmentId") String segmentId, Authentication authentication) {
//    Segment sg = this.segmentService.findById(segmentId);
//    if (sg != null) return this.verificationService.verifySegment(sg, documentId, null);
//    return null;
//  }
//  
//  @RequestMapping(value = "/api/verification/{documentId}/conformance-profile/{conformanceProfileId}", method = RequestMethod.GET, produces = {"application/json"})
//  public @ResponseBody VerificationResult verifyConformanceProfileById(@PathVariable("documentId") String documentId, @PathVariable("conformanceProfileId") String conformanceProfileId, Authentication authentication) {
//    ConformanceProfile cp = this.conformanceProfileService.findById(conformanceProfileId);
//    if (cp != null) return this.verificationService.verifyConformanceProfile(cp, documentId, null);
//    return null;
//  }
  
  @RequestMapping(value = "/api/igdocuments/{igid}/verify", method = RequestMethod.GET, produces = {"application/json"})
  public @ResponseBody VerificationReport verifyConformanceProfileById(@PathVariable("igid") String igid, Authentication authentication) {
    Ig ig = this.igService.findById(igid);
    if (ig != null) return this.verificationService.verifyIg(igid);
    return null;
  }
}
