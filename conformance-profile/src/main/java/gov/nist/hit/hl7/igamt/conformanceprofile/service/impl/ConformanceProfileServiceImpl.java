/**
 * 
 * This software was developed at the National Institute of Standards and Technology by employees of
 * the Federal Government in the course of their official duties. Pursuant to title 17 Section 105
 * of the United States Code this software is not subject to copyright protection and is in the
 * public domain. This is an experimental system. NIST assumes no responsibility whatsoever for its
 * use by other parties, and makes no guarantees, expressed or implied, about its quality,
 * reliability, or any other characteristic. We would appreciate acknowledgement if the software is
 * used. This software can be redistributed and/or modified freely provided that any derivative
 * works bear some notice that they are derived from it, and any modified versions bear some notice
 * that they have been modified.
 * 
 */
package gov.nist.hit.hl7.igamt.conformanceprofile.service.impl;

import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import gov.nist.hit.hl7.igamt.conformanceprofile.domain.registry.ConformanceProfileRegistry;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.base.Strings;

import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintBinding;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintBindingSegment;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintTableConditionalBinding;
import gov.nist.hit.hl7.igamt.coconstraints.service.CoConstraintService;
import gov.nist.hit.hl7.igamt.common.base.domain.Level;
import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.MsgStructElement;
import gov.nist.hit.hl7.igamt.common.base.domain.ProfileType;
import gov.nist.hit.hl7.igamt.common.base.domain.RealKey;
import gov.nist.hit.hl7.igamt.common.base.domain.Ref;
import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.Role;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.StructureElement;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.Usage;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;
import gov.nist.hit.hl7.igamt.common.base.exception.ValidationException;
import gov.nist.hit.hl7.igamt.common.base.model.SectionType;
import gov.nist.hit.hl7.igamt.common.base.util.CloneMode;
import gov.nist.hit.hl7.igamt.common.base.util.ReferenceIndentifier;
import gov.nist.hit.hl7.igamt.common.base.util.ReferenceLocation;
import gov.nist.hit.hl7.igamt.common.base.util.RelationShip;
import gov.nist.hit.hl7.igamt.common.base.util.ValidationUtil;
import gov.nist.hit.hl7.igamt.common.base.wrappers.Substitue;
import gov.nist.hit.hl7.igamt.common.binding.display.DisplayValuesetBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.Binding;
import gov.nist.hit.hl7.igamt.common.binding.domain.LocationInfo;
import gov.nist.hit.hl7.igamt.common.binding.domain.LocationType;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;
import gov.nist.hit.hl7.igamt.common.binding.service.BindingService;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.ChangeItemDomain;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.igamt.common.slicing.domain.Slicing;
import gov.nist.hit.hl7.igamt.common.slicing.service.SlicingService;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.Group;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.MessageProfileIdentifier;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRef;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRefOrGroup;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.ConformanceProfileConformanceStatement;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.ConformanceProfileDisplayModel;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.ConformanceProfileStructureDisplay;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.ConformanceProfileStructureTreeModel;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.DisplayConformanceProfileMetadata;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.GroupDisplayModel;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.GroupStructureTreeModel;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.SegmentLabel;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.SegmentRefDisplayModel;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.SegmentRefStructureTreeModel;
import gov.nist.hit.hl7.igamt.conformanceprofile.exception.ConformanceProfileValidationException;
import gov.nist.hit.hl7.igamt.conformanceprofile.repository.ConformanceProfileRepository;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatement;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatementsContainer;
import gov.nist.hit.hl7.igamt.constraints.domain.Predicate;
import gov.nist.hit.hl7.igamt.constraints.domain.ViewScope;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Component;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.display.BindingDisplay;
import gov.nist.hit.hl7.igamt.datatype.domain.display.BindingType;
import gov.nist.hit.hl7.igamt.datatype.domain.display.ComponentDisplayDataModel;
import gov.nist.hit.hl7.igamt.datatype.domain.display.ComponentStructureTreeModel;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DatatypeLabel;
import gov.nist.hit.hl7.igamt.datatype.domain.display.SubComponentDisplayDataModel;
import gov.nist.hit.hl7.igamt.datatype.domain.display.SubComponentStructureTreeModel;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.segment.domain.Field;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.domain.display.FieldDisplayDataModel;
import gov.nist.hit.hl7.igamt.segment.domain.display.FieldStructureTreeModel;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;
import gov.nist.hit.hl7.resource.change.exceptions.ApplyChangeException;
import gov.nist.hit.hl7.resource.change.service.ApplyChange;

/**
 *
 * @author Maxence Lefort on Mar 9, 2018.
 */
@Service("conformanceProfileService")
public class ConformanceProfileServiceImpl implements ConformanceProfileService {

  @Autowired
  ConformanceProfileRepository conformanceProfileRepository;

  @Autowired
  private MongoTemplate mongoTemplate;

  @Autowired
  SegmentService segmentService;

  @Autowired
  DatatypeService datatypeService;

  @Autowired
  ValuesetService valuesetService;

  @Autowired
  private BindingService bindingService;

  @Autowired
  private CoConstraintService coConstraintService;

  @Autowired
  ApplyChange applyChange;

  @Autowired
  SlicingService slicingService;

  @Override
  public ConformanceProfile create(ConformanceProfile conformanceProfile) {
    conformanceProfile.setId(new String());
    return conformanceProfileRepository.save(conformanceProfile);
  }

  @Override
  public ConformanceProfile save(ConformanceProfile conformanceProfile) {
    conformanceProfile.setUpdateDate(new Date());
    return conformanceProfileRepository.save(conformanceProfile);
  }

  @Override
  public List<ConformanceProfile> findAll() {
    return conformanceProfileRepository.findAll();
  }

  @Override
  public void delete(ConformanceProfile conformanceProfile) {
    conformanceProfileRepository.delete(conformanceProfile);
  }

  @Override
  public void delete(String key) {
    conformanceProfileRepository.deleteById(key);
  }

  @Override
  public void removeCollection() {
    conformanceProfileRepository.deleteAll();

  }

  @Override
  public List<ConformanceProfile> findByIdentifier(String identifier) {
    // TODO Auto-generated method stub
    return conformanceProfileRepository.findByIdentifier(identifier);
  }

  @Override
  public List<ConformanceProfile> findByMessageType(String messageType) {
    // TODO Auto-generated method stub
    return conformanceProfileRepository.findByMessageType(messageType);
  }

  @Override
  public List<ConformanceProfile> findByEvent(String messageType) {
    // TODO Auto-generated method stub
    return conformanceProfileRepository.findByEvent(messageType);
  }

  @Override
  public List<ConformanceProfile> findByStructID(String messageType) {
    return conformanceProfileRepository.findByStructID(messageType);
  }

  @Override
  public List<ConformanceProfile> findByDomainInfoVersion(String version) {
    // TODO Auto-generated method stub
    return conformanceProfileRepository.findByDomainInfoVersion(version);
  }

  @Override
  public List<ConformanceProfile> findByDomainInfoScope(String scope) {
    // TODO Auto-generated method stub
    return conformanceProfileRepository.findByDomainInfoScope(scope);
  }

  @Override
  public List<ConformanceProfile> findByDomainInfoScopeAndDomainInfoVersion(String scope, String verion) {
    // TODO Auto-generated method stub
    return conformanceProfileRepository.findByDomainInfoScopeAndDomainInfoVersion(scope, verion);
  }

  @Override
  public List<ConformanceProfile> findByName(String name) {
    // TODO Auto-generated method stub
    return conformanceProfileRepository.findByName(name);
  }

  @Override
  public List<ConformanceProfile> findByDomainInfoScopeAndDomainInfoVersionAndName(String scope, String version,
      String name) {
    // TODO Auto-generated method stub
    return conformanceProfileRepository.findByDomainInfoScopeAndDomainInfoVersionAndName(scope, version, name);
  }

  @Override
  public List<ConformanceProfile> findByDomainInfoVersionAndName(String version, String name) {
    // TODO Auto-generated method stub
    return conformanceProfileRepository.findByDomainInfoVersionAndName(version, name);
  }

  @Override
  public List<ConformanceProfile> findByDomainInfoScopeAndName(String scope, String name) {
    // TODO Auto-generated method stub
    return conformanceProfileRepository.findByDomainInfoScopeAndName(scope, name);
  }

  @Override
  public ConformanceProfile findById(String id) {
    ConformanceProfile conformanceProfile = conformanceProfileRepository.findOneById(id);
    return conformanceProfile;
  }


  @Override
  public ConformanceProfile findDisplayFormat(String id) {
    List<ConformanceProfile> cps = conformanceProfileRepository.findDisplayFormat(id);
    if (cps != null && !cps.isEmpty()) {
      return cps.get(0);
    }
    // TODO Auto-generated method stub
    return null;
  }

