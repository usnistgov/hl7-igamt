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
package gov.nist.hit.hl7.igamt.ig.domain.datamodel;

import java.io.Serializable;

import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;

/**
 * @author jungyubw
 *
 */
public class ValuesetDataModel implements Serializable, Comparable{

  private Valueset model;

  public Valueset getModel() {
    return model;
  }

  public void setModel(Valueset model) {
    this.model = model;
  }

	@Override
	public int compareTo(Object u) {
		// TODO Auto-generated method stub
		if (getModel().getLabel() == null || ((ValuesetDataModel) u).getModel().getLabel() == null) {
		      return 0;
		    }
		    return getModel().getLabel().compareTo(((ValuesetDataModel) u).getModel().getLabel());
	}


}
