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
package gov.nist.hit.hl7.igamt.export.configuration.display;

import java.util.List;

import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportFont;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportFontConfiguration;

/**
 *
 * @author Maxence Lefort on Jun 5, 2018.
 */
public class ExportFontConfigurationDisplay {

  private List<ExportFont> exportFonts;
  private ExportFontConfiguration exportFontConfiguration;
  private int maxFontSize = 25;
  
  public ExportFontConfigurationDisplay() {
  }

  public ExportFontConfigurationDisplay(List<ExportFont> exportFonts,
      ExportFontConfiguration exportFontConfiguration) {
    super();
    this.exportFonts = exportFonts;
    this.exportFontConfiguration = exportFontConfiguration;
  }

  public List<ExportFont> getExportFonts() {
    return exportFonts;
  }

  public void setExportFonts(List<ExportFont> exportFonts) {
    this.exportFonts = exportFonts;
  }

  public ExportFontConfiguration getExportFontConfiguration() {
    return exportFontConfiguration;
  }

  public void setExportFontConfiguration(ExportFontConfiguration exportFontConfiguration) {
    this.exportFontConfiguration = exportFontConfiguration;
  }

  public int getMaxFontSize() {
    return maxFontSize;
  }

}
