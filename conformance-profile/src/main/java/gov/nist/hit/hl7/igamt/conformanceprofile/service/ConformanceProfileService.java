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
package gov.nist.hit.hl7.igamt.conformanceprofile.service;

import java.util.HashMap;
import java.util.List;
import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.ConformanceProfileConformanceStatement;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.ConformanceProfileSaveStructure;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.ConformanceProfileStructureDisplay;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.DisplayConformanceProfileMetadata;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.DisplayConformanceProfilePostDef;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.DisplayConformanceProfilePreDef;
import gov.nist.hit.hl7.igamt.conformanceprofile.exception.ConformanceProfileNotFoundException;
import gov.nist.hit.hl7.igamt.conformanceprofile.exception.ConformanceProfileValidationException;
import gov.nist.hit.hl7.igamt.datatype.domain.display.PostDef;
import gov.nist.hit.hl7.igamt.datatype.domain.display.PreDef;

/**
 *
 * @author Maxence Lefort on Mar 9, 2018.
 */
public interface ConformanceProfileService {

  public ConformanceProfile findById(String id);

  public ConformanceProfile create(ConformanceProfile conformanceProfile);

  public ConformanceProfile save(ConformanceProfile conformanceProfile);

  public List<ConformanceProfile> findAll();

  public void delete(ConformanceProfile conformanceProfile);

  public void delete(String id);

  public void removeCollection();

  public List<ConformanceProfile> findByIdentifier(String identifier);

  public List<ConformanceProfile> findByMessageType(String messageType);

  public List<ConformanceProfile> findByEvent(String messageType);

  public List<ConformanceProfile> findByStructID(String messageType);

  public List<ConformanceProfile> findByDomainInfoVersion(String version);

  public List<ConformanceProfile> findByDomainInfoScope(String scope);

  public List<ConformanceProfile> findByDomainInfoScopeAndDomainInfoVersion(String scope,
      String verion);

  public List<ConformanceProfile> findByName(String name);

  public List<ConformanceProfile> findByDomainInfoScopeAndDomainInfoVersionAndName(String scope,
      String version, String name);

  public List<ConformanceProfile> findByDomainInfoVersionAndName(String version, String name);

  public List<ConformanceProfile> findByDomainInfoScopeAndName(String scope, String name);

  ConformanceProfile findDisplayFormat(String id);

  public DisplayConformanceProfileMetadata convertDomainToMetadata(
      ConformanceProfile conformanceProfile);

  public DisplayConformanceProfilePreDef convertDomainToPredef(
      ConformanceProfile conformanceProfile);

  public DisplayConformanceProfilePostDef convertDomainToPostdef(
      ConformanceProfile conformanceProfile);

  public ConformanceProfileConformanceStatement convertDomainToConformanceStatement(
      ConformanceProfile conformanceProfile);


  /**
   * 
   * @param structure
   * @return
   */
  public ConformanceProfile convertToConformanceProfile(ConformanceProfileSaveStructure structure);

  /**
   * Validate the metadata information of the segment
   * 
   * @param metadata
   * @throws ConformanceProfileValidationException
   */
  public void validate(DisplayConformanceProfileMetadata metadata)
      throws ConformanceProfileValidationException;


  /**
   * 
   * @param predef
   * @return
   * @throws ConformanceProfileNotFoundException
   */
  public ConformanceProfile savePredef(PreDef predef) throws ConformanceProfileNotFoundException;

  /**
   * 
   * @param postdef
   * @return
   * @throws ConformanceProfileNotFoundException
   */
  public ConformanceProfile savePostdef(PostDef postdef) throws ConformanceProfileNotFoundException;

  /**
   * 
   * @param metadata
   * @return
   * @throws ConformanceProfileNotFoundException
   * @throws ConformanceProfileValidationException
   */
  public ConformanceProfile saveMetadata(DisplayConformanceProfileMetadata metadata)
      throws ConformanceProfileNotFoundException, ConformanceProfileValidationException;

  /**
   * Validate conformance statements of the segment
   * 
   * @param conformanceStatement
   * @throws ConformanceProfileValidationException
   */
  public void validate(ConformanceProfileConformanceStatement conformanceStatement)
      throws ConformanceProfileValidationException;


  /**
   * Save the conformance statements of the segment
   * 
   * @param conformanceStatement
   * @return
   * @throws ConformanceProfileNotFoundException
   * @throws ConformanceProfileValidationException
   */
  public ConformanceProfile saveConformanceStatement(
      ConformanceProfileConformanceStatement conformanceStatement)
      throws ConformanceProfileNotFoundException, ConformanceProfileValidationException;

  /**
   * @param String
   * @param valuesetsMap
   * @param segmentsMap
   * @param l
   * @param username
   * @return
   */
  public Link cloneConformanceProfile(String String,
      HashMap<String, String> valuesetsMap, HashMap<String, String> segmentsMap, Link l,
      String username);

  /**
   * @param conformanceProfile
   * @return
   */
  public ConformanceProfileStructureDisplay convertDomainToDisplayStructure(ConformanceProfile conformanceProfile);

}
