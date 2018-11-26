package gov.nist.hit.hl7.igamt.legacy.service.util;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;

import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Code;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Comment;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Component;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Datatype;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Field;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Group;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Message;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Segment;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.SegmentRef;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.SegmentRefOrGroup;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.SingleCodeBinding;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.SingleElementValue;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.ValueSetBinding;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.ValueSetBindingStrength;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.ValueSetOrSingleCodeBinding;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.constraints.ConformanceStatement;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.constraints.Predicate;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetStrength;
import gov.nist.hit.hl7.igamt.common.binding.domain.ExternalSingleCode;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;
import gov.nist.hit.hl7.igamt.legacy.repository.DatatypeRepository;
import gov.nist.hit.hl7.igamt.legacy.repository.SegmentRepository;


public class BindingHandler {

  @Autowired
  private DatatypeRepository datatypeRepository;

  @Autowired
  private SegmentRepository segmentRepository;

  public BindingHandler(DatatypeRepository datatypeRepository) {
    this.datatypeRepository = datatypeRepository;
  }

  /**
   * @param oldMessageRepository
   */
  public BindingHandler(SegmentRepository segmentRepository,
      DatatypeRepository datatypeRepository) {
    this.segmentRepository = segmentRepository;
    this.datatypeRepository = datatypeRepository;
  }

  public ResourceBinding convertResourceBinding(Object oldObject) {
    ResourceBinding rb = new ResourceBinding();
    List<ConformanceStatement> oldConformanceStatements = null;

    if (oldObject instanceof Message) {
      Message oldMessage = (Message) oldObject;
      rb.setElementId(oldMessage.getId());
      for (SegmentRefOrGroup srog : oldMessage.getChildren()) {
        String path = "" + srog.getPosition();
        if (isNeedToDive(path, oldObject)) {
          rb.addChild(constructStructureElementBinding(oldObject, path, srog));
        }
      }
      oldConformanceStatements = oldMessage.getConformanceStatements();
    } else if (oldObject instanceof Group) {
      Group oldGroup = (Group) oldObject;
      rb.setElementId(oldGroup.getId());
      for (SegmentRefOrGroup srog : oldGroup.getChildren()) {
        String path = "" + srog.getPosition();
        if (isNeedToDive(path, oldObject)) {
          rb.addChild(constructStructureElementBinding(oldObject, path, srog));
        }
      }
      oldConformanceStatements = oldGroup.getConformanceStatements();
    } else if (oldObject instanceof Segment) {
      Segment oldSegment = (Segment) oldObject;
      rb.setElementId(oldSegment.getId());

      for (Field f : oldSegment.getFields()) {
        String path = "" + f.getPosition();
        if (isNeedToDive(path, oldObject)) {
          rb.addChild(constructStructureElementBinding(oldSegment, path, f));
        }
      }
      oldConformanceStatements = oldSegment.getConformanceStatements();
    } else if (oldObject instanceof Datatype) {
      Datatype oldDatatype = (Datatype) oldObject;
      rb.setElementId(oldDatatype.getId());

      for (Component c : oldDatatype.getComponents()) {
        String path = "" + c.getPosition();
        if (isNeedToDive(path, oldObject)) {
          rb.addChild(constructStructureElementBinding(oldDatatype, path, c));
        }
      }
      oldConformanceStatements = oldDatatype.getConformanceStatements();
    }

    /*
     * Convert ConformanceStatement
     */
    if (oldConformanceStatements != null) {
      for (ConformanceStatement oldConformanceStatement : oldConformanceStatements) {
        if (oldConformanceStatement.getAssertion() != null
            && !oldConformanceStatement.getAssertion().equals("")) {
          gov.nist.hit.hl7.igamt.common.constraint.domain.FreeTextConformanceStatement newAssertionConformanceStatement = new gov.nist.hit.hl7.igamt.common.constraint.domain.FreeTextConformanceStatement();
          newAssertionConformanceStatement.setIdentifier(oldConformanceStatement.getConstraintId());
          newAssertionConformanceStatement.setFreeText(oldConformanceStatement.getDescription());
          newAssertionConformanceStatement.setAssertionScript(oldConformanceStatement.getAssertion());
          
//          newAssertionConformanceStatement
//              .setAssertion(cHandler.constructAssertionObj(oldConformanceStatement.getAssertion(),
//                  oldConformanceStatement.getDescription(), oldObject, "Assertion"));
          rb.addConformanceStatement(newAssertionConformanceStatement);
        } else {
          gov.nist.hit.hl7.igamt.common.constraint.domain.FreeTextConformanceStatement newFreeConformanceStatement =
              new gov.nist.hit.hl7.igamt.common.constraint.domain.FreeTextConformanceStatement();
          newFreeConformanceStatement.setFreeText(oldConformanceStatement.getDescription());
          newFreeConformanceStatement.setIdentifier(oldConformanceStatement.getConstraintId());
          rb.addConformanceStatement(newFreeConformanceStatement);
        }
      }
    }

    if (rb.getChildren() != null || rb.getConformanceStatements() != null)
      return rb;

    return null;
  }

