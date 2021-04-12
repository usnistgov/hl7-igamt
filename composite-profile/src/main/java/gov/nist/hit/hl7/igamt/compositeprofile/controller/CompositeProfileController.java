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
package gov.nist.hit.hl7.igamt.compositeprofile.controller;

import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGroup;
import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;
import gov.nist.hit.hl7.igamt.common.base.service.InMemoryDomainExtensionService;
import gov.nist.hit.hl7.igamt.common.base.service.impl.DataFragment;
import gov.nist.hit.hl7.igamt.common.base.service.impl.InMemoryDomainExtensionServiceImpl;
import gov.nist.hit.hl7.igamt.common.binding.service.BindingService;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.CompositeProfileState;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.ResourceAndDisplay;
import gov.nist.hit.hl7.igamt.compositeprofile.service.impl.ConformanceProfileCompositeService;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import gov.nist.hit.hl7.igamt.common.base.service.CommonService;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.CompositeProfileStructure;
import gov.nist.hit.hl7.igamt.compositeprofile.service.CompositeProfileStructureService;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
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
  ConformanceProfileCompositeService compose;

  @Autowired
  ConformanceProfileService conformanceProfileService;

  @Autowired
  InMemoryDomainExtensionServiceImpl inMemoryDomainExtensionService;

  @Autowired
  ValuesetService valuesetService;

  @Autowired
  BindingService bindingService;

  @RequestMapping(value = "/api/composite-profile/{id}", method = RequestMethod.GET,
      produces = {"application/json"})

  public CompositeProfileStructure getCompositeProfile(@PathVariable("id") String id, Authentication authentication) {
    return compositeProfileService.findById(id);
  }

  @RequestMapping(value = "/api/composite-profile", method = RequestMethod.POST,
      produces = {"application/json"})
  public CompositeProfileStructure save(Authentication authentication, @RequestBody CompositeProfileStructure compositeProfileStructure) {
    return compositeProfileService.save(compositeProfileStructure);
  }

  @RequestMapping(value = "/api/composite-profile/compose/{id}", method = RequestMethod.GET,
          produces = {"application/json"})
  public CompositeProfileState eval(@PathVariable("id") String id, Authentication authentication) {
    DataFragment<ConformanceProfile> df = compose.create(compositeProfileService.findById(id));
    String token = this.inMemoryDomainExtensionService.put(df.getContext());
    Stream<Datatype> datatypes = df.getContext().getResources().stream().filter((r) -> r instanceof Datatype).map((r) -> (Datatype) r);
    Stream<Segment> segments = df.getContext().getResources().stream().filter((r) -> r instanceof Segment).map((r) -> (Segment) r);

    CompositeProfileState state = new CompositeProfileState();
    state.setConformanceProfile(new ResourceAndDisplay<ConformanceProfile>(this.convertConformanceProfile(df.getPayload(), 0), df.getPayload()));
    state.setDatatypes(datatypes.map((dt) -> new ResourceAndDisplay<Datatype>(this.convertDatatype(dt), dt)).collect(Collectors.toList()));
    state.setSegments(segments.map((sg) -> new ResourceAndDisplay<Segment>(this.convertSegment(sg), sg)).collect(Collectors.toList()));

    this.inMemoryDomainExtensionService.clear(token);
    return state;
  }

  public DisplayElement convertDatatype(Datatype datatype) {

    DisplayElement displayElement= new DisplayElement();
    displayElement.setId(datatype.getId());
    displayElement.setDomainInfo(datatype.getDomainInfo());
    displayElement.setFixedName(datatype.getName());
    if(!datatype.getDomainInfo().getScope().equals(Scope.SDTF)) {
      displayElement.setFixedName(datatype.getName());
      if(datatype.getFixedExtension() !=null && !datatype.getFixedExtension().isEmpty()) {
        displayElement.setFixedName(datatype.getName() + "_"+ datatype.getFixedExtension());
      }
      displayElement.setVariableName(datatype.getExt());
    }else {
      displayElement.setFixedName(datatype.getLabel());
    }
    displayElement.setDescription(datatype.getDescription());
    displayElement.setDifferantial(datatype.getOrigin() !=null);
    displayElement.setActiveInfo(datatype.getActiveInfo());
    displayElement.setLeaf(!(datatype instanceof ComplexDatatype));
    displayElement.setType(Type.DATATYPE);
    displayElement.setOrigin(datatype.getOrigin());
    displayElement.setParentId(datatype.getParentId());
    displayElement.setParentType(datatype.getParentType());
    return displayElement;
  }


  public DisplayElement convertConformanceProfile(ConformanceProfile conformanceProfile, int position) {
    DisplayElement displayElement= new DisplayElement();
    displayElement.setId(conformanceProfile.getId());
    displayElement.setDomainInfo(conformanceProfile.getDomainInfo());
    displayElement.setDescription(conformanceProfile.getDescription());
    displayElement.setDifferantial(conformanceProfile.getOrigin() !=null);
    displayElement.setLeaf(false);
    displayElement.setPosition(position);
    displayElement.setVariableName(conformanceProfile.getName());
    displayElement.setType(Type.CONFORMANCEPROFILE);
    displayElement.setOrigin(conformanceProfile.getOrigin());
    displayElement.setParentId(conformanceProfile.getParentId());
    displayElement.setParentType(conformanceProfile.getParentType());
    return displayElement;

  }

  public DisplayElement convertSegment(Segment segment) {
    DisplayElement displayElement= new DisplayElement();
    displayElement.setId(segment.getId());
    displayElement.setDomainInfo(segment.getDomainInfo());
    displayElement.setDescription(segment.getDescription());
    displayElement.setFixedName(segment.getName());
    displayElement.setDifferantial(segment.getOrigin() !=null);
    displayElement.setLeaf(false);
    displayElement.setVariableName(segment.getExt());
    displayElement.setType(Type.SEGMENT);
    displayElement.setOrigin(segment.getOrigin());
    displayElement.setParentId(segment.getParentId());
    displayElement.setParentType(segment.getParentType());
    displayElement.setStatus(segment.getStatus());
    return displayElement;
  }

  public DisplayElement convertValueSet(Valueset valueset) {
    DisplayElement displayElement= new DisplayElement();
    displayElement.setId(valueset.getId());
    displayElement.setDomainInfo(valueset.getDomainInfo());
    displayElement.setDescription(valueset.getName());
    displayElement.setDifferantial(valueset.getOrigin() !=null);
    displayElement.setLeaf(false);
    displayElement.setVariableName(valueset.getBindingIdentifier());
    displayElement.setType(Type.VALUESET);
    displayElement.setOrigin(valueset.getOrigin());
    displayElement.setFlavor(valueset.isFlavor());
    displayElement.setParentId(valueset.getParentId());
    displayElement.setParentType(valueset.getParentType());
    return displayElement;
  }


}
