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
package gov.nist.hit.hl7.igamt.serialization.domain;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
import gov.nist.hit.hl7.igamt.common.base.exception.ValuesetNotFoundException;
import gov.nist.hit.hl7.igamt.common.binding.domain.Binding;
import gov.nist.hit.hl7.igamt.common.binding.domain.Comment;
import gov.nist.hit.hl7.igamt.common.binding.domain.ExternalSingleCode;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;
import gov.nist.hit.hl7.igamt.common.constraint.domain.AssertionConformanceStatement;
import gov.nist.hit.hl7.igamt.common.constraint.domain.AssertionPredicate;
import gov.nist.hit.hl7.igamt.common.constraint.domain.ConformanceStatement;
import gov.nist.hit.hl7.igamt.common.constraint.domain.FreeTextConformanceStatement;
import gov.nist.hit.hl7.igamt.common.constraint.domain.FreeTextPredicate;
import gov.nist.hit.hl7.igamt.common.constraint.domain.Predicate;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import gov.nist.hit.hl7.igamt.serialization.util.DateSerializationUtil;
import nu.xom.Attribute;
import nu.xom.Element;

/**
 *
 * @author Maxence Lefort on Mar 29, 2018.
 */
public class SerializableBinding extends SerializableElement {

  private Binding binding;
  private Map<String, String> valuesetNamesMap;
  private Map<String, String> valuesetLabelMap;
  private Map<String, String> idPathMap;
  private Set<Element> conformanceStatements;
  private Set<Element> predicates;
  Element bindingElement = new Element("Binding");
  Element valuesetBindingList = new Element("ValueSetBindingList");
  Element commentListElement = new Element("CommentList");

  /**
   * @param binding
   */
  public SerializableBinding(Binding binding, Map<String, String> idPathMap,
      Map<String, String> valuesetNamesMap, Map<String, String> valuesetLabelMap) {
    super("binding" + binding.getElementId(), "1", "Bindings");
    this.binding = binding;
    this.valuesetNamesMap = valuesetNamesMap;
    this.idPathMap = idPathMap;
    this.conformanceStatements = new HashSet<>();
    this.predicates = new HashSet<>();
    this.valuesetLabelMap = valuesetLabelMap;
  }

  /*
   * (non-Javadoc)
   * 
   * @see gov.nist.hit.hl7.igamt.serialization.domain.SerializableElement#serialize()
   */
  @Override
  public Element serialize() throws SerializationException {
    try {
      bindingElement.addAttribute(
          new Attribute("elementId", binding.getElementId() != null ? binding.getElementId() : ""));
      if (binding.getChildren() != null && binding.getChildren().size() > 0) {
        this.serializeStructureElementBindings(binding.getChildren(), idPathMap, valuesetNamesMap, valuesetLabelMap);
      }
      if (binding instanceof ResourceBinding) {
        if (((ResourceBinding) binding).getConformanceStatements() != null) {
          for (ConformanceStatement conformanceStatement : ((ResourceBinding) binding)
              .getConformanceStatements()) {
            Element conformanceStatementElement =
                this.serializeConformanceStatement(conformanceStatement);
            if (conformanceStatementElement != null) {
              this.conformanceStatements.add(conformanceStatementElement);
              bindingElement.appendChild(conformanceStatementElement);
            }
          }
        }
      }
      bindingElement.appendChild(valuesetBindingList);
      bindingElement.appendChild(commentListElement);
      return bindingElement;
    } catch (Exception exception) {
      throw new SerializationException(exception, Type.BINDING, "Binding");
    }
  }

  /**
   * @param children
   * @return
   * @throws ValuesetNotFoundException
   */
  private void serializeStructureElementBindings(
      Set<StructureElementBinding> structureElementBindings, Map<String, String> idPathMap,
      Map<String, String> valuesetNamesMap, Map<String, String> valuesetLabelMap) throws ValuesetNotFoundException {
    if (structureElementBindings != null) {
      for (StructureElementBinding structureElementBinding : structureElementBindings) {
        if (structureElementBinding != null) {
          this.serializeStructureElementBinding(
              structureElementBinding, idPathMap, valuesetNamesMap, valuesetLabelMap);
        }
      }
    }
  }

