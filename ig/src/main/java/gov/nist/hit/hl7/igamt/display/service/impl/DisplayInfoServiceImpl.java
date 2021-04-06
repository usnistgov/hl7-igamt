package gov.nist.hit.hl7.igamt.display.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import gov.nist.hit.hl7.igamt.coconstraints.exception.CoConstraintGroupNotFoundException;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGroup;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGroupRegistry;
import gov.nist.hit.hl7.igamt.coconstraints.service.impl.SimpleCoConstraintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.CompositeProfileStructure;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.registry.CompositeProfileRegistry;
import gov.nist.hit.hl7.igamt.compositeprofile.service.CompositeProfileStructureService;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.registry.ConformanceProfileRegistry;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.registry.DatatypeRegistry;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.display.model.IGDisplayInfo;
import gov.nist.hit.hl7.igamt.display.service.DisplayInfoService;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponent;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponentContext;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.registry.ProfileComponentRegistry;
import gov.nist.hit.hl7.igamt.profilecomponent.service.ProfileComponentService;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.domain.registry.SegmentRegistry;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.domain.registry.ValueSetRegistry;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;

@Service
public class DisplayInfoServiceImpl implements DisplayInfoService {

  @Autowired
  ConformanceProfileService conformanceProfileService;

  @Autowired
  ProfileComponentService profileComponentService;

  @Autowired
  DatatypeService datatypeService;

  @Autowired
  SegmentService segmentService;

  @Autowired
  ValuesetService valuesetService;

  @Autowired
  SimpleCoConstraintService coConstraintService;
  
  @Autowired
  CompositeProfileStructureService compositeProfileService;

  @Override
  public IGDisplayInfo covertIgToDisplay(Ig ig) {
    IGDisplayInfo ret = new IGDisplayInfo();
    ret.setIg(ig);
    ret.setMessages(convertConformanceProfileRegistry(ig.getConformanceProfileRegistry()));
    ret.setSegments(convertSegmentRegistry(ig.getSegmentRegistry()));
    ret.setDatatypes(convertDatatypeRegistry(ig.getDatatypeRegistry()));
    ret.setValueSets(convertValueSetRegistry(ig.getValueSetRegistry()));
    ret.setCoConstraintGroups(convertCoConstraintGroupRegistry(ig.getCoConstraintGroupRegistry()));
    ret.setProfileComponents(convertPofileComponentRegistry(ig.getProfileComponentRegistry()));
    ret.setCompositeProfiles(convertCompositeProfileRegistry(ig.getCompositeProfileRegistry()));
    return ret;
  }

  /**
   * @param compositeProfileRegistry
   * @return
   */
  @Override
  public Set<DisplayElement> convertCompositeProfileRegistry(
      CompositeProfileRegistry registry) {
    Set<String> ids= this.gatherIds(registry.getChildren());
    Set<DisplayElement> ret = new HashSet<DisplayElement>();
    Map<String, Integer> positionMap= this.gatherIdsAndPositions(registry.getChildren());
    List<CompositeProfileStructure> cps = compositeProfileService.findByIdIn(positionMap.keySet());
    for(CompositeProfileStructure cp: cps) {
      ret.add(convertCompositeProfile(cp, positionMap.get(cp.getId())));
    }
    return ret;
  }

  /**
   * @param profileComponentRegistry
   * @return
   */
  private Set<DisplayElement> convertPofileComponentRegistry(
      ProfileComponentRegistry registry) {
    // TODO Auto-generated method stub
    Map<String, Integer> positionMap= this.gatherIdsAndPositions(registry.getChildren());
    Set<DisplayElement> ret = new HashSet<DisplayElement>();
    List<ProfileComponent> pcs = profileComponentService.findByIdIn(positionMap.keySet());
    for(ProfileComponent pc: pcs ) {
      ret.add(convertProfileComponent(pc, positionMap.get(pc.getId())));
    }
    return ret;
  }


