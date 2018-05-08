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
package gov.nist.hit.hl7.igamt.segment.domain.display;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 *
 * @author Maxence Lefort on May 4, 2018.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class ChangedSegment {

  private String id;
  private SegmentMetadata metadata;
  private SegmentPostDef postDef;
  private SegmentPreDef preDef;
  private SegmentStructure structure;
  
  public ChangedSegment() {
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public SegmentMetadata getMetadata() {
    return metadata;
  }

  public void setMetadata(SegmentMetadata metadata) {
    this.metadata = metadata;
  }

  public SegmentPostDef getPostDef() {
    return postDef;
  }

  public void setPostDef(SegmentPostDef postDef) {
    this.postDef = postDef;
  }

  public SegmentPreDef getPreDef() {
    return preDef;
  }

  public void setPreDef(SegmentPreDef preDef) {
    this.preDef = preDef;
  }

  public SegmentStructure getStructure() {
    return structure;
  }

  public void setStructure(SegmentStructure structure) {
    this.structure = structure;
  }

}
