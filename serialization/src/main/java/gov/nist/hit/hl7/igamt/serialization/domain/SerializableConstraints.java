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
//import java.util.Set;
//
//import gov.nist.hit.hl7.igamt.common.base.domain.Section;
//import gov.nist.hit.hl7.igamt.common.base.domain.Type;
//import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
//import nu.xom.Element;
//
///**
// *
// * @author Maxence Lefort on Jul 11, 2018.
// */
//public class SerializableConstraints extends SerializableSection {
//
//  private Set<Element> constraints;
//
//  public SerializableConstraints(String id, String description, Type type, int position, String label, int level, Set<Element> constraints) {
//    super(new Section(id, description, type, position, label), level);
//    this.constraints = constraints;
//  }
//
//  @Override
//  public Element serialize() throws SerializationException {
//    Element constraintsElement = this.getElement();
//    if(constraints != null) {
//      for(Element element : constraints) {
//        if(element != null) {
//          constraintsElement.appendChild(element.copy());
//        }
//      }
//    }
//    return constraintsElement;
//  }
//  
//  public int getConstraintsCount() {
//    if(this.constraints != null) {
//      return this.constraints.size();
//    } else {
//      return 0;
//    }
//  }
//  
//}
