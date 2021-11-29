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
//import java.util.Arrays;
//import java.util.Date;
//import java.util.HashSet;
//import java.util.Map;
//import java.util.Set;
//
//import org.junit.Test;
//
//import gov.nist.hit.hl7.igamt.common.base.domain.AbstractDomain;
//import gov.nist.hit.hl7.igamt.common.base.domain.CompositeKey;
//import gov.nist.hit.hl7.igamt.common.base.domain.DomainInfo;
//import gov.nist.hit.hl7.igamt.common.base.domain.PublicationInfo;
//import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
//import gov.nist.hit.hl7.igamt.common.base.domain.Type;
//import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
//import gov.nist.hit.hl7.igamt.serialization.util.DateSerializationUtil;
//import gov.nist.hit.hl7.igamt.serialization.util.FroalaSerializationUtil;
//import nu.xom.Element;
//
///**
// *
// * @author Maxence Lefort on Apr 5, 2018.
// */
//public class SerializableAbstractDomainTest {
//
//  private static final String COMMENT_TEST = "comment_test";
//  private static final String CREATED_FROM_TEST = "created_from_test";
//  private static final String DESCRIPTION_TEST = "description_test";
//  private static final String COMPATIBILITY_VERSION_1_TEST = "version_1";
//  private static final String COMPATIBILITY_VERSION_2_TEST = "version_2";
//  private static final Set<String> DOMAIN_COMPATIBILITY_VERSIONS_TEST = new HashSet<String>(
//      Arrays.asList(COMPATIBILITY_VERSION_1_TEST, COMPATIBILITY_VERSION_2_TEST));
//  private static final Scope DOMAIN_SCOPE_TEST = Scope.USER;
//  private static final String DOMAIN_VERSION_TEST = "version_test";
//  private static final String ID_TEST = "id_test";
//  private static final int VERSION_TEST = 123;
//  private static final CompositeKey COMPOSITE_KEY_TEST = new CompositeKey(ID_TEST, VERSION_TEST);
//  private static final String NAME_TEST = "name_test";
//  private static final Date PUBLICATION_DATE_TEST = new Date();
//  private static final String PUBLICATION_VERSION_TEST = "publication_version_test";
//  private static final String USERNAME_TEST = "username_test";
//  private static final String POSITION_TEST = "456";
//
//  public static SerializableAbstractDomain getSerializableAbstractDomainTest() {
//    AbstractDomain abstractDomain = new AbstractDomain() {
//      
//      @Override
//      public String getLabel() {
//        return this.getName();
//      }
//    };
//    abstractDomain.setComment(COMMENT_TEST);
//    abstractDomain.setCreatedFrom(CREATED_FROM_TEST);
//    abstractDomain.setDescription(DESCRIPTION_TEST);
//    DomainInfo domainInfo = new DomainInfo();
//    domainInfo.setCompatibilityVersion(DOMAIN_COMPATIBILITY_VERSIONS_TEST);
//    domainInfo.setScope(DOMAIN_SCOPE_TEST);
//    domainInfo.setVersion(DOMAIN_VERSION_TEST);
//    abstractDomain.setDomainInfo(domainInfo);
//    abstractDomain.setId(COMPOSITE_KEY_TEST);
//    abstractDomain.setName(NAME_TEST);
//    PublicationInfo publicationInfo = new PublicationInfo();
//    publicationInfo.setPublicationDate(PUBLICATION_DATE_TEST);
//    publicationInfo.setPublicationVersion(PUBLICATION_VERSION_TEST);
//    abstractDomain.setPublicationInfo(publicationInfo);
//    abstractDomain.setUsername(USERNAME_TEST);
//
//    SerializableAbstractDomain serializableAbstractDomain =
//        new SerializableAbstractDomain(abstractDomain, POSITION_TEST) {
//
//          @Override
//          public Element serialize() throws SerializationException {
//            return this.getElement(Type.SECTION);
//          }
//
//          @Override
//          public Map<String, String> getIdPathMap() {
//            return null;
//          }
//
//        };
//
//    return serializableAbstractDomain;
//  }
//
//
//
//  @Test
//  public void testSerialize() throws SerializationException {
//    SerializableAbstractDomain serializableAbstractDomain = getSerializableAbstractDomainTest();
//    Element testElement = serializableAbstractDomain.serialize();
//    
//    assertEquals(FroalaSerializationUtil.cleanFroalaInput(COMMENT_TEST), testElement.getFirstChildElement("Comment").getValue());
//    assertEquals(CREATED_FROM_TEST, testElement.getAttribute("createdFrom").getValue());
//    assertEquals(FroalaSerializationUtil.cleanFroalaInput(DESCRIPTION_TEST), testElement.getAttribute("description").getValue());
//    Element testMetadataElement = testElement.getFirstChildElement("Metadata");
//    assertEquals(String.join(",", DOMAIN_COMPATIBILITY_VERSIONS_TEST),
//        testMetadataElement.getAttribute("domainCompatibilityVersions").getValue());
//    assertEquals(DOMAIN_SCOPE_TEST.name(), testMetadataElement.getAttribute("scope").getValue());
//    assertEquals(DOMAIN_VERSION_TEST, testMetadataElement.getAttribute("hl7Version").getValue());
//    assertEquals(COMPOSITE_KEY_TEST.getId(), testElement.getAttribute("id").getValue());
//    assertEquals(NAME_TEST, testElement.getAttribute("name").getValue());
//    assertEquals(DateSerializationUtil.serializeDate(PUBLICATION_DATE_TEST),
//        testMetadataElement.getAttribute("publicationDate").getValue());
//    assertEquals(PUBLICATION_VERSION_TEST,
//        testMetadataElement.getAttribute("publicationVersion").getValue());
//    assertEquals(USERNAME_TEST, testElement.getAttribute("username").getValue());
//    assertEquals("Section", testElement.getLocalName());
//
//  }
//
//  public void testSerializeResourceBinding() {
//    // TODO implement unit test when implementing binding serialization
//  }
//
//}
