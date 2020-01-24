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
package gov.nist.hit.hl7.igamt.export.configuration.domain;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.Usage;

/**
 *
 * @author Maxence Lefort on Mar 13, 2018.
 */
public class UsageConfiguration {

  private boolean r = true;
  private boolean re = true;
  private boolean c = false;
  private boolean x = false;
  private boolean o = false;
  private boolean cab = true;

  public UsageConfiguration() {
    super();
  }

  public UsageConfiguration(boolean r, boolean re, boolean c, boolean x, boolean o, boolean cab) {
    super();
    this.r = r;
    this.re = re;
    this.c = c;
    this.x = x;
    this.o = o;
    this.cab=cab;
  }

  public boolean isR() {
    return r;
  }

  public void setR(boolean r) {
    this.r = r;
  }

  public boolean isRe() {
    return re;
  }

  public void setRe(boolean re) {
    this.re = re;
  }

  public boolean isC() {
    return c;
  }

  public void setC(boolean c) {
    this.c = c;
  }

  public boolean isX() {
    return x;
  }

  public void setX(boolean x) {
    this.x = x;
  }

  public boolean isO() {
    return o;
  }

  public void setO(boolean o) {
    this.o = o;
  }

  public boolean isBinded(Usage usage) {
    switch (usage) {
      case R:
        return this.isR();
      case RE:
        return this.isRe();
      case C:
        return this.isC();
      case X:
        return this.isX();
      case O:
        return this.isO();
      default:
        return false;
    }
  }
  public List<Usage> getUsagesToInclude() {
	  List<Usage> usages = new ArrayList<Usage>();
	  if (this.isR()) {
		  usages.add(Usage.R);
	  }
	  if (this.isC()) {
		  usages.add(Usage.C);
	  }
	  if (this.isRe()) {
		  usages.add(Usage.RE);
	  }
	  if (this.isX()) {
		  usages.add(Usage.X);
	  }
	  if (this.isO()) {
		  usages.add(Usage.O);
	  }
	return usages;
  }

public boolean isCab() {
	return cab;
}

public void setCab(boolean cab) {
	this.cab = cab;
}

}
