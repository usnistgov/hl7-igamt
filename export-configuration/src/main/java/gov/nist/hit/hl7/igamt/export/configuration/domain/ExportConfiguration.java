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
package gov.nist.hit.hl7.igamt.export.configuration.domain;

import java.util.ArrayList;
import java.util.HashMap;

import javax.persistence.Column;

import gov.nist.diff.domain.DeltaAction;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import gov.nist.hit.hl7.igamt.export.configuration.newModel.AbstractDomainExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.Columns;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.ConformanceProfileExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.ConstraintExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.DatatypeExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.ResourceExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.SegmentExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.ValueSetExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.DocumentMetadataConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.PositionAndPresence;


/**
 *
 * @author Maxence Lefort on Mar 13, 2018.
 */
@Document(collection = "exportConfiguration")
public class ExportConfiguration {

  private String configName;
  @Id
  private String id;
  private boolean original; // true if it is the first time config

  private DatatypeExportConfiguration datatypeExportConfiguration;
  private SegmentExportConfiguration segmentExportConfiguration;
  private ConformanceProfileExportConfiguration conformamceProfileExportConfiguration;
  private ValueSetExportConfiguration valueSetExportConfiguration;
  private AbstractDomainExportConfiguration abstractDomainExportConfiguration;
  private ResourceExportConfiguration resourceExportConfiguration;
  private DocumentMetadataConfiguration DocumentMetadataConfiguration;


  boolean defaultType = false;
  boolean defaultConfig = false;
  private String name;
  private Columns listedColumns;
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
  private boolean deltaMode = true;

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
  private DeltaConfiguration deltaConfig;
  public final static int MAX_CODE = 500;
  private int maxCodeNumber = MAX_CODE;

  // DatatypeLibrary Config
  private boolean datatypeLibraryIncludeSummary = true;
  private boolean datatypeLibraryIncludeDerived = false;

  public static ExportConfiguration populateRestOfExportConfiguration(ExportConfiguration exportConfiguration) {
    SegmentExportConfiguration segmentExportConfiguration = new SegmentExportConfiguration(true, true, true,exportConfiguration.isIncludeSegmentTable()  ,exportConfiguration.isGreyOutOBX2FlavorColumn(), exportConfiguration.getSegmentsExport(), exportConfiguration.getFieldsExport(), exportConfiguration.getCoConstraintExportMode(), exportConfiguration.getSegmentColumn().getColumns(), exportConfiguration.getSegmentMetadataConfig());
    exportConfiguration.setSegmentExportConfiguration(segmentExportConfiguration);
    return exportConfiguration;
  }

