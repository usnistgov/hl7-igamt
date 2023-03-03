package gov.nist.hit.hl7.igamt.segment.domain;

import java.util.HashSet;
import java.util.Set;

import org.springframework.data.mongodb.core.mapping.Document;
import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
import gov.nist.hit.hl7.igamt.common.slicing.domain.Slicing;


@Document(collection = "segment")
public class Segment extends Resource {
  private static final long serialVersionUID = -6670148730722042931L;
private String ext;
  private DynamicMappingInfo dynamicMappingInfo;
  private ResourceBinding binding;
  private boolean custom;
  private Set<Field> children;
  private Set<Slicing> slicings;

  public Segment() {
    super();
    super.setType(Type.SEGMENT);
  }

  public boolean isCustom() {
    return custom;
  }

  public void setCustom(boolean custom) {
    this.custom = custom;
  }

  public ResourceBinding getBinding() {
    if (binding == null) {
      binding = new ResourceBinding();
      binding.setElementId(this.getId());
    }
    return binding;
  }

  public void setBinding(ResourceBinding binding) {
    this.binding = binding;
  }

  public Set<Field> getChildren() {
    if (children == null) {
      children = new HashSet<Field>();
    }
    return children;
  }

  public void setChildren(Set<Field> children) {
    this.children = children;
  }

  public String getExt() {
    return ext;
  }

  public void setExt(String ext) {
    this.ext = ext;
  }

  public DynamicMappingInfo getDynamicMappingInfo() {
    if (dynamicMappingInfo == null) {
      dynamicMappingInfo = new DynamicMappingInfo();
    }
    return dynamicMappingInfo;
  }

  public void setDynamicMappingInfo(DynamicMappingInfo dynamicMappingInfo) {
    this.dynamicMappingInfo = dynamicMappingInfo;
  }
  
  @Override
  public String getLabel() {
    String entireExt = this.getEntireExtension();
    if (entireExt != null && !entireExt.isEmpty()) {
      return  this.getName() + "_" + this.getEntireExtension();
    }
    return this.getName();
  }

  public String getEntireExtension() {
    if(this.getFixedExtension() !=null && !this.getFixedExtension().isEmpty()) {
     String fixed = "#"+this.getFixedExtension();
     if(this.getDomainInfo().getScope().equals(Scope.USERCUSTOM)) {
       return fixed;
     }else if(this.getExt() != null) {
       return fixed+'_'+ this.getExt();
     }     
    }
    return this.getExt();
  }
  
  @Override
  public Segment clone() {
    Segment clone = new Segment();
    complete(clone);
    return clone;
  }

 public void complete(Segment elm) {
	 super.complete(elm);
	 elm.ext = ext;
	 elm.dynamicMappingInfo = dynamicMappingInfo;
	 elm.binding = binding;
	 elm.children = children;
	 elm.custom = custom;
	 elm.slicings = slicings;
 }

public Set<Slicing> getSlicings() {
  return slicings;
}

public void setSlicings(Set<Slicing> slicings) {
  this.slicings = slicings;
};
  
}
