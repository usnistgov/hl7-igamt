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
package gov.nist.hit.hl7.igamt.ig.exceptions;

import java.util.List;
import java.util.Map;

import org.bson.Document;

import gov.nist.hit.hl7.igamt.common.base.exception.ExceptionType;
import gov.nist.hit.hl7.igamt.common.base.exception.GenericException;
import gov.nist.hit.hl7.igamt.xreference.model.CrossRefsNode;



/**
 * @author Harold Affo
 *
 */
public class XReferenceFoundException extends GenericException {

  /**
   * 
   */
  private static final long serialVersionUID = -6887787296077348003L;

  private Map<String, List<CrossRefsNode>> xreferences;
  private String id;
  private ExceptionType type;

  public XReferenceFoundException(String id, Map<String, List<CrossRefsNode>> xreferences) {
    super("Cross references found for " + id);
    this.id = id;
    this.xreferences = xreferences;
    this.setType(ExceptionType.XREFERENCEFOUND);
  }

  public Map<String, List<CrossRefsNode>> getXreferences() {
    return xreferences;
  }

  public void setXreferences(Map<String, List<CrossRefsNode>> xreferences) {
    this.xreferences = xreferences;
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public ExceptionType getType() {
    return type;
  }

  public void setType(ExceptionType type) {
    this.type = type;
  }


}
