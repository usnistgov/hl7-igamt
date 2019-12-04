/**
 * This software was developed at the National Institute of Standards and Technology by employees of
 * the Federal Government in the course of their official duties. Pursuant to title 17 Section 105
 * of the United States Code this software is not subject to copyright protection and is in the
 * public domain. This is an experimental system. NIST assumes no responsibility whatsoever for its
 * use by other parties, and makes no guarantees, expressed or implied, about its quality,
 * reliability, or any other characteristic. We would appreciate acknowledgement if the software is
 * used. This software can be redistributed and/or modified freely provided that any derivative
 * works bear some notice that they are derived from it, and any modified versions bear some notice
 * that they have been modified.
 */
package gov.nist.hit.hl7.igamt.ig.domain.verification;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import gov.nist.hit.hl7.igamt.service.impl.ConformanceProfileObjectError;
import gov.nist.hit.hl7.igamt.service.impl.DatatypeObjectError;
import gov.nist.hit.hl7.igamt.service.impl.IgObjectError;
import gov.nist.hit.hl7.igamt.service.impl.SegmentObjectError;
import gov.nist.hit.hl7.igamt.service.impl.ValuesetObjectError;

/**
 * @author jungyubw
 *
 */
public class VerificationResult implements Serializable {

  /**
   * 
   */
  private static final long serialVersionUID = -5775165964558251622L;

  private List<ValuesetObjectError> valuesetObjectErrors;

  private List<DatatypeObjectError> datatypeObjectErrors;

  private List<SegmentObjectError> segmentObjectErrors;

  private List<ConformanceProfileObjectError> conformanceProfileObjectErrors;

  private List<IgObjectError> igObjectErrors;

  /**
   * @param datatypeObjectError
   */
  public void addDatatypeError(DatatypeObjectError datatypeObjectError) {
    if (this.datatypeObjectErrors == null)
      this.datatypeObjectErrors = new ArrayList<DatatypeObjectError>();

    this.datatypeObjectErrors.add(datatypeObjectError);
  }

  /**
   * @param datatypeObjectError
   */
  public void addSegmentError(SegmentObjectError segmentObjectError) {
    if (this.segmentObjectErrors == null)
      this.segmentObjectErrors = new ArrayList<SegmentObjectError>();

    this.segmentObjectErrors.add(segmentObjectError);
  }

  /**
   * @param conformanceProfileObjectError2
   */
  public void addConformanceProfileError(
      ConformanceProfileObjectError conformanceProfileObjectError) {
    if (this.conformanceProfileObjectErrors == null)
      this.conformanceProfileObjectErrors = new ArrayList<ConformanceProfileObjectError>();

    this.conformanceProfileObjectErrors.add(conformanceProfileObjectError);

  }

  /**
   * @param valuesetObjectError
   */
  public void addValuesetError(ValuesetObjectError valuesetObjectError) {
    if (this.valuesetObjectErrors == null)
      this.valuesetObjectErrors = new ArrayList<ValuesetObjectError>();

    this.valuesetObjectErrors.add(valuesetObjectError);


  }

  /**
   * @param igObjectError
   */
  public void addIgError(IgObjectError igObjectError) {
    if (this.igObjectErrors == null)
      this.igObjectErrors = new ArrayList<IgObjectError>();

    this.igObjectErrors.add(igObjectError);

  }

  public List<ValuesetObjectError> getValuesetObjectErrors() {
    return valuesetObjectErrors;
  }

  public void setValuesetObjectErrors(List<ValuesetObjectError> valuesetObjectErrors) {
    this.valuesetObjectErrors = valuesetObjectErrors;
  }

  public List<DatatypeObjectError> getDatatypeObjectErrors() {
    return datatypeObjectErrors;
  }

  public void setDatatypeObjectErrors(List<DatatypeObjectError> datatypeObjectErrors) {
    this.datatypeObjectErrors = datatypeObjectErrors;
  }

  public List<SegmentObjectError> getSegmentObjectErrors() {
    return segmentObjectErrors;
  }

  public void setSegmentObjectErrors(List<SegmentObjectError> segmentObjectErrors) {
    this.segmentObjectErrors = segmentObjectErrors;
  }

  public List<ConformanceProfileObjectError> getConformanceProfileObjectErrors() {
    return conformanceProfileObjectErrors;
  }

  public void setConformanceProfileObjectErrors(
      List<ConformanceProfileObjectError> conformanceProfileObjectErrors) {
    this.conformanceProfileObjectErrors = conformanceProfileObjectErrors;
  }

  public List<IgObjectError> getIgObjectErrors() {
    return igObjectErrors;
  }

  public void setIgObjectErrors(List<IgObjectError> igObjectErrors) {
    this.igObjectErrors = igObjectErrors;
  }



}
