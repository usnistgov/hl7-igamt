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
import gov.nist.hit.hl7.igamt.legacy.repository.DatatypeRepository;
import gov.nist.hit.hl7.igamt.shared.domain.binding.ValuesetBinding;
import gov.nist.hit.hl7.igamt.shared.domain.binding.ValuesetStrength;
import gov.nist.hit.hl7.igamt.shared.domain.constraint.assertion.Assertion;
import gov.nist.hit.hl7.igamt.shared.domain.constraint.assertion.IfThenAssertion;
import gov.nist.hit.hl7.igamt.shared.domain.constraint.assertion.InstancePath;
import gov.nist.hit.hl7.igamt.shared.domain.constraint.assertion.NotAssertion;
import gov.nist.hit.hl7.igamt.shared.domain.constraint.assertion.OperatorAssertion;
import gov.nist.hit.hl7.igamt.shared.domain.constraint.assertion.OperatorAssertion.Operator;
import gov.nist.hit.hl7.igamt.shared.domain.constraint.assertion.Path;
import gov.nist.hit.hl7.igamt.shared.domain.constraint.assertion.SingleAssertion;
import gov.nist.hit.hl7.igamt.shared.domain.constraint.assertion.Subject;
import gov.nist.hit.hl7.igamt.shared.domain.constraint.assertion.complement.CompareNodeComplement;
import gov.nist.hit.hl7.igamt.shared.domain.constraint.assertion.complement.CompareOperator;
import gov.nist.hit.hl7.igamt.shared.domain.constraint.assertion.complement.CompareValueComplement;
import gov.nist.hit.hl7.igamt.shared.domain.constraint.assertion.complement.FormattedComplement;
import gov.nist.hit.hl7.igamt.shared.domain.constraint.assertion.complement.FormattedComplement.FormatType;
import gov.nist.hit.hl7.igamt.shared.domain.constraint.assertion.complement.GenericComplement;
import gov.nist.hit.hl7.igamt.shared.domain.constraint.assertion.complement.ListValuesComplement;
import gov.nist.hit.hl7.igamt.shared.domain.constraint.assertion.complement.PresenceComplement;
import gov.nist.hit.hl7.igamt.shared.domain.constraint.assertion.complement.SameValueComplement;
import gov.nist.hit.hl7.igamt.shared.domain.constraint.assertion.complement.ValuesetComplement;

/**
 * @author jungyubw
 *
 */
public class ConstraintHandler {
  
  @Autowired
  private DatatypeRepository datatypeRepository;

  
  public ConstraintHandler(DatatypeRepository datatypeRepository) {
    this.datatypeRepository = datatypeRepository;
  }
  
  /*
   * rootName is "Assertion" for ConformanceStatement
   * rootName is "Condition" for Predicate
   */
  public Assertion constructAssertionObjForDatatype(String assertionStr, String desc, Datatype dt, String rootName) {
    if(!assertionStr.startsWith(rootName)){
      assertionStr = "<" + rootName + ">" + assertionStr + "</" + rootName + ">";
    }
    Document doc = this.convertStringToDocument(assertionStr);
    Node assertionNode = doc.getElementsByTagName(rootName).item(0);
    Assertion result = constructAssertionObj(this.findFirstChild(assertionNode), dt);
    result.setDescription(desc);
    return result;
  }
  
