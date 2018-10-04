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
package gov.nist.hit.hl7.igamt.segment.exception;

import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import gov.nist.hit.hl7.igamt.common.base.exception.ForbiddenOperationException;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage.Status;
import gov.nist.hit.hl7.igamt.segment.serialization.exception.CoConstraintSaveException;

/**
 * @author Harold Affo
 *
 */
@ControllerAdvice
public class SegmentExceptionHandler {


  @ResponseBody
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  @ExceptionHandler({SegmentValidationException.class})
  public ResponseMessage handleValidationException(SegmentValidationException exception) {
    ResponseMessage message = new ResponseMessage(Status.FAILED, exception.getLocalizedMessage());
    return message;
  }


  @ResponseBody
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  @ExceptionHandler({SegmentException.class})
  public ResponseMessage handleSegmentException(SegmentException exception) {
    ResponseMessage message = new ResponseMessage(Status.FAILED, exception.getLocalizedMessage());
    return message;
  }


  @ResponseBody
  @ResponseStatus(HttpStatus.NOT_FOUND)
  @ExceptionHandler({SegmentNotFoundException.class})
  public ResponseMessage handleSegmentNotFoundException(SegmentNotFoundException exception) {
    ResponseMessage message = new ResponseMessage(Status.FAILED, exception.getLocalizedMessage());
    return message;
  }

  @ResponseBody
  @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
  @ExceptionHandler({ForbiddenOperationException.class})
  public ResponseMessage handleSegmentNotFoundException(ForbiddenOperationException exception) {
    ResponseMessage message = new ResponseMessage(Status.FAILED, exception.getLocalizedMessage());
    return message;
  }

  @ResponseBody
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  @ExceptionHandler({CoConstraintSaveException.class})
  public ResponseMessage handleValidationException(CoConstraintSaveException exception) {
	Map<String, String> map = exception.getErrors();
	String errorMessage = "";
	for(Entry<String, String> entry : map.entrySet()){
		errorMessage += "Error At ["+entry.getKey()+"] : "+entry.getValue()+".   ";
	}
    ResponseMessage message = new ResponseMessage(Status.FAILED, errorMessage);
    return message;
  }



}