  /**
   * @param structureElementBinding
   * @return
   * @throws ValuesetNotFoundException
   */
  private void serializeStructureElementBinding(StructureElementBinding structureElementBinding,
      Map<String, String> idPathMap, Map<String, String> valuesetNamesMap, Map<String, String> valuesetLabelMap)
      throws ValuesetNotFoundException {
    if (structureElementBinding != null) {
      String location = "";
      if(idPathMap.containsKey(structureElementBinding.getElementId())) {
          location = idPathMap.get(structureElementBinding.getElementId());
      }
      if (structureElementBinding.getChildren() != null
          && structureElementBinding.getChildren().size() > 0) {
        this.serializeStructureElementBindings(structureElementBinding.getChildren(), idPathMap, valuesetNamesMap, valuesetLabelMap);
      }
      if (structureElementBinding.getValuesetBindings() != null && !structureElementBinding.getValuesetBindings().isEmpty()) {
        for (ValuesetBinding valuesetBinding : structureElementBinding.getValuesetBindings()) {
          Element valuesetBindingElement =
              this.serializeValuesetBinding(location, valuesetBinding, valuesetNamesMap, valuesetLabelMap);
          if (valuesetBindingElement != null) {
            valuesetBindingList.appendChild(valuesetBindingElement);
          }
        }
      }
      if (structureElementBinding.getComments() != null && !structureElementBinding.getComments().isEmpty()) {
        for (Comment comment : structureElementBinding.getComments()) {
          Element commentElement = this.serializeComment(location, comment);
          if (commentElement != null) {
            commentListElement.appendChild(commentElement);
          }
        }
      }
//      if (structureElementBinding.getInternalSingleCode() != null) {
//        structureElementBindingElement.addAttribute(new Attribute("singleCodeId",
//            structureElementBinding.getInternalSingleCode().getCodeId()));
//      }
//      if (structureElementBinding.getConstantValue() != null) {
//        structureElementBindingElement.addAttribute(
//            new Attribute("constantValue", structureElementBinding.getConstantValue()));
//      }
      if (structureElementBinding.getPredicate() != null) {
        Element predicateElement = this.serializePredicate(location, structureElementBinding.getPredicate());
        if (predicateElement != null) {
          this.predicates.add(predicateElement);
          bindingElement.appendChild(predicateElement);
        }
      }
      if (structureElementBinding.getExternalSingleCode() != null) {
        Element externalSingleCodeElement =
            this.serializeExternalSingleCode(structureElementBinding.getExternalSingleCode());
        if (externalSingleCodeElement != null) {
          bindingElement.appendChild(externalSingleCodeElement);
        }
      }
    }
  }

  /**
   * @param externalSingleCode
   * @return
   */
  private Element serializeExternalSingleCode(ExternalSingleCode externalSingleCode) {
    Element externalSingleCodeElement = new Element("ExternalSingleCode");
    externalSingleCodeElement.addAttribute(new Attribute("value",
        externalSingleCode.getValue() != null ? externalSingleCode.getValue() : ""));
    externalSingleCodeElement.addAttribute(new Attribute("codeSystem",
        externalSingleCode.getCodeSystem() != null ? externalSingleCode.getCodeSystem() : ""));
    return externalSingleCodeElement;
  }



  /**
   * @param comment
   * @return
   */
  private Element serializeComment(String location, Comment comment) {
    Element commentElement = new Element("Comment");
    commentElement.addAttribute(new Attribute("location",
        location != null ? location : ""));
    commentElement.addAttribute(new Attribute("description",
        comment.getDescription() != null ? comment.getDescription() : ""));
    commentElement.addAttribute(new Attribute("date",
        comment.getDateupdated() != null
            ? DateSerializationUtil.serializeDate(comment.getDateupdated())
            : ""));
    return commentElement;
  }

