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
package gov.nist.hit.hl7.igamt.datatypeLibrary.util;

import java.util.HashMap;

/**
 * @author ena3
 *
 */
public class DeltaRowData {


  private int position;

  private HashMap<EvolutionPropertie, DeltaCell> data =
      new HashMap<EvolutionPropertie, DeltaCell>();

  public HashMap<EvolutionPropertie, DeltaCell> getData() {
    return data;
  }

  public void setData(HashMap<EvolutionPropertie, DeltaCell> data) {
    this.data = data;
  }

  public int getPosition() {
    return position;
  }

  public void setPosition(int position) {
    this.position = position;
  }

  public void addCell(EvolutionPropertie prop, DeltaCell cell) {
    this.data.put(prop, cell);
  }

}
