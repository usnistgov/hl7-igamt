package gov.nist.hit.hl7.igamt.datatypeLibrary.service;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.mongodb.client.result.UpdateResult;

import gov.nist.hit.hl7.igamt.common.base.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.datatypeLibrary.domain.DatatypeLibrary;
import gov.nist.hit.hl7.igamt.datatypeLibrary.exceptions.AddingException;
import gov.nist.hit.hl7.igamt.datatypeLibrary.model.LibSummary;
import gov.nist.hit.hl7.igamt.datatypeLibrary.wrappers.AddDatatypeResponseObject;



public interface DatatypeLibraryService {



  public DatatypeLibrary findById(CompositeKey id);

  public List<DatatypeLibrary> findAll();

  public void delete(CompositeKey id);

  public DatatypeLibrary save(DatatypeLibrary DatatypeLibrary);

  public DatatypeLibrary findLatestById(String id);

  public List<DatatypeLibrary> finByScope(String string);

  public DatatypeLibrary createEmptyDatatypeLibrary()
      throws JsonParseException, JsonMappingException, FileNotFoundException, IOException;

  AddDatatypeResponseObject addDatatypes(Set<String> savedIds, DatatypeLibrary lib, Scope scope)
      throws AddingException;

  UpdateResult updateAttribute(String id, String attributeName, Object value);

  List<DatatypeLibrary> findLatestByUsername(String username);

  /**
   * @param libs
   * @return
   */
  public List<LibSummary> convertListToDisplayList(List<DatatypeLibrary> libs);

}
