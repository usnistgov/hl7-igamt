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
package gov.nist.hit.hl7.igamt.valueset.test.serialization;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

import org.junit.BeforeClass;
import org.junit.Test;

import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import gov.nist.hit.hl7.igamt.shared.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.valueset.domain.CodeRef;
import gov.nist.hit.hl7.igamt.valueset.domain.CodeUsage;
import gov.nist.hit.hl7.igamt.valueset.domain.InternalCode;
import gov.nist.hit.hl7.igamt.valueset.domain.InternalCodeSystem;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.domain.property.ContentDefinition;
import gov.nist.hit.hl7.igamt.valueset.domain.property.ManagedBy;
import gov.nist.hit.hl7.igamt.valueset.domain.property.Stability;
import gov.nist.hit.hl7.igamt.valueset.serialization.SerializableValueSet;
import nu.xom.Element;
import nu.xom.Elements;

/**
 *
 * @author Maxence Lefort on Mar 19, 2018.
 */
public class SerializableValuesetTest {

  private static final String TEST_BINDING_ID = "test_binding_id";
  private static final String TEST_ID = "test_id";
  private static final String TEST_OID = "test_oid";
  private static final String TEST_POSTION = "123";
  private static final String TEST_NAME = "test_name";
  
  private static final String TEST_INTENSIONAL_COMMENT = "test_intensional_comment";
  private static final String TEST_URL_STRING = "http://test.com";
  private static URL TEST_URL;
  private static final ManagedBy TEST_MANAGED_BY = ManagedBy.Internal;
  private static final Stability TEST_STABILITY = Stability.Undefined;
  private static final ContentDefinition TEST_CONTENT_DEFINITION = ContentDefinition.Undefined;
  private static final String TEST_CODE_1 = "test_code_1";
  private static final String TEST_CODE_2 = "test_code_2";
  private static final Set<String> TEST_CODE_SYSTEM_IDS = new HashSet<String>(Arrays.asList(TEST_CODE_1, TEST_CODE_2));
  private static final String TEST_CODE_SYSTEM_1 = "test_code_system_1";
  private static final int TEST_POSITION_CODEREF_1 = 1;
  private static final int TEST_POSITION_CODEREF_2 = 2;
  private static final CodeUsage TEST_CODEUSAGE_CODEREF = CodeUsage.E;
  private static final CodeRef TEST_CODEREF_1 = new CodeRef(TEST_CODE_1, TEST_CODE_SYSTEM_1, TEST_POSITION_CODEREF_1, TEST_CODEUSAGE_CODEREF);
  private static final CodeRef TEST_CODEREF_2 = new CodeRef(TEST_CODE_2, TEST_CODE_SYSTEM_1, TEST_POSITION_CODEREF_2, TEST_CODEUSAGE_CODEREF);
  private static final Set<CodeRef> TEST_CODEREFS = new HashSet<CodeRef>(Arrays.asList(TEST_CODEREF_1,TEST_CODEREF_2));
  private static final String TEST_IDENTIFIER_INTERNAL_CODE_SYSTEM_1 = "test_indentifier_code_system_1";
  private static final String TEST_IDENTIFIER_INTERNAL_CODE_SYSTEM_2 = "test_indentifier_code_system_2";
  private static final String TEST_DESCRIPTION_INTERNAL_CODE_SYSTEM_1 = "test_description_code_system_1";
  private static final String TEST_DESCRIPTION_INTERNAL_CODE_SYSTEM_2 = "test_description_code_system_2";
  private static final InternalCodeSystem TEST_INTERNAL_CODE_SYSTEM_1 = new InternalCodeSystem(TEST_IDENTIFIER_INTERNAL_CODE_SYSTEM_1,TEST_DESCRIPTION_INTERNAL_CODE_SYSTEM_1,TEST_URL);
  private static final InternalCodeSystem TEST_INTERNAL_CODE_SYSTEM_2 = new InternalCodeSystem(TEST_IDENTIFIER_INTERNAL_CODE_SYSTEM_2,TEST_DESCRIPTION_INTERNAL_CODE_SYSTEM_2,TEST_URL);
  private static final Set<InternalCodeSystem> TEST_INTERNAL_CODE_SYSTEMS = new HashSet<InternalCodeSystem>(Arrays.asList(TEST_INTERNAL_CODE_SYSTEM_1,TEST_INTERNAL_CODE_SYSTEM_2));
  private static final CodeUsage TEST_CODEUSAGE_INTERNAL_CODE_1 = CodeUsage.P;
  private static final CodeUsage TEST_CODEUSAGE_INTERNAL_CODE_2 = CodeUsage.R;
  private static final String TEST_ID_INTERNAL_CODE_1 = "test_id1";
  private static final String TEST_ID_INTERNAL_CODE_2 = "test_id2";
  private static final String TEST_VALUE_INTERNAL_CODE_1 = "test_value1";
  private static final String TEST_VALUE_INTERNAL_CODE_2 = "test_value2";
  private static final String TEST_DESCRIPTION_INTERNAL_CODE_1 = "test_description1";
  private static final String TEST_DESCRIPTION_INTERNAL_CODE_2 = "test_description2";
  private static final InternalCode TEST_INTERNAL_CODE_1 = new InternalCode(TEST_ID_INTERNAL_CODE_1,TEST_VALUE_INTERNAL_CODE_1,TEST_DESCRIPTION_INTERNAL_CODE_1,TEST_CODE_SYSTEM_1,TEST_CODEUSAGE_INTERNAL_CODE_1);
  private static final InternalCode TEST_INTERNAL_CODE_2 = new InternalCode(TEST_ID_INTERNAL_CODE_2,TEST_VALUE_INTERNAL_CODE_2,TEST_DESCRIPTION_INTERNAL_CODE_2,TEST_CODE_SYSTEM_1,TEST_CODEUSAGE_INTERNAL_CODE_2);
  private static final Set<InternalCode> TEST_INTERNAL_CODES = new HashSet<InternalCode>(Arrays.asList(TEST_INTERNAL_CODE_1,TEST_INTERNAL_CODE_2));