  /**
   * @param valuesetBinding
   * @param valuesetNamesMap
   * @return
   * @throws ValuesetNotFoundException
   */
  private Element serializeValuesetBinding(String location, ValuesetBinding valuesetBinding,
      Map<String, String> valuesetNamesMap, Map<String, String> valuesetLabelMap) throws ValuesetNotFoundException {
    if (valuesetBinding.getValuesetId() != null && !valuesetBinding.getValuesetId().isEmpty()) {
      if (valuesetNamesMap.containsKey(valuesetBinding.getValuesetId())) {
        Element valuesetBindingElement = new Element("ValuesetBinding");
        valuesetBindingElement.addAttribute(new Attribute("bindingIdentifier", valuesetNamesMap.get(valuesetBinding.getValuesetId())));
        valuesetBindingElement.addAttribute(new Attribute("location", location));
        String valueSetName = valuesetLabelMap.get(valuesetBinding.getValuesetId());
        valuesetBindingElement.addAttribute(new Attribute("name", valueSetName != null ? valueSetName : ""));
        valuesetBindingElement.addAttribute(new Attribute("bindingStrength",
            valuesetBinding.getStrength() != null ? valuesetBinding.getStrength().name() : ""));
        valuesetBindingElement.addAttribute(new Attribute("bindingLocation",
            valuesetBinding.getValuesetLocations() != null
                ? convertValuesetLocationsToString(valuesetBinding.getValuesetLocations())
                : ""));
        return valuesetBindingElement;
      } else {
        throw new ValuesetNotFoundException(valuesetBinding.getValuesetId());
      }

    }
    return null;
  }

  /**
   * @param valuesetLocations
   * @return locations as string
   */
  private String convertValuesetLocationsToString(Set<Integer> valuesetLocations) {
    Set<String> valuesetLocationsString = new HashSet<>();
    for (Integer location : valuesetLocations) {
      valuesetLocationsString.add(String.valueOf(location));
    }
    return String.join(",", valuesetLocationsString);
  }

  public Set<Element> getConformanceStatements() {
    return conformanceStatements;
  }

  public Set<Element> getPredicates() {
    return predicates;
  }

  /**
   * @param conformanceStatement
   * @return
   */
  private Element serializeConformanceStatement(ConformanceStatement conformanceStatement) {
    Element conformanceStatementElement = new Element("Constraint");
    //Attribute type is used in the export to separate conformance statements (cs) from predicates (pre)
    conformanceStatementElement.addAttribute(new Attribute("Type","cs"));
    conformanceStatementElement.addAttribute(new Attribute("identifier",
        conformanceStatement.getIdentifier() != null ? conformanceStatement.getIdentifier() : ""));
    if (conformanceStatement instanceof AssertionConformanceStatement) {
      if (((AssertionConformanceStatement) conformanceStatement).getAssertion() != null) {
        String description =
            ((AssertionConformanceStatement) conformanceStatement).getAssertion().getDescription();
        conformanceStatementElement
            .addAttribute(new Attribute("description", description != null ? description : ""));
      }
    } else if (conformanceStatement instanceof FreeTextConformanceStatement) {
      conformanceStatementElement.addAttribute(new Attribute("description",
          ((FreeTextConformanceStatement) conformanceStatement).getFreeText() != null
              ? ((FreeTextConformanceStatement) conformanceStatement).getFreeText()
              : ""));
    }
    return conformanceStatementElement;
  }

  /**
   * @param predicate
   * @return
   */
  private Element serializePredicate(String location, Predicate predicate) {
    Element predicateElement = new Element("Constraint");
    //Attribute type is used in the export to separate conformance statements (cs) from predicates (pre)
    predicateElement.addAttribute(new Attribute("Type","pre"));
    predicateElement.addAttribute(new Attribute("location", location));
    String usage = (predicate.getTrueUsage() != null ? predicate.getTrueUsage().name() : "")+(predicate.getFalseUsage() != null ? predicate.getFalseUsage().name() : "");
    predicateElement.addAttribute(new Attribute("usage",
        usage != null ? usage : ""));
    if (predicate instanceof AssertionPredicate) {
      if (((AssertionPredicate) predicate).getAssertion() != null) {
        String description = ((AssertionPredicate) predicate).getAssertion().getDescription();
        predicateElement
            .addAttribute(new Attribute("description", description != null ? description : ""));
      }
    } else if (predicate instanceof FreeTextPredicate) {
      predicateElement.addAttribute(new Attribute("description",
          ((FreeTextPredicate) predicate).getFreeText() != null
              ? ((FreeTextPredicate) predicate).getFreeText()
              : ""));
    }
    return predicateElement;
  }

}
