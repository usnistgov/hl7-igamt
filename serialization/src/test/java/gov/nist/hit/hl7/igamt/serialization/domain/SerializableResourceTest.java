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
//import static org.junit.Assert.assertEquals;
//
//import java.util.Map;
//
//import org.junit.Test;
//
//import gov.nist.hit.hl7.igamt.common.base.domain.CompositeKey;
//import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
//import gov.nist.hit.hl7.igamt.common.base.domain.Type;
//import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
//import gov.nist.hit.hl7.igamt.serialization.util.FroalaSerializationUtil;
//import nu.xom.Element;
//
///**
// *
// * @author Maxence Lefort on Mar 20, 2018.
// */
//public class SerializableResourceTest {
//
//  private static final String ID_TEST = "id_test";
//  private static final int VERSION_TEST = 123;
//  private static final CompositeKey COMPOSITE_KEY_TEST = new CompositeKey(ID_TEST, VERSION_TEST);
//  private static final String NAME_TEST = "name_test";
//  private static final String PREDEF_TEST = "predef_test";
//  private static final String POSTDEF_TEST = "postdef_test";
//  private static final String POSITION_TEST = "456";
//
//  public static SerializableResource getSerializableResourceTest() {
//    Resource resource = new Resource() {
//      
//      @Override
//      public String getLabel() {
//        return this.getName();
//      }
//    };
//    resource.setId(COMPOSITE_KEY_TEST);
//    resource.setName(NAME_TEST);
//    resource.setPostDef(POSTDEF_TEST);
//    resource.setPreDef(PREDEF_TEST);
//    SerializableResource serializableResource = new SerializableResource(resource, POSITION_TEST) {
//
//      @Override
//      public Element serialize() {
//        return this.getElement(Type.SECTION);
//      }
//
//      @Override
//      public Map<String, String> getIdPathMap() {
//        return null;
//      }
//    };
//    return serializableResource;
//  }
//
//  @Test
//  public void testSerialize() throws SerializationException {
//    SerializableResource serializableResource = getSerializableResourceTest();
//    Element testElement = serializableResource.serialize();
//    assertEquals(FroalaSerializationUtil.cleanFroalaInput(POSTDEF_TEST), testElement.getAttribute("postDef").getValue());
//    assertEquals(FroalaSerializationUtil.cleanFroalaInput(PREDEF_TEST), testElement.getAttribute("preDef").getValue());
//  }
//
//}
