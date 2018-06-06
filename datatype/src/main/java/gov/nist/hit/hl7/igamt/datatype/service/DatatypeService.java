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

import java.util.List;

import gov.nist.hit.hl7.igamt.common.base.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.display.ChangedDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DatatypeConformanceStatement;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DatatypeStructure;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DisplayMetadata;
import gov.nist.hit.hl7.igamt.datatype.domain.display.PostDef;
import gov.nist.hit.hl7.igamt.datatype.domain.display.PreDef;

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

  public DatatypeStructure convertDomainToStructure(Datatype datatype);

  public DisplayMetadata convertDomainToMetadata(Datatype datatype);

  public PreDef convertDomainToPredef(Datatype datatype);

  public PostDef convertDomainToPostdef(Datatype datatype);

  public Datatype saveDatatype(ChangedDatatype changedDatatype);

  List<Datatype> findDisplayFormatByScopeAndVersion(String scope, String version);

  public DatatypeConformanceStatement convertDomainToConformanceStatement(Datatype datatype);
}
