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
package gov.nist.hit.hl7.igamt.conformanceprofile.domain.display;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;

/**
 * @author jungyubw
 *
 */
public class ConformanceProfileDisplayModel extends ConformanceProfile{

  private String idPath;
  private Type type;
  public ConformanceProfileDisplayModel() {
    super();
    this.type = Type.COMPOSITEPROFILE;
  }
  
  public ConformanceProfileDisplayModel(ConformanceProfile conformanceProfile) {
    super();
    this.type = Type.COMPOSITEPROFILE;
    this.idPath = conformanceProfile.getId();
    this.setCreatedFrom(conformanceProfile.getCreatedFrom());
    this.setCreationDate(conformanceProfile.getCreationDate());
    this.setDescription(conformanceProfile.getDescription());
    this.setDomainInfo(conformanceProfile.getDomainInfo());
    this.setEvent(conformanceProfile.getEvent());
    this.setFrom(conformanceProfile.getFrom());
    this.setId(conformanceProfile.getId());
    this.setIdentifier(conformanceProfile.getIdentifier());
    this.setMessageType(conformanceProfile.getMessageType());
    this.setName(conformanceProfile.getName());
    this.setPostDef(conformanceProfile.getPostDef());
    this.setPreDef(conformanceProfile.getPreDef());
    this.setPublicationInfo(conformanceProfile.getPublicationInfo());
    this.setStructID(conformanceProfile.getStructID());
    this.setUpdateDate(conformanceProfile.getUpdateDate());
    this.setVersion(conformanceProfile.getVersion());
  }

  public String getIdPath() {
    return idPath;
  }

  public void setIdPath(String idPath) {
    this.idPath = idPath;
  }

  public Type getType() {
    return type;
  }

  public void setType(Type type) {
    this.type = type;
  }
  
  
}
