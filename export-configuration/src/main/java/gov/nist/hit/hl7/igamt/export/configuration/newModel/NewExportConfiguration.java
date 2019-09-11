package gov.nist.hit.hl7.igamt.export.configuration.newModel;

import java.util.ArrayList;

import javax.persistence.Column;

import org.springframework.data.annotation.Id;

import gov.nist.hit.hl7.igamt.export.configuration.domain.CoConstraintExportMode;
import gov.nist.hit.hl7.igamt.export.configuration.domain.CodeUsageConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ColumnsConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.MetadataConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.NameAndPositionAndPresence;
import gov.nist.hit.hl7.igamt.export.configuration.domain.UsageConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ValuesetMetadataConfiguration;

public class NewExportConfiguration {
	
	private DatatypeExportConfiguration datatypeExportConfiguration;
	private SegmentExportConfiguration segmentExportConfiguration;
	private ConformanceProfileExportConfiguration conformamceProfileExportConfiguration;
	private ValueSetExportConfiguration valueSetExportConfiguration;
	private AbstractDomainExportConfiguration abstractDomainExportConfiguration;
	private ResourceExportConfiguration resourceExportConfiguration;



	
	
	  @Id
	  private String id;
	  boolean defaultType = false;
	  private String name;
	  @Column(unique=true)
	  private String username;
	  private boolean unboundHL7 = false;
	  private boolean unboundCustom = false;
	  private boolean includeVaries = false;
	  private boolean includeMessageTable = true;
	  private boolean includeSegmentTable = true;
	  private boolean includeDatatypeTable = true;
	  private boolean includeValuesetsTable = true;
	  private boolean includeCompositeProfileTable = true;
	  private boolean includeProfileComponentTable = true;

	  private boolean greyOutOBX2FlavorColumn = false;

	  private CoConstraintExportMode coConstraintExportMode = CoConstraintExportMode.COMPACT;

	  private boolean includeDerived = false;

	  private UsageConfiguration segmentORGroupsMessageExport;
	  private UsageConfiguration segmentORGroupsCompositeProfileExport;
	  private UsageConfiguration segmentsExport;

	  private UsageConfiguration fieldsExport;

	  private UsageConfiguration profileComponentItemsExport;

	  private UsageConfiguration valuesetsExport;
	  private boolean includeComposition;
	  private CodeUsageConfiguration codesExport;
	  private boolean phinvadsUpdateEmailNotification;

	  private UsageConfiguration datatypesExport;
	  private UsageConfiguration componentExport;
	  private ColumnsConfiguration messageColumn;
	  private ColumnsConfiguration compositeProfileColumn;
	  private ColumnsConfiguration segmentColumn;
	  private ColumnsConfiguration profileComponentColumn;
	  private ColumnsConfiguration datatypeColumn;
	  private ColumnsConfiguration valuesetColumn;
	  private ValuesetMetadataConfiguration valuesetsMetadata;
	  private MetadataConfiguration datatypeMetadataConfig;
	  private MetadataConfiguration segmentMetadataConfig;
	  private MetadataConfiguration messageMetadataConfig;
	  private MetadataConfiguration compositeProfileMetadataConfig;
	  public final static int MAX_CODE = 500;
	  private int maxCodeNumber = MAX_CODE;

	  // DatatypeLibrary Config
	  private boolean datatypeLibraryIncludeSummary = true;
	  private boolean datatypeLibraryIncludeDerived = false;



