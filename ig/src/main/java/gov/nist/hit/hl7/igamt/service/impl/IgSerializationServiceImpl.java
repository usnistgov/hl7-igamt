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
package gov.nist.hit.hl7.igamt.service.impl;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.MsgStructElement;
import gov.nist.hit.hl7.igamt.common.base.domain.Registry;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.exception.ConformanceProfileNotFoundException;
import gov.nist.hit.hl7.igamt.common.exception.DatatypeNotFoundException;
import gov.nist.hit.hl7.igamt.common.exception.SegmentNotFoundException;
import gov.nist.hit.hl7.igamt.common.exception.ValuesetNotFoundException;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.Group;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRef;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.UsageConfiguration;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.serialization.SerializableIG;
import gov.nist.hit.hl7.igamt.ig.service.IgSerializationService;
import gov.nist.hit.hl7.igamt.segment.domain.Field;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;

/**
 *
 * @author Maxence Lefort on Apr 9, 2018.
 */
@Service("igSerializationService")
public class IgSerializationServiceImpl implements IgSerializationService {

  @Autowired
  private DatatypeService datatypeService;

  @Autowired
  private ValuesetService valuesetService;

  @Autowired
  private SegmentService segmentService;

  @Autowired
  private ConformanceProfileService conformanceProfileService;

  private Set<String> bindedGroupsAndSegmentRefs = new HashSet<>();
  private Set<String> bindedFields = new HashSet<>();
  private Set<String> bindedSegments = new HashSet<>();
  private Set<String> bindedDatatypes = new HashSet<>();
  private Set<String> bindedValueSets = new HashSet<>();

  private Map<String, ConformanceProfile> conformanceProfilesMap = new HashMap<>();
  private Map<String, Datatype> datatypesMap = new HashMap<>();
  private Map<String, Valueset> valuesetsMap = new HashMap<>();
  private Map<String, Segment> segmentsMap = new HashMap<>();


  /*
   * (non-Javadoc)
   * 
   * @see
   * gov.nist.hit.hl7.igamt.ig.service.IgSerializationService#serializeIgDocument(gov.nist.hit.hl7.
   * igamt.ig.domain.Ig)
   */
  @Override
  public String serializeIgDocument(Ig igDocument, ExportConfiguration exportConfiguration)
      throws SerializationException {
    try {
      this.initializeConformanceProfilesMap(igDocument.getConformanceProfileRegistry(),
          exportConfiguration.getSegmentORGroupsMessageExport());
      this.initializeSegmentsMap(igDocument.getSegmentRegistry(),
          exportConfiguration.getSegmentsExport(), exportConfiguration.getDatatypesExport(),
          exportConfiguration.getValueSetsExport());
      this.initializeDatatypesMap(igDocument.getDatatypeRegistry(),
          exportConfiguration.getDatatypesExport());
      this.initializeValuesetsMap(igDocument.getValueSetRegistry(),
          exportConfiguration.getValueSetsExport());
      SerializableIG serializableIG = new SerializableIG(igDocument, "1", datatypesMap,
          valuesetsMap, segmentsMap, conformanceProfilesMap, exportConfiguration);
      return serializableIG.serialize().toXML();
    } catch (Exception exception) {
      throw new SerializationException(exception, Type.IGDOCUMENT,
          "id=" + igDocument.getId().getId() + ", version=" + igDocument.getId().getVersion());
    }
  }

  /**
   * @param conformanceProfileLibrary
   * @return conformanceProfilesMap
   * @throws ConformanceProfileNotFoundException
   */
  private void initializeConformanceProfilesMap(Registry conformanceProfileLibrary,
      UsageConfiguration usageConfiguration) throws ConformanceProfileNotFoundException {
    for (Link conformanceProfileLink : conformanceProfileLibrary.getChildren()) {
      if (conformanceProfileLink != null && conformanceProfileLink.getId() != null
          && !conformanceProfilesMap.containsKey(conformanceProfileLink.getId().getId())) {
        ConformanceProfile conformanceProfile =
            conformanceProfileService.findByKey(conformanceProfileLink.getId());
        if (conformanceProfile != null) {
          conformanceProfilesMap.put(conformanceProfileLink.getId().getId(), conformanceProfile);
          for (MsgStructElement msgStructElement : conformanceProfile.getChildren()) {
            identifyBindedSegments(msgStructElement, usageConfiguration);
          }
        } else {
          throw new ConformanceProfileNotFoundException(conformanceProfileLink.getId().getId());
        }
      }
    }
  }

