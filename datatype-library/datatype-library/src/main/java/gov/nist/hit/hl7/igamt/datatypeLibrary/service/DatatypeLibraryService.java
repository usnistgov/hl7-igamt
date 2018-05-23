package gov.nist.hit.hl7.igamt.datatypeLibrary.service;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;

import gov.nist.hit.hl7.igamt.datatypeLibrary.domain.DatatypeLibrary;
import gov.nist.hit.hl7.igamt.shared.domain.CompositeKey;



@Service("DatatypeLibraryService")
public interface DatatypeLibraryService {



  public DatatypeLibrary findById(CompositeKey id);

  public List<DatatypeLibrary> findAll();

  public void delete(CompositeKey id);

  public DatatypeLibrary save(DatatypeLibrary DatatypeLibrary);

  public DatatypeLibrary findLatestById(String id);

  public List<DatatypeLibrary> finByScope(String string);

  public DatatypeLibrary createEmptyDatatypeLibrary()
      throws JsonParseException, JsonMappingException, FileNotFoundException, IOException;


}
