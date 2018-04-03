/**
 * 
 * This software was developed at the National Institute of Standards and Technology by employees of
 * the Federal Government in the course of their official duties. Pursuant to title 17 Section 105
 * of the United States Code this software is not subject to copyright protection and is in the
 * public domain. This is an experimental system. NIST assumes no responsibility whatsoever for its
 * use by other parties, and makes no guarantees, expressed or implied, about its quality,
 * reliability, or any other characteristic. We would appreciate acknowledgement if the software is
 * used. This software can be redistributed and/or modified freely provided that any derivative
 * works bear some notice that they are derived from it, and any modified versions bear some notice
 * that they have been modified.
 * 
 */
package gov.nist.hit.hl7.igamt.serialization.exception;

import gov.nist.hit.hl7.igamt.shared.domain.MsgStructElement;

/**
 *
 * @author Maxence Lefort on Mar 28, 2018.
 */
public class MsgStructElementSerializationException extends SerializationException {

  /**
   * @param originException
   * @param type
   * @param location
   */
  public MsgStructElementSerializationException(Exception originException,
      MsgStructElement msgStructElement, String message) {
    super(originException, msgStructElement.getType(), msgStructElement.getId(), message);
  }
  
  public MsgStructElementSerializationException(Exception originException,
      MsgStructElement msgStructElement) {
    this(originException, msgStructElement, null);
  }

  /**
   * 
   */
  private static final long serialVersionUID = -3044162688832772916L;

}