  @Override
  public ConformanceProfileConformanceStatement convertDomainToConformanceStatement(
      ConformanceProfile conformanceProfile, String documentId, boolean readOnly) {
    if (conformanceProfile != null) {
      ConformanceProfileConformanceStatement result = new ConformanceProfileConformanceStatement();
      result.complete(result, conformanceProfile, SectionType.CONFORMANCESTATEMENTS, readOnly);
      result.setIdentifier(conformanceProfile.getIdentifier());
      result.setMessageType(conformanceProfile.getMessageType());
      result.setName(conformanceProfile.getName());
      result.setStructId(conformanceProfile.getStructID());
      result.setType(Type.CONFORMANCEPROFILE);
      result.setAssociatedDTConformanceStatementMap(new HashMap<String, ConformanceStatementsContainer>());
      result.setAssociatedSEGConformanceStatementMap(new HashMap<String, ConformanceStatementsContainer>());
      result.setStructure(this.convertDomainToContextStructure(conformanceProfile,
          result.getAssociatedSEGConformanceStatementMap(), result.getAssociatedDTConformanceStatementMap())
          .getChildren());
      Set<ConformanceStatement> cfs = new HashSet<ConformanceStatement>();
      if (conformanceProfile.getBinding() != null) {
        cfs = conformanceProfile.getBinding().getConformanceStatements();
      }
      result.setConformanceStatements(cfs);
      result.setAvailableConformanceStatements(this.collectAvaliableConformanceStatements(documentId,
          conformanceProfile.getId(), conformanceProfile.getStructID()));
      result.setChangeReason(conformanceProfile.getBinding().getConformanceStatementsChangeLog());
      return result;
    }
    return null;
  }

  public Set<ConformanceStatement> collectAvaliableConformanceStatements(String documentId, String messageId,
      String structureId) {
    //    Set<ConformanceStatement> found = this.conformanceStatementRepository
    //        .findByIgDocumentIdAndStructureId(documentId, structureId);
    //    Set<ConformanceStatement> result = new HashSet<ConformanceStatement>();
    //    for (ConformanceStatement cs : found) {
    //      if (!cs.getSourceIds().contains(messageId))
    //        result.add(cs);
    //    }
    //    return result;

    return null;
  }

  private void validateMsgStructElement(MsgStructElement f) throws ValidationException {
    if (f instanceof SegmentRef) {
      validateSegmentRef((SegmentRef) f);
    } else if (f instanceof Group) {
      validateGroup((Group) f);
    } else {
      throw new ValidationException("Unknown element type " + f.getClass());
    }
  }

  private void validateSegmentRef(SegmentRef f) throws ValidationException {
    try {
      ValidationUtil.validateUsage(f.getUsage(), f.getMin());
      ValidationUtil.validateCardinality(f.getMin(), f.getMax(), f.getUsage());
      if (f.getRef() == null || StringUtils.isEmpty(f.getRef().getId())) {
        throw new ValidationException("Segment not found");
      }
      Segment s = segmentService.findById(f.getRef().getId());
      if (s == null) {
        throw new ValidationException("Segment not found");
      }
    } catch (ValidationException e) {
      throw new ValidationException(f.getPosition() + ":" + e.getMessage());
    }
  }

  private void validateGroup(Group f) throws ValidationException {
    try {
      ValidationUtil.validateUsage(f.getUsage(), f.getMin());
      ValidationUtil.validateCardinality(f.getMin(), f.getMax(), f.getUsage());
    } catch (ValidationException e) {
      throw new ValidationException(f.getPosition() + ":" + e.getMessage());
    }

    if (f.getChildren() != null && !f.getChildren().isEmpty()) {
      for (MsgStructElement child : f.getChildren()) {
        try {
          validateMsgStructElement(child);
        } catch (ValidationException e) {
          String[] message = e.getMessage().split(Pattern.quote(":"));
          throw new ValidationException(f.getPosition() + "." + message[0] + ":" + message[1]);
        }
      }
    }

  }

  @Override
  public void validate(DisplayConformanceProfileMetadata metadata) throws ConformanceProfileValidationException {
    if (!metadata.getDomainInfo().getScope().equals(Scope.HL7STANDARD)) {
      if (StringUtils.isEmpty(metadata.getName())) {
        throw new ConformanceProfileValidationException("Name is missing");
      }
      if (StringUtils.isEmpty(metadata.getIdentifier())) {
        throw new ConformanceProfileValidationException("Identifier is missing");
      }

      if (StringUtils.isEmpty(metadata.getMessageType())) {
        throw new ConformanceProfileValidationException("Message Type is missing");
      }

      if (StringUtils.isEmpty(metadata.getName())) {
        throw new ConformanceProfileValidationException("Name is missing");
      }

      if (StringUtils.isEmpty(metadata.getStructId())) {
        throw new ConformanceProfileValidationException("Message Struct ID is missing");
      }
    }
  }

  /*
   * (non-Javadoc)
   * 
   * @see
   * gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService#
   * cloneConformanceProfile(java.util.HashMap, java.util.HashMap,
   * gov.nist.hit.hl7.igamt.common.base.domain.Link, java.lang.String)
   */
  @Override
  public Link cloneConformanceProfile(String key, HashMap<RealKey, String> newKeys, Link l, String username,
      Scope scope, CloneMode cloneMode) {
    ConformanceProfile old = this.findById(l.getId());
    ConformanceProfile elm = old.clone();
    elm.setId(key);
    elm.getDomainInfo().setScope(scope);
    elm.setOrigin(l.getId());
    elm.setDerived(cloneMode.equals(CloneMode.DERIVE));
    elm.setUsername(username);
    Link newLink = new Link(elm);
    updateDependencies(elm, newKeys, cloneMode);
    this.save(elm);
    return newLink;
  }

  /**
   * @param elm
   * @param cloneMode 
   */
  private void updateDependencies(ConformanceProfile elm, HashMap<RealKey, String> newKeys, CloneMode cloneMode) {
    // TODO Auto-generated method stub

    processAndSubstitute(elm, newKeys);
    if (elm.getBinding() != null) {
      this.bindingService.substitute(elm.getBinding(), newKeys);
      if(cloneMode.equals(CloneMode.DERIVE)) {
        this.bindingService.lockConformanceStatements(elm.getBinding());
      }
    }
    if(elm.getSlicings() != null) {
      this.slicingService.updateSlicing(elm.getSlicings(), newKeys, Type.SEGMENT);
    }
    if (elm.getCoConstraintsBindings() != null) {
      for (CoConstraintBinding binding : elm.getCoConstraintsBindings()) {
        if (binding.getBindings() != null) {
          for (CoConstraintBindingSegment segBinding : binding.getBindings()) {
            // TODO Review Line Below
//            RealKey segKey = new RealKey(segBinding.getFlavorId(), Type.SEGMENT);
//            if (segBinding.getFlavorId() != null && newKeys.containsKey(segKey)) {
//              segBinding.setFlavorId(newKeys.get(segKey));
//            }
            if (segBinding.getTables() != null) {
              for (CoConstraintTableConditionalBinding ccBinding : segBinding.getTables()) {
                if (ccBinding.getValue() != null) {
                  this.coConstraintService.updateDepenedencies(ccBinding.getValue(), newKeys, true);
                }
              }
            }
          }
        }
      }
    }
  }

  private void processAndSubstitute(ConformanceProfile cp, HashMap<RealKey, String> newKeys) {
    // TODO Auto-generated method stub
    for (MsgStructElement segOrgroup : cp.getChildren()) {
      processAndSubstituteSegmentorGroup(segOrgroup, newKeys);
    }

  }

  private void processAndSubstituteSegmentorGroup(MsgStructElement segOrgroup, HashMap<RealKey, String> newKeys) {
    // TODO Auto-generated method stub
    if (segOrgroup instanceof SegmentRef) {
      SegmentRef ref = (SegmentRef) segOrgroup;
      if (ref.getRef() != null && ref.getRef().getId() != null) {
        RealKey key = new RealKey(ref.getRef().getId(), Type.SEGMENT);
        if (newKeys.containsKey(key)) {
          ref.getRef().setId(newKeys.get(key));
        }
      }
    } else if (segOrgroup instanceof Group) {
      Group g = (Group) segOrgroup;
      for (MsgStructElement child : g.getChildren()) {
        processAndSubstituteSegmentorGroup(child, newKeys);
      }
    }

  }

