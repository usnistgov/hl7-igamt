package gov.nist.hit.hl7.igamt.web.app.ig;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.servlet.http.HttpServletResponse;

import gov.nist.hit.hl7.igamt.access.active.NotifySave;
import gov.nist.hit.hl7.igamt.access.model.AccessLevel;
import gov.nist.hit.hl7.igamt.access.model.AccessToken;
import gov.nist.hit.hl7.igamt.access.model.DocumentAccessInfo;
import gov.nist.hit.hl7.igamt.access.security.AccessControlService;
import gov.nist.hit.hl7.igamt.display.model.*;
import gov.nist.hit.hl7.igamt.ig.domain.verification.IgVerificationIssuesList;
import gov.nist.hit.hl7.igamt.ig.model.*;
import gov.nist.hit.hl7.igamt.web.app.model.IgSubSet;
import gov.nist.hit.hl7.igamt.web.app.service.LegacyIgSubSetService;
import gov.nist.hit.hl7.igamt.web.app.service.impl.EntityBrowserService;
import gov.nist.hit.hl7.igamt.workspace.service.WorkspaceDocumentManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
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

import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGroup;
import gov.nist.hit.hl7.igamt.coconstraints.service.impl.SimpleCoConstraintService;
import gov.nist.hit.hl7.igamt.common.base.controller.BaseController;
import gov.nist.hit.hl7.igamt.common.base.domain.AccessType;
import gov.nist.hit.hl7.igamt.common.base.domain.DocumentConfig;
import gov.nist.hit.hl7.igamt.common.base.domain.DocumentInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.DocumentType;
import gov.nist.hit.hl7.igamt.common.base.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.Registry;
import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.Section;
import gov.nist.hit.hl7.igamt.common.base.domain.SharePermission;
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
import gov.nist.hit.hl7.igamt.common.base.wrappers.AddingWrapper;
import gov.nist.hit.hl7.igamt.common.base.wrappers.CopyWrapper;
import gov.nist.hit.hl7.igamt.common.base.wrappers.CreationWrapper;
import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.igamt.common.exception.EntityNotFound;
import gov.nist.hit.hl7.igamt.common.slicing.domain.ConditionalSlicing;
import gov.nist.hit.hl7.igamt.common.slicing.domain.OrderedSlicing;
import gov.nist.hit.hl7.igamt.common.slicing.domain.Slicing;
import gov.nist.hit.hl7.igamt.common.slicing.domain.SlicingMethod;
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
import gov.nist.hit.hl7.igamt.ig.repository.IgTemplateRepository;
import gov.nist.hit.hl7.igamt.ig.service.AddService;
import gov.nist.hit.hl7.igamt.ig.service.CloneService;
import gov.nist.hit.hl7.igamt.ig.service.CoConstraintSerializationHelper;
import gov.nist.hit.hl7.igamt.ig.service.CrudService;
import gov.nist.hit.hl7.igamt.ig.service.DisplayConverterService;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.ig.service.ResourceManagementService;
import gov.nist.hit.hl7.igamt.ig.service.SharingService;
import gov.nist.hit.hl7.igamt.service.verification.VerificationService;
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
import gov.nist.hit.hl7.igamt.service.impl.exception.AmbiguousOBX3MappingException;
import gov.nist.hit.hl7.igamt.service.impl.exception.PathNotFoundException;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
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
	EntityBrowserService browserService;

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
	CoConstraintSerializationHelper coConstraintSerializationHelper;

	@Autowired
	CloneService cloneService;

	@Autowired
	AccessControlService accessControlService;

	@Autowired
	WorkspaceDocumentManagementService workspaceDocumentManagementService;

	@Autowired
	LegacyIgSubSetService legacyIgSubSetService;

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
	@PreAuthorize("AccessResource('IGDOCUMENT', #id, READ)")
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
	@PreAuthorize("AccessResource('IGDOCUMENT', #id, READ)")
	public IgDocumentConformanceStatement getIgDocumentConformanceStatement(@PathVariable("id") String id,
			Authentication authentication) throws IGNotFoundException {
		Ig igdoument = findIgById(id);
		return igService.convertDomainToConformanceStatement(igdoument);
	}

	@RequestMapping(value = "/api/igdocuments/{id}/conformancestatement/summary", method = RequestMethod.GET, produces = {"application/json" })
	@PreAuthorize("AccessResource('IGDOCUMENT', #id, READ)")
	public Set<ConformanceStatement> getIgDocumentConformanceStatementSummary(@PathVariable("id") String id, Authentication authentication) throws IGNotFoundException {
		Ig igdoument = findIgById(id);
		return igService.conformanceStatementsSummary(igdoument);
	}

	@RequestMapping(value = "/api/igdocuments/{type}/{id}/conformancestatement/assertion", method = RequestMethod.POST, produces = {"application/text" })
	@PreAuthorize("AccessResource(#type, #id, READ)")
	public @ResponseBody String getAssertionCS(@PathVariable("id") String id, @PathVariable("type") Type type, @RequestBody ConformanceStatement cs, Authentication authentication) throws IGNotFoundException, IGUpdateException {
		return this.serializeService.generateAssertionScript(cs, id);
	}

	@RequestMapping(value = "/api/igdocuments/{type}/{id}/predicate/assertion", method = RequestMethod.POST, produces = {"application/text" })
	@PreAuthorize("AccessResource(#type, #id, READ)")
	public @ResponseBody String getAssertionPD(@PathVariable("id") String id, @PathVariable("type") Type type, @RequestBody Predicate p, Authentication authentication)
			throws IGNotFoundException, IGUpdateException {
		return this.serializeService.generateConditionScript(p, id);
	}

	@RequestMapping(value = "/api/igdocuments/{id}/{viewScope}/datatypeFalvorOptions/{dtId}", method = RequestMethod.GET, produces = {
	"application/json" })
	@PreAuthorize("AccessResource('IGDOCUMENT', #id, READ)")
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
	@PreAuthorize("AccessResource('IGDOCUMENT', #id, READ)")
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
		List<Ig> igDocuments;

		if (type != null) {
			if (type.equals(AccessType.PUBLIC)) {

				igDocuments = igService.findByPublicAudienceAndStatusPublished();

			} else if (type.equals(AccessType.PRIVATE)) {

				igDocuments = igService.findByPrivateAudienceEditor(username);

			} else if (type.equals(AccessType.ALL)) {

				commonService.checkAuthority(authentication, "ADMIN");
				igDocuments = igService.findAllPrivateIGs();

			} else if (type.equals(AccessType.SHARED)) {

				igDocuments = igService.findByPrivateAudienceViewer(username);

			} else {
				igDocuments = igService.findByPrivateAudienceEditor(username);

			}
			return igService.convertListToDisplayList(igDocuments);
		} else {
			igDocuments = igService.findByPrivateAudienceEditor(username);
			return igService.convertListToDisplayList(igDocuments);
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
	@PreAuthorize("AccessResource('IGDOCUMENT', #id, READ)")
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
	@PreAuthorize("AccessResource('IGDOCUMENT', #id, READ)")
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
	@NotifySave(id = "#id", type = "'IGDOCUMENT'")
	@PreAuthorize("AccessResource('IGDOCUMENT', #id, WRITE) && ConcurrentSync('IGDOCUMENT', #id, ALLOW_SYNC_STRICT)")
	public @ResponseBody ResponseMessage<Object> updateIg(@PathVariable("id") String id, @RequestBody Section section,
			Authentication authentication) throws IGNotFoundException, IGUpdateException, ForbiddenOperationException {
		Ig ig = findIgById(id);
		Section igSection = this.findSectionById(ig.getContent(), section.getId());
		igSection.setDescription(section.getDescription());
		igSection.setLabel(section.getLabel());
		this.igService.save(ig);
		return new ResponseMessage<Object>(Status.SUCCESS, TABLE_OF_CONTENT_UPDATED, ig.getId(), new Date());

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
	@NotifySave(id = "#id", type = "'IGDOCUMENT'")
	@PreAuthorize("AccessResource('IGDOCUMENT', #id, WRITE) && ConcurrentSync('IGDOCUMENT', #id, ALLOW_SYNC_STRICT)")
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
	@NotifySave(id = "#id", type = "'IGDOCUMENT'")
	@PreAuthorize("AccessResource('IGDOCUMENT', #id, WRITE) && ConcurrentSync('IGDOCUMENT', #id, ALLOW_SYNC_STRICT)")
	public @ResponseBody ResponseMessage<Object> updateSections(@PathVariable("id") String id,
			@RequestBody Set<TextSection> content, Authentication authentication)
					throws Exception {
		Ig ig = this.findIgById(id);
		//    commonService.checkRight(authentication, ig.getCurrentAuthor(), ig.getUsername());
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
			for(TextSection profileChild : profile.getChildren() ){
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
	@NotifySave(id = "#id", type = "'IGDOCUMENT'")
	@PreAuthorize("AccessResource('IGDOCUMENT', #id, WRITE) && ConcurrentSync('IGDOCUMENT', #id, ALLOW_SYNC_STRICT)")
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
		ig.getMetadata().setCustomAttributes(metadata.getCustomAttributes());
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
		Ig ig = createIg(wrapper, authentication.getName());
		return new ResponseMessage<String>(Status.SUCCESS, "", "IG created Successfully", ig.getId(), false,
				ig.getUpdateDate(), ig.getId());
	}

	private Ig createIg(CreationWrapper wrapper, String username) throws Exception {
		if(wrapper.getWorkspace() == null) {
			return this.igService.createIg(wrapper, username);
		} else {
			return this.workspaceDocumentManagementService.createIgAndMoveToWorkspaceLocation(wrapper, username);
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
	@PreAuthorize("AccessResource('IGDOCUMENT', #id, READ)")
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
	 * @param elementId
	 * @param authentication
	 * @return
	 * @return
	 * @throws IGNotFoundException
	 */
	@RequestMapping(value = "/api/igdocuments/{igId}/{type}/{elementId}/usage", method = RequestMethod.GET, produces = {
	"application/json" })
	@PreAuthorize("AccessResource('IGDOCUMENT', #igId, READ)")
	public @ResponseBody Set<RelationShip> findUsage(@PathVariable("igId") String igId, @PathVariable("type") Type type,
			@PathVariable("elementId") String elementId, Authentication authentication) throws IGNotFoundException {
		Ig ig = findIgById(igId);

		Set<RelationShip> relations = igService.buildRelationShip(ig, type);
		return igService.findUsage(relations, type, elementId);
	}


	@RequestMapping(value = "/api/igdocuments/{id}/datatypes/{datatypeId}/delete", method = RequestMethod.DELETE, produces = {
	"application/json" })
	@NotifySave(id = "#id", type = "'IGDOCUMENT'")
	@PreAuthorize("AccessResource('IGDOCUMENT', #id, WRITE) && ConcurrentSync('IGDOCUMENT', #id, ALLOW_SYNC_STRICT)")
	public ResponseMessage deleteDatatype(@PathVariable("id") String id, @PathVariable("datatypeId") String datatypeId,
			Authentication authentication) throws IGNotFoundException, XReferenceFoundException, XReferenceException, ForbiddenOperationException {
		Ig ig = findIgById(id);
		//    commonService.checkRight(authentication, ig.getCurrentAuthor(), ig.getUsername());

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
	@NotifySave(id = "#id", type = "'IGDOCUMENT'")
	@PreAuthorize("AccessResource('IGDOCUMENT', #id, WRITE) && ConcurrentSync('IGDOCUMENT', #id, ALLOW_SYNC_STRICT)")
	public ResponseMessage deleteSegment(@PathVariable("id") String id, @PathVariable("segmentId") String segmentId,
			Authentication authentication) throws IGNotFoundException, XReferenceFoundException, XReferenceException, ForbiddenOperationException {
		Ig ig = findIgById(id);
		//    commonService.checkRight(authentication, ig.getCurrentAuthor(), ig.getUsername());

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
	 * @throws ForbiddenOperationException 
	 */
	@RequestMapping(value = "/api/igdocuments/{id}/valuesets/{valuesetId}/delete", method = RequestMethod.DELETE, produces = {
	"application/json" })
	@NotifySave(id = "#id", type = "'IGDOCUMENT'")
	@PreAuthorize("AccessResource('IGDOCUMENT', #id, WRITE) && ConcurrentSync('IGDOCUMENT', #id, ALLOW_SYNC_STRICT)")
	public ResponseMessage deleteValueSet(@PathVariable("id") String id, @PathVariable("valuesetId") String valuesetId,
			Authentication authentication) throws IGNotFoundException, XReferenceFoundException, XReferenceException, ForbiddenOperationException {

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
	@NotifySave(id = "#id", type = "'IGDOCUMENT'")
	@PreAuthorize("AccessResource('IGDOCUMENT', #id, WRITE) && ConcurrentSync('IGDOCUMENT', #id, ALLOW_SYNC_STRICT)")
	public ResponseMessage deleteConformanceProfile(@PathVariable("id") String id,
			@PathVariable("conformanceprofileId") String conformanceProfileId, Authentication authentication)
					throws IGNotFoundException, XReferenceFoundException, XReferenceException, ForbiddenOperationException {

		Ig ig = findIgById(id);
		//    commonService.checkRight(authentication, ig.getCurrentAuthor(), ig.getUsername());

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
	@NotifySave(id = "#id", type = "'IGDOCUMENT'")
	@PreAuthorize("AccessResource('IGDOCUMENT', #id, WRITE) && ConcurrentSync('IGDOCUMENT', #id, ALLOW_SYNC_STRICT)")
	public ResponseMessage deletProfileComponent(@PathVariable("id") String id,
			@PathVariable("pcId") String pcId, Authentication authentication)
					throws IGNotFoundException, ForbiddenOperationException {

		Ig ig = findIgById(id);
		//    commonService.checkRight(authentication, ig.getCurrentAuthor(), ig.getUsername());

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
	@NotifySave(id = "#id", type = "'IGDOCUMENT'")
	@PreAuthorize("AccessResource('IGDOCUMENT', #id, WRITE) && ConcurrentSync('IGDOCUMENT', #id, ALLOW_SYNC_STRICT)")
	public ResponseMessage deleteCompoisteProfile(@PathVariable("id") String id,
			@PathVariable("cpId") String cpId, Authentication authentication)
					throws IGNotFoundException, ForbiddenOperationException {

		Ig ig = findIgById(id);
		//    commonService.checkRight(authentication, ig.getCurrentAuthor(), ig.getUsername());

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
	@NotifySave(id = "#id", type = "'IGDOCUMENT'")
	@PreAuthorize("AccessResource('IGDOCUMENT', #id, WRITE) && ConcurrentSync('IGDOCUMENT', #id, ALLOW_SYNC_STRICT)")
	public DisplayElement deletProfileComponentContext(@PathVariable("id") String id,
			@PathVariable("pcId") String pcId,  @RequestBody String contextId, Authentication authentication)
					throws IGNotFoundException, ForbiddenOperationException, ProfileComponentNotFoundException {

		Ig ig = findIgById(id);
		//    commonService.checkRight(authentication, ig.getCurrentAuthor(), ig.getUsername());
		ProfileComponent pc = this.profileComponentService.deleteContextById(pcId, contextId );
		Link pcLink = ig.getProfileComponentRegistry().getLinkById(pcId);
		if(pcLink == null) {
			throw new ProfileComponentNotFoundException("Profile Component Link not found ") ;
		}
		profileComponentService.save(pc);
		return this.displayInfoService.convertProfileComponent(pc, pcLink.getPosition());

	}

	@RequestMapping(value = "/api/igdocuments/{id}/conformanceprofiles/{conformanceProfileId}/clone", method = RequestMethod.POST, produces = {"application/json"})
	@NotifySave(id = "#id", type = "'IGDOCUMENT'")
	@PreAuthorize("AccessResource('IGDOCUMENT', #id, WRITE) && ConcurrentSync('IGDOCUMENT', #id, ALLOW_SYNC_STRICT)")
	public ResponseMessage<AddResourceResponse> cloneConformanceProfile(@RequestBody CopyWrapper wrapper,
			@PathVariable("id") String id, @PathVariable("conformanceProfileId") String conformanceProfileId,
			Authentication authentication) throws CloneException, IGNotFoundException, ForbiddenOperationException, EntityNotFound {
		Ig ig = findIgById(id);
		String username = authentication.getName();

		//    commonService.checkRight(authentication, ig.getCurrentAuthor(), ig.getUsername());

		ConformanceProfile clone =  resourceManagementService.createFlavor(ig.getConformanceProfileRegistry(), username, new DocumentInfo(id, DocumentType.IGDOCUMENT), Type.CONFORMANCEPROFILE, wrapper.getSelected());
		ig = igService.save(ig);

		AddResourceResponse response = new AddResourceResponse();
		response.setId(clone.getId());
		response.setReg(ig.getConformanceProfileRegistry());
		response.setDisplay(displayInfoService.convertConformanceProfile(clone,ig.getConformanceProfileRegistry().getChildren().size()+1));

		return new ResponseMessage<AddResourceResponse>(Status.SUCCESS, "", "Conformance profile clone Success",
				clone.getId(), false, clone.getUpdateDate(), response);
	}

	//	@RequestMapping(value = "/api/igdocuments/{id}/composite-profile/{compositeProfileId}/clone", method = RequestMethod.POST, produces = {"application/json"})
	//	@NotifySave(id = "#id", type = "'IGDOCUMENT'")
	//	@PreAuthorize("AccessResource('IGDOCUMENT', #id, WRITE) && ConcurrentSync('IGDOCUMENT', #id, ALLOW_SYNC_STRICT)")
	//	public ResponseMessage<AddResourceResponse> cloneProfileComposite(@RequestBody CopyWrapper wrapper,
	//			@PathVariable("id") String id, @PathVariable("compositeProfileId") String compositeProfileId,
	//			Authentication authentication) throws CloneException, IGNotFoundException, ForbiddenOperationException, EntityNotFound {
	//		Ig ig = findIgById(id);
	//		//    commonService.checkRight(authentication, ig.getCurrentAuthor(), ig.getUsername());
	//		String username = authentication.getName();
	//
	//		CompositeProfileStructure clone =  resourceManagementService.createFlavor(ig.getCompositeProfileRegistry(), username, new DocumentInfo(id, DocumentType.IGDOCUMENT), Type.COMPOSITEPROFILE, wrapper.getSelected());
	//		ig = igService.save(ig);
	//
	//		AddResourceResponse response = new AddResourceResponse();
	//		response.setId(clone.getId());
	//		response.setReg(ig.getConformanceProfileRegistry());
	//		response.setDisplay(displayInfoService.convertCompositeProfile(clone,ig.getConformanceProfileRegistry().getChildren().size()+1));
	//
	//		return new ResponseMessage<AddResourceResponse>(Status.SUCCESS, "", "Conformance profile clone Success",
	//				clone.getId(), false, clone.getUpdateDate(), response);
	//	}


	@RequestMapping(value = "/api/igdocuments/{id}/profile-component/{pcId}/clone", method = RequestMethod.POST, produces = {"application/json"})
	@NotifySave(id = "#id", type = "'IGDOCUMENT'")
	@PreAuthorize("AccessResource('IGDOCUMENT', #id, WRITE) && ConcurrentSync('IGDOCUMENT', #id, ALLOW_SYNC_STRICT)")
	public ResponseMessage<AddResourceResponse> cloneProfileComponent(@RequestBody CopyWrapper wrapper,
			@PathVariable("id") String id, @PathVariable("pcId") String pcId,
			Authentication authentication) throws CloneException, IGNotFoundException, ForbiddenOperationException, EntityNotFound {
		Ig ig = findIgById(id);
		//    commonService.checkRight(authentication, ig.getCurrentAuthor(), ig.getUsername());
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
	@NotifySave(id = "#id", type = "'IGDOCUMENT'")
	@PreAuthorize("AccessResource('IGDOCUMENT', #id, WRITE) && ConcurrentSync('IGDOCUMENT', #id, ALLOW_SYNC_STRICT)")
	public ResponseMessage<AddResourceResponse> cloneSegment(@RequestBody CopyWrapper wrapper, @PathVariable("id") String id,
			@PathVariable("segmentId") String segmentId, Authentication authentication)
					throws IGNotFoundException, ValidationException, CloneException, ForbiddenOperationException, EntityNotFound {
		Ig ig = findIgById(id);
		//    commonService.checkRight(authentication, ig.getCurrentAuthor(), ig.getUsername());

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
	@NotifySave(id = "#id", type = "'IGDOCUMENT'")
	@PreAuthorize("AccessResource('IGDOCUMENT', #id, WRITE) && ConcurrentSync('IGDOCUMENT', #id, ALLOW_SYNC_STRICT)")
	public ResponseMessage<AddResourceResponse> copyDatatype(@RequestBody CopyWrapper wrapper, @PathVariable("id") String id,
			@PathVariable("datatypeId") String datatypeId, Authentication authentication)
					throws IGNotFoundException, CloneException, ForbiddenOperationException, EntityNotFound {
		Ig ig = findIgById(id);
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
	@NotifySave(id = "#id", type = "'IGDOCUMENT'")
	@PreAuthorize("AccessResource('IGDOCUMENT', #id, WRITE) && ConcurrentSync('IGDOCUMENT', #id, ALLOW_SYNC_STRICT)")
	public ResponseMessage<AddResourceResponse> cloneValueSet(@RequestBody CopyWrapper wrapper, @PathVariable("id") String id,
			@PathVariable("valuesetId") String valuesetId, Authentication authentication)
					throws CloneException, IGNotFoundException, ForbiddenOperationException, EntityNotFound {
		Ig ig = findIgById(id);
		String username = authentication.getPrincipal().toString();


		Valueset clone =  resourceManagementService.createFlavor(ig.getValueSetRegistry(), username, new DocumentInfo(id, DocumentType.IGDOCUMENT), Type.VALUESET, wrapper.getSelected());

		if(ig.getValueSetRegistry().getCodesPresence() != null) {
			if(ig.getValueSetRegistry().getCodesPresence().containsKey(valuesetId)) {
				ig.getValueSetRegistry().getCodesPresence().put(clone.getId(), ig.getValueSetRegistry().getCodesPresence().get(valuesetId));
			}
		}
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
	@NotifySave(id = "#id", type = "'IGDOCUMENT'")
	@PreAuthorize("AccessResource('IGDOCUMENT', #id, WRITE) && ConcurrentSync('IGDOCUMENT', #id, ALLOW_SYNC_STRICT)")
	public ResponseMessage<IGDisplayInfo> addConforanceProfile(@PathVariable("id") String id,
			@RequestBody AddingWrapper wrapper, Authentication authentication)
					throws IGNotFoundException, AddingException, ForbiddenOperationException, EntityNotFound {
		String username = authentication.getPrincipal().toString();
		Ig ig = findIgById(id);
		AddMessageResponseObject objects = this.addService.addConformanceProfiles(ig, wrapper.getSelected(), username);
		ig = igService.save(ig);
		IGDisplayInfo info = displayInfoService.createReturn(ig, objects);


		return new ResponseMessage<IGDisplayInfo>(Status.SUCCESS, "", "Conformance profile Added Succesfully",
				ig.getId(), false, ig.getUpdateDate(), info);
	}

	@RequestMapping(value = "/api/igdocuments/{id}/segments/add", method = RequestMethod.POST, produces = {
	"application/json" })
	@NotifySave(id = "#id", type = "'IGDOCUMENT'")
	@PreAuthorize("AccessResource('IGDOCUMENT', #id, WRITE) && ConcurrentSync('IGDOCUMENT', #id, ALLOW_SYNC_STRICT)")
	public ResponseMessage<IGDisplayInfo> addSegments(@PathVariable("id") String id, @RequestBody AddingWrapper wrapper,
			Authentication authentication) throws IGNotFoundException, ValidationException, AddingException, EntityNotFound, ForbiddenOperationException {
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
	@NotifySave(id = "#id", type = "'IGDOCUMENT'")
	@PreAuthorize("AccessResource('IGDOCUMENT', #id, WRITE) && ConcurrentSync('IGDOCUMENT', #id, ALLOW_SYNC_STRICT)")
	public ResponseMessage<CreateChildResponse> createCoConstraint(
			@PathVariable("id") String id,
			@RequestBody CoConstraintGroupCreateWrapper coConstraintGroupCreateWrapper,
			Authentication authentication) throws IGNotFoundException, SegmentNotFoundException, ForbiddenOperationException {
		String username = authentication.getPrincipal().toString();
		Ig ig = findIgById(id);
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
	@NotifySave(id = "#id", type = "'IGDOCUMENT'")
	@PreAuthorize("AccessResource('IGDOCUMENT', #id, WRITE) && ConcurrentSync('IGDOCUMENT', #id, ALLOW_SYNC_STRICT)")
	public ResponseMessage deleteCoConstraintGroup(
			@PathVariable("id") String id,
			@PathVariable("ccGroupId") String ccGroupId,
			Authentication authentication) throws IGNotFoundException, ForbiddenOperationException {
		Ig ig = findIgById(id);
		//    commonService.checkRight(authentication, ig.getCurrentAuthor(), ig.getUsername());

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
	@NotifySave(id = "#id", type = "'IGDOCUMENT'")
	@PreAuthorize("AccessResource('IGDOCUMENT', #id, WRITE) && ConcurrentSync('IGDOCUMENT', #id, ALLOW_SYNC_STRICT)")
	public ResponseMessage<CreateChildResponse> createProfileComponent(
			@PathVariable("id") String id,
			@RequestBody ProfileComponentCreateWrapper profileComponentCreateWrapper,
			Authentication authentication) throws IGNotFoundException, ForbiddenOperationException {
		String username = authentication.getPrincipal().toString();
		Ig ig = findIgById(id);
		//    commonService.checkRight(authentication, ig.getCurrentAuthor(), ig.getUsername());

		ProfileComponent pc = this.igService.createProfileComponent(ig, profileComponentCreateWrapper.name , profileComponentCreateWrapper.children);
		CreateChildResponse createChildResponse = new CreateChildResponse(pc.getId(), ig.getProfileComponentRegistry(), this.displayInfoService.convertProfileComponent(pc, ig.getProfileComponentRegistry().getChildren().size() + 1));
		this.igService.save(ig);

		return new ResponseMessage<CreateChildResponse>(Status.SUCCESS, "", "Profile Component Created Successfully", ig.getId(), false,
				ig.getUpdateDate(), createChildResponse);
	}


	@RequestMapping(value = "/api/igdocuments/{id}/composite-profile/create", method = RequestMethod.POST, produces = {
	"application/json" })
	@NotifySave(id = "#id", type = "'IGDOCUMENT'")
	@PreAuthorize("AccessResource('IGDOCUMENT', #id, WRITE) && ConcurrentSync('IGDOCUMENT', #id, ALLOW_SYNC_STRICT)")
	public ResponseMessage<CreateChildResponse> createCompositeProfile(
			@PathVariable("id") String id,
			@RequestBody CompositeProfileCreationWrapper wrapper,
			Authentication authentication) throws IGNotFoundException, ForbiddenOperationException {
		String username = authentication.getPrincipal().toString();
		Ig ig = findIgById(id);
		//    commonService.checkRight(authentication, ig.getCurrentAuthor(), ig.getUsername());

		CompositeProfileStructure cp = this.igService.createCompositeProfile(ig, wrapper);
		cp.setUsername(username);
		compositeProfileService.save(cp);

		CreateChildResponse createChildResponse = new CreateChildResponse(cp.getId(), ig.getCompositeProfileRegistry(), this.displayInfoService.convertCompositeProfile(cp, ig.getProfileComponentRegistry().getChildren().size()+1));
		this.igService.save(ig);

		return new ResponseMessage<CreateChildResponse>(Status.SUCCESS, "", "Composite Profile Created Successfully", ig.getId(), false,
				ig.getUpdateDate(), createChildResponse);
	}


	@RequestMapping(value = "/api/igdocuments/{id}/profile-component/{pcId}/addChildren", method = RequestMethod.POST, produces = {
	"application/json" })
	@NotifySave(id = "#id", type = "'IGDOCUMENT'")
	@PreAuthorize("AccessResource('IGDOCUMENT', #id, WRITE) && ConcurrentSync('IGDOCUMENT', #id, ALLOW_SYNC_STRICT)")
	public ResponseMessage<CreateChildResponse> updatePcChildren(
			@PathVariable("id") String id,
			@PathVariable("pcId") String pcId,
			@RequestBody List<DisplayElement> children,
			Authentication authentication) throws IGNotFoundException, ForbiddenOperationException, ProfileComponentNotFoundException {
		Ig ig = findIgById(id);
		//    commonService.checkRight(authentication, ig.getCurrentAuthor(), ig.getUsername());
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
	@PreAuthorize("AccessResource('IGDOCUMENT', #documentId, READ)")
	public List<DisplayElement> getCoConstraintGroupForSegment(@PathVariable("id") String id,
			@PathVariable("documentId") String documentId,
			Authentication authentication) throws EntityNotFound {
		List<CoConstraintGroup> groups = this.coConstraintService.findByBaseSegmentAndDocumentIdAndUsername(id, documentId, authentication.getName());
		return groups.stream().map(this.displayInfoService::convertCoConstraintGroup).collect(Collectors.toList());
	}

	@RequestMapping(value = "/api/igdocuments/{id}/datatypes/add", method = RequestMethod.POST, produces = {
	"application/json" })
	@NotifySave(id = "#id", type = "'IGDOCUMENT'")
	@PreAuthorize("AccessResource('IGDOCUMENT', #id, WRITE) && ConcurrentSync('IGDOCUMENT', #id, ALLOW_SYNC_STRICT)")
	public ResponseMessage<IGDisplayInfo> addDatatypes(@PathVariable("id") String id,
			@RequestBody AddingWrapper wrapper, Authentication authentication)
					throws IGNotFoundException, AddingException, ForbiddenOperationException, EntityNotFound {
		String username = authentication.getPrincipal().toString();
		Ig ig = findIgById(id);
		//    commonService.checkRight(authentication, ig.getCurrentAuthor(), ig.getUsername());

		AddMessageResponseObject objects = addService.addDatatypes(ig, wrapper.getSelected(), username);
		ig = igService.save(ig);
		IGDisplayInfo info = displayInfoService.createReturn(ig, objects);

		return new ResponseMessage<IGDisplayInfo>(Status.SUCCESS, "", "Data type Added Succesfully", ig.getId(), false,
				ig.getUpdateDate(), info);
	}

	@RequestMapping(value = "/api/igdocuments/{id}/valuesets/add", method = RequestMethod.POST, produces = {
	"application/json" })
	@NotifySave(id = "#id", type = "'IGDOCUMENT'")
	@PreAuthorize("AccessResource('IGDOCUMENT', #id, WRITE) && ConcurrentSync('IGDOCUMENT', #id, ALLOW_SYNC_STRICT)")
	public ResponseMessage<IGDisplayInfo> addValueSets(@PathVariable("id") String id,
			@RequestBody AddingWrapper wrapper, Authentication authentication)
					throws IGNotFoundException, AddingException, ForbiddenOperationException, EntityNotFound {
		String username = authentication.getPrincipal().toString();
		Ig ig = findIgById(id);
		//    commonService.checkRight(authentication, ig.getCurrentAuthor(), ig.getUsername());

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
	@PreAuthorize("AccessResource('IGDOCUMENT', #id, READ)")
	public @ResponseBody ResponseMessage<String> copy(@PathVariable("id") String id, @RequestBody CopyInfo info,  Authentication authentication)
			throws IGNotFoundException, EntityNotFound, ForbiddenOperationException {
		String username = authentication.getPrincipal().toString();
		Ig ig = findIgById(id);
		Ig clone = cloneService.clone(ig, username, info);
		//Ig clone = this.igService.clone(ig, username, info);
		return new ResponseMessage<String>(Status.SUCCESS, "", "Ig Cloned Successfully", clone.getId(), false,
				clone.getUpdateDate(), clone.getId());
	}

	@RequestMapping(value = "/api/igdocuments/{id}/publish", method = RequestMethod.POST, produces = {
	"application/json" })
	@NotifySave(id = "#id", type = "'IGDOCUMENT'")
	@PreAuthorize("CanPublish() && ConcurrentSync('IGDOCUMENT', #id, ALLOW_SYNC_LENIENT)")
	public @ResponseBody ResponseMessage<String> publish(@PathVariable("id") String id, @RequestBody PublishingInfo info,  Authentication authentication)
			throws IGNotFoundException, IGUpdateException, ForbiddenOperationException {
		Ig ig = findIgById(id);

		this.igService.publishIG(ig, info);
		return new ResponseMessage<String>(Status.SUCCESS, "", "Ig published Successfully", id, false,
				new Date(), id);
	}


	@RequestMapping(value = "/api/igdocuments/{id}/lock", method = RequestMethod.POST, produces = {
	"application/json" })
	@NotifySave(id = "#id", type = "'IGDOCUMENT'")
	@PreAuthorize("AccessResource('IGDOCUMENT', #id, WRITE)")
	public @ResponseBody ResponseMessage<String> lockIg(@PathVariable("id") String id,  Authentication authentication)
			throws IGNotFoundException, IGUpdateException, ForbiddenOperationException {
		Ig ig = findIgById(id);
		//    commonService.checkRight(authentication, ig.getCurrentAuthor(), ig.getUsername());

		this.igService.lockIg(ig);
		return new ResponseMessage<String>(Status.SUCCESS, "", "Ig Locked Successfully", id, false,
				new Date(), id);
	}
	@RequestMapping(value = "/api/igdocuments/{id}/updateViewers", method = RequestMethod.POST, produces = { "application/json" })
	@PreAuthorize("AccessResource('IGDOCUMENT', #id, WRITE)")
	public @ResponseBody ResponseMessage<String> updateViewers(@PathVariable("id") String id, @RequestBody List<String> viewers, Authentication authentication) throws Exception {
		this.sharingService.updateIgViewers(id, viewers, authentication.getName());
		return new ResponseMessage<>(Status.SUCCESS, "", "Ig Shared Users Successfully Updated", id, false, new Date(), id);
	}

	@RequestMapping(value = "/api/igdocuments/{id}", method = RequestMethod.DELETE, produces = { "application/json" })
	@NotifySave(id = "#id", type = "'IGDOCUMENT'")
	@PreAuthorize("AccessResource('IGDOCUMENT', #id, WRITE) && ConcurrentSync('IGDOCUMENT', #id, ALLOW_SYNC_LENIENT)")
	public @ResponseBody ResponseMessage<String> archive(@PathVariable("id") String id, Authentication authentication)
			throws IGNotFoundException, ForbiddenOperationException {

		Ig ig = findIgById(id);
		//    commonService.checkRight(authentication, ig.getCurrentAuthor(), ig.getUsername());

		igService.delete(ig);
		return new ResponseMessage<String>(Status.SUCCESS, "", "Ig deleted Successfully", ig.getId(), false,
				ig.getUpdateDate(), ig.getId());
	}

	@RequestMapping(value = "/api/igdocuments/{id}/state", method = RequestMethod.GET, produces = {
	"application/json" })
	@PreAuthorize("AccessResource('IGDOCUMENT', #id, READ)")
	public @ResponseBody IGDisplayInfo getState(@PathVariable("id") String id, Authentication authentication)
			throws Exception {
		Ig ig = findIgById(id);
		IGDisplayInfo igDisplayInfo = displayInfoService.covertIgToDisplay(ig);
		UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = (UsernamePasswordAuthenticationToken) authentication;
		AccessToken accessToken = new AccessToken(usernamePasswordAuthenticationToken.getName(), new HashSet<>(usernamePasswordAuthenticationToken.getAuthorities()));
		Set<AccessLevel> accessLevel = this.accessControlService.checkDocumentAccessPermission(new DocumentAccessInfo(ig), accessToken);
		ig.setSharePermission(accessLevel.contains(AccessLevel.ALL) || accessLevel.contains(AccessLevel.WRITE) ? SharePermission.WRITE : SharePermission.READ);
		igDisplayInfo.setDocumentLocation(this.browserService.getDocumentLocationInformation(ig, authentication.getName()));
		return igDisplayInfo;
	}

	@RequestMapping(value = "/api/igdocuments/{id}/update-info", method = RequestMethod.GET, produces = {"application/json" })
	@PreAuthorize("AccessResource('IGDOCUMENT', #id, READ)")
	public @ResponseBody IgUpdateInfo getIgUpdateInfo(@PathVariable("id") String id) throws Exception {
		Ig ig = findIgById(id);
		return new IgUpdateInfo(ig.getUpdateDate(), this.igService.getResourceVersionSyncToken(ig.getUpdateDate()));
	}

	@RequestMapping(value = "/api/igdocuments/{id}/valueset/{vsId}", method = RequestMethod.GET, produces = {
	"application/json" })
	@PreAuthorize("AccessResource('IGDOCUMENT', #id, READ)")
	public @ResponseBody Valueset getValueSetInIG(@PathVariable("id") String id ,@PathVariable("vsId") String vsId, Authentication authentication)
			throws IGNotFoundException, ValuesetNotFoundException, ResourceNotFoundException {
		return this.igService.getValueSetInIg(id, vsId);	
	}

	@RequestMapping(value = "/api/igdocuments/{id}/valueset/{vsId}/resource", method = RequestMethod.GET, produces = {
	"application/json" })
	@PreAuthorize("AccessResource('IGDOCUMENT', #id, READ)")
	public @ResponseBody Set<Valueset> getValueSetInIGAsResource(@PathVariable("id") String id ,@PathVariable("vsId") String vsId, Authentication authentication)
			throws IGNotFoundException, ValuesetNotFoundException, ResourceNotFoundException {
		HashSet<Valueset> ret = new HashSet<Valueset>();
		Valueset vs = this.igService.getValueSetInIg(id, vsId);
		ret.add(vs);
		return ret;

	}

	@RequestMapping(value = "/api/igdocuments/{id}/filter/", method = RequestMethod.POST, produces = {
	"application/json" })
	@PreAuthorize("AccessResource('IGDOCUMENT', #id, READ)")
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

	@RequestMapping(value = "/api/igdocuments/{id}/valuesets/uploadCSVFile", method = RequestMethod.POST)
	@NotifySave(id = "#id", type = "'IGDOCUMENT'")
	@PreAuthorize("AccessResource('IGDOCUMENT', #id, WRITE) && ConcurrentSync('IGDOCUMENT', #id, ALLOW_SYNC_STRICT)")
	public ResponseMessage<AddResourceResponse> addValuesetFromCSV(@PathVariable("id") String id,
			@RequestParam("file") MultipartFile csvFile, Authentication authentication) throws ImportValueSetException, IGNotFoundException, ForbiddenOperationException {
		
		Valueset newVS = this.igService.importValuesetsFromCSV(id, csvFile);
		AddResourceResponse response = new AddResourceResponse();
		response.setId(newVS.getId());
		response.setReg(findIgById(id).getValueSetRegistry());
		response.setDisplay(displayInfoService.convertValueSet(newVS));
		return new ResponseMessage<AddResourceResponse>(Status.SUCCESS, "", "Value Set clone Success", newVS.getId(), false,
				newVS.getUpdateDate(), response);
	}

	@RequestMapping(value = "/api/igdocuments/{id}/grand", method = RequestMethod.GET, produces = {"application/json"})
	@PreAuthorize("AccessResource('IGDOCUMENT', #id, READ)")
	public @ResponseBody IgDataModel getIgGrandObject(@PathVariable("id") String id, Authentication authentication) throws Exception {
		return this.igService.generateDataModel(findIgById(id));
	}

	private String updateFileName(String str) {
		return str.replaceAll(" ", "-").replaceAll("\\*", "-").replaceAll("\"", "-").replaceAll(":", "-").replaceAll(";", "-").replaceAll("=", "-").replaceAll(",", "-");
	}

	@RequestMapping(value = "/api/export/ig/{id}/xml/validation", method = RequestMethod.POST, produces = { "application/json" }, consumes = "application/x-www-form-urlencoded; charset=UTF-8")
	@PreAuthorize("AccessResource('IGDOCUMENT', #id, READ)")
	public void exportXML(@PathVariable("id") String id, Authentication authentication, FormData formData, HttpServletResponse response) throws Exception {
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		ReqId reqIds = mapper.readValue(formData.getJson(), ReqId.class);
		Ig ig = findIgById(id);
		IgSubSet igSubSet = this.legacyIgSubSetService.makeIgSubSet(ig, reqIds);
		IgDataModel igModel = this.igService.generateDataModel(igSubSet.getSubSet());
		InputStream content = this.igService.exportValidationXMLByZip(igModel, reqIds.getConformanceProfilesId(), reqIds.getCompositeProfilesId());
		for(String token: igSubSet.getInMemoryDataTokens()) {
			this.inMemoryDomainExtensionService.clear(token);
		}
		response.setContentType("application/zip");
		response.setHeader("Content-disposition", "attachment;filename=" + this.updateFileName(igModel.getModel().getMetadata().getTitle()) + "-" + id + "_" + new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date()) + ".zip");
		FileCopyUtils.copy(content, response.getOutputStream());
	}

	@RequestMapping(value = "/api/igdocuments/{ig}/predicate/{id}", method = RequestMethod.GET, produces = {"application/json"})
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
	@PreAuthorize("AccessResource('IGDOCUMENT', #igid, READ)")
	public @ResponseBody IgVerificationIssuesList verificationIGById(@PathVariable("igid") String igid, Authentication authentication) {
		Ig ig = this.igService.findById(igid);
		if (ig != null) {
			return this.verificationService.verifyIg(ig);
		}
		return null;
	}

	@RequestMapping(value = "/api/igdocuments/igTemplates", method = RequestMethod.GET, produces = { "application/json" })
	public @ResponseBody  List<IgTemplate> igTemplates( Authentication authentication) throws Exception {
		List<IgTemplate> templates = this.igTemplateRepository.findAll();
		return templates;
	}

	@RequestMapping(value = "/api/igdocuments/{igId}/{type}/unused", method = RequestMethod.GET, produces = {
	"application/json" })
	@PreAuthorize("AccessResource('IGDOCUMENT', #igId, READ)")
	public @ResponseBody Set<String> findUnsed(@PathVariable("igId") String igId, @PathVariable("type") Type registryType,
			Authentication authentication) throws IGNotFoundException {
		Ig ig = findIgById(igId);

		return igService.findUnused(ig, registryType);
	}

	@RequestMapping(value = "/api/igdocuments/{igId}/{type}/deleteResources", method = RequestMethod.POST, produces = {
	"application/json" })
	@NotifySave(id = "#igId", type = "'IGDOCUMENT'")
	@PreAuthorize("AccessResource('IGDOCUMENT', #igId, WRITE) && ConcurrentSync('IGDOCUMENT', #igId, ALLOW_SYNC_STRICT)")
	public @ResponseBody List<String> deleteUnused(@PathVariable("igId") String igId, @PathVariable("type") Type registryType, @RequestBody List<String> ids,
			Authentication authentication) throws IGNotFoundException, EntityNotFound, ForbiddenOperationException {
		Ig ig = findIgById(igId);

		return igService.deleteUnused(ig, registryType, ids);
	}

	@RequestMapping(value = "/api/igdocuments/{igid}/preverification", method = RequestMethod.POST, produces = { "application/json" })
	@PreAuthorize("AccessResource('IGDOCUMENT', #igid, READ)")
	public @ResponseBody IgVerificationIssuesList preVerification(@PathVariable("igid") String igid, @RequestBody ReqId reqIds) throws EntityNotFound {
		Ig ig = this.igService.findById(igid);
		Set<String> selectedConformanceProfileIds = new HashSet<>(reqIds.getConformanceProfilesId() != null ? Arrays.asList(reqIds.getConformanceProfilesId()) : new ArrayList<>());
		Set<String> selectedCompositeProfileIds = new HashSet<>(reqIds.getCompositeProfilesId() != null ? Arrays.asList(reqIds.getCompositeProfilesId()) : new ArrayList<>());
		if (ig != null)  {
			IgProfileResourceSubSet subSet = this.igService.getIgProfileResourceSubSet(ig, selectedConformanceProfileIds, selectedCompositeProfileIds);
			return this.verificationService.verify(
					subSet.getCompositeProfiles(),
					subSet.getConformanceProfiles(),
					subSet.getSegments(),
					subSet.getDatatypes(),
					subSet.getValuesets(),
					null
			);
		}
		return null;
	}

	@RequestMapping(value = "/api/igdocuments/{igId}/update-config", method = RequestMethod.POST, produces = {
	"application/json" })
	@PreAuthorize("AccessResource('IGDOCUMENT', #igId, WRITE) && ConcurrentSync('IGDOCUMENT', #igId, ALLOW_SYNC_STRICT)")
	public @ResponseBody DocumentConfig deleteUnused(@PathVariable("igId") String igId, @RequestBody DocumentConfig config,
			Authentication authentication) throws IGNotFoundException, EntityNotFound, ForbiddenOperationException, IGUpdateException {
		Ig ig = findIgById(igId);

		UpdateResult updateResult =igService.updateAttribute(igId, "documentConfig", config, Ig.class, true);
		if (!updateResult.wasAcknowledged()) {
			throw new IGUpdateException("Could not Update Config for IG with id" + ig.getId());
		} 

		return config;
	}
	
	@RequestMapping(value = "/api/datatypes/{dtId}/used-children", method = RequestMethod.GET, produces = {
	"application/json" })
	public @ResponseBody List<DisplayElement> findDTChildren(@PathVariable("dtId") String dtId,
			Authentication authentication) {
		Datatype dt = this.datatypeService.findById(dtId);
		List<DisplayElement> ret = new ArrayList<DisplayElement>();
		Set<Resource> resources = this.datatypeService.getDependencies(dt);
		if(resources!= null) {
			for (Resource rs: resources) {
				if ((rs instanceof Datatype)&& rs.getDomainInfo().getScope().equals(Scope.USER)) {
				DisplayElement elm = this.displayInfoService.convertDatatype((Datatype)rs);
				ret.add(elm);
				}
			}
		}
		return ret;
	
		

	}
}
