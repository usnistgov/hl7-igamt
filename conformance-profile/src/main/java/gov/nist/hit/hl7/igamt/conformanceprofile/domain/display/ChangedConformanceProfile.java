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
package gov.nist.hit.hl7.igamt.conformanceprofile.domain.display;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import gov.nist.hit.hl7.igamt.datatype.domain.display.DisplayMetadata;
import gov.nist.hit.hl7.igamt.datatype.domain.display.PostDef;
import gov.nist.hit.hl7.igamt.datatype.domain.display.PreDef;

/**
 *
 * @author Maxence Lefort on May 4, 2018.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class ChangedConformanceProfile {

  private String id;
  private DisplayMetadata metadata;
  private PostDef postDef;
  private PreDef preDef;
  private ConformanceProfileStructure structure;

  public ChangedConformanceProfile() {}

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public DisplayMetadata getMetadata() {
    return metadata;
  }

  public void setMetadata(DisplayMetadata metadata) {
    this.metadata = metadata;
  }

  public PostDef getPostDef() {
    return postDef;
  }

  public void setPostDef(PostDef postDef) {
    this.postDef = postDef;
  }

  public PreDef getPreDef() {
    return preDef;
  }

  public void setPreDef(PreDef preDef) {
    this.preDef = preDef;
  }

  public ConformanceProfileStructure getStructure() {
    return structure;
  }

  public void setStructure(ConformanceProfileStructure structure) {
    this.structure = structure;
  }


}