  /*
   * (non-Javadoc)
   * 
   * @see
   * gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService#
   * convertDomainToDisplayStructure(gov.nist.hit.hl7.igamt.conformanceprofile.
   * domain. ConformanceProfile)
   */
  @Override
  public ConformanceProfileStructureDisplay convertDomainToDisplayStructure(ConformanceProfile conformanceProfile,
      boolean readOnly) {
    HashMap<String, Valueset> valueSetsMap = new HashMap<String, Valueset>();
    HashMap<String, Datatype> datatypesMap = new HashMap<String, Datatype>();
    HashMap<String, Segment> segmentsMap = new HashMap<String, Segment>();

    System.out.println(conformanceProfile);
    ConformanceProfileStructureDisplay result = new ConformanceProfileStructureDisplay();
    result.complete(result, conformanceProfile, SectionType.STRUCTURE, readOnly);
    String label = conformanceProfile.getName();
    if (conformanceProfile.getIdentifier() != null)
      label = label + "-" + conformanceProfile.getIdentifier();
    result.setLabel(label);
    result.setConformanceStatements(conformanceProfile.getBinding().getConformanceStatements());

    if (conformanceProfile.getChildren() != null && conformanceProfile.getChildren().size() > 0) {
      for (SegmentRefOrGroup sog : conformanceProfile.getChildren()) {
        if (sog instanceof SegmentRef) {
          result.addSegment(this.createSegmentRefStructureTreeModel((SegmentRef) sog, datatypesMap,
              segmentsMap, valueSetsMap, null, null, conformanceProfile.getBinding(),
              conformanceProfile.getId()));
        } else if (sog instanceof Group) {
          result.addGroup(this.createGroupStructureTreeModel((Group) sog, datatypesMap, segmentsMap,
              valueSetsMap, null, null, conformanceProfile.getBinding(), conformanceProfile.getId()));
        }
      }
    }

    result.setType(Type.CONFORMANCEPROFILE);
    result.setName(conformanceProfile.getStructID());
    return result;
  }

  @Override
  public ConformanceProfileStructureDisplay convertDomainToDisplayStructureFromContext(
      ConformanceProfile conformanceProfile, String contextId, boolean readOnly) {
    HashMap<String, Valueset> valueSetsMap = new HashMap<String, Valueset>();
    HashMap<String, Datatype> datatypesMap = new HashMap<String, Datatype>();
    HashMap<String, Segment> segmentsMap = new HashMap<String, Segment>();

    ConformanceProfileStructureDisplay result = new ConformanceProfileStructureDisplay();
    result.complete(result, conformanceProfile, SectionType.STRUCTURE, readOnly);

    Group g = this.findGroup(conformanceProfile.getChildren(), contextId);
    String label = g.getName();
    result.setLabel(label);
    if (g.getChildren() != null && g.getChildren().size() > 0) {
      for (SegmentRefOrGroup sog : g.getChildren()) {
        if (sog instanceof SegmentRef) {
          result.addSegment(this.createSegmentRefStructureTreeModel((SegmentRef) sog, datatypesMap,
              segmentsMap, valueSetsMap, null, null, conformanceProfile.getBinding(),
              conformanceProfile.getId()));
        } else if (sog instanceof Group) {
          result.addGroup(this.createGroupStructureTreeModel((Group) sog, datatypesMap, segmentsMap,
              valueSetsMap, null, null, conformanceProfile.getBinding(), conformanceProfile.getId()));
        }
      }
    }
    result.setType(Type.GROUP);
    return result;
  }

  /**
   * @param list
   * @param contextId
   * @return
   */
  private Group findGroup(Set<SegmentRefOrGroup> list, String contextId) {
    String[] splits = contextId.split("\\-");

    for (SegmentRefOrGroup sog : list) {
      if (sog instanceof Group) {
        Group g = (Group) sog;
        if (g.getId().equals(splits[0])) {
          if (splits.length > 1)
            return findGroup(g.getChildren(), contextId.replaceAll(splits[0] + "-", ""));
          else
            return g;
        }
      }

    }
    return null;
  }

