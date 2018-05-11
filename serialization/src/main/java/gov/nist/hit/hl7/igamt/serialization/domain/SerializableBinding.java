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

import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import gov.nist.hit.hl7.igamt.serialization.util.DateSerializationUtil;
import gov.nist.hit.hl7.igamt.shared.domain.Type;
import gov.nist.hit.hl7.igamt.shared.domain.binding.Binding;
import gov.nist.hit.hl7.igamt.shared.domain.binding.Comment;
import gov.nist.hit.hl7.igamt.shared.domain.binding.ExternalSingleCode;
import gov.nist.hit.hl7.igamt.shared.domain.binding.ResourceBinding;
import gov.nist.hit.hl7.igamt.shared.domain.binding.StructureElementBinding;
import gov.nist.hit.hl7.igamt.shared.domain.binding.ValuesetBinding;
import gov.nist.hit.hl7.igamt.shared.domain.constraint.AssertionConformanceStatement;
import gov.nist.hit.hl7.igamt.shared.domain.constraint.AssertionPredicate;
import gov.nist.hit.hl7.igamt.shared.domain.constraint.ConformanceStatement;
import gov.nist.hit.hl7.igamt.shared.domain.constraint.FreeTextConformanceStatement;
import gov.nist.hit.hl7.igamt.shared.domain.constraint.FreeTextPredicate;
import gov.nist.hit.hl7.igamt.shared.domain.constraint.Predicate;
import gov.nist.hit.hl7.igamt.shared.domain.exception.ValuesetNotFoundException;
import nu.xom.Attribute;
import nu.xom.Element;

/**
 *
 * @author Maxence Lefort on Mar 29, 2018.
 */
public class SerializableBinding extends SerializableElement {

  private Binding binding;
  private Map<String, String> valuesetNamesMap;

  /**
   * @param binding
   */
  public SerializableBinding(Binding binding, Map<String, String> valuesetNamesMap) {
    super("binding" + binding.getElementId(), "1", "Bindings");
    this.binding = binding;
    this.valuesetNamesMap = valuesetNamesMap;
  }

