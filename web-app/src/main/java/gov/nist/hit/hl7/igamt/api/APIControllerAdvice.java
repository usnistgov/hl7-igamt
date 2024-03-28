package gov.nist.hit.hl7.igamt.api;

import gov.nist.hit.hl7.igamt.access.exception.ResourceAPIException;
import gov.nist.hit.hl7.igamt.api.codesets.model.ResponseMessage;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class APIControllerAdvice {
	@ResponseBody
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ExceptionHandler({ResourceAPIException.class})
	public ResponseMessage handleIGCreationException(ResourceAPIException exception) {
		return new ResponseMessage(exception.getMessage());
	}
}
