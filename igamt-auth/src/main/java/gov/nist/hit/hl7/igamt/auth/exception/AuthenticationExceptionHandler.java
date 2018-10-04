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
package gov.nist.hit.hl7.igamt.auth.exception;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import gov.nist.hit.hl7.auth.util.requests.ConnectionResponseMessage;
import gov.nist.hit.hl7.auth.util.requests.ConnectionResponseMessage.Status;


/**
 * @author ena3
 *
 */
@RestControllerAdvice
public class AuthenticationExceptionHandler {
  @ResponseBody
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  @ExceptionHandler({AuthenticationException.class})
  public ConnectionResponseMessage<Object> AuthenticationException(AuthenticationException e) {
    ConnectionResponseMessage<Object> message =
        new ConnectionResponseMessage<Object>(Status.FAILED, e.getLocalizedMessage());
    return message;
  }

  @ResponseBody
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  @ExceptionHandler({Exception.class})
  public ConnectionResponseMessage<Object> generalException(Exception e) {
    ConnectionResponseMessage<Object> message =
        new ConnectionResponseMessage<Object>(Status.FAILED, e.getLocalizedMessage());
    return message;
  }


}