	  public static ExportConfiguration getBasicExportConfiguration(boolean setAllTrue) {
	    ExportConfiguration defaultConfiguration = new ExportConfiguration();
	    defaultConfiguration.setCoConstraintExportMode(CoConstraintExportMode.COMPACT);
	    defaultConfiguration.setDefaultType(true);
	    defaultConfiguration.setUsername(null);
	    defaultConfiguration.setIncludeMessageTable(true);
	    defaultConfiguration.setIncludeSegmentTable(true);
	    defaultConfiguration.setIncludeDatatypeTable(true);
	    defaultConfiguration.setIncludeValuesetsTable(true);
	    defaultConfiguration.setIncludeCompositeProfileTable(true);
	    defaultConfiguration.setIncludeProfileComponentTable(true);
	    // Default Usages
	    UsageConfiguration displayAll = new UsageConfiguration();
	    UsageConfiguration displaySelectives = new UsageConfiguration();
	    displaySelectives.setC(true);
	    displaySelectives.setX(setAllTrue);
	    displaySelectives.setO(setAllTrue);
	    displaySelectives.setR(true);
	    displaySelectives.setRe(true);
	    CodeUsageConfiguration codeUsageExport = new CodeUsageConfiguration();
	    codeUsageExport.setE(setAllTrue);
	    codeUsageExport.setP(true);
	    codeUsageExport.setR(true);

	    displayAll.setC(true);
	    displayAll.setRe(true);
	    displayAll.setX(true);
	    displayAll.setO(true);
	    displayAll.setR(true);

	    defaultConfiguration.setSegmentORGroupsMessageExport(displayAll);
	    defaultConfiguration.setSegmentORGroupsCompositeProfileExport(displayAll);

	    defaultConfiguration.setComponentExport(displayAll);

	    defaultConfiguration.setFieldsExport(displayAll);
	    defaultConfiguration.setProfileComponentItemsExport(displayAll);

	    defaultConfiguration.setCodesExport(codeUsageExport);
	    defaultConfiguration.setPhinvadsUpdateEmailNotification(false);
	    defaultConfiguration.setDatatypesExport(displaySelectives);
	    defaultConfiguration.setSegmentsExport(displaySelectives);

	    defaultConfiguration.setValuesetsExport(displaySelectives);

	    ValuesetMetadataConfiguration valuesetMetadataConfig =
	        new ValuesetMetadataConfiguration(true, true, true, true, true);
	    defaultConfiguration.setValuesetsMetadata(valuesetMetadataConfig);

	    MetadataConfiguration metadataDefaultConfig =
	        new MetadataConfiguration(false, false, false, false);
	    defaultConfiguration.setDatatypeMetadataConfig(metadataDefaultConfig);
	    defaultConfiguration.setSegmentMetadataConfig(metadataDefaultConfig);
	    defaultConfiguration.setMessageMetadataConfig(metadataDefaultConfig);
	    defaultConfiguration.setCompositeProfileMetadataConfig(metadataDefaultConfig);

	    // Default column
	    ArrayList<NameAndPositionAndPresence> messageColumnsDefaultList =
	        new ArrayList<NameAndPositionAndPresence>();

	    messageColumnsDefaultList.add(new NameAndPositionAndPresence("Segment", 1, true, true));
	    messageColumnsDefaultList.add(new NameAndPositionAndPresence("Flavor", 2, true, true));
	    messageColumnsDefaultList.add(new NameAndPositionAndPresence("Element Name", 3, true, true));
	    messageColumnsDefaultList
	        .add(new NameAndPositionAndPresence("Cardinality", 4, true, setAllTrue));
	    messageColumnsDefaultList.add(new NameAndPositionAndPresence("Usage", 5, true, setAllTrue));
	    messageColumnsDefaultList.add(new NameAndPositionAndPresence("Comment", 1, true, setAllTrue));

	    ArrayList<NameAndPositionAndPresence> segmentColumnsDefaultList =
	        new ArrayList<NameAndPositionAndPresence>();
	    segmentColumnsDefaultList.add(new NameAndPositionAndPresence("Name", 1, true, true));
	    segmentColumnsDefaultList
	        .add(new NameAndPositionAndPresence("Conformance Length", 2, setAllTrue, setAllTrue));
	    segmentColumnsDefaultList.add(new NameAndPositionAndPresence("Data Type", 3, true, setAllTrue));
	    segmentColumnsDefaultList.add(new NameAndPositionAndPresence("Usage", 4, true, setAllTrue));
	    segmentColumnsDefaultList
	        .add(new NameAndPositionAndPresence("Cardinality", 5, true, setAllTrue));
	    segmentColumnsDefaultList
	        .add(new NameAndPositionAndPresence("Length", 6, setAllTrue, setAllTrue));
	    segmentColumnsDefaultList.add(new NameAndPositionAndPresence("Value Set", 7, true, setAllTrue));
	    segmentColumnsDefaultList.add(new NameAndPositionAndPresence("Comment", 8, true, setAllTrue));



	    ArrayList<NameAndPositionAndPresence> dataTypeColumnsDefaultList =
	        new ArrayList<NameAndPositionAndPresence>();

	    dataTypeColumnsDefaultList.add(new NameAndPositionAndPresence("Name", 1, true, true));
	    dataTypeColumnsDefaultList
	        .add(new NameAndPositionAndPresence("Conformance Length", 2, setAllTrue, setAllTrue));
	    dataTypeColumnsDefaultList
	        .add(new NameAndPositionAndPresence("Data Type", 3, true, setAllTrue));
	    dataTypeColumnsDefaultList.add(new NameAndPositionAndPresence("Usage", 4, true, setAllTrue));
	    dataTypeColumnsDefaultList
	        .add(new NameAndPositionAndPresence("Length", 5, setAllTrue, setAllTrue));
	    dataTypeColumnsDefaultList
	        .add(new NameAndPositionAndPresence("Value Set", 6, true, setAllTrue));
	    dataTypeColumnsDefaultList.add(new NameAndPositionAndPresence("Comment", 7, true, setAllTrue));



	    defaultConfiguration.setDatatypeColumn(new ColumnsConfiguration(dataTypeColumnsDefaultList));
	    defaultConfiguration.setSegmentColumn(new ColumnsConfiguration(segmentColumnsDefaultList));
	    defaultConfiguration
	        .setProfileComponentColumn(new ColumnsConfiguration(segmentColumnsDefaultList));
	    defaultConfiguration.setMessageColumn(new ColumnsConfiguration(messageColumnsDefaultList));
	    defaultConfiguration
	        .setCompositeProfileColumn(new ColumnsConfiguration(messageColumnsDefaultList));

	    ArrayList<NameAndPositionAndPresence> valuesetsDefaultList =
	        new ArrayList<NameAndPositionAndPresence>();

	    valuesetsDefaultList.add(new NameAndPositionAndPresence("Value", 1, true, true));
	    valuesetsDefaultList.add(new NameAndPositionAndPresence("Code System", 2, true, true));
	    valuesetsDefaultList.add(new NameAndPositionAndPresence("Usage", 3, setAllTrue, setAllTrue));
	    valuesetsDefaultList.add(new NameAndPositionAndPresence("Description", 4, true, true));
	    valuesetsDefaultList.add(new NameAndPositionAndPresence("Comment", 5, setAllTrue, setAllTrue));

	    defaultConfiguration.setValuesetColumn(new ColumnsConfiguration(valuesetsDefaultList));
	    defaultConfiguration.setMaxCodeNumber(MAX_CODE);
	    return defaultConfiguration;
	  }



