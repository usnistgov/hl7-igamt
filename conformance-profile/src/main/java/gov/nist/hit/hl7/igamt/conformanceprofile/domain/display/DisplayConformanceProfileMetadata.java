package gov.nist.hit.hl7.igamt.conformanceprofile.domain.display;

import gov.nist.hit.hl7.igamt.shared.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.shared.domain.DomainInfo;

public class DisplayConformanceProfileMetadata {
  private CompositeKey id;
  private DomainInfo domainInfo;
  private String name;
  private String identifier;
  private String description;
  private String messageType;
  private String structId;
  private String authorNotes;
  private String usageNote;

  public DisplayConformanceProfileMetadata() {
    super();
  }

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

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
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

  public String getAuthorNotes() {
    return authorNotes;
  }

  public void setAuthorNotes(String authorNotes) {
    this.authorNotes = authorNotes;
  }

  public String getUsageNote() {
    return usageNote;
  }

  public void setUsageNote(String usageNote) {
    this.usageNote = usageNote;
  }


}