  private SegmentRefStructureTreeModel createSegmentRefStructureTreeModel(SegmentRef segmentRef,
      HashMap<String, Datatype> datatypesMap, HashMap<String, Segment> segmentsMap,
      HashMap<String, Valueset> valueSetsMap, String parentIdPath, String parentPath, Binding parentBinding,
      String conformanceProfileId) {
    SegmentRefStructureTreeModel result = new SegmentRefStructureTreeModel();
    SegmentRefDisplayModel segmentRefDisplayModel = new SegmentRefDisplayModel(segmentRef);
    if (parentIdPath == null)
      segmentRefDisplayModel.setIdPath(segmentRef.getId());
    else
      segmentRefDisplayModel.setIdPath(parentIdPath + "-" + segmentRef.getId());
    if (parentPath == null)
      segmentRefDisplayModel.setPath("" + segmentRef.getPosition());
    else
      segmentRefDisplayModel.setPath(parentPath + "-" + segmentRef.getPosition());

    StructureElementBinding childSeb = this.findStructureElementBindingByIdFromBinding(parentBinding,
        segmentRef.getId());

    if (childSeb != null) {
      segmentRefDisplayModel.setBinding(this.createBindingDisplay(childSeb, conformanceProfileId,
          ViewScope.CONFORMANCEPROFILE, 1, valueSetsMap, null));

      if (childSeb.getPredicate() != null) {
        Predicate p = childSeb.getPredicate();
        if (p.getTrueUsage() != null && p.getFalseUsage() != null) {
          segmentRefDisplayModel.setTrueUsage(p.getTrueUsage());
          segmentRefDisplayModel.setFalseUsage(p.getFalseUsage());
          segmentRefDisplayModel.setPredicate(p);
          if (p.getIdentifier() != null)
            segmentRefDisplayModel.getPredicate().setIdentifier(segmentRefDisplayModel.getIdPath());
        }
      }
    }
    segmentRefDisplayModel.setViewScope(ViewScope.CONFORMANCEPROFILE);
    Segment s = this.segmentService.findById(segmentRef.getRef().getId());

    if (s != null) {
      segmentRefDisplayModel.setSegmentLabel(this.createSegmentLabel(s));
      segmentRefDisplayModel.setName(s.getName());
      if (s.getChildren() != null && s.getChildren().size() > 0) {
        for (Field f : s.getChildren()) {
          Datatype childDt = this.findDatatype(f.getRef().getId(), datatypesMap);
          if (childDt != null) {
            FieldStructureTreeModel fieldStructureTreeModel = new FieldStructureTreeModel();
            FieldDisplayDataModel fModel = new FieldDisplayDataModel(f);
            fModel.setViewScope(ViewScope.SEGMENT);
            fModel.setIdPath(segmentRefDisplayModel.getIdPath() + "-" + f.getId());
            fModel.setPath(f.getPosition() + "");
            fModel.setDatatypeLabel(this.createDatatypeLabel(childDt));

            BindingDisplay bindingDisplayForField = null;

            StructureElementBinding childChildSeb = this
                .findStructureElementBindingByIdFromBinding(childSeb, f.getId());
            if (childChildSeb != null) {
              bindingDisplayForField = this.createBindingDisplay(childChildSeb, conformanceProfileId,
                  ViewScope.CONFORMANCEPROFILE, 1, valueSetsMap, bindingDisplayForField);
            }
            StructureElementBinding fSeb = this.findStructureElementBindingByFieldIdForSegment(s,
                f.getId());
            if (fSeb != null) {
              bindingDisplayForField = this.createBindingDisplay(fSeb, s.getId(), ViewScope.SEGMENT, 2,
                  valueSetsMap, bindingDisplayForField);
            }

            if (bindingDisplayForField != null && bindingDisplayForField.getPredicate() != null) {
              Predicate p = bindingDisplayForField.getPredicate();
              if (p.getTrueUsage() != null && p.getFalseUsage() != null) {
                fModel.setTrueUsage(p.getTrueUsage());
                fModel.setFalseUsage(p.getFalseUsage());
                fModel.setPredicate(p);
                if (p.getIdentifier() != null)
                  fModel.getPredicate().setIdentifier(f.getId());
              }
            }
            fModel.setBinding(bindingDisplayForField);

            fieldStructureTreeModel.setData(fModel);

            if (childDt instanceof ComplexDatatype) {
              ComplexDatatype fieldDatatype = (ComplexDatatype) childDt;
              if (fieldDatatype.getComponents() != null && fieldDatatype.getComponents().size() > 0) {
                for (Component c : fieldDatatype.getComponents()) {
                  Datatype childChildDt = this.findDatatype(c.getRef().getId(), datatypesMap);
                  if (childChildDt != null) {
                    ComponentStructureTreeModel componentStructureTreeModel = new ComponentStructureTreeModel();
                    ComponentDisplayDataModel cModel = new ComponentDisplayDataModel(c);
                    cModel.setViewScope(ViewScope.SEGMENT);
                    cModel.setIdPath(
                        segmentRefDisplayModel.getIdPath() + "-" + f.getId() + "-" + c.getId());
                    cModel.setPath(f.getPosition() + "-" + c.getPosition());
                    cModel.setDatatypeLabel(this.createDatatypeLabel(childChildDt));

                    BindingDisplay bindingDisplayForComponent = null;

                    StructureElementBinding childChildChildSeb = this
                        .findStructureElementBindingByIdFromBinding(childChildSeb, c.getId());
                    if (childChildChildSeb != null) {
                      bindingDisplayForComponent = this.createBindingDisplay(childChildChildSeb,
                          conformanceProfileId, ViewScope.CONFORMANCEPROFILE, 1, valueSetsMap,
                          bindingDisplayForComponent);
                    }
                    StructureElementBinding childFSeb = this
                        .findStructureElementBindingByComponentIdFromStructureElementBinding(
                            fSeb, c.getId());
                    if (childFSeb != null) {
                      bindingDisplayForComponent = this.createBindingDisplay(childFSeb, s.getId(),
                          ViewScope.SEGMENT, 2, valueSetsMap, bindingDisplayForComponent);
                    }
                    StructureElementBinding cSeb = this
                        .findStructureElementBindingByComponentIdForDatatype(childDt,
                            c.getId());
                    if (cSeb != null) {
                      bindingDisplayForComponent = this.createBindingDisplay(cSeb,
                          childDt.getId(), ViewScope.DATATYPE, 3, valueSetsMap,
                          bindingDisplayForComponent);
                    }

                    if (bindingDisplayForComponent != null
                        && bindingDisplayForComponent.getPredicate() != null) {
                      Predicate p = bindingDisplayForComponent.getPredicate();
                      if (p.getTrueUsage() != null && p.getFalseUsage() != null) {
                        cModel.setTrueUsage(p.getTrueUsage());
                        cModel.setFalseUsage(p.getFalseUsage());
                        cModel.setPredicate(p);
                        if (p.getIdentifier() != null)
                          cModel.getPredicate().setIdentifier(c.getId());
                      }
                    }
                    cModel.setBinding(bindingDisplayForComponent);

                    componentStructureTreeModel.setData(cModel);
                    if (childChildDt instanceof ComplexDatatype) {
                      ComplexDatatype componentDatatype = (ComplexDatatype) childChildDt;
                      if (componentDatatype.getComponents() != null
                          && componentDatatype.getComponents().size() > 0) {
                        for (Component sc : componentDatatype.getComponents()) {
                          Datatype childChildChildDt = this.findDatatype(sc.getRef().getId(),
                              datatypesMap);
                          if (childChildChildDt != null) {
                            SubComponentStructureTreeModel subComponentStructureTreeModel = new SubComponentStructureTreeModel();
                            SubComponentDisplayDataModel scModel = new SubComponentDisplayDataModel(
                                sc);
                            scModel.setViewScope(ViewScope.SEGMENT);

                            scModel.setIdPath(segmentRefDisplayModel.getIdPath() + "-"
                                + f.getId() + "-" + c.getId() + "-" + sc.getId());
                            scModel.setPath(f.getPosition() + "-" + c.getPosition() + "-"
                                + sc.getPosition());
                            scModel.setDatatypeLabel(
                                this.createDatatypeLabel(childChildChildDt));

                            BindingDisplay bindingDisplayForSubComponent = null;

                            StructureElementBinding childChildChildChildSeb = this
                                .findStructureElementBindingByIdFromBinding(
                                    childChildChildSeb, sc.getId());
                            if (childChildChildChildSeb != null) {
                              bindingDisplayForSubComponent = this.createBindingDisplay(
                                  childChildChildChildSeb, conformanceProfileId,
                                  ViewScope.CONFORMANCEPROFILE, 1, valueSetsMap,
                                  bindingDisplayForSubComponent);
                            }
                            StructureElementBinding childChildFSeb = this
                                .findStructureElementBindingByComponentIdFromStructureElementBinding(
                                    childFSeb, sc.getId());
                            if (childChildFSeb != null) {
                              bindingDisplayForSubComponent = this.createBindingDisplay(
                                  childChildFSeb, s.getId(), ViewScope.SEGMENT, 2,
                                  valueSetsMap, bindingDisplayForSubComponent);
                            }
                            StructureElementBinding childCSeb = this
                                .findStructureElementBindingByComponentIdFromStructureElementBinding(
                                    cSeb, sc.getId());
                            if (childCSeb != null) {
                              bindingDisplayForSubComponent = this.createBindingDisplay(
                                  childCSeb, childDt.getId(), ViewScope.DATATYPE, 3,
                                  valueSetsMap, bindingDisplayForSubComponent);
                            }
                            StructureElementBinding scSeb = this
                                .findStructureElementBindingByComponentIdForDatatype(
                                    childChildDt, sc.getId());
                            if (scSeb != null) {
                              bindingDisplayForSubComponent = this.createBindingDisplay(
                                  scSeb, childChildDt.getId(), ViewScope.DATATYPE, 4,
                                  valueSetsMap, bindingDisplayForSubComponent);
                            }

                            if (bindingDisplayForSubComponent != null
                                && bindingDisplayForSubComponent
                                .getPredicate() != null) {
                              Predicate p = bindingDisplayForSubComponent.getPredicate();
                              if (p.getTrueUsage() != null && p.getFalseUsage() != null) {
                                scModel.setTrueUsage(p.getTrueUsage());
                                scModel.setFalseUsage(p.getFalseUsage());
                                scModel.setPredicate(p);
                                if (p.getIdentifier() != null)
                                  scModel.getPredicate().setIdentifier(sc.getId());
                              }
                            }
                            scModel.setBinding(bindingDisplayForSubComponent);

                            subComponentStructureTreeModel.setData(scModel);
                            componentStructureTreeModel
                            .addSubComponent(subComponentStructureTreeModel);
                          } else {
                            // TODO need to handle exception
                          }
                        }

                      }
                    }
                    fieldStructureTreeModel.addComponent(componentStructureTreeModel);
                  } else {
                    // TODO need to handle exception
                  }
                }
              }
            }
            result.addField(fieldStructureTreeModel);
          } else {
            // TODO need to handle exception
          }

        }
      }

    }
    result.setData(segmentRefDisplayModel);
    return result;
  }

  private SegmentLabel createSegmentLabel(Segment s) {
    SegmentLabel label = new SegmentLabel();
    label.setDomainInfo(s.getDomainInfo());
    label.setExt(s.getExt());
    label.setId(s.getId());
    label.setLabel(s.getLabel());
    label.setName(s.getName());
    return label;
  }

  private GroupStructureTreeModel createGroupStructureTreeModel(Group group, HashMap<String, Datatype> datatypesMap,
      HashMap<String, Segment> segmentsMap, HashMap<String, Valueset> valueSetsMap, String parentIdPath,
      String parentPath, Binding parentBinding, String conformanceProfileId) {
    GroupStructureTreeModel result = new GroupStructureTreeModel();
    GroupDisplayModel groupDisplayModel = new GroupDisplayModel(group);

    if (parentIdPath == null)
      groupDisplayModel.setIdPath(group.getId());
    else
      groupDisplayModel.setIdPath(parentIdPath + "-" + group.getId());

    if (parentPath == null)
      groupDisplayModel.setPath("" + group.getPosition());
    else
      groupDisplayModel.setPath(parentPath + "-" + group.getPosition());

    groupDisplayModel.setViewScope(ViewScope.CONFORMANCEPROFILE);

    StructureElementBinding childSeb = this.findStructureElementBindingByIdFromBinding(parentBinding,
        group.getId());

    if (childSeb != null) {
      groupDisplayModel.addBinding(this.createBindingDisplay(childSeb, conformanceProfileId,
          ViewScope.CONFORMANCEPROFILE, 1, valueSetsMap, null));
      if (childSeb.getPredicate() != null) {
        Predicate p = childSeb.getPredicate();
        if (p.getTrueUsage() != null && p.getFalseUsage() != null) {
          groupDisplayModel.setTrueUsage(p.getTrueUsage());
          groupDisplayModel.setFalseUsage(p.getFalseUsage());
          groupDisplayModel.setPredicate(p);
          if (p.getIdentifier() != null)
            groupDisplayModel.getPredicate().setIdentifier(groupDisplayModel.getIdPath());
        }
      }
    }

    result.setData(groupDisplayModel);

    if (group.getChildren() != null && group.getChildren().size() > 0) {
      for (SegmentRefOrGroup sog : group.getChildren()) {
        if (sog instanceof SegmentRef) {
          result.addSegment(this.createSegmentRefStructureTreeModel((SegmentRef) sog, datatypesMap,
              segmentsMap, valueSetsMap, groupDisplayModel.getIdPath(), groupDisplayModel.getPath(),
              childSeb, conformanceProfileId));
        } else if (sog instanceof Group) {
          result.addGroup(this.createGroupStructureTreeModel((Group) sog, datatypesMap, segmentsMap,
              valueSetsMap, groupDisplayModel.getIdPath(), groupDisplayModel.getPath(), childSeb,
              conformanceProfileId));
        }
      }
    }
    return result;
  }

