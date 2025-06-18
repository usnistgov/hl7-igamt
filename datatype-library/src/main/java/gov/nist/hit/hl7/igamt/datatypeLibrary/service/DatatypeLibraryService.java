package gov.nist.hit.hl7.igamt.datatypeLibrary.service; 
 
import java.io.FileNotFoundException; 
import java.io.IOException; 
import java.util.List; 
import java.util.Set; 
 
import com.fasterxml.jackson.core.JsonParseException; 
import com.fasterxml.jackson.databind.JsonMappingException; 
import com.mongodb.client.result.UpdateResult; 
 
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.Status;
import gov.nist.hit.hl7.igamt.common.base.domain.TextSection; 
import gov.nist.hit.hl7.igamt.common.base.exception.ForbiddenOperationException; 
import gov.nist.hit.hl7.igamt.common.base.exception.ValuesetNotFoundException; 
import gov.nist.hit.hl7.igamt.common.base.model.DocumentSummary; 
import gov.nist.hit.hl7.igamt.common.base.model.PublicationResult; 
import gov.nist.hit.hl7.igamt.common.base.model.PublicationSummary;
import gov.nist.hit.hl7.igamt.common.exception.EntityNotFound;
import gov.nist.hit.hl7.igamt.datatypeLibrary.domain.DatatypeLibrary; 
import gov.nist.hit.hl7.igamt.datatypeLibrary.domain.DatatypeLibraryDataModel; 
import gov.nist.hit.hl7.igamt.datatypeLibrary.exceptions.AddingException; 
import gov.nist.hit.hl7.igamt.datatypeLibrary.exceptions.DatatypeLibraryNotFoundException; 
import gov.nist.hit.hl7.igamt.datatypeLibrary.model.AddValueSetResponseObject; 
import gov.nist.hit.hl7.igamt.datatypeLibrary.wrappers.AddDatatypeResponseObject; 
import gov.nist.hit.hl7.igamt.display.model.CopyInfo; 
import gov.nist.hit.hl7.igamt.ig.exceptions.IGNotFoundException; 
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset; 
 
 
 
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
 
  /** 
   * @param content 
   * @param sectionId 
   * @return 
   */ 
  TextSection findSectionById(Set<TextSection> content, String sectionId); 
   
  public DatatypeLibraryDataModel generateDataModel(DatatypeLibrary dl) throws Exception; 
 
Valueset getValueSetInIg(String id, String vsId) throws ValuesetNotFoundException, IGNotFoundException; 
 
 
  public PublicationSummary getPublicationSummary(String id, Scope scope); 
 
  /** 
   * @param id 
   * @param publicationResult 
   * @return 
 * @throws ForbiddenOperationException  
   */ 
  public String publishLibray(String id, PublicationResult publicationResult) throws ForbiddenOperationException; 
 
  /** 
   * @param id 
   * @param datatypes 
   * @return 
 * @throws ForbiddenOperationException  
   */ 
  void deactivateChildren(String id, Set<String> ids) throws ForbiddenOperationException; 
 
  /** 
   * @param id 
   * @param username 
   * @param info 
   * @return 
   * @throws DatatypeLibraryNotFoundException  
 * @throws ForbiddenOperationException  
 * @throws EntityNotFound 
   */ 
  public DatatypeLibrary clone(String id, String username, CopyInfo info) throws DatatypeLibraryNotFoundException, ForbiddenOperationException, EntityNotFound;

  List<DatatypeLibrary> findByUsername(String username);

  public List<DatatypeLibrary> findByUsernameAndStatus(String username, Status locked);
  
  

 
 
} 
