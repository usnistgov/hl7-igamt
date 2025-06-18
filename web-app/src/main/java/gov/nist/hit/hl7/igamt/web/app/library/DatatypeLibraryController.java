/**
 * This software was developed at the National Institute of Standards and Technology by employees of
 * the Federal Government in the course of their official duties. Pursuant to title 17 Section 105
 * of the United States Code this software is not subject to copyright protection and is in the
 * public domain. This is an experimental system. NIST assumes no responsibility whatsoever for its
 * use by other parties, and makes no guarantees, expressed or implied, about its quality,
 * reliability, or any other characteristic. We would appreciate acknowledgement if the software is
 * used. This software can be redistributed and/or modified freely provided that any derivative
 * works bear some notice that they are derived from it, and any modified versions bear some notice
 * that they have been modified.
 */
package gov.nist.hit.hl7.igamt.web.app.library;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import gov.nist.hit.hl7.igamt.common.base.wrappers.CreationWrapper;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.mongodb.client.result.UpdateResult;

import gov.nist.hit.hl7.igamt.common.base.domain.AccessType;
import gov.nist.hit.hl7.igamt.common.base.domain.ActiveInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.ActiveStatus;
import gov.nist.hit.hl7.igamt.common.base.domain.DocumentInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.DocumentMetadata;
import gov.nist.hit.hl7.igamt.common.base.domain.DocumentType;
import gov.nist.hit.hl7.igamt.common.base.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.PrivateAudience;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.Section;
import gov.nist.hit.hl7.igamt.common.base.domain.SharePermission;
import gov.nist.hit.hl7.igamt.common.base.domain.TextSection;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;
import gov.nist.hit.hl7.igamt.common.base.exception.ForbiddenOperationException;
import gov.nist.hit.hl7.igamt.common.base.model.DocumentSummary;
import gov.nist.hit.hl7.igamt.common.base.model.PublicationResult;
import gov.nist.hit.hl7.igamt.common.base.model.PublicationSummary;
//import gov.nist.hit.hl7.igamt.common.base.model.PublicationSummary;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage.Status;
import gov.nist.hit.hl7.igamt.common.base.service.CommonService;
import gov.nist.hit.hl7.igamt.common.base.util.RelationShip;
import gov.nist.hit.hl7.igamt.common.base.wrappers.AddResourceResponse;
import gov.nist.hit.hl7.igamt.common.base.wrappers.AddingInfo;
import gov.nist.hit.hl7.igamt.common.base.wrappers.AddingWrapper;
import gov.nist.hit.hl7.igamt.common.base.wrappers.CopyWrapper;
import gov.nist.hit.hl7.igamt.common.exception.EntityNotFound;
import gov.nist.hit.hl7.igamt.common.exception.SectionNotFoundException;
import gov.nist.hit.hl7.igamt.constraints.repository.PredicateRepository;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DatatypeLabel;
import gov.nist.hit.hl7.igamt.datatype.exception.DatatypeNotFoundException;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeDependencyService;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.datatypeLibrary.domain.DatatypeClassification;
import gov.nist.hit.hl7.igamt.datatypeLibrary.domain.DatatypeLibrary;
import gov.nist.hit.hl7.igamt.datatypeLibrary.domain.DatatypeVersionGroup;
import gov.nist.hit.hl7.igamt.datatypeLibrary.exceptions.AddingException;
import gov.nist.hit.hl7.igamt.datatypeLibrary.exceptions.CloneException;
import gov.nist.hit.hl7.igamt.datatypeLibrary.exceptions.DatatypeLibraryConverterException;
import gov.nist.hit.hl7.igamt.datatypeLibrary.exceptions.DatatypeLibraryNotFoundException;
import gov.nist.hit.hl7.igamt.datatypeLibrary.exceptions.DatatypeLibraryUpdateException;
import gov.nist.hit.hl7.igamt.datatypeLibrary.exceptions.OperationNotAllowedException;
import gov.nist.hit.hl7.igamt.datatypeLibrary.exceptions.XReferenceFoundException;
import gov.nist.hit.hl7.igamt.datatypeLibrary.model.AddDatatypeResponseDisplay;
import gov.nist.hit.hl7.igamt.datatypeLibrary.model.DatatypeLibraryDisplay;
import gov.nist.hit.hl7.igamt.datatypeLibrary.model.DatatypeVersionGroupDisplay;
import gov.nist.hit.hl7.igamt.datatypeLibrary.model.DocumentDisplayInfo;
import gov.nist.hit.hl7.igamt.datatypeLibrary.model.SelectableLibary;
import gov.nist.hit.hl7.igamt.datatypeLibrary.service.DatatypeClassificationService;
import gov.nist.hit.hl7.igamt.datatypeLibrary.service.DatatypeLibraryDisplayConverterService;
import gov.nist.hit.hl7.igamt.datatypeLibrary.service.DatatypeLibraryService;
import gov.nist.hit.hl7.igamt.datatypeLibrary.service.LibraryDisplayInfoService;
import gov.nist.hit.hl7.igamt.datatypeLibrary.service.EvolutionComparatorService;
import gov.nist.hit.hl7.igamt.datatypeLibrary.util.DeltaTreeNode;
import gov.nist.hit.hl7.igamt.datatypeLibrary.util.EvolutionPropertie;
import gov.nist.hit.hl7.igamt.datatypeLibrary.wrappers.AddDatatypeResponseObject;
import gov.nist.hit.hl7.igamt.display.model.CopyInfo;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.exceptions.IGNotFoundException;



