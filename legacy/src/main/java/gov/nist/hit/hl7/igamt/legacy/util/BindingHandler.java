package gov.nist.hit.hl7.igamt.legacy.util;

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
import gov.nist.hit.hl7.igamt.legacy.repository.DatatypeRepository;
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
      return rb;
    }
    return null;
  }

  private StructureElementBinding constructResourceBindingForComponent(
      gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Datatype oldDatatype, String path, Component c) {
    
    StructureElementBinding seb = new StructureElementBinding();
    seb.setElementId(c.getId());
    Datatype childDatatype = datatypeRepository.findOne(c.getDatatype().getId());
    
    List<Comment> oldComments = oldDatatype.getComments();
    Comment oldComment = this.findOldCommentByPath(oldComments, path);
    if(oldComment != null) {
      gov.nist.hit.hl7.igamt.shared.domain.binding.Comment newComment = new gov.nist.hit.hl7.igamt.shared.domain.binding.Comment();  
      newComment.setDateupdated(oldComment.getLastUpdatedDate());
      newComment.setDescription(oldComment.getDescription());
      //TODO need to change username
      newComment.setUsername(oldComment.getAuthorId() + "");
      seb.addComment(newComment);
    }
    
    List<SingleElementValue> oldSingleElementValues = oldDatatype.getSingleElementValues();
    SingleElementValue oldSingleElementValue = this.findOldSingleElementValueByPath(oldSingleElementValues, path);
    if(oldSingleElementValue != null) {
      seb.setConstantValue(oldSingleElementValue.getValue());
    }
    
    List<ValueSetOrSingleCodeBinding> oldValueSetOrSingleCodeBindings = oldDatatype.getValueSetBindings();
    ValueSetOrSingleCodeBinding oldValueSetOrSingleCodeBinding = this.findValueSetOrSingleCodeBindingByPath(oldValueSetOrSingleCodeBindings, path);
    if(oldValueSetOrSingleCodeBinding != null) {
      if(oldValueSetOrSingleCodeBinding instanceof ValueSetBinding) {
        ValueSetBinding oldValueSetBinding = (ValueSetBinding)oldValueSetOrSingleCodeBinding;
        gov.nist.hit.hl7.igamt.shared.domain.binding.ValuesetBinding newValuesetBinding  = new gov.nist.hit.hl7.igamt.shared.domain.binding.ValuesetBinding();
        newValuesetBinding.setStrength(this.mapValueSetStrength(oldValueSetBinding.getBindingStrength()));
        newValuesetBinding.setValuesetId(oldValueSetBinding.getTableId());
        if (childDatatype.getComponents() != null && childDatatype.getComponents().size() > 0 && this.isValueSetComplexDatatype(childDatatype)) {
          if(oldValueSetBinding.getBindingLocation() == null) {
            newValuesetBinding.addValuesetLocation(this.findComponentByPosition(childDatatype.getComponents(), 1).getId());
          }else if(oldValueSetBinding.getBindingLocation().equals("1")) {
            newValuesetBinding.addValuesetLocation(this.findComponentByPosition(childDatatype.getComponents(), 1).getId());
          }else if(oldValueSetBinding.getBindingLocation().equals("2")) {
            newValuesetBinding.addValuesetLocation(this.findComponentByPosition(childDatatype.getComponents(), 2).getId());
          }else if(oldValueSetBinding.getBindingLocation().equals("3")) {
            newValuesetBinding.addValuesetLocation(this.findComponentByPosition(childDatatype.getComponents(), 3).getId());
          }else if(oldValueSetBinding.getBindingLocation().equals("4")) {
            newValuesetBinding.addValuesetLocation(this.findComponentByPosition(childDatatype.getComponents(), 4).getId());
          }else if(oldValueSetBinding.getBindingLocation().equals("1 or 4")) {
            newValuesetBinding.addValuesetLocation(this.findComponentByPosition(childDatatype.getComponents(), 1).getId());
            newValuesetBinding.addValuesetLocation(this.findComponentByPosition(childDatatype.getComponents(), 4).getId());
          }else if(oldValueSetBinding.getBindingLocation().equals("1 or 4 or 10")) {
            newValuesetBinding.addValuesetLocation(this.findComponentByPosition(childDatatype.getComponents(), 1).getId());
            newValuesetBinding.addValuesetLocation(this.findComponentByPosition(childDatatype.getComponents(), 4).getId());
            newValuesetBinding.addValuesetLocation(this.findComponentByPosition(childDatatype.getComponents(), 10).getId());
          }
        }
        seb.addValuesetBinding(newValuesetBinding);
      }else if(oldValueSetOrSingleCodeBinding instanceof SingleCodeBinding) {
        SingleCodeBinding oldSingleCodeBinding = (SingleCodeBinding)oldValueSetOrSingleCodeBinding;
        Code oldCode = oldSingleCodeBinding.getCode();
        ExternalSingleCode externalSingleCode = new ExternalSingleCode();
        externalSingleCode.setCodeSystem(oldCode.getCodeSystem());
        externalSingleCode.setValue(oldCode.getValue());
        seb.setExternalSingleCode(externalSingleCode);
      }
    }
    
    if (childDatatype.getComponents() != null && childDatatype.getComponents().size() > 0) {
      for (Component childC : childDatatype.getComponents()) {
        String childPath = path + "." + childC.getPosition();
        
        seb.addChild(constructResourceBindingForComponent(oldDatatype, childPath, childC));
      }
    }
    
    return seb;
  }

  private Component findComponentByPosition(List<Component> components, int i) {
    for(Component c:components) {
      if(c.getPosition() == i) return c;
    }
    return null;
  }

  private boolean isValueSetComplexDatatype(Datatype childDatatype) {
    if(Arrays.asList(new String[] {"CE", "CF", "CWE", "CNE", "CSU", "HD"}).contains(childDatatype.getName())) return true;
    return false;
  }

  private ValuesetStrength mapValueSetStrength(ValueSetBindingStrength bindingStrength) {
    if(bindingStrength.equals(ValueSetBindingStrength.R)) {
      return ValuesetStrength.R;
    }else if(bindingStrength.equals(ValueSetBindingStrength.S)) {
      return ValuesetStrength.S;
    }else if(bindingStrength.equals(ValueSetBindingStrength.U)) {
      return ValuesetStrength.U;
    }
    return null;
  }

  private ValueSetOrSingleCodeBinding findValueSetOrSingleCodeBindingByPath(
      List<ValueSetOrSingleCodeBinding> oldValueSetOrSingleCodeBindings, String path) {
    for(ValueSetOrSingleCodeBinding binding: oldValueSetOrSingleCodeBindings) {
      if(binding.getLocation().equals(path)) return binding;
    }
    return null;
  }

  private SingleElementValue findOldSingleElementValueByPath(
      List<SingleElementValue> oldSingleElementValues, String path) {
    for(SingleElementValue sev:oldSingleElementValues) {
      if(sev.getLocation().equals(path)) return sev;
    }
    return null;
  }

  private Comment findOldCommentByPath(List<Comment> oldComments, String path) {
    for(Comment c:oldComments) {
      if(c.getLocation().equals(path)) return c;
    }
    return null;
  }

  public DatatypeRepository getDatatypeRepository() {
    return datatypeRepository;
  }

  public void setDatatypeRepository(DatatypeRepository datatypeRepository) {
    this.datatypeRepository = datatypeRepository;
  }
}
