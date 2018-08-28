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
package gov.nist.hit.hl7.igamt.legacy.service.util;

import java.io.StringReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.xml.sax.InputSource;

import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Component;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Datatype;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Field;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Group;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Message;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Segment;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.SegmentRef;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.SegmentRefOrGroup;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetStrength;
import gov.nist.hit.hl7.igamt.common.constraint.domain.assertion.Assertion;
import gov.nist.hit.hl7.igamt.common.constraint.domain.assertion.IfThenAssertion;
import gov.nist.hit.hl7.igamt.common.constraint.domain.assertion.InstancePath;
import gov.nist.hit.hl7.igamt.common.constraint.domain.assertion.NotAssertion;
import gov.nist.hit.hl7.igamt.common.constraint.domain.assertion.OperatorAssertion;
import gov.nist.hit.hl7.igamt.common.constraint.domain.assertion.OperatorAssertion.Operator;
import gov.nist.hit.hl7.igamt.common.constraint.domain.assertion.Path;
import gov.nist.hit.hl7.igamt.common.constraint.domain.assertion.SingleAssertion;
import gov.nist.hit.hl7.igamt.common.constraint.domain.assertion.Subject;
import gov.nist.hit.hl7.igamt.common.constraint.domain.assertion.complement.CompareNodeComplement;
import gov.nist.hit.hl7.igamt.common.constraint.domain.assertion.complement.CompareOperator;
import gov.nist.hit.hl7.igamt.common.constraint.domain.assertion.complement.CompareValueComplement;
import gov.nist.hit.hl7.igamt.common.constraint.domain.assertion.complement.FormattedComplement;
import gov.nist.hit.hl7.igamt.common.constraint.domain.assertion.complement.FormattedComplement.FormatType;
import gov.nist.hit.hl7.igamt.common.constraint.domain.assertion.complement.GenericComplement;
import gov.nist.hit.hl7.igamt.common.constraint.domain.assertion.complement.ListValuesComplement;
import gov.nist.hit.hl7.igamt.common.constraint.domain.assertion.complement.Parameter;
import gov.nist.hit.hl7.igamt.common.constraint.domain.assertion.complement.PresenceComplement;
import gov.nist.hit.hl7.igamt.common.constraint.domain.assertion.complement.SameValueComplement;
import gov.nist.hit.hl7.igamt.common.constraint.domain.assertion.complement.ValuesetComplement;
import gov.nist.hit.hl7.igamt.legacy.repository.DatatypeRepository;
import gov.nist.hit.hl7.igamt.legacy.repository.SegmentRepository;


/**
 * @author jungyubw
 *
 */
public class ConstraintHandler {

  @Autowired
  private DatatypeRepository datatypeRepository;

  @Autowired
  private SegmentRepository segmentRepository;

  public ConstraintHandler(SegmentRepository segmentRepository,
      DatatypeRepository datatypeRepository) {
    this.segmentRepository = segmentRepository;
    this.datatypeRepository = datatypeRepository;
  }

