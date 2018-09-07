package gov.nist.hit.hl7.igamt.datatypeLibrary.exceptions;

import java.util.List;
import java.util.Map;

import org.bson.Document;

import gov.nist.hit.hl7.igamt.common.base.exception.ExceptionType;
import gov.nist.hit.hl7.igamt.common.base.exception.GenericException;

public class XReferenceFoundException extends GenericException {

  /**
   * 
   */
  private static final long serialVersionUID = -6887787296077348003L;

  private Map<String, List<Document>> xreferences;
  private String id;
  private ExceptionType type;

  public XReferenceFoundException(String id, Map<String, List<Document>> xreferences) {
    super("Cross references found for " + id);
    this.id = id;
    this.xreferences = xreferences;
    this.setType(ExceptionType.XREFERENCEFOUND);
  }

  public Map<String, List<Document>> getXreferences() {
    return xreferences;
  }

  public void setXreferences(Map<String, List<Document>> xreferences) {
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
