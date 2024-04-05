package gov.nist.hit.hl7.igamt.api;

import gov.nist.hit.hl7.igamt.api.codesets.exception.ResourceAPIException;
import gov.nist.hit.hl7.igamt.access.exception.ResourceNotFoundAPIException;
import gov.nist.hit.hl7.igamt.api.codesets.model.ResponseMessage;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class APIControllerAdvice {
	@ResponseBody
	@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	@ExceptionHandler({ResourceAPIException.class})
	public ResponseMessage handleResourceAPIException(ResourceAPIException exception) {
		return new ResponseMessage(exception.getMessage());
	}
	@ResponseBody
	@ResponseStatus(HttpStatus.NOT_FOUND)
	@ExceptionHandler({ResourceNotFoundAPIException.class})
	public ResponseMessage handleResourceNotFoundAPIException(ResourceNotFoundAPIException exception) {
		return new ResponseMessage(exception.getMessage());
	}
}