  @BeforeClass
  public static void initUrls() throws MalformedURLException {
    TEST_URL = new URL(TEST_URL_STRING);
    TEST_INTERNAL_CODE_SYSTEM_1.setUrl(TEST_URL);
    TEST_INTERNAL_CODE_SYSTEM_2.setUrl(TEST_URL);
  }
  

  @Test
  public void testSerializeValueset() throws SerializationException {
    Valueset valueset = new Valueset();
    valueset.setName(TEST_NAME);
    valueset.setId(new CompositeKey(TEST_ID));
    //Valueset specific
    valueset.setBindingIdentifier(TEST_BINDING_ID);
    valueset.setOid(TEST_OID);
    valueset.setIntensionalComment(TEST_INTENSIONAL_COMMENT);
    valueset.setUrl(TEST_URL);
    valueset.setManagedBy(TEST_MANAGED_BY);
    valueset.setStability(TEST_STABILITY);
    valueset.setContentDefinition(TEST_CONTENT_DEFINITION);
    valueset.setCodeSystemIds(TEST_CODE_SYSTEM_IDS);
    valueset.setCodeRefs(TEST_CODEREFS);
    valueset.setInternalCodeSystems(TEST_INTERNAL_CODE_SYSTEMS);
    valueset.setCodes(TEST_INTERNAL_CODES);
    SerializableValueSet serializableValueSet = new SerializableValueSet(valueset, TEST_POSTION);
    Element testElement = serializableValueSet.serialize();
    assertEquals(TEST_BINDING_ID, testElement.getAttribute("bindingIdentifier").getValue());
    assertEquals(TEST_OID, testElement.getAttribute("oid").getValue());
    assertEquals(TEST_INTENSIONAL_COMMENT, testElement.getAttribute("intensionalComment").getValue());
    assertEquals(TEST_URL_STRING, testElement.getAttribute("url").getValue());
    assertEquals(TEST_MANAGED_BY.value, testElement.getAttribute("managedBy").getValue());
    assertEquals(TEST_STABILITY.value, testElement.getAttribute("stability").getValue());
    assertEquals(TEST_CONTENT_DEFINITION.value, testElement.getAttribute("contentDefinition").getValue());
    assertEquals(String.valueOf(TEST_CODEREFS.size() + TEST_INTERNAL_CODES.size()), testElement.getAttribute("numberOfCodes").getValue());
    assertEquals(String.join(",", TEST_CODE_SYSTEM_IDS), testElement.getAttribute("codeSystemIds").getValue());
    
    Element codeRefsWrap = testElement.getFirstChildElement("CodeRefs");
    Elements codeRefs = codeRefsWrap.getChildElements();
    assertEquals(2,codeRefs.size());
    for(int i = 0; i < codeRefs.size(); i++) {
      Element testCodeRef = codeRefs.get(i);
      assertEquals(TEST_CODE_SYSTEM_1, testCodeRef.getAttribute("codeSystemId").getValue());
      assertEquals(TEST_CODEUSAGE_CODEREF.name(), testCodeRef.getAttribute("usage").getValue());
      if(testCodeRef.getAttribute("codeId").getValue() == TEST_CODE_1) {
        assertEquals(String.valueOf(TEST_POSITION_CODEREF_1), testCodeRef.getAttribute("position").getValue());
      } else if (testCodeRef.getAttribute("codeId").getValue() == TEST_CODE_2) {
        assertEquals(String.valueOf(TEST_POSITION_CODEREF_2), testCodeRef.getAttribute("position").getValue());
      } else {
        fail();
      }
    }
    
    Element internalCodeSystemsWrap = testElement.getFirstChildElement("InternalCodeSystems");
    Elements internalCodeSystems = internalCodeSystemsWrap.getChildElements();
    assertEquals(2,internalCodeSystems.size());
    for(int i = 0; i < internalCodeSystems.size(); i++) {
      Element internalCodeSystem = internalCodeSystems.get(i);
      if(internalCodeSystem.getAttribute("identifier").getValue() == TEST_IDENTIFIER_INTERNAL_CODE_SYSTEM_1) {
        assertEquals(TEST_DESCRIPTION_INTERNAL_CODE_SYSTEM_1, internalCodeSystem.getAttribute("description").getValue());
      } else if (internalCodeSystem.getAttribute("identifier").getValue() == TEST_IDENTIFIER_INTERNAL_CODE_SYSTEM_2) {
        assertEquals(TEST_DESCRIPTION_INTERNAL_CODE_SYSTEM_2, internalCodeSystem.getAttribute("description").getValue());
      } else {
        fail();
      }
      assertEquals(TEST_URL_STRING, internalCodeSystem.getAttribute("url").getValue());
    }
    
    Element internalCodesWrap = testElement.getFirstChildElement("InternalCodes");
    Elements internalCodes = internalCodesWrap.getChildElements();
    assertEquals(2,internalCodes.size());
    for(int i = 0; i < internalCodes.size(); i++) {
      Element internalCode = internalCodes.get(i);
      assertEquals(TEST_CODE_SYSTEM_1, internalCode.getAttribute("codeSystemId").getValue());
      if(internalCode.getAttribute("id").getValue() == TEST_ID_INTERNAL_CODE_1) {
        assertEquals(TEST_VALUE_INTERNAL_CODE_1, internalCode.getAttribute("value").getValue());
        assertEquals(TEST_DESCRIPTION_INTERNAL_CODE_1, internalCode.getAttribute("description").getValue());
        assertEquals(TEST_CODEUSAGE_INTERNAL_CODE_1.name(), internalCode.getAttribute("usage").getValue());
      } else if (internalCode.getAttribute("id").getValue() == TEST_ID_INTERNAL_CODE_2) {
        assertEquals(TEST_VALUE_INTERNAL_CODE_2, internalCode.getAttribute("value").getValue());
        assertEquals(TEST_DESCRIPTION_INTERNAL_CODE_2, internalCode.getAttribute("description").getValue());
        assertEquals(TEST_CODEUSAGE_INTERNAL_CODE_2.name(), internalCode.getAttribute("usage").getValue());
      } else {
        fail();
      }
    }
    
    System.out.println(testElement.toXML());

  }

}
