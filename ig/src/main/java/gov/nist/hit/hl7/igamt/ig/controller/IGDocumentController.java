package gov.nist.hit.hl7.igamt.ig.controller;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletResponse;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.mongodb.client.result.UpdateResult;

import gov.nist.hit.hl7.igamt.common.base.controller.BaseController;
import gov.nist.hit.hl7.igamt.common.base.domain.DocumentMetadata;
import gov.nist.hit.hl7.igamt.common.base.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.TextSection;
import gov.nist.hit.hl7.igamt.common.base.exception.ValidationException;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage.Status;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.event.Event;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.event.display.MessageEventTreeNode;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.event.MessageEventService;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DatatypeLabel;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DatatypeSelectItemGroup;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.export.domain.ExportedFile;
import gov.nist.hit.hl7.igamt.export.exception.ExportException;
import gov.nist.hit.hl7.igamt.ig.controller.wrappers.AddIngInfo;
import gov.nist.hit.hl7.igamt.ig.controller.wrappers.AddingMessagesWrapper;
import gov.nist.hit.hl7.igamt.ig.controller.wrappers.AddingWrapper;
import gov.nist.hit.hl7.igamt.ig.controller.wrappers.CopyWrapper;
import gov.nist.hit.hl7.igamt.ig.controller.wrappers.CreationWrapper;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.exceptions.AddingException;
import gov.nist.hit.hl7.igamt.ig.exceptions.CloneException;
import gov.nist.hit.hl7.igamt.ig.exceptions.IGConverterException;
import gov.nist.hit.hl7.igamt.ig.exceptions.IGNotFoundException;
import gov.nist.hit.hl7.igamt.ig.exceptions.IGUpdateException;
import gov.nist.hit.hl7.igamt.ig.exceptions.SectionNotFoundException;
import gov.nist.hit.hl7.igamt.ig.exceptions.XReferenceFoundException;
import gov.nist.hit.hl7.igamt.ig.model.AddDatatypeResponseDisplay;
import gov.nist.hit.hl7.igamt.ig.model.AddDatatypeResponseObject;
import gov.nist.hit.hl7.igamt.ig.model.AddMessageResponseDisplay;
import gov.nist.hit.hl7.igamt.ig.model.AddMessageResponseObject;
import gov.nist.hit.hl7.igamt.ig.model.AddSegmentResponseDisplay;
import gov.nist.hit.hl7.igamt.ig.model.AddSegmentResponseObject;
import gov.nist.hit.hl7.igamt.ig.model.AddValueSetResponseObject;
import gov.nist.hit.hl7.igamt.ig.model.AddValueSetsResponseDisplay;
import gov.nist.hit.hl7.igamt.ig.model.IGDisplay;
import gov.nist.hit.hl7.igamt.ig.model.IgSummary;
import gov.nist.hit.hl7.igamt.ig.model.TreeNode;
import gov.nist.hit.hl7.igamt.ig.service.CrudService;
import gov.nist.hit.hl7.igamt.ig.service.DisplayConverterService;
import gov.nist.hit.hl7.igamt.ig.service.IgExportService;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.serialization.exception.CoConstraintSaveException;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.domain.display.ValuesetLabel;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;
import gov.nist.hit.hl7.igamt.xreference.exceptions.XReferenceException;
import gov.nist.hit.hl7.igamt.xreference.model.CrossRefsNode;
import gov.nist.hit.hl7.igamt.xreference.service.XRefService;

@RestController
public class IGDocumentController extends BaseController {

  @Autowired
  IgService igService;

  @Autowired
  IgExportService igExportService;

  @Autowired
  DisplayConverterService displayConverter;

  @Autowired
  MessageEventService messageEventService;

  @Autowired
  ConformanceProfileService conformanceProfileService;

  @Autowired
  CrudService crudService;

  @Autowired
  private XRefService xRefService;

  @Autowired
  DatatypeService datatypeService;

  @Autowired
  SegmentService segmentService;

