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

import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import gov.nist.hit.hl7.igamt.serialization.util.DateSerializationUtil;
import gov.nist.hit.hl7.igamt.shared.domain.AbstractDomain;
import gov.nist.hit.hl7.igamt.shared.domain.binding.ResourceBinding;
import gov.nist.hit.hl7.igamt.shared.domain.binding.StructureElementBinding;
import gov.nist.hit.hl7.igamt.shared.domain.binding.ValuesetBinding;
import gov.nist.hit.hl7.igamt.shared.domain.exception.ValuesetNotFoundException;
import nu.xom.Attribute;
import nu.xom.Element;

/**
 *
 * @author Maxence Lefort on Apr 2, 2018.
 */
public abstract class SerializableAbstractDomain extends SerializableElement {

  private AbstractDomain abstractDomain;
  
  public SerializableAbstractDomain(AbstractDomain abstractDomain, String position) {
    super(abstractDomain.getId().getId(), position, abstractDomain.getName());
    this.abstractDomain = abstractDomain;
  }
  
  public Element getElement(String elementName) {
    Element element = super.getElement(elementName);
    if (this.abstractDomain != null) {
      element.addAttribute(new Attribute("comment",
          this.abstractDomain.getComment() != null ? this.abstractDomain.getComment() : ""));
      element.addAttribute(new Attribute("createdFrom",
          this.abstractDomain.getCreatedFrom() != null ? this.abstractDomain.getCreatedFrom() : ""));
      element.addAttribute(new Attribute("description",
          this.abstractDomain.getDescription() != null ? this.abstractDomain.getDescription() : ""));
      element.addAttribute(
          new Attribute("name", this.abstractDomain.getName() != null ? this.abstractDomain.getName() : ""));
      element.addAttribute(new Attribute("domainVersion",
          this.abstractDomain.getDomainInfo() != null
              && this.abstractDomain.getDomainInfo().getVersion() != null
                  ? this.abstractDomain.getDomainInfo().getVersion()
                  : ""));
      String domainCompatibilityVersions = "";
      if (this.abstractDomain.getDomainInfo() != null
          && this.abstractDomain.getDomainInfo().getCompatibilityVersion() != null) {
        domainCompatibilityVersions = String.join(",", this.abstractDomain.getDomainInfo().getCompatibilityVersion());
      }
      element
          .addAttribute(new Attribute("domainCompatibilityVersions", domainCompatibilityVersions));
      element.addAttribute(new Attribute("domainScope",
          this.abstractDomain.getDomainInfo() != null && this.abstractDomain.getDomainInfo().getScope() != null ? this.abstractDomain.getDomainInfo().getScope().name()
              : ""));
      element.addAttribute(new Attribute("id",
          this.abstractDomain.getId() != null && this.abstractDomain.getId().getId() != null ? this.abstractDomain.getId().getId() : ""));
      element.addAttribute(new Attribute("publicationVersion",
          this.abstractDomain.getPublicationInfo() != null && this.abstractDomain.getPublicationInfo().getPublicationVersion() != null
              ? this.abstractDomain.getPublicationInfo().getPublicationVersion()
              : ""));
      String publicationDate = "";
      if (this.abstractDomain.getPublicationInfo() != null
          && this.abstractDomain.getPublicationInfo().getPublicationDate() != null) {
        publicationDate = DateSerializationUtil
            .serializeDate(this.abstractDomain.getPublicationInfo().getPublicationDate());
      }
      element.addAttribute(new Attribute("publicationDate", publicationDate));
      element.addAttribute(new Attribute("username", this.abstractDomain.getUsername() != null ? this.abstractDomain.getUsername() : ""));
    }
    return element;
  }

  /**
   * @param binding
   * @return
   * @throws ValuesetNotFoundException 
   */
  public Element serializeResourceBinding(ResourceBinding binding, Map<String, String> valuesetNamesMap) throws ValuesetNotFoundException {
    Element bindingElement = new Element("Binding");
    // TODO implement unit test
    bindingElement.addAttribute(new Attribute("elementId",binding.getElementId() != null ? binding.getElementId() : ""));
    if(binding.getChildren().size() > 0) {
      Element structureElementBindingsElement = this.serializeStructureElementBindings(binding.getChildren(),valuesetNamesMap);
      if(structureElementBindingsElement != null) {
        bindingElement.appendChild(structureElementBindingsElement);
      }
    }
    //TODO add conformancestatements & crossrefs
    return bindingElement;
  }

