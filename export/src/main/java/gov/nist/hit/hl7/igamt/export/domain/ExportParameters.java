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
package gov.nist.hit.hl7.igamt.export.domain;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportFontConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.MetadataConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.NameAndPositionAndPresence;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ValueSetMetadataConfiguration;

/**
 *
 * @author Maxence Lefort on May 15, 2018.
 */
public class ExportParameters {

  // Define parameters with a default value
  private boolean inlineConstraints = false;
  private boolean includeTOC = true;
  private String targetFormat = "html";
  private String documentTitle = "Implementation Guide";
  private String imageLogo;
  private List<NameAndPositionAndPresence> messageColumns;
  private List<NameAndPositionAndPresence> compositeProfileColumns;
  private List<NameAndPositionAndPresence> profileComponentColumns;
  private List<NameAndPositionAndPresence> segmentsColumns;
  private List<NameAndPositionAndPresence> dataTypeColumns;
  private List<NameAndPositionAndPresence> valueSetColumns;
  private ValueSetMetadataConfiguration valueSetMetadataConfiguration;
  private MetadataConfiguration datatypeMetadataConfiguration;
  private MetadataConfiguration segmentMetadataConfiguration;
  private MetadataConfiguration messageMetadataConfiguration;
  private MetadataConfiguration compositeProfileMetadataConfiguration;
  private ExportFontConfiguration exportFontConfiguration;
  private String appVersion;

  public ExportParameters(boolean inlineConstraints, boolean includeTOC, String targetFormat,
      String documentTitle, String appVersion) {
    this(inlineConstraints, includeTOC, targetFormat, documentTitle, null, appVersion);
  }

  public ExportParameters(boolean inlineConstraints, boolean includeTOC, String targetFormat,
      String documentTitle, String imageLogo, String appVersion) {
    this(inlineConstraints, includeTOC, targetFormat, documentTitle, imageLogo, null, null, null,
        null, null, null, null, null, null, null, null, null, appVersion);
  }

  public ExportParameters(boolean inlineConstraints, boolean includeTOC, String targetFormat,
      String documentTitle, String imageLogo, ExportConfiguration exportConfiguration,
      ExportFontConfiguration exportFontConfiguration, String appVersion) {
    this(inlineConstraints, includeTOC, targetFormat, documentTitle, imageLogo,
        exportConfiguration.getMessageColumn().getColumns(),
        exportConfiguration.getCompositeProfileColumn().getColumns(),
        exportConfiguration.getProfileComponentColumn().getColumns(),
        exportConfiguration.getSegmentColumn().getColumns(),
        exportConfiguration.getDatatypeColumn().getColumns(),
        exportConfiguration.getValueSetColumn().getColumns(),
        exportConfiguration.getValueSetsMetadata(), exportConfiguration.getDatatypeMetadataConfig(),
        exportConfiguration.getSegmentMetadataConfig(),
        exportConfiguration.getMessageMetadataConfig(),
        exportConfiguration.getCompositeProfileMetadataConfig(), exportFontConfiguration,
        appVersion);
  }

  public ExportParameters(boolean inlineConstraints, boolean includeTOC, String targetFormat,
      String documentTitle, String imageLogo, List<NameAndPositionAndPresence> messageColumns,
      List<NameAndPositionAndPresence> compositeProfileColumns,
      List<NameAndPositionAndPresence> profileComponentColumns,
      List<NameAndPositionAndPresence> segmentsColumns,
      List<NameAndPositionAndPresence> dataTypeColumns,
      List<NameAndPositionAndPresence> valueSetColumns,
      ValueSetMetadataConfiguration valueSetMetadataConfiguration,
      MetadataConfiguration datatypeMetadataConfiguration,
      MetadataConfiguration segmentMetadataConfiguration,
      MetadataConfiguration messageMetadataConfiguration,
      MetadataConfiguration compositeProfileMetadataConfiguration,
      ExportFontConfiguration exportFontConfiguration, String appVersion) {
    this.inlineConstraints = inlineConstraints;
    this.includeTOC = includeTOC;
    this.targetFormat = targetFormat;
    this.documentTitle = documentTitle;
    this.imageLogo = imageLogo;
    this.messageColumns = messageColumns;
    this.compositeProfileColumns = compositeProfileColumns;
    this.profileComponentColumns = profileComponentColumns;
    this.segmentsColumns = segmentsColumns;
    this.dataTypeColumns = dataTypeColumns;
    this.valueSetColumns = valueSetColumns;
    this.valueSetMetadataConfiguration = valueSetMetadataConfiguration;
    this.datatypeMetadataConfiguration = datatypeMetadataConfiguration;
    this.segmentMetadataConfiguration = segmentMetadataConfiguration;
    this.messageMetadataConfiguration = messageMetadataConfiguration;
    this.compositeProfileMetadataConfiguration = compositeProfileMetadataConfiguration;
    this.exportFontConfiguration = exportFontConfiguration;
    this.appVersion = appVersion;
  }

