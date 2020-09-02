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

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import com.fasterxml.jackson.core.JsonProcessingException;

import gov.nist.hit.hl7.igamt.common.base.domain.*;
import gov.nist.hit.hl7.igamt.common.base.exception.ValidationException;
import gov.nist.hit.hl7.igamt.common.base.service.ResourceService;
import gov.nist.hit.hl7.igamt.common.base.util.RelationShip;
import gov.nist.hit.hl7.igamt.common.binding.domain.Binding;
import gov.nist.hit.hl7.igamt.common.binding.domain.LocationInfo;
import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.ChangeItemDomain;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatement;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatementsContainer;
import gov.nist.hit.hl7.igamt.constraints.domain.DisplayPredicate;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.display.PostDef;
import gov.nist.hit.hl7.igamt.datatype.domain.display.PreDef;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentDynamicMapping;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentSelectItemGroup;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentStructureDisplay;
import gov.nist.hit.hl7.igamt.segment.exception.SegmentNotFoundException;
import gov.nist.hit.hl7.igamt.segment.exception.SegmentValidationException;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
//import gov.nist.hit.hl7.igamt.segment.serialization.exception.CoConstraintSaveException;

/**
 *
 * @author Jungyub Woo on Mar 15, 2018 .
 */
public interface SegmentService extends ResourceService {

	public Segment findById(String id);

	public Segment create(Segment segment);

	public Segment save(Segment segment);

	public List<Segment> findAll();

	public void delete(Segment segment);

	public void removeCollection();

	public List<Segment> findByDomainInfoVersion(String version);

	public List<Segment> findByDomainInfoScope(String scope);

	public List<Segment> findByDomainInfoScopeAndDomainInfoVersion(String scope, String verion);

	public List<Segment> findByName(String name);

	public List<Segment> findByDomainInfoScopeAndDomainInfoVersionAndName(String scope, String version, String name);

	public List<Segment> findByDomainInfoVersionAndName(String version, String name);

	public List<Segment> findByDomainInfoScopeAndName(String scope, String name);

	public PreDef convertDomainToPredef(Segment segment);

	public PostDef convertDomainToPostdef(Segment segment);

	public List<Segment> findDisplayFormatByScopeAndVersion(String scope, String version);


	public Link cloneSegment(String id, HashMap<RealKey, String> newKeys, Link l, String username, Scope user);

	List<Valueset> getDependentValueSets(Set<Segment> resources);

	public Segment saveDynamicMapping(SegmentDynamicMapping dynamicMapping)
			throws SegmentNotFoundException, SegmentValidationException;

	/**
	 * @param dynamicMapping
	 * @throws SegmentValidationException
	 */
	void validate(SegmentDynamicMapping dynamicMapping) throws SegmentValidationException;

	/**
	 * @param segment
	 * @return
	 */
	public SegmentStructureDisplay convertDomainToDisplayStructure(Segment segment, boolean readOnly);

	/**
	 * @param s
	 * @param cItems
	 * @return
	 * @throws JsonProcessingException
	 * @throws IOException
	 */

	public void applyChanges(Segment s, List<ChangeItemDomain> cItems, String documentId)
            throws Exception;

	/**
	 * @param datatype
	 * @param idPath
	 * @param path
	 * @return
	 */
	public Set<?> convertSegmentStructurForMessage(Segment segment, String idPath, String path);

	public List<SegmentSelectItemGroup> getSegmentFlavorsOptions(Set<String> ids, Segment s, String scope);

	public List<Segment> findFlavors(Set<String> ids, String id, String name);

	public List<Segment> findNonFlavor(Set<String> ids, String id, String name);

	public Set<RelationShip> collectDependencies(Segment elm);

	public void collectAssoicatedConformanceStatements(Segment segment,
			HashMap<String, ConformanceStatementsContainer> associatedConformanceStatementMap);

	public Binding makeLocationInfo(Segment s);

	public LocationInfo makeLocationInfoForField(Segment s, StructureElementBinding seb);

	public List<Segment> findByIdIn(Set<String> linksAsIds);

	public Set<ConformanceStatement> collectAvaliableConformanceStatements(String documentId, String segmentId,
			String segmentName);

	public void collectResources(Segment seg, HashMap<String, Resource> used);

	public Set<Resource> getDependencies(Segment segment);

}
