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

/**
 * @author jungyubw
 *
 */
public class DisplayCodeSystem {
  private String codeSysRef;
  private String identifier;
  private String description;
  private URL url;
  private CodeSystemType codeSystemType;
  
  public String getCodeSysRef() {
    return codeSysRef;
  }
  public void setCodeSysRef(String codeSysRef) {
    this.codeSysRef = codeSysRef;
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
  public URL getUrl() {
    return url;
  }
  public void setUrl(URL url) {
    this.url = url;
  }
  public CodeSystemType getCodeSystemType() {
    return codeSystemType;
  }
  public void setCodeSystemType(CodeSystemType codeSystemType) {
    this.codeSystemType = codeSystemType;
  }
}