  /**
   * @param assertionNode
   * @param dt
   * @return 
   */
  private Assertion constructAssertionObj(Node assertionNode, Datatype dt) {
    if (this.isCompositeOrNotConstraint(assertionNode)) {
      if (assertionNode != null) {
        if (assertionNode.getNodeName().equals("NOT")) {
          NotAssertion notAssertion = new NotAssertion();
          notAssertion.setChild(this.constructAssertionObj(this.findFirstChild(assertionNode), dt));
          return notAssertion;
        }else if (assertionNode.getNodeName().equals("AND") || assertionNode.getNodeName().equals("OR")) {
          OperatorAssertion operatorAssertion = new OperatorAssertion();
          operatorAssertion.setOperator(Operator.valueOf(assertionNode.getNodeName()));
          operatorAssertion.addAssertion(this.constructAssertionObj(this.findChildByNum(assertionNode, 1), dt));
          operatorAssertion.addAssertion(this.constructAssertionObj(this.findChildByNum(assertionNode, 2), dt));
          return operatorAssertion;
        }else if (assertionNode.getNodeName().equals("IMPLY")) {
          System.out.println("IF");
          IfThenAssertion ifThenAssertion = new IfThenAssertion();
          ifThenAssertion.setIfAssertion(this.constructAssertionObj(this.findChildByNum(assertionNode, 1), dt));
          ifThenAssertion.setThenAssertion(this.constructAssertionObj(this.findChildByNum(assertionNode, 2), dt));
          return ifThenAssertion;
        }else if (assertionNode.getNodeName().equals("FORALL")) {
          OperatorAssertion operatorAssertion = new OperatorAssertion();
          operatorAssertion.setOperator(Operator.AND);
          List<Node> childNodes = this.findAllChild(assertionNode);
          for(Node child:childNodes){
            operatorAssertion.addAssertion(this.constructAssertionObj(child, dt));
          }
          return operatorAssertion;
        }else if (assertionNode.getNodeName().equals("EXIST")) {
          OperatorAssertion operatorAssertion = new OperatorAssertion();
          operatorAssertion.setOperator(Operator.OR);
          List<Node> childNodes = this.findAllChild(assertionNode);
          for(Node child:childNodes){
            operatorAssertion.addAssertion(this.constructAssertionObj(child, dt));
          }
          return operatorAssertion;
        }
      }
    } else {
      SingleAssertion singleAssertion = this.constructSingleAssertionObjForDatatype(dt, assertionNode);
      return singleAssertion;
    }

    return null;
    
  }

  private SingleAssertion constructSingleAssertionObjForDatatype(Datatype dt, Node childNode){
    SingleAssertion singleAssertion = new SingleAssertion();
    
    if (childNode != null) {
      if (childNode.getNodeName().equals("Presence")) {
        this.constructSimplePresenceAssertion(singleAssertion, childNode, dt);
      } else if (childNode.getNodeName().equals("PlainText")) {
        this.constructSimplePlainTextAssertion(singleAssertion, childNode, dt);
      } else if (childNode.getNodeName().equals("StringList")) {
        this.constructSimpleStringListAssertion(singleAssertion, childNode, dt);
      } else if (childNode.getNodeName().equals("ValueSet")) {
        this.constructSimpleValueSetAssertion(singleAssertion, childNode, dt);
      } else if (childNode.getNodeName().equals("Format")) {
        this.constructSimpleFormatAssertion(singleAssertion, childNode, dt);
      } else if (childNode.getNodeName().equals("PathValue")) {
        this.constructSimplePathValueAssertion(singleAssertion, childNode, dt);
      } else if (childNode.getNodeName().equals("SimpleValue")) {
        this.constructSimpleSimpleValueAssertion(singleAssertion, childNode, dt);
      } else if (childNode.getNodeName().equals("SetID")) {
        this.constructSimpleSetIDAssertion(singleAssertion, childNode, dt);
      }
    }
    return singleAssertion;
  }

  /**
   * @param singleAssertion
   * @param presenceNode
   */
  private void constructSimplePresenceAssertion(SingleAssertion singleAssertion, Node presenceNode, Datatype dt) {
    String path = ((Element)presenceNode).getAttribute("Path");
    
    PresenceComplement presenceComplement = new PresenceComplement();
    
    singleAssertion.setComplement(presenceComplement);
    singleAssertion.setSubject(this.constructSubject(path, dt));
    singleAssertion.setVerbKey("SHALL");
  }
  
  /**
   * @param singleAssertion
   * @param plainTextNode
   */
  private void constructSimplePlainTextAssertion(SingleAssertion singleAssertion, Node plainTextNode, Datatype dt) {
    String path = ((Element)plainTextNode).getAttribute("Path");
    boolean casesensitive = Boolean.parseBoolean(((Element)plainTextNode).getAttribute("IgnoreCase"));
    String value = ((Element)plainTextNode).getAttribute("Text");
    
    SameValueComplement sameValueComplement = new SameValueComplement();
    sameValueComplement.setCasesensitive(casesensitive);
    sameValueComplement.setValue(value);
    
    singleAssertion.setComplement(sameValueComplement);
    singleAssertion.setSubject(this.constructSubject(path, dt));
    singleAssertion.setVerbKey("SHALL");
  }
  
  /**
   * @param singleAssertion
   * @param stringListNode
   */
  private void constructSimpleStringListAssertion(SingleAssertion singleAssertion, Node stringListNode, Datatype dt) {
    String path = ((Element)stringListNode).getAttribute("Path");
    String csvValue = ((Element)stringListNode).getAttribute("CSV");

    ListValuesComplement listValuesComplement = new ListValuesComplement();
    listValuesComplement.setValues(new HashSet<String>(Arrays.asList(csvValue.split(","))));
    
    singleAssertion.setComplement(listValuesComplement);
    singleAssertion.setSubject(this.constructSubject(path, dt));
    singleAssertion.setVerbKey("SHALL");
  }
  
