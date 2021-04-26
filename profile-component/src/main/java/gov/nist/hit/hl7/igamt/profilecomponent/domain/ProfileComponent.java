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
package gov.nist.hit.hl7.igamt.profilecomponent.domain;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.mongodb.core.mapping.Document;

import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.MessageProfileIdentifier;

/**
 * @author Abdelghani El Ouakili
 *
 */
@Document
public class ProfileComponent extends Resource {
  
  private MessageProfileIdentifier preCoordinatedMessageIdentifier;

  private Set<ProfileComponentContext> children = new HashSet<ProfileComponentContext>();

  /**
   * 
   */
  public ProfileComponent() {
    super();
    super.setType(Type.PROFILECOMPONENT);
  }

  /**
   * @param preDef
   * @param postDef
   */
  public ProfileComponent(String preDef, String postDef) {
    super(preDef, postDef);
    // TODO Auto-generated constructor stub
  }

  public Set<ProfileComponentContext> getChildren() {
    return children;
  }

  public void setChildren(Set<ProfileComponentContext> children) {
    this.children = children;
  }


  @Override
  public String getLabel() {
    return this.getName();
  }
  
  @Override
  public ProfileComponent clone() {

    ProfileComponent clone = new ProfileComponent();
    complete(clone);
    clone.setChildren(children);
    return clone;
  }

  public MessageProfileIdentifier getPreCoordinatedMessageIdentifier() {
    return preCoordinatedMessageIdentifier;
  }

  public void setPreCoordinatedMessageIdentifier(MessageProfileIdentifier preCoordinatedMessageIdentifier) {
    this.preCoordinatedMessageIdentifier = preCoordinatedMessageIdentifier;
  }
    
}
