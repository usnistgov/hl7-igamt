package gov.nist.hit.hl7.igamt.datatype.domain.display;

import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.Scope;

public class DisplayMetadata {

  private String id;
  private Scope scope;
  private String version;
  private String name;
  private String ext;
  private String description;
  private String authorNote;
  private Set<String> compatibilityVersions;

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public Scope getScope() {
    return scope;
  }

  public void setScope(Scope scope) {
    this.scope = scope;
  }

  public String getVersion() {
    return version;
  }

  public void setVersion(String version) {
    this.version = version;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getExt() {
    return ext;
  }

  public void setExt(String ext) {
    this.ext = ext;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getAuthorNote() {
    return authorNote;
  }

  public void setAuthorNote(String authorNote) {
    this.authorNote = authorNote;
  }

  public Set<String> getCompatibilityVersions() {
    return compatibilityVersions;
  }

  public void setCompatibilityVersions(Set<String> compatibilityVersions) {
    this.compatibilityVersions = compatibilityVersions;
  }


}
