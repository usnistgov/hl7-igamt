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

import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import gov.nist.hit.hl7.igamt.shared.domain.Section;
import nu.xom.Attribute;
import nu.xom.Element;

/**
 *
 * @author Maxence Lefort on Mar 13, 2018.
 */
public abstract class SerializableSection extends SerializableElement{

  private Section section;

  public SerializableSection(Section section) {
    super(section.getId() != null ? section.getId() : "", String.valueOf(section.getPosition()), section.getLabel() != null ? section.getLabel() : "");
    this.section = section;
  }

  public Section getSection() {
    return section;
  }

  public Element getElement() throws SerializationException {
    Element sectionElement = super.getElement("Section");
    sectionElement.addAttribute(new Attribute("description",section.getDescription() != null ? section.getDescription() : ""));
    sectionElement.addAttribute(new Attribute("type",section.getType() != null ? section.getType().name() : ""));
    return sectionElement;
  }
  
}
