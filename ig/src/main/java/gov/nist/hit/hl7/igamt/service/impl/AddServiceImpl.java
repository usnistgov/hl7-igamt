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
package gov.nist.hit.hl7.igamt.service.impl;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.*;
import gov.nist.hit.hl7.igamt.valueset.domain.registry.ValueSetRegistry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.exception.ForbiddenOperationException;
import gov.nist.hit.hl7.igamt.common.base.wrappers.AddingInfo;
import gov.nist.hit.hl7.igamt.common.base.wrappers.DependencyWrapper;
import gov.nist.hit.hl7.igamt.common.exception.EntityNotFound;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.repository.MessageStructureRepository;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileDependencyService;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.conformanceprofile.wrappers.ConformanceProfileDependencies;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeDependencyService;
import gov.nist.hit.hl7.igamt.datatype.wrappers.DatatypeDependencies;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.model.AddMessageResponseObject;
import gov.nist.hit.hl7.igamt.ig.service.AddService;
import gov.nist.hit.hl7.igamt.ig.service.ResourceHelper;
import gov.nist.hit.hl7.igamt.ig.service.ResourceManagementService;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.service.SegmentDependencyService;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.segment.wrappers.SegmentDependencies;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;
import gov.nist.hit.hl7.resource.dependency.DependencyFilter;

/**
 * @author Abdelghani El Ouakili
 *
 */
@Service
public class AddServiceImpl implements AddService {
  @Autowired
  ConformanceProfileDependencyService conformanceProfileDependencyService;
  @Autowired
  SegmentDependencyService segmentDependencyService;
  @Autowired
  MessageStructureRepository messageStructureRepository;
  @Autowired
  ResourceManagementService resourceManagementService;
  @Autowired
  ConformanceProfileService conformanceProfileService;
  @Autowired
  DatatypeDependencyService datatypeDependencyService;
  @Autowired
  SegmentService segmentService;
  @Autowired
  ValuesetService valueSetService;
  @Autowired
  ResourceHelper resourceHelper;

  @Override
  public AddMessageResponseObject addConformanceProfiles(Ig ig, List<AddingInfo> added, String username) throws EntityNotFound, ForbiddenOperationException {
    HashMap<RealKey, Boolean> excluded = this.buildExistingFilter(ig);
    DependencyFilter dependencyFilter = new DependencyFilter(excluded);
    AddMessageResponseObject ret = new AddMessageResponseObject();
    for (AddingInfo addingInfo : added) {
      ConformanceProfile clone = resourceManagementService.createProfile(username, new DocumentInfo(ig.getId(), DocumentType.IGDOCUMENT), addingInfo);

      ConformanceProfileDependencies dependencies = conformanceProfileDependencyService.getDependencies(clone, dependencyFilter);
      this.conformanceProfileService.save(clone);
      Link link = this.resourceHelper.generateLink(clone, new DocumentInfo(ig.getId(), DocumentType.IGDOCUMENT), ig.getConformanceProfileRegistry().getChildren().size() + 1);
      ig.getConformanceProfileRegistry().getChildren().add(link);
      excluded.put(new RealKey(clone.getId(), Type.CONFORMANCEPROFILE), true);
      ret.getConformanceProfiles().add(clone);
      this.applyDependendencies(ig, dependencies, excluded, ret);
    }
    return ret;
  }


  @Override
  public AddMessageResponseObject addSegments(Ig ig, List<AddingInfo> added, String username) throws EntityNotFound, ForbiddenOperationException {
    HashMap<RealKey, Boolean> excluded = this.buildExistingFilter(ig);
    DependencyFilter dependencyFilter = new DependencyFilter(excluded);
    AddMessageResponseObject ret = new AddMessageResponseObject();
    for (AddingInfo addingInfo : added) {
      Segment elm = resourceManagementService.createFlavor(ig.getSegmentRegistry(), username, new DocumentInfo(ig.getId(), DocumentType.IGDOCUMENT), Type.SEGMENT, addingInfo);
      excluded.put(new RealKey(elm.getId(), Type.SEGMENT), true);
      SegmentDependencies dependencies = segmentDependencyService.getDependencies(elm, dependencyFilter);
      ret.getSegments().add(elm);
      this.applyDependendencies(ig, dependencies, excluded, ret);
    }
    return ret;
  }