  /**
   * @param assertion
   * @param description
   * @param oldMessage
   * @param string
   * @return
   */
  public Assertion constructAssertionObj(String assertionStr, String description, Object o,
      String rootName) {
    if (!assertionStr.startsWith("<" + rootName + ">")) {
      assertionStr = "<" + rootName + ">" + assertionStr + "</" + rootName + ">";
    }

    // Segment Issues
    description = description.replace("'^~\\&#'", "'^~\\&amp;#'");
    assertionStr = assertionStr.replace("Text=\"~\\&#\"", "Text=\"~\\&amp;#\"");
    if (assertionStr.equals("<Condition>PID-29 SHALL be valued</Condition>"))
      return null;
    if (assertionStr.equals("<Condition>PID-30 SHALL be valued 'Y'</Condition>"))
      return null;
    if (assertionStr.equals(
        "<Assertion><IMPLY><PlainText Path=\"3[1]\" Text=\"\"\"\" IgnoreCase=\"false\"/><AND><Presence Path=\"21[1]\"/><NOT><PlainText Path=\"21[1]\" Text=\"\"\"\" IgnoreCase=\"false\"/></NOT></AND></IMPLY></Assertion>"))
      return null;
    if (assertionStr.equals(
        "<Assertion><IMPLY><PlainText Path=\"21[1]\" Text=\"\"\"\" IgnoreCase=\"false\"/><AND><Presence Path=\"3[1]\"/><NOT><PlainText Path=\"3[1]\" Text=\"\"\"\" IgnoreCase=\"false\"/></NOT></AND></IMPLY></Assertion>"))
      return null;
    if (assertionStr.equals(
        "<Assertion><Format Path=\"MSH-7\" Regex=\"([0-9]{4})((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))(([0-1][0-9])|(2[0-3]))([0-5][0-9])([0-5][0-9])\\.[0-9][0-9][0-9][0-9]((\\+|\\-)[0-9]{4})\"/></Assertion>"))
      return null;
    if (assertionStr
        .equals("<Assertion><SimpleValue Path=\"PID-1\" Operator=\"EQ\" Value=\"1\"/></Assertion>"))
      return null;
    if (assertionStr.equals(
        "<Assertion><SimpleValue Path=\"PID-30\" Operator=\"EQ\" Value=\"Y\"/></Assertion>"))
      return null;

    // Datatype issues
    if (assertionStr.equals(
        "<Condition><PlainText Path=\"1[1]\" Text=\"\"\"\" IgnoreCase=\"false\"/></Condition>"))
      return null;
    if (assertionStr
        .equals("<Condition><NOT><Format Path=\"1[1]\" Regex=\"\\\"\\\"\"/></NOT></Condition>"))
      return null;
    if (assertionStr.equals(
        "<Condition><NOT><PlainText Path=\"1[1]\" Text=\"\"\"\" IgnoreCase=\"false\"/></NOT></Condition>"))
      return null;
    if (assertionStr.equals(
        "<Assertion><AND><Presence Path=\"1[1]\"/><StringList Path=\"1[1]\" CSV=\">, <, >=, <=, =, <>\"/></AND></Assertion>"))
      return null;
    if (assertionStr.equals(
        "<Condition><NOT><AND><Presence Path=\"2[1]\"/><PlainText Path=\"2[1]\" Text=\"\"\"\" IgnoreCase=\"false\"/></AND></NOT></Condition>"))
      return null;
    assertionStr = assertionStr.replace(
        "264384&MDC_DIM_HR&MDC,264352&MDC_DIM_MIN&MDC,264320&MDC_DIM_X_SEC&MDC",
        "264384&amp;MDC_DIM_HR&amp;MDC,264352&amp;MDC_DIM_MIN&amp;MDC,264320&amp;MDC_DIM_X_SEC&amp;MDC");

    // ConformanceProfile(Message) issues
    assertionStr = assertionStr.replace(
        "<Condition><NOT><SimpleValue Path=\"2[1].1[1]\" Operator=\"EQ\" Value=\"\"AA\"\"/></NOT></Condition>",
        "<Condition><NOT><SimpleValue Path=\"2[1].1[1]\" Operator=\"EQ\" Value=\"AA\"/></NOT></Condition>");
    assertionStr = assertionStr.replace(
        "<Assertion><AssertionainText Path=\"1[1].1[1]\" Text=\"1\" IgnoreCase=\"false\"/><Presence Path=\"1[1].8[1]\"/></IMPLY></Assertion></Assertion>",
        "<Assertion><IMPLY><PlainText Path=\"1[1].1[1]\" Text=\"1\" IgnoreCase=\"false\"/><Presence Path=\"1[1].8[1]\"/></IMPLY></Assertion>");
    if (assertionStr.equals(
        "<Condition><AND><Presence Path=\".[1].3[1].7[1]\"/><SimpleValue Path=\".[1].3[1].7[1]\" Operator=\"GE\" Value=\"undefined\"/></AND></Condition>"))
      return null;


    //System.out.println(assertionStr);
    Document doc = this.convertStringToDocument(assertionStr);
    Node assertionNode =  (doc != null && doc.getElementsByTagName(rootName) != null) ? doc.getElementsByTagName(rootName).item(0) : null;
    if(assertionNode != null) {
      Assertion result = constructAssertionObj(this.findFirstChild(assertionNode), o);
      result.setDescription(description);
      return result;
    }
    return null;
  }

