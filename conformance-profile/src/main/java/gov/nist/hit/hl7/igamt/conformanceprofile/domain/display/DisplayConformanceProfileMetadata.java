package gov.nist.hit.hl7.igamt.conformanceprofile.domain.display;

import gov.nist.hit.hl7.igamt.common.base.model.DisplayMetadata;
import gov.nist.hit.hl7.igamt.common.base.model.SectionType;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;

public class DisplayConformanceProfileMetadata extends DisplayMetadata{
  private String name;
  private String identifier;
  private String messageType;
  private String structId;
  private String event;


  public DisplayConformanceProfileMetadata() {
    super();
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
	public void complete(ConformanceProfile obj, SectionType type, boolean readOnly) {
		super.complete(this, obj, type, readOnly);
	
		this.identifier=obj.getIdentifier();
		this.messageType= obj.getMessageType();
		this.structId=obj.getStructID();
		this.setEvent(obj.getEvent());
		this.name=obj.getName();
	}

	public String getEvent() {
		return event;
	}

	public void setEvent(String event) {
		this.event = event;
	}



}
