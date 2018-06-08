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
package gov.nist.hit.hl7.igamt.export.configuration.display.tableOptions;

import java.util.List;

import gov.nist.hit.hl7.igamt.export.configuration.domain.ColumnsConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.NameAndPositionAndPresence;
import gov.nist.hit.hl7.igamt.export.configuration.domain.UsageConfiguration;

/**
 *
 * @author Maxence Lefort on Jun 5, 2018.
 */
public class ProfileComponentTableOptionsDisplay implements TableOptionsDisplay {

  private UsageConfiguration profileComponentItemsExport;
  private List<NameAndPositionAndPresence> columns;

  public ProfileComponentTableOptionsDisplay(ExportConfiguration exportConfiguration) {
    this.profileComponentItemsExport = exportConfiguration.getProfileComponentItemsExport();
    this.columns = exportConfiguration.getProfileComponentColumn().getColumns();
  }

  /**
   * @param findExportConfigurationServiceByAuthentication
   * @return
   */
  @Override
  public ExportConfiguration populateExportConfiguration(ExportConfiguration exportConfiguration) {
    exportConfiguration.setProfileComponentItemsExport(this.profileComponentItemsExport);
    exportConfiguration.setProfileComponentColumn(new ColumnsConfiguration(this.columns));
    return exportConfiguration;
  }

  public ProfileComponentTableOptionsDisplay(UsageConfiguration profileComponentItemsExport,
      List<NameAndPositionAndPresence> columns) {
    super();
    this.profileComponentItemsExport = profileComponentItemsExport;
    this.columns = columns;
  }

  public ProfileComponentTableOptionsDisplay() {
    super();
  }

  public UsageConfiguration getProfileComponentItemsExport() {
    return profileComponentItemsExport;
  }

  public void setProfileComponentItemsExport(UsageConfiguration profileComponentItemsExport) {
    this.profileComponentItemsExport = profileComponentItemsExport;
  }

  public List<NameAndPositionAndPresence> getColumns() {
    return columns;
  }

  public void setColumns(List<NameAndPositionAndPresence> columns) {
    this.columns = columns;
  }

}
