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

import java.util.HashMap;
import java.util.List;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.RealKey;
import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;
import gov.nist.hit.hl7.igamt.common.base.util.CloneMode;
import gov.nist.hit.hl7.igamt.common.base.util.RelationShip;
import gov.nist.hit.hl7.igamt.common.binding.domain.Binding;
import gov.nist.hit.hl7.igamt.common.binding.domain.LocationInfo;
import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.ChangeItemDomain;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatementsContainer;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DatatypeConformanceStatement;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DatatypeSelectItemGroup;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DatatypeStructureDisplay;
import gov.nist.hit.hl7.igamt.datatype.domain.registry.DatatypeRegistry;
import gov.nist.hit.hl7.resource.change.exceptions.ApplyChangeException;


/**
 *
 * @author Jungyub Woo on Feb 1, 2019.
 */
public interface DatatypeService {

	public Datatype findById(String id);

	public Datatype create(Datatype datatype);

	public Datatype save(Datatype datatype);

	public List<Datatype> findAll();

	public List<Datatype> findByScope(Scope scope);

	public void delete(Datatype datatype);

	public void delete(String id);

	public void removeCollection();

	public List<Datatype> findByDomainInfoVersion(String version);

	public List<Datatype> findByDomainInfoScope(String scope);

	public List<Datatype> findByDomainInfoScopeAndDomainInfoVersion(String scope, String verion);

	public List<Datatype> findByName(String name);

	public List<Datatype> findByDomainInfoScopeAndDomainInfoVersionAndName(String scope, String version, String name);

	public List<Datatype> findByDomainInfoVersionAndName(String version, String name);

	public List<Datatype> findByDomainInfoScopeAndName(String scope, String name);

	List<Datatype> findDisplayFormatByScopeAndVersion(String scope, String version);

	public DatatypeConformanceStatement convertDomainToConformanceStatement(Datatype datatype);

	List<Datatype> findByScopeAndVersion(String scope, String hl7Version);

	List<Datatype> findByNameAndVersionAndScope(String name, String version, String scope);

	Datatype findOneByNameAndVersionAndScope(String name, String version, String scope);

	public Link cloneDatatype(String newId, HashMap<RealKey, String> newKeys,  Link l,
			String username, Scope scope, CloneMode cloneMode);

	public Set<?> convertComponentStructure(Datatype datatype, String idPath, String path, String viewScope);

	public DatatypeStructureDisplay convertDomainToStructureDisplay(Datatype datatype, boolean readOnly);

	public List<Datatype> findDisplayFormatByIds(Set<String> ids);

	public List<Datatype> findFlavors(Set<String> ids, String id, String name);

	public List<Datatype> findNonFlavor(Set<String> ids, String id, String name);

	public List<DatatypeSelectItemGroup> getDatatypeFlavorsOptions(Set<String> ids, Datatype dt, String scope);

	public void applyChanges(Datatype dt, List<ChangeItemDomain> cItems, String documentId)
			throws ApplyChangeException;

	public Set<RelationShip> collectDependencies(Datatype dt);

	public void collectAssoicatedConformanceStatements(Datatype datatype,
			HashMap<String, ConformanceStatementsContainer> associatedConformanceStatementMap);

	public Binding makeLocationInfo(Datatype dt);

	public LocationInfo makeLocationInfoForComponent(ComplexDatatype dt, StructureElementBinding seb);

	public List<Datatype> findByIdIn(Set<String> linksAsIds);
	
	public void collectResources(Datatype d, HashMap<String, Resource> used);

	public Set<Resource> getDependencies(Datatype datatype);

    List<Datatype> findByParentId(String id);

	Set<DisplayElement> convertDatatypes(Set<Datatype> datatypes);

	DisplayElement convertDatatype(Datatype datatype);

	Set<DisplayElement> convertDatatypeRegistry(DatatypeRegistry registry);

}
