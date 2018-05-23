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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.ChangedConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.datatype.domain.display.ChangedDatatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.ig.model.ChangedObjects;
import gov.nist.hit.hl7.igamt.ig.service.SaveService;
import gov.nist.hit.hl7.igamt.segment.domain.display.ChangedSegment;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;

/**
 *
 * @author Maxence Lefort on May 8, 2018.
 */
@Service
public class SaveServiceImpl implements SaveService {

  @Autowired
  SegmentService segmentService;

  @Autowired
  DatatypeService datatypeService;

  @Autowired
  ConformanceProfileService conformanceProfileService;

  Logger logger = LoggerFactory.getLogger(SaveServiceImpl.class);

  @Override
  public void saveChangedObjects(ChangedObjects changedObjects) {
    if (changedObjects != null) {
      // Save value sets
      // TODO Add value sets save
      // Save datatypes
      if (changedObjects.getDatatypes() != null && !changedObjects.getDatatypes().isEmpty()) {
        logger.debug("Saving " + changedObjects.getDatatypes().size() + " datatypes");
        for (ChangedDatatype changedDatatype : changedObjects.getDatatypes()) {
          datatypeService.saveDatatype(changedDatatype);
        }
      }
      // Save segments
      if (changedObjects.getSegments() != null && !changedObjects.getSegments().isEmpty()) {
        logger.debug("Saving " + changedObjects.getSegments().size() + " segments");
        for (ChangedSegment changedSegment : changedObjects.getSegments()) {
          segmentService.saveSegment(changedSegment);
        }
      }
      // Save conformance profiles
      if (changedObjects.getConformanceProfiles() != null
          && !changedObjects.getConformanceProfiles().isEmpty()) {
        logger.debug(
            "Saving " + changedObjects.getConformanceProfiles().size() + " conformance profiles");
        for (ChangedConformanceProfile changedConformanceProfile : changedObjects
            .getConformanceProfiles()) {
          conformanceProfileService.saveConformanceProfile(changedConformanceProfile);
        }
      }
    }
  }

}
