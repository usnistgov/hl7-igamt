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
package gov.nist.hit.hl7.igamt.conformanceprofile.domain;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;

import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintBinding;
import gov.nist.hit.hl7.igamt.common.base.domain.ProfileType;
import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.Role;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
import gov.nist.hit.hl7.resource.change.service.ApplyChange;
import gov.nist.hit.hl7.igamt.common.slicing.domain.Slicing;

/**
 *
 * @author Maxence Lefort on Mar 9, 2018.
 */
public class ConformanceProfile extends Resource {

  private String identifier;
  private String messageStructureId;
  private boolean custom;
  private String messageType; // Message/@Type
  private String event; // Message/@Event
  private String structID; // Message/@StructID private String identifier;
  private ProfileType profileType;
  private String displayName;
  private Role role;
  @Deprecated
  private List<MessageProfileIdentifier> profileIdentifier;
  private MessageProfileIdentifier preCoordinatedMessageIdentifier;
  private Set<SegmentRefOrGroup> children = new HashSet<SegmentRefOrGroup>();
  private List<CoConstraintBinding> coConstraintsBindings; 
  private ResourceBinding binding;
  private Set<Slicing> slicings;

  public String getMessageType() {
    return messageType;
  }

  public void setMessageType(String messageType) {
    this.messageType = messageType;
  }

  public String getEvent() {
    return event;
  }

  public void setEvent(String event) {
    this.event = event;
  }

  public String getStructID() {
    return structID;
  }

  public void setStructID(String structID) {
    this.structID = structID;
  }

  public ConformanceProfile() {
    super();
    super.setType(Type.CONFORMANCEPROFILE);
    this.profileType= ProfileType.HL7;
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
      if(this.getIdentifier()!=null && !this.getIdentifier().isEmpty()) {
          return this.getName()+"-"+this.getIdentifier();
      }
    return this.getName();
  }

  public void complete(ConformanceProfile elm) {
      super.complete(elm);
      elm.identifier = identifier;
      elm.messageType = messageType;
      elm.event = event;
      elm.structID = structID;
      elm.children = children;
      elm.binding = binding;
      elm.coConstraintsBindings= coConstraintsBindings;
      elm.custom = custom;
      elm.messageStructureId = messageStructureId;
  }

  public ConformanceProfile(MessageStructure elm, String event) {
    super();
    this.children= elm.getChildren();
    this.messageType = elm.getMessageType();
    this.event = event;
    this.structID = elm.getStructID();
    this.binding = elm.getBinding();
    this.messageStructureId = elm.getId();
    this.custom = elm.isCustom();
    this.setDomainInfo(elm.getDomainInfo());
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

  public List<CoConstraintBinding> getCoConstraintsBindings() {
    return coConstraintsBindings;
  }

  public void setCoConstraintsBindings(List<CoConstraintBinding> coConstraintsBindings) {
    this.coConstraintsBindings = coConstraintsBindings;
  }

@Override
public String toString() {
	return "ConformanceProfile [identifier=" + identifier + ", messageType=" + messageType + ", event=" + event
			+ ", structID=" + structID + ", profileType=" + profileType + ", role=" + role + ", profileIdentifier="
			+ profileIdentifier + ", children=" + children + ", coConstraintsBindings=" + coConstraintsBindings
			+ ", binding=" + binding + "]";
}

public String getDisplayName() {
  return displayName;
}

public void setDisplayName(String displayName) {
  this.displayName = displayName;
}

public MessageProfileIdentifier getPreCoordinatedMessageIdentifier() {
  return preCoordinatedMessageIdentifier;
}

public void setPreCoordinatedMessageIdentifier(MessageProfileIdentifier preCoordinatedMessageIdentifier) {
  this.preCoordinatedMessageIdentifier = preCoordinatedMessageIdentifier;
}

  public String getMessageStructureId() {
    return messageStructureId;
  }

  public void setMessageStructureId(String messageStructureId) {
    this.messageStructureId = messageStructureId;
  }

  public Set<Slicing> getSlicings() {
    return slicings;
  }

  public void setSlicings(Set<Slicing> slicings) {
    this.slicings = slicings;
  }
}
