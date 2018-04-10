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
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.serialization.SerializableIG;
import gov.nist.hit.hl7.igamt.ig.service.IgSerializationService;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import gov.nist.hit.hl7.igamt.shared.domain.Link;
import gov.nist.hit.hl7.igamt.shared.domain.Registry;
import gov.nist.hit.hl7.igamt.shared.domain.Type;
import gov.nist.hit.hl7.igamt.shared.domain.exception.ConformanceProfileNotFoundException;
import gov.nist.hit.hl7.igamt.shared.domain.exception.DatatypeNotFoundException;
import gov.nist.hit.hl7.igamt.shared.domain.exception.SegmentNotFoundException;
import gov.nist.hit.hl7.igamt.shared.domain.exception.ValuesetNotFoundException;
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

  /* (non-Javadoc)
   * @see gov.nist.hit.hl7.igamt.ig.service.IgSerializationService#serializeIgDocument(gov.nist.hit.hl7.igamt.ig.domain.Ig)
   */
  @Override
  public String serializeIgDocument(Ig igDocument) throws SerializationException {
    try {
    Map<String, Datatype> datatypesMap = this.initializeDatatypesMap(igDocument.getDatatypeLibrary());
    Map<String, Valueset> valuesetsMap = this.initializeValuesetsMap(igDocument.getValueSetLibrary());
    Map<String, Segment> segmentsMap = this.initializeSegmentsMap(igDocument.getSegmentLibrary());
    Map<String, ConformanceProfile> conformanceProfilesMap = this.initializeConformanceProfilesMap(igDocument.getConformanceProfileLibrary());
    SerializableIG serializableIG = new SerializableIG(igDocument, "1", datatypesMap, valuesetsMap, segmentsMap, conformanceProfilesMap);
    return serializableIG.serialize().toXML();
    } catch (Exception exception) {
      throw new SerializationException(exception,Type.IGDOCUMENT,"id="+igDocument.getId().getId()+", version="+igDocument.getId().getVersion());
    }
  }

  /**
   * @param conformanceProfileLibrary
   * @return conformanceProfilesMap
   * @throws ConformanceProfileNotFoundException 
   */
  private Map<String, ConformanceProfile> initializeConformanceProfilesMap(Registry conformanceProfileLibrary) throws ConformanceProfileNotFoundException {
    Map<String, ConformanceProfile> conformanceProfilesMap = new HashMap<>();
    for(Link conformanceProfileLink : conformanceProfileLibrary.getChildren()) {
      if(conformanceProfileLink != null && conformanceProfileLink.getId() != null && !conformanceProfilesMap.containsKey(conformanceProfileLink.getId().getId())) {
        ConformanceProfile conformanceProfile = conformanceProfileService.findByKey(conformanceProfileLink.getId());
        if(conformanceProfile != null) {
          conformanceProfilesMap.put(conformanceProfileLink.getId().getId(), conformanceProfile);
        } else {
          throw new ConformanceProfileNotFoundException(conformanceProfileLink.getId().getId());
        }
      }
    }
    return conformanceProfilesMap;
  }

  /**
   * @param segmentLibrary
   * @return segmentsMap
   * @throws SegmentNotFoundException 
   */
  private Map<String, Segment> initializeSegmentsMap(Registry segmentLibrary) throws SegmentNotFoundException {
    Map<String, Segment> segmentsMap = new HashMap<>();
    for(Link segmentLink : segmentLibrary.getChildren()) {
      if(segmentLink != null && segmentLink.getId() != null && !segmentsMap.containsKey(segmentLink.getId().getId())) {
        Segment segment = segmentService.findByKey(segmentLink.getId());
        if(segment != null) {
          segmentsMap.put(segmentLink.getId().getId(), segment);
        } else {
          throw new SegmentNotFoundException(segmentLink.getId().getId());
        }
      }
    }
    return segmentsMap;
  }

  /**
   * @param valuesetLibrary
   * @return valuesetsMap
   * @throws ValuesetNotFoundException 
   */
  private Map<String, Valueset> initializeValuesetsMap(Registry valuesetLibrary) throws ValuesetNotFoundException {
    Map<String, Valueset> valuesetsMap = new HashMap<>();
    for(Link valuesetLink : valuesetLibrary.getChildren()) {
      if(valuesetLink != null && valuesetLink.getId() != null && !valuesetsMap.containsKey(valuesetLink.getId().getId())) {
        Valueset valueset = valuesetService.findById(valuesetLink.getId());
        if(valueset != null) {
          valuesetsMap.put(valuesetLink.getId().getId(), valueset);
        } else {
          throw new ValuesetNotFoundException(valuesetLink.getId().getId());
        }
      }
    }
    return valuesetsMap;
  }

  /**
   * @param datatypeLibrary
   * @return datatypesMap
   * @throws DatatypeNotFoundException 
   */
  private Map<String, Datatype> initializeDatatypesMap(Registry datatypeLibrary) throws DatatypeNotFoundException {
    Map<String, Datatype> datatypesMap = new HashMap<>();
    for(Link datatypeLink : datatypeLibrary.getChildren()) {
      if(datatypeLink != null && datatypeLink.getId() != null && !datatypesMap.containsKey(datatypeLink.getId().getId())) {
        Datatype datatype = datatypeService.findByKey(datatypeLink.getId());
        if(datatype != null) {
          datatypesMap.put(datatypeLink.getId().getId(), datatype);
        } else {
          throw new DatatypeNotFoundException(datatypeLink.getId().getId());
        }
      }
    }
    return datatypesMap;
  }

}