/**
 * @author ena3
 *
 */

@RestController
public class DatatypeLibraryController {


  @Autowired
  private DatatypeService datatypeService;


  @Autowired
  private DatatypeDependencyService datatypeDependencyService;

  @Autowired
  private EvolutionComparatorService deltaService;
  @Autowired

  DatatypeClassificationService datatypeClassificationService;

  @Autowired
  DatatypeLibraryService dataypeLibraryService;
  @Autowired
  LibraryDisplayInfoService display;

  @Autowired
  DatatypeLibraryDisplayConverterService displayConverterService;

  @Autowired
  PredicateRepository predicateRepository;

  @Autowired
  CommonService commonService;



  private static final String DATATYPE_DELETED = "DATATYPE_DELETED";
  private static final String DATATYPE_LIBRARY_DELETED = "DATATYPE_LIBRARY_DELETED";


  private static final String TABLE_OF_CONTENT_UPDATED = "TABLE_OF_CONTENT_UPDATED";
  private static final String METATDATA_UPDATED = "METATDATA_UPDATED";


  @RequestMapping(
      value = "/api/datatype-library/comparedatatype/{name}/{version1:.+}/{version2:.+}",
      method = RequestMethod.GET, produces = {"application/json"})

  public @ResponseBody List<DeltaTreeNode> getMessageEvents(@PathVariable("name") String name,
      @PathVariable("version1") String version1, @PathVariable("version2") String version2,
      Authentication authentication) throws DatatypeNotFoundException {


    Datatype d1 = datatypeService.findOneByNameAndVersionAndScope(name, version1,
        Scope.HL7STANDARD.toString());

    Datatype d2 = datatypeService.findOneByNameAndVersionAndScope(name, version2,
        Scope.HL7STANDARD.toString());

    if (d1 == null) {
      throw new DatatypeNotFoundException(name, version1, Scope.HL7STANDARD.toString());

    } else if (d2 == null) {
      throw new DatatypeNotFoundException(name, version2, Scope.HL7STANDARD.toString());

    } else {
      HashMap<EvolutionPropertie, Boolean> criterias1 = new HashMap<EvolutionPropertie, Boolean>();
      criterias1.put(EvolutionPropertie.CPDATATYPE, true);
      criterias1.put(EvolutionPropertie.CPUSAGE, true);
      criterias1.put(EvolutionPropertie.CPNUMBER, true);

      return deltaService.getDatatypesDelta(d1, d2, criterias1).getChildren();
    }
  }


