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
package gov.nist.hit.hl7.igamt.ig.controller;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;

import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.ig.controller.wrappers.AddIngInfo;
import gov.nist.hit.hl7.igamt.ig.controller.wrappers.AddingMessagesWrapper;
import gov.nist.hit.hl7.igamt.ig.controller.wrappers.AddingWrapper;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.model.AddDatatypeResponseDisplay;
import gov.nist.hit.hl7.igamt.ig.model.AddDatatypeResponseObject;
import gov.nist.hit.hl7.igamt.ig.model.AddMessageResponseDisplay;
import gov.nist.hit.hl7.igamt.ig.model.AddMessageResponseObject;
import gov.nist.hit.hl7.igamt.ig.model.AddSegmentResponseDisplay;
import gov.nist.hit.hl7.igamt.ig.model.AddSegmentResponseObject;
import gov.nist.hit.hl7.igamt.ig.model.AddValueSetResponseObject;
import gov.nist.hit.hl7.igamt.ig.model.AddValueSetsResponseDisplay;
import gov.nist.hit.hl7.igamt.ig.service.CrudService;
import gov.nist.hit.hl7.igamt.ig.service.DisplayConverterService;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.shared.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.shared.domain.Scope;
import gov.nist.hit.hl7.igamt.shared.messageEvent.Event;
import gov.nist.hit.hl7.igamt.shared.messageEvent.MessageEventService;

/**
 * @author ena3
 *
 */
@RestController
public class AddingController {

  @Autowired
  IgService igService;


  @Autowired
  DisplayConverterService displayConverter;

  @Autowired
  MessageEventService messageEventService;

  @Autowired
  ConformanceProfileService conformanceProfileService;

  @Autowired
  SegmentService segmentService;

  @Autowired
  DatatypeService datatypeService;

  @Autowired
  CrudService crudService;

  @RequestMapping(value = "/api/ig/addConforanceProfile", method = RequestMethod.POST,
      produces = {"application/json"})

  public @ResponseBody AddMessageResponseDisplay addConforanceProfile(
      @RequestBody AddingMessagesWrapper wrapper, Authentication authentication)
      throws JsonParseException, JsonMappingException, FileNotFoundException, IOException {

    String username = authentication.getPrincipal().toString();
    Ig currentIg = igService.findLatestById(wrapper.getId());
    Set<String> savedIds = new HashSet<String>();
    for (Event ev : wrapper.getMsgEvts()) {
      ConformanceProfile profile = conformanceProfileService.findByKey(ev.getId());
      if (profile != null) {
        ConformanceProfile clone = profile.clone();
        clone.setUsername(username);
        clone.setEvent(ev.getName());
        clone.setId(new CompositeKey());
        clone.setName(profile.getName());
        clone = conformanceProfileService.save(clone);
        savedIds.add(clone.getId().getId());
      }
    }
    AddMessageResponseObject objects = crudService.addConformanceProfiles(savedIds, currentIg);
    return displayConverter.convertMessageAddResponseToDisplay(objects);

  }



  @RequestMapping(value = "/api/ig/findHl7Segments/{version:.+}", method = RequestMethod.GET,
      produces = {"application/json"})

  public @ResponseBody List<Segment> find(@PathVariable String version,
      Authentication authentication) {

    return segmentService.findDisplayFormatByScopeAndVersion(Scope.HL7STANDARD.toString(), version);

  }


  @RequestMapping(value = "/api/ig/findHl7Datatypes/{version:.+}", method = RequestMethod.GET,
      produces = {"application/json"})

  public @ResponseBody List<Datatype> findHl7Datatypes(@PathVariable String version,
      Authentication authentication) {

    return datatypeService.findDisplayFormatByScopeAndVersion(Scope.HL7STANDARD.toString(),
        version);

  }


  @RequestMapping(value = "/api/ig/addSegments", method = RequestMethod.POST,
      produces = {"application/json"})

  public @ResponseBody AddSegmentResponseDisplay addSegments(@RequestBody AddingWrapper wrapper,
      Authentication authentication)
      throws JsonParseException, JsonMappingException, FileNotFoundException, IOException {

    String username = authentication.getPrincipal().toString();
    Ig currentIg = igService.findLatestById(wrapper.getId());
    Set<String> savedIds = new HashSet<String>();
    for (AddIngInfo elm : wrapper.getToAdd()) {
      if (elm.isFlavor()) {
        Segment segment = segmentService.findByKey(elm.getId());
        if (segment != null) {
          Segment clone = segment.clone();
          clone.setUsername(username);
          clone.setId(new CompositeKey());
          clone.setName(segment.getName());
          clone.setExt(elm.getExt());
          clone = segmentService.save(clone);
          savedIds.add(clone.getId().getId());
        }
      } else {
        savedIds.add(elm.getId().getId());

      }
    }
    AddSegmentResponseObject objects = crudService.addSegments(savedIds, currentIg);
    return displayConverter.convertSegmentResponseToDisplay(objects);

  }


  @RequestMapping(value = "/api/ig/addDatatypes", method = RequestMethod.POST,
      produces = {"application/json"})

  public @ResponseBody AddDatatypeResponseDisplay addDatatypes(@RequestBody AddingWrapper wrapper,
      Authentication authentication) throws IOException {

    String username = authentication.getPrincipal().toString();
    Ig currentIg = igService.findLatestById(wrapper.getId());
    Set<String> savedIds = new HashSet<String>();
    for (AddIngInfo elm : wrapper.getToAdd()) {
      if (elm.isFlavor()) {
        Datatype datatype = datatypeService.findByKey(elm.getId());
        if (datatype != null) {
          Datatype clone = datatype.clone();
          clone.setUsername(username);
          clone.setId(new CompositeKey());
          clone.setName(datatype.getName());
          clone.setExt(elm.getExt());
          clone = datatypeService.save(clone);
          savedIds.add(clone.getId().getId());
        }
      } else {
        savedIds.add(elm.getId().getId());

      }
    }
    AddDatatypeResponseObject objects = crudService.addDatatypes(savedIds, currentIg);
    return displayConverter.convertDatatypeResponseToDisplay(objects);

  }

  @RequestMapping(value = "/api/ig/addValueSets", method = RequestMethod.POST,
      produces = {"application/json"})

  public @ResponseBody AddValueSetsResponseDisplay addValueSets(@RequestBody AddingWrapper wrapper,
      Authentication authentication) throws IOException {

    String username = authentication.getPrincipal().toString();
    Ig currentIg = igService.findLatestById(wrapper.getId());
    Set<String> savedIds = new HashSet<String>();
    for (AddIngInfo elm : wrapper.getToAdd()) {
      if (elm.isFlavor()) {
        Datatype datatype = datatypeService.findByKey(elm.getId());
        if (datatype != null) {
          Datatype clone = datatype.clone();
          clone.setUsername(username);
          clone.setId(new CompositeKey());
          clone.setName(datatype.getName());
          clone.setExt(elm.getExt());
          clone = datatypeService.save(clone);
          savedIds.add(clone.getId().getId());
        }
      } else {
        savedIds.add(elm.getId().getId());

      }
    }
    AddValueSetResponseObject objects = crudService.addValueSets(savedIds, currentIg);
    return displayConverter.convertDatatypeResponseToDisplay(objects);

  }

}