  private StructureElementBinding findStructureElementBindingByIdFromBinding(Binding binding, String id) {
    if (binding != null && binding.getChildren() != null) {
      for (StructureElementBinding child : binding.getChildren()) {
        if (child.getElementId().equals(id))
          return child;
      }
    }
    return null;
  }

  private BindingDisplay createBindingDisplay(StructureElementBinding seb, String sourceId, ViewScope sourceType,
      int priority, HashMap<String, Valueset> valueSetsMap, BindingDisplay existingBindingDisplay) {
    BindingDisplay bindingDisplay = existingBindingDisplay;
    if (bindingDisplay == null)
      bindingDisplay = new BindingDisplay();

    if (seb.getPredicate() != null) {
      if (existingBindingDisplay == null || (existingBindingDisplay.getPredicatePriority() != null
          && existingBindingDisplay.getPredicatePriority() > priority)) {
        bindingDisplay.setPredicate(seb.getPredicate());
        bindingDisplay.setPredicatePriority(priority);
        bindingDisplay.setPredicateSourceId(sourceId);
        bindingDisplay.setPredicateSourceType(sourceType);
      }

    }

    if (existingBindingDisplay == null || (existingBindingDisplay.getValuesetBindingsPriority() != null
        && existingBindingDisplay.getValuesetBindingsPriority() > priority)) {
      bindingDisplay.setBindingType(BindingType.NA);
      if (seb.getInternalSingleCode() != null && seb.getInternalSingleCode().getValueSetId() != null
          && seb.getInternalSingleCode().getCode() != null) {
        bindingDisplay.setInternalSingleCode(seb.getInternalSingleCode());
        bindingDisplay.setValuesetBindingsPriority(priority);
        bindingDisplay.setValuesetBindingsSourceId(sourceId);
        bindingDisplay.setValuesetBindingsSourceType(sourceType);
        bindingDisplay.setBindingType(BindingType.SC);
      } else {
        Set<DisplayValuesetBinding> displayValuesetBindings = this
            .covertDisplayVSBinding(seb.getValuesetBindings(), valueSetsMap);
        if (displayValuesetBindings != null) {
          bindingDisplay
          .setValuesetBindings(this.covertDisplayVSBinding(seb.getValuesetBindings(), valueSetsMap));
          bindingDisplay.setValuesetBindingsPriority(priority);
          bindingDisplay.setValuesetBindingsSourceId(sourceId);
          bindingDisplay.setValuesetBindingsSourceType(sourceType);
          bindingDisplay.setBindingType(BindingType.VS);
        }
      }
    }

    bindingDisplay.setChangeLog(seb.getChangeLog());
    return bindingDisplay;
  }

  private Set<DisplayValuesetBinding> covertDisplayVSBinding(Set<ValuesetBinding> valuesetBindings,
      HashMap<String, Valueset> valueSetsMap) {
    if (valuesetBindings != null) {
      Set<DisplayValuesetBinding> result = new HashSet<DisplayValuesetBinding>();
      for (ValuesetBinding vb : valuesetBindings) {

        DisplayValuesetBinding dvb = new DisplayValuesetBinding();

        dvb.setStrength(vb.getStrength());
        dvb.setValueSets(vb.getValueSets());

        List<DisplayElement> vsDisplay = vb.getValueSets().stream().map(id -> {
          Valueset vs = this.valuesetService.findById(id);
          if (vs != null) {
            DisplayElement obj = new DisplayElement();
            obj.setVariableName(vs.getBindingIdentifier());
            obj.setDomainInfo(vs.getDomainInfo());
            return obj;
          } else {
            return null;
          }
        }).collect(Collectors.toList());
        dvb.setValueSetsDisplay(vsDisplay);
        dvb.setValuesetLocations(vb.getValuesetLocations());
        result.add(dvb);

      }
      if (result.size() > 0)
        return result;
    }
    return null;
  }

  private Datatype findDatatype(String id, HashMap<String, Datatype> datatypesMap) {
    Datatype dt = datatypesMap.get(id);
    if (dt == null) {
      dt = this.datatypeService.findById(id);
      datatypesMap.put(id, dt);
    }
    return dt;
  }

  private DatatypeLabel createDatatypeLabel(Datatype dt) {
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

    return label;
  }

  private StructureElementBinding findStructureElementBindingByFieldIdForSegment(Segment segment, String fId) {
    if (segment != null && segment.getBinding() != null && segment.getBinding().getChildren() != null) {
      for (StructureElementBinding seb : segment.getBinding().getChildren()) {
        if (seb.getElementId().equals(fId))
          return seb;
      }
    }
    return null;
  }

  private StructureElementBinding findStructureElementBindingByComponentIdFromStructureElementBinding(
      StructureElementBinding seb, String cId) {
    if (seb != null && seb.getChildren() != null) {
      for (StructureElementBinding child : seb.getChildren()) {
        if (child.getElementId().equals(cId))
          return child;
      }
    }
    return null;
  }

  private StructureElementBinding findStructureElementBindingByComponentIdForDatatype(Datatype dt, String cid) {
    if (dt != null && dt.getBinding() != null && dt.getBinding().getChildren() != null) {
      for (StructureElementBinding seb : dt.getBinding().getChildren()) {
        if (seb.getElementId().equals(cid))
          return seb;
      }
    }
    return null;
  }

  Set<SegmentRefOrGroup> getTargetList(ConformanceProfile cp, String location) throws Exception {
    if (!Strings.isNullOrEmpty(location)) {
      SegmentRefOrGroup segOrGroup = findSegmentRefOrGroupById(cp.getChildren(), location);
      if (segOrGroup == null) {
        return null;
      } else if (segOrGroup.getType().equals(Type.GROUP)) {
        return ((Group) segOrGroup).getChildren();
      } else {
        throw new Exception("Invalid element path " + location + " is " + segOrGroup.getType());
      }
    } else {
      return cp.getChildren();
    }
  }


  String[] createPath(String parent, String id) {
    if (Strings.isNullOrEmpty(parent)) {
      return ArrayUtils.toArray(id);
    } else {
      return ArrayUtils.addAll(parent.split("-"), id);
    }
  }

  void removeElementBindings(String[] location, Binding binding, int i) {
    int left = (location.length - 1) - i;
    if (left >= 0) {
      StructureElementBinding found = this.findStructureElementBindingByIdFromBinding(binding, location[i]);
      if (found != null) {
        if (left == 0) {
          binding.getChildren().remove(found);
        } else {
          this.removeElementBindings(location, found, i + 1);
        }
      }
    }
  }

  public <T extends StructureElement> T findSegmentRefOrGroupByIdAsStructureElement(Set<T> children, String idPath) {
    return  (T) this.findSegmentRefOrGroupById(children.stream().map(x -> (SegmentRefOrGroup) x).collect(Collectors.toSet()), idPath);

  }

  public SegmentRefOrGroup findSegmentRefOrGroupById(Set<SegmentRefOrGroup> children, String idPath) {
    if (idPath.contains("-")) {
      String[] pathTable = idPath.split("\\-");

      for (SegmentRefOrGroup srog : children) {
        if (srog instanceof Group) {
          Group g = (Group) srog;
          if(pathTable != null &&  pathTable.length>0) {
            if (srog.getId().equals(pathTable[0])) {       
              return this.findSegmentRefOrGroupById(g.getChildren(),idPath.substring(pathTable[0].length()+1));
            }
          }
        }
      }
    } else {
      for (SegmentRefOrGroup srog : children) {
        if (srog.getId().equals(idPath))
          return  srog;
      }
    }
    return null;
  }

  private void deleteConformanceStatementById(ConformanceProfile cp, String location) {
    ConformanceStatement toBeDeleted = null;
    for (ConformanceStatement cs : cp.getBinding().getConformanceStatements()) {
      if (cs != null && cs.getId() != null && cs.getId().equals(location))
        toBeDeleted = cs;
    }

    if (toBeDeleted != null)
      cp.getBinding().getConformanceStatements().remove(toBeDeleted);
  }