  public ExportParameters() {}

  public boolean isInlineConstraints() {
    return inlineConstraints;
  }

  public void setInlineConstraints(boolean inlineConstraints) {
    this.inlineConstraints = inlineConstraints;
  }

  public boolean isIncludeTOC() {
    return includeTOC;
  }

  public void setIncludeTOC(boolean includeTOC) {
    this.includeTOC = includeTOC;
  }

  public String getTargetFormat() {
    return targetFormat;
  }

  public void setTargetFormat(String targetFormat) {
    this.targetFormat = targetFormat;
  }

  public String getDocumentTitle() {
    return documentTitle;
  }

  public void setDocumentTitle(String documentTitle) {
    this.documentTitle = documentTitle;
  }

  public Map<String, String> toMap() {
    Map<String, String> params = new HashMap<>();
    params.put("includeTOC", String.valueOf(includeTOC));
    params.put("inlineConstraints", String.valueOf(inlineConstraints));
    params.put("targetFormat", targetFormat);
    params.put("documentTitle", documentTitle);
    if (imageLogo != null) {
      params.put("imageLogo", imageLogo);
    }
    if (messageColumns != null && !messageColumns.isEmpty()) {
      String messageColumn = "messageColumn";
      for (NameAndPositionAndPresence currentColumn : messageColumns) {
        params.put(messageColumn + currentColumn.getName().replace(" ", ""),
            String.valueOf(currentColumn.isPresent()));
      }
    }
    if (compositeProfileColumns != null && !compositeProfileColumns.isEmpty()) {
      String compositeProfileColumn = "compositeProfileColumn";
      for (NameAndPositionAndPresence currentColumn : compositeProfileColumns) {
        params.put(compositeProfileColumn + currentColumn.getName().replace(" ", ""),
            String.valueOf(currentColumn.isPresent()));
      }
    }
    if (profileComponentColumns != null && !profileComponentColumns.isEmpty()) {
      String profileComponentColumn = "profileComponentColumn";
      for (NameAndPositionAndPresence currentColumn : profileComponentColumns) {
        params.put(profileComponentColumn + currentColumn.getName().replace(" ", ""),
            String.valueOf(currentColumn.isPresent()));
      }
    }
    if (dataTypeColumns != null && !dataTypeColumns.isEmpty()) {
      String dataTypeColumn = "dataTypeColumn";
      for (NameAndPositionAndPresence currentColumn : dataTypeColumns) {
        params.put(dataTypeColumn + currentColumn.getName().replace(" ", ""),
            String.valueOf(currentColumn.isPresent()));
      }
    }
    if (valueSetColumns != null && !valueSetColumns.isEmpty()) {
      String valueSetColumn = "valueSetColumn";
      for (NameAndPositionAndPresence currentColumn : valueSetColumns) {
        params.put(valueSetColumn + currentColumn.getName().replace(" ", ""),
            String.valueOf(currentColumn.isPresent()));
      }
    }
    if (segmentsColumns != null && !segmentsColumns.isEmpty()) {
      String segmentsColumn = "segmentColumn";
      for (NameAndPositionAndPresence currentColumn : segmentsColumns) {
        params.put(segmentsColumn + currentColumn.getName().replace(" ", ""),
            String.valueOf(currentColumn.isPresent()));
      }
    }
    if (valueSetMetadataConfiguration != null) {
      params.put("valueSetMetadataStability",
          String.valueOf(valueSetMetadataConfiguration.isStability()));
      params.put("valueSetMetadataExtensibility",
          String.valueOf(valueSetMetadataConfiguration.isExtensibility()));
      params.put("valueSetMetadataContentDefinition",
          String.valueOf(valueSetMetadataConfiguration.isContentDefinition()));
      params.put("valueSetMetadataOid", String.valueOf(valueSetMetadataConfiguration.isOid()));
      params.put("valueSetMetadataType", String.valueOf(valueSetMetadataConfiguration.isType()));
    }
    if (datatypeMetadataConfiguration != null) {
      params.put("datatypeMetadataDisplay",
          String.valueOf(hasMetadata(datatypeMetadataConfiguration)));
      params.put("datatypeMetadataHL7Version",
          String.valueOf(datatypeMetadataConfiguration.isHl7version()));
      params.put("datatypeMetadataPublicationDate",
          String.valueOf(datatypeMetadataConfiguration.isPublicationDate()));
      params.put("datatypeMetadataPublicationVersion",
          String.valueOf(datatypeMetadataConfiguration.isPublicationVersion()));
      params.put("datatypeMetadataScope", String.valueOf(datatypeMetadataConfiguration.isScope()));
    }
    if (segmentMetadataConfiguration != null) {
      params.put("segmentMetadataDisplay",
          String.valueOf(hasMetadata(segmentMetadataConfiguration)));
      params.put("segmentMetadataHL7Version",
          String.valueOf(segmentMetadataConfiguration.isHl7version()));
      params.put("segmentMetadataPublicationDate",
          String.valueOf(segmentMetadataConfiguration.isPublicationDate()));
      params.put("segmentMetadataPublicationVersion",
          String.valueOf(segmentMetadataConfiguration.isPublicationVersion()));
      params.put("segmentMetadataScope", String.valueOf(segmentMetadataConfiguration.isScope()));
    }
    if (messageMetadataConfiguration != null) {
      params.put("messageMetadataDisplay",
          String.valueOf(hasMetadata(messageMetadataConfiguration)));
      params.put("messageMetadataHL7Version",
          String.valueOf(messageMetadataConfiguration.isHl7version()));
      params.put("messageMetadataPublicationDate",
          String.valueOf(messageMetadataConfiguration.isPublicationDate()));
      params.put("messageMetadataPublicationVersion",
          String.valueOf(messageMetadataConfiguration.isPublicationVersion()));
      params.put("messageMetadataScope", String.valueOf(messageMetadataConfiguration.isScope()));
    }
    if (compositeProfileMetadataConfiguration != null) {
      params.put("compositeProfileMetadataDisplay",
          String.valueOf(hasMetadata(compositeProfileMetadataConfiguration)));
      params.put("compositeProfileMetadataHL7Version",
          String.valueOf(compositeProfileMetadataConfiguration.isHl7version()));
      params.put("compositeProfileMetadataPublicationDate",
          String.valueOf(compositeProfileMetadataConfiguration.isPublicationDate()));
      params.put("compositeProfileMetadataPublicationVersion",
          String.valueOf(compositeProfileMetadataConfiguration.isPublicationVersion()));
      params.put("compositeProfileMetadataScope",
          String.valueOf(compositeProfileMetadataConfiguration.isScope()));
    }
    if (exportFontConfiguration != null) {
      params.put("userFontFamily", exportFontConfiguration.getExportFont().getValue());
      params.put("userFontSize", String.valueOf(exportFontConfiguration.getFontSize()));
    }
    params.put("appCurrentVersion", this.appVersion);
    return params;
  }

  private boolean hasMetadata(MetadataConfiguration metadataConfiguration) {
    return (metadataConfiguration.isHl7version() || metadataConfiguration.isPublicationDate()
        || metadataConfiguration.isPublicationVersion() || metadataConfiguration.isScope());
  }

  public void setImageLogo(String imageLogo) {
    this.imageLogo = imageLogo;
  }

  public ExportFontConfiguration getExportFontConfig() {
    return exportFontConfiguration;
  }


}
