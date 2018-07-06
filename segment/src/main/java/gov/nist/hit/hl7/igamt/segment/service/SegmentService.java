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

import java.util.List;

import gov.nist.hit.hl7.igamt.common.base.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.common.base.exception.ValidationException;
import gov.nist.hit.hl7.igamt.common.base.service.ResourceService;
import gov.nist.hit.hl7.igamt.common.exception.SegmentNotFoundException;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DisplayMetadata;
import gov.nist.hit.hl7.igamt.datatype.domain.display.PostDef;
import gov.nist.hit.hl7.igamt.datatype.domain.display.PreDef;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.domain.display.ChangedSegment;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentConformanceStatement;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentStructure;
import gov.nist.hit.hl7.igamt.segment.exception.SegmentValidationException;

/**
 *
 * @author Jungyub Woo on Mar 15, 2018 .
 */
public interface SegmentService extends ResourceService {

  public Segment findByKey(CompositeKey key);

  public Segment findLatestById(String id);

  public Segment create(Segment segment);

  public Segment save(Segment segment) throws ValidationException;

  public List<Segment> findAll();

  public void delete(Segment segment);

  public void removeCollection();

  public List<Segment> findByDomainInfoVersion(String version);

  public List<Segment> findByDomainInfoScope(String scope);

  public List<Segment> findByDomainInfoScopeAndDomainInfoVersion(String scope, String verion);

  public List<Segment> findByName(String name);

  public List<Segment> findByDomainInfoScopeAndDomainInfoVersionAndName(String scope,
      String version, String name);

  public List<Segment> findByDomainInfoVersionAndName(String version, String name);

  public List<Segment> findByDomainInfoScopeAndName(String scope, String name);

  public Segment getLatestById(String id);

  public SegmentStructure convertDomainToStructure(Segment segment);

  public DisplayMetadata convertDomainToMetadata(Segment segment);

  public PreDef convertDomainToPredef(Segment segment);

  public PostDef convertDomainToPostdef(Segment segment);

  public Segment saveSegment(ChangedSegment changedSegment) throws ValidationException;

  public List<Segment> findDisplayFormatByScopeAndVersion(String scope, String version);

  public SegmentConformanceStatement convertDomainToConformanceStatement(Segment segment);

  public Segment convertToSegment(SegmentStructure structure);


  /**
   * Validate the structure of the segment
   * 
   * @param structure
   * @throws SegmentValidationException
   */
  public void validate(SegmentStructure structure) throws SegmentValidationException;

  /**
   * Validate the metadata information of the segment
   * 
   * @param metadata
   * @throws SegmentValidationException
   */
  public void validate(DisplayMetadata metadata) throws SegmentValidationException;


  /**
   * 
   * @param predef
   * @return
   * @throws SegmentNotFoundException
   */
  public Segment savePredef(PreDef predef) throws SegmentNotFoundException;

  /**
   * 
   * @param postdef
   * @return
   * @throws SegmentNotFoundException
   */
  public Segment savePostdef(PostDef postdef) throws SegmentNotFoundException;

  /**
   * 
   * @param metadata
   * @return
   * @throws SegmentNotFoundException
   * @throws SegmentValidationException
   */
  public Segment saveMetadata(DisplayMetadata metadata)
      throws SegmentNotFoundException, SegmentValidationException;

  /**
   * Validate conformance statements of the segment
   * 
   * @param conformanceStatement
   * @throws SegmentValidationException
   */
  public void validate(SegmentConformanceStatement conformanceStatement)
      throws SegmentValidationException;


  /**
   * Save the conformance statements of the segment
   * 
   * @param conformanceStatement
   * @return
   * @throws SegmentNotFoundException
   * @throws SegmentValidationException
   */
  public Segment saveConformanceStatement(SegmentConformanceStatement conformanceStatement)
      throws SegmentNotFoundException, SegmentValidationException;

}