  @RequestMapping(value = "/api/datatype-library/classification", method = RequestMethod.GET,
      produces = {"application/json"})

  public @ResponseBody List<DatatypeClassification> classification()
      throws DatatypeNotFoundException {

    List<DatatypeClassification> ret = datatypeClassificationService.findAll();
    List<DatatypeClassification> ordered = ret.stream()
    	    .filter(d -> !d.getName().equals("-") && !d.getName().equals("var"))
    	    .sorted((DatatypeClassification l1, DatatypeClassification l2) -> l1.getName().compareTo(l2.getName()))
    	    .collect(Collectors.toList());
    return ordered;
  }

  @RequestMapping(value = "/api/datatype-library/create", method = RequestMethod.POST,
      produces = {"application/json"})

  public @ResponseBody ResponseMessage<String> create(@RequestBody CreationWrapper wrapper,
      Authentication authentication) throws JsonParseException, JsonMappingException,
  FileNotFoundException, IOException, AddingException, DatatypeNotFoundException, ForbiddenOperationException {

    String username = authentication.getPrincipal().toString();
    DatatypeLibrary empty = dataypeLibraryService.createEmptyDatatypeLibrary();
    empty.setUsername(username);
	PrivateAudience privateAudience = new PrivateAudience();
	privateAudience.setEditor(username);
	privateAudience.setViewers(new HashSet<>());
	empty.setAudience(privateAudience);
    String id = new ObjectId().toString();
    DomainInfo info = new DomainInfo();
    info.setScope(Scope.USER);
    empty.setDomainInfo(info);
    empty.setMetadata(wrapper.getMetadata());
    empty.setCreationDate(new Date());
    empty.setId(id);
    Set<String> savedIds = new HashSet<String>();

    if (wrapper.getSelected() != null || !wrapper.getSelected().isEmpty()) {
      for (AddingInfo elm : wrapper.getSelected()) {
        List<Datatype> datatypes = datatypeService.findByNameAndVersionAndScope(elm.getName(),
            elm.getDomainInfo().getVersion(), Scope.HL7STANDARD.toString());
        if (elm.isFlavor()) {

          if (datatypes != null && !datatypes.isEmpty()) {
            Datatype clone = datatypes.get(0).clone();
            clone.setUsername(username);
            clone.setId(new ObjectId().toString());
            clone.setVersion(null);
            clone.setName(datatypes.get(0).getName());
            clone.setExt(elm.getExt());
            ActiveInfo active = new ActiveInfo();
            active.setStatus(ActiveStatus.ACTIVE);
            active.setStart(new Date());
            clone.setActiveInfo(active);
            clone.setDomainInfo(elm.getDomainInfo());
            clone.getDomainInfo().setCompatibilityVersion(datatypeClassificationService.findCompatibility(clone.getName(), clone.getDomainInfo().getVersion()));
            clone.setParentId(id);
            clone.setParentType(Type.DATATYPELIBRARY);
            clone.setDocumentInfo(new DocumentInfo(id, DocumentType.DATATYPELIBRARY));
            clone = datatypeService.save(clone);
            savedIds.add(clone.getId());
          }else {
            savedIds.add(elm.getOriginalId());
          }
        } else {
          throw new DatatypeNotFoundException(elm.getName(), elm.getDomainInfo().getVersion(),
              Scope.HL7STANDARD.toString().toString());
        }
      }
    }
    dataypeLibraryService.addDatatypes(savedIds, empty);

    empty.setMetadata(wrapper.getMetadata());
    DatatypeLibrary lib = dataypeLibraryService.save(empty);

    return new ResponseMessage<String>(Status.SUCCESS, "", "Library created Successfuly", lib.getId(), false,
        lib.getUpdateDate(), lib.getId());

  }

