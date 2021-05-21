package gov.nist.hit.hl7.igamt.export.configuration.domain;

import gov.nist.hit.hl7.igamt.export.configuration.newModel.ExportFilterDecision;

public class ExportConfigurationGlobal {

  private ExportConfiguration exportConfiguration;
  private ExportFilterDecision exportFilterDecision;
  private ExportFilterDecision previous;
  
  public ExportConfiguration getExportConfiguration() {
    return exportConfiguration;
  }
  public void setExportConfiguration(ExportConfiguration exportConfiguration) {
    this.exportConfiguration = exportConfiguration;
  }
  public ExportFilterDecision getExportFilterDecision() {
    return exportFilterDecision;
  }
  public void setExportFilterDecision(ExportFilterDecision exportFilterDecision) {
    this.exportFilterDecision = exportFilterDecision;
  }
  public ExportFilterDecision getPrevious() {
    return previous;
  }
  public void setPrevious(ExportFilterDecision previous) {
    this.previous = previous;
  }


}
