package gov.nist.hit.hl7.igamt.export.configuration.newModel;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import gov.nist.hit.hl7.igamt.export.configuration.domain.ColumnsConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.MetadataConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.NameAndPositionAndPresence;
import gov.nist.hit.hl7.igamt.export.configuration.domain.UsageConfiguration;

public class ConformanceProfileExportConfiguration extends ResourceExportConfiguration{

	
	  private Boolean identifier;
	  private Boolean messageType; // Message/@Type
	  private Boolean event; // Message/@Event
	  private Boolean structID; // Message/@StructID private String identifier;
//	  private Set<SegmentRefOrGroup> children = new HashSet<SegmentRefOrGroup>();
	  private Boolean binding;
	  
	
	  private boolean includeMessageTable = true;
	  private UsageConfiguration segmentORGroupsMessageExport;
	  private List<NameAndPositionAndPresence> columns;
	  private Columns listedColumns;
	  private MetadataConfiguration metadataConfig;
	  private ConstraintExportConfiguration constraintExportConfiguration;


	  /**
	   * 
	   */
	  public ConformanceProfileExportConfiguration(ExportConfiguration exportConfiguration) {
	    this.includeMessageTable = exportConfiguration.isIncludeMessageTable();
	    this.segmentORGroupsMessageExport = exportConfiguration.getSegmentORGroupsMessageExport();
	    this.columns = exportConfiguration.getMessageColumn().getColumns();
	    this.metadataConfig = exportConfiguration.getMessageMetadataConfig();
	    this.listedColumns = exportConfiguration.getListedColumns();
	  }
	  


	  public ConformanceProfileExportConfiguration() {
		super();
		// TODO Auto-generated constructor stub
	}



	public ConformanceProfileExportConfiguration(boolean includeMessageTable,
	      UsageConfiguration segmentORGroupsMessageExport, List<NameAndPositionAndPresence> columns,
	      MetadataConfiguration metadataConfig,Columns listedColumns ) {
	    this.includeMessageTable = includeMessageTable;
	    this.segmentORGroupsMessageExport = segmentORGroupsMessageExport;
	    this.columns = columns;
	    this.metadataConfig = metadataConfig;
	    this.listedColumns = listedColumns;
	  }
	  
	  

	




	public Columns getListedColumns() {
		return listedColumns;
	}



	public void setListedColumns(Columns listedColumns) {
		this.listedColumns = listedColumns;
	}



	public Boolean getIdentifier() {
		return identifier;
	}

	public void setIdentifier(Boolean identifier) {
		this.identifier = identifier;
	}

	public Boolean getMessageType() {
		return messageType;
	}

	public void setMessageType(Boolean messageType) {
		this.messageType = messageType;
	}

	public Boolean getEvent() {
		return event;
	}

	public void setEvent(Boolean event) {
		this.event = event;
	}

	public Boolean getStructID() {
		return structID;
	}

	public void setStructID(Boolean structID) {
		this.structID = structID;
	}

	public Boolean getBinding() {
		return binding;
	}

	public void setBinding(Boolean binding) {
		this.binding = binding;
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

	  public ExportConfiguration populateExportConfiguration(ExportConfiguration exportConfiguration) {
	    exportConfiguration.setIncludeMessageTable(this.includeMessageTable);
	    exportConfiguration.setSegmentORGroupsMessageExport(this.segmentORGroupsMessageExport);
	    exportConfiguration.setMessageColumn(new ColumnsConfiguration(this.columns));
	    exportConfiguration.setMessageMetadataConfig(this.metadataConfig);
	    return exportConfiguration;
	  }



	public ConstraintExportConfiguration getConstraintExportConfiguration() {
		return constraintExportConfiguration;
	}



	public void setConstraintExportConfiguration(ConstraintExportConfiguration constraintExportConfiguration) {
		this.constraintExportConfiguration = constraintExportConfiguration;
	}


}
