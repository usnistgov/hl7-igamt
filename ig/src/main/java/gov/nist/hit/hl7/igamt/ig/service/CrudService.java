package gov.nist.hit.hl7.igamt.ig.service;

import java.util.Set;

import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.model.AddDatatypeResponseObject;
import gov.nist.hit.hl7.igamt.ig.model.AddMessageResponseObject;
import gov.nist.hit.hl7.igamt.ig.model.AddSegmentResponseObject;
import gov.nist.hit.hl7.igamt.ig.model.AddValueSetResponseObject;
import gov.nist.hit.hl7.igamt.shared.domain.CompositeKey;

public interface CrudService {


  AddMessageResponseObject addConformanceProfiles(Set<String> ids, Ig ig);

  AddSegmentResponseObject addSegments(Set<String> ids, Ig ig);

  AddDatatypeResponseObject addDatatypes(Set<String> ids, Ig ig);

  AddValueSetResponseObject addValueSets(Set<String> ids, Ig ig);

  CompositeKey AddConformanceProfilesToEmptyIg(Set<String> ids, Ig ig);



}