  /**
   * @param children
   * @return
   * @throws ValuesetNotFoundException 
   */
  private Element serializeStructureElementBindings(Set<StructureElementBinding> structureElementBindings, Map<String, String> valuesetNamesMap) throws ValuesetNotFoundException {
    Element structureElementBindingsElement = new Element("StructureElementBindings");
    for(StructureElementBinding structureElementBinding : structureElementBindings) {
      if(structureElementBinding != null) {
        Element structureElementBindingElement = this.serializeStructureElementBinding(structureElementBinding, valuesetNamesMap);
        if(structureElementBindingElement != null) {
          structureElementBindingsElement.appendChild(structureElementBindingElement);
        }
      }
    }
    return structureElementBindingsElement;
  }

  /**
   * @param structureElementBinding
   * @return
   * @throws ValuesetNotFoundException 
   */
  private Element serializeStructureElementBinding(
      StructureElementBinding structureElementBinding, Map<String, String> valuesetNamesMap) throws ValuesetNotFoundException {
    Element structureElementBindingElement = new Element("StructureElementBinding");
    if(structureElementBinding != null && structureElementBinding.getChildren() != null && structureElementBinding.getChildren().size()>0) {
      Element structureElementBindingsElement = this.serializeStructureElementBindings(structureElementBinding.getChildren(), valuesetNamesMap);
      if(structureElementBindingsElement != null) {
        structureElementBindingElement.appendChild(structureElementBindingsElement);
      }
    }
    for(ValuesetBinding valuesetBinding : structureElementBinding.getValuesetBindings()) {
        Element valuesetBindingElement = this.serializeValuesetBinding(valuesetBinding,valuesetNamesMap);
        if(valuesetBindingElement != null) {
          structureElementBindingElement.appendChild(valuesetBindingElement);
        }
    }
    return structureElementBindingElement;
  }

  /**
   * @param valuesetBinding
   * @param valuesetNamesMap
   * @return
   * @throws ValuesetNotFoundException 
   */
  private Element serializeValuesetBinding(ValuesetBinding valuesetBinding,
      Map<String, String> valuesetNamesMap) throws ValuesetNotFoundException {
    if(valuesetBinding.getValuesetId() != null && !valuesetBinding.getValuesetId().isEmpty()) {
      if(valuesetNamesMap.containsKey(valuesetBinding.getValuesetId())){
        Element valuesetBindingElement = new Element("ValuesetBinding");
        valuesetBindingElement.addAttribute(new Attribute("id",valuesetBinding.getValuesetId()));
        valuesetBindingElement.addAttribute(new Attribute("name",valuesetNamesMap.get(valuesetBinding.getValuesetId())));
        valuesetBindingElement.addAttribute(new Attribute("strength",valuesetBinding.getStrength() != null ? valuesetBinding.getStrength().name() : ""));
        valuesetBindingElement.addAttribute(new Attribute("strength",valuesetBinding.getValuesetLocations() != null ? convertValuesetLocationsToString(valuesetBinding.getValuesetLocations()) : ""));
        return valuesetBindingElement;
      } else {
        throw new ValuesetNotFoundException(valuesetBinding.getValuesetId());
      }
      
    }
    return null;
  }

  /**
   * @param valuesetLocations
   * @return locations as string
   */
  private String convertValuesetLocationsToString(Set<Integer> valuesetLocations) {
    Set<String> valuesetLocationsString = new HashSet<>();
    for(Integer location : valuesetLocations) {
      valuesetLocationsString.add(String.valueOf(location));
    }
    return String.join(",", valuesetLocationsString);
  }

  public AbstractDomain getAbstractDomain() {
    return abstractDomain;
  }

  public void setAbstractDomain(AbstractDomain abstractDomain) {
    this.abstractDomain = abstractDomain;
  }
  
}
