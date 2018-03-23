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
package gov.nist.hit.hl7.igamt.export.configuration;

/**
 *
 * @author Maxence Lefort on Mar 13, 2018.
 */
public class CodeUsageConfiguration {

  private boolean r;
  private boolean p;
  private boolean e;


  public CodeUsageConfiguration() {
    super();
  }

  public CodeUsageConfiguration(boolean r, boolean p, boolean e) {
    super();
    this.r = r;
    this.p = p;
    this.e = e;
  }

  public boolean isR() {
    return r;
  }

  public void setR(boolean r) {
    this.r = r;
  }

  public boolean isP() {
    return p;
  }

  public void setP(boolean p) {
    this.p = p;
  }

  public boolean isE() {
    return e;
  }

  public void setE(boolean e) {
    this.e = e;
  }

}
