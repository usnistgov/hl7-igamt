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
package gov.nist.hit.hl7.igamt.datatypeLibrary.controller;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

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
import com.mongodb.client.result.UpdateResult;

import gov.nist.hit.hl7.igamt.common.base.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.common.base.domain.DocumentMetadata;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.TextSection;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage.Status;
import gov.nist.hit.hl7.igamt.common.exception.IGNotFoundException;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.exception.DatatypeNotFoundException;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.datatypeLibrary.domain.DatatypeClassification;
import gov.nist.hit.hl7.igamt.datatypeLibrary.domain.DatatypeLibrary;
import gov.nist.hit.hl7.igamt.datatypeLibrary.exceptions.AddingException;
import gov.nist.hit.hl7.igamt.datatypeLibrary.exceptions.DatatypeLibraryConverterException;
import gov.nist.hit.hl7.igamt.datatypeLibrary.exceptions.DatatypeLibraryNotFoundException;
import gov.nist.hit.hl7.igamt.datatypeLibrary.exceptions.DatatypeLibraryUpdateException;
import gov.nist.hit.hl7.igamt.datatypeLibrary.model.DatatypeLibraryDisplay;
import gov.nist.hit.hl7.igamt.datatypeLibrary.service.DatatypeClassificationService;
import gov.nist.hit.hl7.igamt.datatypeLibrary.service.DatatypeLibraryDisplayConverterService;
import gov.nist.hit.hl7.igamt.datatypeLibrary.service.DatatypeLibraryService;
import gov.nist.hit.hl7.igamt.datatypeLibrary.service.DeltaService;
import gov.nist.hit.hl7.igamt.datatypeLibrary.util.DeltaTreeNode;
import gov.nist.hit.hl7.igamt.datatypeLibrary.util.EvolutionPropertie;
import gov.nist.hit.hl7.igamt.datatypeLibrary.wrappers.AddingInfo;
import gov.nist.hit.hl7.igamt.datatypeLibrary.wrappers.CreatingWrapper;


/**
 * @author ena3
 *
 */

@RestController
public class DatatypeLibaryController {


  @Autowired
  private DatatypeService datatypeService;

  @Autowired
  private DeltaService deltaService;
  @Autowired

  DatatypeClassificationService datatypeClassificationService;

  @Autowired
  DatatypeLibraryService dataypeLibraryService;

  @Autowired
  DatatypeLibraryDisplayConverterService displayConverterService;


  private static final String DATATYPE_DELETED = "DATATYPE_DELETED";

  private static final String TABLE_OF_CONTENT_UPDATED = "TABLE_OF_CONTENT_UPDATED";
  private static final String METATDATA_UPDATED = "METATDATA_UPDATED";


  @RequestMapping(
      value = "/api/datatype-library/comparedatatype/{name}/{version1:.+}/{version2:.+}",
      method = RequestMethod.GET, produces = {"application/json"})

  public @ResponseBody List<DeltaTreeNode> getMessageEvents(@PathVariable("name") String name,
      @PathVariable("version1") String version1, @PathVariable("version2") String version2,
      Authentication authentication) throws DatatypeNotFoundException {


    Datatype d1 = datatypeService.findOneByNameAndVersionAndScope(name, version1,
        Scope.HL7STANDARD.toString());

    Datatype d2 = datatypeService.findOneByNameAndVersionAndScope(name, version2,
        Scope.HL7STANDARD.toString());

    if (d1 == null) {
      throw new DatatypeNotFoundException(name, version1, Scope.HL7STANDARD.toString());

    } else if (d2 == null) {
      throw new DatatypeNotFoundException(name, version2, Scope.HL7STANDARD.toString());

    } else {
      HashMap<EvolutionPropertie, Boolean> criterias1 = new HashMap<EvolutionPropertie, Boolean>();
      criterias1.put(EvolutionPropertie.CONFLENGTH, true);
      criterias1.put(EvolutionPropertie.MAXLENGTH, true);
      criterias1.put(EvolutionPropertie.MINLENGTH, true);
      criterias1.put(EvolutionPropertie.CPDATATYPE, true);
      criterias1.put(EvolutionPropertie.CPNUMBER, true);
      criterias1.put(EvolutionPropertie.CPNAME, true);

      return deltaService.getDatatypesDelta(d1, d2, criterias1).getChildren();
    }
  }

  @RequestMapping(value = "/api/datatype-library/classification", method = RequestMethod.GET,
      produces = {"application/json"})