  private Set<ValuesetBinding> convertDisplayValuesetBinding(
      HashSet<DisplayValuesetBinding> displayValuesetBindings) {
    if (displayValuesetBindings != null) {
      Set<ValuesetBinding> result = new HashSet<ValuesetBinding>();
      for (DisplayValuesetBinding dvb : displayValuesetBindings) {
        ValuesetBinding vb = new ValuesetBinding();
        vb.setStrength(dvb.getStrength());
        vb.setValueSets(dvb.getValueSets());
        vb.setValuesetLocations(dvb.getValuesetLocations());
        result.add(vb);
      }
      return result;
    }
    return null;
  }

  private StructureElementBinding findAndCreateStructureElementBindingByIdPath(ConformanceProfile cp,
      String location) {
    if (cp.getBinding() == null) {
      ResourceBinding binding = new ResourceBinding();
      binding.setElementId(cp.getId());
      cp.setBinding(binding);
    }
    return this.findAndCreateStructureElementBindingByIdPath(cp.getBinding(), location);
  }

  private StructureElementBinding findAndCreateStructureElementBindingByIdPath(ResourceBinding binding,
      String location) {
    if (binding.getChildren() == null) {
      if (location.contains("-")) {
        StructureElementBinding seb = new StructureElementBinding();
        seb.setElementId(location.split("\\-")[0]);
        binding.addChild(seb);
        return this.findAndCreateStructureElementBindingByIdPath(seb,
            location.replace(location.split("\\-")[0] + "-", ""));
      } else {
        StructureElementBinding seb = new StructureElementBinding();
        seb.setElementId(location);
        binding.addChild(seb);
        return seb;
      }
    } else {
      if (location.contains("-")) {
        for (StructureElementBinding seb : binding.getChildren()) {
          if (seb.getElementId().equals(location.split("\\-")[0]))
            return this.findAndCreateStructureElementBindingByIdPath(seb,
                location.replace(location.split("\\-")[0] + "-", ""));
        }
        StructureElementBinding seb = new StructureElementBinding();
        seb.setElementId(location.split("\\-")[0]);
        binding.addChild(seb);
        return this.findAndCreateStructureElementBindingByIdPath(seb,
            location.replace(location.split("\\-")[0] + "-", ""));
      } else {
        for (StructureElementBinding seb : binding.getChildren()) {
          if (seb.getElementId().equals(location))
            return seb;
        }
        StructureElementBinding seb = new StructureElementBinding();
        seb.setElementId(location);
        binding.addChild(seb);
        return seb;
      }
    }
  }

  private StructureElementBinding findAndCreateStructureElementBindingByIdPath(StructureElementBinding binding,
      String location) {
    if (binding.getChildren() == null) {
      if (location.contains("-")) {
        StructureElementBinding seb = new StructureElementBinding();
        seb.setElementId(location.split("\\-")[0]);
        binding.addChild(seb);
        return this.findAndCreateStructureElementBindingByIdPath(seb,
            location.replace(location.split("\\-")[0] + "-", ""));
      } else {
        StructureElementBinding seb = new StructureElementBinding();
        seb.setElementId(location);
        binding.addChild(seb);
        return seb;
      }
    } else {
      if (location.contains("-")) {
        for (StructureElementBinding seb : binding.getChildren()) {
          if (seb.getElementId().equals(location.split("\\-")[0]))
            return this.findAndCreateStructureElementBindingByIdPath(seb,
                location.replace(location.split("\\-")[0] + "-", ""));
        }
        StructureElementBinding seb = new StructureElementBinding();
        seb.setElementId(location.split("\\-")[0]);
        binding.addChild(seb);
        return this.findAndCreateStructureElementBindingByIdPath(seb,
            location.replace(location.split("\\-")[0] + "-", ""));
      } else {
        for (StructureElementBinding seb : binding.getChildren()) {
          if (seb.getElementId().equals(location))
            return seb;
        }
        StructureElementBinding seb = new StructureElementBinding();
        seb.setElementId(location);
        binding.addChild(seb);
        return seb;
      }
    }
  }

  /*
   * (non-Javadoc)
   * 
   * @see
   * gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService#
   * convertDomainToContextStructure(gov.nist.hit.hl7.igamt.conformanceprofile.
   * domain. ConformanceProfile)
   */
  @Override
  public ConformanceProfileStructureTreeModel convertDomainToContextStructure(ConformanceProfile conformanceProfile,
      HashMap<String, ConformanceStatementsContainer> segMap,
      HashMap<String, ConformanceStatementsContainer> dtMap) {
    ConformanceProfileStructureTreeModel result = new ConformanceProfileStructureTreeModel();
    result.setData(new ConformanceProfileDisplayModel(conformanceProfile));

    if (conformanceProfile.getChildren() != null && conformanceProfile.getChildren().size() > 0) {
      for (SegmentRefOrGroup sog : conformanceProfile.getChildren()) {
        if (sog instanceof SegmentRef) {
          SegmentRefStructureTreeModel segmentRefStructureTreeModel = new SegmentRefStructureTreeModel();
          SegmentRefDisplayModel segmentRefDisplayModel = new SegmentRefDisplayModel((SegmentRef) sog);
          Segment s = this.segmentService.findById(((SegmentRef) sog).getRef().getId());

          if (s.getDomainInfo().getScope().equals(Scope.USER)) {
            if (s.getBinding() != null && s.getBinding().getConformanceStatements() != null
                && s.getBinding().getConformanceStatements().size() > 0) {
              if (!segMap.containsKey(s.getLabel()))
                segMap.put(s.getLabel(),
                    new ConformanceStatementsContainer(s.getBinding().getConformanceStatements(),
                        Type.SEGMENT, s.getId(), s.getLabel()));
            }

            this.segmentService.collectAssoicatedConformanceStatements(s, dtMap);
          }

          segmentRefDisplayModel.setName(s.getName());
          segmentRefDisplayModel.setIdPath(conformanceProfile.getId() + "-" + sog.getId());
          segmentRefDisplayModel.setPath("1-" + sog.getPosition());
          segmentRefStructureTreeModel.setData(segmentRefDisplayModel);
          result.addChild(segmentRefStructureTreeModel);
        } else if (sog instanceof Group) {
          GroupStructureTreeModel groupStructureTreeModel = new GroupStructureTreeModel();
          GroupDisplayModel groupDisplayModel = new GroupDisplayModel((Group) sog);
          groupDisplayModel.setIdPath(conformanceProfile.getId() + "-" + sog.getId());
          groupDisplayModel.setPath("1-" + sog.getPosition());
          updateChild(groupStructureTreeModel, groupDisplayModel, sog, segMap, dtMap);
          groupStructureTreeModel.setData(groupDisplayModel);
          result.addChild(groupStructureTreeModel);
        }
      }
    }
    return result;
  }

  private void updateChild(GroupStructureTreeModel parentStructureTreeModel, GroupDisplayModel parentDisplayModel,
      SegmentRefOrGroup parent, HashMap<String, ConformanceStatementsContainer> segMap,
      HashMap<String, ConformanceStatementsContainer> dtMap) {
    for (SegmentRefOrGroup child : ((Group) parent).getChildren()) {
      if (child instanceof Group) {
        GroupStructureTreeModel groupStructureTreeModel = new GroupStructureTreeModel();
        GroupDisplayModel groupDisplayModel = new GroupDisplayModel((Group) child);
        groupDisplayModel.setIdPath(parentDisplayModel.getIdPath() + "-" + child.getId());
        groupDisplayModel.setPath(parentDisplayModel.getPath() + "-" + child.getPosition());
        updateChild(groupStructureTreeModel, groupDisplayModel, child, segMap, dtMap);
        groupStructureTreeModel.setData(groupDisplayModel);
        parentStructureTreeModel.addGroup(groupStructureTreeModel);
      } else if (child instanceof SegmentRef) {
        SegmentRefStructureTreeModel segmentRefStructureTreeModel = new SegmentRefStructureTreeModel();
        SegmentRefDisplayModel segmentRefDisplayModel = new SegmentRefDisplayModel((SegmentRef) child);
        Segment s = this.segmentService.findById(((SegmentRef) child).getRef().getId());

        if (s.getDomainInfo().getScope().equals(Scope.USER)) {
          if (s.getBinding() != null && s.getBinding().getConformanceStatements() != null
              && s.getBinding().getConformanceStatements().size() > 0) {
            if (!segMap.containsKey(s.getLabel()))
              segMap.put(s.getLabel(), new ConformanceStatementsContainer(
                  s.getBinding().getConformanceStatements(), Type.SEGMENT, s.getId(), s.getLabel()));
          }

          this.segmentService.collectAssoicatedConformanceStatements(s, dtMap);
        }

        segmentRefDisplayModel.setName(s.getName());
        segmentRefDisplayModel.setIdPath(parentDisplayModel.getIdPath() + "-" + child.getId());
        segmentRefDisplayModel.setPath(parentDisplayModel.getPath() + "-" + child.getPosition());
        segmentRefStructureTreeModel.setData(segmentRefDisplayModel);
        parentStructureTreeModel.addSegment(segmentRefStructureTreeModel);
      }
    }

  }