  /**
   * @param singleAssertion
   * @param childNode
   */
  private void constructSimpleValueSetAssertion(SingleAssertion singleAssertion, Node valueSetNode, Datatype dt) {
    String path = ((Element)valueSetNode).getAttribute("Path");
    String valueSetID = ((Element)valueSetNode).getAttribute("ValueSetID");
    String strengthStr = ((Element)valueSetNode).getAttribute("BindingStrength");
    String bindingLocationStr = ((Element)valueSetNode).getAttribute("BindingLocation");
    
    ValuesetComplement valuesetComplement = new ValuesetComplement();
    ValuesetBinding binding = new ValuesetBinding();
    binding.setStrength(ValuesetStrength.fromValue(strengthStr));
    binding.setValuesetId(valueSetID);
    binding.setValuesetLocations(this.constructBindingLocations(bindingLocationStr, dt));
    
    valuesetComplement.setBinding(binding);

    singleAssertion.setComplement(valuesetComplement);
    singleAssertion.setSubject(this.constructSubject(path, dt));
    singleAssertion.setVerbKey("SHALL");
  }
  
  /**
   * @param singleAssertion
   * @param childNode
   */
  private void constructSimpleFormatAssertion(SingleAssertion singleAssertion, Node formatNode, Datatype dt) {
    String path = ((Element)formatNode).getAttribute("Path");
    String regex = ((Element)formatNode).getAttribute("Regex");
    
    FormattedComplement formattedComplement = new FormattedComplement();
    formattedComplement.setRegexPattern(regex);
    formattedComplement.setType(FormatType.regrex);
    
    singleAssertion.setComplement(formattedComplement);
    singleAssertion.setSubject(this.constructSubject(path, dt));
    singleAssertion.setVerbKey("SHALL");
  }
  
  /**
   * @param singleAssertion
   * @param childNode
   */
  private void constructSimplePathValueAssertion(SingleAssertion singleAssertion, Node pathValueNode, Datatype dt) {
    String path1 = ((Element)pathValueNode).getAttribute("Path1");
    String path2 = ((Element)pathValueNode).getAttribute("Path2");
    String operatorStr = ((Element)pathValueNode).getAttribute("Operator");
    
    CompareNodeComplement compareNodeComplement = new CompareNodeComplement();
    compareNodeComplement.setComparatorPath(this.constructSubject(path2, dt).getPath());
    
    if(operatorStr.equals("EQ")){
      compareNodeComplement.setOperator(CompareOperator.equal);
    }else if(operatorStr.equals("NE")){
      compareNodeComplement.setOperator(CompareOperator.notequal);
    }else if(operatorStr.equals("GT")){
      compareNodeComplement.setOperator(CompareOperator.greater);
    }else if(operatorStr.equals("GE")){
      compareNodeComplement.setOperator(CompareOperator.equalorgreater);
    }else if(operatorStr.equals("LT")){
      compareNodeComplement.setOperator(CompareOperator.less);
    }else if(operatorStr.equals("LE")){
      compareNodeComplement.setOperator(CompareOperator.equalorless);
    }
    
    singleAssertion.setComplement(compareNodeComplement);
    singleAssertion.setSubject(this.constructSubject(path1, dt));
    singleAssertion.setVerbKey("SHALL");  

  }
  
  /**
   * @param singleAssertion
   * @param childNode
   */
  private void constructSimpleSimpleValueAssertion(SingleAssertion singleAssertion, Node simpleValueNode, Datatype dt) {
    String path = ((Element)simpleValueNode).getAttribute("Path");
    String operatorStr = ((Element)simpleValueNode).getAttribute("Operator");
    String value = ((Element)simpleValueNode).getAttribute("Value");
    
    CompareValueComplement compareValueComplement = new CompareValueComplement();
    compareValueComplement.setValue(value);
    
    if(operatorStr.equals("EQ")){
      compareValueComplement.setOperator(CompareOperator.equal);
    }else if(operatorStr.equals("NE")){
      compareValueComplement.setOperator(CompareOperator.notequal);
    }else if(operatorStr.equals("GT")){
      compareValueComplement.setOperator(CompareOperator.greater);
    }else if(operatorStr.equals("GE")){
      compareValueComplement.setOperator(CompareOperator.equalorgreater);
    }else if(operatorStr.equals("LT")){
      compareValueComplement.setOperator(CompareOperator.less);
    }else if(operatorStr.equals("LE")){
      compareValueComplement.setOperator(CompareOperator.equalorless);
    }
    
    singleAssertion.setComplement(compareValueComplement);
    singleAssertion.setSubject(this.constructSubject(path, dt));
    singleAssertion.setVerbKey("SHALL");

  }
  