  @Autowired
  ValuesetService valuesetService;



  private static final String DATATYPE_DELETED = "DATATYPE_DELETED";
  private static final String SEGMENT_DELETED = "SEGMENT_DELETED";
  private static final String VALUESET_DELETE = "VALUESET_DELETE";
  private static final String CONFORMANCE_PROFILE_DELETE = "CONFORMANCE_PROFILE_DELETE";

  private static final String TABLE_OF_CONTENT_UPDATED = "TABLE_OF_CONTENT_UPDATED";
  private static final String METATDATA_UPDATED = "METATDATA_UPDATED";



  public IGDocumentController() {}
  
  
  @RequestMapping(value = "/api/igdocuments/{id}/datatypeLabels", method = RequestMethod.GET, produces = {"application/json"})
  public @ResponseBody Set<DatatypeLabel> getDatatypeLabels(@PathVariable("id") String id, Authentication authentication) throws IGNotFoundException {
    Ig igdoument = findIgById(id);
    Set<DatatypeLabel> result = new HashSet<DatatypeLabel>();

    for(Link link :igdoument.getDatatypeRegistry().getChildren()){
      Datatype dt = this.datatypeService.findById(link.getId());
      if(dt != null){
        DatatypeLabel label = new DatatypeLabel();
        label.setDomainInfo(dt.getDomainInfo());
        label.setExt(dt.getExt());
        label.setId(dt.getId());
        label.setLabel(dt.getLabel());
        if(dt instanceof ComplexDatatype) label.setLeaf(false);    
        else label.setLeaf(true);
        label.setName(dt.getName());
        result.add(label);
      }
    }
    return result;  
  }
  
  @RequestMapping(value = "/api/igdocuments/{id}/{viewScope}/falvorOptions/{dtId}", method = RequestMethod.GET, produces = {"application/json"})
  public @ResponseBody List<DatatypeSelectItemGroup> getDatatypeFlavorsOptions(@PathVariable("id") String id, @PathVariable("viewScope") String viewScope,@PathVariable("dtId") String dtId, Authentication authentication) throws IGNotFoundException {
    Ig igdoument = findIgById(id);
    List<DatatypeSelectItemGroup> result =new ArrayList<DatatypeSelectItemGroup>();
    Set<String> ids=	this.gatherIds(igdoument.getDatatypeRegistry().getChildren());
    	
    Datatype d=this.datatypeService.findById(dtId);
    
    result = datatypeService.getDatatypeFlavorsOptions(ids, d, viewScope);
    return result;
      

  }
  
  @RequestMapping(value = "/api/igdocuments/{id}/valuesetLabels", method = RequestMethod.GET, produces = {"application/json"})
  public @ResponseBody Set<ValuesetLabel> getValuesetLabels(@PathVariable("id") String id, Authentication authentication) throws IGNotFoundException {
    Ig igdoument = findIgById(id);
    Set<ValuesetLabel> result = new HashSet<ValuesetLabel>();

    for(Link link :igdoument.getValueSetRegistry().getChildren()){
      Valueset vs = this.valuesetService.findById(link.getId());
      if(vs != null){
        ValuesetLabel label = new ValuesetLabel();
        label.setId(vs.getId());
        label.setScope(vs.getDomainInfo().getScope());
        label.setLabel(vs.getBindingIdentifier());
        label.setName(vs.getName());
        label.setVersion(vs.getDomainInfo().getVersion());
        result.add(label);
      }
    }
    return result;  
  }
  
