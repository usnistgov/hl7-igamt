package gov.nist.hit.hl7.igamt.delta.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import gov.nist.diff.domain.DeltaObject;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.ConformanceProfileStructureDisplay;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DatatypeStructureDisplay;
import gov.nist.hit.hl7.igamt.delta.service.DeltaService;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentStructureDisplay;

@RestController
public class DeltaController {

  @Autowired
  private DeltaService deltaService;

  @RequestMapping(value = "/api/delta/conformanceprofile/{idA}/{idB}", method = RequestMethod.GET,
      produces = {"application/json"})
  public DeltaObject<ConformanceProfileStructureDisplay> deltaConformanceProfile(
      @PathVariable("idA") String idA, @PathVariable("idB") String idB,
      Authentication authentication) throws Exception {

    return deltaService.conformanceProfileDelta(idA, idB);
  }

  @RequestMapping(value = "/api/delta/segment/{idA}/{idB}", method = RequestMethod.GET,
      produces = {"application/json"})
  public DeltaObject<SegmentStructureDisplay> deltaSegment(@PathVariable("idA") String idA,
      @PathVariable("idB") String idB, Authentication authentication) throws Exception {

    return deltaService.segmentDelta(idA, idB);
  }

  @RequestMapping(value = "/api/delta/datatype/{idA}/{idB}", method = RequestMethod.GET,
      produces = {"application/json"})
  public DeltaObject<DatatypeStructureDisplay> deltaDatatype(@PathVariable("idA") String idA,
      @PathVariable("idB") String idB, Authentication authentication) throws Exception {

    return deltaService.datatypeDelta(idA, idB);
  }

}
