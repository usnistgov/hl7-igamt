package gov.nist.hit.hl7.igamt.datatypeLibrary.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import gov.nist.hit.hl7.igamt.common.base.exception.ForbiddenOperationException;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage.Status;
import gov.nist.hit.hl7.igamt.common.exception.IGNotFoundException;
import gov.nist.hit.hl7.igamt.xreference.exceptions.XReferenceException;

/**
 * @author Harold Affo
 *
 */
@ControllerAdvice
public class DatatypeLibraryExceptionHandler {


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
    return exception;
  }


  @ResponseBody
  @ResponseStatus(HttpStatus.FORBIDDEN)
  @ExceptionHandler({ForbiddenOperationException.class})
  public ResponseMessage handleForbiddenOperationException(ForbiddenOperationException exception) {
    ResponseMessage message = new ResponseMessage(Status.FAILED, exception.getLocalizedMessage());
    return message;
  }


  @ResponseBody
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  @ExceptionHandler({XReferenceException.class})
  public ResponseMessage handleXRefererenceException(XReferenceException exception) {
    ResponseMessage message = new ResponseMessage(Status.FAILED, exception.getLocalizedMessage());
    return message;
  }


  @ResponseBody
  @ResponseStatus(HttpStatus.NOT_FOUND)
  @ExceptionHandler({IGNotFoundException.class})
  public ResponseMessage handleIGNotFoundException(IGNotFoundException exception) {
    ResponseMessage message = new ResponseMessage(Status.FAILED, exception.getLocalizedMessage());
    return message;
  }


  @ResponseBody
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  @ExceptionHandler({CloneException.class})
  public ResponseMessage handleCloneException(CloneException exception) {
    ResponseMessage message = new ResponseMessage(Status.FAILED, exception.getLocalizedMessage());
    return message;
  }

  @ResponseBody
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  @ExceptionHandler({DatatypeLibraryUpdateException.class})
  public ResponseMessage handleUpdateTocException(DatatypeLibraryUpdateException exception) {
    ResponseMessage message = new ResponseMessage(Status.FAILED, exception.getLocalizedMessage());
    return message;
  }

  @ResponseBody
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  @ExceptionHandler({DatatypeLibraryConverterException.class})
  public ResponseMessage handleUpdateTocException(DatatypeLibraryConverterException exception) {
    ResponseMessage message = new ResponseMessage(Status.FAILED, exception.getLocalizedMessage());
    return message;
  }



}