  /**
   * 
   * @param id
   * @param response
   * @throws ExportException
   */
  @RequestMapping(value = "/api/igdocuments/{id}/export/html", method = RequestMethod.GET)
  public @ResponseBody void exportIgDocumentToHtml(@PathVariable("id") String id,
      HttpServletResponse response) throws ExportException {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null) {
      String username = authentication.getPrincipal().toString();
      ExportedFile exportedFile = igExportService.exportIgDocumentToHtml(username, id);
      response.setContentType("text/html");
      response.setHeader("Content-disposition",
          "attachment;filename=" + exportedFile.getFileName());
      try {
        FileCopyUtils.copy(exportedFile.getContent(), response.getOutputStream());
      } catch (IOException e) {
        throw new ExportException(e, "Error while sending back exported IG Document with id " + id);
      }
    } else {
      throw new AuthenticationCredentialsNotFoundException("No Authentication ");
    }
  }

  /**
   * 
   * @param id
   * @param response
   * @param authentication
   * @throws ExportException
   */
  @RequestMapping(value = "/api/igdocuments/{id}/export/word", method = RequestMethod.GET)
  public @ResponseBody void exportIgDocumentToWord(@PathVariable("id") String id,
      HttpServletResponse response, Authentication authentication) throws ExportException {
    if (authentication != null) {
      String username = authentication.getPrincipal().toString();
      ExportedFile exportedFile = igExportService.exportIgDocumentToWord(username, id);
      response.setContentType(
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
      response.setHeader("Content-disposition",
          "attachment;filename=" + exportedFile.getFileName());
      try {
        FileCopyUtils.copy(exportedFile.getContent(), response.getOutputStream());
      } catch (IOException e) {
        throw new ExportException(e, "Error while sending back exported IG Document with id " + id);
      }
    } else {
      throw new AuthenticationCredentialsNotFoundException("No Authentication ");
    }
  }

  /**
   * 
   * @param authentication
   * @return
   */
  @RequestMapping(value = "/api/igdocuments", method = RequestMethod.GET,
      produces = {"application/json"})
  public @ResponseBody List<IgSummary> getUserIG(Authentication authentication) {
    String username = authentication.getPrincipal().toString();
    List<Ig> igdouments = igService.findLatestByUsername(username, Scope.USER);
    return igService.convertListToDisplayList(igdouments);
  }

  /**
   * 
   * @param id
   * @param authentication
   * @return
   * @throws IGNotFoundException
   * @throws IGConverterException
   */
  @RequestMapping(value = "/api/igdocuments/{id}/display", method = RequestMethod.GET,
      produces = {"application/json"})

  public @ResponseBody IGDisplay getIgDisplay(@PathVariable("id") String id,
      Authentication authentication) throws IGNotFoundException, IGConverterException {

    Ig igdoument = findIgById(id);
    IGDisplay ret = displayConverter.convertDomainToModel(igdoument);
    return ret;

  }

  /**
   * 
   * @param id
   * @param authentication
   * @return
   * @throws IGNotFoundException
   * @throws IGUpdateException
   */
  @RequestMapping(value = "/api/igdocuments/{id}/updatetoc", method = RequestMethod.POST,
      produces = {"application/json"})

  public @ResponseBody ResponseMessage<Object> get(@PathVariable("id") String id,
      @RequestBody List<TreeNode> toc, Authentication authentication)
      throws IGNotFoundException, IGUpdateException {


    Set<TextSection> content = displayConverter.convertTocToDomain(toc);

    UpdateResult updateResult = igService.updateAttribute(id, "content", content);
    if (!updateResult.wasAcknowledged()) {
      throw new IGUpdateException(id);
    }

    return new ResponseMessage<Object>(Status.SUCCESS, TABLE_OF_CONTENT_UPDATED, id, new Date());
  }

  @RequestMapping(value = "/api/igdocuments/{id}/updatemetadata", method = RequestMethod.POST,
      produces = {"application/json"})

  public @ResponseBody ResponseMessage<Object> get(@PathVariable("id") String id,
      @RequestBody DocumentMetadata metadata, Authentication authentication)
      throws IGNotFoundException, IGUpdateException {
    UpdateResult updateResult = igService.updateAttribute(id, "metadata", metadata);
    if (!updateResult.wasAcknowledged()) {
      throw new IGUpdateException("Could not update IG Metadata ");
    }
    return new ResponseMessage<Object>(Status.SUCCESS, METATDATA_UPDATED, id, new Date());
  }


  @RequestMapping(value = "/api/igdocuments/findMessageEvents/{version:.+}",
      method = RequestMethod.GET, produces = {"application/json"})

  public @ResponseBody List<MessageEventTreeNode> getMessageEvents(
      @PathVariable("version") String version, Authentication authentication) {
    try {
      List<MessageEventTreeNode> ret = messageEventService.findByHl7Version(version);
      return ret;

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
  @RequestMapping(value = "/api/igdocuments/create", method = RequestMethod.POST,
      produces = {"application/json"})
  public @ResponseBody ResponseMessage<String> create(@RequestBody CreationWrapper wrapper,
      Authentication authentication) throws JsonParseException, JsonMappingException,
      FileNotFoundException, IOException, AddingException {

    try {
      String username = authentication.getPrincipal().toString();
      Ig empty = igService.CreateEmptyIg();
      Set<String> savedIds = new HashSet<String>();
      for (Event ev : wrapper.getMsgEvts()) {
        ConformanceProfile profile = conformanceProfileService.findById(ev.getId());
        if (profile != null) {
          ConformanceProfile clone = profile.clone();
          clone.setUsername(username);
          clone.getDomainInfo().setScope(Scope.USER);
          clone.setEvent(ev.getName());
          clone.setId(new ObjectId().toString());
          clone.setName(profile.getName());
          clone = conformanceProfileService.save(clone);
          savedIds.add(clone.getId());
        }
      }
      empty.setId(new ObjectId().toString());
      empty.setUsername(username);
      DomainInfo info = new DomainInfo();
      info.setScope(Scope.USER);
      empty.setDomainInfo(info);
      Date date = new Date();
      empty.setCreationDate(date);
      empty.setUpdateDate(date);
      empty.setMetadata(wrapper.getMetadata());
      crudService.AddConformanceProfilesToEmptyIg(savedIds, empty);
      igService.save(empty);

      return new ResponseMessage<String>(Status.SUCCESS, "", "IG created Successfuly", empty.getId(), false, empty.getUpdateDate(), empty.getId());

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
  @RequestMapping(value = "/api/igdocuments/{id}/section/{sectionId}", method = RequestMethod.GET,
      produces = {"application/json"})

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
   * @throws IGNotFoundException
   * @throws XReferenceException
   */
  @RequestMapping(value = "/api/igdocuments/{id}/datatypes/{datatypeId}/crossref",
      method = RequestMethod.GET, produces = {"application/json"})
  public @ResponseBody Map<String, List<CrossRefsNode>> findDatatypeCrossRef(
      @PathVariable("id") String id, @PathVariable("datatypeId") String datatypeId,
      Authentication authentication) throws IGNotFoundException, XReferenceException {
    Ig ig = igService.findById(id);
    if (ig != null) {
      Set<String> filterDatatypeIds = gatherIds(ig.getDatatypeRegistry().getChildren());
      Set<String> filterSegmentIds = gatherIds(ig.getSegmentRegistry().getChildren());
      Map<String, List<CrossRefsNode>> results =
          xRefService.getDatatypeReferences(datatypeId, filterDatatypeIds, filterSegmentIds);
      return results;
    } else {
      throw new IGNotFoundException("Cannot found Id document");
    }
  }

  /**
   * 
   * @param id
   * @param segmentId
   * @param authentication
   * @return
   * @throws IGNotFoundException
   * @throws XReferenceException
   */
  @RequestMapping(value = "/api/igdocuments/{id}/segments/{segmentId}/crossref",
      method = RequestMethod.GET, produces = {"application/json"})
  public @ResponseBody Map<String, List<CrossRefsNode>> findSegmentCrossRef(
      @PathVariable("id") String id, @PathVariable("segmentId") String segmentId,
      Authentication authentication) throws IGNotFoundException, XReferenceException {
    Ig ig = findIgById(id);
    Set<String> filterConformanceProfileIds =
        gatherIds(ig.getConformanceProfileRegistry().getChildren());
    Map<String, List<CrossRefsNode>> results =
        xRefService.getSegmentReferences(segmentId, filterConformanceProfileIds);
    return results;
  }


  /**
   * 
   * @param id
   * @param valuesetId
   * @param authentication
   * @return
   * @throws IGNotFoundException
   * @throws XReferenceException
   */
  @RequestMapping(value = "/api/igdocuments/{id}/valuesets/{valuesetId}/crossref",
      method = RequestMethod.GET, produces = {"application/json"})
  public @ResponseBody Map<String, List<CrossRefsNode>> findValueSetCrossRef(
      @PathVariable("id") String id, @PathVariable("valuesetId") String valuesetId,
      Authentication authentication) throws IGNotFoundException, XReferenceException {
    Ig ig = findIgById(id);
    Set<String> filterDatatypeIds = gatherIds(ig.getDatatypeRegistry().getChildren());
    Set<String> filterSegmentIds = gatherIds(ig.getSegmentRegistry().getChildren());
    Set<String> filterConformanceProfileIds =
        gatherIds(ig.getConformanceProfileRegistry().getChildren());
    Map<String, List<CrossRefsNode>> results = xRefService.getValueSetReferences(id, filterDatatypeIds,
        filterSegmentIds, filterConformanceProfileIds);
    return results;
  }


  /**
   * 
   * @param id
   * @param datatypeId
   * @param authentication
   * @return
   * @throws IGNotFoundException
   * @throws XReferenceFoundException
   * @throws XReferenceException
   */
  @RequestMapping(value = "/api/igdocuments/{id}/datatypes/{datatypeId}/delete",
      method = RequestMethod.DELETE, produces = {"application/json"})
  public ResponseMessage deleteDatatype(@PathVariable("id") String id,
      @PathVariable("datatypeId") String datatypeId, Authentication authentication)
      throws IGNotFoundException, XReferenceFoundException, XReferenceException {
    Map<String, List<CrossRefsNode>> xreferences = findDatatypeCrossRef(id, datatypeId, authentication);
    if (xreferences != null && !xreferences.isEmpty()) {
      throw new XReferenceFoundException(datatypeId, xreferences);
    }
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
  @RequestMapping(value = "/api/igdocuments/{id}/segments/{segmentId}/delete",
      method = RequestMethod.DELETE, produces = {"application/json"})
  public ResponseMessage deleteSegment(@PathVariable("id") String id,
      @PathVariable("segmentId") String segmentId, Authentication authentication)
      throws IGNotFoundException, XReferenceFoundException, XReferenceException {
    Map<String, List<CrossRefsNode>> xreferences = findSegmentCrossRef(id, segmentId, authentication);
    if (xreferences != null && !xreferences.isEmpty()) {
      throw new XReferenceFoundException(segmentId, xreferences);
    }
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
    igService.save(ig);
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
  @RequestMapping(value = "/api/igdocuments/{id}/valuesets/{valuesetId}/delete",
      method = RequestMethod.DELETE, produces = {"application/json"})
  public ResponseMessage deleteValueSet(@PathVariable("id") String id,
      @PathVariable("valuesetId") String valuesetId, Authentication authentication)
      throws IGNotFoundException, XReferenceFoundException, XReferenceException {
    Map<String, List<CrossRefsNode>> xreferences = findValueSetCrossRef(id, valuesetId, authentication);
    if (xreferences != null && !xreferences.isEmpty()) {
      throw new XReferenceFoundException(valuesetId, xreferences);
    }
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
    igService.save(ig);
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
  @RequestMapping(value = "/api/igdocuments/{id}/conformanceprofiles/{conformanceprofileId}/delete",
      method = RequestMethod.DELETE, produces = {"application/json"})
  public ResponseMessage deleteConformanceProfile(@PathVariable("id") String id,
      @PathVariable("conformanceprofileId") String conformanceProfileId,
      Authentication authentication)
      throws IGNotFoundException, XReferenceFoundException, XReferenceException {

    Ig ig = findIgById(id);
    Link found =
        findLinkById(conformanceProfileId, ig.getConformanceProfileRegistry().getChildren());
    if (found != null) {
      ig.getConformanceProfileRegistry().getChildren().remove(found);
    }
    ConformanceProfile conformanceProfile =
        conformanceProfileService.findById(conformanceProfileId);
    if (conformanceProfile != null) {
      if (conformanceProfile.getDomainInfo().getScope().equals(Scope.USER)) {
        conformanceProfileService.delete(conformanceProfile);
      }
    }
    igService.save(ig);
    return new ResponseMessage(Status.SUCCESS, CONFORMANCE_PROFILE_DELETE, conformanceProfileId,
        new Date());
  }


  @RequestMapping(value = "/api/igdocuments/{id}/conformanceprofiles/{conformanceProfileId}/clone",
      method = RequestMethod.POST, produces = {"application/json"})
  public ResponseMessage<TreeNode> cloneConformanceProfile(@RequestBody CopyWrapper wrapper,
      @PathVariable("id") String id,
      @PathVariable("conformanceProfileId") String conformanceProfileId,
      Authentication authentication) throws CloneException, IGNotFoundException {
    Ig ig = findIgById(id);
    String username = authentication.getName();
    ConformanceProfile profile = conformanceProfileService.findById(wrapper.getId());
    if (profile == null) {
      throw new CloneException("Failed to build conformance profile tree structure");
    }
    ConformanceProfile clone = profile.clone();
    clone.setUsername(username);
    clone.setId(new ObjectId().toString());
    clone.setName(wrapper.getName());
    clone.getDomainInfo().setScope(Scope.USER);

    clone = conformanceProfileService.save(clone);
    ig.getConformanceProfileRegistry().getChildren().add(new Link(clone.getId()));
    igService.save(ig);
    
    return new ResponseMessage<TreeNode>(Status.SUCCESS, "", "Conformance profile clone Success", clone.getId(), false, clone.getUpdateDate(), displayConverter.createConformanceProfileNode(clone, 0));

  }


  @RequestMapping(value = "/api/igdocuments/{id}/segments/{segmentId}/clone",
      method = RequestMethod.POST, produces = {"application/json"})
  public ResponseMessage<TreeNode> cloneSegment(@RequestBody CopyWrapper wrapper, @PathVariable("id") String id,
      @PathVariable("segmentId") String segmentId, Authentication authentication)
      throws IGNotFoundException, ValidationException, CloneException {
    Ig ig = findIgById(id);
    String username = authentication.getPrincipal().toString();
    Segment segment = segmentService.findById(wrapper.getId());
    if (segment == null) {
      throw new CloneException("Cannot find segment with id=" + wrapper.getId());
    }
    Segment clone = segment.clone();
    clone.setUsername(username);
    clone.setId(new ObjectId().toString());
    clone.setName(segment.getName());
    clone.setExt(wrapper.getExt());
    clone.getDomainInfo().setScope(Scope.USER);

    clone = segmentService.save(clone);
    ig.getSegmentRegistry().getChildren().add(new Link(clone.getId()));
    igService.save(ig);
    return new ResponseMessage<TreeNode>(Status.SUCCESS, "", "Segment profile clone Success", clone.getId(), false, clone.getUpdateDate(), displayConverter.createSegmentNode(clone, 0));

  }



  @RequestMapping(value = "/api/igdocuments/{id}/datatypes/{datatypeId}/clone",
      method = RequestMethod.POST, produces = {"application/json"})
  public ResponseMessage<TreeNode> copyDatatype(@RequestBody CopyWrapper wrapper, @PathVariable("id") String id,
      @PathVariable("datatypeId") String datatypeId, Authentication authentication)
      throws IGNotFoundException, CloneException {
    Ig ig = findIgById(id);
    String username = authentication.getPrincipal().toString();
    Datatype datatype = datatypeService.findById(wrapper.getId());
    if (datatype == null) {
      throw new CloneException("Cannot find datatype with id=" + wrapper.getId());
    }
    Datatype clone = datatype.clone();
    clone.setUsername(username);
    clone.setId(new ObjectId().toString());
    clone.setExt(wrapper.getExt());
    clone.getDomainInfo().setScope(Scope.USER);

    clone = datatypeService.save(clone);
    ig.getDatatypeRegistry().getChildren().add(new Link(clone.getId()));
    igService.save(ig);
    return new ResponseMessage<TreeNode>(Status.SUCCESS, "", "Datatype clone Success", clone.getId(), false, clone.getUpdateDate(), displayConverter.createDatatypeNode(clone, 0));

  }


  @RequestMapping(value = "/api/igdocuments/{id}/valuesets/{valuesetId}/clone",
      method = RequestMethod.POST, produces = {"application/json"})

  public ResponseMessage<TreeNode> cloneValueSet(@RequestBody CopyWrapper wrapper, @PathVariable("id") String id,
      @PathVariable("valuesetId") String valuesetId, Authentication authentication)
      throws CloneException, IGNotFoundException {
    Ig ig = findIgById(id);
    String username = authentication.getPrincipal().toString();
    Valueset valueset = valuesetService.findById(wrapper.getId());
    if (valueset == null) {
      throw new CloneException("Cannot find valueset with id=" + wrapper.getId());
    }
    Valueset clone = valueset.clone();
    clone.getDomainInfo().setScope(Scope.USER);

    clone.setUsername(username);
    clone.setId(new ObjectId().toString());
    clone.setBindingIdentifier(wrapper.getName());
    clone.getDomainInfo().setScope(Scope.USER);
    ig.getValueSetRegistry().getChildren().add(new Link(clone.getId()));
    clone = valuesetService.save(clone);
    igService.save(ig);
    return new ResponseMessage<TreeNode>(Status.SUCCESS, "", "Value Set clone Success", clone.getId(), false, clone.getUpdateDate(), displayConverter.createValueSetNode(clone, 0));


  }


  @RequestMapping(value = "/api/igdocuments/{id}/conformanceprofiles/add",
      method = RequestMethod.POST, produces = {"application/json"})
  public ResponseMessage<AddMessageResponseDisplay> addConforanceProfile(@PathVariable("id") String id,
      @RequestBody AddingMessagesWrapper wrapper, Authentication authentication)
      throws IGNotFoundException, AddingException {
    String username = authentication.getPrincipal().toString();
    Ig ig = findIgById(id);
    Set<String> savedIds = new HashSet<String>();
    for (Event ev : wrapper.getMsgEvts()) {
      ConformanceProfile profile = conformanceProfileService.findById(ev.getId());
      if (profile != null) {
        ConformanceProfile clone = profile.clone();
        clone.setUsername(username);
        clone.getDomainInfo().setScope(Scope.USER);

        clone.setEvent(ev.getName());
        clone.setId(new ObjectId().toString());
        clone.setName(profile.getName());
        clone = conformanceProfileService.save(clone);
        savedIds.add(clone.getId());
      }
    }
    AddMessageResponseObject objects = crudService.addConformanceProfiles(savedIds, ig);
    return new ResponseMessage<AddMessageResponseDisplay>(Status.SUCCESS, "", "Conformance profile Added Succesfully", ig.getId(), false, ig.getUpdateDate(), displayConverter.convertMessageAddResponseToDisplay(objects));

  }


  @RequestMapping(value = "/api/igdocuments/{id}/segments/add", method = RequestMethod.POST,
      produces = {"application/json"})
  public ResponseMessage<AddSegmentResponseDisplay> addSegments(@PathVariable("id") String id,
      @RequestBody AddingWrapper wrapper, Authentication authentication)
      throws IGNotFoundException, ValidationException, AddingException {
    String username = authentication.getPrincipal().toString();
    Ig ig = findIgById(id);
    Set<String> savedIds = new HashSet<String>();
    for (AddIngInfo elm : wrapper.getToAdd()) {
      if (elm.isFlavor()) {
        Segment segment = segmentService.findById(elm.getId());
        if (segment != null) {
          Segment clone = segment.clone();
          clone.getDomainInfo().setScope(Scope.USER);

          clone.setUsername(username);
          clone.setId(new ObjectId().toString());
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
    return new ResponseMessage<AddSegmentResponseDisplay>(Status.SUCCESS, "", "segment Added Succesfully", ig.getId(), false, ig.getUpdateDate(),  displayConverter.convertSegmentResponseToDisplay(objects));
  }


  @RequestMapping(value = "/api/igdocuments/{id}/datatypes/add", method = RequestMethod.POST,
      produces = {"application/json"})
  public ResponseMessage<AddDatatypeResponseDisplay> addDatatypes(@PathVariable("id") String id,
      @RequestBody AddingWrapper wrapper, Authentication authentication)
      throws IGNotFoundException, AddingException {
    String username = authentication.getPrincipal().toString();
    Ig ig = findIgById(id);
    Set<String> savedIds = new HashSet<String>();
    for (AddIngInfo elm : wrapper.getToAdd()) {
      if (elm.isFlavor()) {
        Datatype datatype = datatypeService.findById(elm.getId());
        if (datatype != null) {
          Datatype clone = datatype.clone();
          clone.getDomainInfo().setScope(Scope.USER);

          clone.setUsername(username);
          clone.setId(new ObjectId().toString());
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
    return new ResponseMessage<AddDatatypeResponseDisplay>(Status.SUCCESS, "", "Data type Added Succesfully", ig.getId(), false, ig.getUpdateDate(),  displayConverter.convertDatatypeResponseToDisplay(objects));


  }

  @RequestMapping(value = "/api/igdocuments/{id}/valuesets/add", method = RequestMethod.POST,
      produces = {"application/json"})
  public ResponseMessage<AddValueSetsResponseDisplay> addValueSets(@PathVariable("id") String id,
      @RequestBody AddingWrapper wrapper, Authentication authentication)
      throws IGNotFoundException, AddingException {
    String username = authentication.getPrincipal().toString();
    Ig ig = findIgById(id);
    Set<String> savedIds = new HashSet<String>();
    for (AddIngInfo elm : wrapper.getToAdd()) {
      if (elm.isFlavor()) {
        Valueset valueset = valuesetService.findById(elm.getId());
        if (valueset != null) {
          Valueset clone = valueset.clone();
          clone.getDomainInfo().setScope(Scope.USER);

          clone.setUsername(username);
          clone.setId(new ObjectId().toString());
          clone.setBindingIdentifier(elm.getName());
          clone = valuesetService.save(clone);
          savedIds.add(clone.getId());
        }
      } else {
        savedIds.add(elm.getId());
      }
    }
    AddValueSetResponseObject objects = crudService.addValueSets(savedIds, ig);
    return new ResponseMessage<AddValueSetsResponseDisplay>(Status.SUCCESS, "", "Data type Added Succesfully", ig.getId(), false, ig.getUpdateDate(),   displayConverter.convertDatatypeResponseToDisplay(objects));


  }

  @RequestMapping(value = "/api/igdocuments/{id}/clone", method = RequestMethod.GET,
      produces = {"application/json"})
  public @ResponseBody ResponseMessage<String> copy(@PathVariable("id") String id,
      Authentication authentication) throws IGNotFoundException, CoConstraintSaveException {
    String username = authentication.getPrincipal().toString();

    Ig ig = findIgById(id);
    Ig clone =this.igService.clone(ig, username);
    clone.getDomainInfo().setScope(Scope.USER);

    return new ResponseMessage<String>(Status.SUCCESS, "", "Ig Cloned Successfully", ig.getId(), false, ig.getUpdateDate(),  ig.getId());


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

}