  /**
   * @param assertionNode
   * @param dt
   * @return
   */
  private Assertion constructAssertionObj(Node assertionNode, Object obj) {
    if (this.isCompositeOrNotConstraint(assertionNode)) {
      if (assertionNode != null) {
        if (assertionNode.getNodeName().equals("NOT")) {
          NotAssertion notAssertion = new NotAssertion();
          notAssertion
              .setChild(this.constructAssertionObj(this.findFirstChild(assertionNode), obj));
          return notAssertion;
        } else if (assertionNode.getNodeName().equals("AND")
            || assertionNode.getNodeName().equals("OR")) {
          OperatorAssertion operatorAssertion = new OperatorAssertion();
          operatorAssertion.setOperator(Operator.valueOf(assertionNode.getNodeName()));
          operatorAssertion
              .addAssertion(this.constructAssertionObj(this.findChildByNum(assertionNode, 1), obj));
          operatorAssertion
              .addAssertion(this.constructAssertionObj(this.findChildByNum(assertionNode, 2), obj));
          return operatorAssertion;
        } else if (assertionNode.getNodeName().equals("IMPLY")) {
          IfThenAssertion ifThenAssertion = new IfThenAssertion();
          ifThenAssertion.setIfAssertion(
              this.constructAssertionObj(this.findChildByNum(assertionNode, 1), obj));
          ifThenAssertion.setThenAssertion(
              this.constructAssertionObj(this.findChildByNum(assertionNode, 2), obj));
          return ifThenAssertion;
        } else if (assertionNode.getNodeName().equals("FORALL")) {
          OperatorAssertion operatorAssertion = new OperatorAssertion();
          operatorAssertion.setOperator(Operator.AND);
          List<Node> childNodes = this.findAllChild(assertionNode);
          for (Node child : childNodes) {
            operatorAssertion.addAssertion(this.constructAssertionObj(child, obj));
          }
          return operatorAssertion;
        } else if (assertionNode.getNodeName().equals("EXIST")) {
          OperatorAssertion operatorAssertion = new OperatorAssertion();
          operatorAssertion.setOperator(Operator.OR);
          List<Node> childNodes = this.findAllChild(assertionNode);
          for (Node child : childNodes) {
            operatorAssertion.addAssertion(this.constructAssertionObj(child, obj));
          }
          return operatorAssertion;
        }
      }
    } else {
      SingleAssertion singleAssertion = this.constructSingleAssertionObj(obj, assertionNode);
      return singleAssertion;
    }

    return null;

  }

  /**
   * @param m
   * @param assertionNode
   * @return
   */
  private SingleAssertion constructSingleAssertionObj(Object obj, Node childNode) {
    SingleAssertion singleAssertion = new SingleAssertion();
    // <Plugin QualifiedClassName=\"gov.nist.healthcare.hl7.v2.iz.plugins.IZ24Constraint\"/>
    if (childNode != null) {
      if (childNode.getNodeName().equals("Presence")) {
        this.constructSimplePresenceAssertion(singleAssertion, childNode, obj);
      } else if (childNode.getNodeName().equals("PlainText")) {
        this.constructSimplePlainTextAssertion(singleAssertion, childNode, obj);
      } else if (childNode.getNodeName().equals("StringList")) {
        this.constructSimpleStringListAssertion(singleAssertion, childNode, obj);
      } else if (childNode.getNodeName().equals("ValueSet")) {
        this.constructSimpleValueSetAssertion(singleAssertion, childNode, obj);
      } else if (childNode.getNodeName().equals("Format")) {
        this.constructSimpleFormatAssertion(singleAssertion, childNode, obj);
      } else if (childNode.getNodeName().equals("PathValue")) {
        this.constructSimplePathValueAssertion(singleAssertion, childNode, obj);
      } else if (childNode.getNodeName().equals("SimpleValue")) {
        this.constructSimpleSimpleValueAssertion(singleAssertion, childNode, obj);
      } else if (childNode.getNodeName().equals("SetID")) {
        this.constructSimpleSetIDAssertion(singleAssertion, childNode, obj);
      } else if (childNode.getNodeName().equals("IZSetID")) {
        this.constructSimpleIZSetIDAssertion(singleAssertion, childNode, obj);
      } else if (childNode.getNodeName().equals("Plugin")) {
        this.constructSimplePluginAssertion(singleAssertion, childNode, obj);
      } else {
        try {
          throw new Exception();
        } catch (Exception e) {
          System.out.println("Not Found for " + childNode.getNodeName());
          e.printStackTrace();
        }
      }
    }
    return singleAssertion;
  }

