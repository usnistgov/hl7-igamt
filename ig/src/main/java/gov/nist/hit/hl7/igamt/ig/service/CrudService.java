package gov.nist.hit.hl7.igamt.ig.service;

import java.util.List;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.exception.ForbiddenOperationException;
import gov.nist.hit.hl7.igamt.common.base.wrappers.AddingInfo;
import gov.nist.hit.hl7.igamt.common.exception.EntityNotFound;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.exceptions.AddingException;
import gov.nist.hit.hl7.igamt.ig.model.AddDatatypeResponseObject;
import gov.nist.hit.hl7.igamt.ig.model.AddMessageResponseObject;
import gov.nist.hit.hl7.igamt.ig.model.AddSegmentResponseObject;
import gov.nist.hit.hl7.igamt.ig.model.AddValueSetResponseObject;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;

public interface CrudService {


  public AddMessageResponseObject addConformanceProfiles(Set<String> ids, Ig ig) throws AddingException;

  public AddSegmentResponseObject addSegments(Set<String> ids, Ig ig) throws AddingException;

  public AddDatatypeResponseObject addDatatypes(Set<String> ids, Ig ig) throws AddingException;

  public AddValueSetResponseObject addValueSets(Set<String> ids, Ig ig) throws AddingException;

  public String AddConformanceProfilesToEmptyIg(Set<String> ids, Ig ig) throws AddingException;

  public AddValueSetResponseObject addValueSets(List<AddingInfo> toAdd, Ig ig, String username) throws AddingException, EntityNotFound, ForbiddenOperationException;


}
