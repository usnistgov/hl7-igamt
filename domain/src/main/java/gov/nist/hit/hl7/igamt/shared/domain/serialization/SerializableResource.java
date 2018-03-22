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
package gov.nist.hit.hl7.igamt.shared.domain.serialization;

import gov.nist.hit.hl7.igamt.serialization.domain.SerializableElement;
import gov.nist.hit.hl7.igamt.serialization.util.DateSerializationUtil;
import gov.nist.hit.hl7.igamt.shared.domain.Resource;
import gov.nist.hit.hl7.igamt.shared.domain.binding.ResourceBinding;
import nu.xom.Attribute;
import nu.xom.Element;

/**
 *
 * @author Maxence Lefort on Mar 13, 2018.
 */
public abstract class SerializableResource extends SerializableElement {

  protected Resource resource;
  
  public SerializableResource(Resource resource, String position) {
    super(resource.getId().getId(), position, resource.getName());
    this.resource = resource;
  }
  
  public Element getElement(String elementName) {
    Element element = super.getElement(elementName);
    element.addAttribute(new Attribute("comment",this.resource.getComment()));
    element.addAttribute(new Attribute("createdFrom",this.resource.getCreatedFrom()));
    element.addAttribute(new Attribute("description",this.resource.getDescription()));
    element.addAttribute(new Attribute("name",this.resource.getName()));
    element.addAttribute(new Attribute("postDef",this.resource.getPostDef()));
    element.addAttribute(new Attribute("preDef",this.resource.getPreDef()));
    element.addAttribute(new Attribute("domainVersion",this.resource.getDomainInfo().getVersion()));
    element.addAttribute(new Attribute("domainCompatibilityVersions",String.join(",", this.resource.getDomainInfo().getCompatibilityVersion())));
    element.addAttribute(new Attribute("domainScope",this.resource.getDomainInfo().getScope().name()));
    element.addAttribute(new Attribute("id",this.resource.getId().getId()));
    element.addAttribute(new Attribute("publicationVersion",this.resource.getPublicationInfo().getPublicationVersion()));
    element.addAttribute(new Attribute("publicationDate",DateSerializationUtil.serializeDate(this.resource.getPublicationInfo().getPublicationDate())));
    element.addAttribute(new Attribute("username",this.resource.getUsername()));

    return element;
  }

  /**
   * @param binding
   * @return
   */
  public Element serializeResourceBinding(ResourceBinding binding) {
    Element element = new Element("Binding");
    //TODO serialize binding + implement unit test
    return element;
  }

}