  private StructureElementBinding constructStructureElementBinding(Object refObj, String path,
      Object target) {
    StructureElementBinding seb = new StructureElementBinding();

    /*
     * Convert Comments
     */
    List<Comment> oldComments = this.findOldCommentByPath(refObj, path);
    for (Comment comment : oldComments) {
      gov.nist.hit.hl7.igamt.common.binding.domain.Comment newComment =
          new gov.nist.hit.hl7.igamt.common.binding.domain.Comment();
      newComment.setDateupdated(comment.getLastUpdatedDate());
      newComment.setDescription(comment.getDescription());
      // TODO need to change username
      newComment.setUsername(comment.getAuthorId() + "");
      seb.addComment(newComment);
    }

    /*
     * Convert Predicate
     */
    Predicate oldPredicate = this.findPredicate(refObj, path);
    if (oldPredicate != null) {
      if (oldPredicate.getAssertion() != null && !oldPredicate.getAssertion().equals("")) {

        gov.nist.hit.hl7.igamt.common.constraint.domain.FreeTextPredicate newAssertionPredicate =
            new gov.nist.hit.hl7.igamt.common.constraint.domain.FreeTextPredicate();
        newAssertionPredicate
            .setFalseUsage(ConversionUtil.convertUsage(oldPredicate.getFalseUsage()));
        newAssertionPredicate
            .setTrueUsage(ConversionUtil.convertUsage(oldPredicate.getTrueUsage()));
        newAssertionPredicate.setFreeText(oldPredicate.getDescription());
        newAssertionPredicate.setAssertion(oldPredicate.getAssertion());
//        newAssertionPredicate.setAssertion(cHandler.constructAssertionObj(
//            oldPredicate.getAssertion(), oldPredicate.getDescription(), refObj, "Condition"));
        seb.setPredicate(newAssertionPredicate);
      } else {
        gov.nist.hit.hl7.igamt.common.constraint.domain.FreeTextPredicate newFreeTextPredicate =
            new gov.nist.hit.hl7.igamt.common.constraint.domain.FreeTextPredicate();
        newFreeTextPredicate
            .setFalseUsage(ConversionUtil.convertUsage(oldPredicate.getFalseUsage()));
        newFreeTextPredicate.setTrueUsage(ConversionUtil.convertUsage(oldPredicate.getTrueUsage()));
        newFreeTextPredicate.setFreeText(oldPredicate.getDescription());
        seb.setPredicate(newFreeTextPredicate);
      }
    }

    if (target instanceof Component || target instanceof Field) {
      /*
       * Convert ConstantValue
       */
      SingleElementValue oldSingleElementValue = this.findOldSingleElementValueByPath(refObj, path);
      if (oldSingleElementValue != null) {
        seb.setConstantValue(oldSingleElementValue.getValue());
      }

      /*
       * Convert ValueSet and SingleCode
       */
      List<ValueSetOrSingleCodeBinding> oldValueSetOrSingleCodeBindings =
          this.findValueSetOrSingleCodeBindingByPath(refObj, path);
      for (ValueSetOrSingleCodeBinding oldValueSetOrSingleCodeBinding : oldValueSetOrSingleCodeBindings) {
        if (oldValueSetOrSingleCodeBinding instanceof ValueSetBinding) {
          ValueSetBinding oldValueSetBinding = (ValueSetBinding) oldValueSetOrSingleCodeBinding;
          gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding newValuesetBinding =
              new gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding();
          newValuesetBinding
              .setStrength(this.mapValueSetStrength(oldValueSetBinding.getBindingStrength()));
          newValuesetBinding.setValuesetId(oldValueSetBinding.getTableId());

          Datatype childDatatype = null;

          if (target instanceof Field) {
            Field f = (Field) target;
            if (f.getDatatype() != null && f.getDatatype().getId() != null) {
              Optional<Datatype> optional = datatypeRepository.findById(f.getDatatype().getId());
              if(optional.isPresent()) {
                childDatatype = optional.get();
              } else {
                System.out.println("Datatype not present: "+f.getDatatype().getId());
              }
            }
          } else if (target instanceof Component) {
            Component c = (Component) target;
            if (c.getDatatype() != null && c.getDatatype().getId() != null) {
              Optional<Datatype> optional = datatypeRepository.findById(c.getDatatype().getId());
              if(optional.isPresent()) {
                childDatatype = optional.get();
              } else {
                System.out.println("Datatype not present: "+c.getDatatype().getId());
              }
            }
          }

          if (childDatatype != null) {
            if (childDatatype.getComponents() != null && childDatatype.getComponents().size() > 0
                && this.isValueSetComplexDatatype(childDatatype)) {
              if (oldValueSetBinding.getBindingLocation() == null) {
                newValuesetBinding.addValuesetLocation(1);
              } else if (oldValueSetBinding.getBindingLocation().equals("1")) {
                newValuesetBinding.addValuesetLocation(1);
              } else if (oldValueSetBinding.getBindingLocation().equals("2")) {
                newValuesetBinding.addValuesetLocation(2);
              } else if (oldValueSetBinding.getBindingLocation().equals("3")) {
                newValuesetBinding.addValuesetLocation(3);
              } else if (oldValueSetBinding.getBindingLocation().equals("4")) {
                newValuesetBinding.addValuesetLocation(4);
              } else if (oldValueSetBinding.getBindingLocation().equals("1 or 4")) {
                newValuesetBinding.addValuesetLocation(1);
                newValuesetBinding.addValuesetLocation(4);
              } else if (oldValueSetBinding.getBindingLocation().equals("1 or 4 or 10")) {
                newValuesetBinding.addValuesetLocation(1);
                newValuesetBinding.addValuesetLocation(4);
                newValuesetBinding.addValuesetLocation(10);
              }
            }
          }

          seb.addValuesetBinding(newValuesetBinding);
        } else if (oldValueSetOrSingleCodeBinding instanceof SingleCodeBinding) {
          SingleCodeBinding oldSingleCodeBinding =
              (SingleCodeBinding) oldValueSetOrSingleCodeBinding;
          Code oldCode = oldSingleCodeBinding.getCode();
          ExternalSingleCode externalSingleCode = new ExternalSingleCode();
          externalSingleCode.setCodeSystem(oldCode.getCodeSystem());
          externalSingleCode.setValue(oldCode.getValue());
          seb.setExternalSingleCode(externalSingleCode);
        }
      }
    }

    /*
     * Child
     */

    if (target instanceof Field) {
      Field f = (Field) target;
      seb.setElementId(f.getId());
      if (f.getDatatype() != null && f.getDatatype().getId() != null) {
        Datatype childDatatype = null;
        Optional<Datatype> optional = datatypeRepository.findById(f.getDatatype().getId());
        if(optional.isPresent()) {
          childDatatype = optional.get();
        } else {
          System.out.println("Datatype not present: "+f.getDatatype().getId());
        }
        if (childDatatype != null) {
          if (childDatatype.getComponents() != null && childDatatype.getComponents().size() > 0) {
            for (Component childC : childDatatype.getComponents()) {
              String childPath = path + "." + childC.getPosition();
              if (isNeedToDive(childPath, refObj))
                seb.addChild(constructStructureElementBinding(refObj, childPath, childC));
            }
          }
        }
      }
    } else if (target instanceof Component) {
      Component c = (Component) target;
      seb.setElementId(c.getId());
      if (c != null && c.getDatatype() != null && c.getDatatype().getId() != null) {
        Datatype childDatatype = null;
        try{
          childDatatype = datatypeRepository.findById(c.getDatatype().getId()).get();
        } catch (NoSuchElementException e) {
          System.out.println("Datatype not present: "+c.getDatatype().getId());
        }
        if (childDatatype != null) {
          if (childDatatype.getComponents() != null && childDatatype.getComponents().size() > 0) {
            for (Component childC : childDatatype.getComponents()) {
              String childPath = path + "." + childC.getPosition();
              if (isNeedToDive(childPath, refObj))
                seb.addChild(constructStructureElementBinding(refObj, childPath, childC));
            }
          }
        }
      }
    } else if (target instanceof SegmentRef) {
      SegmentRef sr = (SegmentRef) target;
      seb.setElementId(sr.getId());
      if (sr.getRef() != null && sr.getRef().getId() != null) {
        Segment childSegment = null;
        Optional<Segment> optional = segmentRepository.findById(sr.getRef().getId());
        if(optional.isPresent()) {
          childSegment = optional.get();
        }
        if (childSegment != null) {
          if (childSegment.getFields() != null && childSegment.getFields().size() > 0) {
            for (Field childF : childSegment.getFields()) {
              String childPath = path + "." + childF.getPosition();
              if (isNeedToDive(childPath, refObj))
                seb.addChild(constructStructureElementBinding(refObj, childPath, childF));
            }
          }
        }
      }
    } else if (target instanceof Group) {
      Group g = (Group) target;
      seb.setElementId(g.getId());
      if (g.getChildren() != null && g.getChildren().size() > 0) {
        for (SegmentRefOrGroup child : g.getChildren()) {
          String childPath = path + "." + child.getPosition();
          if (isNeedToDive(childPath, refObj))
            seb.addChild(constructStructureElementBinding(refObj, childPath, child));
        }
      }
    }

    return seb;
  }

