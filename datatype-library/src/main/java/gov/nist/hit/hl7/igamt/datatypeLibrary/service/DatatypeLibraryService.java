package gov.nist.hit.hl7.igamt.datatypeLibrary.service;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.mongodb.client.result.UpdateResult;

import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.model.DocumentSummary;
import gov.nist.hit.hl7.igamt.datatypeLibrary.domain.DatatypeLibrary;
import gov.nist.hit.hl7.igamt.datatypeLibrary.exceptions.AddingException;
import gov.nist.hit.hl7.igamt.datatypeLibrary.model.AddValueSetResponseObject;
import gov.nist.hit.hl7.igamt.datatypeLibrary.wrappers.AddDatatypeResponseObject;


public interface DatatypeLibraryService {



  public DatatypeLibrary findById(String id);

  public List<DatatypeLibrary> findAll();

  public void delete(String id);

  public DatatypeLibrary save(DatatypeLibrary DatatypeLibrary);

  public List<DatatypeLibrary> finByScope(String string);

  public DatatypeLibrary createEmptyDatatypeLibrary()
      throws JsonParseException, JsonMappingException, FileNotFoundException, IOException;

  AddDatatypeResponseObject addDatatypes(Set<String> savedIds, DatatypeLibrary lib, Scope scope)
      throws AddingException;

  
  AddDatatypeResponseObject addDatatypes(Set<String> ids, DatatypeLibrary lib) throws AddingException;

  UpdateResult updateAttribute(String id, String attributeName, Object value);

  public List<DocumentSummary> convertListToDisplayList(List<DatatypeLibrary> libs);

  public List<DatatypeLibrary> findPublished();

  List<DatatypeLibrary> findByUsername(String username, Scope scope);

  /**
   * @param ids
   * @param lib
   * @return
   * @throws AddingException
   */
  AddValueSetResponseObject addValueSets(Set<String> ids, DatatypeLibrary lib)
      throws AddingException;

}
