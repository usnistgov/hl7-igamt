package gov.nist.hit.hl7.igamt.conformanceprofile.domain.display;

import java.util.TreeSet;

import gov.nist.hit.hl7.igamt.common.base.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.common.base.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;



public class ConformanceProfileStructure {
  private CompositeKey id;
  private DomainInfo domainInfo;
  private String name;
  private String identifier;
  private String messageType;
  private String structId;
  private ResourceBinding binding;

  private TreeSet<MsgStructElementDisplay> structure;

  public CompositeKey getId() {
    return id;
  }

  public void setId(CompositeKey id) {
    this.id = id;
  }

  public TreeSet<MsgStructElementDisplay> getStructure() {
    return structure;
  }

  public void setStructure(TreeSet<MsgStructElementDisplay> structure) {
    this.structure = structure;
  }

  public void addStructure(MsgStructElementDisplay msgStructElementDisplay) {
    if (this.structure == null)
      this.structure =
          new TreeSet<MsgStructElementDisplay>(new PositionCompForMsgStructElementDisplay());
    this.structure.add(msgStructElementDisplay);
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
}