  /**
   * @param singleAssertion
   * @param presenceNode
   */
  private void constructSimplePresenceAssertion(SingleAssertion singleAssertion, Node presenceNode,
      Object obj) {
    String path = ((Element) presenceNode).getAttribute("Path");

    PresenceComplement presenceComplement = new PresenceComplement();

    singleAssertion.setComplement(presenceComplement);
    singleAssertion.setSubject(this.constructSubject(path, obj));
    singleAssertion.setVerbKey("SHALL");
  }

  /**
   * @param singleAssertion
   * @param plainTextNode
   */
  private void constructSimplePlainTextAssertion(SingleAssertion singleAssertion,
      Node plainTextNode, Object obj) {
    String path = ((Element) plainTextNode).getAttribute("Path");
    boolean casesensitive =
        Boolean.parseBoolean(((Element) plainTextNode).getAttribute("IgnoreCase"));
    String value = ((Element) plainTextNode).getAttribute("Text");

    SameValueComplement sameValueComplement = new SameValueComplement();
    sameValueComplement.setCasesensitive(casesensitive);
    sameValueComplement.setValue(value);

    singleAssertion.setComplement(sameValueComplement);
    singleAssertion.setSubject(this.constructSubject(path, obj));
    singleAssertion.setVerbKey("SHALL");
  }

  /**
   * @param singleAssertion
   * @param stringListNode
   */
  private void constructSimpleStringListAssertion(SingleAssertion singleAssertion,
      Node stringListNode, Object obj) {
    String path = ((Element) stringListNode).getAttribute("Path");
    String csvValue = ((Element) stringListNode).getAttribute("CSV");

    ListValuesComplement listValuesComplement = new ListValuesComplement();
    listValuesComplement.setValues(new HashSet<String>(Arrays.asList(csvValue.split(","))));

    singleAssertion.setComplement(listValuesComplement);
    singleAssertion.setSubject(this.constructSubject(path, obj));
    singleAssertion.setVerbKey("SHALL");
  }

  /**
   * @param singleAssertion
   * @param childNode
   */
  private void constructSimpleValueSetAssertion(SingleAssertion singleAssertion, Node valueSetNode,
      Object obj) {
    String path = ((Element) valueSetNode).getAttribute("Path");
    String valueSetID = ((Element) valueSetNode).getAttribute("ValueSetID");
    String strengthStr = ((Element) valueSetNode).getAttribute("BindingStrength");
    String bindingLocationStr = ((Element) valueSetNode).getAttribute("BindingLocation");

    ValuesetComplement valuesetComplement = new ValuesetComplement();
    ValuesetBinding binding = new ValuesetBinding();
    binding.setStrength(ValuesetStrength.fromValue(strengthStr));
    binding.setValuesetId(valueSetID);
    binding.setValuesetLocations(this.constructBindingLocations(bindingLocationStr));

    valuesetComplement.setBinding(binding);

    singleAssertion.setComplement(valuesetComplement);
    singleAssertion.setSubject(this.constructSubject(path, obj));
    singleAssertion.setVerbKey("SHALL");
  }

  /**
   * @param singleAssertion
   * @param childNode
   */
  private void constructSimpleFormatAssertion(SingleAssertion singleAssertion, Node formatNode,
      Object obj) {
    String path = ((Element) formatNode).getAttribute("Path");
    String regex = ((Element) formatNode).getAttribute("Regex");

    FormattedComplement formattedComplement = new FormattedComplement();
    formattedComplement.setRegexPattern(regex);
    formattedComplement.setType(FormatType.regrex);

    singleAssertion.setComplement(formattedComplement);
    singleAssertion.setSubject(this.constructSubject(path, obj));
    singleAssertion.setVerbKey("SHALL");
  }

