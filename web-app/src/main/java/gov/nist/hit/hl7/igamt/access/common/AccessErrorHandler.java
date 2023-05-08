package gov.nist.hit.hl7.igamt.access.common;

import com.fasterxml.jackson.databind.ObjectMapper;
import gov.nist.hit.hl7.igamt.access.exception.EditNotSyncException;
import gov.nist.hit.hl7.igamt.access.exception.EditSyncInconclusiveException;
import gov.nist.hit.hl7.igamt.access.exception.ResourceAccessDeniedException;
import gov.nist.hit.hl7.igamt.common.base.exception.ResourceNotFoundException;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.expression.ExpressionInvocationTargetException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;

@RestControllerAdvice
public class AccessErrorHandler {

    @Autowired
    ObjectMapper objectMapper;

    @ExceptionHandler(IllegalArgumentException.class)
    public void handleIllegalArgumentException(IllegalArgumentException e, HttpServletResponse response) throws IOException {
        e.printStackTrace();
        if(e.getCause() instanceof ExpressionInvocationTargetException) {
            Throwable cause = e.getCause().getCause();
            if(cause instanceof ResourceNotFoundException) {
                handleNotFoundException(response, (ResourceNotFoundException) cause);
                return;
            } else if(cause instanceof ResourceAccessDeniedException) {
                resourceAccessDeniedException(response, (ResourceAccessDeniedException) cause);
                return;
            } else if(cause instanceof EditNotSyncException) {
                editNotSyncException(response, (EditNotSyncException) cause);
                return;
            } else if(cause instanceof EditSyncInconclusiveException) {
                editSyncInconclusiveException(response, (EditSyncInconclusiveException) cause);
                return;
            }
        }
        handleIllegalArgumentException(response, e);
    }

    public void handleNotFoundException(HttpServletResponse response, ResourceNotFoundException e) throws IOException {
        response.setStatus(400);
        ResponseMessage<String> ack = new ResponseMessage<>(ResponseMessage.Status.FAILED, e.getMessage(), e.getMessage(), new Date());
        this.objectMapper.writeValue(response.getOutputStream(), ack);
    }

    public void resourceAccessDeniedException(HttpServletResponse response, ResourceAccessDeniedException e) throws IOException {
        response.setStatus(400);
        ResponseMessage<String> ack = new ResponseMessage<>(ResponseMessage.Status.FAILED, e.getMessage(), e.getMessage(), new Date());
        this.objectMapper.writeValue(response.getOutputStream(), ack);
    }

    public void editNotSyncException(HttpServletResponse response, EditNotSyncException e) throws IOException {
        response.setStatus(490);
        ResponseMessage<String> ack = new ResponseMessage<>(ResponseMessage.Status.FAILED, e.getMessage(), e.getMessage(), new Date());
        this.objectMapper.writeValue(response.getOutputStream(), ack);
    }

    public void editSyncInconclusiveException(HttpServletResponse response, EditSyncInconclusiveException e) throws IOException {
        response.setStatus(490);
        ResponseMessage<String> ack = new ResponseMessage<>(ResponseMessage.Status.FAILED, e.getMessage(), e.getMessage(), new Date());
        this.objectMapper.writeValue(response.getOutputStream(), ack);
    }

    public void handleIllegalArgumentException(HttpServletResponse response, IllegalArgumentException e) throws IOException {
        response.setStatus(400);
        ResponseMessage<String> ack = new ResponseMessage<>(ResponseMessage.Status.FAILED, e.getMessage(), e.getMessage(), new Date());
        this.objectMapper.writeValue(response.getOutputStream(), ack);
    }

}