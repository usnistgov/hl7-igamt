package gov.nist.hit.hl7.igamt.ig.controller;

import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import gov.nist.hit.hl7.igamt.common.base.controller.BaseController;
import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.service.impl.DataFragment;
import gov.nist.hit.hl7.igamt.common.base.service.impl.InMemoryDomainExtensionServiceImpl;
import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.CompositeProfileState;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.ProfileComponentsEvaluationResult;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.ResourceAndDisplay;
import gov.nist.hit.hl7.igamt.compositeprofile.service.CompositeProfileStructureService;
import gov.nist.hit.hl7.igamt.compositeprofile.service.impl.ConformanceProfileCompositeService;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.Group;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRef;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRefOrGroup;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.registry.ConformanceProfileRegistry;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Component;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.registry.DatatypeRegistry;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.ig.controller.wrappers.ReqId;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.IgDataModel;
import gov.nist.hit.hl7.igamt.ig.exceptions.IGNotFoundException;
import gov.nist.hit.hl7.igamt.ig.model.GVTDomain;
import gov.nist.hit.hl7.igamt.ig.service.GVTService;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.segment.domain.Field;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.domain.registry.SegmentRegistry;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.service.impl.exception.GVTExportException;
import gov.nist.hit.hl7.igamt.service.impl.exception.GVTLoginException;
import gov.nist.hit.hl7.igamt.valueset.domain.registry.ValueSetRegistry;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;

@RestController
public class GVTConnectController extends BaseController {

  Logger log = LoggerFactory.getLogger(GVTConnectController.class);


  @Autowired
  private GVTService gvtService;
  
  @Autowired
  ConformanceProfileService conformanceProfileService;

  @Autowired
  DatatypeService datatypeService;

  @Autowired
  SegmentService segmentService;

  @Autowired
  ValuesetService valuesetService;

  
  @Autowired
  IgService igService;
  
  @Autowired
  CompositeProfileStructureService compositeProfileService;
  
  @Autowired
  InMemoryDomainExtensionServiceImpl inMemoryDomainExtensionService;
  
  @Autowired
  ConformanceProfileCompositeService compose;


private String token;


  @RequestMapping(value = "/api/testing/login", method = RequestMethod.GET, produces = {"application/json"})
  public boolean validCredentials(@RequestHeader("target-auth") String authorization, @RequestHeader("target-url") String host) throws GVTLoginException {
    log.info("Logging to " + host);
    try {
      // SSLHL7v2ResourceClient client = new SSLHL7v2ResourceClient(host, authorization);
      return gvtService.validCredentials(authorization, host);
    } catch (Exception e) {
      throw new GVTLoginException(e.getMessage());
    }
  }
  
  


  @RequestMapping(value = "/api/testing/domains", method = RequestMethod.GET, produces = {"application/json"})
  public List<GVTDomain> getDomains(@RequestHeader("target-url") String url, @RequestHeader("target-auth") String authorization) throws GVTLoginException {
    return gvtService.getDomains(authorization, url);
  }

  @RequestMapping(value = "/api/testing/createDomain", method = RequestMethod.POST, produces = "application/json")
  public ResponseEntity<?> createDomain(@RequestHeader("target-auth") String authorization, @RequestHeader("target-url") String url, @RequestBody HashMap<String, String> params, HttpServletRequest request, HttpServletResponse response) throws GVTExportException {
    try {
      log.info("Creating domain with name " + params.get("name") + ", key=" + params.get("key") + ",url=" + url);
      return gvtService.createDomain(authorization, url, params.get("key"), params.get("name"), params.get("homeTitle"));
    } catch (Exception e) {
      throw new GVTExportException(e);
    }
  }

  @RequestMapping(value = "/api/testing/{id}/push/{domain}", method = RequestMethod.POST, produces = "application/json")
  public Map<String, Object> exportToGVT(
      @PathVariable("id") String id,
      @RequestBody ReqId reqIds, 
      @PathVariable("domain") String domain,
      @RequestHeader("target-auth") String authorization,
      @RequestHeader("target-url") String url, 
      HttpServletRequest request, HttpServletResponse response) throws GVTExportException {
    try {
      log.info("Exporting messages to GVT from IG Document with id=" + id);

      Ig ig = findIgById(id);

  	  if (ig != null)  {
  		  CompositeProfileState cps = null;
  		  Ig selectedIg = this.makeSelectedIg(ig, reqIds, cps);
  		  IgDataModel igModel = this.igService.generateDataModel(selectedIg);	
  	      InputStream content = this.igService.exportValidationXMLByZip(igModel, reqIds.getConformanceProfilesId(), reqIds.getCompositeProfilesId());
  	      ResponseEntity<?> rsp = gvtService.send(content, authorization, url, domain);
  	      Map<String, Object> res = (Map<String, Object>) rsp.getBody();
  	      this.inMemoryDomainExtensionService.clear(this.token);
  	      return res;
  	  }
      return null;
    } catch (Exception e) {
      throw new GVTExportException(e);
    }
  }
  
  /*
   ObjectMapper mapper = new ObjectMapper();
    mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    ReqId reqIds = mapper.readValue(formData.getJson(), ReqId.class);
    Ig ig = findIgById(id);
    if (ig != null)  {
      CompositeProfileState cps = null;
      Ig selectedIg = this.makeSelectedIg(ig, reqIds, cps);
      IgDataModel igModel = this.igService.generateDataModel(selectedIg, this.inMemoryDomainExtensionService);	
      InputStream content = this.igService.exportValidationXMLByZip(igModel, reqIds.getConformanceProfilesId(), reqIds.getCompositeProfilesId());
      response.setContentType("application/zip");
      response.setHeader("Content-disposition", "attachment;filename=" + this.updateFileName(igModel.getModel().getMetadata().getTitle()) + "-" + id + "_" + new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date()) + ".zip");
      FileCopyUtils.copy(content, response.getOutputStream());
      this.inMemoryDomainExtensionService.clear(this.token);
    }
   */
  
  private Ig findIgById(String id) throws IGNotFoundException {
    Ig ig = igService.findById(id);
    if (ig == null) {
      throw new IGNotFoundException(id);
    }
    return ig;
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
}
