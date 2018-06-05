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

import gov.nist.hit.hl7.igamt.export.configuration.domain.ColumnsConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.MetadataConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.UsageConfiguration;

/**
 *
 * @author Maxence Lefort on Jun 5, 2018.
 */
public class ConformanceStatementTableOptionsDisplay {
  private String id;
  private boolean includeMessageTable = true;
  private UsageConfiguration segmentORGroupsMessageExport;
  private ColumnsConfiguration columns;
  private MetadataConfiguration metadataConfig;
 
  /**
   * 
   */
  public ConformanceStatementTableOptionsDisplay(ExportConfiguration exportConfiguration) {
    this.id = exportConfiguration.getId();
    this.includeMessageTable = exportConfiguration.isIncludeMessageTable();
    this.segmentORGroupsMessageExport = exportConfiguration.getSegmentORGroupsMessageExport();
    this.columns = exportConfiguration.getMessageColumn();
    this.metadataConfig = exportConfiguration.getMessageMetadataConfig();
  }

}
