package gov.nist.hit.hl7.igamt.service.impl.exception;

import java.util.ArrayList;
import java.util.List;

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
 * <p>
 * Created by Maxence Lefort on 10/30/17.
 */
public abstract class SerializationException extends Exception {

    private Exception originalException;
    private String message;
    private String location;

    public SerializationException(Exception originalException, String location) {
        this.originalException = originalException;
        this.location = location;
    }

    public SerializationException(Exception originalException, String location, String message) {
        this.originalException = originalException;
        if(message != null && !message.isEmpty()) {
            this.message = message;
        }
        this.location = location;
    }

    public abstract String getLabel();

    public String getLocation(){
        if(this.originalException instanceof SerializationException){
            return getFullLocation() + " -> " + ((SerializationException)originalException).getLocation();
        } else {
            return getFullLocation();
        }
    }
    
    private String getFullLocation(){
    	return "["+this.getLabel()+"] "+this.location;
    }

    public List<String> getErrorMessages(){
    	ArrayList<String> errorMessagesStack = new ArrayList<>();
        if(message != null && !message.isEmpty()){
        	 errorMessagesStack.add("["+this.getLabel()+"] - "+message);
        }
        if(this.originalException instanceof SerializationException){
        	errorMessagesStack.addAll(((SerializationException) originalException).getErrorMessages());
        } else {
        	if(originalException.getMessage() != null && !originalException.getMessage().isEmpty()){
        		errorMessagesStack.add("["+originalException.getClass().getSimpleName()+"] - "+originalException.getMessage());
        	}
        }
        return errorMessagesStack;
    }
}
