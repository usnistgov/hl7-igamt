package gov.nist.hit.hl7.igamt.legacy.service.util;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Code;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Comment;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Component;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Datatype;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.SingleCodeBinding;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.SingleElementValue;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.ValueSetBinding;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.ValueSetBindingStrength;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.ValueSetOrSingleCodeBinding;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.constraints.ConformanceStatement;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.constraints.Predicate;
import gov.nist.hit.hl7.igamt.legacy.repository.DatatypeRepository;
import gov.nist.hit.hl7.igamt.shared.domain.Usage;
import gov.nist.hit.hl7.igamt.shared.domain.binding.ExternalSingleCode;
import gov.nist.hit.hl7.igamt.shared.domain.binding.ResourceBinding;
import gov.nist.hit.hl7.igamt.shared.domain.binding.StructureElementBinding;
import gov.nist.hit.hl7.igamt.shared.domain.binding.ValuesetStrength;

public class BindingHandler {

  @Autowired
  private DatatypeRepository datatypeRepository;

  public BindingHandler(DatatypeRepository datatypeRepository) {
    this.datatypeRepository = datatypeRepository;
  }

  public ResourceBinding convertBindingForDatatype(Datatype oldDatatype) {
    if (oldDatatype.getComponents() != null && oldDatatype.getComponents().size() > 0) {
      ResourceBinding rb = new ResourceBinding();
      rb.setElementId(oldDatatype.getId());

      for (Component c : oldDatatype.getComponents()) {
        String path = "" + c.getPosition();
        rb.addChild(constructResourceBindingForComponent(oldDatatype, path, c));
      }

      /*
       * Convert ConformanceStatement
       */
      List<ConformanceStatement> oldConformanceStatements = oldDatatype.getConformanceStatements();
      for (ConformanceStatement oldConformanceStatement : oldConformanceStatements) {
        if (oldConformanceStatement.getAssertion() != null
            && !oldConformanceStatement.getAssertion().equals("")) {
          ConstraintHandler cHandler = new ConstraintHandler(datatypeRepository);

          gov.nist.hit.hl7.igamt.shared.domain.constraint.AssertionConformanceStatement newAssertionConformanceStatement =
              new gov.nist.hit.hl7.igamt.shared.domain.constraint.AssertionConformanceStatement();
          newAssertionConformanceStatement.setIdentifier(oldConformanceStatement.getConstraintId());
          newAssertionConformanceStatement.setAssertion(cHandler.constructAssertionObjForDatatype(
              oldConformanceStatement.getAssertion(),oldConformanceStatement.getDescription(), oldDatatype, "Assertion"));
          rb.addConformanceStatement(newAssertionConformanceStatement);
        } else {
          gov.nist.hit.hl7.igamt.shared.domain.constraint.FreeTextConformanceStatement newFreeConformanceStatement =
              new gov.nist.hit.hl7.igamt.shared.domain.constraint.FreeTextConformanceStatement();
          newFreeConformanceStatement.setFreeText(oldConformanceStatement.getDescription());
          newFreeConformanceStatement.setIdentifier(oldConformanceStatement.getConstraintId());
          rb.addConformanceStatement(newFreeConformanceStatement);
        }
      }

      return rb;
    }
    return null;
  }