  @RequestMapping(value = "/api/datatype-library/{id}/display", method = RequestMethod.GET,
      produces = {"application/json"})

  public @ResponseBody DatatypeLibraryDisplay getIgDisplay(@PathVariable("id") String id,
      Authentication authentication)
          throws DatatypeLibraryNotFoundException, DatatypeLibraryConverterException {


    DatatypeLibrary library = findLibraryById(id);
    DatatypeLibraryDisplay ret = displayConverterService.convertDomainToModel(library);
    return ret;
  }


  /**
   * 
   * @param id
   * @param authentication
   * @return
   * @throws DatatypeLibraryNotFoundException
   * @throws DatatypeLibraryUpdateException
   */
  @RequestMapping(value = "/api/datatype-library/{id}/updatetoc", method = RequestMethod.POST,
      produces = {"application/json"})

  public @ResponseBody ResponseMessage get(@PathVariable("id") String id,
      @RequestBody List<gov.nist.hit.hl7.igamt.datatypeLibrary.model.TreeNode> toc,
      Authentication authentication)
          throws DatatypeLibraryNotFoundException, DatatypeLibraryUpdateException {


    Set<TextSection> content = displayConverterService.convertTocToDomain(toc);

    UpdateResult updateResult = dataypeLibraryService.updateAttribute(id, "content", content);
    if (!updateResult.wasAcknowledged()) {
      throw new DatatypeLibraryUpdateException(id);
    }

    return new ResponseMessage(Status.SUCCESS, TABLE_OF_CONTENT_UPDATED, id, new Date());



  }

  @RequestMapping(value = "/api/datatype-library/{id}/updatemetadata", method = RequestMethod.POST,
      produces = {"application/json"})

  public @ResponseBody ResponseMessage get(@PathVariable("id") String id,
      @RequestBody DocumentMetadata metadata, Authentication authentication)
          throws DatatypeLibraryNotFoundException, DatatypeLibraryUpdateException {
    UpdateResult updateResult = dataypeLibraryService.updateAttribute(id, "metadata", metadata);
    if (!updateResult.wasAcknowledged()) {
      throw new DatatypeLibraryUpdateException("Could not update IG Metadata ");
    }
    return new ResponseMessage(Status.SUCCESS, METATDATA_UPDATED, id, new Date());
  }

  private DatatypeLibrary findLibraryById(String id) throws DatatypeLibraryNotFoundException {
    DatatypeLibrary ig = dataypeLibraryService.findById(id);
    if (ig == null) {
      throw new DatatypeLibraryNotFoundException(id);
    }
    return ig;
  }

  @RequestMapping(value = "/api/datatype-library", method = RequestMethod.GET, produces = { "application/json" })
  public @ResponseBody List<DocumentSummary> getUserIG(Authentication authentication,
      @RequestParam("type") AccessType type) throws ForbiddenOperationException {
    String username = authentication.getPrincipal().toString();
    List<DatatypeLibrary> libraries = new ArrayList<DatatypeLibrary>();

    if (type != null) {
      if (type.equals(AccessType.PUBLIC)) {

        libraries = dataypeLibraryService.findPublished();

      } else if (type.equals(AccessType.PRIVATE)) {

        libraries = dataypeLibraryService.findByUsername(username, Scope.USER);

      } else if (type.equals(AccessType.ALL)) {

        commonService.checkAuthority(authentication, "ADMIN");
        libraries = dataypeLibraryService.findAll();

      }  else {
        libraries = dataypeLibraryService.findByUsername(username, Scope.USER);
      }
      return dataypeLibraryService.convertListToDisplayList(libraries);
    } else {
      libraries = dataypeLibraryService.findByUsername(username, Scope.USER);
      return dataypeLibraryService.convertListToDisplayList(libraries);
    }
  }

