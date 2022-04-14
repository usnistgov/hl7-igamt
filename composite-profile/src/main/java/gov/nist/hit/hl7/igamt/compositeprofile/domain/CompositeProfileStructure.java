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
package gov.nist.hit.hl7.igamt.compositeprofile.domain;

import java.util.HashSet;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.MessageProfileIdentifier;



/**
 * 
 * Created by Maxence Lefort on Feb 20, 2018.
 */
public class CompositeProfileStructure extends Resource {

  private String conformanceProfileId;
  private Set<OrderedProfileComponentLink> orderedProfileComponents;
  private MessageProfileIdentifier preCoordinatedMessageIdentifier;
  private String flavorsExtension;

  public CompositeProfileStructure() {
    super();
    this.setType(Type.COMPOSITEPROFILE);
  }

  public String getConformanceProfileId() {
    return conformanceProfileId;
  }

  public void setConformanceProfileId(String conformanceProfileId) {
    this.conformanceProfileId = conformanceProfileId;
  }

  public Set<OrderedProfileComponentLink> getOrderedProfileComponents() {
    return orderedProfileComponents;
  }

  public void setOrderedProfileComponents(
      Set<OrderedProfileComponentLink> orderedProfileComponents) {
    this.orderedProfileComponents = orderedProfileComponents;
  }

  public void addOrderedProfileComponents(OrderedProfileComponentLink o) {
    if (this.orderedProfileComponents == null)
      this.orderedProfileComponents = new HashSet<OrderedProfileComponentLink>();
    this.orderedProfileComponents.add(o);
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

  @Override
  public CompositeProfileStructure clone() {
    CompositeProfileStructure clone = new CompositeProfileStructure();
    complete(clone);
    clone.setConformanceProfileId(conformanceProfileId);
    clone.setOrderedProfileComponents(orderedProfileComponents);
    clone.setFlavorsExtension(flavorsExtension);
    clone.preCoordinatedMessageIdentifier = preCoordinatedMessageIdentifier;
    return clone;
  }

  public MessageProfileIdentifier getPreCoordinatedMessageIdentifier() {
    return preCoordinatedMessageIdentifier;
  }

  public void setPreCoordinatedMessageIdentifier(MessageProfileIdentifier preCoordinatedMessageIdentifier) {
    this.preCoordinatedMessageIdentifier = preCoordinatedMessageIdentifier;
  }

  public String getFlavorsExtension() {
    return flavorsExtension;
  }

  public void setFlavorsExtension(String flavorsExtension) {
    this.flavorsExtension = flavorsExtension;
  }

}
