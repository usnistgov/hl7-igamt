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
//import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
//import gov.nist.hit.hl7.igamt.common.base.domain.Type;
//import gov.nist.hit.hl7.igamt.serialization.util.FroalaSerializationUtil;
//import nu.xom.Attribute;
//import nu.xom.Element;
//
///**
// *
// * @author Maxence Lefort on Mar 13, 2018.
// */
//public abstract class SerializableResource extends SerializableAbstractDomain {
//
//  public SerializableResource(Resource resource, String position) {
//    super(resource, position, resource.getLabel());
//  }
//
//  public Element getElement(Type type) {
//    Element element = super.getElement(type);
//    Resource resource = (Resource) super.getAbstractDomain();
//    if (resource != null && element != null) {
//      element.addAttribute(new Attribute("postDef",
//          resource.getPostDef() != null && !resource.getPostDef().isEmpty()
//              ? this.formatStringData(resource.getPostDef())
//              : ""));
//      element.addAttribute(new Attribute("preDef",
//          resource.getPreDef() != null && !resource.getPreDef().isEmpty()
//              ? this.formatStringData(resource.getPreDef())
//              : ""));
//      element.addAttribute(new Attribute("type", type.getValue()));
//    }
//    return element;
//  }
//  
//  
//
//
//  public Element getSectionElement(Element resourceElement, int level) {
//    Element element = super.getElement(Type.SECTION);
//    element.addAttribute(new Attribute("h", String.valueOf(level)));
//    Resource resource = (Resource) super.getAbstractDomain();
//    element.addAttribute(
//        new Attribute("title", resource.getLabel() != null ? resource.getLabel() : ""));
//    element.addAttribute(new Attribute("description",
//        resource.getDescription() != null ? resource.getDescription() : ""));
//    element.appendChild(resourceElement);
//    return element;
//  }
//
//}
