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
package gov.nist.hit.hl7.igamt.segment.service;

import java.util.HashMap;
import java.util.List;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;
import gov.nist.hit.hl7.igamt.common.base.exception.ForbiddenOperationException;
import gov.nist.hit.hl7.igamt.common.base.service.ResourceService;
import gov.nist.hit.hl7.igamt.common.binding.domain.Binding;
import gov.nist.hit.hl7.igamt.common.binding.domain.LocationInfo;
import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.ChangeItemDomain;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatementsContainer;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentDynamicMapping;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentSelectItemGroup;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentStructureDisplay;
import gov.nist.hit.hl7.igamt.segment.domain.registry.SegmentRegistry;
import gov.nist.hit.hl7.igamt.segment.exception.SegmentNotFoundException;
import gov.nist.hit.hl7.igamt.segment.exception.SegmentValidationException;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.resource.change.exceptions.ApplyChangeException;

/**
 *
 * @author Jungyub Woo on Mar 15, 2018 .
 */
public interface SegmentService extends ResourceService {

  Segment findById(String id);

  Segment create(Segment segment);
  Segment save(Segment segment) throws ForbiddenOperationException;

  List<Segment> findAll();
  
  void delete(Segment segment) throws ForbiddenOperationException;


  List<Segment> findByDomainInfoVersion(String version);

  List<Segment> findByDomainInfoScope(String scope);

  List<Segment> findByDomainInfoScopeAndDomainInfoVersion(String scope, String verion);

  List<Segment> findByName(String name);

  List<Segment> findByDomainInfoScopeAndDomainInfoVersionAndName(String scope, String version, String name);

  List<Segment> findByDomainInfoVersionAndName(String version, String name);

  List<Segment> findByDomainInfoScopeAndName(String scope, String name);

  List<Segment> findDisplayFormatByScopeAndVersion(Scope scope, String version, String username);

  List<Valueset> getDependentValueSets(Set<Segment> resources);

  Segment saveDynamicMapping(SegmentDynamicMapping dynamicMapping)
      throws SegmentNotFoundException, SegmentValidationException, ForbiddenOperationException;

  void validate(SegmentDynamicMapping dynamicMapping) throws SegmentValidationException;

  SegmentStructureDisplay convertDomainToDisplayStructure(Segment segment, boolean readOnly);

  void applyChanges(Segment s, List<ChangeItemDomain> cItems)
      throws ApplyChangeException, ForbiddenOperationException;

  Set<?> convertSegmentStructurForMessage(Segment segment, String idPath, String path);

  List<SegmentSelectItemGroup> getSegmentFlavorsOptions(Set<String> ids, Segment s, String scope);

  List<Segment> findFlavors(Set<String> ids, String id, String name);

  List<Segment> findNonFlavor(Set<String> ids, String id, String name);

  void collectAssoicatedConformanceStatements(Segment segment,
      HashMap<String, ConformanceStatementsContainer> associatedConformanceStatementMap);

  Binding makeLocationInfo(Segment s);

  LocationInfo makeLocationInfoForField(Segment s, StructureElementBinding seb);

  List<Segment> findByIdIn(Set<String> linksAsIds);

  void collectResources(Segment seg, HashMap<String, Resource> used);

  Set<Resource> getDependencies(Segment segment);

  void restoreDefaultDynamicMapping(Segment segment);

  Set<DisplayElement> convertSegments(Set<Segment> segments);
  DisplayElement convertSegment(Segment segment);
  Set<DisplayElement> convertSegmentRegistry(SegmentRegistry registry);
  String findXMLRefIdById(String segId, String defaultHL7Version);
  String findXMLRefIdById(Segment s, String defaultHL7Version);
  String findObx2VsId(Segment s);  
  List<Segment> saveAll(Set<Segment> segments) throws ForbiddenOperationException;

}
