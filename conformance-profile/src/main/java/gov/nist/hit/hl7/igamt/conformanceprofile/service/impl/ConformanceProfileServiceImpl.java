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
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Pattern;

import org.apache.commons.lang3.StringUtils;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.MsgStructElement;
import gov.nist.hit.hl7.igamt.common.base.domain.Ref;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.Usage;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
import gov.nist.hit.hl7.igamt.common.base.domain.display.ViewScope;
import gov.nist.hit.hl7.igamt.common.base.exception.ValidationException;
import gov.nist.hit.hl7.igamt.common.base.util.ValidationUtil;
import gov.nist.hit.hl7.igamt.common.binding.domain.Binding;
import gov.nist.hit.hl7.igamt.common.binding.domain.Comment;
import gov.nist.hit.hl7.igamt.common.binding.domain.ExternalSingleCode;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.display.BindingDisplay;
import gov.nist.hit.hl7.igamt.common.binding.domain.display.DisplayValuesetBinding;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.ChangeItemDomain;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.ChangeType;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.igamt.common.constraint.domain.ConformanceStatement;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.Group;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRef;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRefOrGroup;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.ConformanceProfileConformanceStatement;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.ConformanceProfileStructureDisplay;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.DisplayConformanceProfileMetadata;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.DisplayConformanceProfilePostDef;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.DisplayConformanceProfilePreDef;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.GroupDisplayModel;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.GroupStructureTreeModel;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.SegmentLabel;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.SegmentRefDisplayModel;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.SegmentRefStructureTreeModel;
import gov.nist.hit.hl7.igamt.conformanceprofile.exception.ConformanceProfileNotFoundException;
import gov.nist.hit.hl7.igamt.conformanceprofile.exception.ConformanceProfileValidationException;
import gov.nist.hit.hl7.igamt.conformanceprofile.repository.ConformanceProfileRepository;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Component;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.display.ComponentDisplayDataModel;
import gov.nist.hit.hl7.igamt.datatype.domain.display.ComponentStructureTreeModel;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DatatypeLabel;
import gov.nist.hit.hl7.igamt.datatype.domain.display.PostDef;
import gov.nist.hit.hl7.igamt.datatype.domain.display.PreDef;
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
  public List<ConformanceProfile> findByDomainInfoScopeAndDomainInfoVersion(String scope,
      String verion) {
    // TODO Auto-generated method stub
    return conformanceProfileRepository.findByDomainInfoScopeAndDomainInfoVersion(scope, verion);
  }

  @Override
  public List<ConformanceProfile> findByName(String name) {
    // TODO Auto-generated method stub
    return conformanceProfileRepository.findByName(name);
  }

  @Override
  public List<ConformanceProfile> findByDomainInfoScopeAndDomainInfoVersionAndName(String scope,
      String version, String name) {
    // TODO Auto-generated method stub
    return conformanceProfileRepository.findByDomainInfoScopeAndDomainInfoVersionAndName(scope,
        version, name);
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
  public DisplayConformanceProfileMetadata convertDomainToMetadata(
      ConformanceProfile conformanceProfile) {
    if (conformanceProfile != null) {
      DisplayConformanceProfileMetadata result = new DisplayConformanceProfileMetadata();
      result.setDescription(conformanceProfile.getDescription());
      result.setDomainInfo(conformanceProfile.getDomainInfo());
      result.setId(conformanceProfile.getId());
      result.setIdentifier(conformanceProfile.getIdentifier());
      result.setMessageType(conformanceProfile.getMessageType());
      result.setName(conformanceProfile.getName());
      result.setStructId(conformanceProfile.getStructID());
      result.setAuthorNotes(conformanceProfile.getComment());
      return result;
    }
    return null;
  }

  @Override
  public DisplayConformanceProfilePreDef convertDomainToPredef(
      ConformanceProfile conformanceProfile) {
    if (conformanceProfile != null) {
      DisplayConformanceProfilePreDef result = new DisplayConformanceProfilePreDef();
      result.setDomainInfo(conformanceProfile.getDomainInfo());
      result.setId(conformanceProfile.getId());
      result.setIdentifier(conformanceProfile.getIdentifier());
      result.setMessageType(conformanceProfile.getMessageType());
      result.setName(conformanceProfile.getName());
      result.setStructId(conformanceProfile.getStructID());
      result.setPreDef(conformanceProfile.getPreDef());
      return result;
    }
    return null;
  }

  @Override
  public DisplayConformanceProfilePostDef convertDomainToPostdef(
      ConformanceProfile conformanceProfile) {
    if (conformanceProfile != null) {
      DisplayConformanceProfilePostDef result = new DisplayConformanceProfilePostDef();
      result.setDomainInfo(conformanceProfile.getDomainInfo());
      result.setId(conformanceProfile.getId());
      result.setIdentifier(conformanceProfile.getIdentifier());
      result.setMessageType(conformanceProfile.getMessageType());
      result.setName(conformanceProfile.getName());
      result.setStructId(conformanceProfile.getStructID());
      result.setPostDef(conformanceProfile.getPostDef());
      return result;
    }
    return null;
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
      ConformanceProfile conformanceProfile) {
    if (conformanceProfile != null) {
      ConformanceProfileConformanceStatement result = new ConformanceProfileConformanceStatement();
      result.setDomainInfo(conformanceProfile.getDomainInfo());
      result.setId(conformanceProfile.getId());
      result.setIdentifier(conformanceProfile.getIdentifier());
      result.setMessageType(conformanceProfile.getMessageType());
      result.setName(conformanceProfile.getName());
      result.setStructId(conformanceProfile.getStructID());
      result.setChildren(conformanceProfile.getChildren());
      result.setConformanceStatements(conformanceProfile.getBinding().getConformanceStatements());
      return result;
    }
    return null;
  }


  @Override
  public ConformanceProfile savePredef(PreDef predef) throws ConformanceProfileNotFoundException {
    ConformanceProfile conformanceProfile = findById(predef.getId());
    if (conformanceProfile == null) {
      throw new ConformanceProfileNotFoundException(predef.getId());
    }
    conformanceProfile.setPreDef(predef.getPreDef());
    return save(conformanceProfile);
  }

  @Override
  public ConformanceProfile savePostdef(PostDef postdef)
      throws ConformanceProfileNotFoundException {
    ConformanceProfile conformanceProfile = findById(postdef.getId());
    if (conformanceProfile == null) {
      throw new ConformanceProfileNotFoundException(postdef.getId());
    }
    conformanceProfile.setPostDef(postdef.getPostDef());
    return save(conformanceProfile);
  }


  @Override
  public ConformanceProfile saveMetadata(DisplayConformanceProfileMetadata metadata)
      throws ConformanceProfileNotFoundException, ConformanceProfileValidationException {
    validate(metadata);
    ConformanceProfile conformanceProfile = findById(metadata.getId());
    if (conformanceProfile == null) {
      throw new ConformanceProfileNotFoundException(metadata.getId());
    }
    conformanceProfile.setDescription(metadata.getDescription());
    conformanceProfile.setDomainInfo(metadata.getDomainInfo());
    conformanceProfile.setId(metadata.getId());
    conformanceProfile.setIdentifier(metadata.getIdentifier());
    conformanceProfile.setMessageType(metadata.getMessageType());
    conformanceProfile.setName(metadata.getName());
    conformanceProfile.setStructID(metadata.getStructId());
    return save(conformanceProfile);
  }


  @Override
  public ConformanceProfile saveConformanceStatement(
      ConformanceProfileConformanceStatement conformanceStatement)
      throws ConformanceProfileNotFoundException, ConformanceProfileValidationException {
    validate(conformanceStatement);
    ConformanceProfile conformanceProfile = findById(conformanceStatement.getId());
    if (conformanceProfile == null) {
      throw new ConformanceProfileNotFoundException(conformanceStatement.getId());
    }
    conformanceProfile.getBinding()
        .setConformanceStatements(conformanceStatement.getConformanceStatements());
    return save(conformanceProfile);
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
  public void validate(DisplayConformanceProfileMetadata metadata)
      throws ConformanceProfileValidationException {
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



  /**
   * TODO: anything more to validate ??
   */
  @Override
  public void validate(ConformanceProfileConformanceStatement conformanceStatement)
      throws ConformanceProfileValidationException {
    if (conformanceStatement != null) {
      for (ConformanceStatement statement : conformanceStatement.getConformanceStatements()) {
        if (StringUtils.isEmpty(statement.getIdentifier())) {
          throw new ConformanceProfileValidationException(
              "conformance statement identifier is missing");
        }
      }
    }
  }

  /*
   * (non-Javadoc)
   * 
   * @see gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService#
   * cloneConformanceProfile(java.util.HashMap, java.util.HashMap,
   * gov.nist.hit.hl7.igamt.common.base.domain.Link, java.lang.String)
   */
  @Override
  public Link cloneConformanceProfile(String key, HashMap<String, String> valuesetsMap,
      HashMap<String, String> segmentsMap, Link l, String username) {
    ConformanceProfile old = this.findById(l.getId());
    ConformanceProfile elm = old.clone();
    Link newLink = new Link();
    newLink.setId(key);
    updateDependencies(elm, segmentsMap, valuesetsMap);
    elm.setId(newLink.getId());
    elm.setUsername(username);
    this.save(elm);
    return newLink;

  }

  /**
   * @param elm
   * @param datatypesMap
   * @param valuesetsMap
   */
  private void updateDependencies(ConformanceProfile elm, HashMap<String, String> segmentsMap,
      HashMap<String, String> valuesetsMap) {
    // TODO Auto-generated method stub

    updateBindings(elm.getBinding(), valuesetsMap);
    processCp(elm, segmentsMap);

  }

  /**
   * @param elm
   * @param valuesetsMap
   */
  private void updateBindings(ResourceBinding binding, HashMap<String, String> valuesetsMap) {
    // TODO Auto-generated method stub
    if (binding.getChildren() != null) {
      for (StructureElementBinding child : binding.getChildren()) {
        if (child.getValuesetBindings() != null) {
          for (ValuesetBinding vs : child.getValuesetBindings()) {
            if (vs.getValuesetId() != null) {
              if (valuesetsMap.containsKey(vs.getValuesetId())) {
                vs.setValuesetId(valuesetsMap.get(vs.getValuesetId()));
              }
            }
          }
        }
      }
    }
  }



  private void processCp(ConformanceProfile cp, HashMap<String, String> segmentsMap) {
    // TODO Auto-generated method stub
    for (MsgStructElement segOrgroup : cp.getChildren()) {
      if (segOrgroup instanceof SegmentRef) {
        SegmentRef ref = (SegmentRef) segOrgroup;
        if (ref.getRef() != null && ref.getRef().getId() != null) {
          if (segmentsMap.containsKey(ref.getRef().getId())) {
            ref.setId(segmentsMap.get(ref.getRef().getId()));
          }
        }
      } else {
        processSegmentorGroup(segOrgroup, segmentsMap);
      }
    }

  }

  private void processSegmentorGroup(MsgStructElement segOrgroup,
      HashMap<String, String> segmentsMap) {
    // TODO Auto-generated method stub
    if (segOrgroup instanceof SegmentRef) {
      SegmentRef ref = (SegmentRef) segOrgroup;
      if (ref.getRef() != null && ref.getRef().getId() != null) {
        if (segmentsMap.containsKey(ref.getRef().getId())) {
          ref.setId(segmentsMap.get(ref.getRef().getId()));
        }

      }
    } else if (segOrgroup instanceof Group) {
      Group g = (Group) segOrgroup;
      for (MsgStructElement child : g.getChildren()) {
        processSegmentorGroup(child, segmentsMap);
      }
    }

  }

  /*
   * (non-Javadoc)
   * 
   * @see gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService#
   * convertDomainToDisplayStructure(gov.nist.hit.hl7.igamt.conformanceprofile.domain.
   * ConformanceProfile)
   */
  @Override
  public ConformanceProfileStructureDisplay convertDomainToDisplayStructure(
      ConformanceProfile conformanceProfile) {
    HashMap<String, Valueset> valueSetsMap = new HashMap<String, Valueset>();
    HashMap<String, Datatype> datatypesMap = new HashMap<String, Datatype>();
    HashMap<String, Segment> segmentsMap = new HashMap<String, Segment>();

    ConformanceProfileStructureDisplay result = new ConformanceProfileStructureDisplay();
    result.setId(conformanceProfile.getId());
    result.setScope(conformanceProfile.getDomainInfo().getScope());
    result.setVersion(conformanceProfile.getDomainInfo().getVersion());
    result.setName(conformanceProfile.getName());
    String label = conformanceProfile.getName();
    if (conformanceProfile.getIdentifier() != null)
      label = label + "-" + conformanceProfile.getIdentifier();
    result.setLabel(label);

    if (conformanceProfile.getChildren() != null && conformanceProfile.getChildren().size() > 0) {
      for (SegmentRefOrGroup sog : conformanceProfile.getChildren()) {
        if (sog instanceof SegmentRef) {
          result.addSegment(this.createSegmentRefStructureTreeModel((SegmentRef) sog, datatypesMap,
              segmentsMap, valueSetsMap, null, null, conformanceProfile.getBinding(),
              conformanceProfile.getId()));
        } else if (sog instanceof Group) {
          result.addGroup(this.createGroupStructureTreeModel((Group) sog, datatypesMap, segmentsMap,
              valueSetsMap, null, null, conformanceProfile.getBinding(),
              conformanceProfile.getId()));
        }
      }
    }

    return result;
  }

  private SegmentRefStructureTreeModel createSegmentRefStructureTreeModel(SegmentRef segmentRef,
      HashMap<String, Datatype> datatypesMap, HashMap<String, Segment> segmentsMap,
      HashMap<String, Valueset> valueSetsMap, String parentIdPath, String parentPath,
      Binding parentBinding, String conformanceProfileId) {
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
    StructureElementBinding childSeb =
        this.findStructureElementBindingByIdFromBinding(parentBinding, segmentRef.getId());
    if (childSeb != null)
      segmentRefDisplayModel.addBinding(this.createBindingDisplay(childSeb, conformanceProfileId,
          ViewScope.CONFORMANCEPROFILE, 1, valueSetsMap));
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
            fModel.setIdPath(f.getId());
            fModel.setPath(f.getPosition() + "");
            fModel.setDatatypeLabel(this.createDatatypeLabel(childDt));
            StructureElementBinding childChildSeb =
                this.findStructureElementBindingByIdFromBinding(childSeb, f.getId());
            if (childChildSeb != null)
              fModel.addBinding(this.createBindingDisplay(childChildSeb, conformanceProfileId,
                  ViewScope.CONFORMANCEPROFILE, 1, valueSetsMap));
            StructureElementBinding fSeb =
                this.findStructureElementBindingByFieldIdForSegment(s, f.getId());
            if (fSeb != null)
              fModel.addBinding(
                  this.createBindingDisplay(fSeb, s.getId(), ViewScope.SEGMENT, 2, valueSetsMap));
            fieldStructureTreeModel.setData(fModel);

            if (childDt instanceof ComplexDatatype) {
              ComplexDatatype fieldDatatype = (ComplexDatatype) childDt;
              if (fieldDatatype.getComponents() != null
                  && fieldDatatype.getComponents().size() > 0) {
                for (Component c : fieldDatatype.getComponents()) {
                  Datatype childChildDt = this.findDatatype(c.getRef().getId(), datatypesMap);
                  if (childChildDt != null) {
                    ComponentStructureTreeModel componentStructureTreeModel =
                        new ComponentStructureTreeModel();
                    ComponentDisplayDataModel cModel = new ComponentDisplayDataModel(c);
                    cModel.setViewScope(ViewScope.SEGMENT);
                    cModel.setIdPath(f.getId() + "-" + c.getId());
                    cModel.setPath(f.getPosition() + "-" + c.getPosition());
                    cModel.setDatatypeLabel(this.createDatatypeLabel(childChildDt));
                    StructureElementBinding childChildChildSeb =
                        this.findStructureElementBindingByIdFromBinding(childChildSeb, c.getId());
                    if (childChildChildSeb != null)
                      cModel.addBinding(this.createBindingDisplay(childChildChildSeb,
                          conformanceProfileId, ViewScope.CONFORMANCEPROFILE, 1, valueSetsMap));
                    StructureElementBinding childFSeb =
                        this.findStructureElementBindingByComponentIdFromStructureElementBinding(
                            fSeb, c.getId());
                    if (childFSeb != null)
                      cModel.addBinding(this.createBindingDisplay(childFSeb, s.getId(),
                          ViewScope.SEGMENT, 2, valueSetsMap));
                    StructureElementBinding cSeb = this
                        .findStructureElementBindingByComponentIdForDatatype(childDt, c.getId());
                    if (cSeb != null)
                      cModel.addBinding(this.createBindingDisplay(cSeb, childDt.getId(),
                          ViewScope.DATATYPE, 3, valueSetsMap));
                    componentStructureTreeModel.setData(cModel);
                    if (childChildDt instanceof ComplexDatatype) {
                      ComplexDatatype componentDatatype = (ComplexDatatype) childChildDt;
                      if (componentDatatype.getComponents() != null
                          && componentDatatype.getComponents().size() > 0) {
                        for (Component sc : componentDatatype.getComponents()) {
                          Datatype childChildChildDt =
                              this.findDatatype(sc.getRef().getId(), datatypesMap);
                          if (childChildChildDt != null) {
                            SubComponentStructureTreeModel subComponentStructureTreeModel =
                                new SubComponentStructureTreeModel();
                            SubComponentDisplayDataModel scModel =
                                new SubComponentDisplayDataModel(sc);
                            scModel.setViewScope(ViewScope.SEGMENT);
                            scModel.setIdPath(f.getId() + "-" + c.getId() + "-" + sc.getId());
                            scModel.setPath(
                                f.getPosition() + "-" + c.getPosition() + "-" + sc.getPosition());
                            scModel.setDatatypeLabel(this.createDatatypeLabel(childChildChildDt));
                            StructureElementBinding childChildChildChildSeb =
                                this.findStructureElementBindingByIdFromBinding(childChildChildSeb,
                                    sc.getId());
                            if (childChildChildChildSeb != null)
                              scModel.addBinding(this.createBindingDisplay(childChildChildChildSeb,
                                  conformanceProfileId, ViewScope.CONFORMANCEPROFILE, 1,
                                  valueSetsMap));
                            StructureElementBinding childChildFSeb =
                                this.findStructureElementBindingByComponentIdFromStructureElementBinding(
                                    childFSeb, sc.getId());
                            if (childChildFSeb != null)
                              scModel.addBinding(this.createBindingDisplay(childChildFSeb,
                                  s.getId(), ViewScope.SEGMENT, 2, valueSetsMap));
                            StructureElementBinding childCSeb =
                                this.findStructureElementBindingByComponentIdFromStructureElementBinding(
                                    cSeb, sc.getId());
                            if (childCSeb != null)
                              scModel.addBinding(this.createBindingDisplay(childCSeb,
                                  childDt.getId(), ViewScope.DATATYPE, 3, valueSetsMap));
                            StructureElementBinding scSeb =
                                this.findStructureElementBindingByComponentIdForDatatype(
                                    childChildDt, sc.getId());
                            if (scSeb != null)
                              scModel.addBinding(this.createBindingDisplay(scSeb,
                                  childChildDt.getId(), ViewScope.DATATYPE, 4, valueSetsMap));
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

  private GroupStructureTreeModel createGroupStructureTreeModel(Group group,
      HashMap<String, Datatype> datatypesMap, HashMap<String, Segment> segmentsMap,
      HashMap<String, Valueset> valueSetsMap, String parentIdPath, String parentPath,
      Binding parentBinding, String conformanceProfileId) {
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

    StructureElementBinding childSeb =
        this.findStructureElementBindingByIdFromBinding(parentBinding, group.getId());
    if (childSeb != null)
      groupDisplayModel.addBinding(this.createBindingDisplay(childSeb, conformanceProfileId,
          ViewScope.CONFORMANCEPROFILE, 1, valueSetsMap));

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

  /**
   * @param parentSeb
   * @param id
   * @return
   */
  private StructureElementBinding findStructureElementBindingByIdFromBinding(Binding binding,
      String id) {
    if (binding != null && binding.getChildren() != null) {
      for (StructureElementBinding child : binding.getChildren()) {
        if (child.getElementId().equals(id))
          return child;
      }
    }
    return null;
  }

  private BindingDisplay createBindingDisplay(StructureElementBinding seb, String sourceId,
      ViewScope sourceType, int priority, HashMap<String, Valueset> valueSetsMap) {
    BindingDisplay bindingDisplay = new BindingDisplay();
    bindingDisplay.setSourceId(sourceId);
    bindingDisplay.setSourceType(sourceType);
    bindingDisplay.setPriority(priority);
    bindingDisplay.setComments(seb.getComments());
    bindingDisplay.setConstantValue(seb.getConstantValue());
    bindingDisplay.setExternalSingleCode(seb.getExternalSingleCode());
    bindingDisplay.setInternalSingleCode(seb.getInternalSingleCode());
    bindingDisplay.setPredicate(seb.getPredicate());
    bindingDisplay
        .setValuesetBindings(this.covertDisplayVSBinding(seb.getValuesetBindings(), valueSetsMap));
    return bindingDisplay;
  }

  private Set<DisplayValuesetBinding> covertDisplayVSBinding(Set<ValuesetBinding> valuesetBindings,
      HashMap<String, Valueset> valueSetsMap) {
    if (valuesetBindings != null) {
      Set<DisplayValuesetBinding> result = new HashSet<DisplayValuesetBinding>();
      for (ValuesetBinding vb : valuesetBindings) {
        Valueset vs = valueSetsMap.get(vb.getValuesetId());
        if (vs == null) {
          vs = this.valuesetService.findById(vb.getValuesetId());
          valueSetsMap.put(vs.getId(), vs);
        }
        if (vs != null) {
          DisplayValuesetBinding dvb = new DisplayValuesetBinding();
          dvb.setLabel(vs.getBindingIdentifier());
          dvb.setName(vs.getName());
          dvb.setStrength(vb.getStrength());
          dvb.setValuesetId(vb.getValuesetId());
          dvb.setValuesetLocations(vb.getValuesetLocations());
          result.add(dvb);
        }
      }
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

  private StructureElementBinding findStructureElementBindingByFieldIdForSegment(Segment segment,
      String fId) {
    if (segment != null && segment.getBinding() != null
        && segment.getBinding().getChildren() != null) {
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

  private StructureElementBinding findStructureElementBindingByComponentIdForDatatype(Datatype dt,
      String cid) {
    if (dt != null && dt.getBinding() != null && dt.getBinding().getChildren() != null) {
      for (StructureElementBinding seb : dt.getBinding().getChildren()) {
        if (seb.getElementId().equals(cid))
          return seb;
      }
    }
    return null;
  }

  @Override
  public void applyChanges(ConformanceProfile cp, List<ChangeItemDomain> cItems)
      throws JsonProcessingException, IOException {
    Collections.sort(cItems);
    for (ChangeItemDomain item : cItems) {
      if (item.getPropertyType().equals(PropertyType.USAGE)) {
        SegmentRefOrGroup srog = this.findSegmentRefOrGroupById(cp.getChildren(), item.getLocation());
        if (srog != null) {
          item.setOldPropertyValue(srog.getUsage());
          srog.setUsage(Usage.valueOf((String) item.getPropertyValue()));
        }
      } else if (item.getPropertyType().equals(PropertyType.SEGMENTREF)) {
        SegmentRefOrGroup srog = this.findSegmentRefOrGroupById(cp.getChildren(), item.getLocation());
        if (srog != null && srog instanceof SegmentRef) {
          SegmentRef sr = (SegmentRef)srog;
          item.setOldPropertyValue(sr.getRef());
          ObjectMapper mapper = new ObjectMapper();
          String jsonInString = mapper.writeValueAsString(item.getPropertyValue());
          sr.setRef(mapper.readValue(jsonInString, Ref.class));
        }
      } else if (item.getPropertyType().equals(PropertyType.CARDINALITYMIN)) {
        SegmentRefOrGroup srog = this.findSegmentRefOrGroupById(cp.getChildren(), item.getLocation());
        if (srog != null) {
          item.setOldPropertyValue(srog.getMin());
          if (item.getPropertyValue() == null) {
            srog.setMin(0);
          } else {
            srog.setMin((Integer) item.getPropertyValue());
          }
        }
      } else if (item.getPropertyType().equals(PropertyType.CARDINALITYMAX)) {
        SegmentRefOrGroup srog = this.findSegmentRefOrGroupById(cp.getChildren(), item.getLocation());
        if (srog != null) {
          item.setOldPropertyValue(srog.getMax());
          if (item.getPropertyValue() == null) {
            srog.setMax("NA");
          } else {
            srog.setMax((String) item.getPropertyValue());
          }
        }
      } else if (item.getPropertyType().equals(PropertyType.VALUESET)) {
        ObjectMapper mapper = new ObjectMapper();
        String jsonInString = mapper.writeValueAsString(item.getPropertyValue());
        StructureElementBinding seb = this.findAndCreateStructureElementBindingByIdPath(cp, item.getLocation());
        item.setOldPropertyValue(seb.getValuesetBindings());
        seb.setValuesetBindings(this.convertDisplayValuesetBinding(new HashSet<DisplayValuesetBinding>(Arrays.asList(mapper.readValue(jsonInString, DisplayValuesetBinding[].class)))));
      } else if (item.getPropertyType().equals(PropertyType.SINGLECODE)) {
        ObjectMapper mapper = new ObjectMapper();
        String jsonInString = mapper.writeValueAsString(item.getPropertyValue());
        StructureElementBinding seb = this.findAndCreateStructureElementBindingByIdPath(cp, item.getLocation());
        item.setOldPropertyValue(seb.getExternalSingleCode());
        seb.setExternalSingleCode(mapper.readValue(jsonInString, ExternalSingleCode.class));
      } else if (item.getPropertyType().equals(PropertyType.CONSTANTVALUE)) {
        StructureElementBinding seb =
            this.findAndCreateStructureElementBindingByIdPath(cp, item.getLocation());
        item.setOldPropertyValue(seb.getConstantValue());
        if (item.getPropertyValue() == null) {
          seb.setConstantValue(null);
        } else {
          seb.setConstantValue((String) item.getPropertyValue());
        }
      } else if (item.getPropertyType().equals(PropertyType.DEFINITIONTEXT)) {
        SegmentRefOrGroup srog = this.findSegmentRefOrGroupById(cp.getChildren(), item.getLocation());
        if (srog != null) {
          item.setOldPropertyValue(srog.getText());
          if (item.getPropertyValue() == null) {
            srog.setText(null);
          } else {
            srog.setText((String) item.getPropertyValue());
          }
        }
      } else if (item.getPropertyType().equals(PropertyType.COMMENT)) {
        ObjectMapper mapper = new ObjectMapper();
        String jsonInString = mapper.writeValueAsString(item.getPropertyValue());
        StructureElementBinding seb =
            this.findAndCreateStructureElementBindingByIdPath(cp, item.getLocation());
        item.setOldPropertyValue(seb.getComments());
        seb.setComments(
            new HashSet<Comment>(Arrays.asList(mapper.readValue(jsonInString, Comment[].class))));
      } else if (item.getPropertyType().equals(PropertyType.STATEMENT)) {
        ObjectMapper mapper = new ObjectMapper();
        String jsonInString = mapper.writeValueAsString(item.getPropertyValue());
        if (item.getChangeType().equals(ChangeType.ADD)) {
          cp.getBinding().addConformanceStatement(mapper.readValue(jsonInString, ConformanceStatement.class));
        } else if (item.getChangeType().equals(ChangeType.DELETE)) {
          item.setOldPropertyValue(this.deleteConformanceStatementById(cp, item.getLocation()));
        } else if (item.getChangeType().equals(ChangeType.UPDATE)) {
          item.setOldPropertyValue(this.deleteConformanceStatementById(cp, item.getLocation()));
          cp.getBinding().addConformanceStatement(mapper.readValue(jsonInString, ConformanceStatement.class));
        }
      }
    }
    this.save(cp);
  }
  
  /**
   * @param children
   * @param location
   * @return
   */
  private SegmentRefOrGroup findSegmentRefOrGroupById(Set<SegmentRefOrGroup> children, String idPath) {
    if (idPath.contains("-")) {
      for(SegmentRefOrGroup srog : children){
        if(srog instanceof Group){
          Group g = (Group)srog;
          if(srog.getId().equals(idPath.split("\\-")[0])) return this.findSegmentRefOrGroupById(g.getChildren(), idPath.replace(idPath.split("\\-")[0] + "-", ""));          
        }
      }
    }else{
      for(SegmentRefOrGroup srog : children){
        if(srog.getId().equals(idPath)) return srog;
      }
    }
    return null;
  }

  private ConformanceStatement deleteConformanceStatementById(ConformanceProfile cp, String location) {
    ConformanceStatement toBeDeleted = null;
    for (ConformanceStatement cs : cp.getBinding().getConformanceStatements()) {
      if (cs.getIdentifier().equals(location))
        toBeDeleted = cs;
    }
    if (toBeDeleted != null)
      cp.getBinding().getConformanceStatements().remove(toBeDeleted);
    return toBeDeleted;
  }
  
  private Set<ValuesetBinding> convertDisplayValuesetBinding(
      HashSet<DisplayValuesetBinding> displayValuesetBindings) {
    if (displayValuesetBindings != null) {
      Set<ValuesetBinding> result = new HashSet<ValuesetBinding>();
      for (DisplayValuesetBinding dvb : displayValuesetBindings) {
        ValuesetBinding vb = new ValuesetBinding();
        vb.setStrength(dvb.getStrength());
        vb.setValuesetId(dvb.getValuesetId());
        vb.setValuesetLocations(dvb.getValuesetLocations());
        result.add(vb);
      }
      return result;
    }
    return null;
  }
  
  private StructureElementBinding findAndCreateStructureElementBindingByIdPath(ConformanceProfile cp, String location) {
    if (cp.getBinding() == null) {
      ResourceBinding binding = new ResourceBinding();
      binding.setElementId(cp.getId());
      cp.setBinding(binding);
    }
    return this.findAndCreateStructureElementBindingByIdPath(cp.getBinding(), location);
  }
  
  private StructureElementBinding findAndCreateStructureElementBindingByIdPath(
      ResourceBinding binding, String location) {
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
  
  private StructureElementBinding findAndCreateStructureElementBindingByIdPath(
      StructureElementBinding binding, String location) {
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
}


