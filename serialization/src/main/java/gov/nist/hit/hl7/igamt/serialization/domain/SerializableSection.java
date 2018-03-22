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
import java.util.Set;

import nu.xom.Element;

/**
 *
 * @author Maxence Lefort on Mar 13, 2018.
 */
public class SerializableSection extends SerializableElement{

  private String description;
  protected Set<SerializableElement> children;

  public SerializableSection(String id, String position, String title, String description) {
    this(id, position, title);
    this.description = description;
  }

  public SerializableSection(String id, String position, String title, String description,
      Set<SerializableElement> children) {
    super(id, position, title);
    this.description = description;
    this.children = children;
  }

  public SerializableSection(String id, String position, String title) {
    super(id, position, title);
    this.children = new HashSet<>();
    this.description = new String();
  }

  public Set<SerializableElement> getChildren() {
    return children;
  }

  public void setChildren(Set<SerializableElement> children) {
    this.children = children;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public Element serialize() {
    Element sectionElement = super.getElement("Section");
    sectionElement.appendChild(description);
    for(SerializableElement child : children) {
      sectionElement.appendChild(child.serialize());
    }
    return sectionElement;
  }

}