  private String getInstancePath(String constraintTarget) {
    String result = "";
    String[] splits = constraintTarget.split("\\.");
    for (String split : splits) {
      split = split.substring(0, split.indexOf("["));
      result = result + "." + split;
    }
    return result.substring(1);
  }

  private boolean isValueSetComplexDatatype(Datatype childDatatype) {
    if (Arrays.asList(new String[] {"CE", "CF", "CWE", "CNE", "CSU", "HD"})
        .contains(childDatatype.getName()))
      return true;
    return false;
  }

  private ValuesetStrength mapValueSetStrength(ValueSetBindingStrength bindingStrength) {
    if (bindingStrength != null) {
      if (bindingStrength.equals(ValueSetBindingStrength.R)) {
        return ValuesetStrength.R;
      } else if (bindingStrength.equals(ValueSetBindingStrength.S)) {
        return ValuesetStrength.S;
      } else if (bindingStrength.equals(ValueSetBindingStrength.U)) {
        return ValuesetStrength.U;
      }
    }
    return null;
  }

  /**
   * @param childPath
   * @param refObj
   * @return
   */
  private boolean isNeedToDive(String path, Object refObj) {
    /*
     * Need to Check Comments, Predicate, ConstantValue, ValueSet and SingleCode
     */

    if (refObj instanceof Datatype) {
      Datatype dt = (Datatype) refObj;
      for (Comment c : dt.getComments()) {
        if (c.getLocation().equals(path) || c.getLocation().startsWith(path + ".")) {
          return true;
        }
      }

      for (Predicate p : dt.getPredicates()) {
        if (this.getInstancePath(p.getConstraintTarget()).equals(path)
            || this.getInstancePath(p.getConstraintTarget()).startsWith(path + ".")) {
          return true;
        }
      }

      for (SingleElementValue c : dt.getSingleElementValues()) {
        if (c.getLocation().equals(path) || c.getLocation().startsWith(path + ".")) {
          return true;
        }
      }

      for (ValueSetOrSingleCodeBinding v : dt.getValueSetBindings()) {
        if (v.getLocation().equals(path) || v.getLocation().startsWith(path + ".")) {
          return true;
        }
      }
    } else if (refObj instanceof Segment) {
      Segment s = (Segment) refObj;
      for (Comment c : s.getComments()) {
        if (c.getLocation().equals(path) || c.getLocation().startsWith(path + ".")) {
          return true;
        }
      }

      for (Predicate p : s.getPredicates()) {
        if (this.getInstancePath(p.getConstraintTarget()).equals(path)
            || this.getInstancePath(p.getConstraintTarget()).startsWith(path + ".")) {
          return true;
        }
      }

      for (SingleElementValue c : s.getSingleElementValues()) {
        if (c.getLocation().equals(path) || c.getLocation().startsWith(path + ".")) {
          return true;
        }
      }

      for (ValueSetOrSingleCodeBinding v : s.getValueSetBindings()) {
        if (v.getLocation().equals(path) || v.getLocation().startsWith(path + ".")) {
          return true;
        }
      }
    } else if (refObj instanceof Group) {
      Group g = (Group) refObj;

      for (Predicate p : g.getPredicates()) {
        if (this.getInstancePath(p.getConstraintTarget()).equals(path)
            || this.getInstancePath(p.getConstraintTarget()).startsWith(path + "."))
          return true;
      }
    } else if (refObj instanceof Message) {
      Message m = (Message) refObj;
      for (Comment c : m.getComments()) {
        if (c.getLocation().equals(path) || c.getLocation().startsWith(path + ".")) {
          return true;
        }
      }

      for (Predicate p : m.getPredicates()) {
        if (this.getInstancePath(p.getConstraintTarget()).equals(path)
            || this.getInstancePath(p.getConstraintTarget()).startsWith(path + ".")) {
          return true;
        }
      }

      for (SingleElementValue c : m.getSingleElementValues()) {
        if (c.getLocation().equals(path) || c.getLocation().startsWith(path + ".")) {
          return true;
        }
      }

      for (ValueSetOrSingleCodeBinding v : m.getValueSetBindings()) {
        if (v.getLocation().equals(path) || v.getLocation().startsWith(path + ".")) {
          return true;
        }
      }
    }
    return false;
  }

