package gov.nist.hit.hl7.igamt.bootstrap.app;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.io.PrintWriter;
import java.io.StringWriter;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleAllExceptions(Exception ex) {
        // Log the full stack trace to the server logs
        logger.error("An unhandled exception occurred:", ex);

        // Create a String representation of the stack trace for the response body
        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);
        ex.printStackTrace(pw);
        String stackTrace = sw.toString();

        // Return a response with the stack trace and a 500 status code
        // NOTE: In a production environment, you would not expose the full stack trace to the client.
        // This is for debugging purposes only.
        return new ResponseEntity<>("Internal Server Error: " + ex.getMessage() + "\n\n" + stackTrace, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
