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
package gov.nist.hit.hl7.igamt.conformanceprofile.domain;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.ProfileType;
import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.Role;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.event.Event;

/**
 * @author Abdelghani El Ouakili
 *
 */
public class MessageStructure extends Resource {
  private String identifier;
  private String messageType; // Message/@Type
  private String structID; // Message/@StructID private String identifier;
  private ProfileType profileType;
  private Role role;
  private List<MessageProfileIdentifier> profileIdentifier;
  private Set<SegmentRefOrGroup> children = new HashSet<SegmentRefOrGroup>();
  private ResourceBinding binding;
  private List<Event> events;
  private List<String> participants = new ArrayList<String>();
  
  
  public List<Event> getEvents() {
    return events;
  }

  public void setEvents(List<Event> events) {
    this.events = events;
  }

  public String getMessageType() {
    return messageType;
  }

  public void setMessageType(String messageType) {
    this.messageType = messageType;
  }
  public String getStructID() {
    return structID;
  }

  public void setStructID(String structID) {
    this.structID = structID;
  }

  public MessageStructure() {
    super();
    super.setType(Type.CONFORMANCEPROFILE);
  }

  public Set<SegmentRefOrGroup> getChildren() {
    return children;
  }

  public void setChildren(Set<SegmentRefOrGroup> children) {
    this.children = children;
  }

  public ResourceBinding getBinding() {
    if (binding == null) {
      binding = new ResourceBinding();
    }
    return binding;
  }

  public void setBinding(ResourceBinding binding) {
    this.binding = binding;
  }

  public String getIdentifier() {
    return identifier;
  }

  public void setIdentifier(String identifier) {
    this.identifier = identifier;
  }

  public void addChild(SegmentRefOrGroup mse) {
    this.children.add(mse);
  }

  /*
   * (non-Javadoc)
   * 
   * @see gov.nist.hit.hl7.igamt.shared.domain.AbstractDomain#getLabel()
   */
  @Override
  public String getLabel() {
      if(this.getIdentifier()!=null&&!this.getIdentifier().isEmpty()) {
          return this.getName()+"-"+this.getIdentifier();
      }
    return this.getName();
  }

  public void complete( MessageStructure elm) {
      super.complete(elm);
      elm.identifier = identifier;
      elm.messageType = messageType;
      elm.events = events;
      elm.structID = structID;
      elm.children = children;
      elm.binding = binding;
  }
  
  public ConformanceProfile clone() {
      ConformanceProfile elm= new ConformanceProfile();
      complete(elm);
      return elm;
  }

  public ProfileType getProfileType() {
    return profileType;
  }

  public void setProfileType(ProfileType profileType) {
    this.profileType = profileType;
  }

  public Role getRole() {
    return role;
  }

  public void setRole(Role role) {
    this.role = role;
  }

  public List<MessageProfileIdentifier> getProfileIdentifier() {
    return profileIdentifier;
  }

  public void setProfileIdentifier(List<MessageProfileIdentifier> profileIdentifier) {
    this.profileIdentifier = profileIdentifier;
  }

  public List<String> getParticipants() {
    return participants;
  }

  public void setParticipants(List<String> participants) {
    this.participants = participants;
  }
}