  @Override
  public Set<DisplayElement> convertDatatypeRegistry(DatatypeRegistry registry) {
    Set<String> ids= this.gatherIds(registry.getChildren());
    List<Datatype> datatypes= datatypeService.findByIdIn(ids);
    Set<DisplayElement> ret = new HashSet<DisplayElement>();
    for(Datatype dt : datatypes) {
      ret.add(convertDatatype(dt));
    }
    return ret;
  }

  @Override
  public Set<DisplayElement> convertConformanceProfileRegistry(ConformanceProfileRegistry registry) {
    Map<String, Integer> positionMap= this.gatherIdsAndPositions(registry.getChildren());
    List<ConformanceProfile> conformanceProfiles = this.conformanceProfileService.findByIdIn(positionMap.keySet());
    Set<DisplayElement> ret = new HashSet<DisplayElement>();
    for(ConformanceProfile cf : conformanceProfiles) {
      ret.add(convertConformanceProfile(cf, positionMap.get(cf.getId())));
    }
    return ret;
  }

  @Override
  public Set<DisplayElement> convertSegmentRegistry(SegmentRegistry registry) {
    Set<String> ids= this.gatherIds(registry.getChildren());
    List<Segment> segments = this.segmentService.findByIdIn(ids);
    Set<DisplayElement> ret = new HashSet<DisplayElement>();
    for(Segment seg : segments) {
      ret.add(convertSegment(seg));
    }
    return ret;
  }

  @Override
  public Set<DisplayElement> convertValueSetRegistry(ValueSetRegistry registry) {
    Set<String> ids= this.gatherIds(registry.getChildren());
    List<Valueset> valueSets= this.valuesetService.findByIdIn(ids);
    Set<DisplayElement> ret = new HashSet<DisplayElement>();
    for(Valueset vs : valueSets) {
      ret.add(convertValueSet(vs));
    }
    return ret; 
  }

  @Override
  public Set<DisplayElement> convertCoConstraintGroupRegistry(CoConstraintGroupRegistry registry) {
    Set<String> ids= this.gatherIds(registry.getChildren());
    List<CoConstraintGroup> ccGroups = ids.stream().map((id) -> {
      try {
        return this.coConstraintService.findById(id);
      } catch (CoConstraintGroupNotFoundException e) {
        return null;
      }
    }).filter(Objects::nonNull).collect(Collectors.toList());
    Set<DisplayElement> ret = new HashSet<DisplayElement>();
    for(CoConstraintGroup ccGroup : ccGroups) {
      ret.add(convertCoConstraintGroup(ccGroup));
    }
    return ret;
  }

  @Override
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


  @Override
  public DisplayElement convertCoConstraintGroup(CoConstraintGroup group) {
    Segment base =  this.segmentService.findById(group.getBaseSegment());
    DisplayElement displayElement= new DisplayElement();
    displayElement.setId(group.getId());
    displayElement.setFixedName(base.getLabel());
    displayElement.setVariableName(group.getName());
    displayElement.setDomainInfo(base.getDomainInfo());
    displayElement.setLeaf(true);
    displayElement.setType(Type.COCONSTRAINTGROUP);
    displayElement.setOrigin(group.getOrigin());
    displayElement.setParentId(base.getParentId());
    displayElement.setParentType(base.getParentType());

    return displayElement;
  }

  @Override
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

  @Override
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

  @Override
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
  
  @Override
  public DisplayElement convertProfileComponent(ProfileComponent pc, int integer) {
    DisplayElement displayElement= new DisplayElement();
    displayElement.setId(pc.getId());
    displayElement.setDomainInfo(pc.getDomainInfo());
    displayElement.setDescription(pc.getName());
    displayElement.setLeaf(false);
    displayElement.setVariableName(pc.getName());
    displayElement.setType(Type.PROFILECOMPONENT);
    displayElement.setOrigin(pc.getOrigin());
    displayElement.setParentId(pc.getParentId());
    displayElement.setParentType(pc.getParentType());
    displayElement.setPosition(integer);
    List<DisplayElement> children = new ArrayList<DisplayElement>();
    if(pc.getChildren() !=null) {
      for(ProfileComponentContext context: pc.getChildren()) {
        children.add(convertProfileComponentContext(context));
      }
    }
    displayElement.setChildren(children);
    return displayElement;
  }

