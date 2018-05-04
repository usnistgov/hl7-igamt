package gov.nist.hit.hl7.igamt.segment.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentMetadata;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentPostDef;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentPreDef;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentStructure;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;


@RestController
public class SegmentController {

  @Autowired
  SegmentService segmentService;

  public SegmentController() {
    // TODO Auto-generated constructor stub
  }

  @RequestMapping(value = "/api/segments/{id}/structure", method = RequestMethod.GET,
      produces = {"application/json"})

  public @ResponseBody SegmentStructure getSegmentStructure(@PathVariable("id") String id) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null) {
      Segment segment = segmentService.findLatestById(id);
      return segmentService.convertDomainToStructure(segment);
    } else {
      return null;
    }
  }
  
  @RequestMapping(value = "/api/segments/{id}/metadata", method = RequestMethod.GET,
      produces = {"application/json"})

  public @ResponseBody SegmentMetadata getSegmentMetadata(@PathVariable("id") String id) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null) {
      Segment segment = segmentService.findLatestById(id);
      return segmentService.convertDomainToMetadata(segment);
    } else {
      return null;
    }
  }
  
  @RequestMapping(value = "/api/segments/{id}/predef", method = RequestMethod.GET,
      produces = {"application/json"})

  public @ResponseBody SegmentPreDef getSegmentPredef(@PathVariable("id") String id) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null) {
      Segment segment = segmentService.findLatestById(id);
      return segmentService.convertDomainToPredef(segment);
    } else {
      return null;
    }
  }
  
  @RequestMapping(value = "/api/segments/{id}/postdef", method = RequestMethod.GET,
      produces = {"application/json"})

  public @ResponseBody SegmentPostDef getSegmentPostdef(@PathVariable("id") String id) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null) {
      Segment segment = segmentService.findLatestById(id);
      return segmentService.convertDomainToPostdef(segment);
    } else {
      return null;
    }
  }
}
