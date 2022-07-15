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
import java.util.Set;

import com.fasterxml.jackson.core.JsonProcessingException;

import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.RealKey;
import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;
import gov.nist.hit.hl7.igamt.common.base.util.CloneMode;
import gov.nist.hit.hl7.igamt.common.base.util.RelationShip;
import gov.nist.hit.hl7.igamt.common.base.wrappers.Substitue;
import gov.nist.hit.hl7.igamt.common.binding.domain.Binding;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.ChangeItemDomain;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRefOrGroup;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.ConformanceProfileConformanceStatement;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.ConformanceProfileStructureDisplay;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.ConformanceProfileStructureTreeModel;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.DisplayConformanceProfileMetadata;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.DisplayConformanceProfilePostDef;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.display.DisplayConformanceProfilePreDef;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.registry.ConformanceProfileRegistry;
import gov.nist.hit.hl7.igamt.conformanceprofile.exception.ConformanceProfileValidationException;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatementsContainer;
import gov.nist.hit.hl7.igamt.constraints.domain.DisplayPredicate;

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

  public List<ConformanceProfile> findByDomainInfoScopeAndDomainInfoVersion(String scope, String verion);

  public List<ConformanceProfile> findByName(String name);

  public List<ConformanceProfile> findByDomainInfoScopeAndDomainInfoVersionAndName(String scope, String version, String name);

  public List<ConformanceProfile> findByDomainInfoVersionAndName(String version, String name);

  public List<ConformanceProfile> findByDomainInfoScopeAndName(String scope, String name);

  ConformanceProfile findDisplayFormat(String id);

  public ConformanceProfileConformanceStatement convertDomainToConformanceStatement(ConformanceProfile conformanceProfile, String documentId, boolean readOnly);

  public void validate(DisplayConformanceProfileMetadata metadata) throws ConformanceProfileValidationException;

  public ConformanceProfileStructureDisplay convertDomainToDisplayStructure(ConformanceProfile conformanceProfile, boolean readOnly);
  
  public ConformanceProfileStructureDisplay convertDomainToDisplayStructureFromContext(ConformanceProfile conformanceProfile, String contextId, boolean readOnly);
  
  public void applyChanges(ConformanceProfile cp, List<ChangeItemDomain> cItems, String documentId) throws Exception;

  public ConformanceProfileStructureTreeModel convertDomainToContextStructure(ConformanceProfile conformanceProfile, HashMap<String, ConformanceStatementsContainer> segMap, HashMap<String, ConformanceStatementsContainer> dtMap);

  public Binding makeLocationInfo(ConformanceProfile cp);
    
  List<ConformanceProfile> findByIdIn(Set<String> set);
  
  public Set<Resource> getDependencies(ConformanceProfile cp);

  DisplayElement convertConformanceProfile(ConformanceProfile conformanceProfile, int position);
  Set<DisplayElement> convertConformanceProfiles(Set<ConformanceProfile> conformanceProfiles, ConformanceProfileRegistry conformanceProfileRegistry);
  Set<DisplayElement> convertConformanceProfileRegistry(ConformanceProfileRegistry registry);

  public List<ConformanceProfile> saveAll(Set<ConformanceProfile> datatypes);
  void processAndSubstitute(ConformanceProfile cp, HashMap<RealKey, String> newKeys);



}
