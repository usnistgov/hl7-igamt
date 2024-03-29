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

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import gov.nist.hit.hl7.igamt.common.base.exception.ForbiddenOperationException;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage.Status;
import gov.nist.hit.hl7.igamt.xreference.exceptions.XReferenceException;

/**
 * @author Harold Affo
 *
 */
@RestControllerAdvice
public class IGDocumentExceptionHandler {


  @ResponseBody
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  @ExceptionHandler({XReferenceFoundException.class})
  public XReferenceFoundException handleXReferenceFoundException(
      XReferenceFoundException exception) {
    return exception;
  }

  @ResponseBody
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  @ExceptionHandler({AddingException.class})
  public AddingException handleXReferenceFoundException(AddingException exception) {
	  exception.printStackTrace();
    return exception;
  }


  @ResponseBody
  @ResponseStatus(HttpStatus.FORBIDDEN)
  @ExceptionHandler({ForbiddenOperationException.class})
  public ResponseMessage handleForbiddenOperationException(ForbiddenOperationException exception) {
    ResponseMessage message = new ResponseMessage(Status.FAILED, exception.getLocalizedMessage());
	  exception.printStackTrace();

    return message;
  }


  @ResponseBody
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  @ExceptionHandler({XReferenceException.class})
  public ResponseMessage handleXRefererenceException(XReferenceException exception) {
	  exception.printStackTrace();

    ResponseMessage message = new ResponseMessage(Status.FAILED, exception.getLocalizedMessage());
    return message;
  }


  @ResponseBody
  @ResponseStatus(HttpStatus.NOT_FOUND)
  @ExceptionHandler({IGNotFoundException.class})
  public ResponseMessage handleIGNotFoundException(IGNotFoundException exception) {
	  exception.printStackTrace();

    ResponseMessage message = new ResponseMessage(Status.FAILED, exception.getLocalizedMessage());
    return message;
  }


  @ResponseBody
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  @ExceptionHandler({CloneException.class})
  public ResponseMessage handleCloneException(CloneException exception) {
	  exception.printStackTrace();

    ResponseMessage message = new ResponseMessage(Status.FAILED, exception.getLocalizedMessage());
    return message;
  }

  @ResponseBody
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  @ExceptionHandler({IGUpdateException.class})
  public ResponseMessage handleUpdateTocException(IGUpdateException exception) {
	  exception.printStackTrace();

    ResponseMessage message = new ResponseMessage(Status.FAILED, exception.getLocalizedMessage());
    return message;
  }

  @ResponseBody
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  @ExceptionHandler({IGConverterException.class})
  public ResponseMessage handleUpdateTocException(IGConverterException exception) {
	  exception.printStackTrace();

    ResponseMessage message = new ResponseMessage(Status.FAILED, exception.getLocalizedMessage());
    return message;
  }

  @ResponseBody
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  @ExceptionHandler({IGCreationException.class})
  public ResponseMessage handleIGCreationException(IGCreationException exception) {
	  exception.printStackTrace();

    ResponseMessage message = new ResponseMessage(Status.FAILED, exception.getLocalizedMessage());
    return message;
  }


  @ResponseBody
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  @ExceptionHandler({Exception.class})
  public ResponseMessage general(Exception exception) {
	  exception.printStackTrace();

    ResponseMessage message = new ResponseMessage(Status.FAILED, exception.getLocalizedMessage());
    return message;
  }


}
