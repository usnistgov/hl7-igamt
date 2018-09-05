package gov.nist.hit.hl7.igamt.datatypeLibrary.model;

import java.util.Date;

import gov.nist.hit.hl7.igamt.common.base.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;


public class TreeData {

  private Type type;
  private String label;
  private Date dateUpdated;
  private int position;
  private CompositeKey key;
  private String description;



  public String getLabel() {
    return label;
  }

  public void setLabel(String label) {
    this.label = label;
  }

  public TreeData() {
    super();
    // TODO Auto-generated constructor stub
  }

  public Date getDateUpdated() {
    return dateUpdated;
  }

  public void setDateUpdated(Date dateUpdated) {
    this.dateUpdated = dateUpdated;
  }

  public int getPosition() {
    return position;
  }

  public void setPosition(int position) {
    this.position = position;
  }

  public Type getType() {
    return type;
  }

  public void setType(Type type) {
    this.type = type;
  }

  public CompositeKey getKey() {
    return key;
  }

  public void setKey(CompositeKey key) {
    this.key = key;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }



}
