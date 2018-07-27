package gov.nist.hit.hl7.igamt.segment.domain;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import org.springframework.data.mongodb.core.mapping.Document;

import gov.nist.hit.hl7.igamt.common.base.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
import gov.nist.hit.hl7.igamt.segment.domain.display.FieldDisplay;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentStructure;


@Document(collection = "segment")

public class Segment extends Resource {
  private String ext;
  private DynamicMappingInfo dynamicMappingInfo;
  private ResourceBinding binding;

  private Set<Field> children;

  public Segment() {
    super();
  }

  public ResourceBinding getBinding() {
    if (binding == null) {
      binding = new ResourceBinding();
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

  /*
   * (non-Javadoc)
   * 
   * @see gov.nist.hit.hl7.igamt.shared.domain.AbstractDomain#getLabel()
   */
  @Override
  public String getLabel() {
    if (this.ext != null && !this.ext.isEmpty()) {
      return this.getName() + "_" + this.ext;
    }
    return this.getName();
  }


  @Override
  public Segment clone() {

    Segment clone = new Segment();
    clone.setBinding(this.binding);
    clone.setChildren(children);
    clone.setComment(this.getComment());
    clone.setCreatedFrom(this.getId().getId());
    clone.setDescription(this.getDescription());
    DomainInfo domainInfo = this.getDomainInfo();
    domainInfo.setScope(Scope.USER);
    clone.setDynamicMappingInfo(dynamicMappingInfo);
    clone.setId(null);
    clone.setPostDef(this.getPostDef());
    clone.setPreDef(this.getPreDef());
    clone.setName(this.getName());
    clone.setDomainInfo(domainInfo);
    clone.setCreationDate(new Date());
    clone.setUpdateDate(new Date());
    return clone;

  };

  public SegmentStructure toStructure() {
    SegmentStructure result = new SegmentStructure();
    result.setId(this.getId());
    result.setScope(this.getDomainInfo().getScope());
    result.setVersion(this.getDomainInfo().getVersion());
    result.setName(this.getName());
    if (this.getExt() != null) {
      result.setLabel(this.getName() + "_" + this.getExt());
    } else {
      result.setLabel(this.getName());
    }

    result.setBinding(this.getBinding());

    if (this.getChildren() != null && this.getChildren().size() > 0) {
      for (Field f : this.getChildren()) {
        FieldDisplay fieldDisplay = new FieldDisplay();
        fieldDisplay.setData(f);
        result.addChild(fieldDisplay);
      }
    }
    return result;
  }


}
