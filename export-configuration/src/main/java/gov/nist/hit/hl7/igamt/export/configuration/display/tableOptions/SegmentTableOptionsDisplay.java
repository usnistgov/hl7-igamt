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

import gov.nist.hit.hl7.igamt.export.configuration.domain.CoConstraintExportMode;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ColumnsConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.MetadataConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.NameAndPositionAndPresence;
import gov.nist.hit.hl7.igamt.export.configuration.domain.UsageConfiguration;

/**
 *
 * @author Maxence Lefort on Jun 5, 2018.
 */
public class SegmentTableOptionsDisplay implements TableOptionsDisplay {

  private boolean includeSegmentTable = true;
  private boolean greyOutOBX2FlavorColumn = false;
  private UsageConfiguration segmentsExport;
  private UsageConfiguration fieldsExport;
  private CoConstraintExportMode coConstraintExportMode;
  private List<NameAndPositionAndPresence> columns;
  private MetadataConfiguration metadataConfig;

  public SegmentTableOptionsDisplay(ExportConfiguration exportConfiguration) {
    this.includeSegmentTable = exportConfiguration.isIncludeSegmentTable();
    this.greyOutOBX2FlavorColumn = exportConfiguration.isGreyOutOBX2FlavorColumn();
    this.segmentsExport = exportConfiguration.getSegmentsExport();
    this.fieldsExport = exportConfiguration.getFieldsExport();
    this.coConstraintExportMode = exportConfiguration.getCoConstraintExportMode();
    this.columns = exportConfiguration.getSegmentColumn().getColumns();
    this.metadataConfig = exportConfiguration.getSegmentMetadataConfig();
  }

  /**
   * @param findExportConfigurationServiceByAuthentication
   * @return
   */
  @Override
  public ExportConfiguration populateExportConfiguration(ExportConfiguration exportConfiguration) {
    exportConfiguration.setIncludeSegmentTable(this.includeSegmentTable);
    exportConfiguration.setSegmentsExport(this.segmentsExport);
    exportConfiguration.setFieldsExport(this.fieldsExport);
    exportConfiguration.setSegmentColumn(new ColumnsConfiguration(this.columns));
    exportConfiguration.setSegmentMetadataConfig(this.metadataConfig);
    exportConfiguration.setCoConstraintExportMode(this.coConstraintExportMode);
    exportConfiguration.setGreyOutOBX2FlavorColumn(greyOutOBX2FlavorColumn);
    return exportConfiguration;
  }

  public SegmentTableOptionsDisplay(boolean includeSegmentTable, boolean greyOutOBX2FlavorColumn,
      UsageConfiguration segmentsExport, UsageConfiguration fieldsExport,
      CoConstraintExportMode coConstraintExportMode, List<NameAndPositionAndPresence> columns,
      MetadataConfiguration metadataConfig) {
    super();
    this.includeSegmentTable = includeSegmentTable;
    this.greyOutOBX2FlavorColumn = greyOutOBX2FlavorColumn;
    this.segmentsExport = segmentsExport;
    this.fieldsExport = fieldsExport;
    this.coConstraintExportMode = coConstraintExportMode;
    this.columns = columns;
    this.metadataConfig = metadataConfig;
  }

  public SegmentTableOptionsDisplay() {
    super();
  }

  public boolean isIncludeSegmentTable() {
    return includeSegmentTable;
  }

  public void setIncludeSegmentTable(boolean includeSegmentTable) {
    this.includeSegmentTable = includeSegmentTable;
  }

  public boolean isGreyOutOBX2FlavorColumn() {
    return greyOutOBX2FlavorColumn;
  }

  public void setGreyOutOBX2FlavorColumn(boolean greyOutOBX2FlavorColumn) {
    this.greyOutOBX2FlavorColumn = greyOutOBX2FlavorColumn;
  }

  public UsageConfiguration getSegmentsExport() {
    return segmentsExport;
  }

  public void setSegmentsExport(UsageConfiguration segmentsExport) {
    this.segmentsExport = segmentsExport;
  }

  public UsageConfiguration getFieldsExport() {
    return fieldsExport;
  }

  public void setFieldsExport(UsageConfiguration fieldsExport) {
    this.fieldsExport = fieldsExport;
  }

  public CoConstraintExportMode getCoConstraintExportMode() {
    return coConstraintExportMode;
  }

  public void setCoConstraintExportMode(CoConstraintExportMode coConstraintExportMode) {
    this.coConstraintExportMode = coConstraintExportMode;
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

}