  /**
   * @param singleAssertion
   * @param childNode
   */
  private void constructSimplePathValueAssertion(SingleAssertion singleAssertion,
      Node pathValueNode, Object obj) {
    String path1 = ((Element) pathValueNode).getAttribute("Path1");
    String path2 = ((Element) pathValueNode).getAttribute("Path2");
    String operatorStr = ((Element) pathValueNode).getAttribute("Operator");

    CompareNodeComplement compareNodeComplement = new CompareNodeComplement();
    compareNodeComplement.setPath(this.constructSubject(path2, obj).getPath());

    if (operatorStr.equals("EQ")) {
      compareNodeComplement.setOperator(CompareOperator.equal);
    } else if (operatorStr.equals("NE")) {
      compareNodeComplement.setOperator(CompareOperator.notequal);
    } else if (operatorStr.equals("GT")) {
      compareNodeComplement.setOperator(CompareOperator.greater);
    } else if (operatorStr.equals("GE")) {
      compareNodeComplement.setOperator(CompareOperator.equalorgreater);
    } else if (operatorStr.equals("LT")) {
      compareNodeComplement.setOperator(CompareOperator.less);
    } else if (operatorStr.equals("LE")) {
      compareNodeComplement.setOperator(CompareOperator.equalorless);
    }

    singleAssertion.setComplement(compareNodeComplement);
    singleAssertion.setSubject(this.constructSubject(path1, obj));
    singleAssertion.setVerbKey("SHALL");

  }

  /**
   * @param singleAssertion
   * @param childNode
   */
  private void constructSimpleSimpleValueAssertion(SingleAssertion singleAssertion,
      Node simpleValueNode, Object obj) {
    String path = ((Element) simpleValueNode).getAttribute("Path");
    String operatorStr = ((Element) simpleValueNode).getAttribute("Operator");
    String value = ((Element) simpleValueNode).getAttribute("Value");

    CompareValueComplement compareValueComplement = new CompareValueComplement();
    compareValueComplement.setValue(value);

    if (operatorStr.equals("EQ")) {
      compareValueComplement.setOperator(CompareOperator.equal);
    } else if (operatorStr.equals("NE")) {
      compareValueComplement.setOperator(CompareOperator.notequal);
    } else if (operatorStr.equals("GT")) {
      compareValueComplement.setOperator(CompareOperator.greater);
    } else if (operatorStr.equals("GE")) {
      compareValueComplement.setOperator(CompareOperator.equalorgreater);
    } else if (operatorStr.equals("LT")) {
      compareValueComplement.setOperator(CompareOperator.less);
    } else if (operatorStr.equals("LE")) {
      compareValueComplement.setOperator(CompareOperator.equalorless);
    }

    singleAssertion.setComplement(compareValueComplement);
    singleAssertion.setSubject(this.constructSubject(path, obj));
    singleAssertion.setVerbKey("SHALL");

  }

  /**
   * @param singleAssertion
   * @param childNode
   */
  private void constructSimpleSetIDAssertion(SingleAssertion singleAssertion, Node setIdNode,
      Object obj) {
    String path = ((Element) setIdNode).getAttribute("Path");

    GenericComplement genericComplement = new GenericComplement();
    genericComplement.setDescription("Simple SetID");
    genericComplement.setName("Simple SetID");

    singleAssertion.setComplement(genericComplement);
    singleAssertion.setSubject(this.constructSubject(path, obj));
    singleAssertion.setVerbKey("SHALL");
  }

  private void constructSimpleIZSetIDAssertion(SingleAssertion singleAssertion, Node setIdNode,
      Object obj) {
    String path1 = ((Element) setIdNode).getAttribute("Element");
    String path2 = ((Element) setIdNode).getAttribute("Parent");

    GenericComplement genericComplement = new GenericComplement();
    genericComplement.setDescription("IZSetID");
    genericComplement.setName("IZSetID");
    Set<Parameter> parms = new HashSet<Parameter>();
    parms.add(new Parameter("Element", this.constructSubject(path1, obj)));
    parms.add(new Parameter("Parent", this.constructSubject(path2, obj)));
    genericComplement.setParms(parms);

    singleAssertion.setComplement(genericComplement);
    singleAssertion.setSubject(this.constructSubject(path1, obj));
    singleAssertion.setVerbKey("SHALL");
  }

  private void constructSimplePluginAssertion(SingleAssertion singleAssertion, Node childNode,
      Object obj) {
    String qualifiedClassName = ((Element) childNode).getAttribute("QualifiedClassName");

    GenericComplement genericComplement = new GenericComplement();
    genericComplement.setDescription("Plugin");
    genericComplement.setName("Plugin");
    Set<Parameter> parms = new HashSet<Parameter>();
    parms.add(new Parameter("QualifiedClassName", qualifiedClassName));
    genericComplement.setParms(parms);

    singleAssertion.setComplement(genericComplement);
    singleAssertion.setVerbKey("SHALL");

  }


