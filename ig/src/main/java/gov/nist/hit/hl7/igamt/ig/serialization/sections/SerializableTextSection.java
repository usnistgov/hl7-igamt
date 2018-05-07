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
package gov.nist.hit.hl7.igamt.ig.serialization.sections;

import gov.nist.hit.hl7.igamt.serialization.domain.SerializableSection;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import gov.nist.hit.hl7.igamt.shared.domain.Section;
import gov.nist.hit.hl7.igamt.shared.domain.TextSection;
import nu.xom.Element;

/**
 *
 * @author Maxence Lefort on Apr 5, 2018.
 */
public class SerializableTextSection extends SerializableSection {

  /**
   * @param section
   */
  public SerializableTextSection(TextSection textSection) {
    super(textSection);
  }

  /*
   * (non-Javadoc)
   * 
   * @see gov.nist.hit.hl7.igamt.serialization.domain.SerializableElement#serialize()
   */
  @Override
  public Element serialize() throws SerializationException {
    Element textSectionElement = super.getElement();
    if(((TextSection) super.getSection()).getChildren() != null) {
      for (Section child : ((TextSection) super.getSection()).getChildren()) {
        Element childElement = SectionSerializationUtil.serializeSection(child);
        if (child != null) {
          textSectionElement.appendChild(childElement);
        }
      }
    }
    return textSectionElement;
  }

}
