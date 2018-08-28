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
package gov.nist.hit.hl7.igamt.ig.controller.wrappers;

import java.util.List;

import gov.nist.hit.hl7.igamt.conformanceprofile.domain.event.Event;


/**
 * @author ena3
 *
 */
public class AddingMessagesWrapper {
  private List<Event> msgEvts;
  private String id;

  public AddingMessagesWrapper() {
    super();
    // TODO Auto-generated constructor stub
  }

  public List<Event> getMsgEvts() {
    return msgEvts;
  }

  public void setMsgEvts(List<Event> msgEvts) {
    this.msgEvts = msgEvts;
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public AddingMessagesWrapper(List<Event> msgEvts, String id) {
    super();
    this.msgEvts = msgEvts;
    this.id = id;
  }



}
