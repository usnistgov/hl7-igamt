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
package gov.nist.hit.hl7.igamt.valueset.service;

import java.io.IOException;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.core.JsonProcessingException;

import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.exception.ValuesetNotFoundException;
import gov.nist.hit.hl7.igamt.common.base.util.CloneMode;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.ChangeItemDomain;
import gov.nist.hit.hl7.igamt.valueset.domain.Code;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
/**
 *
 * @author Jungyub Woo on Mar 1, 2018.
 */
public interface ValuesetService {

	public Valueset findById(String id);

	public Valueset create(Valueset valueset);

	public Valueset createFromLegacy(Valueset valueset, String legacyId);

	public Valueset save(Valueset valueset);

	public List<Valueset> findAll();

	public void delete(Valueset valueset);

	public void delete(String id);

	public void removeCollection();

	public List<Valueset> findByDomainInfoVersion(String version);

	public List<Valueset> findByDomainInfoScope(String scope);

	public List<Valueset> findByDomainInfoScopeAndDomainInfoVersion(String scope, String verion);

	public List<Valueset> findByBindingIdentifier(String bindingIdentifier);

	public Valueset getLatestById(String id);

	public List<Valueset> findByDomainInfoScopeAndDomainInfoVersionAndBindingIdentifier(String scope, String version,
			String bindingIdentifier);

	public List<Valueset> findByDomainInfoVersionAndBindingIdentifier(String version, String bindingIdentifier);

	public List<Valueset> findByDomainInfoScopeAndBindingIdentifier(String scope, String bindingIdentifier);

	/**
	 * @param string
	 * @param version
	 * @return
	 */
	public List<Valueset> findDisplayFormatByScopeAndVersion(String string, String version);

	/**
	 * @param newkey
	 * @param l
	 * @param scope
	 * @param cloneMode 
	 * @return
	 */
	Link cloneValueSet(String newkey, Link l, String username, Scope scope, CloneMode cloneMode);

	public List<Valueset> findByIdIn(Set<String> linksAsIds);

	public List<Valueset> findDisplayFormatByScope(String scope);
	

	public void applyChanges(Valueset s, List<ChangeItemDomain> cItems, String documentId)
			throws JsonProcessingException, IOException;
	
	public Set<String> extractCodeSystemsFromCodes(Set<Code> codes);

	public Valueset findExternalPhinvadsByOid(String oid);

}
