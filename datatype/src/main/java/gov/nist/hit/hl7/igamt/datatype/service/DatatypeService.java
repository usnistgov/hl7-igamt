/**
 * 
 * This software was developed at the National Institute of Standards and Technology by employees of
 * the Federal Government in the course of their official duties. Pursuant to title 17 Section 105
 * of the United States Code this software is not subject to copyright protection and is in the
 * public domain. This is an experimental system. NIST assumes no responsibility whatsoever for its
 * use by other parties, and makes no guarantees, expressed or implied, about its quality,
 * reliability, or any other characteristic. We would appreciate acknowledgement if the software is
 * used. This software can be redistributed and/or modified freely provided that any derivative
 * works bear some notice that they are derived from it, and any modified versions bear some notice
 * that they have been modified.
 * 
 */
package gov.nist.hit.hl7.igamt.datatype.service;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.core.JsonProcessingException;

import gov.nist.hit.hl7.igamt.common.base.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.display.ViewScope;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.ChangeItemDomain;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DatatypeConformanceStatement;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DatatypeSelectItemGroup;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DatatypeStructureDisplay;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DisplayMetadata;
import gov.nist.hit.hl7.igamt.datatype.domain.display.PostDef;
import gov.nist.hit.hl7.igamt.datatype.domain.display.PreDef;
import gov.nist.hit.hl7.igamt.datatype.exception.DatatypeNotFoundException;
import gov.nist.hit.hl7.igamt.datatype.exception.DatatypeValidationException;

/**
 *
 * @author Maxence Lefort on Mar 1, 2018.
 */
public interface DatatypeService {

  public Datatype findByKey(CompositeKey key);

  public Datatype findLatestById(String id);

  public Datatype create(Datatype datatype);

  public Datatype save(Datatype datatype);

  public List<Datatype> findAll();

  public List<Datatype> findByScope(Scope scope);

  public void delete(Datatype datatype);

  public void delete(CompositeKey key);

  public void removeCollection();

  public List<Datatype> findByDomainInfoVersion(String version);

  public List<Datatype> findByDomainInfoScope(String scope);

  public List<Datatype> findByDomainInfoScopeAndDomainInfoVersion(String scope, String verion);

  public List<Datatype> findByName(String name);

  public List<Datatype> findByDomainInfoScopeAndDomainInfoVersionAndName(String scope,
      String version, String name);

  public List<Datatype> findByDomainInfoVersionAndName(String version, String name);

  public List<Datatype> findByDomainInfoScopeAndName(String scope, String name);

  public Datatype getLatestById(String id);

  public DisplayMetadata convertDomainToMetadata(Datatype datatype);

  public PreDef convertDomainToPredef(Datatype datatype);

  public PostDef convertDomainToPostdef(Datatype datatype);

  List<Datatype> findDisplayFormatByScopeAndVersion(String scope, String version);

  public DatatypeConformanceStatement convertDomainToConformanceStatement(Datatype datatype);

  /**
   * Validate the metadata information of the segment
   * 
   * @param metadata
   * @throws DatatypeValidationException
   */
  public void validate(DisplayMetadata metadata) throws DatatypeValidationException;


  /**
   * 
   * @param predef
   * @return
   * @throws DatatypeNotFoundException
   */
  public Datatype savePredef(PreDef predef) throws DatatypeNotFoundException;

  /**
   * 
   * @param postdef
   * @return
   * @throws DatatypeNotFoundException
   */
  public Datatype savePostdef(PostDef postdef) throws DatatypeNotFoundException;

  /**
   * 
   * @param metadata
   * @return
   * @throws DatatypeNotFoundException
   * @throws DatatypeValidationException
   */
  public Datatype saveMetadata(DisplayMetadata metadata)
      throws DatatypeNotFoundException, DatatypeValidationException;

  /**
   * Validate conformance statements of the segment
   * 
   * @param conformanceStatement
   * @throws DatatypeValidationException
   */
  public void validate(DatatypeConformanceStatement conformanceStatement)
      throws DatatypeValidationException;


  /**
   * Save the conformance statements of the segment
   * 
   * @param conformanceStatement
   * @return
   * @throws DatatypeNotFoundException
   * @throws DatatypeValidationException
   */
  public Datatype saveConformanceStatement(DatatypeConformanceStatement conformanceStatement)
      throws DatatypeNotFoundException, DatatypeValidationException;

  /**
   * @param scope
   * @param hl7Version
   * @return
   */
  List<Datatype> getLatestByScopeAndVersion(String scope, String hl7Version);

  /**
   * @param name
   * @param version
   * @param scope
   * @return
   */
  List<Datatype> findByNameAndVersionAndScope(String name, String version, String scope);

  Datatype findOneByNameAndVersionAndScope(String name, String version, String scope);

  /**
   * @param datatypesMap
   * @param valuesetsMap
   * @param l
   * @return
   */
  public Link cloneDatatype(HashMap<String, CompositeKey> datatypesMap,
      HashMap<String, CompositeKey> valuesetsMap, Link l, String username);

  /**
   * @param datatype
   * @param idPath
   * @param path
   * @return
   */
  public Set<?> convertComponentStructure(Datatype datatype, String idPath, String path, String viewScope);

  /**
   * @param datatype
   * @return
   */
  public DatatypeStructureDisplay convertDomainToStructureDisplay(Datatype datatype);
  
  
  public List<Datatype> findDisplayFormatByIds(Set<String> ids);

  public List<Datatype> findFlavors(Set<String> ids, String id, String name);

  public List<Datatype> findNonFlavor(Set<String> ids, String id, String name);

  public List<DatatypeSelectItemGroup> getDatatypeFlavorsOptions(Set<String> ids, Datatype dt, String scope);

  public void applyChanges(Datatype dt, List<ChangeItemDomain> cItems) throws JsonProcessingException, IOException;


}