  /**
   * @param msgStructElement
   * @param usageConfiguration
   */
  private void identifyBindedSegments(MsgStructElement msgStructElement,
      UsageConfiguration usageConfiguration) {
    if (!this.bindedGroupsAndSegmentRefs.contains(msgStructElement.getId())) {
      if (usageConfiguration.isBinded(msgStructElement.getUsage())) {
        this.bindedGroupsAndSegmentRefs.add(msgStructElement.getId());
        if (msgStructElement instanceof Group) {
          for (MsgStructElement groupStructElement : ((Group) msgStructElement).getChildren()) {
            identifyBindedSegments(groupStructElement, usageConfiguration);
          }
        } else if (msgStructElement instanceof SegmentRef) {
          bindedSegments.add(((SegmentRef) msgStructElement).getRef().getId());
        }
      }
    }
  }

  /**
   * @param segmentLibrary
   * @return segmentsMap
   * @throws SegmentNotFoundException
   */
  private void initializeSegmentsMap(Registry segmentLibrary, UsageConfiguration usageConfiguration,
      UsageConfiguration datatapeUsageConfiguration, UsageConfiguration valuesetUsageConfiguration)
      throws SegmentNotFoundException {
    for (Link segmentLink : segmentLibrary.getChildren()) {
      if (segmentLink != null && segmentLink.getId() != null
          && !segmentsMap.containsKey(segmentLink.getId().getId())) {
        Segment segment = segmentService.findByKey(segmentLink.getId());
        if (segment != null) {
          segmentsMap.put(segmentLink.getId().getId(), segment);
          identifyBindedFields(segment, usageConfiguration, datatapeUsageConfiguration,
              valuesetUsageConfiguration);
        } else {
          throw new SegmentNotFoundException(segmentLink.getId().getId());
        }
      }
    }
  }

  /**
   * @param segment
   * @param usageConfiguration
   */
  private void identifyBindedFields(Segment segment, UsageConfiguration segmentUsageConfiguration,
      UsageConfiguration datatapeUsageConfiguration,
      UsageConfiguration valuesetUsageConfiguration) {
    for (Field field : segment.getChildren()) {
      if (!this.bindedFields.contains(field.getId())) {
        if (segmentUsageConfiguration.isBinded(field.getUsage())) {
          this.bindedFields.add(field.getId());
          this.bindedDatatypes.add(field.getRef().getId());
        }
      }
    }
    // TODO identify binded valuesets
  }

  /**
   * @param valuesetLibrary
   * @return valuesetsMap
   * @throws ValuesetNotFoundException
   */
  private void initializeValuesetsMap(Registry valuesetLibrary,
      UsageConfiguration usageConfiguration) throws ValuesetNotFoundException {
    for (Link valuesetLink : valuesetLibrary.getChildren()) {
      if (valuesetLink != null && valuesetLink.getId() != null
          && !valuesetsMap.containsKey(valuesetLink.getId().getId())) {
        Valueset valueset = valuesetService.findById(valuesetLink.getId());
        if (valueset != null) {
          valuesetsMap.put(valuesetLink.getId().getId(), valueset);
        } else {
          throw new ValuesetNotFoundException(valuesetLink.getId().getId());
        }
      }
    }
  }

  /**
   * @param datatypeLibrary
   * @return datatypesMap
   * @throws DatatypeNotFoundException
   */
  private void initializeDatatypesMap(Registry datatypeLibrary,
      UsageConfiguration usageConfiguration) throws DatatypeNotFoundException {
    for (Link datatypeLink : datatypeLibrary.getChildren()) {
      if (datatypeLink != null && datatypeLink.getId() != null
          && !datatypesMap.containsKey(datatypeLink.getId().getId())) {
        Datatype datatype = datatypeService.findByKey(datatypeLink.getId());
        if (datatype != null) {
          datatypesMap.put(datatypeLink.getId().getId(), datatype);
        } else {
          throw new DatatypeNotFoundException(datatypeLink.getId().getId());
        }
      }
    }
  }

}