  public static ExportConfiguration getBasicExportConfiguration(boolean setAllTrue) {
    ExportConfiguration defaultConfiguration = new ExportConfiguration();  
    defaultConfiguration.setConfigName("");
    defaultConfiguration.setDefaultConfig(false);
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
    displayAll.setX(false);
    displayAll.setO(false);
    displayAll.setR(true);
    DeltaExportConfigMode deltaMode = DeltaExportConfigMode.HIGHLIGHT;
    HashMap<DeltaAction,String> colors = new HashMap<>();
    colors.put(DeltaAction.ADDED, "#a7d6a9");
    colors.put(DeltaAction.DELETED, "#EC330C");
    colors.put(DeltaAction.UPDATED, "#ECAF0C");
    DeltaConfiguration deltaConfiguration = new DeltaConfiguration(deltaMode,colors);
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
        new MetadataConfiguration(true, true, true, true);
    defaultConfiguration.setDatatypeMetadataConfig(metadataDefaultConfig);
    defaultConfiguration.setSegmentMetadataConfig(metadataDefaultConfig);
    defaultConfiguration.setMessageMetadataConfig(metadataDefaultConfig);
    defaultConfiguration.setCompositeProfileMetadataConfig(metadataDefaultConfig);

    // New default column
    PositionAndPresence positionAndPresence = new PositionAndPresence();
    positionAndPresence.setPosition(1);
    positionAndPresence.setPresence(true);

    Columns listedColumns = new Columns();
    listedColumns.setCardinality(positionAndPresence);
    listedColumns.setElementName(positionAndPresence);
    listedColumns.setFlavor(positionAndPresence);
    listedColumns.setSegment(positionAndPresence);
    listedColumns.setUsage(positionAndPresence);
    defaultConfiguration.setListedColumns(listedColumns);

    // Default column
    ArrayList<NameAndPositionAndPresence> messageColumnsDefaultList =
        new ArrayList<NameAndPositionAndPresence>();

    messageColumnsDefaultList.add(new NameAndPositionAndPresence("Segment", 1, true, true));
    messageColumnsDefaultList.add(new NameAndPositionAndPresence("Flavor", 2, true, true));
    messageColumnsDefaultList.add(new NameAndPositionAndPresence("Element Name", 3, true, true));
    messageColumnsDefaultList.add(new NameAndPositionAndPresence("Usage", 5, true, setAllTrue));
    messageColumnsDefaultList
    .add(new NameAndPositionAndPresence("Cardinality", 4, true, setAllTrue));
    //    messageColumnsDefaultList.add(new NameAndPositionAndPresence("Comment", 1, true, setAllTrue));

    ArrayList<NameAndPositionAndPresence> segmentColumnsDefaultList =
        new ArrayList<NameAndPositionAndPresence>();
    segmentColumnsDefaultList.add(new NameAndPositionAndPresence("Name", 1, true, true));
    segmentColumnsDefaultList.add(new NameAndPositionAndPresence("Data Type", 3, true, setAllTrue));
    segmentColumnsDefaultList.add(new NameAndPositionAndPresence("Usage", 4, true, setAllTrue));
    segmentColumnsDefaultList.add(new NameAndPositionAndPresence("Cardinality", 5, true, setAllTrue));
    segmentColumnsDefaultList.add(new NameAndPositionAndPresence("Length", 6, setAllTrue, setAllTrue));
    //    segmentColumnsDefaultList
    //        .add(new NameAndPositionAndPresence("Conformance Length", 2, setAllTrue, setAllTrue));
    segmentColumnsDefaultList.add(new NameAndPositionAndPresence("Value Set", 7, true, setAllTrue));
    //    segmentColumnsDefaultList.add(new NameAndPositionAndPresence("Comment", 8, true, setAllTrue));



    ArrayList<NameAndPositionAndPresence> dataTypeColumnsDefaultList =
        new ArrayList<NameAndPositionAndPresence>();

    dataTypeColumnsDefaultList.add(new NameAndPositionAndPresence("Name", 1, true, true));
    //    dataTypeColumnsDefaultList
    //        .add(new NameAndPositionAndPresence("Conformance Length", 2, setAllTrue, setAllTrue));
    dataTypeColumnsDefaultList
    .add(new NameAndPositionAndPresence("Data Type", 3, true, setAllTrue));
    dataTypeColumnsDefaultList.add(new NameAndPositionAndPresence("Usage", 4, true, setAllTrue));
    dataTypeColumnsDefaultList
    .add(new NameAndPositionAndPresence("Length", 5, setAllTrue, setAllTrue));
    dataTypeColumnsDefaultList
    .add(new NameAndPositionAndPresence("Value Set", 6, true, setAllTrue));
    //    dataTypeColumnsDefaultList.add(new NameAndPositionAndPresence("Comment", 7, true, setAllTrue));



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

    ConstraintExportConfiguration constraintExportConfiguration = new ConstraintExportConfiguration(true,true);

    //Setting AbstractDomainConfiguration
    AbstractDomainExportConfiguration abstractDomainExportConfiguration = new AbstractDomainExportConfiguration(true, true, true, false, false, false, true, false, true, true, false, true, true, false, true, true, true, deltaConfiguration);


    // Setting DatatypeExportConfiguration
    DatatypeExportConfiguration datatypeExportConfiguration = new DatatypeExportConfiguration(defaultConfiguration);
    datatypeExportConfiguration.setBinding(true);
    datatypeExportConfiguration.setPurposeAndUse(true);
    datatypeExportConfiguration.setConstraintExportConfiguration(constraintExportConfiguration);
    datatypeExportConfiguration.setDeltaMode(true);
    datatypeExportConfiguration.setDeltaConfig(deltaConfiguration);

    // Setting SegmentExportConfiguration
    SegmentExportConfiguration segmentExportConfiguration = new SegmentExportConfiguration(defaultConfiguration);
    segmentExportConfiguration.setDynamicMappingInfo(true);
    segmentExportConfiguration.setBinding(true);
    segmentExportConfiguration.setConstraintExportConfiguration(constraintExportConfiguration);
    segmentExportConfiguration.setDeltaMode(true);
    segmentExportConfiguration.setDeltaConfig(deltaConfiguration);

    // Setting ConformanceProfileExportConfiguration
    ConformanceProfileExportConfiguration conformanceProfileExportConfiguration = new ConformanceProfileExportConfiguration(defaultConfiguration);
    conformanceProfileExportConfiguration.setIdentifier(true);
    conformanceProfileExportConfiguration.setEvent(true);
    conformanceProfileExportConfiguration.setMessageType(true);
    conformanceProfileExportConfiguration.setStructID(true);
    conformanceProfileExportConfiguration.setBinding(true);
    conformanceProfileExportConfiguration.setConstraintExportConfiguration(constraintExportConfiguration);
    conformanceProfileExportConfiguration.setDeltaMode(true);
    conformanceProfileExportConfiguration.setDeltaConfig(deltaConfiguration);
    conformanceProfileExportConfiguration.setListedColumns(listedColumns);
    //    conformanceProfileExportConfiguration.getMetadataConfig().setType(false);
    //    conformanceProfileExportConfiguration.getMetadataConfig().setRole(false);


    // Setting ValueSetExportConfiguration
    ValueSetExportConfiguration valueSetExportConfiguration = new ValueSetExportConfiguration(defaultConfiguration);
    defaultConfiguration.setDatatypeExportConfiguration(datatypeExportConfiguration);
    defaultConfiguration.setConformamceProfileExportConfiguration(conformanceProfileExportConfiguration);
    defaultConfiguration.setValueSetExportConfiguration(valueSetExportConfiguration);
    defaultConfiguration.setSegmentExportConfiguration(segmentExportConfiguration);
    defaultConfiguration.setAbstractDomainExportConfiguration(abstractDomainExportConfiguration);
    defaultConfiguration.setDeltaMode(true);
    defaultConfiguration.setDeltaConfig(deltaConfiguration);


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



  public DocumentMetadataConfiguration getDocumentMetadataConfiguration() {
    return DocumentMetadataConfiguration;
  }



  public void setDocumentMetadataConfiguration(DocumentMetadataConfiguration documentMetadataConfiguration) {
    DocumentMetadataConfiguration = documentMetadataConfiguration;
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



  public Columns getListedColumns() {
    return listedColumns;
  }

  public void setListedColumns(Columns listedColumns) {
    this.listedColumns = listedColumns;
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

  public boolean isDefaultConfig() {
    return defaultConfig;
  }

  public void setDefaultConfig(boolean defaultConfig) {
    this.defaultConfig = defaultConfig;
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

  public boolean isDeltaMode() {
    return deltaMode;
  }

  public void setDeltaMode(boolean deltaMode) {
    this.deltaMode = deltaMode;
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

  public DeltaConfiguration getDeltaConfig() {
    return deltaConfig;
  }



  public void setDeltaConfig(
      DeltaConfiguration deltaConfig) {
    this.deltaConfig = deltaConfig;
  }

  public String getConfigName() {
    return configName;
  }

  public void setConfigName(String configName) {
    this.configName = configName;
  }

  public boolean isOriginal() {
    return original;
  }

  public void setOriginal(boolean original) {
    this.original = original;
  }

}
