/**
 * This software was developed at the National Institute of Standards and Technology by employees of
 * the Federal Government in the course of their official duties. Pursuant to title 17 Section 105
 * of the United States Code this software is not subject to copyright protection and is in the
 * public domain. This is an experimental system. NIST assumes no responsibility whatsoever for its
 * use by other parties, and makes no guarantees, expressed or implied, about its quality,
 * reliability, or any other characteristic. We would appreciate acknowledgement if the software is
 * used. This software can be redistributed and/or modified freely provided that any derivative
 * works bear some notice that they are derived from it, and any modified versions bear some notice
 * that they have been modified.
 */
package gov.nist.hit.hl7.igamt.legacy.service.impl.util;

import java.io.StringReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.xml.sax.InputSource;

import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Component;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Datatype;
import gov.nist.hit.hl7.igamt.shared.domain.constraint.assertion.Assertion;
import gov.nist.hit.hl7.igamt.shared.domain.constraint.assertion.Path;
import gov.nist.hit.hl7.igamt.shared.domain.constraint.assertion.SingleAssertion;
import gov.nist.hit.hl7.igamt.shared.domain.constraint.assertion.Subject;
import gov.nist.hit.hl7.igamt.shared.domain.constraint.assertion.complement.ComplementKey;
import gov.nist.hit.hl7.igamt.shared.domain.constraint.assertion.complement.PresenceComplement;

/**
 * @author jungyubw
 *
 */
public class ConstraintHandler {

  /**
   * @param args
   */
  public static void main(String[] args) {
    // TODO Auto-generated method stub

    String simplePresenceAssertion = "<Assertion><Presence Path=\"2[1]\"/></Assertion>";

    String simplePlainTextAssertion =
        "<Assertion>\n                        <PlainText IgnoreCase=\"false\" Path=\"7[1]\" Text=\"M\"/>\n                    </Assertion>";
    String complexAssertion =
        "<Assertion><AND><Presence Path=\"4[1]\"/><Presence Path=\"2[1]\"/></AND></Assertion>";
    String notAssertion =
        "<Assertion><NOT><PlainText Path=\"2[1]\" Text=\"XX\" IgnoreCase=\"false\"/></NOT></Assertion>";
    ConstraintHandler test = new ConstraintHandler();

    Datatype dt = new Datatype();
    dt.setId("DDDD");
    List<Component> components = new ArrayList<Component>();
    for (int i = 0; i < 10; i++) {
      Component c = new Component();
      c.setId("" + (i + 1));
    }
    dt.setComponents(components);

    test.constructAssertionObjForDatatype(simplePresenceAssertion, dt);
    test.constructAssertionObjForDatatype(simplePlainTextAssertion, dt);
    test.constructAssertionObjForDatatype(complexAssertion, dt);
    test.constructAssertionObjForDatatype(notAssertion, dt);

  }

  private Assertion constructAssertionObjForDatatype(String assertionStr, Datatype dt) {
    Document doc = this.convertStringToDocument(assertionStr);
    Node assertionNode = doc.getElementsByTagName("Assertion").item(0);
    System.out.println(this.isCompositeOrNotConstraint(assertionNode));

    if (this.isCompositeOrNotConstraint(assertionNode)) {

    } else {
      SingleAssertion singleAssertion = new SingleAssertion();;

      Node childNode = this.findFirstChild(assertionNode);

      if (childNode != null) {
        if (childNode.getNodeName().equals("Presence")) {
          System.out.println("Presence Single Assertion");
          this.constructSimplePresenceAssertion(singleAssertion, childNode, dt);
        } else if (childNode.getNodeName().equals("PlainText")) {
          System.out.println("PlainText Single Assertion");
          this.constructSimplePlainTextAssertion(singleAssertion, childNode);
        } else if (childNode.getNodeName().equals("StringList")) {
          System.out.println("StringList Single Assertion");
          this.constructSimpleStringListAssertion(singleAssertion, childNode);
        } else if (childNode.getNodeName().equals("ValueSet")) {
          System.out.println("ValueSet Single Assertion");
          this.constructSimpleValueSetAssertion(singleAssertion, childNode);
        } else if (childNode.getNodeName().equals("Format")) {
          System.out.println("Format Single Assertion");
          this.constructSimpleFormatAssertion(singleAssertion, childNode);
        } else if (childNode.getNodeName().equals("PathValue")) {
          System.out.println("PathValue Single Assertion");
          this.constructSimplePathValueAssertion(singleAssertion, childNode);
        } else if (childNode.getNodeName().equals("SimpleValue")) {
          System.out.println("SimpleValue Single Assertion");
          this.constructSimpleSimpleValueAssertion(singleAssertion, childNode);
        } else if (childNode.getNodeName().equals("SetID")) {
          System.out.println("SetID Single Assertion");
          this.constructSimpleSetIDAssertion(singleAssertion, childNode);
        }
      }

      return singleAssertion;
    }

    return null;
  }