	  public DatatypeExportConfiguration getDatatypeExportConfiguration() {
		return datatypeExportConfiguration;
	}



	public void setDatatypeExportConfiguration(DatatypeExportConfiguration datatypeExportConfiguration) {
		this.datatypeExportConfiguration = datatypeExportConfiguration;
	}



	public SegmentExportConfiguration getSegmentExportConfiguration() {
		return segmentExportConfiguration;
	}



	public void setSegmentExportConfiguration(SegmentExportConfiguration segmentExportConfiguration) {
		this.segmentExportConfiguration = segmentExportConfiguration;
	}



	public ConformanceProfileExportConfiguration getConformamceProfileExportConfiguration() {
		return conformamceProfileExportConfiguration;
	}



	public void setConformamceProfileExportConfiguration(
			ConformanceProfileExportConfiguration conformamceProfileExportConfiguration) {
		this.conformamceProfileExportConfiguration = conformamceProfileExportConfiguration;
	}



	public ValueSetExportConfiguration getValueSetExportConfiguration() {
		return valueSetExportConfiguration;
	}



	public void setValueSetExportConfiguration(ValueSetExportConfiguration valueSetExportConfiguration) {
		this.valueSetExportConfiguration = valueSetExportConfiguration;
	}



	public AbstractDomainExportConfiguration getAbstractDomainExportConfiguration() {
		return abstractDomainExportConfiguration;
	}



	public void setAbstractDomainExportConfiguration(AbstractDomainExportConfiguration abstractDomainExportConfiguration) {
		this.abstractDomainExportConfiguration = abstractDomainExportConfiguration;
	}



	public ResourceExportConfiguration getResourceExportConfiguration() {
		return resourceExportConfiguration;
	}



	public void setResourceExportConfiguration(ResourceExportConfiguration resourceExportConfiguration) {
		this.resourceExportConfiguration = resourceExportConfiguration;
	}



	public String getId() {
	    return id;
	  }



	  public void setId(String id) {
	    this.id = id;
	  }



	  public boolean isDefaultType() {
	    return defaultType;
	  }



	  public void setDefaultType(boolean defaultType) {
	    this.defaultType = defaultType;
	  }



	  public String getName() {
	    return name;
	  }



	  public void setName(String name) {
	    this.name = name;
	  }


	  public String getUsername() {
	    return username;
	  }



