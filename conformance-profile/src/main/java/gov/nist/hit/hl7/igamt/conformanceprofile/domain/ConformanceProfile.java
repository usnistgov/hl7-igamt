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

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;

/**
 *
 * @author Maxence Lefort on Mar 9, 2018.
 */
public class ConformanceProfile extends Resource {

  private String identifier;
  private String messageType; // Message/@Type
  private String event; // Message/@Event
  private String structID; // Message/@StructID private String identifier;
  private Set<SegmentRefOrGroup> children = new HashSet<SegmentRefOrGroup>();
  private ResourceBinding binding;


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

  @Override
  public ConformanceProfile clone() {

    ConformanceProfile clone = new ConformanceProfile();
    clone.setBinding(this.binding);
    clone.setChildren(this.getChildren());
    clone.setComment(this.getComment());
    clone.setCreatedFrom(this.getId());
    clone.setDescription(this.getDescription());
    DomainInfo domainInfo = this.getDomainInfo();
    domainInfo.setScope(Scope.USER);
    clone.setEvent(this.getEvent());
    clone.setId(null);
    clone.setMessageType(messageType);
    clone.setIdentifier(identifier);
    clone.setPostDef(this.getPostDef());
    clone.setPreDef(this.getPreDef());
    clone.setStructID(structID);
    clone.setName(this.getName());
    clone.setDomainInfo(domainInfo);
    clone.setCreationDate(new Date());
    clone.setUpdateDate(new Date());
    return clone;

  }

  /*
   * (non-Javadoc)
   * 
   * @see gov.nist.hit.hl7.igamt.shared.domain.AbstractDomain#getLabel()
   */
  @Override
  public String getLabel() {
    return this.getName();
  }

}