  private Predicate findPredicate(Object refObj, String path) {

    if (refObj instanceof Datatype) {
      for (Predicate p : ((Datatype) refObj).getPredicates()) {
        if (this.getInstancePath(p.getConstraintTarget()).equals(path))
          return p;
      }
    } else if (refObj instanceof Segment) {
      for (Predicate p : ((Segment) refObj).getPredicates()) {
        if (this.getInstancePath(p.getConstraintTarget()).equals(path))
          return p;
      }
    } else if (refObj instanceof Group) {
      for (Predicate p : ((Group) refObj).getPredicates()) {
        if (this.getInstancePath(p.getConstraintTarget()).equals(path))
          return p;
      }
    } else if (refObj instanceof Message) {
      for (Predicate p : ((Message) refObj).getPredicates()) {
        if (this.getInstancePath(p.getConstraintTarget()).equals(path))
          return p;
      }
    }

    return null;
  }

  private List<ValueSetOrSingleCodeBinding> findValueSetOrSingleCodeBindingByPath(Object refObj,
      String path) {
    List<ValueSetOrSingleCodeBinding> result = new ArrayList<ValueSetOrSingleCodeBinding>();

    if (refObj instanceof Datatype) {
      for (ValueSetOrSingleCodeBinding binding : ((Datatype) refObj).getValueSetBindings()) {
        if (binding.getLocation().equals(path)) {
          result.add(binding);
        }
      }
    } else if (refObj instanceof Segment) {
      for (ValueSetOrSingleCodeBinding binding : ((Segment) refObj).getValueSetBindings()) {
        if (binding.getLocation().equals(path)) {
          result.add(binding);
        }
      }
    } else if (refObj instanceof Message) {
      for (ValueSetOrSingleCodeBinding binding : ((Message) refObj).getValueSetBindings()) {
        if (binding.getLocation().equals(path)) {
          result.add(binding);
        }
      }
    }
    return result;
  }

