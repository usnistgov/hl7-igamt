package gov.nist.hit.hl7.igamt.common.base.domain;

import java.io.Serializable;
import java.util.Map;
import java.util.Set;

import gov.nist.diff.annotation.DeltaField;
import gov.nist.diff.annotation.DeltaIdentity;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.ChangeReason;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;

public class StructureElement implements Serializable {

  public Set<Comment> getComments() {
    return comments;
  }

  public void setComments(Set<Comment> comments) {
    this.comments = comments;
  }

  private String id;
  @DeltaField
  private String name;
  @DeltaIdentity
  private int position;
  @DeltaField
  private Usage usage;
  @DeltaField
  private Usage oldUsage;
  @DeltaField
  private Type type;
  @DeltaField
  private String text;
  private Map<PropertyType, ChangeReason> changeLog;

  @DeltaField
  private Set<Comment> comments;

  private boolean custom = false;

  public StructureElement() {
    super();
  }

  public StructureElement(String id, String name, int position, Usage usage, Type type, String text,
      boolean custom, Set<Comment> comments) {
    super();
    this.id = id;
    this.name = name;
    this.position = position;
    this.usage = usage;
    this.type = type;
    this.text = text;
    this.custom = custom;
    this.comments = comments;
  }

  public Map<PropertyType, ChangeReason> getChangeLog() {
    return changeLog;
  }

  public void setChangeLog(Map<PropertyType, ChangeReason> changeLog) {
    this.changeLog = changeLog;
  }

  public int getPosition() {
    return position;
  }

  public void setPosition(int position) {
    this.position = position;
  }

  public Usage getUsage() {
    return usage;
  }

  public void setUsage(Usage usage) {
    this.usage = usage;
  }

  public String getText() {
    return text;
  }

  public void setText(String text) {
    this.text = text;
  }

  public boolean isCustom() {
    return custom;
  }

  public void setCustom(boolean custom) {
    this.custom = custom;
  }

  public Type getType() {
    return type;
  }

  public void setType(Type type) {
    this.type = type;
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }
  
  public String getName() {
    return name;
  }
  
  public void setName(String name) {
    this.name = name;
  }
  
  public Usage getOldUsage() {
    return oldUsage;
  }

  public void setOldUsage(Usage oldUsage) {
    this.oldUsage = oldUsage;
  }
}