  /**
   * @param context
   * @return
   */
  private DisplayElement convertProfileComponentContext(ProfileComponentContext context) {
    DisplayElement ret = new DisplayElement();
    if(context.getLevel().equals(Type.CONFORMANCEPROFILE)) {
      ConformanceProfile cp= this.conformanceProfileService.findById(context.getSourceId());
      if(cp !=null) {
        ret = this.convertConformanceProfile(cp, context.getPosition()); // TODOO add resource not found exception
        ret.setType(Type.MESSAGECONTEXT);    
      }
    }else if (context.getLevel().equals(Type.SEGMENT)){
      Segment seg= this.segmentService.findById(context.getSourceId());
      if(seg !=null) {
        ret = this.convertSegment(seg); 
        ret.setPosition(context.getPosition());
        ret.setType(Type.SEGMENTCONTEXT);    
      }
    }
    return ret;
    
  }

  private Set<String> gatherIds(Set<Link> links) {
    Set<String> results = new HashSet<String>();
    links.forEach(link -> results.add(link.getId()));
    return results;
  }

  private Map<String, Integer> gatherIdsAndPositions(Set<Link> links) {
    Map<String, Integer> result = links.stream().collect(Collectors.toMap(Link::getId, Link::getPosition));
    return result;
  }

  @Override
  public Set<DisplayElement> convertValueSets(Set<Valueset> valueSets) {
    Set<DisplayElement> ret = new HashSet<DisplayElement>();
    for(Valueset vs : valueSets) {
      ret.add(this.convertValueSet(vs));
    }
    return ret;

  }

  @Override
  public Set<DisplayElement> convertConformanceProfiles(Set<ConformanceProfile> conformanceProfiles, ConformanceProfileRegistry registry) {
    Set<DisplayElement> ret = new HashSet<DisplayElement>();

    Map<String, Integer> positionsMap= gatherIdsAndPositions(registry.getChildren());
    for(ConformanceProfile cp : conformanceProfiles) {
      ret.add(this.convertConformanceProfile(cp, positionsMap.get(cp.getId())));
    }
    return ret;
  }

  @Override
  public Set<DisplayElement> convertDatatypes(Set<Datatype> datatypes) {
    Set<DisplayElement> ret = new HashSet<DisplayElement>();
    for(Datatype dt : datatypes ) {
      ret.add(this.convertDatatype(dt));
    }
    return ret;
  }

  @Override
  public Set<DisplayElement> convertSegments(Set<Segment> segments) {
    Set<DisplayElement> ret = new HashSet<DisplayElement>();
    for(Segment seg : segments ) {
      ret.add(this.convertSegment(seg));
    }
    return ret;
  }

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.display.service.DisplayInfoService#convertCompositeProfileRegistry(gov.nist.hit.hl7.igamt.compositeprofile.domain.registry.CompositeProfileRegistry)
   */

  @Override
  public DisplayElement convertCompositeProfile(CompositeProfileStructure compositeProfile, int position) {
    DisplayElement displayElement= new DisplayElement();
    displayElement.setId(compositeProfile.getId());
    displayElement.setDomainInfo(compositeProfile.getDomainInfo());
    displayElement.setDescription(compositeProfile.getName());
    displayElement.setPosition(position);
    displayElement.setLeaf(false);
    displayElement.setVariableName(compositeProfile.getName());
    displayElement.setType(Type.COMPOSITEPROFILE);
    displayElement.setOrigin(compositeProfile.getOrigin());
    displayElement.setParentId(compositeProfile.getParentId());
    displayElement.setParentType(compositeProfile.getParentType());
    List<DisplayElement> children = new ArrayList<DisplayElement>();
    return displayElement;
  }

}
