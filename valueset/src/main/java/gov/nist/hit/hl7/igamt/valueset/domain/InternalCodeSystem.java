package gov.nist.hit.hl7.igamt.valueset.domain;

import java.net.URL;

public class InternalCodeSystem {
  private String identifier;
  private String description;
  private URL url;


  public InternalCodeSystem() {
    super();
  }

  public InternalCodeSystem(String identifier, String description, URL url) {
    super();
    this.identifier = identifier;
    this.description = description;
    this.url = url;
  }

  public String getIdentifier() {
    return identifier;
  }

  public void setIdentifier(String identifier) {
    this.identifier = identifier;
  }

  public URL getUrl() {
    return url;
  }

  public void setUrl(URL url) {
    this.url = url;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }


}
