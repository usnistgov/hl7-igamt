/**
 * This software was developed at the National Institute of Standards and Technology by employees of
 * the Federal Government in the course of their official duties. Pursuant to title 17 Section 105
 * of the United States Code this software is not subject to copyright protection and is in the
 * public domain. This is an experimental system. NIST assumes no responsibility whatsoever for its
 * use by other parties, and makes no guarantees, expressed or implied, about its quality,
 * reliability, or any other characteristic. We would appreciate acknowledgement if the software is
 * used. This software can be redistributed and/or modified freely provided that any derivative
 * works bear some notice that they are derived from it, and any modified versions bear some notice
 * that they have been modified.
 */
package gov.nist.hit.hl7.igamt.valueset.domain.display;

import java.net.URL;

import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.valueset.domain.property.Constant.SourceType;

/**
 * @author jungyubw
 *
 */
public class ValuesetMetadata {

  private String id;
  private Scope scope;
  private String version;
  private String bindingIdentifier;
  private String name;
  private String oid;
  private SourceType type;
  private URL url;
  private String authorNotes;

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getBindingIdentifier() {
    return bindingIdentifier;
  }

  public void setBindingIdentifier(String bindingIdentifier) {
    this.bindingIdentifier = bindingIdentifier;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getOid() {
    return oid;
  }

  public void setOid(String oid) {
    this.oid = oid;
  }

  public String getAuthorNotes() {
    return authorNotes;
  }

  public void setAuthorNotes(String authorNotes) {
    this.authorNotes = authorNotes;
  }

  public URL getUrl() {
    return url;
  }

  public void setUrl(URL url) {
    this.url = url;
  }

  public SourceType getType() {
    return type;
  }

  public void setType(SourceType type) {
    this.type = type;
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


}