  /**
   * @param singleAssertion
   * @param presenceNode
   */
  private void constructSimplePresenceAssertion(SingleAssertion singleAssertion, Node presenceNode, Datatype dt) {
    PresenceComplement presenceComplement = new PresenceComplement(ComplementKey.PRESENCE);
    String path = ((Element)presenceNode).getAttribute("Path");
    singleAssertion.setComplement(presenceComplement);
    singleAssertion.setSubject(this.constructSubject(path, dt));
    singleAssertion.setVerbKey("SHALL");

  }

  /**
   * @param path
   * @param dt
   * @return
   */
  private Subject constructSubject(String path, Datatype dt) {
    Subject subject = new Subject();
    Path pathObj = new Path();
    pathObj.setElementId(dt.getId());
    
    if(dt.getComponents() != null && dt.getComponents().size() > 0){
      for(Component c:dt.getComponents()){
        
      }
    }
    
    subject.setPath(pathObj);
    return subject;
  }

  /**
   * @param singleAssertion
   * @param childNode
   */
  private void constructSimpleSetIDAssertion(SingleAssertion singleAssertion, Node childNode) {
    // TODO Auto-generated method stub

  }

  /**
   * @param singleAssertion
   * @param childNode
   */
  private void constructSimpleSimpleValueAssertion(SingleAssertion singleAssertion,
      Node childNode) {
    // TODO Auto-generated method stub

  }

  /**
   * @param singleAssertion
   * @param childNode
   */
  private void constructSimplePathValueAssertion(SingleAssertion singleAssertion, Node childNode) {
    // TODO Auto-generated method stub

  }

  /**
   * @param singleAssertion
   * @param childNode
   */
  private void constructSimpleFormatAssertion(SingleAssertion singleAssertion, Node childNode) {
    // TODO Auto-generated method stub

  }

  /**
   * @param singleAssertion
   * @param childNode
   */
  private void constructSimpleValueSetAssertion(SingleAssertion singleAssertion, Node childNode) {
    // TODO Auto-generated method stub

  }

  /**
   * @param singleAssertion
   * @param childNode
   */
  private void constructSimpleStringListAssertion(SingleAssertion singleAssertion, Node childNode) {
    // TODO Auto-generated method stub

  }

  /**
   * @param singleAssertion
   * @param plainTextNode
   */
  private void constructSimplePlainTextAssertion(SingleAssertion singleAssertion,
      Node plainTextNode) {
    // TODO Auto-generated method stub

  }

  /**
   * @param assertionNode
   * @return
   */
  private Node findFirstChild(Node assertionNode) {
    for (int i = 0; i < assertionNode.getChildNodes().getLength(); i++) {
      if (assertionNode.getChildNodes().item(i).getNodeType() == Node.ELEMENT_NODE) {
        return assertionNode.getChildNodes().item(i);
      }
    }
    return null;
  }

  /**
   * @param assertionNode
   * @return
   */
  private boolean isCompositeOrNotConstraint(Node assertionNode) {
    for (int i = 0; i < assertionNode.getChildNodes().getLength(); i++) {
      if (Arrays.asList(new String[] {"AND", "OR", "XOR", "IFTHEN", "FORALL", "EXIST", "NOT"})
          .contains(assertionNode.getChildNodes().item(i).getNodeName()))
        return true;
    }
    return false;
  }


  private Document convertStringToDocument(String xmlStr) {
    DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
    DocumentBuilder builder;
    try {
      builder = factory.newDocumentBuilder();
      Document doc = builder.parse(new InputSource(new StringReader(xmlStr)));
      return doc;
    } catch (Exception e) {
      e.printStackTrace();
    }
    return null;
  }

}
