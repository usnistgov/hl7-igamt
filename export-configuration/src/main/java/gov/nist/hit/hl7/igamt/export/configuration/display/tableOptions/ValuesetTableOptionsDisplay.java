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

import gov.nist.hit.hl7.igamt.export.configuration.domain.CodeUsageConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ColumnsConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.NameAndPositionAndPresence;
import gov.nist.hit.hl7.igamt.export.configuration.domain.UsageConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ValuesetMetadataConfiguration;

/**
 *
 * @author Maxence Lefort on Jun 5, 2018.
 */
public class ValuesetTableOptionsDisplay implements TableOptionsDisplay {

  private boolean includeValuesetsTable = true;
  private UsageConfiguration valuesetsExport;
  private CodeUsageConfiguration codesExport;
  private List<NameAndPositionAndPresence> columns;
  private ValuesetMetadataConfiguration metadataConfig;
  private boolean unboundHL7 = false;
  private boolean unboundCustom = false;
  private boolean phinvadsUpdateEmailNotification;
  private int codeNumber;
  private int maxCodeNumber;

  public ValuesetTableOptionsDisplay(ExportConfiguration exportConfiguration) {
    this.includeValuesetsTable = exportConfiguration.isIncludeValuesetsTable();
    this.valuesetsExport = exportConfiguration.getValuesetsExport();
    this.codesExport = exportConfiguration.getCodesExport();
    this.columns = exportConfiguration.getValuesetColumn().getColumns();
    this.metadataConfig = exportConfiguration.getValuesetsMetadata();
    this.unboundHL7 = exportConfiguration.isUnboundHL7();
    this.unboundCustom = exportConfiguration.isUnboundCustom();
    this.phinvadsUpdateEmailNotification = exportConfiguration.isPhinvadsUpdateEmailNotification();
    this.codeNumber = exportConfiguration.getMaxCodeNumber();
    this.maxCodeNumber = ExportConfiguration.MAX_CODE;
  }

  /**
   * @param findExportConfigurationServiceByAuthentication
   * @return
   */
  @Override
  public ExportConfiguration populateExportConfiguration(ExportConfiguration exportConfiguration) {
    exportConfiguration.setIncludeValuesetsTable(this.includeValuesetsTable);
    exportConfiguration.setValuesetsExport(this.valuesetsExport);
    exportConfiguration.setCodesExport(this.codesExport);
    exportConfiguration.setValuesetColumn(new ColumnsConfiguration(this.columns));
    exportConfiguration.setValuesetsMetadata(this.metadataConfig);
    exportConfiguration.setUnboundHL7(this.unboundHL7);
    exportConfiguration.setUnboundCustom(this.unboundCustom);
    exportConfiguration.setPhinvadsUpdateEmailNotification(this.phinvadsUpdateEmailNotification);
    exportConfiguration.setMaxCodeNumber(this.codeNumber);
    return exportConfiguration;
  }

  public ValuesetTableOptionsDisplay() {
    super();
  }

  public ValuesetTableOptionsDisplay(boolean includeValuesetsTable,
      UsageConfiguration valuesetsExport, CodeUsageConfiguration codesExport,
      List<NameAndPositionAndPresence> columns, ValuesetMetadataConfiguration metadataConfig,
      boolean unboundHL7, boolean unboundCustom, boolean phinvadsUpdateEmailNotification,
      int codeNumber, int maxCodeNumber) {
    super();
    this.includeValuesetsTable = includeValuesetsTable;
    this.valuesetsExport = valuesetsExport;
    this.codesExport = codesExport;
    this.columns = columns;
    this.metadataConfig = metadataConfig;
    this.unboundHL7 = unboundHL7;
    this.unboundCustom = unboundCustom;
    this.phinvadsUpdateEmailNotification = phinvadsUpdateEmailNotification;
    this.codeNumber = codeNumber;
    this.maxCodeNumber = maxCodeNumber;
  }

  public boolean isIncludeValuesetsTable() {
    return includeValuesetsTable;
  }

  public void setIncludeValuesetsTable(boolean includeValuesetsTable) {
    this.includeValuesetsTable = includeValuesetsTable;
  }

  public UsageConfiguration getValuesetsExport() {
    return valuesetsExport;
  }

  public void setValuesetsExport(UsageConfiguration valuesetsExport) {
    this.valuesetsExport = valuesetsExport;
  }

  public CodeUsageConfiguration getCodesExport() {
    return codesExport;
  }

  public void setCodesExport(CodeUsageConfiguration codesExport) {
    this.codesExport = codesExport;
  }

  public List<NameAndPositionAndPresence> getColumns() {
    return columns;
  }

  public void setColumns(List<NameAndPositionAndPresence> columns) {
    this.columns = columns;
  }

  public ValuesetMetadataConfiguration getMetadataConfig() {
    return metadataConfig;
  }

  public void setMetadataConfig(ValuesetMetadataConfiguration metadataConfig) {
    this.metadataConfig = metadataConfig;
  }

  public boolean isUnboundHL7() {
    return unboundHL7;
  }

  public void setUnboundHL7(boolean unboundHL7) {
    this.unboundHL7 = unboundHL7;
  }

  public boolean isUnboundCustom() {
    return unboundCustom;
  }

  public void setUnboundCustom(boolean unboundCustom) {
    this.unboundCustom = unboundCustom;
  }

  public boolean isPhinvadsUpdateEmailNotification() {
    return phinvadsUpdateEmailNotification;
  }

  public void setPhinvadsUpdateEmailNotification(boolean phinvadsUpdateEmailNotification) {
    this.phinvadsUpdateEmailNotification = phinvadsUpdateEmailNotification;
  }

  public int getCodeNumber() {
    return codeNumber;
  }

  public void setCodeNumber(int codeNumber) {
    this.codeNumber = codeNumber;
  }

  public int getMaxCodeNumber() {
    return maxCodeNumber;
  }

  public void setMaxCodeNumber(int maxCodeNumber) {
    this.maxCodeNumber = maxCodeNumber;
  }

}
