package gov.nist.hit.hl7.igamt.export.configuration.newModel;

import java.util.List;

import gov.nist.hit.hl7.igamt.export.configuration.domain.CoConstraintExportMode;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ColumnsConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.MetadataConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.NameAndPositionAndPresence;
import gov.nist.hit.hl7.igamt.export.configuration.domain.UsageConfiguration;

public class SegmentExportConfiguration extends ResourceExportConfiguration{

	  private Boolean dynamicMappingInfo;
	  private Boolean binding;
	  private ConstraintExportConfiguration constraintExportConfiguration;

	  
	  private boolean includeSegmentTable = true;
	  private boolean greyOutOBX2FlavorColumn = false;
	  private UsageConfiguration segmentsExport;
	  private UsageConfiguration fieldsExport;
	  private CoConstraintExportMode coConstraintExportMode;
	  private List<NameAndPositionAndPresence> columns;
	  private MetadataConfiguration metadataConfig;
	  
	  public SegmentExportConfiguration(ExportConfiguration defaultConfiguration) {
		  this.includeSegmentTable = defaultConfiguration.isIncludeSegmentTable();
		  this.greyOutOBX2FlavorColumn=defaultConfiguration.isGreyOutOBX2FlavorColumn();
		  this.segmentsExport=defaultConfiguration.getSegmentsExport();
		  this.fieldsExport=defaultConfiguration.getFieldsExport();
		  this.columns=defaultConfiguration.getSegmentColumn().getColumns();
		  this.coConstraintExportMode=defaultConfiguration.getCoConstraintExportMode();
		  this.metadataConfig=defaultConfiguration.getSegmentMetadataConfig();  
	  }
	  
	  
	  public SegmentExportConfiguration(Boolean dynamicMappingInfo, Boolean binding,
			ConstraintExportConfiguration constraintExportConfiguration, boolean includeSegmentTable,
			boolean greyOutOBX2FlavorColumn, UsageConfiguration segmentsExport, UsageConfiguration fieldsExport,
			CoConstraintExportMode coConstraintExportMode, List<NameAndPositionAndPresence> columns,
			MetadataConfiguration metadataConfig) {
		super();
		this.dynamicMappingInfo = dynamicMappingInfo;
		this.binding = binding;
		this.constraintExportConfiguration = constraintExportConfiguration;
		this.includeSegmentTable = includeSegmentTable;
		this.greyOutOBX2FlavorColumn = greyOutOBX2FlavorColumn;
		this.segmentsExport = segmentsExport;
		this.fieldsExport = fieldsExport;
		this.coConstraintExportMode = coConstraintExportMode;
		this.columns = columns;
		this.metadataConfig = metadataConfig;
	}
	  
	  public SegmentExportConfiguration() {
			super();
		}

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

	  public SegmentExportConfiguration(boolean ext, boolean dynamicMappingInfo, boolean binding, boolean includeSegmentTable, boolean greyOutOBX2FlavorColumn,
	      UsageConfiguration segmentsExport, UsageConfiguration fieldsExport,
	      CoConstraintExportMode coConstraintExportMode, List<NameAndPositionAndPresence> columns,
	      MetadataConfiguration metadataConfig) {
//		  this.ext=ext;
		  this.dynamicMappingInfo=dynamicMappingInfo;
		  this.binding=binding;
		  this.constraintExportConfiguration = new ConstraintExportConfiguration(true, true);
	    this.includeSegmentTable = includeSegmentTable;
	    this.greyOutOBX2FlavorColumn = greyOutOBX2FlavorColumn;
	    this.segmentsExport = segmentsExport;
	    this.fieldsExport = fieldsExport;
	    this.coConstraintExportMode = coConstraintExportMode;
	    this.columns = columns;
	    this.metadataConfig = metadataConfig;
	  }	

	public ConstraintExportConfiguration getConstraintExportConfiguration() {
		return constraintExportConfiguration;
	}

	public void setConstraintExportConfiguration(ConstraintExportConfiguration constraintExportConfiguration) {
		this.constraintExportConfiguration = constraintExportConfiguration;
	}



	public Boolean getDynamicMappingInfo() {
		return dynamicMappingInfo;
	}

	public void setDynamicMappingInfo(Boolean dynamicMappingInfo) {
		this.dynamicMappingInfo = dynamicMappingInfo;
	}

	public Boolean getBinding() {
		return binding;
	}

	public void setBinding(Boolean binding) {
		this.binding = binding;
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
