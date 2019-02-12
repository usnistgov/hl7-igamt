package gov.nist.hit.hl7.igamt.delta.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import gov.nist.diff.domain.DeltaMode;
import gov.nist.diff.domain.DeltaObject;
import gov.nist.diff.service.DeltaProcessor;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.ConformanceProfileStructureDisplay;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DatatypeStructureDisplay;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentStructureDisplay;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;

@Service
public class DeltaServiceImpl implements DeltaService {

  @Autowired
  public ConformanceProfileService conformanceProfileService;
  @Autowired
  public SegmentService segmentService;
  @Autowired
  public DatatypeService datatypeService;

  @Override
  public DeltaObject<ConformanceProfileStructureDisplay> conformanceProfileDelta(String idA,
      String idB) throws Exception {

    ConformanceProfile profileA = conformanceProfileService.findById(idA);
    ConformanceProfile profileB = conformanceProfileService.findById(idB);
    DeltaProcessor delta = new DeltaProcessor();

    if (profileA == null || profileB == null) {
      throw new Exception();
    } else {
      ConformanceProfileStructureDisplay profileDisplayA =
          conformanceProfileService.convertDomainToDisplayStructure(profileA, true);
      ConformanceProfileStructureDisplay profileDisplayB =
          conformanceProfileService.convertDomainToDisplayStructure(profileB, true);

      return delta.objectDelta(profileDisplayA, profileDisplayB, DeltaMode.INCLUSIVE);
    }
  }

  @Override
  public DeltaObject<SegmentStructureDisplay> segmentDelta(String idA, String idB)
      throws Exception {

    Segment segmentA = segmentService.findById(idA);
    Segment segmentB = segmentService.findById(idB);
    DeltaProcessor delta = new DeltaProcessor();

    if (segmentA == null || segmentB == null) {
      throw new Exception();
    } else {
      SegmentStructureDisplay segmentDisplayA =
          segmentService.convertDomainToDisplayStructure(segmentA, true);
      SegmentStructureDisplay segmentDisplayB =
          segmentService.convertDomainToDisplayStructure(segmentB, true);

      return delta.objectDelta(segmentDisplayA, segmentDisplayB, DeltaMode.INCLUSIVE);
    }
  }

  @Override
  public DeltaObject<DatatypeStructureDisplay> datatypeDelta(String idA, String idB)
      throws Exception {

    Datatype datatypeA = datatypeService.findById(idA);
    Datatype datatypeB = datatypeService.findById(idB);
    DeltaProcessor delta = new DeltaProcessor();

    if (datatypeA == null || datatypeB == null) {
      throw new Exception();
    } else {
      DatatypeStructureDisplay datatypeDisplayA =
          datatypeService.convertDomainToStructureDisplay(datatypeA, true);
      DatatypeStructureDisplay datatypeDisplayB =
          datatypeService.convertDomainToStructureDisplay(datatypeB, true);

      return delta.objectDelta(datatypeDisplayA, datatypeDisplayB, DeltaMode.INCLUSIVE);
    }
  }
}
