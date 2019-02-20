package gov.nist.hit.hl7.igamt.datatypeLibrary.exceptions;

import java.util.List;
import java.util.Map;

import org.bson.Document;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import gov.nist.hit.hl7.igamt.common.base.exception.ForbiddenOperationException;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage.Status;
import gov.nist.hit.hl7.igamt.xreference.exceptions.XReferenceException;

/**
 * @author Harold Affo
 *
 */

@ControllerAdvice
public class DatatypeLibraryExceptionHandler {


//  @ResponseBody
//  @ResponseStatus(HttpStatus.BAD_REQUEST)
//  @ExceptionHandler({XReferenceFoundException.class})
//  public ResponseMessage<Map<String, List<Document>>> handleXReferenceFoundException(
//      XReferenceFoundException exception) {
//    ResponseMessage message = new ResponseMessage(Status.FAILED, exception.getLocalizedMessage());
//    message.setData(exception.getXreferences());
//    return message;
//  }

  @ResponseBody
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  @ExceptionHandler({Exception.class})
  public ResponseMessage generalException(Exception exception) {
    ResponseMessage message = new ResponseMessage(Status.FAILED, exception.getLocalizedMessage());
    return message;
  }

  @ResponseBody
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  @ExceptionHandler({OperationNotAllowedException.class})
  public ResponseMessage handleXReferenceFoundException(OperationNotAllowedException exception) {
    ResponseMessage message = new ResponseMessage(Status.FAILED, exception.getLocalizedMessage());
    return message;
  }

  @ResponseBody
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  @ExceptionHandler({AddingException.class})
  public ResponseMessage handleXReferenceFoundException(AddingException exception) {
    ResponseMessage message = new ResponseMessage(Status.FAILED, exception.getLocalizedMessage());
    return message;
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
