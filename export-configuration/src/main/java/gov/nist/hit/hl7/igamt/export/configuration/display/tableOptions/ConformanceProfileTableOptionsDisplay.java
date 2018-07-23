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
public class ConformanceProfileTableOptionsDisplay implements TableOptionsDisplay{
  private boolean includeMessageTable = true;
  private UsageConfiguration segmentORGroupsMessageExport;
  private List<NameAndPositionAndPresence> columns;
  private MetadataConfiguration metadataConfig;

  /**
   * 
   */
  public ConformanceProfileTableOptionsDisplay(ExportConfiguration exportConfiguration) {
    this.includeMessageTable = exportConfiguration.isIncludeMessageTable();
    this.segmentORGroupsMessageExport = exportConfiguration.getSegmentORGroupsMessageExport();
    this.columns = exportConfiguration.getMessageColumn().getColumns();
    this.metadataConfig = exportConfiguration.getMessageMetadataConfig();
  }
  
  public ConformanceProfileTableOptionsDisplay() {
    super();
  }

  public ConformanceProfileTableOptionsDisplay(boolean includeMessageTable,
      UsageConfiguration segmentORGroupsMessageExport, List<NameAndPositionAndPresence> columns,
      MetadataConfiguration metadataConfig) {
    super();
    this.includeMessageTable = includeMessageTable;
    this.segmentORGroupsMessageExport = segmentORGroupsMessageExport;
    this.columns = columns;
    this.metadataConfig = metadataConfig;
  }

  public boolean isIncludeMessageTable() {
    return includeMessageTable;
  }

  public void setIncludeMessageTable(boolean includeMessageTable) {
    this.includeMessageTable = includeMessageTable;
  }

  public UsageConfiguration getSegmentORGroupsMessageExport() {
    return segmentORGroupsMessageExport;
  }

  public void setSegmentORGroupsMessageExport(UsageConfiguration segmentORGroupsMessageExport) {
    this.segmentORGroupsMessageExport = segmentORGroupsMessageExport;
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

  /**
   * @param findExportConfigurationServiceByAuthentication
   * @return
   */
  @Override
  public ExportConfiguration populateExportConfiguration(ExportConfiguration exportConfiguration) {
    exportConfiguration.setIncludeMessageTable(this.includeMessageTable);
    exportConfiguration.setSegmentORGroupsMessageExport(this.segmentORGroupsMessageExport);
    exportConfiguration.setMessageColumn(new ColumnsConfiguration(this.columns));
    exportConfiguration.setMessageMetadataConfig(this.metadataConfig);
    return exportConfiguration;
  }

}
