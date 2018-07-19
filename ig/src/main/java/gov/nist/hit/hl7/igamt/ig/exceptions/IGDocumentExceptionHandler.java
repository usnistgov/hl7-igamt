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

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.mongodb.BasicDBObject;

import gov.nist.hit.hl7.igamt.common.base.exception.ForbiddenOperationException;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage.Type;
import gov.nist.hit.hl7.igamt.xreference.exceptions.XReferenceException;

/**
 * @author Harold Affo
 *
 */
@ControllerAdvice
public class IGDocumentExceptionHandler {


  @ResponseBody
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  @ExceptionHandler({XReferenceFoundException.class})
  public Map<String, List<BasicDBObject>> handleXReferenceFoundException(
      XReferenceFoundException exception) {
    return exception.getXreferences();
  }


  @ResponseBody
  @ResponseStatus(HttpStatus.FORBIDDEN)
  @ExceptionHandler({ForbiddenOperationException.class})
  public ResponseMessage handleForbiddenOperationException(ForbiddenOperationException exception) {
    ResponseMessage message = new ResponseMessage(Type.FAILED, exception.getLocalizedMessage());
    return message;
  }


  @ResponseBody
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  @ExceptionHandler({XReferenceException.class})
  public ResponseMessage handleXRefererenceException(XReferenceException exception) {
    ResponseMessage message = new ResponseMessage(Type.FAILED, exception.getLocalizedMessage());
    return message;
  }


  @ResponseBody
  @ResponseStatus(HttpStatus.NOT_FOUND)
  @ExceptionHandler({IGNotFoundException.class})
  public ResponseMessage handleIGNotFoundException(IGNotFoundException exception) {
    ResponseMessage message = new ResponseMessage(Type.FAILED, exception.getLocalizedMessage());
    return message;
  }


  @ResponseBody
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  @ExceptionHandler({CloneException.class})
  public ResponseMessage handleCloneException(CloneException exception) {
    ResponseMessage message = new ResponseMessage(Type.FAILED, exception.getLocalizedMessage());
    return message;
  }

  @ResponseBody
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  @ExceptionHandler({IGTocUpdateException.class})
  public ResponseMessage handleUpdateTocException(IGTocUpdateException exception) {
    ResponseMessage message = new ResponseMessage(Type.FAILED, exception.getLocalizedMessage());
    return message;
  }

  @ResponseBody
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  @ExceptionHandler({IGConverterException.class})
  public ResponseMessage handleUpdateTocException(IGConverterException exception) {
    ResponseMessage message = new ResponseMessage(Type.FAILED, exception.getLocalizedMessage());
    return message;
  }



}
