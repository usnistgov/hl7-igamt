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

import gov.nist.hit.hl7.igamt.common.base.domain.Section;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import nu.xom.Attribute;
import nu.xom.Element;

/**
 *
 * @author Maxence Lefort on Mar 13, 2018.
 */
public abstract class SerializableSection extends SerializableElement {

  private Section section;
  private int level;

  public SerializableSection(Section section, int level) {
    super(section.getId() != null ? section.getId() : "", String.valueOf(section.getPosition()),
        section.getLabel() != null ? section.getLabel() : "");
    this.section = section;
    this.level = level;
  }

  public Section getSection() {
    return section;
  }

  public Element getElement() throws SerializationException {
    Element sectionElement = super.getElement(Type.SECTION);
    if(section.getDescription() != null && !section.getDescription().isEmpty()) {
      Element sectionContentElement = new Element("SectionContent");
      sectionContentElement.appendChild(section.getDescription());
      sectionElement.appendChild(sectionContentElement);
    }
    sectionElement.addAttribute(
        new Attribute("type", section.getType() != null ? section.getType().name() : ""));
    sectionElement.addAttribute(new Attribute("h", String.valueOf(this.level)));
    return sectionElement;
  }

  public int getLevel() {
    return level;
  }

  public int getChildLevel() {
    return level + 1;
  }

}