  /*
   * (non-Javadoc)
   * 
   * @see
   * gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService#
   * makeLocationInfo(
   * gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile)
   */
  @Override
  public ResourceBinding makeLocationInfo(ConformanceProfile cp) {
    if (cp.getBinding() != null && cp.getBinding().getChildren() != null) {
      for (StructureElementBinding seb : cp.getBinding().getChildren()) {
        seb.setLocationInfo(makeLocationInfoForGroupOrSegRef(cp.getChildren(), seb));
      }
      return cp.getBinding();
    }
    return null;
  }

  /**
   * @param list
   * @param seb
   * @return
   */
  private LocationInfo makeLocationInfoForGroupOrSegRef(Set<SegmentRefOrGroup> list, StructureElementBinding seb) {
    if (list != null) {
      for (SegmentRefOrGroup sg : list) {
        if (sg.getId().equals(seb.getElementId())) {
          if (sg instanceof Group) {
            if (seb.getChildren() != null) {
              for (StructureElementBinding childSeb : seb.getChildren()) {
                childSeb.setLocationInfo(
                    this.makeLocationInfoForGroupOrSegRef(((Group) sg).getChildren(), childSeb));
              }
            }
            return new LocationInfo(LocationType.GROUP, sg.getPosition(), sg.getName());
          } else if (sg instanceof SegmentRef) {
            Segment s = this.segmentService.findById(((SegmentRef) sg).getRef().getId());
            if (seb.getChildren() != null) {
              for (StructureElementBinding childSeb : seb.getChildren()) {
                childSeb.setLocationInfo(this.segmentService.makeLocationInfoForField(s, childSeb));
              }
            }
            return new LocationInfo(LocationType.SEGREF, sg.getPosition(), s.getLabel());
          }
        }
      }
    }
    return null;
  }

  @Override
  public Set<RelationShip> collectDependencies(ConformanceProfile cp) {
    // TODO Auto-generated method stub
    Set<RelationShip> used = new HashSet<RelationShip>();
    HashMap<String, Usage> usageMap = new HashMap<String, Usage>();
    for (MsgStructElement segOrgroup : cp.getChildren()) {
      if (segOrgroup instanceof SegmentRef) {
        usageMap.put(segOrgroup.getId(), segOrgroup.getUsage());
        usageMap.put(segOrgroup.getId(), segOrgroup.getUsage());
        SegmentRef ref = (SegmentRef) segOrgroup;

        if (ref.getRef() != null && ref.getRef().getId() != null) {
          RelationShip rel = new RelationShip(new ReferenceIndentifier(ref.getRef().getId(), Type.SEGMENT),
              new ReferenceIndentifier(cp.getId(), Type.CONFORMANCEPROFILE),
              new ReferenceLocation(Type.CONFORMANCEPROFILE, ref.getPosition() + "", ref.getName()));
          rel.setUsage(ref.getUsage());
          used.add(rel);
        }

      } else {
        processSegmentorGroup(cp.getId(), segOrgroup, used, "");
      }
    }
    if (cp.getBinding() != null) {

      Set<RelationShip> bindingDependencies = bindingService.collectDependencies(
          new ReferenceIndentifier(cp.getId(), Type.CONFORMANCEPROFILE), cp.getBinding(), usageMap);
      used.addAll(bindingDependencies);
    }
    if (cp.getCoConstraintsBindings() != null) {

      Set<RelationShip> CoConstraintsDependencies = coConstraintService.collectDependencies(
          new ReferenceIndentifier(cp.getId(), Type.CONFORMANCEPROFILE), cp.getCoConstraintsBindings());

      used.addAll(CoConstraintsDependencies);
    }

    if(cp.getSlicings() != null ) {
      Set<RelationShip> slicingDependencies = this.slicingService.collectDependencies(
          new ReferenceIndentifier(cp.getId(), Type.CONFORMANCEPROFILE), cp.getSlicings(), Type.SEGMENT);
      used.addAll(slicingDependencies);  
    }
    return used;

  }

  private void processSegmentorGroup(String profileId, MsgStructElement segOrgroup, Set<RelationShip> used,
      String path) {
    // TODO Auto-generated method stub
    if (segOrgroup instanceof SegmentRef) {
      SegmentRef ref = (SegmentRef) segOrgroup;
      if (ref.getRef() != null && ref.getRef().getId() != null) {

        RelationShip rel = new RelationShip(new ReferenceIndentifier(ref.getRef().getId(), Type.SEGMENT),
            new ReferenceIndentifier(profileId, Type.CONFORMANCEPROFILE),

            new ReferenceLocation(Type.GROUP, path + "." + ref.getPosition(), ref.getName()));
        rel.setUsage(ref.getUsage());
        used.add(rel);
      }
    } else if (segOrgroup instanceof Group) {
      Group g = (Group) segOrgroup;
      path += g.getName();
      for (MsgStructElement child : g.getChildren()) {
        processSegmentorGroup(profileId, child, used, path);
      }
    }

  }

  public List<ConformanceProfile> findByIdIn(Set<String> ids) {
    // TODO Auto-generated method stub
    return conformanceProfileRepository.findByIdIn(ids);
  }