  /**
   * 
   * @param authentication
   * @return
   */
  @RequestMapping(value = "/api/hl7classes", method = RequestMethod.GET,
      produces = {"application/json"})
  public @ResponseBody List<DatatypeVersionGroupDisplay> getHl7Classes(
      Authentication authentication) {
    List<DatatypeVersionGroupDisplay> allGroups = new ArrayList<DatatypeVersionGroupDisplay>();
    List<DatatypeClassification> classes = datatypeClassificationService.findAll();
    for (DatatypeClassification cl : classes) {
      for (DatatypeVersionGroup gr : cl.getClasses()) {

        DatatypeVersionGroupDisplay display = new DatatypeVersionGroupDisplay();
        display.setName(cl.getName());
        DomainInfo info = new DomainInfo();
        info.setCompatibilityVersion(gr.getVersions());
        info.setScope(Scope.HL7STANDARD);
        display.setDomainInfo(info);
        display.setPosition(gr.getPosition());
        allGroups.add(display);
      }
    }
    return allGroups;
  }


  @RequestMapping(value = "/api/datatype-library/{id}", method = RequestMethod.DELETE,
      produces = {"application/json"})
  public ResponseMessage deleteDatatypeLibrary(@PathVariable("id") String id,
      Authentication authentication)
          throws DatatypeLibraryNotFoundException, OperationNotAllowedException {

    DatatypeLibrary library = findLibraryById(id);
    if (library.getUsername().equals(authentication.getPrincipal().toString())) {
      dataypeLibraryService.delete(id);
      return new ResponseMessage(Status.SUCCESS, DATATYPE_LIBRARY_DELETED, id, new Date());
    } else {
      throw new OperationNotAllowedException("Operation Not allowed");
    }

  }