  private StructureElementBinding constructResourceBindingForComponent(
      gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Datatype oldDatatype, String path,
      Component c) {

    StructureElementBinding seb = new StructureElementBinding();
    seb.setElementId(c.getId());

    /*
     * Convert Comments
     */
    List<Comment> oldComments = this.findOldCommentByPath(oldDatatype, path);
    for (Comment comment : oldComments) {
      gov.nist.hit.hl7.igamt.shared.domain.binding.Comment newComment =
          new gov.nist.hit.hl7.igamt.shared.domain.binding.Comment();
      newComment.setDateupdated(comment.getLastUpdatedDate());
      newComment.setDescription(comment.getDescription());
      // TODO need to change username
      newComment.setUsername(comment.getAuthorId() + "");
      seb.addComment(newComment);
    }

    /*
     * Convert ConstantValue
     */
    SingleElementValue oldSingleElementValue =
        this.findOldSingleElementValueByPath(oldDatatype, path);
    if (oldSingleElementValue != null) {
      seb.setConstantValue(oldSingleElementValue.getValue());
    }

    /*
     * Convert ValueSet and SingleCode
     */
    List<ValueSetOrSingleCodeBinding> oldValueSetOrSingleCodeBindings =
        this.findValueSetOrSingleCodeBindingByPath(oldDatatype, path);
    for (ValueSetOrSingleCodeBinding oldValueSetOrSingleCodeBinding : oldValueSetOrSingleCodeBindings) {
      if (oldValueSetOrSingleCodeBinding instanceof ValueSetBinding) {
        ValueSetBinding oldValueSetBinding = (ValueSetBinding) oldValueSetOrSingleCodeBinding;
        gov.nist.hit.hl7.igamt.shared.domain.binding.ValuesetBinding newValuesetBinding =
            new gov.nist.hit.hl7.igamt.shared.domain.binding.ValuesetBinding();
        newValuesetBinding
            .setStrength(this.mapValueSetStrength(oldValueSetBinding.getBindingStrength()));
        newValuesetBinding.setValuesetId(oldValueSetBinding.getTableId());
        
        if(c.getDatatype() != null && c.getDatatype().getId() != null){
          Datatype childDatatype = datatypeRepository.findOne(c.getDatatype().getId());
          
          if(childDatatype != null){
            if (childDatatype.getComponents() != null && childDatatype.getComponents().size() > 0
                && this.isValueSetComplexDatatype(childDatatype)) {
              if (oldValueSetBinding.getBindingLocation() == null) {
                newValuesetBinding.addValuesetLocation(
                    this.findComponentByPosition(childDatatype.getComponents(), 1).getId());
              } else if (oldValueSetBinding.getBindingLocation().equals("1")) {
                newValuesetBinding.addValuesetLocation(
                    this.findComponentByPosition(childDatatype.getComponents(), 1).getId());
              } else if (oldValueSetBinding.getBindingLocation().equals("2")) {
                newValuesetBinding.addValuesetLocation(
                    this.findComponentByPosition(childDatatype.getComponents(), 2).getId());
              } else if (oldValueSetBinding.getBindingLocation().equals("3")) {
                newValuesetBinding.addValuesetLocation(
                    this.findComponentByPosition(childDatatype.getComponents(), 3).getId());
              } else if (oldValueSetBinding.getBindingLocation().equals("4")) {
                newValuesetBinding.addValuesetLocation(
                    this.findComponentByPosition(childDatatype.getComponents(), 4).getId());
              } else if (oldValueSetBinding.getBindingLocation().equals("1 or 4")) {
                newValuesetBinding.addValuesetLocation(
                    this.findComponentByPosition(childDatatype.getComponents(), 1).getId());
                newValuesetBinding.addValuesetLocation(
                    this.findComponentByPosition(childDatatype.getComponents(), 4).getId());
              } else if (oldValueSetBinding.getBindingLocation().equals("1 or 4 or 10")) {
                newValuesetBinding.addValuesetLocation(
                    this.findComponentByPosition(childDatatype.getComponents(), 1).getId());
                newValuesetBinding.addValuesetLocation(
                    this.findComponentByPosition(childDatatype.getComponents(), 4).getId());
                newValuesetBinding.addValuesetLocation(
                    this.findComponentByPosition(childDatatype.getComponents(), 10).getId());
              }
            }
          }
        }
        
        seb.addValuesetBinding(newValuesetBinding);
      } else if (oldValueSetOrSingleCodeBinding instanceof SingleCodeBinding) {
        SingleCodeBinding oldSingleCodeBinding = (SingleCodeBinding) oldValueSetOrSingleCodeBinding;
        Code oldCode = oldSingleCodeBinding.getCode();
        ExternalSingleCode externalSingleCode = new ExternalSingleCode();
        externalSingleCode.setCodeSystem(oldCode.getCodeSystem());
        externalSingleCode.setValue(oldCode.getValue());
        seb.setExternalSingleCode(externalSingleCode);
      }
    }

    /*
     * Convert Predicate
     */
    Predicate oldPredicate = this.findPredicate(oldDatatype, path);
    if (oldPredicate != null) {
      if (oldPredicate.getAssertion() != null && !oldPredicate.getAssertion().equals("")) {
        ConstraintHandler cHandler = new ConstraintHandler(datatypeRepository);

        gov.nist.hit.hl7.igamt.shared.domain.constraint.AssertionPredicate newAssertionPredicate =
            new gov.nist.hit.hl7.igamt.shared.domain.constraint.AssertionPredicate();
        newAssertionPredicate.setFalseUsage(this.convertUsage(oldPredicate.getFalseUsage()));
        newAssertionPredicate.setTrueUsage(this.convertUsage(oldPredicate.getTrueUsage()));
        newAssertionPredicate.setAssertion(cHandler.constructAssertionObjForDatatype(
            oldPredicate.getAssertion(), oldPredicate.getDescription() ,oldDatatype, "Condition"));
        seb.setPredicate(newAssertionPredicate);
      } else {
        gov.nist.hit.hl7.igamt.shared.domain.constraint.FreeTextPredicate newFreeTextPredicate =
            new gov.nist.hit.hl7.igamt.shared.domain.constraint.FreeTextPredicate();
        newFreeTextPredicate.setFalseUsage(this.convertUsage(oldPredicate.getFalseUsage()));
        newFreeTextPredicate.setTrueUsage(this.convertUsage(oldPredicate.getTrueUsage()));
        newFreeTextPredicate.setFreeText(oldPredicate.getDescription());
        seb.setPredicate(newFreeTextPredicate);
      }
    }

    /*
     * Child
     */
    if(c.getDatatype() != null && c.getDatatype().getId() != null){
      Datatype childDatatype = datatypeRepository.findOne(c.getDatatype().getId());
      if(childDatatype != null){
        if (childDatatype.getComponents() != null && childDatatype.getComponents().size() > 0) {
          for (Component childC : childDatatype.getComponents()) {
            String childPath = path + "." + childC.getPosition();

            seb.addChild(constructResourceBindingForComponent(oldDatatype, childPath, childC));
          }
        }        
      }
    }

    return seb;
  }

