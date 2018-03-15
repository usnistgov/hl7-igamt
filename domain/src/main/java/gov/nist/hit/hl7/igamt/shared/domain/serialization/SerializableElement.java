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

import nu.xom.Attribute;
import nu.xom.Element;

/**
 *
 * @author Maxence Lefort on Mar 13, 2018.
 */
public abstract class SerializableElement {

  protected String id, position, title;

  public abstract Element serialize();
  
  public SerializableElement(String id, String position, String title) {
    super();
    this.id = id;
    this.position = position;
    this.title = title;
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getPosition() {
    return position;
  }

  public void setPosition(String position) {
    this.position = position;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public Element getElement(String elementName) {
    Element element = new Element(elementName);
    element.addAttribute(new Attribute("id",this.id));
    element.addAttribute(new Attribute("position",this.position));
    element.addAttribute(new Attribute("title",this.title));
    return element;
  }

}
