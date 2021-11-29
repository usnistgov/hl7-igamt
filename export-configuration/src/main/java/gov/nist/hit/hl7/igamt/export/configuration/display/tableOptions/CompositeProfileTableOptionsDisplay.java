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
public class CompositeProfileTableOptionsDisplay implements TableOptionsDisplay{
  private boolean includeCompositeProfileTable = true;
  private UsageConfiguration segmentORGroupsCompositeProfileExport;
  private List<NameAndPositionAndPresence> columns;
  private MetadataConfiguration metadataConfig;
  private boolean includeComposition;
  private boolean includeDerived = false;

  /**
   * 
   */
  public CompositeProfileTableOptionsDisplay(ExportConfiguration exportConfiguration) {
    this.includeCompositeProfileTable = exportConfiguration.isIncludeCompositeProfileTable();
    this.segmentORGroupsCompositeProfileExport = exportConfiguration.getSegmentORGroupsCompositeProfileExport();
    this.columns = exportConfiguration.getCompositeProfileColumn().getColumns();
    this.metadataConfig = exportConfiguration.getCompositeProfileMetadataConfig();
    this.includeComposition = exportConfiguration.isIncludeComposition();
    this.includeDerived = exportConfiguration.isIncludeDerived();
  }
  
  public CompositeProfileTableOptionsDisplay() {
    super();
  }

  public CompositeProfileTableOptionsDisplay(boolean includeCompositeProfileTable,
      UsageConfiguration segmentORGroupsCompositeProfileExport,
      List<NameAndPositionAndPresence> columns, MetadataConfiguration metadataConfig,
      boolean includeComposition, boolean includeDerived) {
    super();
    this.includeCompositeProfileTable = includeCompositeProfileTable;
    this.segmentORGroupsCompositeProfileExport = segmentORGroupsCompositeProfileExport;
    this.columns = columns;
    this.metadataConfig = metadataConfig;
    this.includeComposition = includeComposition;
    this.includeDerived = includeDerived;
  }

  public boolean isIncludeCompositeProfileTable() {
    return includeCompositeProfileTable;
  }

  public void setIncludeCompositeProfileTable(boolean includeCompositeProfileTable) {
    this.includeCompositeProfileTable = includeCompositeProfileTable;
  }

  public UsageConfiguration getSegmentORGroupsCompositeProfileExport() {
    return segmentORGroupsCompositeProfileExport;
  }

  public void setSegmentORGroupsCompositeProfileExport(UsageConfiguration segmentORGroupsCompositeProfileExport) {
    this.segmentORGroupsCompositeProfileExport = segmentORGroupsCompositeProfileExport;
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
  
  public boolean isIncludeComposition() {
    return includeComposition;
  }

  public void setIncludeComposition(boolean includeComposition) {
    this.includeComposition = includeComposition;
  }

  public boolean isIncludeDerived() {
    return includeDerived;
  }

  public void setIncludeDerived(boolean includeDerived) {
    this.includeDerived = includeDerived;
  }

  /**
   * @param findExportConfigurationServiceByAuthentication
   * @return
   */
  @Override
  public ExportConfiguration populateExportConfiguration(ExportConfiguration exportConfiguration) {
    exportConfiguration.setIncludeCompositeProfileTable(this.includeCompositeProfileTable);
    exportConfiguration.setSegmentORGroupsCompositeProfileExport(this.segmentORGroupsCompositeProfileExport);
    exportConfiguration.setCompositeProfileColumn(new ColumnsConfiguration(this.columns));
    exportConfiguration.setCompositeProfileMetadataConfig(this.metadataConfig);
    exportConfiguration.setIncludeComposition(this.includeComposition);
    exportConfiguration.setIncludeDerived(this.includeDerived);
    return exportConfiguration;
  }

}
