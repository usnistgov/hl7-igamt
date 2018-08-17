package gov.nist.hit.hl7.igamt.conformanceprofile.domain.display;

import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.common.base.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRefOrGroup;

public class ConformanceProfileStructure {
  private CompositeKey id;
  private DomainInfo domainInfo;
  private String name;
  private String identifier;
  private String messageType;
  private String structId;
  private ResourceBinding binding;
  private Set<SegmentRefOrGroup> children;

  public CompositeKey getId() {
    return id;
  }

  public void setId(CompositeKey id) {
    this.id = id;
  }

  public DomainInfo getDomainInfo() {
    return domainInfo;
  }

  public void setDomainInfo(DomainInfo domainInfo) {
    this.domainInfo = domainInfo;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getIdentifier() {
    return identifier;
  }

  public void setIdentifier(String identifier) {
    this.identifier = identifier;
  }

  public String getMessageType() {
    return messageType;
  }

  public void setMessageType(String messageType) {
    this.messageType = messageType;
  }

  public String getStructId() {
    return structId;
  }

  public void setStructId(String structId) {
    this.structId = structId;
  }

  public ResourceBinding getBinding() {
    return binding;
  }

  public void setBinding(ResourceBinding binding) {
    this.binding = binding;
  }

  public Set<SegmentRefOrGroup> getChildren() {
    return children;
  }

  public void setChildren(Set<SegmentRefOrGroup> children) {
    this.children = children;
  }
}
