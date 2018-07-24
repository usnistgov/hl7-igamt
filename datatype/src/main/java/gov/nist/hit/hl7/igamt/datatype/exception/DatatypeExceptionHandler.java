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
package gov.nist.hit.hl7.igamt.datatype.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage.Status;

/**
 * @author Harold Affo
 *
 */
@ControllerAdvice
public class DatatypeExceptionHandler {


  @ResponseBody
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  @ExceptionHandler({DatatypeValidationException.class})
  public ResponseMessage handleValidationException(DatatypeValidationException exception) {
    ResponseMessage message = new ResponseMessage(Status.FAILED, exception.getLocalizedMessage());
    return message;
  }


  @ResponseBody
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  @ExceptionHandler({DatatypeException.class})
  public ResponseMessage handleSegmentException(DatatypeException exception) {
    ResponseMessage message = new ResponseMessage(Status.FAILED, exception.getLocalizedMessage());
    return message;
  }


  @ResponseBody
  @ResponseStatus(HttpStatus.NOT_FOUND)
  @ExceptionHandler({DatatypeNotFoundException.class})
  public ResponseMessage handleDatatypeNotFoundException(DatatypeNotFoundException exception) {
    ResponseMessage message = new ResponseMessage(Status.FAILED, exception.getLocalizedMessage());
    return message;
  }



}