  /**
   * @param bindingLocationStr
   * @param dt
   * @return
   */
  private Set<Integer> constructBindingLocations(String bindingLocationStr) {
    Set<Integer> results = new HashSet<Integer>();

    if (bindingLocationStr == null) {
      results.add(1);
    } else if (bindingLocationStr.equals("1")) {
      results.add(1);
    } else if (bindingLocationStr.equals("2")) {
      results.add(2);
    } else if (bindingLocationStr.equals("3")) {
      results.add(3);
    } else if (bindingLocationStr.equals("4")) {
      results.add(4);
    } else if (bindingLocationStr.equals("1 or 4")) {
      results.add(1);
      results.add(4);
    } else if (bindingLocationStr.equals("1 or 4 or 10")) {
      results.add(1);
      results.add(4);
      results.add(10);
    }

    return results;
  }

  /**
   * @param path
   * @param dt
   * @return
   */
  private Subject constructSubject(String path, Object o) {
    Subject subject = new Subject();
    Path pathObj = new Path();
    if (o instanceof Datatype) {
      Datatype dt = (Datatype) o;
      if (path != null) {
        pathObj.setElementId(dt.getId());
        constructChildPath(pathObj, path, dt);
        subject.setPath(pathObj);
        return subject;
      }
    } else if (o instanceof Segment) {
      Segment s = (Segment) o;
      if (path != null) {
        pathObj.setElementId(s.getId());
        constructChildPath(pathObj, path, s);
        subject.setPath(pathObj);
        return subject;
      }
    } else if (o instanceof Group) {
      Group g = (Group) o;
      if (path != null) {
        pathObj.setElementId(g.getId());
        constructChildPath(pathObj, path, g);
        subject.setPath(pathObj);
        return subject;
      }
    } else if (o instanceof Message) {
      Message m = (Message) o;
      if (path != null) {
        pathObj.setElementId(m.getId());
        constructChildPath(pathObj, path, m);
        subject.setPath(pathObj);
        return subject;
      }
    }

    return null;
  }

