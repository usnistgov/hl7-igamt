package gov.nist.hit.hl7.igamt.export.configuration.newModel;

import java.util.List;

import gov.nist.hit.hl7.igamt.export.configuration.domain.ColumnsConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.MetadataConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.NameAndPositionAndPresence;
import gov.nist.hit.hl7.igamt.export.configuration.domain.UsageConfiguration;

public class DatatypeExportConfiguration extends ResourceExportConfiguration{

	  private Boolean ext;
	  private Boolean purposeAndUse;
	  private Boolean binding;
	  private ConstraintExportConfiguration constraintExportConfiguration;

	  
	  private boolean includeDatatypeTable = true;
	  private UsageConfiguration datatypesExport;
	  private UsageConfiguration componentExport;
	  private List<NameAndPositionAndPresence> columns;
	  private MetadataConfiguration metadataConfig;
	  private boolean includeVaries = false;
	  
	  public DatatypeExportConfiguration(ExportConfiguration exportConfiguration) {
		    this.includeDatatypeTable = exportConfiguration.isIncludeDatatypeTable();
		    this.datatypesExport = exportConfiguration.getDatatypesExport();
		    this.includeVaries = exportConfiguration.isIncludeVaries();
		    this.componentExport = exportConfiguration.getComponentExport();
		    this.columns = exportConfiguration.getDatatypeColumn().getColumns();
		    this.metadataConfig = exportConfiguration.getDatatypeMetadataConfig();
		  }

		  /** 
		   * @param findExportConfigurationServiceByAuthentication
		   * @return
		   */
		  
		  public ExportConfiguration populateExportConfiguration(ExportConfiguration exportConfiguration) {
		    exportConfiguration.setIncludeDatatypeTable(this.includeDatatypeTable);
		    exportConfiguration.setDatatypesExport(this.datatypesExport);
		    exportConfiguration.setComponentExport(this.componentExport);
		    exportConfiguration.setDatatypeColumn(new ColumnsConfiguration(this.columns));
		    exportConfiguration.setDatatypeMetadataConfig(this.metadataConfig);
		    exportConfiguration.setIncludeVaries(this.includeVaries);
		    return exportConfiguration;
		  }

		  public DatatypeExportConfiguration(boolean includeDatatypeTable,
		      UsageConfiguration datatypesExport, UsageConfiguration componentExport,
		      List<NameAndPositionAndPresence> columns, MetadataConfiguration metadataConfig,
		      boolean includeVaries) {
		    super();
		    this.includeDatatypeTable = includeDatatypeTable;
		    this.datatypesExport = datatypesExport;
		    this.componentExport = componentExport;
		    this.columns = columns;
		    this.metadataConfig = metadataConfig;
		    this.includeVaries = includeVaries;
		  }


		  public Boolean getExt() {
			return ext;
		}

		public void setExt(Boolean ext) {
			this.ext = ext;
		}

		public Boolean getPurposeAndUse() {
			return purposeAndUse;
		}

		public void setPurposeAndUse(Boolean purposeAndUse) {
			this.purposeAndUse = purposeAndUse;
		}

		public Boolean getBinding() {
			return binding;
		}

		public void setBinding(Boolean binding) {
			this.binding = binding;
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

		  public boolean isIncludeVaries() {
		    return includeVaries;
		  }

		  public void setIncludeVaries(boolean includeVaries) {
		    this.includeVaries = includeVaries;
		  }

		public ConstraintExportConfiguration getConstraintExportConfiguration() {
			return constraintExportConfiguration;
		}

		public void setConstraintExportConfiguration(ConstraintExportConfiguration constraintExportConfiguration) {
			this.constraintExportConfiguration = constraintExportConfiguration;
		}


	  
}
