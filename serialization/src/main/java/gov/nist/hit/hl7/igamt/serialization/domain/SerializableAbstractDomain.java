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
import gov.nist.hit.hl7.igamt.constraints.repository.ConformanceStatementRepository;
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
  private SerializableBinding serializableBinding = null;
  
  public SerializableAbstractDomain(AbstractDomain abstractDomain, String position) {
    this(abstractDomain, position, abstractDomain.getName());
  }

  public SerializableAbstractDomain(AbstractDomain abstractDomain, String position, String title) {
    super(abstractDomain.getId(), position, title);
    this.abstractDomain = abstractDomain;
  }

  @Override
  public Element getElement(Type type) {
    Element element = super.getElement(type);
    if (this.abstractDomain != null) {
      if (this.abstractDomain.getComment() != null && !this.abstractDomain.getComment().isEmpty()) {
        Element commentElement = new Element("Comment");
        commentElement.appendChild(
            this.formatStringData(this.abstractDomain.getComment()));
        element.appendChild(commentElement);
      }
      element.addAttribute(new Attribute("createdFrom",
          this.abstractDomain.getCreatedFrom() != null ? this.abstractDomain.getCreatedFrom()
              : ""));
      element.addAttribute(new Attribute("publicationDate",
    		  this.abstractDomain.getPublicationInfo() != null ? (this.abstractDomain.getPublicationInfo().getPublicationDate() != null
                  ? this.formatStringData(this.abstractDomain.getPublicationInfo().getPublicationDate().toString())
                  : "") : ""));
      element.addAttribute(new Attribute("description",
          this.abstractDomain.getDescription() != null
              ? this.formatStringData(this.abstractDomain.getDescription())
              : ""));
      element.addAttribute(new Attribute("version",
    		  this.abstractDomain.getDomainInfo() != null ? (this.abstractDomain.getDomainInfo().getVersion() != null
                  ? this.formatStringData(this.abstractDomain.getDomainInfo().getCompatibilityVersion().toString())
                  : "") : ""));
      element.addAttribute(new Attribute("domainCompatibilityVersion",
    		  this.abstractDomain.getDomainInfo() != null ? (this.abstractDomain.getDomainInfo().getCompatibilityVersion() != null
                  ? this.formatStringData(this.abstractDomain.getDomainInfo().getCompatibilityVersion().toString())
                  : "") : ""));
      element.addAttribute(new Attribute("name",
          this.abstractDomain.getName() != null ? this.abstractDomain.getName() : ""));
      element.addAttribute(new Attribute("id",
          this.abstractDomain.getId() != null && this.abstractDomain.getId() != null
              ? this.abstractDomain.getId()
              : ""));

      element.addAttribute(new Attribute("username",
          this.abstractDomain.getUsername() != null ? this.abstractDomain.getUsername() : ""));
    }
    return element;
  }

  /**
   * @param binding
 * @param conformanceStatementRepository 
   * @return
   * @throws SerializationException
   */
  public Element serializeResourceBinding(ResourceBinding binding,
      Map<String, String> valuesetNamesMap, ConformanceStatementRepository conformanceStatementRepository) throws SerializationException {
    Map<String, String> pathLocationMap = this.getIdPathMap();
    if(binding != null) {
	    this.serializableBinding = new SerializableBinding(binding, pathLocationMap, valuesetNamesMap, conformanceStatementRepository);
	    return this.serializableBinding.serialize();
    }
    return null;
  }
  
  public abstract Map<String, String> getIdPathMap();

  public AbstractDomain getAbstractDomain() {
    return abstractDomain;
  }

  public void setAbstractDomain(AbstractDomain abstractDomain) {
    this.abstractDomain = abstractDomain;
  }

  public SerializableConstraints getConformanceStatements(int level) {
    return new SerializableConstraints(this.abstractDomain.getId(), this.abstractDomain.getDescription(), Type.CONFORMANCESTATEMENT, 1, this.abstractDomain.getLabel(), level, this.serializableBinding != null ? this.serializableBinding.getConformanceStatements() : null);
  }

  public SerializableConstraints getPredicates(int level) {
    return new SerializableConstraints(this.abstractDomain.getId(), this.abstractDomain.getDescription(), Type.PREDICATE, 1, this.abstractDomain.getLabel(), level, this.serializableBinding != null ? this.serializableBinding.getPredicates() : null);
  }

}
