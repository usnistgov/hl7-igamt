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

import java.util.List;

import gov.nist.hit.hl7.igamt.shared.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;

/**
 *
 * @author Jungyub Woo on Mar 1, 2018.
 */
public interface ValuesetService {

  public Valueset findById(CompositeKey id);

  public Valueset findLatestById(String id);

  public Valueset create(Valueset valueset);

  public Valueset createFromLegacy(Valueset valueset, String legacyId);

  public Valueset save(Valueset valueset);

  public List<Valueset> findAll();

  public void delete(Valueset valueset);

  public void delete(CompositeKey id);

  public void removeCollection();

  public List<Valueset> findByDomainInfoVersion(String version);

  public List<Valueset> findByDomainInfoScope(String scope);

  public List<Valueset> findByDomainInfoScopeAndDomainInfoVersion(String scope, String verion);

  public List<Valueset> findByBindingIdentifier(String bindingIdentifier);

  public List<Valueset> findByDomainInfoScopeAndDomainInfoVersionAndBindingIdentifier(String scope,
      String version, String bindingIdentifier);

  public List<Valueset> findByDomainInfoVersionAndBindingIdentifier(String version,
      String bindingIdentifier);

  public List<Valueset> findByDomainInfoScopeAndBindingIdentifier(String scope,
      String bindingIdentifier);

}