	  public void setUsername(String username) {
	    this.username = username;
	  }



	  public static int getMaxCode() {
	    return MAX_CODE;
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



	  public boolean isIncludeVaries() {
	    return includeVaries;
	  }



	  public void setIncludeVaries(boolean includeVaries) {
	    this.includeVaries = includeVaries;
	  }



	  public boolean isIncludeMessageTable() {
	    return includeMessageTable;
	  }



	  public void setIncludeMessageTable(boolean includeMessageTable) {
	    this.includeMessageTable = includeMessageTable;
	  }



	  public boolean isIncludeSegmentTable() {
	    return includeSegmentTable;
	  }



	  public void setIncludeSegmentTable(boolean includeSegmentTable) {
	    this.includeSegmentTable = includeSegmentTable;
	  }



	  public boolean isIncludeDatatypeTable() {
	    return includeDatatypeTable;
	  }



	  public void setIncludeDatatypeTable(boolean includeDatatypeTable) {
	    this.includeDatatypeTable = includeDatatypeTable;
	  }



	  public boolean isIncludeValuesetsTable() {
	    return includeValuesetsTable;
	  }



	  public void setIncludeValuesetsTable(boolean includeValuesetsTable) {
	    this.includeValuesetsTable = includeValuesetsTable;
	  }



	  public boolean isIncludeCompositeProfileTable() {
	    return includeCompositeProfileTable;
	  }



	  public void setIncludeCompositeProfileTable(boolean includeCompositeProfileTable) {
	    this.includeCompositeProfileTable = includeCompositeProfileTable;
	  }



	  public boolean isIncludeProfileComponentTable() {
	    return includeProfileComponentTable;
	  }



	  public void setIncludeProfileComponentTable(boolean includeProfileComponentTable) {
	    this.includeProfileComponentTable = includeProfileComponentTable;
	  }



	  public boolean isGreyOutOBX2FlavorColumn() {
	    return greyOutOBX2FlavorColumn;
	  }



	  public void setGreyOutOBX2FlavorColumn(boolean greyOutOBX2FlavorColumn) {
	    this.greyOutOBX2FlavorColumn = greyOutOBX2FlavorColumn;
	  }



	  public CoConstraintExportMode getCoConstraintExportMode() {
	    return coConstraintExportMode;
	  }



	  public void setCoConstraintExportMode(CoConstraintExportMode coConstraintExportMode) {
	    this.coConstraintExportMode = coConstraintExportMode;
	  }



	  public boolean isIncludeDerived() {
	    return includeDerived;
	  }



	  public void setIncludeDerived(boolean includeDerived) {
	    this.includeDerived = includeDerived;
	  }



	  public UsageConfiguration getSegmentORGroupsMessageExport() {
	    return segmentORGroupsMessageExport;
	  }



	  public void setSegmentORGroupsMessageExport(UsageConfiguration segmentORGroupsMessageExport) {
	    this.segmentORGroupsMessageExport = segmentORGroupsMessageExport;
	  }



	  public UsageConfiguration getSegmentORGroupsCompositeProfileExport() {
	    return segmentORGroupsCompositeProfileExport;
	  }



	  public void setSegmentORGroupsCompositeProfileExport(
	      UsageConfiguration segmentORGroupsCompositeProfileExport) {
	    this.segmentORGroupsCompositeProfileExport = segmentORGroupsCompositeProfileExport;
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



	  public UsageConfiguration getProfileComponentItemsExport() {
	    return profileComponentItemsExport;
	  }



	  public void setProfileComponentItemsExport(UsageConfiguration profileComponentItemsExport) {
	    this.profileComponentItemsExport = profileComponentItemsExport;
	  }



	  public UsageConfiguration getValuesetsExport() {
	    return valuesetsExport;
	  }



	  public void setValuesetsExport(UsageConfiguration valuesetsExport) {
	    this.valuesetsExport = valuesetsExport;
	  }



	  public boolean isIncludeComposition() {
	    return includeComposition;
	  }



	  public void setIncludeComposition(boolean includeComposition) {
	    this.includeComposition = includeComposition;
	  }



	  public CodeUsageConfiguration getCodesExport() {
	    return codesExport;
	  }



	  public void setCodesExport(CodeUsageConfiguration codesExport) {
	    this.codesExport = codesExport;
	  }



	  public boolean isPhinvadsUpdateEmailNotification() {
	    return phinvadsUpdateEmailNotification;
	  }



	  public void setPhinvadsUpdateEmailNotification(boolean phinvadsUpdateEmailNotification) {
	    this.phinvadsUpdateEmailNotification = phinvadsUpdateEmailNotification;
	  }



	  public UsageConfiguration getDatatypesExport() {
	    return datatypesExport;
	  }



	  public void setDatatypesExport(UsageConfiguration datatypesExport) {
	    this.datatypesExport = datatypesExport;
	  }



	  public UsageConfiguration getComponentExport() {
	    return componentExport;
	  }



	  public void setComponentExport(UsageConfiguration componentExport) {
	    this.componentExport = componentExport;
	  }



	  public ColumnsConfiguration getMessageColumn() {
	    return messageColumn;
	  }



	  public void setMessageColumn(ColumnsConfiguration messageColumn) {
	    this.messageColumn = messageColumn;
	  }



	  public ColumnsConfiguration getCompositeProfileColumn() {
	    return compositeProfileColumn;
	  }



	  public void setCompositeProfileColumn(ColumnsConfiguration compositeProfileColumn) {
	    this.compositeProfileColumn = compositeProfileColumn;
	  }



	  public ColumnsConfiguration getSegmentColumn() {
	    return segmentColumn;
	  }



	  public void setSegmentColumn(ColumnsConfiguration segmentColumn) {
	    this.segmentColumn = segmentColumn;
	  }



	  public ColumnsConfiguration getProfileComponentColumn() {
	    return profileComponentColumn;
	  }



	  public void setProfileComponentColumn(ColumnsConfiguration profileComponentColumn) {
	    this.profileComponentColumn = profileComponentColumn;
	  }



	  public ColumnsConfiguration getDatatypeColumn() {
	    return datatypeColumn;
	  }



	  public void setDatatypeColumn(ColumnsConfiguration datatypeColumn) {
	    this.datatypeColumn = datatypeColumn;
	  }



	  public ColumnsConfiguration getValuesetColumn() {
	    return valuesetColumn;
	  }



	  public void setValuesetColumn(ColumnsConfiguration valuesetColumn) {
	    this.valuesetColumn = valuesetColumn;
	  }



	  public ValuesetMetadataConfiguration getValuesetsMetadata() {
	    return valuesetsMetadata;
	  }



	  public void setValuesetsMetadata(ValuesetMetadataConfiguration valuesetsMetadata) {
	    this.valuesetsMetadata = valuesetsMetadata;
	  }



	  public MetadataConfiguration getDatatypeMetadataConfig() {
	    return datatypeMetadataConfig;
	  }



	  public void setDatatypeMetadataConfig(MetadataConfiguration datatypeMetadataConfig) {
	    this.datatypeMetadataConfig = datatypeMetadataConfig;
	  }



	  public MetadataConfiguration getSegmentMetadataConfig() {
	    return segmentMetadataConfig;
	  }



	  public void setSegmentMetadataConfig(MetadataConfiguration segmentMetadataConfig) {
	    this.segmentMetadataConfig = segmentMetadataConfig;
	  }



	  public MetadataConfiguration getMessageMetadataConfig() {
	    return messageMetadataConfig;
	  }



	  public void setMessageMetadataConfig(MetadataConfiguration messageMetadataConfig) {
	    this.messageMetadataConfig = messageMetadataConfig;
	  }



	  public MetadataConfiguration getCompositeProfileMetadataConfig() {
	    return compositeProfileMetadataConfig;
	  }



	  public void setCompositeProfileMetadataConfig(
	      MetadataConfiguration compositeProfileMetadataConfig) {
	    this.compositeProfileMetadataConfig = compositeProfileMetadataConfig;
	  }



	  public int getMaxCodeNumber() {
	    return maxCodeNumber;
	  }



	  public void setMaxCodeNumber(int maxCodeNumber) {
	    this.maxCodeNumber = maxCodeNumber;
	  }



	  public boolean isDatatypeLibraryIncludeSummary() {
	    return datatypeLibraryIncludeSummary;
	  }



	  public void setDatatypeLibraryIncludeSummary(boolean datatypeLibraryIncludeSummary) {
	    this.datatypeLibraryIncludeSummary = datatypeLibraryIncludeSummary;
	  }



	  public boolean isDatatypeLibraryIncludeDerived() {
	    return datatypeLibraryIncludeDerived;
	  }



	  public void setDatatypeLibraryIncludeDerived(boolean datatypeLibraryIncludeDerived) {
	    this.datatypeLibraryIncludeDerived = datatypeLibraryIncludeDerived;
	  }


}
