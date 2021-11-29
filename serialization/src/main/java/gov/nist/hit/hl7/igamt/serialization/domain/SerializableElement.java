///**
// * 
// * This software was developed at the National Institute of Standards and Technology by employees of
// * the Federal Government in the course of their official duties. Pursuant to title 17 Section 105
// * of the United States Code this software is not subject to copyright protection and is in the
// * public domain. This is an experimental system. NIST assumes no responsibility whatsoever for its
// * use by other parties, and makes no guarantees, expressed or implied, about its quality,
// * reliability, or any other characteristic. We would appreciate acknowledgement if the software is
// * used. This software can be redistributed and/or modified freely provided that any derivative
// * works bear some notice that they are derived from it, and any modified versions bear some notice
// * that they have been modified.
// * 
// */
//package gov.nist.hit.hl7.igamt.serialization.domain;
//
//import gov.nist.hit.hl7.igamt.common.base.domain.Type;
//import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
//import gov.nist.hit.hl7.igamt.serialization.util.FroalaSerializationUtil;
//import nu.xom.Attribute;
//import nu.xom.Element;
//
///**
// *
// * @author Maxence Lefort on Mar 13, 2018.
// */
//public abstract class SerializableElement {
//
//  protected String id, position, title;
//
//  public abstract Element serialize() throws SerializationException;
//
//  public SerializableElement(String id, String position, String title) {
//    super();
//    this.id = id;
//    this.position = position;
//    this.title = title;
//  }
//
////  public String formatStringData(String str) {
////	  return FroalaSerializationUtil.cleanFroalaInput(str);
////  }
//  
//  public String getId() {
//    return id;
//  }
//
//  public void setId(String id) {
//    this.id = id;
//  }
//
//  public String getPosition() {
//    return position;
//  }
//
//  public void setPosition(String position) {
//    this.position = position;
//  }
//
//  public String getTitle() {
//    return title;
//  }
//
//  public void setTitle(String title) {
//    this.title = title;
//  }
//
//  private Element getElement(String elementName) {
//    Element element = new Element(elementName);
//    element.addAttribute(new Attribute("id", this.id));
//    element.addAttribute(new Attribute("position", this.position));
//    element.addAttribute(new Attribute("title", this.title != null ? this.title : ""));
//    return element;
//  }
//
//  public Element getElement(Type type) {
//    String elementName = "";
//    switch (type) {
//      case SECTION:
//        elementName = "Section";
//        break;
//      case VALUESET:
//        elementName = "Valueset";
//        break;
//      case DATATYPE:
//        elementName = "Datatype";
//        break;
//      case SEGMENT:
//        elementName = "Segment";
//        break;
//      case CONFORMANCEPROFILE:
//        elementName = "ConformanceProfile";
//        break;
//      case COMPOSITEPROFILE:
//        elementName = "CompositeProfile";
//        break;
//      case PROFILECOMPONENT:
//        elementName = "ProfileComponent";
//        break;
//      case IGDOCUMENT:
//        elementName = "Document";
//        break;
//      case DATATYPELIBRARY:
//          elementName = "Document";
//          break;
//      default:
//        elementName = "Section";
//        break;
//    }
//    return this.getElement(elementName);
//  }
//
//}