  /**
   * @param pathObj
   * @param path
   * @param dt
   */
  private void constructChildPath(Path pathObj, String path, Object o) {
    String[] splits = path.split("\\.");
    String firstPath = splits[0];
    String position = firstPath.substring(0, firstPath.indexOf("["));
    String instanceNum = firstPath.substring(firstPath.indexOf("[") + 1, firstPath.indexOf("]"));

    if (o instanceof Datatype) {
      Datatype dt = (Datatype) o;
      if (dt.getComponents() != null && dt.getComponents().size() > 0) {
        for (Component c : dt.getComponents()) {
          if (position.equals("" + c.getPosition())) {
            InstancePath iPathObj = new InstancePath();
            iPathObj.setElementId(c.getId());
            iPathObj.setInstanceParameter(instanceNum);
            pathObj.setChild(iPathObj);

            if (splits.length > 1) {
              Datatype childDt = null;
              Optional<Datatype> optional = datatypeRepository.findById(c.getDatatype().getId());
              if(optional.isPresent()) {
                childDt = optional.get();
              }
              List<String> list = new LinkedList<String>(Arrays.asList(splits));
              list.remove(0);
              if (childDt != null && childDt.getComponents() != null
                  && childDt.getComponents().size() > 0) {
                constructChildPath(iPathObj, String.join(".", list), childDt);
              }
            }
          }
        }
      }
    } else if (o instanceof Segment) {
      Segment s = (Segment) o;
      if (s.getFields() != null && s.getFields().size() > 0) {
        for (Field f : s.getFields()) {
          if (position.equals("" + f.getPosition())) {
            InstancePath iPathObj = new InstancePath();
            iPathObj.setElementId(f.getId());
            iPathObj.setInstanceParameter(instanceNum);
            pathObj.setChild(iPathObj);

            if (splits.length > 1) {
              Datatype childDt = null;
              Optional<Datatype> optional = datatypeRepository.findById(f.getDatatype().getId());
              if(optional.isPresent()) {
                childDt = optional.get();
              }
              List<String> list = new LinkedList<String>(Arrays.asList(splits));
              list.remove(0);
              if (childDt != null && childDt.getComponents() != null
                  && childDt.getComponents().size() > 0) {
                constructChildPath(iPathObj, String.join(".", list), childDt);
              }
            }
          }
        }
      }
    } else if (o instanceof Group) {
      Group g = (Group) o;
      if (g.getChildren() != null && g.getChildren().size() > 0) {
        for (SegmentRefOrGroup srog : g.getChildren()) {
          if (position.equals("" + srog.getPosition())) {
            InstancePath iPathObj = new InstancePath();
            iPathObj.setElementId(srog.getId());
            iPathObj.setInstanceParameter(instanceNum);
            pathObj.setChild(iPathObj);

            if (splits.length > 1) {
              if (srog instanceof SegmentRef) {
                SegmentRef sr = (SegmentRef) srog;
                Segment childSeg = null;
                Optional<Segment> optional = segmentRepository.findById(sr.getRef().getId());
                if(optional.isPresent()) {
                  childSeg = optional.get();
                }
                List<String> list = new LinkedList<String>(Arrays.asList(splits));
                list.remove(0);
                if (childSeg != null && childSeg.getFields() != null
                    && childSeg.getFields().size() > 0) {
                  constructChildPath(iPathObj, String.join(".", list), childSeg);
                }
              } else if (srog instanceof Group) {
                Group childGroup = (Group) srog;
                List<String> list = new LinkedList<String>(Arrays.asList(splits));
                list.remove(0);
                if (childGroup != null && childGroup.getChildren() != null
                    && childGroup.getChildren().size() > 0) {
                  constructChildPath(iPathObj, String.join(".", list), childGroup);
                }
              }
            }
          }
        }
      }
    } else if (o instanceof Message) {
      Message m = (Message) o;
      if (m.getChildren() != null && m.getChildren().size() > 0) {
        for (SegmentRefOrGroup srog : m.getChildren()) {
          if (position.equals("" + srog.getPosition())) {
            InstancePath iPathObj = new InstancePath();
            iPathObj.setElementId(srog.getId());
            iPathObj.setInstanceParameter(instanceNum);
            pathObj.setChild(iPathObj);

            if (splits.length > 1) {
              if (srog instanceof SegmentRef) {
                SegmentRef sr = (SegmentRef) srog;
                Segment childSeg = null;
                Optional<Segment> optional = segmentRepository.findById(sr.getRef().getId());
                if(optional.isPresent()) {
                  childSeg = optional.get();
                }
                List<String> list = new LinkedList<String>(Arrays.asList(splits));
                list.remove(0);
                if (childSeg != null && childSeg.getFields() != null
                    && childSeg.getFields().size() > 0) {
                  constructChildPath(iPathObj, String.join(".", list), childSeg);
                }
              } else if (srog instanceof Group) {
                Group childGroup = (Group) srog;
                List<String> list = new LinkedList<String>(Arrays.asList(splits));
                list.remove(0);
                if (childGroup != null && childGroup.getChildren() != null
                    && childGroup.getChildren().size() > 0) {
                  constructChildPath(iPathObj, String.join(".", list), childGroup);
                }
              }
            }
          }
        }
      }
    }
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

  private Node findChildByNum(Node assertionNode, int num) {
    int count = 1;
    for (int i = 0; i < assertionNode.getChildNodes().getLength(); i++) {
      if (assertionNode.getChildNodes().item(i).getNodeType() == Node.ELEMENT_NODE) {
        if (count == num) {
          return assertionNode.getChildNodes().item(i);
        } else {
          count = count + 1;
        }
      }
    }
    return null;
  }

  /**
   * @param assertionNode
   * @return
   */
  private List<Node> findAllChild(Node assertionNode) {
    List<Node> results = new ArrayList<Node>();

    for (int i = 0; i < assertionNode.getChildNodes().getLength(); i++) {
      if (assertionNode.getChildNodes().item(i).getNodeType() == Node.ELEMENT_NODE) {
        results.add(assertionNode.getChildNodes().item(i));
      }
    }

    return results;
  }

  /**
   * @param assertionNode
   * @return
   */
  private boolean isCompositeOrNotConstraint(Node assertionNode) {
    if (Arrays.asList(new String[] {"AND", "OR", "XOR", "IMPLY", "FORALL", "EXIST", "NOT"})
        .contains(assertionNode.getNodeName()))
      return true;
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
