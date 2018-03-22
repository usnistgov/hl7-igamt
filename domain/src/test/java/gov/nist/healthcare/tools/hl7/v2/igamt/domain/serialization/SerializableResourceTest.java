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
package gov.nist.healthcare.tools.hl7.v2.igamt.domain.serialization;

import java.util.Arrays;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import org.junit.Test;
import static org.junit.Assert.*;

import gov.nist.hit.hl7.igamt.serialization.util.DateSerializationUtil;
import gov.nist.hit.hl7.igamt.shared.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.shared.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.shared.domain.PublicationInfo;
import gov.nist.hit.hl7.igamt.shared.domain.Resource;
import gov.nist.hit.hl7.igamt.shared.domain.Scope;
import gov.nist.hit.hl7.igamt.shared.domain.serialization.SerializableResource;
import nu.xom.Element;

/**
 *
 * @author Maxence Lefort on Mar 20, 2018.
 */
public class SerializableResourceTest {
  
  private static final String COMMENT_TEST = "comment_test";
  private static final String CREATED_FROM_TEST = "created_from_test";
  private static final String DESCRIPTION_TEST = "description_test";
  private static final String COMPATIBILITY_VERSION_1_TEST = "version_1";
  private static final String COMPATIBILITY_VERSION_2_TEST = "version_2";
  private static final Set<String> DOMAIN_COMPATIBILITY_VERSIONS_TEST = new HashSet<String>(Arrays.asList(COMPATIBILITY_VERSION_1_TEST,COMPATIBILITY_VERSION_2_TEST));
  private static final Scope DOMAIN_SCOPE_TEST = Scope.USER;
  private static final String DOMAIN_VERSION_TEST = "version_test";
  private static final String ID_TEST = "id_test";
  private static final int VERSION_TEST = 123;
  private static final CompositeKey COMPOSITE_KEY_TEST = new CompositeKey(ID_TEST, VERSION_TEST);
  private static final String NAME_TEST = "name_test";
  private static final String PREDEF_TEST = "predef_test";
  private static final String POSTDEF_TEST = "postdef_test";
  private static final Date PUBLICATION_DATE_TEST = new Date();
  private static final String PUBLICATION_VERSION_TEST = "publication_version_test";
  private static final String USERNAME_TEST = "username_test";
  private static final String POSITION_TEST = "456";
  private static final String RESOURCE_NAME_TEST = "resource_name_test";

  public static SerializableResource getSerializableResourceTest() {
    Resource resource = new Resource();
    resource.setComment(COMMENT_TEST);
    resource.setCreatedFrom(CREATED_FROM_TEST);
    resource.setDescription(DESCRIPTION_TEST);
    DomainInfo domainInfo = new DomainInfo();
    domainInfo.setCompatibilityVersion(DOMAIN_COMPATIBILITY_VERSIONS_TEST);
    domainInfo.setScope(DOMAIN_SCOPE_TEST);
    domainInfo.setVersion(DOMAIN_VERSION_TEST);
    resource.setDomainInfo(domainInfo);
    resource.setId(COMPOSITE_KEY_TEST);
    resource.setName(NAME_TEST);
    resource.setPostDef(POSTDEF_TEST);
    resource.setPreDef(PREDEF_TEST);
    PublicationInfo publicationInfo = new PublicationInfo();
    publicationInfo.setPublicationDate(PUBLICATION_DATE_TEST);
    publicationInfo.setPublicationVersion(PUBLICATION_VERSION_TEST);
    resource.setPublicationInfo(publicationInfo);
    resource.setUsername(USERNAME_TEST);
    
    SerializableResource serializableResource = new SerializableResource(resource,POSITION_TEST) {
      
      @Override
      public Element serialize() {
        return this.getElement(RESOURCE_NAME_TEST);
      }
    };
    return serializableResource;
  }
  
  @Test
  public void testSerialize() {
    SerializableResource serializableResource = getSerializableResourceTest();
    Element testElement = serializableResource.serialize();
    assertEquals(COMMENT_TEST, testElement.getAttribute("comment").getValue());
    assertEquals(CREATED_FROM_TEST, testElement.getAttribute("createdFrom").getValue());
    assertEquals(DESCRIPTION_TEST, testElement.getAttribute("description").getValue());
    assertEquals(String.join(",", DOMAIN_COMPATIBILITY_VERSIONS_TEST), testElement.getAttribute("domainCompatibilityVersions").getValue());
    assertEquals(DOMAIN_SCOPE_TEST.name(), testElement.getAttribute("domainScope").getValue());
    assertEquals(DOMAIN_VERSION_TEST, testElement.getAttribute("domainVersion").getValue());
    assertEquals(COMPOSITE_KEY_TEST.getId(), testElement.getAttribute("id").getValue());
    assertEquals(NAME_TEST, testElement.getAttribute("name").getValue());
    assertEquals(POSTDEF_TEST, testElement.getAttribute("postDef").getValue());
    assertEquals(PREDEF_TEST, testElement.getAttribute("preDef").getValue());
    assertEquals(DateSerializationUtil.serializeDate(PUBLICATION_DATE_TEST), testElement.getAttribute("publicationDate").getValue());
    assertEquals(PUBLICATION_VERSION_TEST, testElement.getAttribute("publicationVersion").getValue());
    assertEquals(USERNAME_TEST, testElement.getAttribute("username").getValue());
    assertEquals(RESOURCE_NAME_TEST, testElement.getLocalName());
    
  }
  
  public void testSerializeResourceBinding() {
    //TODO implement unit test when implementing binding serialization
  }
  
}
