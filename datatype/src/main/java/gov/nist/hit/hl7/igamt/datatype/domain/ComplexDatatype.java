/**
 * 
 * This software was developed at the National Institute of Standards and Technology by employees of
 * the Federal Government in the course of their official duties. Pursuant to title 17 Section 105
 * of the United States Code this software is not subject to copyright protection and is in the
 * public domain. This is an experimental system. NIST assumes no responsibility whatsoever for its
 * use by other parties, and makes no guarantees, expressed or implied, about its quality,
 * reliability, or any other characteristic. We would appreciate acknowledgement if the software is
 * used. This software can be redistributed and/or modified freely provided that any derivative
 * works bear some notice that they are derived from it, and any modified versions bear some notice
 * that they have been modified.
 * 
 */
package gov.nist.hit.hl7.igamt.datatype.domain;

import java.util.Set;

import gov.nist.hit.hl7.igamt.shared.domain.Component;
import gov.nist.hit.hl7.igamt.shared.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.shared.domain.PublicationInfo;

/**
 *
 * @author Maxence Lefort on Feb 21, 2018.
 */
public class ComplexDatatype extends Datatype {

  private Set<Component> components;

  public ComplexDatatype() {
    super();
  }

  public ComplexDatatype(String id, String version, PublicationInfo publicationInfo,
      DomainInfo domainInfo, String userName, String comment, String description, String preDef,
      String postDef, String ext, String purposeAndUse, Set<Component> components) {
    super(id, version, publicationInfo, domainInfo, userName, comment, description, preDef, postDef,
        ext, purposeAndUse);
    this.components = components;
  }

  public Set<Component> getComponents() {
    return components;
  }

  public void setComponents(Set<Component> components) {
    this.components = components;
  }

}