  @Override
  public Set<Resource> getDependencies(ConformanceProfile cp) {
    Set<String> segmentIds = collectSegmentIds(cp);
    Set<Resource> ret = new HashSet<Resource>();
    ret.add(cp);
    HashMap<String, Resource> usedDatatypes = new HashMap<String, Resource>();
    List<Segment> segments = this.segmentService.findByIdIn(segmentIds);
    ret.addAll(segments);
    for (Segment seg : segments) {
      this.segmentService.collectResources(seg, usedDatatypes);
    }
    ret.addAll(usedDatatypes.values());
    return ret;
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
  public Set<DisplayElement> convertConformanceProfiles(Set<ConformanceProfile> conformanceProfiles, ConformanceProfileRegistry registry) {
    Set<DisplayElement> ret = new HashSet<DisplayElement>();
    Map<String, Integer> positionsMap = registry.getChildren().stream().collect(Collectors.toMap(Link::getId, Link::getPosition));
    for(ConformanceProfile cp : conformanceProfiles) {
      ret.add(this.convertConformanceProfile(cp, positionsMap.get(cp.getId())));
    }
    return ret;
  }

  @Override
  public Set<DisplayElement> convertConformanceProfileRegistry(ConformanceProfileRegistry registry) {
    Map<String, Integer> positionMap = registry.getChildren().stream().collect(Collectors.toMap(Link::getId, Link::getPosition));
    List<ConformanceProfile> conformanceProfiles = this.findByIdIn(positionMap.keySet());
    Set<DisplayElement> ret = new HashSet<DisplayElement>();
    for(ConformanceProfile cf : conformanceProfiles) {
      ret.add(convertConformanceProfile(cf, positionMap.get(cf.getId())));
    }
    return ret;
  }

  public Set<String> collectSegmentIds(ConformanceProfile cp) {
    // TODO Auto-generated method stub
    Set<String> ids = new HashSet<String>();
    for (MsgStructElement segOrgroup : cp.getChildren()) {
      if (segOrgroup instanceof SegmentRef) {
        SegmentRef ref = (SegmentRef) segOrgroup;
        if (ref.getRef() != null && ref.getRef().getId() != null)
          ids.add(ref.getRef().getId());
      } else {
        processSegmentorGroup(segOrgroup, ids);
      }
    }
    return ids;

  }

  public void processSegmentorGroup(MsgStructElement segOrgroup, Set<String> ids) {
    // TODO Auto-generated method stub
    if (segOrgroup instanceof SegmentRef) {
      SegmentRef ref = (SegmentRef) segOrgroup;
      if (ref.getRef() != null && ref.getRef().getId() != null) {
        ids.add(ref.getRef().getId());

      }
    } else if (segOrgroup instanceof Group) {
      Group g = (Group) segOrgroup;
      for (MsgStructElement child : g.getChildren()) {
        processSegmentorGroup(child, ids);
      }
    }

  }

  @Override
  public void applyChanges(ConformanceProfile conformanceProfile, List<ChangeItemDomain> cItems, String documentId) throws Exception {
    //Resource part
    Map<PropertyType,ChangeItemDomain> singlePropertyMap = applyChange.convertToSingleChangeMap(cItems);
    this.applyMetaData(conformanceProfile, singlePropertyMap , documentId);

    Map<PropertyType, List<ChangeItemDomain>> map = applyChange.convertToMultiplePropertyChangeMap(cItems);
    this.applyChildrenChange(map, conformanceProfile.getChildren(), documentId);
    if (map.containsKey(PropertyType.COCONSTRAINTBINDINGS)) {
      this.applyCoConstraintsBindingChanges(conformanceProfile, map.get(PropertyType.COCONSTRAINTBINDINGS) , documentId);
    }
    applyChange.applyBindingChanges(map, conformanceProfile.getBinding(), documentId, Level.CONFORMANCEPROFILE);
    if (map.containsKey(PropertyType.SLICING)) {
      if(conformanceProfile.getSlicings() == null) {
        conformanceProfile.setSlicings(new HashSet<Slicing>());
      }
      applyChange.applySlicingChanges(map, conformanceProfile.getSlicings(), documentId, Type.CONFORMANCEPROFILE);

    }   
    conformanceProfile.setBinding(this.makeLocationInfo(conformanceProfile));
    this.save(conformanceProfile);
  }

  private void applyCoConstraintsBindingChanges(
      ConformanceProfile conformanceProfile,
      List<ChangeItemDomain> items, String documentId
      ) throws ApplyChangeException {
    ObjectMapper mapper = new ObjectMapper();
    mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    for(ChangeItemDomain item : items) {
      try {
        String jsonInString = mapper.writeValueAsString(item.getPropertyValue());
        item.setOldPropertyValue(conformanceProfile.getCoConstraintsBindings());
        List<CoConstraintBinding> coconstraints = mapper.readValue(jsonInString, new TypeReference<List<CoConstraintBinding>>() {});
        conformanceProfile.setCoConstraintsBindings(coconstraints);
      } catch (IOException e) {
        throw new ApplyChangeException(item);
      }
    }
  }


  private void applyMetaData(
      ConformanceProfile cp,
      Map<PropertyType, ChangeItemDomain> singlePropertyMap,
      String documentId
      ) throws ApplyChangeException{

    applyChange.applyResourceChanges(cp, singlePropertyMap , documentId);
    ObjectMapper mapper = new ObjectMapper();

    if (singlePropertyMap.containsKey(PropertyType.NAME)) {
      singlePropertyMap.get(PropertyType.NAME).setOldPropertyValue(cp.getName());
      cp.setName((String) singlePropertyMap.get(PropertyType.NAME).getPropertyValue());
    }
    if (singlePropertyMap.containsKey(PropertyType.DISPLAYNAME)) {
      singlePropertyMap.get(PropertyType.DISPLAYNAME).setOldPropertyValue(cp.getDisplayName());
      cp.setDisplayName((String) singlePropertyMap.get(PropertyType.DISPLAYNAME).getPropertyValue());
    }
    if (singlePropertyMap.containsKey(PropertyType.ORGANISATION)) {
      singlePropertyMap.get(PropertyType.ORGANISATION).setOldPropertyValue(cp.getOrganization());
      cp.setOrganization((String) singlePropertyMap.get(PropertyType.ORGANISATION).getPropertyValue());
    } 
    if (singlePropertyMap.containsKey(PropertyType.ROLE)) {
      singlePropertyMap.get(PropertyType.ROLE).setOldPropertyValue(cp.getRole());
      cp.setRole(Role.valueOf((String) singlePropertyMap.get(PropertyType.ROLE).getPropertyValue()));
    } 
    if (singlePropertyMap.containsKey(PropertyType.PROFILETYPE)) {
      singlePropertyMap.get(PropertyType.PROFILETYPE).setOldPropertyValue(cp.getProfileType());
      cp.setProfileType(ProfileType.valueOf((String) singlePropertyMap.get(PropertyType.PROFILETYPE).getPropertyValue()));
    } 
    if (singlePropertyMap.containsKey(PropertyType.IDENTIFIER)) {
      singlePropertyMap.get(PropertyType.IDENTIFIER).setOldPropertyValue(cp.getIdentifier());
      cp.setIdentifier((String) singlePropertyMap.get(PropertyType.IDENTIFIER).getPropertyValue());
    }
    if (singlePropertyMap.containsKey(PropertyType.AUTHORS)) {
      try {
        String jsonInString= mapper.writeValueAsString(singlePropertyMap.get(PropertyType.AUTHORS).getPropertyValue());
        singlePropertyMap.get(PropertyType.AUTHORS).setOldPropertyValue(cp.getAuthors());
        List<String> authors= mapper.readValue(jsonInString, new TypeReference<List<String>>() {});
        cp.setAuthors(authors);
      } catch (IOException e) {
        throw new ApplyChangeException(singlePropertyMap.get(PropertyType.AUTHORS));
      }
    }
    if (singlePropertyMap.containsKey(PropertyType.PROFILEIDENTIFIER)) {
      try {
        String jsonInString = mapper.writeValueAsString(singlePropertyMap.get(PropertyType.PROFILEIDENTIFIER).getPropertyValue());
        singlePropertyMap.get(PropertyType.PROFILEIDENTIFIER).setOldPropertyValue(cp.getAuthors());
        MessageProfileIdentifier profileIdentifier= mapper.readValue(jsonInString, MessageProfileIdentifier.class);
        cp.setPreCoordinatedMessageIdentifier(profileIdentifier);
      } catch (IOException e) {
        throw new ApplyChangeException(singlePropertyMap.get(PropertyType.PROFILEIDENTIFIER));
      }
    } 

  }

  /**
   * @param map
   * @param children
   * @param documentId
   * @throws ApplyChangeException 
   */
  private void applyChildrenChange(Map<PropertyType, List<ChangeItemDomain>> map,
      Set<SegmentRefOrGroup> children, String documentId) throws ApplyChangeException {

    applyChange.applyStructureElementChanges(map, children, documentId, this::findSegmentRefOrGroupByIdAsStructureElement);

    if (map.containsKey(PropertyType.CARDINALITYMIN)) {
      applyChange.applyAll(map.get(PropertyType.CARDINALITYMIN), children, documentId, this::applyCardMin, this::findSegmentRefOrGroupByIdAsStructureElement);
    }
    if (map.containsKey(PropertyType.CARDINALITYMAX)) {
      applyChange.applyAll(map.get(PropertyType.CARDINALITYMAX), children, documentId, this::applyCardMax, this::findSegmentRefOrGroupByIdAsStructureElement);
    } 
    if(map.containsKey((PropertyType.SEGMENTREF))){
      applyChange.applyAll(map.get(PropertyType.SEGMENTREF), children, documentId, this::applyRef, this::findSegmentRefOrGroupByIdAsStructureElement);
    }
  }

  public void applyCardMin( ChangeItemDomain change, SegmentRefOrGroup elm, String documentId) {
    change.setOldPropertyValue(elm.getMin());
    if (change.getPropertyValue() == null) {
      elm.setMin(0);
    } else {
      elm.setMin((Integer) change.getPropertyValue());
    }
  }

  public void applyCardMax( ChangeItemDomain change, SegmentRefOrGroup elm, String documentId) {
    change.setOldPropertyValue(elm.getMax());
    if (change.getPropertyValue() == null) {
      elm.setMax("NA");
    } else {
      elm.setMax((String) change.getPropertyValue());
    }
  }

  public void applyRef( ChangeItemDomain change, SegmentRefOrGroup elm, String documentId) throws ApplyChangeException {
    ObjectMapper mapper = new ObjectMapper();
    try {
      if ( elm instanceof SegmentRef) {
        SegmentRef sr = (SegmentRef) elm;
        change.setOldPropertyValue(sr.getRef());
        String  jsonInString = mapper.writeValueAsString(change.getPropertyValue());
        sr.setRef(mapper.readValue(jsonInString, Ref.class));
      }
    } catch (IOException e) {
      throw new ApplyChangeException(change);
    }
  }

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService#subsitute(gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile, java.util.List)
   */
  @Override
  public void subsitute(ConformanceProfile cp, List<Substitue> substitutes, String username) {
    HashMap<RealKey, String> newKeys = new HashMap<RealKey, String>();
    for(Substitue sub: substitutes) {
      RealKey segKey = new RealKey(sub.getOriginalId(), Type.SEGMENT);
      if(sub.isCreate()) {
        Segment segment = this.segmentService.findById(sub.getOriginalId());
        if(segment !=null) {
          Segment clone = segment.clone();
          clone.getDomainInfo().setScope(Scope.USER);
          clone.setUsername(username);
          clone.setName(segment.getName());
          clone.setExt(sub.getExt());
          clone = segmentService.save(clone);
          newKeys.put(segKey, clone.getId());
        }
      }else {
        newKeys.put(segKey, sub.getNewId());
      }
    }
    this.processAndSubstitute(cp, newKeys);

  }




}
