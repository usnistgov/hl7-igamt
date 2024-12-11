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
package gov.nist.hit.hl7.igamt.web.app.resource;

import gov.nist.hit.hl7.igamt.access.active.NotifySave;
import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage.Status;
import gov.nist.hit.hl7.igamt.common.base.service.impl.DataFragment;
import gov.nist.hit.hl7.igamt.common.base.service.impl.InMemoryDomainExtensionServiceImpl;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.ChangeItemDomain;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.CompositeProfileState;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.ProfileComponentsEvaluationResult;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.ResourceAndDisplay;
import gov.nist.hit.hl7.igamt.compositeprofile.service.impl.ConformanceProfileCreationService;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileDependencyService;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.conformanceprofile.wrappers.ConformanceProfileDependencies;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.web.app.service.DateUpdateService;

import gov.nist.hit.hl7.resource.dependency.DependencyFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import gov.nist.hit.hl7.igamt.common.base.service.CommonService;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.CompositeProfileStructure;
import gov.nist.hit.hl7.igamt.compositeprofile.service.CompositeProfileStructureService;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * @author Abdelghani El Ouakili
 *
 */
@RestController
public class CompositeProfileController {
  @Autowired 
  CommonService commonService;

  @Autowired
  CompositeProfileStructureService compositeProfileService;

  @Autowired
  ConformanceProfileCreationService compose;

  @Autowired
  ConformanceProfileService conformanceProfileService;

  @Autowired
  SegmentService segmentService;

  @Autowired
  DatatypeService datatypeService;

  @Autowired
  InMemoryDomainExtensionServiceImpl inMemoryDomainExtensionService;

  @Autowired
  ConformanceProfileDependencyService conformanceProfileDependencyService;
  
  @Autowired
  DateUpdateService dateUpdateService;

  @RequestMapping(value = "/api/composite-profile/{id}", method = RequestMethod.GET, produces = {"application/json"})
  @PreAuthorize("AccessResource('COMPOSITEPROFILE', #id, READ)")
  public CompositeProfileStructure getCompositeProfile(@PathVariable("id") String id, Authentication authentication) {
    return compositeProfileService.findById(id);
  }

  @RequestMapping(value = "/api/composite-profile", method = RequestMethod.POST,
      produces = {"application/json"})
  @NotifySave(id = "#compositeProfileStructure.id", type = "'COMPOSITEPROFILE'")
  @PreAuthorize("AccessResource('COMPOSITEPROFILE', #compositeProfileStructure.id, WRITE) && ConcurrentSync('COMPOSITEPROFILE', #compositeProfileStructure.id, ALLOW_SYNC_STRICT)")
  public CompositeProfileStructure save(Authentication authentication, @RequestBody CompositeProfileStructure compositeProfileStructure) {
	dateUpdateService.updateDate(compositeProfileStructure.getDocumentInfo());
    return compositeProfileService.save(compositeProfileStructure);
  }

  @RequestMapping(value = "/api/composite-profile/{id}/compose", method = RequestMethod.GET,
          produces = {"application/json"})
  @PreAuthorize("AccessResource('COMPOSITEPROFILE', #id, READ)")
  public CompositeProfileState eval(@PathVariable("id") String id, Authentication authentication) throws Exception {
    ProfileComponentsEvaluationResult<ConformanceProfile> profileComponentsEvaluationResult = compose.create(compositeProfileService.findById(id));

    DataFragment<ConformanceProfile> df = profileComponentsEvaluationResult.getResources();
    String token = this.inMemoryDomainExtensionService.put(df.getContext());
    try {
      Stream<Datatype> datatypes = df.getContext().getResources().stream().filter((r) -> r instanceof Datatype).map((r) -> (Datatype) r);
      Stream<Segment> segments = df.getContext().getResources().stream().filter((r) -> r instanceof Segment).map((r) -> (Segment) r);

      CompositeProfileState state = new CompositeProfileState();
      state.setConformanceProfile(new ResourceAndDisplay<>(this.conformanceProfileService.convertConformanceProfile(df.getPayload(), 0), df.getPayload()));
      state.setDatatypes(datatypes.map((dt) -> new ResourceAndDisplay<>(this.datatypeService.convertDatatype(dt), dt)).collect(Collectors.toList()));
      state.setSegments(segments.map((sg) -> new ResourceAndDisplay<>(this.segmentService.convertSegment(sg), sg)).collect(Collectors.toList()));
      state.setToken(token);

      ConformanceProfileDependencies dependencies = this.conformanceProfileDependencyService.getDependencies(df.getPayload(), new DependencyFilter());
      Set<Resource> resources = new HashSet<>();
      resources.addAll(dependencies.getDatatypes().values());
      resources.addAll(dependencies.getSegments().values());
      resources.removeIf(resource -> profileComponentsEvaluationResult.getGeneratedResourceMetadataList()
                                                                      .stream()
                                                                      .anyMatch((rmd) -> rmd.getGeneratedResourceId().equals(resource.getId())));
      state.setResources(resources);
      return state;
    } finally {
      this.inMemoryDomainExtensionService.clear(token);
    }
  }
  
  
    @RequestMapping(value = "/api/composite-profile/{id}", method = RequestMethod.POST, produces = {
    "application/json" })
    @NotifySave(id = "#id", type = "'COMPOSITEPROFILE'")
    @PreAuthorize("AccessResource('COMPOSITEPROFILE', #id, WRITE) && ConcurrentSync('COMPOSITEPROFILE', #id, ALLOW_SYNC_STRICT)")
    @ResponseBody
    public ResponseMessage<?> applyChanges(@PathVariable("id") String id,
                                 @RequestBody List<ChangeItemDomain> cItems,
                                 Authentication authentication) throws Exception {
      CompositeProfileStructure cp = this.compositeProfileService.findById(id);
      commonService.checkRight(authentication, cp.getCurrentAuthor(), cp.getUsername());
      this.compositeProfileService.applyChanges(cp, cItems);
  	  dateUpdateService.updateDate(cp.getDocumentInfo());

      return new ResponseMessage(Status.SUCCESS, "Composite Profile Saved", cp.getId(), new Date());
}

}
