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
package gov.nist.hit.hl7.igamt.serialization.domain;

import java.util.Map;

import gov.nist.hit.hl7.igamt.common.base.domain.AbstractDomain;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import gov.nist.hit.hl7.igamt.serialization.util.FroalaSerializationUtil;
import nu.xom.Attribute;
import nu.xom.Element;

/**
 *
 * @author Maxence Lefort on Apr 2, 2018.
 */
public abstract class SerializableAbstractDomain extends SerializableElement {

  private AbstractDomain abstractDomain;
  
  protected static final String FIELD_PATH_SEPARATOR = "-";
  protected static final String COMPONENT_PATH_SEPARATOR = "-";
  protected static final String SEGMENT_GROUP_PATH_SEPARATOR = ".";

  public SerializableAbstractDomain(AbstractDomain abstractDomain, String position) {
    this(abstractDomain, position, abstractDomain.getName());
  }

  public SerializableAbstractDomain(AbstractDomain abstractDomain, String position, String title) {
    super(abstractDomain.getId().getId(), position, title);
    this.abstractDomain = abstractDomain;
  }

  @Override
  public Element getElement(Type type) {
    Element element = super.getElement(type);
    if (this.abstractDomain != null) {
      if (this.abstractDomain.getComment() != null && !this.abstractDomain.getComment().isEmpty()) {
        Element commentElement = new Element("Comment");
        commentElement.appendChild(
            FroalaSerializationUtil.cleanFroalaInput(this.abstractDomain.getComment()));
        element.appendChild(commentElement);
      }
      element.addAttribute(new Attribute("createdFrom",
          this.abstractDomain.getCreatedFrom() != null ? this.abstractDomain.getCreatedFrom()
              : ""));
      element.addAttribute(new Attribute("description",
          this.abstractDomain.getDescription() != null
              ? FroalaSerializationUtil.cleanFroalaInput(this.abstractDomain.getDescription())
              : ""));
      element.addAttribute(new Attribute("name",
          this.abstractDomain.getName() != null ? this.abstractDomain.getName() : ""));
      element.addAttribute(new Attribute("id",
          this.abstractDomain.getId() != null && this.abstractDomain.getId().getId() != null
              ? this.abstractDomain.getId().getId()
              : ""));

      element.addAttribute(new Attribute("username",
          this.abstractDomain.getUsername() != null ? this.abstractDomain.getUsername() : ""));
    }
    return element;
  }

  /**
   * @param binding
   * @return
   * @throws SerializationException
   */
  public Element serializeResourceBinding(ResourceBinding binding,
      Map<String, String> valuesetNamesMap) throws SerializationException {
    Map<String, String> pathLocationMap = this.getIdPathMap();
    SerializableBinding serializableBinding = new SerializableBinding(binding, pathLocationMap, valuesetNamesMap);
    return serializableBinding.serialize();
  }
  
  public abstract Map<String, String> getIdPathMap();

  public AbstractDomain getAbstractDomain() {
    return abstractDomain;
  }

  public void setAbstractDomain(AbstractDomain abstractDomain) {
    this.abstractDomain = abstractDomain;
  }

}