  private SingleElementValue findOldSingleElementValueByPath(Object refObj, String path) {
    if (refObj instanceof Datatype) {
      for (SingleElementValue sev : ((Datatype) refObj).getSingleElementValues()) {
        if (sev.getLocation().equals(path))
          return sev;
      }
    } else if (refObj instanceof Segment) {
      for (SingleElementValue sev : ((Segment) refObj).getSingleElementValues()) {
        if (sev.getLocation().equals(path))
          return sev;
      }
    } else if (refObj instanceof Message) {
      for (SingleElementValue sev : ((Message) refObj).getSingleElementValues()) {
        if (sev.getLocation().equals(path))
          return sev;
      }
    }
    return null;
  }


  private List<Comment> findOldCommentByPath(Object refObj, String path) {
    List<Comment> result = new ArrayList<Comment>();
    if (refObj instanceof Datatype) {
      for (Comment c : ((Datatype) refObj).getComments()) {
        if (c.getLocation().equals(path)) {
          result.add(c);
        }
      }
    } else if (refObj instanceof Segment) {
      for (Comment c : ((Segment) refObj).getComments()) {
        if (c.getLocation().equals(path)) {
          result.add(c);
        }
      }
    } else if (refObj instanceof Message) {
      for (Comment c : ((Message) refObj).getComments()) {
        if (c.getLocation().equals(path)) {
          result.add(c);
        }
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