  private Usage convertUsage(gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Usage usage) {
    if (usage.equals(gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Usage.R))
      return Usage.R;
    else if (usage.equals(gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Usage.RE))
      return Usage.RE;
    else if (usage.equals(gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Usage.C))
      return Usage.C;
    else if (usage.equals(gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Usage.O))
      return Usage.O;
    else if (usage.equals(gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Usage.X))
      return Usage.X;
    else
      return Usage.X;
  }

  private Predicate findPredicate(Datatype oldDatatype, String path) {
    for (Predicate p : oldDatatype.getPredicates()) {
      if (this.getInstancePath(p.getConstraintTarget()).equals(path))
        return p;
    }
    return null;
  }

  private String getInstancePath(String constraintTarget) {
    String result = "";
    String[] splits = constraintTarget.split("\\.");
    for (String split : splits) {
      split = split.substring(0, split.indexOf("["));
      result = result + "." + split;
    }
    return result;
  }

  private Component findComponentByPosition(List<Component> components, int i) {
    for (Component c : components) {
      if (c.getPosition() == i)
        return c;
    }
    return null;
  }

  private boolean isValueSetComplexDatatype(Datatype childDatatype) {
    if (Arrays.asList(new String[] {"CE", "CF", "CWE", "CNE", "CSU", "HD"})
        .contains(childDatatype.getName()))
      return true;
    return false;
  }

  private ValuesetStrength mapValueSetStrength(ValueSetBindingStrength bindingStrength) {
    if (bindingStrength.equals(ValueSetBindingStrength.R)) {
      return ValuesetStrength.R;
    } else if (bindingStrength.equals(ValueSetBindingStrength.S)) {
      return ValuesetStrength.S;
    } else if (bindingStrength.equals(ValueSetBindingStrength.U)) {
      return ValuesetStrength.U;
    }
    return null;
  }

  private List<ValueSetOrSingleCodeBinding> findValueSetOrSingleCodeBindingByPath(
      Datatype oldDatatype, String path) {
    List<ValueSetOrSingleCodeBinding> result = new ArrayList<ValueSetOrSingleCodeBinding>();
    for (ValueSetOrSingleCodeBinding binding : oldDatatype.getValueSetBindings()) {
      if (binding.getLocation().equals(path)) {
        result.add(binding);
      }
    }
    return result;
  }

  private SingleElementValue findOldSingleElementValueByPath(Datatype oldDatatype, String path) {
    for (SingleElementValue sev : oldDatatype.getSingleElementValues()) {
      if (sev.getLocation().equals(path))
        return sev;
    }
    return null;
  }

  private List<Comment> findOldCommentByPath(Datatype oldDatatype, String path) {
    List<Comment> result = new ArrayList<Comment>();
    for (Comment c : oldDatatype.getComments()) {
      if (c.getLocation().equals(path)) {
        result.add(c);
      }
    }
    return result;
  }

  public DatatypeRepository getDatatypeRepository() {
    return datatypeRepository;
  }

  public void setDatatypeRepository(DatatypeRepository datatypeRepository) {
    this.datatypeRepository = datatypeRepository;
  }
}