  public @ResponseBody List<DatatypeClassification> classification()
      throws DatatypeNotFoundException {

    List<DatatypeClassification> ret = datatypeClassificationService.findAll();
    List<DatatypeClassification> ordred =
        ret.stream().sorted((DatatypeClassification l1, DatatypeClassification l2) -> l1.getName()
            .compareTo(l2.getName())).collect(Collectors.toList());

    return ordred;


  }

  @RequestMapping(value = "/api/datatype-library/create", method = RequestMethod.POST,
      produces = {"application/json"})

  public @ResponseBody DatatypeLibrary create(@RequestBody CreatingWrapper wrapper,
      Authentication authentication) throws JsonParseException, JsonMappingException,
      FileNotFoundException, IOException, AddingException {

    String username = authentication.getPrincipal().toString();
    DatatypeLibrary ret = dataypeLibraryService.createEmptyDatatypeLibrary();
    if (wrapper.getToAdd() != null || !wrapper.getToAdd().isEmpty()) {

      Set<String> savedIds = new HashSet<String>();
      for (AddingInfo elm : wrapper.getToAdd()) {
        Datatype datatype = datatypeService.findByKey(elm.getId());
        if (datatype != null) {
          Datatype clone = datatype.clone();
          clone.setUsername(username);
          clone.setId(new CompositeKey());
          clone.setName(datatype.getName());
          clone.setExt(elm.getExt());
          clone.setDomainInfo(elm.getDomainInfo());
          clone = datatypeService.save(clone);
          savedIds.add(clone.getId().getId());
        }
      }

      dataypeLibraryService.addDatatypes(savedIds, ret, wrapper.getScope());


    }
    ret.setId(new CompositeKey());
    ret.setUsername(username);
    Date date = new Date();
    ret.setCreationDate(date);
    ret.setUpdateDate(date);
    ret.setMetaData(wrapper.getMetadata());

    dataypeLibraryService.save(ret);

    return ret;
  }


  @RequestMapping(value = "/api/datatype-library/{id}/display", method = RequestMethod.GET,
      produces = {"application/json"})

  public @ResponseBody DatatypeLibraryDisplay getIgDisplay(@PathVariable("id") String id,
      Authentication authentication)
      throws DatatypeLibraryNotFoundException, DatatypeLibraryConverterException {


    DatatypeLibrary library = findLibraryById(id);
    DatatypeLibraryDisplay ret = displayConverterService.convertDomainToModel(library);
    return ret;


  }


  /**
   * 
   * @param id
   * @param authentication
   * @return
   * @throws IGNotFoundException
   * @throws DatatypeLibraryUpdateException
   */
  @RequestMapping(value = "/api/datatype-library/{id}/updatetoc", method = RequestMethod.POST,
      produces = {"application/json"})

  public @ResponseBody ResponseMessage get(@PathVariable("id") String id,
      @RequestBody List<gov.nist.hit.hl7.igamt.datatypeLibrary.model.TreeNode> toc,
      Authentication authentication)
      throws DatatypeLibraryNotFoundException, DatatypeLibraryUpdateException {


    Set<TextSection> content = displayConverterService.convertTocToDomain(toc);

    UpdateResult updateResult = dataypeLibraryService.updateAttribute(id, "content", content);
    if (!updateResult.wasAcknowledged()) {
      throw new DatatypeLibraryUpdateException(id);
    }

    return new ResponseMessage(Status.SUCCESS, TABLE_OF_CONTENT_UPDATED, id, new Date());



  }

  @RequestMapping(value = "/api/datatype-library/{id}/updatemetadata", method = RequestMethod.POST,
      produces = {"application/json"})

  public @ResponseBody ResponseMessage get(@PathVariable("id") String id,
      @RequestBody DocumentMetadata metadata, Authentication authentication)
      throws IGNotFoundException, DatatypeLibraryUpdateException {
    UpdateResult updateResult = dataypeLibraryService.updateAttribute(id, "metadata", metadata);
    if (!updateResult.wasAcknowledged()) {
      throw new DatatypeLibraryUpdateException("Could not update IG Metadata ");
    }
    return new ResponseMessage(Status.SUCCESS, METATDATA_UPDATED, id, new Date());
  }

  private DatatypeLibrary findLibraryById(String id) throws DatatypeLibraryNotFoundException {
    DatatypeLibrary ig = dataypeLibraryService.findLatestById(id);
    if (ig == null) {
      throw new DatatypeLibraryNotFoundException(id);
    }
    return ig;
  }



}
