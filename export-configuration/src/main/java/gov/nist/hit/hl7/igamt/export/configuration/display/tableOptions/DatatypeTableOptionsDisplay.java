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
import gov.nist.hit.hl7.igamt.export.configuration.domain.MetadataConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.NameAndPositionAndPresence;
import gov.nist.hit.hl7.igamt.export.configuration.domain.UsageConfiguration;

/**
 *
 * @author Maxence Lefort on Jun 5, 2018.
 */
public class DatatypeTableOptionsDisplay implements TableOptionsDisplay {

  private boolean includeDatatypeTable = true;
  private UsageConfiguration datatypesExport;
  private UsageConfiguration componentExport;
  private List<NameAndPositionAndPresence> columns;
  private MetadataConfiguration metadataConfig;

  public DatatypeTableOptionsDisplay(ExportConfiguration exportConfiguration) {
    this.includeDatatypeTable = exportConfiguration.isIncludeDatatypeTable();
    this.datatypesExport = exportConfiguration.getDatatypesExport();
    this.componentExport = exportConfiguration.getComponentExport();
    this.columns = exportConfiguration.getDatatypeColumn().getColumns();
    this.metadataConfig = exportConfiguration.getDatatypeMetadataConfig();
  }

  /**
   * @param findExportConfigurationServiceByAuthentication
   * @return
   */
  @Override
  public ExportConfiguration populateExportConfiguration(ExportConfiguration exportConfiguration) {
    exportConfiguration.setIncludeDatatypeTable(this.includeDatatypeTable);
    exportConfiguration.setDatatypesExport(this.datatypesExport);
    exportConfiguration.setComponentExport(this.componentExport);
    exportConfiguration.setDatatypeColumn(new ColumnsConfiguration(this.columns));
    exportConfiguration.setDatatypeMetadataConfig(this.metadataConfig);
    return exportConfiguration;
  }

  public DatatypeTableOptionsDisplay(boolean includeDatatypeTable,
      UsageConfiguration datatypesExport, UsageConfiguration componentExport, List<NameAndPositionAndPresence> columns,
      MetadataConfiguration metadataConfig) {
    super();
    this.includeDatatypeTable = includeDatatypeTable;
    this.datatypesExport = datatypesExport;
    this.componentExport = componentExport;
    this.columns = columns;
    this.metadataConfig = metadataConfig;
  }

  public DatatypeTableOptionsDisplay() {
    super();
  }

  public boolean isIncludeDatatypeTable() {
    return includeDatatypeTable;
  }

  public void setIncludeDatatypeTable(boolean includeDatatypeTable) {
    this.includeDatatypeTable = includeDatatypeTable;
  }

  public UsageConfiguration getDatatypesExport() {
    return datatypesExport;
  }

  public void setDatatypesExport(UsageConfiguration datatypesExport) {
    this.datatypesExport = datatypesExport;
  }

  public List<NameAndPositionAndPresence> getColumns() {
    return columns;
  }

  public void setColumns(List<NameAndPositionAndPresence> columns) {
    this.columns = columns;
  }

  public MetadataConfiguration getMetadataConfig() {
    return metadataConfig;
  }

  public void setMetadataConfig(MetadataConfiguration metadataConfig) {
    this.metadataConfig = metadataConfig;
  }

  public UsageConfiguration getComponentExport() {
    return componentExport;
  }

  public void setComponentExport(UsageConfiguration componentExport) {
    this.componentExport = componentExport;
  }

}