  /**
   * @param singleAssertion
   * @param childNode
   */
  private void constructSimpleSetIDAssertion(SingleAssertion singleAssertion, Node setIdNode, Datatype dt) {
    String path = ((Element)setIdNode).getAttribute("Path");
    
    GenericComplement genericComplement = new GenericComplement();
    genericComplement.setDescription("Simple SetID");
    genericComplement.setName("Simple SetID");
    
    singleAssertion.setComplement(genericComplement);
    singleAssertion.setSubject(this.constructSubject(path, dt));
    singleAssertion.setVerbKey("SHALL");
  }

  /**
   * @param bindingLocationStr
   * @param dt
   * @return
   */
  private Set<String> constructBindingLocations(String bindingLocationStr, Datatype dt) {
    if(dt.getComponents() != null && dt.getComponents().size() > 0){
      Set<String> results = new HashSet<String>();
      
      if (bindingLocationStr == null) {
        results.add(this.findComponentByPosition(dt.getComponents(), 1).getId());
      } else if (bindingLocationStr.equals("1")) {
        results.add(this.findComponentByPosition(dt.getComponents(), 1).getId());
      } else if (bindingLocationStr.equals("2")) {
        results.add(this.findComponentByPosition(dt.getComponents(), 2).getId());
      } else if (bindingLocationStr.equals("3")) {
        results.add(this.findComponentByPosition(dt.getComponents(), 3).getId());
      } else if (bindingLocationStr.equals("4")) {
        results.add(this.findComponentByPosition(dt.getComponents(), 4).getId());
      } else if (bindingLocationStr.equals("1 or 4")) {
        results.add(this.findComponentByPosition(dt.getComponents(), 1).getId());
        results.add(this.findComponentByPosition(dt.getComponents(), 4).getId());
      } else if (bindingLocationStr.equals("1 or 4 or 10")) {
        results.add(this.findComponentByPosition(dt.getComponents(), 1).getId());
        results.add(this.findComponentByPosition(dt.getComponents(), 4).getId());
        results.add(this.findComponentByPosition(dt.getComponents(), 10).getId());
      }     
      
      return results;
    }else{
      return null;
    }
  }

  /**
   * @param components
   * @param i
   * @return
   */
  private Component findComponentByPosition(List<Component> components, int i) {
    for (Component c : components) {
      if (c.getPosition() == i)
        return c;
    }
    return null;
  }

  /**
   * @param path
   * @param dt
   * @return
   */
  private Subject constructSubject(String path, Datatype dt) {
    if(path != null){
      Subject subject = new Subject();
      Path pathObj = new Path();
      pathObj.setElementId(dt.getId());

      constructChildPath(pathObj, path, dt);
      
      subject.setPath(pathObj);
      return subject;
    }
    return null;
  }

  /**
   * @param pathObj
   * @param path
   * @param dt
   */
  private void constructChildPath(Path pathObj, String path, Datatype dt) {
    String[] splits = path.split("\\.");
    String firstPath = splits[0];
    
    String position = firstPath.substring(0, firstPath.indexOf("["));
    String instanceNum = firstPath.substring(firstPath.indexOf("[") + 1, firstPath.indexOf("]"));
    
    if(dt.getComponents() != null && dt.getComponents().size() > 0){
      for(Component c:dt.getComponents()){
        if(position.equals("" + c.getPosition())){
          InstancePath iPathObj = new InstancePath();
          iPathObj.setElementId(c.getId());
          iPathObj.setInstanceParameter(instanceNum);
          pathObj.setChild(iPathObj);

          if(splits.length > 1){
            Datatype childDt = datatypeRepository.findOne(c.getDatatype().getId());
            List<String> list = new LinkedList<String>(Arrays.asList(splits));
            list.remove(0);
            if(childDt != null && childDt.getComponents() != null && childDt.getComponents().size() > 0){
              constructChildPath(iPathObj, String.join(".", list), childDt);
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
        if(count == num){
          return assertionNode.getChildNodes().item(i);
        }else {
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