  @Override
  public AddMessageResponseObject addDatatypes(Ig ig, List<AddingInfo> added, String username) throws EntityNotFound, ForbiddenOperationException {
    HashMap<RealKey, Boolean> excluded = this.buildExistingFilter(ig);
    DependencyFilter dependencyFilter = new DependencyFilter(excluded);
    AddMessageResponseObject ret = new AddMessageResponseObject();
    for (AddingInfo addingInfo : added) {
      Datatype elm = resourceManagementService.createFlavor(ig.getDatatypeRegistry(), username, new DocumentInfo(ig.getId(), DocumentType.IGDOCUMENT), Type.DATATYPE, addingInfo);
      excluded.put(new RealKey(elm.getId(), Type.DATATYPE), true);
      DatatypeDependencies dependencies = datatypeDependencyService.getDependencies(elm, dependencyFilter);
      ret.getDatatypes().add(elm);
      this.applyDependendencies(ig, dependencies, excluded, ret);
    }
    return ret;
  }


  /**
   * @param clone
   * @param ig
   * @param dependencies
   * @param excluded
   */
  private <T extends DependencyWrapper> void applyDependendencies(Ig ig,
                                                                  T dependencies, HashMap<RealKey, Boolean> excluded, AddMessageResponseObject response) {
    DocumentInfo info = new DocumentInfo(ig.getId(), DocumentType.IGDOCUMENT);

    if (dependencies instanceof DatatypeDependencies) {
      DatatypeDependencies datatypeDep = (DatatypeDependencies) dependencies;
      List<Valueset> valueSets = this.valueSetService.findByIdIn((datatypeDep.getValuesets().keySet()));
      response.getValueSets().addAll(valueSets);
      addLinks(ig.getValueSetRegistry(), valueSets, info, excluded);
      this.valueSetService.groupAddedValueSets(ig.getValueSetRegistry(), valueSets);

      response.getDatatypes().addAll(datatypeDep.getDatatypes().values());
      addLinks(ig.getDatatypeRegistry(), datatypeDep.getDatatypes().values(), info, excluded);

    }
    if (dependencies instanceof ConformanceProfileDependencies) {
      ConformanceProfileDependencies cfDep = (ConformanceProfileDependencies) dependencies;
      addLinks(ig.getSegmentRegistry(), cfDep.getSegments().values(), info, excluded);
      addLinks(ig.getCoConstraintGroupRegistry(), cfDep.getCoConstraintGroups().values(), info, excluded);
      response.getSegments().addAll(cfDep.getSegments().values());
      response.getCoConstraints().addAll(cfDep.getCoConstraintGroups().values());

    }

  }

  @SuppressWarnings("unlikely-arg-type")
  <T extends Resource> void addLinks(Registry reg, Collection<T> added, DocumentInfo info, HashMap<RealKey, Boolean> excluded) {
    for (T resource : added) {
      if (!excluded.containsKey(resource.getId())) {
        Link link = this.resourceHelper.generateLink(resource, info, reg.getChildren().size() + 1);
        reg.getChildren().add(link);
        excluded.put(new RealKey(resource.getId(), resource.getType()), true);
      }
    }
  }


  private HashMap<RealKey, Boolean> buildExistingFilter(Ig ig) {
    HashMap<RealKey, Boolean> newKeys = new HashMap<RealKey, Boolean>();
    addKeys(ig.getConformanceProfileRegistry(), Type.CONFORMANCEPROFILE, newKeys);
    addKeys(ig.getValueSetRegistry(), Type.VALUESET, newKeys);
    addKeys(ig.getDatatypeRegistry(), Type.DATATYPE, newKeys);
    addKeys(ig.getSegmentRegistry(), Type.SEGMENT, newKeys);
    addKeys(ig.getCoConstraintGroupRegistry(), Type.COCONSTRAINTGROUP, newKeys);
    addKeys(ig.getProfileComponentRegistry(), Type.PROFILECOMPONENT, newKeys);
    addKeys(ig.getCompositeProfileRegistry(), Type.COMPOSITEPROFILEREGISTRY, newKeys);
    return newKeys;
  }

  /**
   * @param conformanceProfileRegistry
   * @param conformanceprofile
   * @param newKeys
   */
  private void addKeys(Registry reg, Type type, HashMap<RealKey, Boolean> keys) {
    if (reg.getChildren() != null) {
      Set<String> ids = reg.getLinksAsIds();
      for (String id : ids) {
        RealKey key = new RealKey(id, type);
        keys.put(key, true);
      }
    }
  }

}