  /*
   * (non-Javadoc)
   * 
   * @see gov.nist.hit.hl7.igamt.serialization.domain.SerializableElement#serialize()
   */
  @Override
  public Element serialize() throws SerializationException {
    try {
      Element bindingElement = new Element("Binding");
      bindingElement.addAttribute(
          new Attribute("elementId", binding.getElementId() != null ? binding.getElementId() : ""));
      if (binding.getChildren().size() > 0) {
        Element structureElementBindingsElement =
            this.serializeStructureElementBindings(binding.getChildren(), valuesetNamesMap);
        if (structureElementBindingsElement != null) {
          bindingElement.appendChild(structureElementBindingsElement);
        }
      }
      if (binding instanceof ResourceBinding) {
        for (ConformanceStatement conformanceStatement : ((ResourceBinding) binding)
            .getConformanceStatements()) {
          Element conformanceStatementElement =
              this.serializeConformanceStatement(conformanceStatement);
          if (conformanceStatementElement != null) {
            bindingElement.appendChild(conformanceStatementElement);
          }
        }
      }
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
  private Element serializeStructureElementBindings(
      Set<StructureElementBinding> structureElementBindings, Map<String, String> valuesetNamesMap)
      throws ValuesetNotFoundException {
    Element structureElementBindingsElement = new Element("StructureElementBindings");
    for (StructureElementBinding structureElementBinding : structureElementBindings) {
      if (structureElementBinding != null) {
        Element structureElementBindingElement =
            this.serializeStructureElementBinding(structureElementBinding, valuesetNamesMap);
        if (structureElementBindingElement != null) {
          structureElementBindingsElement.appendChild(structureElementBindingElement);
        }
      }
    }
    return structureElementBindingsElement;
  }

  /**
   * @param structureElementBinding
   * @return
   * @throws ValuesetNotFoundException
   */
  private Element serializeStructureElementBinding(StructureElementBinding structureElementBinding,
      Map<String, String> valuesetNamesMap) throws ValuesetNotFoundException {
    Element structureElementBindingElement = new Element("StructureElementBinding");
    structureElementBindingElement.addAttribute(new Attribute("elementId",
        structureElementBinding.getElementId() != null ? structureElementBinding.getElementId()
            : ""));
    if (structureElementBinding != null && structureElementBinding.getChildren() != null
        && structureElementBinding.getChildren().size() > 0) {
      Element structureElementBindingsElement = this.serializeStructureElementBindings(
          structureElementBinding.getChildren(), valuesetNamesMap);
      if (structureElementBindingsElement != null) {
        structureElementBindingElement.appendChild(structureElementBindingsElement);
      }
    }
    for (ValuesetBinding valuesetBinding : structureElementBinding.getValuesetBindings()) {
      Element valuesetBindingElement =
          this.serializeValuesetBinding(valuesetBinding, valuesetNamesMap);
      if (valuesetBindingElement != null) {
        structureElementBindingElement.appendChild(valuesetBindingElement);
      }
    }
    for (Comment comment : structureElementBinding.getComments()) {
      Element commentElement = this.serializeComment(comment);
      if (commentElement != null) {
        structureElementBindingElement.appendChild(commentElement);
      }
    }
    if (structureElementBinding.getInternalSingleCode() != null) {
      structureElementBindingElement
          .addAttribute(new Attribute("singleCodeId", structureElementBinding.getInternalSingleCode().getCodeId()));
    }
    if (structureElementBinding.getConstantValue() != null) {
      structureElementBindingElement
          .addAttribute(new Attribute("constantValue", structureElementBinding.getConstantValue()));
    }
    if (structureElementBinding.getPredicate() != null) {
      Element predicateElement = this.serializePredicate(structureElementBinding.getPredicate());
      if (predicateElement != null) {
        structureElementBindingElement.appendChild(predicateElement);
      }
    }
    if (structureElementBinding.getExternalSingleCode() != null) {
      Element externalSingleCodeElement =
          this.serializeExternalSingleCode(structureElementBinding.getExternalSingleCode());
      if (externalSingleCodeElement != null) {
        structureElementBindingElement.appendChild(externalSingleCodeElement);
      }
    }
    return structureElementBindingElement;
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
   * @param predicate
   * @return
   */
  private Element serializePredicate(Predicate predicate) {
    Element predicateElement = new Element("Predicate");
    predicateElement.addAttribute(new Attribute("true",
        predicate.getTrueUsage() != null ? predicate.getTrueUsage().name() : ""));
    predicateElement.addAttribute(new Attribute("codeSystem",
        predicate.getFalseUsage() != null ? predicate.getFalseUsage().name() : ""));
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

  /**
   * @param comment
   * @return
   */
  private Element serializeComment(Comment comment) {
    Element commentElement = new Element("Comment");
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
  private Element serializeValuesetBinding(ValuesetBinding valuesetBinding,
      Map<String, String> valuesetNamesMap) throws ValuesetNotFoundException {
    if (valuesetBinding.getValuesetId() != null && !valuesetBinding.getValuesetId().isEmpty()) {
      if (valuesetNamesMap.containsKey(valuesetBinding.getValuesetId())) {
        Element valuesetBindingElement = new Element("ValuesetBinding");
        valuesetBindingElement.addAttribute(new Attribute("id", valuesetBinding.getValuesetId()));
        valuesetBindingElement.addAttribute(
            new Attribute("name", valuesetNamesMap.get(valuesetBinding.getValuesetId())));
        valuesetBindingElement.addAttribute(new Attribute("strength",
            valuesetBinding.getStrength() != null ? valuesetBinding.getStrength().name() : ""));
        valuesetBindingElement.addAttribute(new Attribute("strength",
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

  /**
   * @param conformanceStatement
   * @return
   */
  private Element serializeConformanceStatement(ConformanceStatement conformanceStatement) {
    Element conformanceStatementElement = new Element("ConformanceStatementElement");
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



}
