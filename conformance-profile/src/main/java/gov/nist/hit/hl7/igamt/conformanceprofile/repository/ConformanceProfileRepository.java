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
package gov.nist.hit.hl7.igamt.conformanceprofile.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.shared.domain.CompositeKey;

/**
 *
 * @author Maxence Lefort on Mar 9, 2018.
 */
public interface ConformanceProfileRepository extends MongoRepository<ConformanceProfile, CompositeKey> {
	public List<ConformanceProfile> findByIdentifier(String identifier);

	public List<ConformanceProfile> findByMessageType(String messageType);

	public List<ConformanceProfile> findByEvent(String messageType);

	public List<ConformanceProfile> findByStructID(String messageType);

	public List<ConformanceProfile> findByDomainInfoVersion(String version);

	public List<ConformanceProfile> findByDomainInfoScope(String scope);

	public List<ConformanceProfile> findByDomainInfoScopeAndDomainInfoVersion(String scope, String verion);

	public List<ConformanceProfile> findByName(String name);

	public List<ConformanceProfile> findByDomainInfoScopeAndDomainInfoVersionAndName(String scope, String version,
			String name);

	public List<ConformanceProfile> findByDomainInfoVersionAndName(String version, String name);

	public List<ConformanceProfile> findByDomainInfoScopeAndName(String scope, String name);

}