  private Set<String> gatherIds(DatatypeLibrary library) {
    Set<String> results = new HashSet<String>();
    library.getDatatypeRegistry().getChildren().forEach(link -> results.add(link.getId()));
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

  @RequestMapping(value = "/api/datatype-library/{id}/state", method = RequestMethod.GET, produces = {
  "application/json" })
  public @ResponseBody DocumentDisplayInfo getState(@PathVariable("id") String id, Authentication authentication)
      throws DatatypeLibraryNotFoundException {

    DatatypeLibrary library = dataypeLibraryService.findById(id);

    return display.covertToDisplay(library);
  }

  @RequestMapping(value = "/api/datatype-library/{id}/update/sections", method = RequestMethod.POST, produces = {
  "application/json" })

  public @ResponseBody ResponseMessage<Object> updateSections(@PathVariable("id") String id,
      @RequestBody Set<TextSection> content, Authentication authentication)
          throws Exception {
    DatatypeLibrary lib = dataypeLibraryService.findById(id);
    updateAndClean(content, lib);
    dataypeLibraryService.save(lib);
    return new ResponseMessage<Object>(Status.SUCCESS, TABLE_OF_CONTENT_UPDATED, id, new Date());
  }

  private void updateAndClean(Set<TextSection> content, DatatypeLibrary lib) throws Exception {
    lib.setContent(content);
  }
  @RequestMapping(value = "/api/datatype-library/{id}/section/{sectionId}", method = RequestMethod.GET, produces = {
  "application/json" })

  public @ResponseBody TextSection findSectionById(@PathVariable("id") String id,
      @PathVariable("sectionId") String sectionId, Authentication authentication)
          throws DatatypeLibraryNotFoundException, SectionNotFoundException {
    DatatypeLibrary lib = dataypeLibraryService.findById(id);
    if (lib != null) {
      TextSection s = dataypeLibraryService.findSectionById(lib.getContent(), sectionId);
      if (s == null) {
        throw new SectionNotFoundException("Section Not Foud");
      } else {
        return s;
      }
    } else {
      throw new DatatypeLibraryNotFoundException("Cannot found Id document");
    }
  }

  @RequestMapping(value = "/api/datatype-library/{id}/section", method = RequestMethod.POST, produces = {
  "application/json" })

  public @ResponseBody ResponseMessage<Object> updateIg(@PathVariable("id") String id, @RequestBody Section section,
      Authentication authentication) throws DatatypeLibraryNotFoundException, SectionNotFoundException {
    DatatypeLibrary lib = dataypeLibraryService.findById(id);
    if (!lib.getUsername().equals(authentication.getPrincipal().toString())) {
      return new ResponseMessage<Object>(Status.FAILED, TABLE_OF_CONTENT_UPDATED, lib.getId(), new Date());
    } else {
      TextSection libSection = dataypeLibraryService.findSectionById(lib.getContent(), section.getId());
      if (libSection == null) {
        throw new SectionNotFoundException("Section Not Foud");
      }
      libSection.setDescription(section.getDescription());
      libSection.setLabel(section.getLabel());
      this.dataypeLibraryService.save(lib);
      return new ResponseMessage<Object>(Status.SUCCESS, TABLE_OF_CONTENT_UPDATED, lib.getId(), new Date());
    }
  }

  @RequestMapping(value = "/api/datatype-library/{id}/datatypeLabels", method = RequestMethod.GET, produces = {
  "application/json" })
  public @ResponseBody Set<DatatypeLabel> getDatatypeLabels(@PathVariable("id") String id,
      Authentication authentication) throws DatatypeLibraryNotFoundException {
    DatatypeLibrary library = dataypeLibraryService.findById(id);
    Set<DatatypeLabel> result = new HashSet<DatatypeLabel>();

    for (Link link : library.getDatatypeRegistry().getChildren()) {
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

  @RequestMapping(value = "/api/datatype-library/{libId}/{type}/{elementId}/usage", method = RequestMethod.GET, produces = {
  "application/json" })
  public @ResponseBody Set<RelationShip> findUsage(@PathVariable("libId") String libId, @PathVariable("type") Type type,
      @PathVariable("elementId") String elementId, Authentication authentication) throws DatatypeLibraryNotFoundException {
    DatatypeLibrary lib = dataypeLibraryService.findById(libId);

    Set<RelationShip> relations = this.buildRelationShip(lib);
    return this.findUsage(relations, type, elementId);
  }

  private Set<RelationShip> findUsage(Set<RelationShip> relations, Type type, String elementId) {
    // TODO Auto-generated method stub
    relations.removeIf(x -> (!x.getChild().getId().equals(elementId) || !x.getChild().getType().equals(type)));
    return relations;
  }

  private Set<RelationShip> buildRelationShip(DatatypeLibrary lib) {
    // TODO Auto-generated method stub
    Set<RelationShip> ret = new HashSet<RelationShip>();
    addDatatypesRelations(lib, ret);
    return ret;

  }

  private void addDatatypesRelations(DatatypeLibrary lib , Set<RelationShip> ret) {
    List<Datatype> datatypes = datatypeService.findByIdIn(lib.getDatatypeRegistry().getLinksAsIds());
    for (Datatype dt : datatypes) {
      ret.addAll(datatypeDependencyService.collectDependencies(dt));
    }
  }


  @RequestMapping(value = "/api/datatype-library/{id}/datatypes/{datatypeId}/delete", method = RequestMethod.DELETE, produces = {
  "application/json" })
  public ResponseMessage deleteDatatype(@PathVariable("id") String id, @PathVariable("datatypeId") String datatypeId,
      Authentication authentication) throws DatatypeLibraryNotFoundException, ForbiddenOperationException {
    DatatypeLibrary library = dataypeLibraryService.findById(id);
    Link found = findLinkById(datatypeId, library.getDatatypeRegistry().getChildren());
    if (found != null) {
      library.getDatatypeRegistry().getChildren().remove(found);
    }

    Datatype datatype = datatypeService.findById(datatypeId);
    if (datatype != null) {
      if (datatype.getDomainInfo().getScope().equals(Scope.USER)) {
        datatypeService.delete(datatype);
      }else {
        datatype.setParentId(null);
        datatypeService.save(datatype);
      }
    }
    dataypeLibraryService.save(library);
    return new ResponseMessage(Status.SUCCESS, DATATYPE_DELETED, datatypeId, new Date());
  }

  @RequestMapping(value = "/api/datatype-library/{id}/datatypes/add", method = RequestMethod.POST, produces = {
  "application/json" })
  public ResponseMessage<DocumentDisplayInfo> add(@PathVariable("id") String id,
      @RequestBody AddingWrapper wrapper, Authentication authentication) throws AddingException, ForbiddenOperationException{
    String username = authentication.getPrincipal().toString();
    DatatypeLibrary library = dataypeLibraryService.findById(id);
    Set<String> savedIds = new HashSet<String>();
    for (AddingInfo elm : wrapper.getSelected()) {
      if (elm.isFlavor()) {
        Datatype datatype = datatypeService.findById(elm.getOriginalId());
        if (datatype != null) {
          Datatype clone = datatype.clone();
          clone.setId(new ObjectId().toString());
          clone.getDomainInfo().setScope(Scope.USER);
          clone.setParentId(id);
          ActiveInfo active = new ActiveInfo();
          active.setStatus(ActiveStatus.ACTIVE); 
          active.setStart(new Date());
          clone.setActiveInfo(active);
          clone.setDomainInfo(elm.getDomainInfo());
          clone.setParentType(Type.DATATYPELIBRARY);
          clone.getDomainInfo().setCompatibilityVersion(datatypeClassificationService.findCompatibility(clone.getName(), clone.getDomainInfo().getVersion()));
          clone.setUsername(username);
          clone.setName(datatype.getName());
          clone.setDocumentInfo(new DocumentInfo(id, DocumentType.DATATYPELIBRARY));
          clone.setVersion(null);
          clone.setExt(elm.getExt());
          clone = datatypeService.save(clone);

          savedIds.add(clone.getId());
        }
      } else {
        savedIds.add(elm.getId());
      }
    }
    AddDatatypeResponseObject objects = dataypeLibraryService.addDatatypes(savedIds, library);
    library = dataypeLibraryService.save(library);
    DocumentDisplayInfo info = new DocumentDisplayInfo();
    info.setIg(library);
    info.setDatatypes(display.convertDatatypes(objects.getDatatypes()));
    info.setValueSets(display.convertValueSets(objects.getValueSets()));

    return new ResponseMessage<DocumentDisplayInfo>(Status.SUCCESS, "", "Data type Added Succesfully", library.getId(), false,
        library.getUpdateDate(), info);
  }


  @RequestMapping(value = "/api/datatype-library/{id}/datatypes/{datatypeId}/clone", method = RequestMethod.POST, produces = {
  "application/json" })
  public ResponseMessage<AddResourceResponse> copyDatatype(@RequestBody CopyWrapper wrapper, @PathVariable("id") String id,
      @PathVariable("datatypeId") String datatypeId, Authentication authentication) throws CloneException, ForbiddenOperationException
  {
    DatatypeLibrary library = dataypeLibraryService.findById(id);
    String username = authentication.getPrincipal().toString();
    Datatype datatype = datatypeService.findById(datatypeId);
    if (datatype == null) {
      throw new CloneException("Cannot find datatype with id=" + datatypeId);
    }
    Datatype clone = datatype.clone();
    clone.setUsername(username);
    clone.setId(new ObjectId().toString());
    clone.setVersion(null);
    clone.setDocumentInfo(new DocumentInfo(id, DocumentType.DATATYPELIBRARY));
    clone.setExt(wrapper.getSelected().getExt());
    clone.getDomainInfo().setScope(Scope.USER);
    clone.setParentId(id);
    clone.setParentType(Type.DATATYPELIBRARY);
    clone = datatypeService.save(clone);
    library.getDatatypeRegistry().getChildren()
    .add(new Link(clone.getId(), clone.getDomainInfo(), library.getDatatypeRegistry().getChildren().size() + 1));
    library = dataypeLibraryService.save(library);
    AddResourceResponse response = new AddResourceResponse();
    response.setId(clone.getId());
    response.setReg(library.getDatatypeRegistry());
    response.setDisplay(display.convertDatatype(clone));
    return new ResponseMessage<AddResourceResponse>(Status.SUCCESS, "", "Datatype clone Success", clone.getId(), false,
        clone.getUpdateDate(), response);
  }

  @RequestMapping(value = "/api/datatypes/{scope}/{version:.+}/compatibility", method = RequestMethod.GET, produces = {
  "application/json" })
  public @ResponseBody ResponseMessage<List<Datatype>> findDatatypesWithCompatibility(@PathVariable String version,
      @PathVariable String scope, Authentication authentication) {

    List<Datatype> datatypes= datatypeService.findDisplayFormatByScopeAndVersion(scope, version);
    for(Datatype dt : datatypes) {
      dt.getDomainInfo().setCompatibilityVersion(datatypeClassificationService.findCompatibility(dt.getName(), dt.getDomainInfo().getVersion()));
    }
    return new ResponseMessage<List<Datatype>>(Status.SUCCESS, "", "", null, false, null,
        datatypes);
  }

  @RequestMapping(value = "/api/datatype-library/{id}/publicationSummary/{scope}", method = RequestMethod.GET,
      produces = {"application/json"})
  public PublicationSummary publicationSummary(@PathVariable("id") String id,@PathVariable("scope") Scope scope,
      Authentication authentication) {

    return dataypeLibraryService.getPublicationSummary(id, scope);
  }

  @RequestMapping(value = "/api/datatype-library/{id}/publish", method = RequestMethod.POST,
      produces = {"application/json"})
  public ResponseMessage<String> publish(@PathVariable("id") String id,  @RequestBody PublicationResult publicationResult,
      Authentication authentication) throws ForbiddenOperationException {

    return new ResponseMessage<String>(Status.SUCCESS, "", "Publish Library Success", id, false,
        new Date(), dataypeLibraryService.publishLibray(id, publicationResult));

  }


  @RequestMapping(value = "/api/datatype-library/{id}/deactivate-children", method = RequestMethod.POST,
      produces = {"application/json"})
  public ResponseMessage<String> decativate(@PathVariable("id") String id,  @RequestBody Set<String> elements,
      Authentication authentication) throws ForbiddenOperationException {
    this.dataypeLibraryService.deactivateChildren(id, elements);
    return new ResponseMessage<String>(Status.SUCCESS, "", "Data types decativated successfully", id, false,
        new Date(), id);

  }

  @RequestMapping(value = "/api/datatype-library/{id}/clone", method = RequestMethod.POST, produces = {
  "application/json" })
  public @ResponseBody ResponseMessage<String> copy(@PathVariable("id") String id, @RequestBody CopyInfo info,  Authentication authentication)
      throws IGNotFoundException, DatatypeLibraryNotFoundException, ForbiddenOperationException, EntityNotFound {
    String username = authentication.getPrincipal().toString();
    DatatypeLibrary clone = dataypeLibraryService.clone(id, username, info);
    return new ResponseMessage<String>(Status.SUCCESS, "", "Data type Library new version created", clone.getId(), false,
        clone.getUpdateDate(), clone.getId());
  }
  
  
  @RequestMapping(value = "/api/datatype-library/users-lib", method = RequestMethod.GET, produces = {
  "application/json" })
  public @ResponseBody List<SelectableLibary> getUserLibs(Authentication authentication)
      throws DatatypeLibraryNotFoundException {
	String username = authentication.getPrincipal().toString();

    List<DatatypeLibrary> libs = dataypeLibraryService.findByUsernameAndStatus(username, gov.nist.hit.hl7.igamt.common.base.domain.Status.LOCKED);    
    return display.covertToSelectableLibrary(libs);
  }
}
