package gov.nist.hit.hl7.igamt.conformanceprofile.domain.display;

import java.util.HashMap;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.common.base.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.MsgStructElement;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;

public class ConformanceProfileStructure {
  private CompositeKey id;
  private DomainInfo domainInfo;
  private String name;
  private String identifier;
  private String messageType;
  private String structId;
  private ResourceBinding binding;
  private Set<MsgStructElement> children;
  private HashMap<String,Segment> segments = new HashMap<String,Segment>();
  private HashMap<String,Datatype> datatypes = new HashMap<String,Datatype>();
  private HashMap<String,Valueset> valuesets = new HashMap<String,Valueset>();

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

  public Set<MsgStructElement> getChildren() {
    return children;
  }

  public void setChildren(Set<MsgStructElement> children) {
    this.children = children;
  }

  public HashMap<String,Segment> getSegments() {
    return segments;
  }

  public void setSegments(HashMap<String,Segment> segments) {
    this.segments = segments;
  }

  public HashMap<String,Datatype> getDatatypes() {
    return datatypes;
  }

  public void setDatatypes(HashMap<String,Datatype> datatypes) {
    this.datatypes = datatypes;
  }

  public HashMap<String,Valueset> getValuesets() {
    return valuesets;
  }

  public void setValuesets(HashMap<String,Valueset> valuesets) {
    this.valuesets = valuesets;
  }
}
