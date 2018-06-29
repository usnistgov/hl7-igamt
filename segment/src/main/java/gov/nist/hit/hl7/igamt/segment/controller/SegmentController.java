package gov.nist.hit.hl7.igamt.segment.controller;

import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.mongodb.BasicDBObject;

import gov.nist.hit.hl7.igamt.datatype.domain.display.DisplayMetadata;
import gov.nist.hit.hl7.igamt.datatype.domain.display.PostDef;
import gov.nist.hit.hl7.igamt.datatype.domain.display.PreDef;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentConformanceStatement;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentStructure;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.xreference.service.XRefService;


@RestController
public class SegmentController {

  @Autowired
  SegmentService segmentService;

  @Autowired
  private XRefService xRefService;

  public SegmentController() {
    // TODO Auto-generated constructor stub
  }

  @RequestMapping(value = "/api/segments/{id}/structure", method = RequestMethod.GET,
      produces = {"application/json"})

  public @ResponseBody SegmentStructure getSegmentStructure(@PathVariable("id") String id,
      Authentication authentication) {

    Segment segment = segmentService.findLatestById(id);
    return segmentService.convertDomainToStructure(segment);

  }



  @RequestMapping(value = "/api/segments/{id}/conformancestatement", method = RequestMethod.GET,
      produces = {"application/json"})

  public @ResponseBody SegmentConformanceStatement getSegmentConformanceStatement(
      @PathVariable("id") String id, Authentication authentication) {

    Segment segment = segmentService.findLatestById(id);
    return segmentService.convertDomainToConformanceStatement(segment);

  }

  @RequestMapping(value = "/api/segments/{id}/metadata", method = RequestMethod.GET,
      produces = {"application/json"})

  public @ResponseBody DisplayMetadata getSegmentMetadata(@PathVariable("id") String id,
      Authentication authentication) {

    Segment segment = segmentService.findLatestById(id);
    return segmentService.convertDomainToMetadata(segment);

  }

  @RequestMapping(value = "/api/segments/{id}/predef", method = RequestMethod.GET,
      produces = {"application/json"})

  public @ResponseBody PreDef getSegmentPredef(@PathVariable("id") String id,
      Authentication authentication) {
    Segment segment = segmentService.findLatestById(id);
    return segmentService.convertDomainToPredef(segment);

  }

  @RequestMapping(value = "/api/segments/{id}/postdef", method = RequestMethod.GET,
      produces = {"application/json"})

  public @ResponseBody PostDef getSegmentPostdef(@PathVariable("id") String id,
      Authentication authentication) {

    Segment segment = segmentService.findLatestById(id);
    return segmentService.convertDomainToPostdef(segment);

  }


  @RequestMapping(value = "/api/segments/{id}/crossref", method = RequestMethod.POST,
      produces = {"application/json"})
  public @ResponseBody Map<String, List<BasicDBObject>> getDatatypeCrossRef(
      @PathVariable("id") String id,
      @RequestParam("filterConformanceProfileIds") Set<String> filterConformanceProfileIds,
      Authentication authentication) {
    Map<String, List<BasicDBObject>> results =
        xRefService.getSegmentReferences(id, filterConformanceProfileIds);
    return results;
  }

  @RequestMapping(value = "/api/segments/{id}/structure", method = RequestMethod.POST,
      produces = {"application/json"})

  public @ResponseBody SegmentStructure saveStructure(@PathVariable("id") String id,
      @RequestBody SegmentStructure structure, Authentication authentication) {
    Segment segment = structure.toSegment();
    segmentService.save(segment);
  }


}
